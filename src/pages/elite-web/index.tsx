import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Removed unused imports from react-icons/fa
import { Globe, ArrowLeft, Plus, Search, Filter, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import WebsiteList from './components/WebsiteList';
import CategoryFilter from './components/CategoryFilter';
import SubmitWebsiteForm from './components/SubmitWebsiteForm';
import { supabase } from '@/lib/supabaseClient';
import Footer from '@/components/Footer';

const EliteWeb: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
        .from('elite_web_categories')
        .select('*')
        .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col bg-fixed">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 sm:mb-6">
            <Button asChild variant="ghost" className="mb-4 sm:mb-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="bg-white/90 rounded-2xl p-4 sm:p-8 shadow-xl max-w-5xl mx-auto backdrop-blur-sm border border-indigo-100 hover:border-indigo-200 transition-all duration-300">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 mr-3 sm:mr-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    <Sparkles className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 text-white bg-indigo-500 rounded-full p-0.5 shadow-lg animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Elite Web</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Discover and share the best websites across the internet</p>
                </div>
              </div>
              <Button
                onClick={() => setShowSubmitForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                Submit Website
              </Button>
            </div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="border border-indigo-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search websites..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow bg-white h-10"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
                      </div>
                    </div>
                    <div className="w-full md:w-64">
                      <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Website List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WebsiteList
                searchQuery={searchQuery}
                categoryId={selectedCategory}
              />
            </motion.div>

            {/* Submit Website Modal */}
            {showSubmitForm && (
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-indigo-100"
                >
                  <SubmitWebsiteForm
                    categories={categories}
                    onClose={() => setShowSubmitForm(false)}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default EliteWeb;