import React, { useState } from 'react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: "EVN-NPT Power Line Management",
      description: "Comprehensive software solution for managing power transmission lines for EVN-NPT.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000",
      link: "#",
      technologies: ["Node.js", "React.js", "MongoDB"],
      platforms: ["Web", "Mobile"]
    },
    {
      id: 2,
      title: "Thanh Hoa Open Data Portal",
      description: "Open data portal for Thanh Hoa province, offering government services and public information access.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
      link: "#",
      technologies: ["Python Flask", "PostgreSQL", "Data Visualization"],
      platforms: ["Web"]
    },
    {
      id: 3,
      title: "CLickee - Learn English",
      description: "Interactive English learning platform with personalized learning paths and real-time progress tracking.",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000",
      link: "#",
      technologies: ["Microservice", "Node.js", "React.js", "MongoDB"],
      platforms: ["Web", "Mobile"]
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.platforms.includes(activeFilter));

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">Portfolio</h3>
        <div className="flex justify-center mt-2 mb-10">
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveFilter('Web')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === 'Web'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Web Apps
            </button>
            <button
              onClick={() => setActiveFilter('Mobile')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === 'Mobile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mobile Apps
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={project.link}
                    className="text-white bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Platforms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 