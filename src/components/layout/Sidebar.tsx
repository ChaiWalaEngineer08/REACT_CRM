import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Clients', to: '/clients' },
  ];
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-800 text-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <span className="text-xl font-semibold">CRM Panel</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium 
               ${
                 isActive
                   ? 'bg-gray-900 text-white'
                   : 'text-gray-400 hover:bg-gray-700 hover:text-white'
               } transition`
            }
          >
            {link.name}
          </NavLink>
        ))}

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
