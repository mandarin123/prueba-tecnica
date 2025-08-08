import { NextResponse } from 'next/server';
import { products } from '@/lib/products';
import { CartItem } from '@/types';

// In-memory cart (simulating a database)
let cart: CartItem[] = [];

// Function to generate a unique ID
function generateCartId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function GET() {
  return NextResponse.json(cart);
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    
    // Validate that the product ID is a number
    const id = Number(productId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Find the product in the products list
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create a new cart item with a unique ID and additional data
    const cartItem: CartItem = {
      ...product,
      cartId: generateCartId(),
      imageUrl: `https://picsum.photos/200/200?random=${product.id}` // Random image based on ID
    };

    // Add the item to the cart
    cart.push(cartItem);
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    // Filter the cart to remove the item
    const initialLength = cart.length;
    cart = cart.filter(item => item.cartId !== cartId);

    if (cart.length === initialLength) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}
