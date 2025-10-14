import { useState } from 'react';
import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderForm from './pages/OrderForm';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Track from './pages/Track';
import Register from './pages/Register';

const navLinkClass = ({ isActive }) =>
  `rounded px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
  }`;

function Layout() {
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-900 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="text-xl font-semibold tracking-tight">
            BasaGas
          </NavLink>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/order" className={navLinkClass}>
              Order
            </NavLink>
            <NavLink to="/pricing" className={navLinkClass}>
              Pricing
            </NavLink>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <div
              className="relative"
              tabIndex={0}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsTrackOpen(false);
                }
              }}
            >
              <button
                type="button"
                className={`flex items-center gap-1 rounded px-3 py-2 text-sm font-medium transition ${
                  isTrackOpen ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
                onClick={() => setIsTrackOpen((prev) => !prev)}
              >
                Track
                <span aria-hidden="true">▾</span>
              </button>
              {isTrackOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-blue-100 bg-white py-1 text-gray-800 shadow-lg">
                  <NavLink
                    to="/track?view=order"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-blue-50 ${isActive ? 'font-semibold text-blue-700' : ''}`
                    }
                    onClick={() => setIsTrackOpen(false)}
                  >
                    Track My Order
                  </NavLink>
                  <NavLink
                    to="/track?view=link"
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-blue-50 ${isActive ? 'font-semibold text-blue-700' : ''}`
                    }
                    onClick={() => setIsTrackOpen(false)}
                  >
                    Link My Phone
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track" element={<Track />} />
      </Route>
    </Routes>
  );
}
