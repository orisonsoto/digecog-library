import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PanelDerecho } from './PanelDerecho';
import { useAppStore } from '../../store/appStore';

export function AppShell() {
  const autenticado = useAppStore((s) => s.autenticado);
  const location = useLocation();

  // Guardián de sesión (demo): sin sesión activa se redirige al acceso institucional.
  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
      <PanelDerecho />
    </div>
  );
}
