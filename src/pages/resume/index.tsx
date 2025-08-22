import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/animations.css';

// Import components
import LifeOutsideProgramming from './components/life/LifeOutsideProgramming';
import About from './components/about/About';
import ResumeSection from './components/resumesection/ResumeSection';
import Portfolio from './components/portfolio/Portfolio';
import Navigation from './components/navigation/Navigation';
import HeroSection from './components/hero/HeroSection';
import Contact from './components/contact/Contact';
import Footer from './components/footer/Footer';

const Resume = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    resume: useRef(null),
    portfolio: useRef(null),
    life: useRef(null),
    contact: useRef(null)
  };

  const navigate = useNavigate();

  // Handles smooth scrolling to sections when clicking on nav items
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = sectionRefs[sectionId].current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Determine which section is currently in view
      Object.keys(sectionRefs).forEach((section) => {
        const element = sectionRefs[section].current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      });

      // Show 'Back to Top' button when scrolled down
      setShowBackToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);

    // Initial animation for page elements
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-fade-in');
        }, index * 200);
      });
    };

    animateElements();
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <div ref={sectionRefs.home} className="relative h-screen" id="home">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://imgur.com/mt49EP1.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>

        {/* Navigation */}
        <Navigation
          activeSection={activeSection}
          isMobileMenuOpen={isMobileMenuOpen}
          showBackToTop={showBackToTop}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          scrollToSection={scrollToSection}
          sectionRefs={sectionRefs}
        />

        {/* Hero Content */}
        <HeroSection scrollToSection={scrollToSection} />
      </div>

      {/* About section */}
      <div ref={sectionRefs.about} id="about" className="py-16 bg-white">
        <About />
      </div>

      {/* Resume Section */}
      <div ref={sectionRefs.resume} id="resume" className="py-16 bg-gray-50">
        <ResumeSection/>
      </div>

      {/* Portfolio Section */}
      <div ref={sectionRefs.portfolio} id="portfolio" className="py-16 bg-white">
        <Portfolio/>
      </div>

      {/* Life Outside of Programming Section */}
      <div ref={sectionRefs.life} id="life" className="py-16 bg-gray-50">
        <LifeOutsideProgramming />
      </div>

      {/* Contact and Footer Section */}
      <div className="flex-grow flex flex-col">
        <div ref={sectionRefs.contact} id="contact" className="flex-grow py-16 bg-white flex flex-col justify-center">
          <Contact />
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default Resume;
