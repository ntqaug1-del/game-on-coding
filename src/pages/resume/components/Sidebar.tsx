import React from 'react';
import { Home, User, FileText, Briefcase, Layers, Mail } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ scrollToSection, activeSection }) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-6">
      {['home', 'about', 'resume', 'portfolio', 'life', 'contact'].map((section) => (
        <div 
          key={section}
          onClick={() => scrollToSection(section)}
          className={`nav-menu-item ${activeSection === section ? 'active' : ''}`}
        >
          <div className={`w-12 h-12 rounded-full transition-all duration-300 ${activeSection === section ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} 
            hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer shadow-md nav-menu-icon`}>
            {section === 'home' && <Home className="h-5 w-5" />}
            {section === 'about' && <User className="h-5 w-5" />}
            {section === 'resume' && <FileText className="h-5 w-5" />}
            {section === 'portfolio' && <Briefcase className="h-5 w-5" />}
            {section === 'life' && <Layers className="h-5 w-5" />}
            {section === 'contact' && <Mail className="h-5 w-5" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 