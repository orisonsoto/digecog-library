export function fmtRD(valor: number, opciones: { compacto?: boolean; decimales?: number } = {}): string {
  const { compacto = false, decimales = 0 } = opciones;
  if (compacto) {
    const abs = Math.abs(valor);
    if (abs >= 1_000_000_000_000) return `RD$${(valor / 1_000_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000_000) return `RD$${(valor / 1_000_000_000).toFixed(1)}MM`;
    if (abs >= 1_000_000) return `RD$${(valor / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `RD$${(valor / 1_000).toFixed(0)}K`;
  }
  return `RD$${valor.toLocaleString('es-DO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
}

export function fmtNum(valor: number, decimales = 0): string {
  return valor.toLocaleString('es-DO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

export function fmtPct(valor: number, decimales = 1): string {
  return `${valor.toLocaleString('es-DO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}%`;
}

export function fmtFecha(iso: string): string {
  const d = new Date(iso + (iso.length === 7 ? '-01' : ''));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: iso.length > 7 ? 'numeric' : undefined });
}

export function claseVariacion(valor: number): string {
  if (valor > 0) return 'text-[var(--color-accent-green)]';
  if (valor < 0) return 'text-[var(--color-accent-red)]';
  return 'text-[var(--text-muted)]';
}
