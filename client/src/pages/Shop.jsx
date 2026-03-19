import { useState } from 'react';
import { useProducts, useFilteredProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation, LOCALE_KEYS } from '@/services/localization';
import { Card, CardImage, CardTitle, CardDescription, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Shop() {
  const { products, isLoading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filteredProducts = useFilteredProducts(products, searchQuery, category);

  const categories = [
    { id: 'all', label: t(LOCALE_KEYS.ALL_CATEGORIES) },
    { id: 'coffee', label: t(LOCALE_KEYS.CAT_COFFEE) },
    { id: 'equipment', label: t(LOCALE_KEYS.CAT_EQUIPMENT) },
    { id: 'sweets', label: t(LOCALE_KEYS.CAT_SWEETS) },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        {t(LOCALE_KEYS.PRODUCTS_TITLE)}
      </h1>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <Button 
              key={cat.id}
              variant={category === cat.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.id)}
              className="whitespace-nowrap"
            >
              {cat.label}
            </Button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-white" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-white dark:focus:border-white transition-colors"
            placeholder={t(LOCALE_KEYS.SEARCH_PLACEHOLDER)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square w-full rounded-3xl bg-gray-200 dark:bg-gray-800" />
              <div className="mt-6 h-6 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="mt-2 h-4 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="mt-6 flex items-center justify-between">
                <div className="h-6 w-1/4 rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              No products found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock_count <= 0;
                return (
                  <Card key={product.id} className="flex flex-col h-full">
                    <Link to={`/product/${product.id}`} className="block group">
                      <div className="relative">
                        <CardImage src={product.image} alt={product.name} className={isOutOfStock ? 'opacity-50 grayscale' : ''} />
                        {isOutOfStock && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                            {t(LOCALE_KEYS.OUT_OF_STOCK)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <ArrowRight className="h-5 w-5 text-black" />
                          </div>
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {product.name}
                      </CardTitle>
                    </Link>
                    <CardDescription className="flex-1">{product.description}</CardDescription>
                    <CardFooter>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t(LOCALE_KEYS.PRICE_CURRENCY)}{product.price.toFixed(2)}
                      </span>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(product);
                        }} 
                        disabled={isOutOfStock}
                        variant={isOutOfStock ? 'secondary' : 'primary'}
                      >
                        {isOutOfStock ? t(LOCALE_KEYS.OUT_OF_STOCK) : t(LOCALE_KEYS.ADD_TO_CART)}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
