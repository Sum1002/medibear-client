import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';

export default function Cart() {
  const [cart, setCart] = useState([]);

  const [payment, setPayment] = useState('cod');

  const delivery = 50.0;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(stored);
    } catch (e) {
      setCart([]);
    }

    const handleStorage = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
      } catch (e) {
        setCart([]);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  }, [cart]);

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + (Number(i.price) || 0) * (i.quantity || 1), 0),
    [cart],
  );
  const grandTotal = useMemo(() => subtotal + (cart.length > 0 ? delivery : 0), [subtotal, cart.length]);

  const inc = (idx) => {
    setCart((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: (next[idx].quantity || 1) + 1 };
      return next;
    });
  };

  const dec = (idx) => {
    setCart((prev) => {
      const next = [...prev];
      const qty = next[idx].quantity || 1;
      if (qty > 1) {
        next[idx] = { ...next[idx], quantity: qty - 1 };
      } else {
        next.splice(idx, 1);
      }
      return next;
    });
  };

  const removeItem = (idx) => {
    setCart((prev) => {
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  function placeOrder() {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!payment) {
      alert('Please choose a payment method');
      return;
    }
    alert(`Order placed — payment: ${payment}\nTotal: ৳${grandTotal.toFixed(2)}`);
    setCart([]);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">Your Cart</h1>
          <p className="text-sm muted mt-1">Review items, choose payment, and place your order.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto" id="cartTable">
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-3">Item</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Qty</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cart.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center" colSpan={5}>
                      Your cart is empty
                    </td>
                  </tr>
                ) : (
                  cart.map((it, idx) => (
                    <tr key={it.id || idx}>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={
                            it.image
                              ? it.image
                              : '/medi-Image/MediBear-Main-Logo.png'
                          }
                          alt={it.name}
                          className="w-16 h-16 object-contain rounded"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/medi-Image/MediBear-Main-Logo.png';
                          }}
                        />
                        <div>
                          <div className="font-medium">{it.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">৳ {(Number(it.price) || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => dec(idx)} className="px-2 py-1 bg-gray-100 rounded">-</button>
                          <div>{it.quantity || 1}</div>
                          <button onClick={() => inc(idx)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3">৳ {((Number(it.price) || 0) * (it.quantity || 1)).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => removeItem(idx)} className="text-sm text-red-600">Remove</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">Payment & Summary</h2>
          <div className="mb-4">
            <label className="block text-sm muted mb-2">Payment method</label>
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center">
                <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="mr-2" />
                Cash on delivery
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="payment" value="bkash" checked={payment === 'bkash'} onChange={() => setPayment('bkash')} className="mr-2" />
                bKash
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={() => setPayment('card')} className="mr-2" />
                Card (online)
              </label>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="muted">Subtotal</div>
              <div className="font-medium">৳ <span>{subtotal.toFixed(2)}</span></div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="muted">Delivery</div>
              <div className="font-medium">৳ <span>{delivery.toFixed(2)}</span></div>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold mt-3">
              <div>Total</div>
              <div>৳ <span>{grandTotal.toFixed(2)}</span></div>
            </div>
            <button onClick={placeOrder} id="placeOrder" className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded">Place Order</button>
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}


