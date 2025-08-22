
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Handle CORS preflight requests
function handleCorsPreflightRequest(req: Request) {
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

// Parse and validate the request body
async function parseRequestBody(req: Request) {
  try {
    console.log('Received text-to-speech request');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Extract request body as text
    const bodyText = await req.text();
    console.log('Raw request body length:', bodyText.length);
    
    if (!bodyText || bodyText.trim().length === 0) {
      console.error('Empty request body received');
      throw new Error('Request body is empty');
    }
    
    // Parse as JSON
    try {
      const parsedData = JSON.parse(bodyText);
      console.log('Successfully parsed JSON data');
      
      const { text, voice, speed } = parsedData;
      
      if (!text) {
        console.error('Missing required parameter: text');
        throw new Error('Text is required');
      }
      
      return { text, voice, speed };
    } catch (parseError) {
      console.error('Error parsing JSON request:', parseError);
      throw new Error('Invalid JSON in request body: ' + parseError.message);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    throw error;
  }
}

// Validate environment variables
function validateEnvironment() {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    console.error('OpenAI API key is not configured');
    throw new Error('OpenAI API key is not configured. Please add it to your Edge Function secrets.');
  }
  
  return { openaiApiKey };
}

// Call OpenAI API
async function generateSpeech(text: string, voice: string = 'alloy', speed: number = 1.0, apiKey: string) {
  console.log('Calling OpenAI API for text-to-speech with parameters:', { 
    text: text.substring(0, 30) + (text.length > 30 ? '...' : ''), 
    voice, 
    speed 
  });
  
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice || 'alloy',
      speed: typeof speed === 'number' ? speed : 1.0,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to generate speech';
    try {
      const errorData = await response.json();
      console.error('OpenAI API Error:', JSON.stringify(errorData));
      
      if (errorData.error && errorData.error.message) {
        if (errorData.error.message.includes('quota')) {
          errorMessage = 'OpenAI API quota exceeded. Please check your billing details.';
        } else if (errorData.error.message.includes('invalid')) {
          errorMessage = 'Invalid API key. Please check your OpenAI API key.';
        } else {
          errorMessage = errorData.error.message;
        }
      }
    } catch (jsonError) {
      console.error('Error parsing OpenAI error response:', jsonError);
      errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  console.log('Successfully received audio from OpenAI');
  return await response.arrayBuffer();
}

// Convert array buffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Main request handler
serve(async (req) => {
  try {
    // Handle CORS preflight
    const corsResponse = handleCorsPreflightRequest(req);
    if (corsResponse) return corsResponse;
    
    // Log request details
    console.log(`Request: ${req.method} ${req.url}`);
    
    // Parse and validate request
    const { text, voice, speed } = await parseRequestBody(req);
    
    // Check environment
    const { openaiApiKey } = validateEnvironment();
    
    // Generate speech
    const audioArrayBuffer = await generateSpeech(text, voice, speed, openaiApiKey);
    
    // Convert audio to base64
    const base64Audio = arrayBufferToBase64(audioArrayBuffer);
    
    // Generate a unique filename with timestamp and voice
    const filename = `speech_${Date.now()}_${voice}.mp3`;
    
    console.log('Successfully processed text-to-speech request');
    return new Response(
      JSON.stringify({ 
        audioData: base64Audio,
        contentType: 'audio/mpeg',
        format: 'base64',
        filename: filename
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in textToSpeech function:', error);
    
    // Set status code based on error type
    let statusCode = 500;
    if (error.message.includes('empty') || error.message.includes('Invalid') || error.message.includes('required')) {
      statusCode = 400;
    } else if (error.message.includes('API key') || error.message.includes('quota')) {
      statusCode = 403;
    }
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
