import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/common/Button';
import { User, ShieldCheck, Mail, Lock, MapPin, Phone } from 'lucide-react';

export function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated, loginAnonymous, register } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    email: user?.email || '', 
    address: '', 
    phone: '',
    password: '',
    confirmPassword: '',
    wantsToRegister: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate('/shop');
    }
  }, [items, navigate, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let currentUser = user;

      // 1. Handle Auth
      if (formData.wantsToRegister) {
        if (!formData.password) throw new Error('Password is required');
        if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
        
        const { data, error: regError } = await register(formData.email, formData.password);
        if (regError) throw regError;
        currentUser = data.user;
      } else if (!isAuthenticated) {
        const { data, error: anonError } = await loginAnonymous();
        if (anonError) throw anonError;
        currentUser = data.user;
      }

      // 2. Create Order in Supabase using atomic RPC
      const { data: order_id, error: orderError } = await supabase.rpc('create_order', {
        p_user_id: currentUser?.id,
        p_total_price: total,
        p_delivery_info: {
          email: formData.email,
          address: formData.address,
          phone: formData.phone
        },
        p_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_time: item.price
        }))
      });

      if (orderError) throw orderError;

      // 4. Calculate Loyalty Points (1 point per $10 spent on coffee)
      const pointsEarned = Math.floor(
        items
          .filter(item => item.category === 'coffee')
          .reduce((sum, item) => sum + (item.price * item.quantity), 0) / 10
      );

      // 5. Finalize
      clearCart();
      navigate('/success', { 
        state: { 
          pointsEarned,
          userEmail: formData.email,
          isNewAccount: formData.wantsToRegister,
          orderId: order_id
        } 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) return null;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        {t(LOCALE_KEYS.CHECKOUT_TITLE)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact & Delivery Information */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t(LOCALE_KEYS.CHECKOUT_FORM_EMAIL)}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      required
                      className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:border-black focus:ring-black dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t(LOCALE_KEYS.CHECKOUT_FORM_PHONE)}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 focus:border-black focus:ring-black dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t(LOCALE_KEYS.CHECKOUT_FORM_ADDRESS)}
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={3}
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-black focus:ring-black dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Account Creation (Optional) */}
            {!user || user.isAnonymous ? (
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-5 w-5" /> Account Details
                  </h2>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      checked={formData.wantsToRegister}
                      onChange={e => setFormData({ ...formData, wantsToRegister: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      Create an account?
                    </span>
                  </label>
                </div>

                {formData.wantsToRegister && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            className="block w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                            value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                  </div>
                )}
                
                {!formData.wantsToRegister && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> 
                    You can proceed anonymously. Your data will only be used for this order.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Logged in as <span className="font-bold text-gray-900 dark:text-white">{user.email}</span>
                </p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full h-14 text-base" disabled={isSubmitting}>
              {isSubmitting ? 'Finalizing your Order...' : t(LOCALE_KEYS.PLACE_ORDER)}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-5">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl sticky top-24 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
            <ul className="space-y-4 mb-6">
              {items.map(item => (
                <li key={item.id} className="flex gap-4">
                  <img src={item.image} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.quantity}x {t(LOCALE_KEYS.PRICE_CURRENCY)}{item.price.toFixed(2)}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {t(LOCALE_KEYS.PRICE_CURRENCY)}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{t(LOCALE_KEYS.PRICE_CURRENCY)}{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 font-medium uppercase text-xs">Free</span>
              </div>
              <div className="flex justify-between items-center font-bold text-xl text-gray-900 dark:text-white pt-2">
                <span>{t(LOCALE_KEYS.TOTAL)}</span>
                <span>{t(LOCALE_KEYS.PRICE_CURRENCY)}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
