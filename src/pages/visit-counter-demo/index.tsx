import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UniqueVisitCounter from '@/components/UniqueVisitCounter';

const VisitCounterDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Visit Counter Variants</h1>
            <p className="text-lg text-gray-600">
              Different styles for displaying visitor statistics on your website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardHeader>
                <CardTitle>Card Variant</CardTitle>
                <CardDescription>
                  A detailed card showing visitor statistics with icons and labels
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <UniqueVisitCounter 
                  pageName="home" 
                  variant="card" 
                  incrementOnMount={false}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pill Variant</CardTitle>
                <CardDescription>
                  Compact pill-shaped badges for visitor statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <UniqueVisitCounter 
                  pageName="home" 
                  variant="pill" 
                  incrementOnMount={false}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Minimal Variant</CardTitle>
              <CardDescription>
                A simple text-based counter for minimal interfaces
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <UniqueVisitCounter 
                pageName="home" 
                variant="minimal" 
                incrementOnMount={false}
              />
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Implementation Details</h2>
            <div className="prose max-w-none">
              <p>
                This visit counter tracks unique visitors based on IP address, with each IP only counted once per day.
                The data is stored in Supabase and can be easily integrated into any page of your application.
              </p>
              <h3>Usage Example:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {`<UniqueVisitCounter 
  pageName="home" 
  variant="pill" 
  showToday={true}
  showAnimation={true} 
/>`}
              </pre>
              <h3>Available Props:</h3>
              <ul>
                <li><code>pageName</code>: Identifier for the page (required)</li>
                <li><code>variant</code>: Display style - 'minimal', 'pill', or 'card' (default: 'card')</li>
                <li><code>showToday</code>: Whether to show today's visit count (default: true)</li>
                <li><code>incrementOnMount</code>: Whether to increment the counter when component mounts (default: true)</li>
                <li><code>showAnimation</code>: Whether to animate the counter when it appears (default: true)</li>
                <li><code>className</code>: Additional CSS classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCounterDemo;
