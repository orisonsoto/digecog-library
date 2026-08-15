import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { GRUPOS_ORDEN, RUTAS } from '../../routes';
import { useAppStore } from '../../store/appStore';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Sidebar() {
  const colapsado = useAppStore((s) => s.sidebarColapsado);
  const toggle = useAppStore((s) => s.toggleSidebar);

  return (
    <aside
      className={clsx(
        'flex flex-col shrink-0 h-full text-white transition-all duration-200 overflow-y-auto',
        colapsado ? 'w-[64px]' : 'w-[248px]',
      )}
      style={{ background: 'linear-gradient(180deg, var(--color-brand-900), var(--color-brand-950))' }}
    >
      <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm shrink-0">
          D
        </div>
        {!colapsado && (
          <div className="leading-tight overflow-hidden">
            <div className="font-bold text-[13px] tracking-wide">DIGECOG 360°</div>
            <div className="text-[10px] text-white/50">Plataforma Integral de Gestión</div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-4">
        {GRUPOS_ORDEN.map((grupo) => {
          const items = RUTAS.filter((r) => r.grupo === grupo);
          if (items.length === 0) return null;
          return (
            <div key={grupo}>
              {!colapsado && (
                <div className="px-2.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-white/35">{grupo}</div>
              )}
              <div className="space-y-0.5">
                {items.map((it) => (
                  <NavLink
                    key={it.path}
                    to={it.path}
                    end={it.path === '/'}
                    title={colapsado ? it.label : undefined}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                        isActive ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white',
                      )
                    }
                  >
                    <it.icon size={17} className="shrink-0" />
                    {!colapsado && <span className="truncate">{it.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <button
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-3 text-white/50 hover:text-white text-xs border-t border-white/10"
      >
        {colapsado ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Colapsar</>}
      </button>
    </aside>
  );
}
