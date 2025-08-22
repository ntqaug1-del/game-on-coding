import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Eye, ExternalLink, Globe, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  category_id: string;
  views_count: number;
  votes_count: number;
  category: {
    name: string;
  };
}

interface WebsiteListProps {
  searchQuery: string;
  categoryId: string | null;
}

const WebsiteList: React.FC<WebsiteListProps> = ({ searchQuery, categoryId }) => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchWebsites();
  }, [searchQuery, categoryId, page]);

  const fetchWebsites = async () => {
    setLoading(true);
    let query = supabase
      .from('elite_web_websites')
      .select(`
        *,
        category:elite_web_categories(name)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1);

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching websites:', error);
      return;
    }

    setWebsites(prev => page === 1 ? data : [...prev, ...data]);
    setHasMore(data.length === 10);
    setLoading(false);
  };

  const handleComment = () => {
    toast({
      title: "Comments Coming Soon",
      description: "The comment feature is currently under development and will be available soon!",
    });
  };

  const handleVote = async (websiteId: string) => {
    try {
      // For demo purposes, we'll skip authentication check
      // and use a placeholder user ID
      const demoUserId = '00000000-0000-0000-0000-000000000000';

      // First, get the current website to get its current vote count
      const { data: websiteData, error: fetchError } = await supabase
        .from('elite_web_websites')
        .select('votes_count')
        .eq('id', websiteId)
        .single();

      if (fetchError) {
        console.error('Error fetching website:', fetchError);
        return;
      }

      // Then increment the votes_count
      const newVoteCount = (websiteData?.votes_count || 0) + 1;

      const { error: updateError } = await supabase
        .from('elite_web_websites')
        .update({ votes_count: newVoteCount })
        .eq('id', websiteId);

      if (updateError) {
        console.error('Error updating vote count:', updateError);
        return;
      }

      // Then, record the vote in the votes table
      const { error } = await supabase
        .from('elite_web_votes')
        .upsert({ website_id: websiteId, user_id: demoUserId });

      if (error) {
        console.error('Error recording vote:', error);
        return;
      }

      // Refresh website list
      fetchWebsites();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="space-y-6">
      {websites.length === 0 && !loading ? (
        <Card className="border border-indigo-100 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-16 w-16 text-indigo-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No websites found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery ? `No results for "${searchQuery}"` : 'No websites available in this category yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        websites.map((website, index) => (
          <motion.div
            key={website.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm hover:bg-white hover:border-indigo-200 group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-2">
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 transition-colors flex items-center group-hover:text-indigo-600"
                        >
                          {website.name}
                          <ExternalLink className="h-4 w-4 ml-2 text-indigo-500 opacity-70 group-hover:opacity-100" />
                        </a>
                      </h3>
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 shadow-sm">
                        {website.category.name}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-2">{website.description}</p>
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-full text-gray-600 text-xs font-medium">
                        <Eye className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>{website.views_count} views</span>
                      </span>
                      <span className="flex items-center bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-600 text-xs font-medium">
                        <ThumbsUp className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                        <span>{website.votes_count} votes</span>
                      </span>
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center bg-white border border-indigo-200 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm hover:shadow group-hover:bg-indigo-50"
                      >
                        <Link2 className="h-3.5 w-3.5 mr-1" />
                        <span>Visit Website</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVote(website.id)}
                            className="h-9 w-9 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <ThumbsUp className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Vote for this website</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleComment}
                            className="h-9 w-9 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow"
                          >
                            <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comment (Coming soon)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-600 mx-auto shadow-md"></div>
          <p className="text-indigo-600 mt-4 font-medium">Loading websites...</p>
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-6">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] rounded-full px-6 py-2.5 font-medium"
          >
            <span className="mr-2">Load More Websites</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebsiteList;