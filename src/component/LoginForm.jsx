import { useState } from "react";
export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    // Handle form submission logic here
    const payload = {
      phone,
      password,
    }
    console.log('Form submitted:', payload);
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
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
            <label className="block text-gray-700 mb-2" for="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="Your Phone Number"
              onChange={(e) => {
                setPhone(e.target.value)
              }}
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
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
          <button
            type="button"
            onClick={onSubmit}
            className="w-full py-2 bg-gradient-to-r from-blue-950 to-blue-700 hover:from-blue-800 to-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          Don’t have an account?
          <a href="/register" className="text-blue-700 underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
