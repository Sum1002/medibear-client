import { useState, useEffect } from "react";
import { loginUser } from "../service/user";
import toast, {Toaster} from 'react-hot-toast';


export default function LoginForm() {
  // Login states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password states
  const [view, setView] = useState("login"); // login, forgotPassword, verifyToken, resetPassword
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Login function
  const onSubmit = async () => {
    const payload = {
      identifier,
      password,
    }
    try {
      const resp = await loginUser(payload);
      localStorage.setItem('auth_token', resp.data.access_token);
      localStorage.setItem('logged_in_user', JSON.stringify(resp.data.user));
      toast.success('Login successful!');
      // Redirect based on role
      const role = resp.data.user?.register_as || resp.data.user?.role;
      if (role === 'admin' || role === 'administrator') {
        location.href = '/admin/dashboard';
      } else {
        location.href = '/';
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  }

  // Send reset token to email
  const sendResetToken = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/password/send-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setCountdown(3600); // 60 minutes
        setView('verifyToken');
      } else {
        toast.error(data.message || 'Failed to send reset token');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify reset token
  const verifyResetToken = async () => {
    if (!token) {
      toast.error('Please enter the reset token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/password/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        setView('resetPassword');
      } else {
        toast.error(data.message || 'Invalid token');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        // Reset states and go back to login
        setEmail('');
        setToken('');
        setNewPassword('');
        setConfirmPassword('');
        setCountdown(0);
        setView('login');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render login view
  const renderLogin = () => (
    <>
      <div className="flex flex-col items-center mb-6">
        <img
          src="src/assets/medibear-main-logo.png"
          alt="Logo"
          className="h-16 mb-2"
        />
        <h2 className="text-2xl font-bold text-blue-900 mb-1">Welcome back</h2>
        <p className="text-gray-500">Sign in to access your MediBear account</p>
      </div>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="identifier">
            Email or Phone Number
          </label>
          <input
            type="text"
            id="identifier"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
            placeholder="Your Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4 text-right">
          <button
            type="button"
            onClick={() => setView('forgotPassword')}
            className="text-blue-700 text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-2 bg-linear-to-r from-blue-950 to-blue-700 hover:from-blue-800 text-white rounded font-semibold shadow hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-700 underline">
          Register
        </a>
      </div>
    </>
  );

  // Render forgot password view (enter email)
  const renderForgotPassword = () => (
    <>
      <div className="flex flex-col items-center mb-6">
        <img
          src="src/assets/medibear-main-logo.png"
          alt="Logo"
          className="h-16 mb-2"
        />
        <h2 className="text-2xl font-bold text-blue-900 mb-1">Forgot Password</h2>
        <p className="text-gray-500">Enter your email to receive a reset token</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={sendResetToken}
        disabled={loading}
        className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Reset Token'}
      </button>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setView('login')}
          className="text-blue-700 text-sm hover:underline"
        >
          Back to Login
        </button>
      </div>
    </>
  );

  // Render verify token view
  const renderVerifyToken = () => (
    <>
      <div className="flex flex-col items-center mb-6">
        <img
          src="src/assets/medibear-main-logo.png"
          alt="Logo"
          className="h-16 mb-2"
        />
        <h2 className="text-2xl font-bold text-blue-900 mb-1">Verify Token</h2>
        <p className="text-gray-500">Enter the token sent to your email</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="token">
          Reset Token
        </label>
        <input
          type="text"
          id="token"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none font-mono"
          placeholder="Enter the token from your email"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>
      {countdown > 0 && (
        <div className="mb-4 text-center text-sm text-gray-600">
          Token expires in: <span className="font-semibold">{formatTime(countdown)}</span>
        </div>
      )}
      <button
        type="button"
        onClick={verifyResetToken}
        disabled={loading}
        className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed mb-2"
      >
        {loading ? 'Verifying...' : 'Verify Token'}
      </button>
      <button
        type="button"
        onClick={sendResetToken}
        disabled={loading || countdown > 0}
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Resend Token
      </button>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setView('login');
            setCountdown(0);
          }}
          className="text-blue-700 text-sm hover:underline"
        >
          Back to Login
        </button>
      </div>
    </>
  );

  // Render reset password view
  const renderResetPassword = () => (
    <>
      <div className="flex flex-col items-center mb-6">
        <img
          src="src/assets/medibear-main-logo.png"
          alt="Logo"
          className="h-16 mb-2"
        />
        <h2 className="text-2xl font-bold text-blue-900 mb-1">Reset Password</h2>
        <p className="text-gray-500">Enter your new password</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="newPassword">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Enter new password (min 6 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={resetPassword}
        disabled={loading}
        className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </>
  );

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        {view === 'login' && renderLogin()}
        {view === 'forgotPassword' && renderForgotPassword()}
        {view === 'verifyToken' && renderVerifyToken()}
        {view === 'resetPassword' && renderResetPassword()}
      </div>
    </div>
  );
}
