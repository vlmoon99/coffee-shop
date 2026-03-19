import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SidebarCart } from '@/components/common/SidebarCart';
import { AuthModal } from '@/components/common/AuthModal';
import { useAuthStore } from '@/store/useAuthStore';

export function MainLayout({ children }) {
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="flex-1 bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <SidebarCart />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
        />
      </div>
    </div>
  );
}
