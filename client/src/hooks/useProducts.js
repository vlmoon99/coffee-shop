import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/services/supabase';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProducts() {
      setIsLoading(true);
      try {
        supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) throw error;

        if (isMounted) {
          // Map image_url to image for UI compatibility
          const mappedData = data.map(p => ({
            ...p,
            image: p.image_url
          }));
          setProducts(mappedData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;

    async function fetchProduct() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (isMounted) {
          setProduct({
            ...data,
            image: data.image_url
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, isLoading, error };
}

export function useFilteredProducts(products, searchQuery, category) {
  return useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, category]);
}
