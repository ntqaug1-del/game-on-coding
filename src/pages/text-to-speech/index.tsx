import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Link} from 'react-router-dom';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {AlertCircle, CloudUpload, Download, ExternalLink, Mic, Play, ArrowLeft, Library} from 'lucide-react';
import {toast} from 'sonner';
import {textToSpeech} from '@/lib/services/textToSpeechService';
import {TextToSpeechIcon} from '@/components/icons/TextToSpeechIcon';
import {supabase} from '@/integrations/supabase/client';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import Footer from '@/components/Footer';
import VoiceSelector from './components/VoiceSelector';
import SpeedSelector from './components/SpeedSelector';

// Form validation schema
const formSchema = z.object({
  text: z.string()
    .min(1, "Text is required"),
  voice: z.string().default("alloy"),
  speed: z.number().min(0.5).max(2.0).default(1.0)
});

type FormValues = z.infer<typeof formSchema>;

const TextToSpeech = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'api-key' | 'connection' | 'other' | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: 'alloy',
      speed: 1.0
    }
  });

  // Get public URL for stored file when storagePath changes
  useEffect(() => {
    if (storagePath) {
      const { data } = supabase.storage
        .from('audio-files')
        .getPublicUrl(storagePath);

      if (data?.publicUrl) {
        setPublicUrl(data.publicUrl);
      }
    }
  }, [storagePath]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    form.setValue('text', text);
  };

  const loadingMessages = [
    "Processing your text...",
    "Generating natural voice...",
    "Optimizing audio...",
    "Preparing speech...",
    "Finalizing AI voice..."
  ];

  const startLoadingAnimation = (text: string) => {
    let index = 0;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    const baseInterval = 1000;
    const additionalTime = Math.floor(wordCount / 50) * 200;
    const intervalTime = Math.min(baseInterval + additionalTime, 3000);

    const interval = setInterval(() => {
      if (index < loadingMessages.length - 1) {
        setLoadingMessage(loadingMessages[index]);
        index++;
      } else {
        setLoadingMessage(loadingMessages[loadingMessages.length - 1]);
      }
    }, intervalTime);

    return interval;
  };

  const onSubmit = async (values: FormValues) => {
    if (isGenerating) {
      toast('Processing previous request, please wait...', {
        className: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
        icon: '⏳',
        duration: 3000
      });
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setStoragePath(null);
    setPublicUrl(null);
    setFilename(null);
    setErrorMessage(null);
    setErrorType(null);
    const loadingInterval = startLoadingAnimation(values.text);

    try {
      const params = {
        text: values.text,
        voice: values.voice,
        speed: values.speed
      };

      const response = await textToSpeech(params);
      setAudioUrl(response.audioUrl);
      setFilename(response.filename);

      if (response.storagePath) {
        setStoragePath(response.storagePath);
        toast('Speech generated and stored successfully!', {
          className: 'bg-green-50 text-green-800 border border-green-200',
          icon: '🎉',
          duration: 4000
        });
      } else {
        toast('Speech generated successfully, but could not be stored.', {
          className: 'bg-blue-50 text-blue-800 border border-blue-200',
          icon: 'ℹ️',
          duration: 4000
        });
      }

    } catch (error: any) {
      console.error('Error generating audio:', error);

      // Display specific error message
      const errorMsg = error.message || 'An error occurred. Please try again.';
      setErrorMessage(errorMsg);

      // Categorize error for UI display
      if (errorMsg.includes('quota') || errorMsg.includes('billing') || errorMsg.includes('API key')) {
        setErrorType('api-key');
        toast('API quota exceeded or invalid API key.', {
          className: 'bg-red-50 text-red-800 border border-red-200',
          icon: '🔑',
          duration: 5000
        });
      } else if (errorMsg.includes('connect') || errorMsg.includes('network') || errorMsg.includes('unavailable') || errorMsg.includes('Failed to send')) {
        setErrorType('connection');
        toast('Unable to connect to Text-to-Speech service.', {
          className: 'bg-red-50 text-red-800 border border-red-200',
          icon: '🔌',
          duration: 5000
        });
      } else {
        setErrorType('other');
        toast(errorMsg, {
          className: 'bg-red-50 text-red-800 border border-red-200',
          icon: '❌',
          duration: 5000
        });
      }
    } finally {
      clearInterval(loadingInterval);
      setIsGenerating(false);
      setLoadingMessage('');
    }
  };

  const handleDownload = () => {
    if (publicUrl) {
      // Use the public URL from storage if available
      window.open(publicUrl, '_blank');
      toast('Downloading from storage!', {
        className: 'bg-blue-50 text-blue-800 border border-blue-200',
        icon: '⬇️',
        duration: 3000
      });
    } else if (audioUrl) {
      // Fallback to the local object URL if storage URL is not available
      try {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = filename || `ai-speech-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast('Audio downloaded successfully!', {
          className: 'bg-green-50 text-green-800 border border-green-200',
          icon: '✅',
          duration: 3000
        });
      } catch (error) {
        console.error('Download error:', error);
        toast('Error downloading audio file', {
          className: 'bg-red-50 text-red-800 border border-red-200',
          icon: '❌',
          duration: 4000
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 sm:mb-6 flex justify-between items-center">
            <Button asChild variant="ghost" className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white hover:text-white shadow-md hover:shadow-lg transition-all duration-200">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline" className="gap-2 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow">
              <Link to="/text-to-speech/library">
                <Library className="h-4 w-4 mr-2" />
                My Audio Library
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 mr-3 sm:mr-4 bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
                <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Text to Speech</span>
                <div className="text-xs sm:text-sm text-gray-500 font-normal mt-1">Convert your text to natural-sounding speech</div>
              </div>
            </h1>

            {errorMessage && (
              <Alert variant={errorType === 'connection' ? "destructive" : "default"} className="mb-4 sm:mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{errorType === 'api-key' ? 'API Key Error' : errorType === 'connection' ? 'Connection Error' : 'Error'}</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{errorMessage}</p>

                    {errorType === 'connection' && (
                      <div className="mt-4 space-y-2 text-sm">
                        <p className="font-medium">Troubleshooting Steps:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Check your internet connection</li>
                          <li>Verify the Supabase Edge Function is deployed correctly</li>
                          <li>Make sure the <code>textToSpeech</code> function is enabled in your Supabase project</li>
                          <li>Check your Supabase project's CORS configuration</li>
                        </ol>
                        <p className="mt-2">
                          If you're a developer, check the Edge Function logs in your Supabase dashboard for more details.
                        </p>
                      </div>
                    )}

                    {errorType === 'api-key' && (
                      <p className="mt-2">
                        The OpenAI API quota has been exceeded or the API key is invalid. Please update your API key below.
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-8">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-2 block text-sm font-medium text-blue-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Your Text
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Enter your text here..."
                            className="h-32 sm:h-40 text-base p-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                            {...field}
                            onChange={handleTextChange}
                          />
                          <div className="absolute bottom-2 right-2 text-xs sm:text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                            {wordCount} words
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-blue-700 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          AI Voice
                        </FormLabel>
                        <FormControl>
                          <VoiceSelector
                            selectedVoice={field.value}
                            onSelectVoice={(voice) => field.onChange(voice)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="speed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2 block text-sm font-medium text-blue-700 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Speech Speed
                        </FormLabel>
                        <FormControl>
                          <SpeedSelector
                            selectedSpeed={field.value}
                            onSelectSpeed={(speed) => field.onChange(speed)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className={`w-full h-12 text-base rounded-lg shadow-md transition-all duration-200 transform ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed opacity-75'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg'
                  }`}
                  disabled={isGenerating}
                  onClick={(e) => {
                    if (isGenerating) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="relative">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="text-sm">{loadingMessage}</span>
                    </div>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Generate Speech
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="mt-2 sm:mt-4 text-center">
                    <div className="inline-block animate-pulse text-blue-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </Form>

            {audioUrl && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-blue-800 flex items-center">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                      <Mic className="h-4 w-4 text-blue-600" />
                    </div>
                    Generated Audio
                  </h2>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Ready to play</span>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-inner mb-3 border border-blue-50">
                  <audio
                    controls
                    className="w-full"
                    src={audioUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {storagePath && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg text-xs border border-blue-100">
                    <div className="flex items-center text-blue-700">
                      <CloudUpload size={14} className="mr-1" />
                      <span className="font-medium">Saved to Supabase Storage</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download size={16} />
                  <span>Download Audio</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TextToSpeech;
