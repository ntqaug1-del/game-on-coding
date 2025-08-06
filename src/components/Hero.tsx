import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0" style={{
        background: 'var(--gradient-hero)',
        backgroundSize: '50px 50px',
        backgroundImage: `
          linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.1) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.1) 75%)
        `,
      }}>
        {/* Animated floating pixels */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-pixel-yellow opacity-80 float"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-pixel-red opacity-80 float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-pixel-green opacity-80 float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-pixel-orange opacity-80 float" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-bounce-in">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 glow-text animate-pixel-glow">
            {t('hero.title')}
            <span className="block text-pixel-yellow blink">{t('hero.titleHighlight')}</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="pixel-button text-lg px-8 py-4">
              {t('hero.enrollNow')}
            </Button>
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4">
              {t('hero.watchDemo')}
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="pixel-card text-center">
              <div className="text-3xl font-bold text-pixel-green">10,000+</div>
              <div className="text-muted-foreground">{t('hero.stats.youngCoders')}</div>
            </div>
            <div className="pixel-card text-center">
              <div className="text-3xl font-bold text-pixel-blue">50+</div>
              <div className="text-muted-foreground">{t('hero.stats.courses')}</div>
            </div>
            <div className="pixel-card text-center">
              <div className="text-3xl font-bold text-pixel-yellow">95%</div>
              <div className="text-muted-foreground">{t('hero.stats.successRate')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;