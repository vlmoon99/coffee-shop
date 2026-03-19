import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Button } from '@/components/common/Button';
import { ChevronLeft, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button variant="ghost" onClick={() => navigate('/shop')} className="mt-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock_count <= 0;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => navigate('/shop')} className="mb-8">
        <ChevronLeft className="mr-2 h-4 w-4" /> {t(LOCALE_KEYS.BACK_TO_SHOP)}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
          <img 
            src={product.image} 
            alt={product.name} 
            className="absolute inset-0 h-full w-full object-cover"
          />
          {isOutOfStock && (
            <div className="absolute top-8 right-8 bg-red-500 text-white text-sm px-4 py-2 rounded-full font-bold uppercase tracking-wider">
              {t(LOCALE_KEYS.OUT_OF_STOCK)}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            {product.category}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            {t(LOCALE_KEYS.PRICE_CURRENCY)}{product.price.toFixed(2)}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-6 mb-10 p-8 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key}>
                <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{key}</span>
                <span className="block text-sm font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button 
              size="lg" 
              className="flex-1 rounded-full h-14" 
              disabled={isOutOfStock}
              onClick={() => addItem(product)}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {t(LOCALE_KEYS.ADD_TO_CART)}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Truck className="h-5 w-5" />
              <span>Fast Global Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <ShieldCheck className="h-5 w-5" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
