import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function HomePage() {
  return (
    <div className="grid gap-8 rounded-lg bg-white p-8 shadow-md md:grid-cols-2 md:items-center">
      <div className="space-y-4 text-left">
        <img src={logo} alt="BasaGas" className="w-24" />
        <h1 className="text-3xl font-semibold text-gray-900">Smart LPG delivery for homes and businesses</h1>
        <p className="text-gray-600">
          Place refill orders, register your delivery crew, and follow every cylinder from depot to doorstep. Our Google
          Maps-powered tools keep your team and customers aligned in real time.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            to="/order"
          >
            Order a refill
          </Link>
          <Link
            className="rounded border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            to="/track"
          >
            Track deliveries
          </Link>
        </div>
      </div>
      <div className="space-y-4 text-sm text-gray-600">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Highlights</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Precise address capture with Google Places autocomplete.</li>
            <li>One-tap location sharing for both pickup and drop-off points.</li>
            <li>Live driver trail visualised on a persistent background map.</li>
            <li>Role-based registration for customers and delivery partners.</li>
          </ul>
        </div>
        <p>
          Ready to digitise your LPG operation? Start by creating an account on the <Link className="text-blue-600 hover:text-blue-800" to="/register">registration page</Link> and link your
          delivery devices under the Track menu.
        </p>
      </div>
    </div>
  );
}
