'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useState } from 'react';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-foreground/70">Complete your purchase</p>
          </div>

          {!orderConfirmed ? (
            <div className="space-y-8">
              {/* Progress Indicators */}
              <div className="flex justify-between items-center">
                {[
                  { num: 1, label: 'Cart', icon: Package },
                  { num: 2, label: 'Details', icon: Truck },
                  { num: 3, label: 'Payment', icon: CreditCard },
                  { num: 4, label: 'Confirmation', icon: CheckCircle },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.num} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        s.num <= step
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-secondary text-foreground/60'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-sm font-semibold ${s.num <= step ? 'text-accent' : 'text-foreground/60'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="glass p-8 rounded-2xl space-y-6">
                <h2 className="text-2xl font-semibold">Order Summary</h2>
                
                <div className="space-y-3">
                  {[
                    { name: 'Premium Soil Sensor Kit', qty: 1, price: 149 },
                    { name: 'Organic Fertilizer (25kg)', qty: 2, price: 90 },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name} x {item.qty}</span>
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">$339.00</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="glass p-8 rounded-2xl space-y-6">
                <h2 className="text-2xl font-semibold">Delivery Details</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="text" placeholder="Phone" className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="text" placeholder="Address" className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="text" placeholder="City" className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="text" placeholder="Postal Code" className="w-full px-4 py-2 border border-border rounded-lg bg-background dark:bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass p-8 rounded-2xl space-y-6">
                <h2 className="text-2xl font-semibold">Payment Method</h2>
                
                <div className="space-y-3">
                  {['Credit/Debit Card', 'UPI', 'Net Banking', 'Digital Wallet'].map((method, i) => (
                    <label key={i} className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-secondary/30 cursor-pointer">
                      <input type="radio" name="payment" defaultChecked={i === 0} className="w-4 h-4" />
                      <span className="font-semibold">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button onClick={() => setStep(Math.max(1, step - 1))} className="px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-all">
                  Back
                </button>
                <button onClick={handleConfirmOrder} className="flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Confirm & Place Order
                </button>
              </div>
            </div>
          ) : (
            /* Order Confirmation */
            <div className="glass p-12 rounded-2xl text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto text-white text-3xl">
                ✓
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Order Confirmed!</h2>
                <p className="text-lg text-foreground/70">Thank you for your purchase. Your order has been successfully placed.</p>
              </div>

              <div className="bg-secondary/30 dark:bg-secondary/20 p-6 rounded-lg space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Order Number</span>
                  <span className="font-semibold">#SAG-2025-00124</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Total Amount</span>
                  <span className="font-bold text-lg text-accent">$339.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Estimated Delivery</span>
                  <span className="font-semibold">5-7 business days</span>
                </div>
              </div>

              <p className="text-sm text-foreground/70">A confirmation email has been sent to your registered email address. You can track your order using the order number above.</p>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 px-8 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-all">
                  Download Invoice
                </button>
                <button className="flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Track Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
