import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-6">
          <Coffee className="h-5 w-5" />
          <span className="text-lg font-medium tracking-tight">Onyx Coffee</span>
        </div>
        <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Onyx Roasters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
