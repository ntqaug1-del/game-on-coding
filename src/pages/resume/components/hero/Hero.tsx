import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ activeSection, scrollToSection }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen" id="home">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-6 animate-on-scroll">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-on-scroll">Nguyen The Quyet</h1>
          <div className="text-xl md:text-2xl text-white mb-6 animate-on-scroll flex items-center justify-center">
            <span>I'm </span>
            <span className="relative mx-2">
              <span className="text-blue-400 font-medium relative">
                Developer
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-100 origin-left"></span>
              </span>
            </span>
          </div>
          <div className="flex justify-center space-x-4 animate-on-scroll">
            <a href="#" className="text-white hover:text-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-full border border-white hover:border-blue-400 flex items-center justify-center transition-colors social-icon">
                <FaFacebook size={24} />
              </div>
            </a>
            <a href="#" className="text-white hover:text-pink-400 transition-colors">
              <div className="w-10 h-10 rounded-full border border-white hover:border-pink-400 flex items-center justify-center transition-colors social-icon">
                <FaInstagram size={24} />
              </div>
            </a>
            <a href="#" className="text-white hover:text-blue-600 transition-colors">
              <div className="w-10 h-10 rounded-full border border-white hover:border-blue-600 flex items-center justify-center transition-colors social-icon">
                <FaLinkedin size={24} />
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-30">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Hero; 