import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialForm = {
  username: '',
  email: '',
  phone: '',
  role: 'customer',
  pickupLocation: '',
  vehicleDetails: '',
  password: '',
  confirmPassword: '',
  notes: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('Registration saved locally. Connect to your backend to persist this information.');
    setForm(initialForm);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
      <p className="mt-2 text-sm text-gray-600">
        Register so that we can tailor deliveries to your preferred locations and contact you while we are on the move.
      </p>

      <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Username
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Email
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Phone number
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="e.g. +27 82 555 0123"
            autoComplete="tel"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Primary pick-up location (optional)
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="pickupLocation"
            value={form.pickupLocation}
            onChange={handleChange}
            placeholder="Complex name or GPS address"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Role
          <select
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="customer">Customer</option>
            <option value="deliverer">Deliverer</option>
          </select>
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Delivery vehicle / equipment
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="vehicleDetails"
            value={form.vehicleDetails}
            onChange={handleChange}
            placeholder="Bakkie, bike, trailer, etc."
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Password
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Confirm password
          <input
            className="mt-1 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </label>
        <label className="md:col-span-2 flex flex-col text-sm font-medium text-gray-700">
          Delivery notes for our team
          <textarea
            className="mt-1 min-h-[96px] rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Gate codes, preferred delivery hours, or storage instructions"
          />
        </label>
        <button
          type="submit"
          className="md:col-span-2 rounded bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
        >
          Create account
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-blue-700">{message}</p>}

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Back to login
        </Link>
      </p>
    </div>
  );
}
