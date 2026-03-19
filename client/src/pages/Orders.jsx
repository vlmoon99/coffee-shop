import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/services/supabase';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Package, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export function Orders() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
      setIsLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">Start shopping to see your orders here.</p>
          <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Order ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{order.id}</p>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Total</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {t(LOCALE_KEYS.PRICE_CURRENCY)}{order.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Clock className="mr-1 h-3 w-3" /> {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-50 dark:border-gray-800 pt-6">
                <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          {item.products?.image_url && (
                            <img src={item.products.image_url} alt={item.products.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-xs text-gray-500">{item.quantity} x {t(LOCALE_KEYS.PRICE_CURRENCY)}{item.price_at_time.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {t(LOCALE_KEYS.PRICE_CURRENCY)}{(item.quantity * item.price_at_time).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
