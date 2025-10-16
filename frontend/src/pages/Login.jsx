import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in ${email}`);
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button className="w-full rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700" type="submit">
          Login
        </button>
      </form>
      <p className="text-sm text-gray-600">
        Need an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          Register here
        </Link>
      </p>
    </div>
  );
}
