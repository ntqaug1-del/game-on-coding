import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { travelDestinations, travelExperiences, travelTips } from './travelData';

interface TravelTabProps {
  handleImageClick: (image: any) => void;
}

const TravelTab: React.FC<TravelTabProps> = ({ handleImageClick }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Filter destinations by category
  const filteredDestinations = activeCategory === 'all' 
    ? travelDestinations 
    : travelDestinations.filter(dest => dest.category === activeCategory);

  // Get unique categories
  const categories = ['all', ...new Set(travelDestinations.map(dest => dest.category))];

  return (
    <div className="space-y-12">
      {/* Travel Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg"
        >
          <h5 className="text-xl font-semibold mb-4 text-gray-800">My Travel Philosophy</h5>
          <p className="text-gray-600 mb-4">
            Travel is more than just visiting new places; it's about immersing in different cultures, 
            creating lasting memories, and gaining new perspectives. I believe in responsible travel 
            that respects local communities and environments.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Adventure", "Culture", "Nature", "Food", "Photography"].map((interest, index) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -2, 2, -2, 0],
                  transition: { duration: 0.3 }
                }}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg"
        >
          <h5 className="text-xl font-semibold mb-4 text-gray-800">Travel Tips</h5>
          <ul className="space-y-3">
            {travelTips.map((tip) => (
              <motion.li
                key={tip.id}
                className="flex items-center gap-3 text-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(99, 102, 241, 0.1)"
                }}
              >
                <span className="text-blue-500 text-xl">{tip.icon}</span>
                <div>
                  <p className="font-medium">{tip.tip}</p>
                  <p className="text-sm text-gray-500">{tip.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Travel Experiences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h5 className="text-xl font-semibold mb-6 text-gray-800">Travel Experiences</h5>
        <div className="space-y-6">
          {travelExperiences.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <div className="flex justify-between items-center mb-2">
                <h6 className="text-lg font-semibold text-gray-800">{exp.title}</h6>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{exp.year}</span>
              </div>
              <p className="text-gray-600 mb-2">{exp.description}</p>
              <ul className="space-y-1 mt-2">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                    <span className="text-blue-500">•</span> {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Travel Destinations */}
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h5 className="text-2xl font-semibold text-gray-800">Favorite Destinations</h5>
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-[50%]">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-4 py-8 mb-16">
          <Slider {...carouselSettings}>
            {filteredDestinations.map((item) => (
              <div key={item.id} className="px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer h-80"
                  onClick={() => handleImageClick(item)}
                >
                  <div className="relative h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                            {item.category}
                          </span>
                          <span className="text-sm">{item.year}</span>
                        </div>
                        <h6 className="text-xl font-semibold mb-1">{item.title}</h6>
                        <p className="text-sm opacity-90">{item.description}</p>
                        <p className="text-xs mt-2 flex items-center gap-1">
                          <span>📍</span> {item.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Travel Map - Placeholder for future implementation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <h5 className="text-xl font-semibold mb-4 text-gray-800">Travel Map</h5>
        <p className="text-gray-600 mb-6">A visual representation of my travel journey is coming soon!</p>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Interactive map coming soon</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelTab;
