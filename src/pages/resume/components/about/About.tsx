import React from 'react';
import { MapPin, Phone, Mail, Calendar, Award, Globe, GraduationCap, Briefcase } from 'lucide-react';

const About = () => {
  return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">About Me</h3>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <div className="relative group flex-shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <img 
                  src="https://i.imgur.com/okxwU4O.jpg"
                  alt="Profile" 
                  className="relative rounded-lg shadow-xl w-full transform transition duration-500 group-hover:scale-105"
                  loading="eager"
                  width="200"
                  height="200"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className="mt-6 text-center flex-grow">
                <h5 className="text-xl font-bold text-gray-800 mb-1">Nguyen The Quyet</h5>
                <p className="text-blue-600 font-medium mb-4">Developer & Teacher</p>
                
                <div className="flex justify-center gap-4 mb-4">
                  <a href="https://github.com/yourusername" 
                     className="p-2 bg-gray-50 rounded-full hover:bg-blue-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/yourusername" 
                     className="p-2 bg-gray-50 rounded-full hover:bg-blue-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>4+ Years Experience</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg> */}
                    {/* <span>20+ Projects Completed</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <div className="mb-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  I'm a developer and teacher with a passion for creating and sharing knowledge.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-grow">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <Calendar className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Birthday:</span>
                    <span className="text-gray-600 ml-2">14th May 1994</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <Award className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Age:</span>
                    <span className="text-gray-600 ml-2">31</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <Globe className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Website:</span>
                    <a href="https://utility-block-display.lovable.app/" className="text-blue-600 hover:underline ml-2">utility-block-display.lovable.app</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <GraduationCap className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Degree:</span>
                    <span className="text-gray-600 ml-2">Master</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <Phone className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <span className="text-gray-600 ml-2">+84 913 118 423</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <Mail className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>
                    <a href="mailto:ntq.145@gmail.com" className="text-blue-600 hover:underline ml-2">ntq.145@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <MapPin className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">City:</span>
                    <span className="text-gray-600 ml-2">Thanh Hoa, Vietnam</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                  <Briefcase className="text-blue-500 w-5 h-5" />
                  <div>
                    <span className="font-semibold text-gray-700">Freelance:</span>
                    <span className="text-green-600 ml-2">Available</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="text-xl font-semibold text-gray-800 mb-4">Professional Summary</h5>
                <p className="text-gray-600 leading-relaxed">
                  I'm a full stack developer with 4+ years of experience in web development and teaching programming. 
                  Passionate about creating efficient solutions and sharing knowledge with others. 
                  I specialize in building scalable applications and enjoy exploring new technologies in my free time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default About; 