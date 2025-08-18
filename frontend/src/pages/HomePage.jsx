import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function HomePage() {
  return (
    <div className="p-4 text-center">
      <img src={logo} alt="BasaGas" className="mx-auto w-24 mb-4" />
      <h1 className="text-2xl font-bold mb-4">Welcome to BasaGas</h1>
      <nav className="space-x-4">
        <Link className="text-blue-500" to="/order">Order Form</Link>
        <Link className="text-blue-500" to="/pricing">Pricing</Link>
        <Link className="text-blue-500" to="/login">Login</Link>
        <Link className="text-blue-500" to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}
