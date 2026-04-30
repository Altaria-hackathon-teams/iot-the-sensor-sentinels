'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Premium Soil Sensor Kit', price: 149, quantity: 1, category: 'Equipment' },
    { id: 2, name: 'Organic Fertilizer (25kg)', price: 45, quantity: 2, category: 'Supplies' },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
  const total = subtotal + tax + shipping;

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              Shopping Cart
            </h1>
            <p className="text-foreground/70">{cartItems.length} items in your cart</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <div className="glass p-12 rounded-2xl text-center space-y-4">
                  <ShoppingCart className="w-12 h-12 text-foreground/40 mx-auto" />
                  <p className="text-lg text-foreground/70">Your cart is empty</p>
                  <Link href="/marketplace" className="inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="glass p-6 rounded-2xl flex gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center text-4xl">
                      🌾
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-foreground/70">{item.category}</p>
                      <p className="text-lg font-bold text-accent">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-secondary">
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-secondary">
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="glass p-8 rounded-2xl h-fit space-y-6">
              <h2 className="text-2xl font-semibold">Order Summary</h2>
              
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
                {shipping === 0 && subtotal > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400">Free shipping on orders over $500!</p>
                )}
              </div>

              <Link href="/checkout" className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center block">
                Proceed to Checkout
              </Link>
              <Link href="/marketplace" className="w-full py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-all text-center block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
