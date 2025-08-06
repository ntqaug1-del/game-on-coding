import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex space-x-1">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={`text-xs px-3 py-1 ${
          language === 'en' 
            ? 'pixel-button' 
            : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
        }`}
      >
        EN
      </Button>
      <Button
        variant={language === 'vi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('vi')}
        className={`text-xs px-3 py-1 ${
          language === 'vi' 
            ? 'pixel-button' 
            : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
        }`}
      >
        VI
      </Button>
    </div>
  );
};

export default LanguageSwitcher;