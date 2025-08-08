// Types for products
export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
}

// Types for cart items
export interface CartItem extends Product {
  cartId: string; // Unique ID for each cart item
  imageUrl?: string; // Product image URL (optional)
}

// Type for the shopping cart
export type Cart = CartItem[];
