import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-4 py-20 sm:py-32 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
              {t(LOCALE_KEYS.ABOUT)}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {t(LOCALE_KEYS.ABOUT_TITLE)}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-light">
              {t(LOCALE_KEYS.ABOUT_TEXT)}
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button variant="outline" size="lg" onClick={() => navigate('/shop')} className="rounded-full px-8">
                {t(LOCALE_KEYS.SHOP)} Now
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-gray-100 dark:bg-gray-800 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800" 
                alt="Coffee beans" 
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
