import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaSearch, FaThumbsUp, FaComment } from 'react-icons/fa';

const EliteWebBlock: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="block-container bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => navigate('/elite-web')}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FaGlobe className="text-3xl" />
          <h2 className="text-2xl font-bold">Elite Web</h2>
        </div>
      </div>
      
      <p className="text-white/90 mb-4">
        Discover and share the best websites across various categories. Find useful resources, tools, and platforms for your needs.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="feature-item flex items-center space-x-2">
          <FaSearch className="text-xl" />
          <span>Search & Explore</span>
        </div>
        <div className="feature-item flex items-center space-x-2">
          <FaThumbsUp className="text-xl" />
          <span>Vote & Rate</span>
        </div>
        <div className="feature-item flex items-center space-x-2">
          <FaComment className="text-xl" />
          <span>Share & Discuss</span>
        </div>
        <div className="feature-item flex items-center space-x-2">
          <FaGlobe className="text-xl" />
          <span>Multiple Categories</span>
        </div>
      </div>
    </div>
  );
};

export default EliteWebBlock; 