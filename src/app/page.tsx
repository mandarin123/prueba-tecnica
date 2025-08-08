'use client';

import { useState } from 'react';
import ProductList from '@/components/ProductList';
import { products } from '@/lib/products';
import ShoppingCart from '@/components/ShoppingCart';

export default function Home() {
  const [cartUpdated, setCartUpdated] = useState(0);

  const handleAddToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error adding to cart');
      }
      
      // Force cart update
      setCartUpdated(prev => prev + 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <span className="bg-clip-text text-black bg-gradient-to-r from-indigo-600 to-blue-600">
            Product Store
          </span>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our product selection and find the best combination that fits your budget.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Available Products</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {products.length} products
                </span>
              </div>
              <ProductList onAddToCart={handleAddToCart} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ShoppingCart refreshTrigger={cartUpdated} />
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Product Store. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
