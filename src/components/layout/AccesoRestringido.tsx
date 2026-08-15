import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ALCANCE_POR_ROL, rutaInicialDe } from '../../lib/permisos';
import { RUTAS } from '../../routes';

export function AccesoRestringido({ rol, ruta }: { rol: string | null; ruta: string }) {
  const navigate = useNavigate();
  const modulo = RUTAS.find((r) => r.path === ruta);
  const inicio = rutaInicialDe(rol);
  const moduloInicio = RUTAS.find((r) => r.path === inicio);

  return (
    <div className="flex items-center justify-center h-full py-10">
      <div className="card max-w-md w-full p-7 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
          <ShieldAlert size={26} />
        </div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] mb-1">Acceso restringido</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          El módulo <strong>{modulo?.label ?? ruta}</strong> no forma parte del alcance del perfil{' '}
          <strong>{rol}</strong>.
        </p>
        <div className="rounded-lg bg-slate-50 border border-[var(--border-subtle)] px-3 py-2.5 text-xs text-[var(--text-secondary)] mb-4 text-left">
          <span className="font-semibold text-[var(--text-primary)]">Alcance del perfil:</span>{' '}
          {rol ? ALCANCE_POR_ROL[rol] ?? 'No definido.' : 'Sin sesión activa.'}
        </div>
        <button
          onClick={() => navigate(inicio)}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white"
          style={{ background: 'var(--color-brand-700)' }}
        >
          Ir a {moduloInicio?.label ?? 'mi pantalla de inicio'}
        </button>
        <p className="text-[11px] text-[var(--text-muted)] mt-3">
          Segregación de funciones (RBAC) · Para cambiar de perfil, cierre sesión y vuelva a ingresar.
        </p>
      </div>
    </div>
  );
}
