import { useState } from 'react';
import { ShoppingBag, Coffee, Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Button } from '@/components/common/Button';
import { cn } from '@/services/utils';
import { Link, useLocation } from 'react-router-dom';

export function Navbar({ className }) {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();
  const { t, locale, setLocale } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLocaleToggle = () => {
    setLocale(locale === 'en' ? 'uk' : 'en');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/shop', key: LOCALE_KEYS.SHOP },
    { path: '/about', key: LOCALE_KEYS.ABOUT },
    { path: '/contact', key: LOCALE_KEYS.CONTACT },
  ];

  if (isAuthenticated) {
    navLinks.push({ path: '/orders', key: LOCALE_KEYS.ORDERS });
  }

  return (
    <header className={cn('sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-md dark:border-gray-800/50 dark:bg-black/70', className)}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white" onClick={closeMobileMenu}>
            <Coffee className="h-6 w-6" />
            <span className="text-xl font-medium tracking-tight">Onyx</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.key}
                to={link.path} 
                className={cn(
                  "transition-colors",
                  location.pathname === link.path
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLocaleToggle}
            className="hidden sm:inline-flex uppercase w-10 px-0"
          >
            {locale}
          </Button>

          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                {user.isAnonymous ? 'Guest' : user.email}
              </span>
              <button onClick={logout} className="ml-2 p-1 hover:text-red-500 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden lg:flex items-center gap-2"
              onClick={openAuthModal}
            >
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCart} 
            className="relative"
            aria-label="Toggle cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white dark:bg-white dark:text-black">
                {itemCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-black/95 backdrop-blur-md absolute w-full h-screen">
          <nav className="container mx-auto px-4 py-8 flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <Link 
                key={link.key}
                to={link.path} 
                onClick={closeMobileMenu}
                className={cn(
                  "block text-2xl font-bold py-2 transition-colors",
                  location.pathname === link.path
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
            
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
              {isAuthenticated ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user.isAnonymous ? 'Guest User' : user.email}</span>
                  </div>
                  <Button variant="ghost" onClick={logout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-full text-xl font-bold"
                  onClick={() => {
                    closeMobileMenu();
                    openAuthModal();
                  }}
                >
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </Button>
              )}

              <Button 
                variant="outline" 
                className="w-full justify-between uppercase h-14 px-8 rounded-full"
                onClick={() => {
                  handleLocaleToggle();
                  closeMobileMenu();
                }}
              >
                <span>Language</span>
                <span className="font-bold">{locale}</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
