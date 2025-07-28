import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';


function useClickOutside<T extends HTMLElement>(cb: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    addEventListener('mousedown', h);
    return () => removeEventListener('mousedown', h);
  }, [cb]);
  return ref;
}


export default function Navbar() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();


  const [mobileOpen, setMobile] = useState(false);
  const [profileOpen, setProfile] = useState(false);
  const profileRef = useClickOutside<HTMLDivElement>(() => setProfile(false));


  const [q, setQ] = useState('');
  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/clients?query=${encodeURIComponent(q.trim())}`);
    setQ('');
  }


  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/clients', label: 'Clients' },
  ] as const;

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 shadow-sm">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex items-center h-16">


        <button
          className="md:hidden mr-2 p-2 rounded text-gray-600 hover:bg-gray-100"
          onClick={() => setMobile(o => !o)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>


        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/dashboard"
            className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            React-CRM
          </Link>
        </motion.div>


        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 mx-8 max-w-lg"
        >
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search clients…"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Search clients"
          />
        </form>


        <div className="ml-auto flex items-center gap-4">

          <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 17h5l-1.4-1.4A2 2 0 0118 14V9a6 6 0 10-12 0v5a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
            </svg>

            <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-rose-500" />
          </button>


          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfile(o => !o)}
              className="flex items-center rounded-full hover:ring-2 hover:ring-indigo-400/70 focus:outline-none"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            </button>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg ring-1 ring-black/5 origin-top-right overflow-hidden"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setProfile(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>


      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <ul className="px-4 py-3 space-y-1">
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={clsx(
                    'block px-3 py-2 rounded-lg',
                    pathname === path ? 'bg-indigo-50 text-indigo-600 font-medium' : 'hover:bg-gray-100'
                  )}
                  onClick={() => setMobile(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
