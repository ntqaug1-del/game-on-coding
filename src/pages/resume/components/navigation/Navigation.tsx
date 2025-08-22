import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaLayerGroup,
  FaEnvelope,
  FaArrowLeft,
  FaBars,
  FaArrowUp
} from 'react-icons/fa';

interface NavigationProps {
  activeSection: string;
  isMobileMenuOpen: boolean;
  showBackToTop: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  scrollToSection: (sectionId: string) => void;
  sectionRefs: Record<string, React.RefObject<HTMLDivElement>>;
}

const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  isMobileMenuOpen,
  showBackToTop,
  setIsMobileMenuOpen,
  scrollToSection,
  sectionRefs
}) => {
  const navigate = useNavigate();

  // Map of section icons
  const sectionIcons = {
    home: <FaHome className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />,
    about: <FaUser className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />,
    resume: <FaFileAlt className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />,
    portfolio: <FaBriefcase className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />,
    life: <FaLayerGroup className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />,
    contact: <FaEnvelope className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-30 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Side Navigation - Fixed */}
      <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-6 transition-all duration-300
        ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0 md:translate-x-0 md:opacity-100'}`}>
        {Object.keys(sectionRefs).map((section) => (
          <div
            key={section}
            onClick={() => {
              scrollToSection(section);
              setIsMobileMenuOpen(false);
            }}
            className={`nav-menu-item ${activeSection === section ? 'active' : ''}`}
          >
            <div className={`group relative w-12 h-12 rounded-full transition-all duration-300 
              ${activeSection === section ? 'bg-blue-600 text-white scale-110' : 'bg-white/80 text-gray-800 hover:bg-blue-600 hover:text-white hover:scale-110'} 
              flex items-center justify-center cursor-pointer shadow-md nav-menu-icon`}>
              {/* Icon */}
              <div className="relative z-10">
                {sectionIcons[section]}
              </div>

              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </div>

              {/* Active indicator */}
              {activeSection === section && (
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          </div>
        ))}
        {/* Back to Home Button */}
        <div
          onClick={() => navigate('/')}
          className="nav-menu-item"
        >
          <div className="group relative w-12 h-12 rounded-full transition-all duration-300 bg-white/80 text-gray-800 hover:bg-blue-600 hover:text-white hover:scale-110 flex items-center justify-center cursor-pointer shadow-md nav-menu-icon">
            <FaArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="fixed bottom-4 right-4 z-30">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            <FaArrowUp className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default Navigation;
