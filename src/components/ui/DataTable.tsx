import { useMemo, useState } from 'react';
import clsx from 'clsx';

export interface ColumnaTabla<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  accessor?: (row: T) => string | number;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columnas: ColumnaTabla<T>[];
  filas: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  buscarPlaceholder?: string;
  filasPorPagina?: number;
  vacio?: string;
}

export function DataTable<T>({
  columnas, filas, keyExtractor, onRowClick, buscarPlaceholder = 'Buscar...', filasPorPagina = 12, vacio = 'Sin resultados',
}: DataTableProps<T>) {
  const [busqueda, setBusqueda] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [pagina, setPagina] = useState(0);

  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return filas;
    const q = busqueda.toLowerCase();
    return filas.filter((f) =>
      columnas.some((c) => {
        const v = c.accessor ? c.accessor(f) : '';
        return String(v).toLowerCase().includes(q);
      }) || JSON.stringify(f).toLowerCase().includes(q)
    );
  }, [filas, busqueda, columnas]);

  const ordenadas = useMemo(() => {
    if (!sortKey) return filtradas;
    const col = columnas.find((c) => c.key === sortKey);
    if (!col?.accessor) return filtradas;
    return [...filtradas].sort((a, b) => {
      const av = col.accessor!(a); const bv = col.accessor!(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
  }, [filtradas, sortKey, sortDir, columnas]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / filasPorPagina));
  const paginaSegura = Math.min(pagina, totalPaginas - 1);
  const visibles = ordenadas.slice(paginaSegura * filasPorPagina, (paginaSegura + 1) * filasPorPagina);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <input
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(0); }}
          placeholder={buscarPlaceholder}
          className="w-full max-w-xs rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
        />
        <span className="text-xs text-[var(--text-muted)]">{ordenadas.length} de {filas.length} registros</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-[var(--border-subtle)]">
              {columnas.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.width }}
                  className={clsx('px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] whitespace-nowrap',
                    c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left',
                    c.sortable && 'cursor-pointer select-none hover:text-[var(--color-brand-600)]')}
                  onClick={() => {
                    if (!c.sortable) return;
                    if (sortKey === c.key) setSortDir((d) => (d === 1 ? -1 : 1));
                    else { setSortKey(c.key); setSortDir(1); }
                  }}
                >
                  {c.header}{sortKey === c.key ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr><td colSpan={columnas.length} className="px-3 py-8 text-center text-[var(--text-muted)]">{vacio}</td></tr>
            )}
            {visibles.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx('border-b border-[var(--border-subtle)] last:border-0', onRowClick && 'cursor-pointer hover:bg-[var(--color-brand-50)]')}
              >
                {columnas.map((c) => (
                  <td key={c.key} className={clsx('px-3 py-2 whitespace-nowrap', c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left')}>
                    {c.render ? c.render(row) : String(c.accessor?.(row) ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPaginas > 1 && (
        <div className="flex items-center justify-end gap-2 text-xs">
          <button disabled={paginaSegura === 0} onClick={() => setPagina((p) => p - 1)} className="px-2 py-1 rounded border border-[var(--border-subtle)] disabled:opacity-30">← Anterior</button>
          <span className="text-[var(--text-muted)]">Página {paginaSegura + 1} de {totalPaginas}</span>
          <button disabled={paginaSegura >= totalPaginas - 1} onClick={() => setPagina((p) => p + 1)} className="px-2 py-1 rounded border border-[var(--border-subtle)] disabled:opacity-30">Siguiente →</button>
        </div>
      )}
    </div>
  );
}
