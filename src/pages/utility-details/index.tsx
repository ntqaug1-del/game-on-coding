import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { utilities } from '@/data/utilities';
import { Button } from '@/components/ui/button';

const UtilityDetails = () => {
  const { id } = useParams();
  const utilityId = parseInt(id || '0', 10);
  
  const utility = utilities.find(u => u.id === utilityId);
  
  // Redirect to Voice Gallery page for id 7
  if (utilityId === 7) {
    return <Navigate to="/voice-gallery" replace />;
  }
  
  // Redirect to TextToSpeech page for id 8
  if (utilityId === 8) {
    return <Navigate to="/text-to-speech" replace />;
  }

  // Redirect to Meme Generator page for id 9
  if (utilityId === 9) {
    return <Navigate to="/meme-generator" replace />;
  }

  // Redirect to Spin Wheel page for id 10
  if (utilityId === 10) {
    return <Navigate to="/spin-wheel" replace />;
  }

  // Redirect to QR Code Generator page for id 15
  if (utilityId === 15) {
    return <Navigate to="/qr-code-generator" replace />;
  }

  // Redirect to Dice Roller page for id 16
  if (utilityId === 16) {
    return <Navigate to="/dice-roller" replace />;
  }

  // Redirect to Resume page for id 12
  if (utilityId === 12) {
    return <Navigate to="/resume" replace />;
  }

  // Redirect to Elite Web page for id 13
  if (utilityId === 13) {
    return <Navigate to="/elite-web" replace />;
  }

  // Redirect to Unit Converter page for id 14
  if (utilityId === 14) {
    return <Navigate to="/unit-converter" replace />;
  }

  // Redirect to Football Formation Builder page for id 17
  if (utilityId === 17) {
    return <Navigate to="/football-formation-builder" replace />;
  }

  // Redirect to AI Data Analysis page for id 18
  if (utilityId === 18) {
    return <Navigate to="/ai-data-analysis" replace />;
  }

  // Redirect to Student Ranking System page for id 19
  if (utilityId === 19) {
    return <Navigate to="/student-ranking" replace />;
  }
  
  if (!utility) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <h1 className="text-3xl font-bold mb-4">Utility Not Found</h1>
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/">← Back to Utilities</Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-md max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <img src={utility.icon} alt={utility.title} className="h-20 w-20 mr-4" />
            <h1 className="text-3xl font-bold text-gray-800">{utility.title}</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700">{utility.description}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {utility.id === 7 ? (
                <>
                  <li>Multiple voice styles to choose from</li>
                  <li>Different accents and dialects available</li>
                  <li>Customizable speech rate and pitch</li>
                  <li>Preview functionality before finalizing</li>
                </>
              ) : (
                <>
                  <li>Realistic talking avatars</li>
                  <li>Synchronization between speech and lip movements</li>
                  <li>Multiple avatar styles and appearances</li>
                  <li>Customizable backgrounds and settings</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="bg-purple-500 bg-opacity-10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-purple-700">Try it out</h2>
            <p className="text-gray-700 mb-4">
              {utility.id === 7 
                ? "Explore our collection of voices and find the perfect one for your application." 
                : "Create engaging content with lifelike talking avatars."}
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600">
              Start Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityDetails;
