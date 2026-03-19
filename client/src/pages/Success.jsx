import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, UserCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';

export function Success() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pointsEarned = 0, userEmail = '', isNewAccount = false } = location.state || {};

  return (
    <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-8 animate-in zoom-in duration-500 rounded-full bg-green-100 p-6 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-lg shadow-green-100 dark:shadow-none">
        <CheckCircle2 className="h-16 w-16" />
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
        {t(LOCALE_KEYS.ORDER_SUCCESS_TITLE)}
      </h1>
      
      <div className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8 space-y-2">
        <p>{t(LOCALE_KEYS.ORDER_SUCCESS_SUBTITLE)}</p>
        <p className="font-medium text-gray-900 dark:text-white">
          {t(LOCALE_KEYS.CONFIRMATION_SENT_TO).replace('{email}', userEmail || 'your email')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-12 w-full max-w-2xl justify-center">
        {pointsEarned > 0 && (
          <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-3xl p-6 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full shrink-0">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-500">
                {t(LOCALE_KEYS.LOYALTY_POINTS)}
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                {t(LOCALE_KEYS.POINTS_EARNED_TEMPLATE).replace('{points}', pointsEarned)}
              </p>
            </div>
          </div>
        )}

        {isNewAccount && (
          <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full shrink-0">
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-blue-900 dark:text-blue-500">
                {t(LOCALE_KEYS.ACCOUNT_CREATED_TITLE)}
              </h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                {t(LOCALE_KEYS.ACCOUNT_CREATED_SUBTITLE)}
              </p>
            </div>
          </div>
        )}
      </div>

      <Button size="lg" onClick={() => navigate('/shop')} className="rounded-full px-12">
        {t(LOCALE_KEYS.BACK_TO_SHOP)}
      </Button>
    </div>
  );
}
