import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { GRUPOS_ORDEN, RUTAS } from '../../routes';
import { useAppStore } from '../../store/appStore';
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react';

export function Sidebar() {
  const colapsado = useAppStore((s) => s.sidebarColapsado);
  const toggle = useAppStore((s) => s.toggleSidebar);
  const menuMovilAbierto = useAppStore((s) => s.menuMovilAbierto);
  const setMenuMovilAbierto = useAppStore((s) => s.setMenuMovilAbierto);

  // En móvil (< lg) el sidebar siempre se muestra expandido dentro del drawer:
  // colapsarlo a iconos solo tiene sentido en escritorio.
  const contenido = (esMovil: boolean) => {
    const compacto = !esMovil && colapsado;
    return (
      <>
        <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-white/10">
          <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm shrink-0">
            D
          </div>
          {!compacto && (
            <div className="leading-tight overflow-hidden">
              <div className="font-bold text-[13px] tracking-wide">DIGECOG 360°</div>
              <div className="text-[10px] text-white/50">Plataforma Integral de Gestión</div>
            </div>
          )}
          {esMovil && (
            <button
              onClick={() => setMenuMovilAbierto(false)}
              aria-label="Cerrar menú"
              className="ml-auto h-9 w-9 flex items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
          {GRUPOS_ORDEN.map((grupo) => {
            const items = RUTAS.filter((r) => r.grupo === grupo);
            if (items.length === 0) return null;
            return (
              <div key={grupo}>
                {!compacto && (
                  <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-white/35">{grupo}</div>
                )}
                <div className="space-y-0.5">
                  {items.map((it) => (
                    <NavLink
                      key={it.path}
                      to={it.path}
                      end={it.path === '/'}
                      title={compacto ? it.label : undefined}
                      onClick={() => setMenuMovilAbierto(false)}
                      className={({ isActive }) =>
                        clsx(
                          // min-h de 44px en móvil para cumplir el tamaño mínimo táctil
                          'flex items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors',
                          esMovil ? 'py-2.5 min-h-11' : 'py-2',
                          isActive ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white',
                        )
                      }
                    >
                      <it.icon size={17} className="shrink-0" />
                      {!compacto && <span className="truncate">{it.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {!esMovil && (
          <button
            onClick={toggle}
            className="flex items-center gap-2 px-4 py-3 text-white/50 hover:text-white text-xs border-t border-white/10 shrink-0"
          >
            {colapsado ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Colapsar</>}
          </button>
        )}
      </>
    );
  };

  const fondo = { background: 'linear-gradient(180deg, var(--color-brand-900), var(--color-brand-950))' };

  return (
    <>
      {/* Escritorio (lg+): sidebar fijo en el flujo del layout */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col shrink-0 h-full text-white transition-all duration-200',
          colapsado ? 'w-[64px]' : 'w-[248px]',
        )}
        style={fondo}
      >
        {contenido(false)}
      </aside>

      {/* Móvil / tablet (< lg): drawer superpuesto */}
      <div className="lg:hidden">
        <div
          onClick={() => setMenuMovilAbierto(false)}
          className={clsx(
            'fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-200',
            menuMovilAbierto ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden="true"
        />
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-50 flex w-[264px] max-w-[85vw] flex-col text-white shadow-2xl transition-transform duration-200',
            menuMovilAbierto ? 'translate-x-0' : '-translate-x-full',
          )}
          style={fondo}
          aria-hidden={!menuMovilAbierto}
        >
          {contenido(true)}
        </aside>
      </div>
    </>
  );
}
