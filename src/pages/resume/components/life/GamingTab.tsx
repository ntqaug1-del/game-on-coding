import React from 'react';
import { motion } from 'framer-motion';

const GamingTab: React.FC = () => {
  const favoriteGames = [
    {
      id: 1,
      title: "League of Legends",
      genre: "MOBA",
      description: "Strategic team-based gameplay",
      icon: "🎮"
    },
    {
      id: 2,
      title: "Counter-Strike",
      genre: "FPS",
      description: "Tactical first-person shooter",
      icon: "🎯"
    },
    {
      id: 3,
      title: "FIFA",
      genre: "Sports",
      description: "Football simulation",
      icon: "⚽"
    },
    {
      id: 4,
      title: "Minecraft",
      genre: "Sandbox",
      description: "Creative building and exploration",
      icon: "🏗️"
    }
  ];

  const gamingSkills = [
    { skill: "Team Coordination", level: 90 },
    { skill: "Strategic Planning", level: 85 },
    { skill: "Quick Decision Making", level: 80 },
    { skill: "Problem Solving", level: 95 }
  ];

  return (
    <div className="space-y-12">
      {/* Gaming Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg"
      >
        <h5 className="text-xl font-semibold mb-4 text-gray-800">My Gaming Journey</h5>
        <p className="text-gray-600 mb-6">
          Gaming has been more than just entertainment for me—it's a way to develop strategic thinking, 
          teamwork, and problem-solving skills. I enjoy both competitive and casual gaming experiences, 
          connecting with friends and the global gaming community.
        </p>
        <div className="flex flex-wrap gap-3">
          {["Strategy", "Teamwork", "Competition", "Creativity", "Community"].map((aspect, index) => (
            <motion.span
              key={aspect}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {aspect}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Favorite Games */}
      <div>
        <h5 className="text-2xl font-semibold mb-6 text-gray-800">Favorite Games</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="text-3xl mb-4">{game.icon}</div>
                <h6 className="text-lg font-semibold text-gray-800 mb-1">{game.title}</h6>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs mb-3">
                  {game.genre}
                </span>
                <p className="text-gray-600 text-sm">{game.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gaming Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h5 className="text-xl font-semibold mb-6 text-gray-800">Skills Developed Through Gaming</h5>
        <div className="space-y-6">
          {gamingSkills.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">{item.skill}</span>
                <span className="text-gray-500">{item.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.level}%` }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gaming Setup - Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center"
      >
        <h5 className="text-xl font-semibold mb-4 text-gray-800">My Gaming Setup</h5>
        <p className="text-gray-600 mb-6">Photos and details of my gaming setup coming soon!</p>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Setup photos coming soon</p>
        </div>
      </motion.div>
    </div>
  );
};

export default GamingTab;
