import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/common/Button';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { cn } from '@/services/utils';

export function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuthStore();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, password, { full_name: fullName });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md my-auto overflow-hidden rounded-[2.5rem] bg-white/95 p-6 sm:p-10 shadow-2xl dark:bg-gray-900/95 border border-white/20 dark:border-gray-800 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isLogin ? t(LOCALE_KEYS.AUTH_WELCOME_BACK) : t(LOCALE_KEYS.AUTH_JOIN_FAMILY)}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? t(LOCALE_KEYS.AUTH_LOGIN_SUBTITLE) : t(LOCALE_KEYS.AUTH_REGISTER_SUBTITLE)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1">{t(LOCALE_KEYS.AUTH_FULL_NAME)}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-black dark:border-gray-800 dark:bg-gray-800/50 dark:text-white dark:focus:border-white transition-all"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1">{t(LOCALE_KEYS.AUTH_EMAIL)}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-black dark:border-gray-800 dark:bg-gray-800/50 dark:text-white dark:focus:border-white transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1">{t(LOCALE_KEYS.AUTH_PASSWORD)}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-black dark:border-gray-800 dark:bg-gray-800/50 dark:text-white dark:focus:border-white transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="px-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full rounded-2xl h-12 mt-4" 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? t(LOCALE_KEYS.AUTH_SIGN_IN) : t(LOCALE_KEYS.AUTH_CREATE_ACCOUNT))}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {isLogin ? t(LOCALE_KEYS.AUTH_NO_ACCOUNT) : t(LOCALE_KEYS.AUTH_HAVE_ACCOUNT)}
          </button>
        </div>
      </div>
    </div>
  );
}
