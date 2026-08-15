import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { PERIODOS } from '../../data/periodos';
import { INSTITUCIONES } from '../../data/generator';
import { ALERTAS } from '../../data/generator';

export function Topbar() {
  const periodoKey = useAppStore((s) => s.periodoKey);
  const setPeriodoKey = useAppStore((s) => s.setPeriodoKey);
  const miaAbierta = useAppStore((s) => s.miaAbierta);
  const setMiaAbierta = useAppStore((s) => s.setMiaAbierta);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [mostrarNotif, setMostrarNotif] = useState(false);
  const navigate = useNavigate();

  const resultados = useMemo(() => {
    if (busqueda.trim().length < 2) return [];
    const q = busqueda.toLowerCase();
    return INSTITUCIONES.filter((i) => i.nombre.toLowerCase().includes(q) || i.siglas.toLowerCase().includes(q)).slice(0, 8);
  }, [busqueda]);

  const alertasNoAtendidas = ALERTAS.filter((a) => !a.atendida);

  return (
    <header className="h-16 shrink-0 flex items-center gap-4 px-5 border-b border-[var(--border-subtle)] bg-white">
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setMostrarResultados(true); }}
          onFocus={() => setMostrarResultados(true)}
          onBlur={() => setTimeout(() => setMostrarResultados(false), 150)}
          placeholder="Buscar institución, cuenta contable, indicador..."
          className="w-full rounded-lg border border-[var(--border-subtle)] bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none focus:bg-white focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
        />
        {mostrarResultados && resultados.length > 0 && (
          <div className="absolute z-40 mt-1 w-full card overflow-hidden">
            {resultados.map((r) => (
              <button
                key={r.id}
                onClick={() => { navigate(`/institucion/${r.id}`); setBusqueda(''); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-brand-50)] flex items-center justify-between"
              >
                <span>{r.nombre}</span>
                <span className="text-xs text-[var(--text-muted)]">{r.siglas}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-sm">
          <span className="text-[var(--text-muted)] text-xs">Período:</span>
          <select
            value={periodoKey}
            onChange={(e) => setPeriodoKey(e.target.value)}
            className="outline-none bg-transparent font-medium text-[var(--text-primary)] cursor-pointer"
          >
            {[...PERIODOS].reverse().map((p) => (
              <option key={p.key} value={p.key}>{p.key}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <button
            onClick={() => setMostrarNotif((v) => !v)}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[var(--text-secondary)]"
          >
            <Bell size={17} />
            {alertasNoAtendidas.length > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
          {mostrarNotif && (
            <div className="absolute right-0 mt-2 w-80 card overflow-hidden z-40">
              <div className="px-3 py-2 border-b border-[var(--border-subtle)] font-semibold text-sm flex items-center justify-between">
                Alertas recientes <span className="text-xs text-[var(--text-muted)]">{alertasNoAtendidas.length} sin atender</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {ALERTAS.slice(0, 6).map((a) => (
                  <div key={a.id} className="px-3 py-2 text-xs border-b border-[var(--border-subtle)] last:border-0">
                    <div className="font-medium text-[var(--text-primary)]">{a.modulo}</div>
                    <div className="text-[var(--text-secondary)]">{a.mensaje}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => { navigate('/alertas'); setMostrarNotif(false); }} className="w-full text-center py-2 text-xs font-semibold text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)]">
                Ver Centro de Alertas →
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setMiaAbierta(!miaAbierta)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-accent-teal))' }}
        >
          ✦ Mía AI
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)] ml-1">
          <div className="h-8 w-8 rounded-full bg-[var(--color-brand-100)] flex items-center justify-center text-[var(--color-brand-700)]">
            <User size={16} />
          </div>
          <div className="hidden md:block leading-tight">
            <div className="text-xs font-semibold">Dirección General</div>
            <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5">Sesión demo <ChevronDown size={10} /></div>
          </div>
        </div>
      </div>
    </header>
  );
}
