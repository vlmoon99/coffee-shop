import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';

const Landing = lazy(() => import('@/pages/Landing').then(m => ({ default: m.Landing })));
const Shop = lazy(() => import('@/pages/Shop').then(m => ({ default: m.Shop })));
const Checkout = lazy(() => import('@/pages/Checkout').then(m => ({ default: m.Checkout })));
const Success = lazy(() => import('@/pages/Success').then(m => ({ default: m.Success })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const ProductDetail = lazy(() => import('@/pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Orders = lazy(() => import('@/pages/Orders').then(m => ({ default: m.Orders })));

export function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
