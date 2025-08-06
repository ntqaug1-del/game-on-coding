import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-2 border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pixel-green to-pixel-blue border-2 border-border relative">
              {/* Pixel art computer icon */}
              <div className="absolute inset-1 bg-background">
                <div className="w-full h-1 bg-pixel-green mt-1"></div>
                <div className="w-4 h-1 bg-pixel-blue mx-auto mt-1"></div>
                <div className="w-full h-1 bg-pixel-yellow mt-1"></div>
                <div className="w-2 h-2 bg-pixel-red mx-auto mt-1 rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold glow-text">CodeHeroes</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">{t('nav.home')}</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">{t('nav.about')}</a>
            <a href="#courses" className="text-foreground hover:text-primary transition-colors">{t('nav.courses')}</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">{t('nav.testimonials')}</a>
            <a href="#blog" className="text-foreground hover:text-primary transition-colors">{t('nav.blog')}</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">{t('nav.contact')}</a>
          </nav>

          {/* CTA Button and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Button className="pixel-button">
              {t('nav.joinNow')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center space-y-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-primary transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-primary transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-primary transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-in">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">{t('nav.home')}</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">{t('nav.about')}</a>
              <a href="#courses" className="text-foreground hover:text-primary transition-colors">{t('nav.courses')}</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">{t('nav.testimonials')}</a>
              <a href="#blog" className="text-foreground hover:text-primary transition-colors">{t('nav.blog')}</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">{t('nav.contact')}</a>
              <div className="flex justify-between items-center mt-4">
                <LanguageSwitcher />
                <Button className="pixel-button">
                  {t('nav.joinNow')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;