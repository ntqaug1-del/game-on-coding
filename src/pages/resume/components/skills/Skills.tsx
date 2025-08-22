import React from 'react';

const Skills = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-3xl font-bold text-gray-800 mb-8">Skills</h3>
        <div className="flex justify-center mb-12">
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>
        <p className="text-center text-gray-600 mb-12">
          Highlighting my technical skills and expertise.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">HTML</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">PHP</span>
              <span>80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">CSS</span>
              <span>90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">WORDPRESS/CMS</span>
              <span>90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">JAVASCRIPT</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <span className="font-medium">REACT</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;