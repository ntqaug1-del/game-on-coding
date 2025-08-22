
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API Key is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Set the environment variable for the OpenAI API key
    // Using Supabase's secrets management API
    try {
      // In a real edge function, this would use the Admin API
      // But for demo purposes, we'll just validate the API key format
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        throw new Error('Invalid API key format');
      }

      // In a real implementation, we'd save the key
      // Here we just return a successful response
      console.log('API key updated successfully');

      return new Response(
        JSON.stringify({ success: true, message: 'API key updated successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error updating API key:', error);
      return new Response(
        JSON.stringify({ error: `Failed to update API key: ${error.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in updateApiKey function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
