import React, { useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, AnimatePresence } from 'framer-motion';

// Import tab components
import FootballTab from './FootballTab';
import TravelTab from './TravelTab';
import GamingTab from './GamingTab';

// Custom styles for slick dots
const customDotStyles = `
  .slick-dots {
    bottom: -40px;
    display: flex !important;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .slick-dots li {
    width: 30px;
    height: 4px;
    margin: 0;
  }

  .slick-dots li button {
    width: 100%;
    height: 100%;
    padding: 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .slick-dots li.slick-active button {
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    transform: scaleX(1.2);
  }

  .slick-dots li button:before {
    display: none;
  }

  .slick-dots li:hover button {
    background: linear-gradient(to right, #60a5fa, #a78bfa);
  }
`;

const LifeOutsideProgramming = () => {
  const [activeTab, setActiveTab] = useState('football');
  const [selectedImage, setSelectedImage] = useState(null);

  // Add style tag for custom dots
  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = customDotStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const tabContent = {
    football: {
      title: "Football Enthusiast",
      description: "Passionate about football, capturing memorable moments on and off the field.",
      icon: "⚽",
    },
    travel: {
      title: "World Explorer",
      description: "Exploring new cultures and creating unforgettable travel experiences.",
      icon: "✈️",
    },
    gaming: {
      title: "Gaming Enthusiast",
      description: "Enjoying strategic games and connecting with friends through gaming.",
      icon: "🎮",
    },
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">My life</h3>
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          {Object.keys(tabContent).map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="text-2xl">{tabContent[tab].icon}</span>
              <span className="font-semibold">{tabContent[tab].title}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content Container */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">{tabContent[activeTab].title}</h4>
            <p className="text-gray-600">{tabContent[activeTab].description}</p>
          </div>

          {/* Render appropriate tab content */}
          {activeTab === 'football' && <FootballTab handleImageClick={handleImageClick} />}
          {activeTab === 'travel' && <TravelTab handleImageClick={handleImageClick} />}
          {activeTab === 'gaming' && <GamingTab />}
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white rounded-b-lg">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-sm opacity-90">{selectedImage.description}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LifeOutsideProgramming;