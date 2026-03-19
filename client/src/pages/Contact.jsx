import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Contact() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-[70vh]">
      <section className="container mx-auto px-4 py-20 sm:py-32 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 block">
            {t(LOCALE_KEYS.CONTACT)}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {t(LOCALE_KEYS.CONTACT_TITLE)}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            {t(LOCALE_KEYS.CONTACT_TEXT)}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {/* Location */}
          <div className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
              <MapPin className="h-6 w-6 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Location</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              {t(LOCALE_KEYS.CONTACT_ADDRESS)}
            </p>
          </div>
          
          {/* Phone */}
          <div className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Phone className="h-6 w-6 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Phone</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              {t(LOCALE_KEYS.CONTACT_PHONE)}
            </p>
          </div>
          
          {/* Email */}
          <div className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
              <Mail className="h-6 w-6 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Email</h3>
            <p className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              {t(LOCALE_KEYS.CONTACT_EMAIL)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
