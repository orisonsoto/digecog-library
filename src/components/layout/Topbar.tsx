import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { puedeAcceder } from '../../lib/permisos';
import { PERIODOS } from '../../data/periodos';
import { INSTITUCIONES } from '../../data/generator';
import { ALERTAS } from '../../data/generator';

export function Topbar() {
  const periodoKey = useAppStore((s) => s.periodoKey);
  const setPeriodoKey = useAppStore((s) => s.setPeriodoKey);
  const miaAbierta = useAppStore((s) => s.miaAbierta);
  const setMiaAbierta = useAppStore((s) => s.setMiaAbierta);
  const setPanelDerechoAbierto = useAppStore((s) => s.setPanelDerechoAbierto);
  const setMenuMovilAbierto = useAppStore((s) => s.setMenuMovilAbierto);
  const usuario = useAppStore((s) => s.usuario);
  const rol = useAppStore((s) => s.rol);
  const cerrarSesion = useAppStore((s) => s.cerrarSesion);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [mostrarNotif, setMostrarNotif] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [busquedaMovilAbierta, setBusquedaMovilAbierta] = useState(false);
  const navigate = useNavigate();

  const resultados = useMemo(() => {
    if (busqueda.trim().length < 2) return [];
    const q = busqueda.toLowerCase();
    return INSTITUCIONES.filter((i) => i.nombre.toLowerCase().includes(q) || i.siglas.toLowerCase().includes(q)).slice(0, 8);
  }, [busqueda]);

  const alertasNoAtendidas = ALERTAS.filter((a) => !a.atendida);
  const puedeVerAlertas = puedeAcceder(rol, '/alertas');
  const puedeUsarMia = puedeAcceder(rol, '/mia');

  function abrirMia() {
    setMiaAbierta(!miaAbierta);
    setPanelDerechoAbierto(true);
  }

  const campoBusqueda = (autoFocus: boolean) => (
    <div className="relative w-full">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        autoFocus={autoFocus}
        value={busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setMostrarResultados(true); }}
        onFocus={() => setMostrarResultados(true)}
        onBlur={() => setTimeout(() => setMostrarResultados(false), 150)}
        placeholder="Buscar institución, cuenta, indicador..."
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-slate-50 pl-9 pr-3 py-2 text-sm outline-none focus:bg-white focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
      />
      {mostrarResultados && resultados.length > 0 && (
        <div className="absolute z-40 mt-1 w-full card overflow-hidden">
          {resultados.map((r) => (
            <button
              key={r.id}
              onClick={() => { navigate(`/institucion/${r.id}`); setBusqueda(''); setBusquedaMovilAbierta(false); }}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-[var(--color-brand-50)] flex items-center justify-between gap-2"
            >
              <span className="truncate">{r.nombre}</span>
              <span className="text-xs text-[var(--text-muted)] shrink-0">{r.siglas}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="shrink-0 border-b border-[var(--border-subtle)] bg-white">
      <div className="h-16 flex items-center gap-2 md:gap-4 px-3 md:px-5">
        {/* Hamburguesa: solo móvil/tablet */}
        <button
          onClick={() => setMenuMovilAbierto(true)}
          aria-label="Abrir menú de navegación"
          className="lg:hidden h-10 w-10 shrink-0 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[var(--text-secondary)]"
        >
          <Menu size={20} />
        </button>

        {/* Marca: visible solo en móvil, donde el sidebar está oculto */}
        <div className="lg:hidden flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-[var(--color-brand-900)] text-white flex items-center justify-center font-bold text-xs">D</div>
          <span className="font-bold text-sm text-[var(--color-brand-900)] truncate hidden sm:block">DIGECOG 360°</span>
        </div>

        {/* Búsqueda: inline en escritorio */}
        <div className="hidden lg:block w-full max-w-md">{campoBusqueda(false)}</div>

        <div className="flex items-center gap-1 md:gap-1.5 ml-auto">
          {/* Búsqueda: botón que despliega una fila propia en móvil */}
          <button
            onClick={() => setBusquedaMovilAbierta((v) => !v)}
            aria-label="Buscar"
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[var(--text-secondary)]"
          >
            {busquedaMovilAbierta ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Período: etiqueta oculta en pantallas chicas */}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] px-2 md:px-2.5 py-1.5 text-sm">
            <span className="text-[var(--text-muted)] text-xs hidden md:inline">Período:</span>
            <select
              value={periodoKey}
              onChange={(e) => setPeriodoKey(e.target.value)}
              aria-label="Período contable"
              className="outline-none bg-transparent font-medium text-[var(--text-primary)] cursor-pointer text-xs md:text-sm"
            >
              {[...PERIODOS].reverse().map((p) => (
                <option key={p.key} value={p.key}>{p.key}</option>
              ))}
            </select>
          </div>

          <div className={`relative ${puedeVerAlertas ? '' : 'hidden'}`}>
            <button
              onClick={() => setMostrarNotif((v) => !v)}
              aria-label="Alertas"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[var(--text-secondary)]"
            >
              <Bell size={17} />
              {alertasNoAtendidas.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            {mostrarNotif && (
              <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] card overflow-hidden z-40">
                <div className="px-3 py-2 border-b border-[var(--border-subtle)] font-semibold text-sm flex items-center justify-between gap-2">
                  Alertas recientes <span className="text-xs text-[var(--text-muted)] shrink-0">{alertasNoAtendidas.length} sin atender</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {ALERTAS.slice(0, 6).map((a) => (
                    <div key={a.id} className="px-3 py-2 text-xs border-b border-[var(--border-subtle)] last:border-0">
                      <div className="font-medium text-[var(--text-primary)]">{a.modulo}</div>
                      <div className="text-[var(--text-secondary)]">{a.mensaje}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { navigate('/alertas'); setMostrarNotif(false); }} className="w-full text-center py-2.5 text-xs font-semibold text-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)]">
                  Ver Centro de Alertas →
                </button>
              </div>
            )}
          </div>

          {/* Mía AI: icono en móvil, botón con texto en escritorio */}
          <button
            onClick={abrirMia}
            aria-label="Abrir copiloto Mía AI"
            className={`h-10 w-10 md:h-auto md:w-auto items-center justify-center gap-1.5 rounded-lg md:px-3 md:py-1.5 text-sm font-semibold text-white shrink-0 ${puedeUsarMia ? 'flex' : 'hidden'}`}
            style={{ background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-accent-teal))' }}
          >
            <Sparkles size={16} className="md:hidden" />
            <span className="hidden md:inline">✦ Mía AI</span>
          </button>

          <div className="relative md:pl-2 md:border-l border-[var(--border-subtle)] md:ml-1">
            <button onClick={() => setMostrarPerfil((v) => !v)} aria-label="Perfil y sesión" className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-slate-50">
              <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--color-brand-100)] flex items-center justify-center text-[var(--color-brand-700)]">
                <User size={16} />
              </div>
              <div className="hidden xl:block leading-tight text-left">
                <div className="text-xs font-semibold">{rol ?? 'Sesión demo'}</div>
                <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5">{usuario ?? 'invitado'} <ChevronDown size={10} /></div>
              </div>
            </button>
            {mostrarPerfil && (
              <div className="absolute right-0 mt-2 w-[min(15rem,calc(100vw-1.5rem))] card overflow-hidden z-40">
                <div className="px-3 py-2.5 border-b border-[var(--border-subtle)]">
                  <div className="text-xs font-semibold text-[var(--text-primary)] break-all">{usuario}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{rol}</div>
                </div>
                <button
                  onClick={() => { cerrarSesion(); setMostrarPerfil(false); navigate('/login'); }}
                  className="w-full flex items-center gap-2 px-3 py-3 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={14} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fila de búsqueda desplegable en móvil */}
      {busquedaMovilAbierta && (
        <div className="lg:hidden px-3 pb-3">{campoBusqueda(true)}</div>
      )}
    </header>
  );
}
