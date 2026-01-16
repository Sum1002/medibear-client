import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import Navbar from './Navbar';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Clear client-side cart after successful payment
    try {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      // non-fatal
      // eslint-disable-next-line no-console
      console.error('Failed to clear cart on payment success', e);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/my-orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully and payment has been confirmed.
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-blue-600">#{orderId}</p>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Order confirmation sent to your email</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Pharmacy will process your order shortly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>You'll receive updates via notifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track your order status anytime</span>
              </li>
            </ul>
          </div>

          {/* Countdown */}
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to My Orders in <span className="font-bold text-blue-600">{countdown}</span> seconds...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/my-orders')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Support Link */}
          <p className="text-xs text-gray-500 mt-6">
            Need help?{' '}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
