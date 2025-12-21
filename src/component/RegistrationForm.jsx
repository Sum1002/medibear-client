import { useState } from 'react';
import axios from 'axios';
import { registerUser } from '../service/user';
import toast, {Toaster} from 'react-hot-toast';

export default function RegistrationForm() {
  const [registerAs, setRegisterAs] = useState('user');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [pharmacyLicenceNumber, setPharmacyLicenceNumber] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacistRegistrationNumber, setPharmacistRegistrationNumber] = useState('');


  const onSubmit = async () => {
    // Handle form submission logic here
    const payload = {
      registerAs,
      fullName,
      phone,
      password,
    }
    try {
      const resp = await registerUser(payload);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  }


  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="src/assets/medibear-main-logo.png"
            alt="Logo"
            className="h-16 mb-2"
          />
          <h2 className="text-2xl font-bold text-blue-900 mb-1">
            Registration Form
          </h2>
        </div>
        <form>
          <div className="mb-4">
            <span className="block text-gray-700 mb-2">Register As</span>
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="registerAs"
                  value="user"
                  checked = {registerAs === 'user'}
                  onChange={() => {
                    setRegisterAs("user")
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">User</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="registerAs"
                  value="pharmacy"
                  checked = {registerAs === 'pharmacy'}
                  onChange={() => {
                    setRegisterAs("pharmacy")
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Pharmacy</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullname">
              {registerAs === 'user' ? 'Full Name' : 'Pharmacy Name'}
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="Your Full Name"
              onChange={(e) => {
                setFullName(e.target.value)
              }}
              value={fullName}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
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
              value={phone}
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
              value={password}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="Your Email"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
            />
          </div>
          {registerAs === 'pharmacy' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="pharmacyLicenceNumber">
                  Pharmacy Licence Number
                </label>
                <input
                  type="text"
                  id="pharmacyLicenceNumber"
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Your Pharmacy Licence Number"
                  onChange={(e) => {
                    setPharmacyLicenceNumber(e.target.value)
                  }}
                  value={pharmacyLicenceNumber}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="pharmacyAddress">
                  Pharmacy Address
                </label>
                <input
                  type="text"
                  id="pharmacyAddress"
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Your Pharmacy Address"
                  onChange={(e) => {
                    setPharmacyAddress(e.target.value)
                  }}
                  value={pharmacyAddress}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="pharmacistRegistrationNumber">
                  Pharmacist Registration Number
                </label>
                <input
                  type="text"
                  id="pharmacistRegistrationNumber"
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Your Pharmacist Registration Number"
                  onChange={(e) => {
                    setPharmacistRegistrationNumber(e.target.value)
                  }}
                  value={pharmacistRegistrationNumber}
                />
              </div>
            </>
          )}
          <button
            type="button"
            onClick={onSubmit}
            className="w-full py-2 bg-linear-to-r from-blue-950 to-blue-700 hover:from-blue-800 text-white rounded font-semibold shadow hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          Already have an account?
          <a href="/login" className="text-blue-700 underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
