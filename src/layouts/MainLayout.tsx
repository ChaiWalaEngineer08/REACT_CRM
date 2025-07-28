import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import SessionExpiryDialog from '../components/ui/SessionExpiryDialog';

const MainLayout = () => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <SessionExpiryDialog/>
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  </div>
);
export default MainLayout;
