import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy } from 'react';

import ChunkBoundary from '../components/ChunkBoundary';
import { useAuth } from '../context/AuthContext';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Clients = lazy(() => import('../pages/Clients'));
const Profile = lazy(() => import('../pages/Profile'));
const Login = lazy(() => import('../pages/Login'));
const NotFound = lazy(() => import('../pages/NotFound'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));

function PrivateShell() {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ChunkBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateShell />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ChunkBoundary>
    </BrowserRouter>
  );
}
