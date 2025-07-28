import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-7xl font-extrabold text-indigo-600 drop-shadow-sm">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h2>
      <p className="mt-2 text-gray-500 text-center max-w-sm">
        Sorry, we couldn’t find the page you’re looking for.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition"
      >
        Go to Dashboard
      </Link>

      <Link
        to="/login"
        className="mt-3 text-sm text-gray-500 hover:text-indigo-600 transition"
      >
        or return to Login
      </Link>
    </div>
  );
}
