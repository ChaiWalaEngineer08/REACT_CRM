import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { lazy } from 'react';

import ChunkBoundary from '../components/ChunkBoundary';   // ← this is the wrapper
import { useAuth } from '../context/AuthContext';

/* ── lazy pages ─────────────────────────────────────────── */
const Dashboard  = lazy(() => import('../pages/Dashboard'));
const Clients    = lazy(() => import('../pages/Clients'));
const Profile    = lazy(() => import('../pages/Profile'));
const Login      = lazy(() => import('../pages/Login'));
const NotFound   = lazy(() => import('../pages/NotFound'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));

/* ── auth guard ─────────────────────────────────────────── */
function PrivateShell() {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

/* ── router ─────────────────────────────────────────────── */
export default function AppRouter() {
  return (
    <BrowserRouter>
      {/*  Wrap **once**: handles both loading & load-time errors  */}
      <ChunkBoundary>
        <Routes>
          {/* public */}
          <Route path="/"      element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* private */}
          <Route element={<PrivateShell />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients"   element={<Clients />} />
              <Route path="/profile"   element={<Profile />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ChunkBoundary>
    </BrowserRouter>
  );
}
