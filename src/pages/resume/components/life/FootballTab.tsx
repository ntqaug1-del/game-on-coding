import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { footballMoments } from './footballData';

interface FootballTabProps {
  handleImageClick: (image: any) => void;
}

const FootballTab: React.FC<FootballTabProps> = ({ handleImageClick }) => {
  const [hoveredAchievement, setHoveredAchievement] = useState(null);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg"
        >
          <h5 className="text-xl font-semibold mb-4 text-gray-800">My Football Journey</h5>
          <p className="text-gray-600 mb-4">
            From local matches to international tournaments, football has been a significant part of my life. 
            I've played in various positions and continue to enjoy both playing and watching the beautiful game.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Striker", color: "blue" },
              { name: "Midfielder", color: "purple" },
              { name: "Defender", color: "green" }
            ].map((skill, index) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
                className={`px-3 py-1 bg-${skill.color}-100 text-${skill.color}-800 rounded-full text-sm cursor-pointer`}
              >
                {skill.name}
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
          <h5 className="text-xl font-semibold mb-4 text-gray-800">Achievements</h5>
          <ul className="space-y-3">
            {[
              { id: 1, icon: "🏆", text: "Local League Champion 2022", description: "Led team to victory in regional championship" },
              { id: 2, icon: "🥈", text: "Regional Tournament Runner-up 2021", description: "Strong performance in state-level competition" },
              { id: 3, icon: "⚽", text: "Top Scorer Award 2020", description: "Scored 25 goals in the season" }
            ].map((achievement) => (
              <motion.li
                key={achievement.id}
                className="flex items-center gap-2 text-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-300"
                onHoverStart={() => setHoveredAchievement(achievement.id)}
                onHoverEnd={() => setHoveredAchievement(null)}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(99, 102, 241, 0.1)"
                }}
              >
                <span className="text-yellow-500 text-xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium">{achievement.text}</p>
                  {hoveredAchievement === achievement.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-gray-500 mt-1"
                    >
                      {achievement.description}
                    </motion.p>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="relative">
        <h5 className="text-2xl font-semibold mb-12 text-gray-800 text-center">Football Moments</h5>
        
        <div className="px-4 py-8 mb-16">
          <Slider {...carouselSettings}>
            {footballMoments.map((item) => (
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
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-2">
                          {item.category}
                        </span>
                        <h6 className="text-xl font-semibold mb-1">{item.title}</h6>
                        <p className="text-sm opacity-90">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Football Stats */}
      {/*<motion.div*/}
      {/*  initial={{ opacity: 0, y: 20 }}*/}
      {/*  animate={{ opacity: 1, y: 0 }}*/}
      {/*  transition={{ duration: 0.5, delay: 0.3 }}*/}
      {/*  className="grid grid-cols-1 md:grid-cols-3 gap-6"*/}
      {/*>*/}
      {/*  <div className="bg-white rounded-xl shadow-lg p-6 text-center">*/}
      {/*    <div className="text-4xl font-bold text-blue-600 mb-2">120+</div>*/}
      {/*    <p className="text-gray-600">Matches Played</p>*/}
      {/*  </div>*/}
      {/*  <div className="bg-white rounded-xl shadow-lg p-6 text-center">*/}
      {/*    <div className="text-4xl font-bold text-blue-600 mb-2">45</div>*/}
      {/*    <p className="text-gray-600">Goals Scored</p>*/}
      {/*  </div>*/}
      {/*  <div className="bg-white rounded-xl shadow-lg p-6 text-center">*/}
      {/*    <div className="text-4xl font-bold text-blue-600 mb-2">8</div>*/}
      {/*    <p className="text-gray-600">Tournaments Won</p>*/}
      {/*  </div>*/}
      {/*</motion.div>*/}
    </div>
  );
};

export default FootballTab;
