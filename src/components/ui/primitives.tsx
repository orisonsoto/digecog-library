import type { ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'clsx';

// ---------------------------------------------------------------------------
export function DemoTag({ label = 'DEMO — DATOS SIMULADOS' }: { label?: string }) {
  return <span className="demo-tag">● {label}</span>;
}
export function RealTag({ label = 'DATO REAL' }: { label?: string }) {
  return <span className="real-tag">● {label}</span>;
}

// ---------------------------------------------------------------------------
type BadgeTono = 'neutral' | 'exito' | 'alerta' | 'peligro' | 'info';
const TONOS: Record<BadgeTono, string> = {
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  exito: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  alerta: 'bg-amber-50 text-amber-700 border-amber-200',
  peligro: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};
export function Badge({ children, tono = 'neutral', className }: { children: ReactNode; tono?: BadgeTono; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', TONOS[tono], className)}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
export function Semaforo({ nivel }: { nivel: 'Verde' | 'Amarillo' | 'Rojo' }) {
  const color = nivel === 'Verde' ? 'bg-emerald-500' : nivel === 'Amarillo' ? 'bg-amber-400' : 'bg-red-500';
  return <span className={clsx('inline-block h-2.5 w-2.5 rounded-full', color)} title={nivel} />;
}

// ---------------------------------------------------------------------------
export function KpiCard({
  titulo, valor, subtitulo, tendencia, esDemo = true, icono, tono = 'neutral', sparkline,
}: {
  titulo: string; valor: string; subtitulo?: string; tendencia?: { valor: number; label?: string };
  esDemo?: boolean; icono?: ReactNode; tono?: 'neutral' | 'brand'; sparkline?: number[];
}) {
  return (
    <div className="card p-4 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{titulo}</span>
        {icono && <span className={clsx('shrink-0', tono === 'brand' ? 'text-[var(--color-brand-600)]' : 'text-[var(--text-muted)]')}>{icono}</span>}
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{valor}</div>
      <div className="flex items-center justify-between gap-2 min-h-[18px]">
        <div className="flex items-center gap-2">
          {subtitulo && <span className="text-xs text-[var(--text-secondary)]">{subtitulo}</span>}
          {tendencia && (
            <span className={clsx('text-xs font-semibold', tendencia.valor >= 0 ? 'text-emerald-600' : 'text-red-600')}>
              {tendencia.valor >= 0 ? '▲' : '▼'} {Math.abs(tendencia.valor).toFixed(1)}% {tendencia.label}
            </span>
          )}
        </div>
        {esDemo && <DemoTag />}
      </div>
      {sparkline && sparkline.length > 1 && <MiniSparkline data={sparkline} />}
    </div>
  );
}

export function MiniSparkline({ data, color = 'var(--color-brand-500)' }: { data: number[]; color?: string }) {
  const w = 100, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={clsx(
            'px-3.5 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
            active === t.id
              ? 'border-[var(--color-brand-600)] text-[var(--color-brand-700)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Breadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[var(--text-muted)]">/</span>}
          {it.onClick ? (
            <button onClick={it.onClick} className="hover:text-[var(--color-brand-600)] hover:underline">{it.label}</button>
          ) : (
            <span className={i === items.length - 1 ? 'font-semibold text-[var(--text-primary)]' : ''}>{it.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className={clsx('card w-full max-h-[85vh] overflow-y-auto animate-fade-in', wide ? 'max-w-3xl' : 'max-w-lg')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] sticky top-0 bg-white">
          <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function EmptyState({ titulo, descripcion }: { titulo: string; descripcion?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
      <div className="text-3xl mb-1">📭</div>
      <div className="font-semibold text-[var(--text-primary)]">{titulo}</div>
      {descripcion && <div className="text-sm text-[var(--text-muted)] max-w-sm">{descripcion}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function SectionHeader({ titulo, subtitulo, acciones, esDemo }: { titulo: string; subtitulo?: string; acciones?: ReactNode; esDemo?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[var(--text-primary)]">{titulo}</h1>
          {esDemo && <DemoTag />}
        </div>
        {subtitulo && <p className="text-sm text-[var(--text-secondary)] mt-0.5 max-w-2xl">{subtitulo}</p>}
      </div>
      {acciones && <div className="flex items-center gap-2">{acciones}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Toggle2<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-[var(--border-subtle)] p-0.5 bg-slate-50">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={clsx('px-2.5 py-1 text-xs font-medium rounded-md transition-colors', value === o.value ? 'bg-white shadow-sm text-[var(--color-brand-700)]' : 'text-[var(--text-muted)]')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-slate-900 text-white text-[11px] px-2 py-1 shadow-lg">
          {label}
        </span>
      )}
    </span>
  );
}
