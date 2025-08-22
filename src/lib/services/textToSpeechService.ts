
import { supabase } from "@/integrations/supabase/client";
import { audioRecordingService } from "./audioRecordingService";

export interface TextToSpeechRequest {
  text: string;
  voice: string;
  speed: number;
}

export interface TextToSpeechResponse {
  audioUrl: string;
  filename: string;
  storagePath: string;
}

export const textToSpeech = async (params: TextToSpeechRequest): Promise<TextToSpeechResponse> => {
  try {
    console.log('Calling textToSpeech edge function with params:', params);

    // Validate text input before sending to prevent empty requests
    if (!params.text || params.text.trim().length === 0) {
      throw new Error('Text is required and cannot be empty');
    }

    // Trim the input text to avoid excessively long content
    const trimmedText = params.text.trim();

    // Ensure all required parameters are set
    const requestBody = {
      text: trimmedText,
      voice: params.voice || 'alloy',
      speed: typeof params.speed === 'number' ? params.speed : 1.0
    };

    // Log the request body but truncate lengthy text for readability
    console.log('Sending request body:', JSON.stringify({
      ...requestBody,
      text: requestBody.text.length > 50 ? requestBody.text.substring(0, 50) + "..." : requestBody.text
    }));

    // Call the Supabase Edge Function with the text-to-speech parameters
    const { data, error } = await supabase.functions.invoke('textToSpeech', {
      body: requestBody,
    });

    if (error) {
      console.error('Error from edge function:', error);

      // Provide specific error messages for different error types
      if (error.message && error.message.includes('Failed to send a request')) {
        throw new Error('Cannot connect to the Text-to-Speech service. Please check your network connection or try again later.');
      } else if (error.name === 'FunctionsFetchError') {
        throw new Error('Failed to connect to the Text-to-Speech service. The Edge Function may not be deployed or is unavailable.');
      } else if (error.message && error.message.includes('non-2xx status code')) {
        throw new Error('The Text-to-Speech service returned an error. Please check the Edge Function logs for details.');
      } else {
        throw new Error(error.message || 'Error calling text-to-speech service');
      }
    }

    if (!data) {
      console.error('No data returned from the service');
      throw new Error('No data returned from the service');
    }

    // Check for error message in the response
    if (data.error) {
      console.error('Error in edge function response:', data.error);
      throw new Error(data.error);
    }

    // Process base64 audio data
    if (!data.audioData) {
      console.error('No audio data returned from the service');
      throw new Error('No audio data returned from the service');
    }

    // Create an object URL from the base64 data for immediate playback
    const audioBlob = base64ToBlob(data.audioData, data.contentType || 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);

    // Generate a unique filename if not provided
    const filename = data.filename || `speech_${Date.now()}.mp3`;

    // Upload the audio file to Supabase Storage
    const filePath = `generated/${filename}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filePath, audioBlob, {
        contentType: 'audio/mpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      // Still return the audio URL for playback even if storage upload fails
      return {
        audioUrl,
        filename,
        storagePath: '' // Empty if upload failed
      };
    }

    // Get the public URL
    const publicUrl = supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath).data.publicUrl;

    // Save recording metadata to database
    try {
      // Get session ID from localStorage or create a new one if it doesn't exist
      let sessionId;
      try {
        sessionId = localStorage.getItem('tts_session_id');
        if (!sessionId) {
          sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('tts_session_id', sessionId);
        }
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      }

      // Try to get user if logged in (optional)
      const { data: { user } } = await supabase.auth.getUser();

      await audioRecordingService.saveRecording({
        user_id: user?.id || 'anonymous',
        title: filename.replace('.mp3', '').replace(/_/g, ' '),
        description: params.text.substring(0, 100) + (params.text.length > 100 ? '...' : ''),
        category: 'Generated',
        file_path: filePath,
        public_url: publicUrl,
        voice: params.voice,
        speed: params.speed,
        text_content: params.text,
        // Estimate duration based on word count and speed
        duration: Math.round(params.text.split(/\s+/).length * 0.5 / params.speed),
        session_id: sessionId
      });
    } catch (recordingError) {
      console.error('Error saving recording metadata:', recordingError);
      // Don't throw error here to still return the audio URL
    }

    console.log('Successfully generated speech and uploaded to storage:', uploadData?.path);
    return {
      audioUrl, // Local object URL for immediate playback
      filename,
      storagePath: uploadData?.path || ''
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
};

// Helper function to convert base64 to Blob
function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
