'use client';

import { useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';
import { findBestCombinationWithCounts } from '@/lib/products';
import { TrashIcon } from '@heroicons/react/16/solid';
import { Input } from '@material-tailwind/react';

interface ShoppingCartProps {
  refreshTrigger?: number;
}

export default function ShoppingCart({ refreshTrigger }: ShoppingCartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  // User's budget for optimal combination
  const [budget, setBudget] = useState<number>(() => {
    // Try to get budget from localStorage, fallback to 150
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('budget');
      if (stored !== null) {
        const parsed = Number(stored);
        return isNaN(parsed) ? 150 : parsed;
      }
    }
    return 150;
  });
  // Best combination found for current budget
  const [bestCombination, setBestCombination] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Error loading cart');
        }
        const data = await response.json();
        setCart(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [refreshTrigger]);

  // Recalculate best combination whenever cart or budget changes
  // Groups and counts products by id (for bounded knapsack)
  function groupAndCount(products: { id: number; name: string; price: number }[]) {
    const map = new Map<number, { id: number; name: string; price: number; count: number }>();
    for (const p of products) {
      if (!map.has(p.id)) {
        map.set(p.id, { ...p, count: 1 });
      } else {
        map.get(p.id)!.count += 1;
      }
    }
    return Array.from(map.values());
  }

  useEffect(() => {
    if (cart.length > 0 && budget > 0) {
      const products = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price
      }));
      const countedProducts = groupAndCount(products);
      const combination = findBestCombinationWithCounts(countedProducts, budget);
      setBestCombination(combination as Product[]);
    } else {
      setBestCombination([]);
    }
  }, [cart, budget]);


  const handleRemoveItem = async (cartId: string) => {
    try {
      // Check if item exists in local cart before making the API call
      const itemExists = cart.some(item => item.cartId === cartId);
      if (!itemExists) {
        console.warn('Item does not exist in local cart');
        // Optional: You might want to sync cart with server here
        return;
      }

      const response = await fetch(`/api/cart?cartId=${encodeURIComponent(cartId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If the error is that the item doesn't exist, update local state
        if (response.status === 404) {
          console.log('Item no longer exists on server, updating local state...');
          setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
          return;
        }
        throw new Error(errorData.error || 'Error removing product');
      }

      // Update local state only if the API call was successful
      setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err.message : 'Error removing product from cart');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const bestCombinationTotal = bestCombination.reduce((sum, item) => sum + item.price, 0);
  const savings = total - bestCombinationTotal;

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        <p className="text-indigo-100 text-sm">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="p-5">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Budget
          </label>
          <div className="relative rounded-md shadow-sm">
            <Input
              type="number"
              value={budget}
              min={0}
              onChange={e => {
                const value = Number(e.target.value);
                setBudget(isNaN(value) || value < 0 ? 0 : value);
              } }
              className="px-4 py-1 rounded w-full"
              aria-label="Max budget" onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}            />
          </div>
        </div>
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Products</h3>
            <ul className="divide-y divide-gray-200">
              {groupAndCount(cart).map((item) => (
                <li key={item.id} className="py-3 flex justify-between items-center group hover:bg-gray-50 px-3 -mx-3 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                      {item.count > 1 && (
                        <span className="ml-2 text-xs text-gray-500">x{item.count}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                    <span className="text-sm font-semibold text-indigo-600 whitespace-nowrap">
                      ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}
                    </span>
                    <button
                      className="text-black hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Encontrá el primer cartId de este producto en el array original
                        const toRemove = cart.find((p) => p.id === item.id);
                        if (toRemove) handleRemoveItem(toRemove.cartId);
                      }}
                      title="Remove one from cart"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>${total.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>

          {/* Best combination section: shows only if there is a valid combination */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-2 text-sm font-medium text-blue-800">Best Combination</h3>
            </div>
            {bestCombination.length === 0 ? (
              <div className="text-gray-500 text-sm">No combination possible for this budget.</div>
            ) : (
              <>
                <ul className="space-y-2 mb-4">
                  {groupAndCount(bestCombination).map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name}{item.count > 1 && (
                        <span className="ml-2 text-xs text-gray-500">x{item.count}</span>
                      )}</span>
                      <span className="font-medium text-gray-900">${(item.price * item.count).toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-blue-100 pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-blue-700">Combination Total:</span>
                    <span className="text-blue-900">${bestCombinationTotal.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                  </div>
                  {savings > 0 && (
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-green-600">Potential Savings:</span>
                      <span className="font-medium text-green-700">${savings.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>

      </div>
    </div>
  );
}
