import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaArrowRight } from 'react-icons/fa';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center space-y-8 animate-on-scroll max-w-4xl mx-auto px-4">
        {/* Name with professional styling */}
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold text-blue-100 mb-4 animate-on-scroll drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] tracking-wide">
            Quyet NT
          </h1>
        </div>

        {/* Title with animated typing effect */}
        <div className="text-xl md:text-2xl text-blue-100 mb-6 animate-on-scroll flex items-center justify-center drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
          <span className="mr-2">I'm a</span>
          <div className="relative h-8 overflow-hidden">
            <span className="text-blue-50 font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] typing-animation">
              Full Stack Developer
            </span>
          </div>
        </div>

        {/* Description with professional styling */}
        <p className="text-lg text-blue-100 max-w-2xl mx-auto animate-on-scroll drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] leading-relaxed" style={{ animationDelay: '0.5s' }}>
          Crafting elegant solutions to complex problems with clean, efficient code
        </p>

        {/* Social links with enhanced styling */}
        <div className="flex justify-center space-x-6 animate-on-scroll" style={{ animationDelay: '1s' }}>
          <a href="#" className="group relative">
            <div className="w-14 h-14 rounded-full border-2 border-blue-100 hover:border-blue-50 flex items-center justify-center transition-all duration-300 social-icon group-hover:scale-110 backdrop-blur-sm bg-black/30 group-hover:bg-black/40">
              <FaGithub className="h-7 w-7 text-blue-100 group-hover:text-blue-50 transition-colors duration-300" />
            </div>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">GitHub</span>
          </a>
          <a href="#" className="group relative">
            <div className="w-14 h-14 rounded-full border-2 border-blue-100 hover:border-blue-50 flex items-center justify-center transition-all duration-300 social-icon group-hover:scale-110 backdrop-blur-sm bg-black/30 group-hover:bg-black/40">
              <FaLinkedin className="h-7 w-7 text-blue-100 group-hover:text-blue-50 transition-colors duration-300" />
            </div>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">LinkedIn</span>
          </a>
          <a href="#" className="group relative">
            <div className="w-14 h-14 rounded-full border-2 border-blue-100 hover:border-blue-50 flex items-center justify-center transition-all duration-300 social-icon group-hover:scale-110 backdrop-blur-sm bg-black/30 group-hover:bg-black/40">
              <FaTwitter className="h-7 w-7 text-blue-100 group-hover:text-blue-50 transition-colors duration-300" />
            </div>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Twitter</span>
          </a>
        </div>

        {/* Contact button with enhanced styling */}
        <div className="mt-12 animate-on-scroll" style={{ animationDelay: '1.5s' }}>
          <button 
            onClick={() => scrollToSection('contact')}
            className="group px-8 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-400 transition-all duration-300 flex items-center gap-2 mx-auto hover:scale-105 backdrop-blur-sm shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70"
          >
            <span>Let's Connect</span>
            <FaArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
