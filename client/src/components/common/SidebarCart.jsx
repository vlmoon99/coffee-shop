import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export function SidebarCart() {
  const { items, isCartOpen, updateQuantity, removeItem, closeCart } = useCartStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />
      
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-gray-900 dark:border-l dark:border-gray-800 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          <h2 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
            {t(LOCALE_KEYS.CART)}
          </h2>
          <button 
            onClick={closeCart}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                <Trash2 className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {t(LOCALE_KEYS.CART_EMPTY)}
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t(LOCALE_KEYS.PRICE_CURRENCY)}{item.price.toFixed(2)}
                    </p>
                    <div className="mt-auto flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="rounded-full p-1 border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full p-1 border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        disabled={item.quantity >= item.stock_count}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-base font-medium text-gray-900 dark:text-white mb-6">
              <p>{t(LOCALE_KEYS.TOTAL)}</p>
              <p>{t(LOCALE_KEYS.PRICE_CURRENCY)}{total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t(LOCALE_KEYS.DELIVERY_OPTIONS)} calculated at checkout.
            </p>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              {t(LOCALE_KEYS.CHECKOUT)}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
