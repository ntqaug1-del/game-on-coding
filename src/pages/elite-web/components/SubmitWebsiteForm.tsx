import React, { useState, useRef, useEffect } from 'react';
import { X, Globe, Link as LinkIcon, FileText, FolderTree, AlertCircle, CheckCircle2, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import CategorySelector from './CategorySelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

interface Category {
  id: string;
  name: string;
}

interface SubmitWebsiteFormProps {
  categories: Category[];
  onClose: () => void;
}

const SubmitWebsiteForm: React.FC<SubmitWebsiteFormProps> = ({ categories, onClose }) => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    description: '',
    categoryId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // For demo purposes, we'll skip authentication check
    // and use a placeholder user ID
    const demoUserId = '00000000-0000-0000-0000-000000000000';

    try {
      const { error: submitError } = await supabase
        .from('elite_web_websites')
        .insert({
          url: formData.url,
          name: formData.name,
          description: formData.description,
          category_id: formData.categoryId,
          submitted_by: demoUserId,
          status: 'approved', // Auto-approve for demo
          views_count: 0,
          votes_count: 0
        });

      if (submitError) {
        setError(submitError.message);
        return;
      }

      // If successful, set success state
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting website:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg shadow-md mr-3">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Submit a Website</h2>
            <p className="text-sm text-gray-500 mt-0.5">Share your favorite website with the community</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800 rounded-lg shadow-sm animate-in slide-in-from-top-5 duration-300">
          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 rounded-lg shadow-sm animate-in slide-in-from-top-5 duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
          <AlertDescription>Website submitted successfully! It will be reviewed by our team.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 text-indigo-500 mr-2" />
            <Label htmlFor="url" className="font-medium text-gray-700">
              Website URL
            </Label>
          </div>
          <Input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow bg-white"
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <Globe className="h-4 w-4 text-indigo-500 mr-2" />
            <Label htmlFor="name" className="font-medium text-gray-700">
              Website Name
            </Label>
          </div>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 h-10 px-3 py-2 rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow bg-white"
            placeholder="Enter website name"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-indigo-500 mr-2" />
            <Label htmlFor="description" className="font-medium text-gray-700">
              Description
            </Label>
          </div>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 resize-none rounded-lg shadow-sm transition-all hover:border-indigo-300 hover:shadow bg-white p-3"
            placeholder="Describe what this website is about..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <FolderTree className="h-4 w-4 text-indigo-500 mr-2" />
            <Label htmlFor="categoryId" className="font-medium text-gray-700">
              Category
            </Label>
          </div>
          <CategorySelector
            categories={categories}
            selectedCategoryId={formData.categoryId}
            onSelectCategory={(value) => handleSelectChange(value, 'categoryId')}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-indigo-100 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg px-5 py-2 h-auto font-medium transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] rounded-lg px-5 py-2 h-auto font-medium"
          >
            <Globe className="h-4 w-4" />
            Submit Website
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitWebsiteForm;