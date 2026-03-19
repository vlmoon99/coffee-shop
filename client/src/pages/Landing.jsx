import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=2000" 
            alt="Coffee brewing" 
            className="h-full w-full object-cover opacity-50 dark:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-black" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-32 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
            {t(LOCALE_KEYS.HERO_TITLE)}
          </h1>
          <p className="mx-auto mt-6 mb-10 max-w-2xl text-lg text-gray-800 dark:text-gray-200">
            {t(LOCALE_KEYS.HERO_SUBTITLE)}
          </p>
          <Button size="lg" onClick={() => navigate('/shop')}>
            {t(LOCALE_KEYS.SHOP)} Now
          </Button>
        </div>
      </section>
    </div>
  );
}
