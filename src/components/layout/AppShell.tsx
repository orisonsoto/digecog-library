import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PanelDerecho } from './PanelDerecho';
import { AccesoRestringido } from './AccesoRestringido';
import { useAppStore } from '../../store/appStore';
import { puedeAcceder } from '../../lib/permisos';

export function AppShell() {
  const autenticado = useAppStore((s) => s.autenticado);
  const rol = useAppStore((s) => s.rol);
  const location = useLocation();

  // Guardián de sesión (demo): sin sesión activa se redirige al acceso institucional.
  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  // Guardián de rol: cubre también la navegación directa por URL.
  const permitido = puedeAcceder(rol, location.pathname);

  return (
    // h-dvh (no h-screen) para que la barra de direcciones del navegador móvil no recorte el contenido.
    <div className="flex h-dvh w-full overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-3 md:p-5">
          {permitido ? <Outlet /> : <AccesoRestringido rol={rol} ruta={location.pathname} />}
        </main>
      </div>
      <PanelDerecho />
    </div>
  );
}
