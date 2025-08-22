import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioRecording, AudioRecordingFilter, audioRecordingService } from '@/lib/services/audioRecordingService';
import { ArrowLeft, Edit, Play, Trash2, Download, Search, Filter, Lock, Unlock, Key, Mic, Library } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';
import CategorySelector from '../components/CategorySelector';
import SortSelector from '../components/SortSelector';

const AudioLibrary = () => {
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // Initialize with session_id from localStorage to show current session by default
  const [filter, setFilter] = useState<AudioRecordingFilter>(() => {
    // Only access localStorage after component is mounted (client-side)
    let sessionId;
    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem('tts_session_id');
    }
    return {
      sortBy: 'created_at',
      sortOrder: 'desc',
      session_id: sessionId || undefined // Show current session by default if available
    };
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<AudioRecording | null>(null);
  const [editingRecording, setEditingRecording] = useState<AudioRecording | null>(null);

  // States for key validation
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [hasAllRecordsAccess, setHasAllRecordsAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref để kiểm tra xem component đã mount chưa
  const isMounted = useRef(false);

  // Check for stored access permission on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAccess = localStorage.getItem('tts_all_records_access');
      if (storedAccess) {
        try {
          const accessData = JSON.parse(storedAccess);
          const expiryTime = accessData.expiry;

          // Check if the access permission is still valid
          if (expiryTime && new Date().getTime() < expiryTime) {
            setHasAllRecordsAccess(true);
          } else {
            // Clear expired permission
            localStorage.removeItem('tts_all_records_access');
          }
        } catch (error) {
          console.error('Error parsing stored access permission:', error);
          localStorage.removeItem('tts_all_records_access');
        }
      }
    }
  }, []);

  // Fetch recordings and categories on component mount
  useEffect(() => {
    // Đảm bảo localStorage chỉ được truy cập sau khi component đã mount
    if (!isMounted.current) {
      isMounted.current = true;
      // Không cần cập nhật filter ở đây vì đã mặc định hiển thị bản ghi của phiên hiện tại
      fetchRecordings();
      fetchCategories();
    } else {
      fetchRecordings();
      fetchCategories();
    }
  }, [filter]);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const data = await audioRecordingService.getUserRecordings(filter);
      setRecordings(data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load your audio library');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await audioRecordingService.getCategories();
      setCategories(['All', ...data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    setFilter({
      ...filter,
      searchTerm
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilter({
      ...filter,
      category: category === 'All' ? undefined : category
    });
  };

  // Thêm hàm để chuyển đổi giữa chỉ xem bản ghi của phiên hiện tại và tất cả bản ghi
  const handleSessionToggle = (showCurrentSession: boolean) => {
    // Nếu showCurrentSession là true, hiển thị bản ghi của phiên hiện tại
    // Nếu showCurrentSession là false, hiển thị tất cả bản ghi (cần có quyền truy cập)
    const sessionId = localStorage.getItem('tts_session_id');

    if (!showCurrentSession && !hasAllRecordsAccess) {
      // Nếu người dùng muốn xem tất cả bản ghi nhưng chưa có quyền
      setShowKeyDialog(true);
      return;
    }

    setFilter({
      ...filter,
      session_id: showCurrentSession ? sessionId || undefined : undefined
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      'created_at' | 'title' | 'duration',
      'asc' | 'desc'
    ];
    setFilter({
      ...filter,
      sortBy,
      sortOrder
    });
  };

  const handleDeleteRecording = async (id: string) => {
    try {
      await audioRecordingService.deleteRecording(id);
      setRecordings(recordings.filter(rec => rec.id !== id));
      toast.success('Recording deleted successfully');
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  };

  const handleUpdateRecording = async () => {
    if (!editingRecording || !editingRecording.id) return;

    try {
      const updated = await audioRecordingService.updateRecording(
        editingRecording.id,
        {
          title: editingRecording.title,
          description: editingRecording.description,
          category: editingRecording.category
        }
      );

      if (updated) {
        setRecordings(recordings.map(rec =>
          rec.id === updated.id ? updated : rec
        ));
        setEditingRecording(null);
        toast.success('Recording updated successfully');
      }
    } catch (error) {
      console.error('Error updating recording:', error);
      toast.error('Failed to update recording');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Function to validate the access key
  const validateAccessKey = () => {
    const validKey = '281010'; // Default key
    setIsSubmitting(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      if (accessKey === validKey) {
        setHasAllRecordsAccess(true);
        setShowKeyDialog(false);
        setAccessKey('');

        // Store access permission in localStorage with 24-hour expiry
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
        localStorage.setItem('tts_all_records_access', JSON.stringify({
          granted: true,
          expiry: expiryTime
        }));

        // Update filter to show all recordings
        setFilter({
          ...filter,
          session_id: undefined
        });

        toast.success('Access granted! Now showing all recordings.', {
          description: 'Your access will expire in 24 hours.',
          duration: 5000
        });
      } else {
        toast.error('Invalid key. Access denied.', {
          description: 'Please try again with the correct key.',
          duration: 3000
        });
      }
      setIsSubmitting(false);
    }, 600); // 600ms delay for better UX
  };

  // Handle Enter key press in the access key input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting) {
      validateAccessKey();
    }
  };

  // Function to revoke access to all recordings
  const revokeAccess = () => {
    setHasAllRecordsAccess(false);
    localStorage.removeItem('tts_all_records_access');

    // Switch back to current session view
    const sessionId = localStorage.getItem('tts_session_id');
    setFilter({
      ...filter,
      session_id: sessionId || undefined
    });

    toast.info('Access to all recordings has been revoked.');
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 sm:mb-6 flex justify-between items-center">
            <Button asChild variant="ghost" className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white hover:text-white shadow-md hover:shadow-lg transition-all duration-200">
              <Link to="/text-to-speech">
                <ArrowLeft className="h-4 w-4" />
                Back to Text-to-Speech
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow">
              <Link to="/text-to-speech">
                <Mic className="h-4 w-4 mr-2" />
                Create New Recording
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 mr-3 sm:mr-4 bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
                <Library className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Your Audio Library</span>
                <div className="text-xs sm:text-sm text-gray-500 font-normal mt-1">Manage and play your saved recordings</div>
              </div>
            </h1>

            <div className="mb-6">
              <div className="mb-6">
                <Label htmlFor="search-input" className="mb-2 block text-sm font-medium text-blue-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Recordings
                </Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Input
                      id="search-input"
                      placeholder="Search by title, description or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                  </div>
                  <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="w-full">
                  <Label htmlFor="category-filter" className="mb-2 block text-sm font-medium text-blue-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Category
                  </Label>
                  <CategorySelector
                    categories={categories.filter(cat => cat !== 'All')}
                    selectedCategory={filter.category}
                    onSelectCategory={handleCategoryChange}
                  />
                </div>

                <div className="w-full">
                  <Label htmlFor="sort-filter" className="mb-2 block text-sm font-medium text-blue-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Sort By
                  </Label>
                  <SortSelector
                    selectedSort={`${filter.sortBy || 'created_at'}-${filter.sortOrder || 'desc'}`}
                    onSelectSort={handleSortChange}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800 flex items-center gap-1">
                      {filter.session_id ? 'Current Session Recordings' : (
                        <>
                          All Recordings
                          {hasAllRecordsAccess && (
                            <div className="flex items-center gap-1">
                              <Unlock className="h-3.5 w-3.5 text-green-600" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  revokeAccess();
                                }}
                                className="text-xs text-red-500 hover:text-red-700 ml-2 underline"
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-xs text-blue-600">
                      {filter.session_id ? 'Showing recordings from your current session only' : 'Showing recordings from all sessions'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSessionToggle(filter.session_id === undefined)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center gap-1"
                >
                  {filter.session_id ? (
                    <>
                      {!hasAllRecordsAccess && <Lock className="h-3 w-3 mr-1" />}
                      Show All Recordings
                    </>
                  ) : (
                    <>Show Only Current Session</>
                  )}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : recordings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-600 mb-2">No recordings found</h3>
                <p className="text-gray-500 mb-4">You haven't created any audio recordings yet or none match your search criteria.</p>
                <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
                  <Link to="/text-to-speech">Create Your First Recording</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recordings.map((recording) => (
                  <Card key={recording.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="pb-3 border-b border-blue-50">
                      <div className="flex justify-between items-start mb-1">
                        <CardTitle className="truncate text-blue-800">{recording.title}</CardTitle>
                        <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {recording.category || 'Uncategorized'}
                        </div>
                      </div>
                      <CardDescription className="flex justify-between items-center">
                        <span className="text-xs flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(recording.created_at || '')}
                        </span>
                        <span className="text-xs flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {recording.duration ? `${Math.floor(recording.duration / 60)}:${(recording.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 pb-3">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{recording.description || 'No description'}</p>
                      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 group cursor-pointer shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 rounded-lg">
                          <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="h-5 w-5" />
                          </div>
                        </div>
                        <audio
                          controls
                          className="w-full h-10 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity"
                          src={recording.public_url}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            {recording.voice}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {recording.speed}x
                          </span>
                        </div>
                        <span className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                              onClick={() => setSelectedRecording(recording)}>
                          View details
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3 flex justify-between border-t border-blue-50">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                          onClick={() => setEditingRecording(recording)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                          onClick={() => window.open(recording.public_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                        onClick={() => handleDeleteRecording(recording.id || '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Recording Dialog */}
            {editingRecording && (
              <Dialog open={!!editingRecording} onOpenChange={(open) => !open && setEditingRecording(null)}>
                <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-blue-50 border-blue-100">
                  <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-blue-800 flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Edit Recording
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                      Update the details of your audio recording.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-5">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-medium text-blue-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={editingRecording.title}
                        onChange={(e) => setEditingRecording({...editingRecording, title: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                        placeholder="Enter a descriptive title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="text-sm font-medium text-blue-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={editingRecording.category || ''}
                        onChange={(e) => setEditingRecording({...editingRecording, category: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                        placeholder="E.g., Narration, Podcast, Tutorial"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description" className="text-sm font-medium text-blue-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={editingRecording.description || ''}
                        onChange={(e) => setEditingRecording({...editingRecording, description: e.target.value})}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 min-h-[100px]"
                        placeholder="Add a description of this audio recording"
                      />
                    </div>
                  </div>
                  <DialogFooter className="border-t border-blue-100 pt-4 gap-3">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                      onClick={() => setEditingRecording(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={handleUpdateRecording}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Audio Player Dialog */}
            {selectedRecording && (
              <Dialog open={!!selectedRecording} onOpenChange={(open) => !open && setSelectedRecording(null)}>
                <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-blue-50 border-blue-100">
                  <DialogHeader className="border-b border-blue-100 pb-4">
                    <div className="flex justify-between items-center">
                      <DialogTitle className="text-blue-800 text-xl">{selectedRecording.title}</DialogTitle>
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {selectedRecording.category || 'Uncategorized'}
                      </div>
                    </div>
                    <DialogDescription className="mt-2">
                      {selectedRecording.description || 'No description'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 shadow-inner">
                      <audio
                        controls
                        className="w-full h-12"
                        src={selectedRecording.public_url}
                        autoPlay
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50">
                        <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Audio Details
                        </h3>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between items-center py-1 border-b border-gray-100">
                            <span className="text-gray-600 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                              Voice:
                            </span>
                            <span className="font-medium text-blue-700">{selectedRecording.voice}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-gray-100">
                            <span className="text-gray-600 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Speed:
                            </span>
                            <span className="font-medium text-blue-700">{selectedRecording.speed}x</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-gray-100">
                            <span className="text-gray-600 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Duration:
                            </span>
                            <span className="font-medium text-blue-700">
                              {selectedRecording.duration ? `${Math.floor(selectedRecording.duration / 60)}:${(selectedRecording.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-gray-600 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Created:
                            </span>
                            <span className="font-medium text-blue-700">{formatDate(selectedRecording.created_at || '')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50 flex flex-col">
                        <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Actions
                        </h3>
                        <div className="flex flex-col gap-2 flex-grow justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 justify-start"
                            onClick={() => window.open(selectedRecording.public_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Audio
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 justify-start"
                            onClick={() => setEditingRecording(selectedRecording)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 justify-start mt-auto"
                            onClick={() => {
                              handleDeleteRecording(selectedRecording.id || '');
                              setSelectedRecording(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Recording
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50">
                      <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Original Text
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md text-sm max-h-40 overflow-y-auto shadow-inner">
                        {selectedRecording.text_content}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="border-t border-blue-100 pt-4">
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => setSelectedRecording(null)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Access Key Dialog */}
            <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
              <DialogContent className="sm:max-w-[400px] bg-gradient-to-br from-white to-blue-50 border-blue-100">
                <DialogHeader className="border-b border-blue-100 pb-4">
                  <DialogTitle className="text-blue-800 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Access Required
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    Enter the access key to view all recordings.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 flex items-start gap-2">
                      <Key className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>You need a valid access key to view recordings from all sessions.</p>
                        <p className="mt-1 text-xs text-blue-500">Hint: The default key is a 6-digit number.</p>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="access-key" className="text-sm font-medium text-blue-700">
                        Access Key
                      </Label>
                      <Input
                        id="access-key"
                        type="password"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                        placeholder="Enter access key"
                        disabled={isSubmitting}
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="border-t border-blue-100 pt-4 gap-3">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    onClick={() => setShowKeyDialog(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={validateAccessKey}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2" />
                        Unlock Access
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AudioLibrary;
