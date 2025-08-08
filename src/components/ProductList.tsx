'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ArrowTrendingDownIcon } from '@heroicons/react/16/solid';

type ProductListProps = {
  onAddToCart: (productId: number) => void;
};

export default function ProductList({ onAddToCart }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Error loading products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow-md hover:scale-105 hover:shadow-xl duration-500 rounded-xl border border-gray-100"
        >
          <a href="#" tabIndex={-1} aria-hidden="true">
            <img
              src={product.img}
              alt={product.name}
              className="h-80 w-72 object-cover mx-auto cursor-default"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/img/placeholder.jpg';
              }}
            />
          </a>
          <div className="px-4 py-3 w-auto mx-auto">
            <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
            <div className="flex items-center mt-2 justify-between">
              <p className="text-lg font-semibold text-black cursor-auto mr-2">${formatPrice(product.price)}</p>
                <button
                  onClick={() => onAddToCart(product.id)}
                  className=" focus:outline-none p-2 rounded-full transition-colors cursor-pointer"
                  aria-label={`Agregar ${product.name} al carrito`}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-black hover:text-gray-600 transition-colors transform hover:scale-110 transition-2s"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                  </svg>
                </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
