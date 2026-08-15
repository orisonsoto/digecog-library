import { useMemo } from 'react';
import { SectionHeader, Badge, DemoTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INSTITUCIONES, ERIR_REGISTROS } from '../data/generator';
import type { Institucion } from '../data/types';

const HITOS = [
  { fecha: '2026-01-15', hito: 'Apertura del período de cierre fiscal 2025', estado: 'Completado' },
  { fecha: '2026-02-28', hito: 'Cierre de recepción de estados financieros preliminares', estado: 'Completado' },
  { fecha: '2026-04-15', hito: 'Fecha límite de validación de catálogo contable', estado: 'Completado' },
  { fecha: '2026-05-30', hito: 'Cierre del proceso de consolidación', estado: 'En proceso' },
  { fecha: '2026-06-30', hito: 'Elaboración del ERIR 2025', estado: 'En proceso' },
  { fecha: '2026-08-31', hito: 'Publicación de Estados Financieros consolidados', estado: 'Pendiente' },
] as const;

const DOCUMENTOS_REQUERIDOS = [
  'Estado de Situación Financiera firmado', 'Estado de Rendimiento Financiero firmado', 'Conciliaciones bancarias del período',
  'Detalle de cuentas por cobrar y pagar', 'Inventario de activos fijos actualizado (SIAB)', 'Certificación de cumplimiento SISACNOC',
];

export default function CentroCierre() {
  const pendientes = useMemo(() => {
    const idsPendientes = new Set(ERIR_REGISTROS.filter((e) => e.anio === 2025 && e.estado !== 'Publicado').map((e) => e.institucionId));
    return INSTITUCIONES.filter((i) => idsPendientes.has(i.id));
  }, []);

  const cols: ColumnaTabla<Institucion>[] = [
    { key: 'nombre', header: 'Institución', accessor: (i) => i.nombre, sortable: true },
    { key: 'nivel', header: 'Tipo', accessor: (i) => i.nivelGobierno },
    { key: 'responsable', header: 'Responsable', accessor: (i) => i.responsable },
    { key: 'estado', header: 'Estado del cierre', accessor: () => 'Pendiente', render: () => <Badge tono="peligro">Pendiente de documentación</Badge> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Centro de Control del Cierre Fiscal" subtitulo="Calendario, formularios y seguimiento del cierre contable anual, inspirado conceptualmente en CIERRE+." esDemo />

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-3">Calendario de cierre — Ejercicio fiscal 2025</h3>
        <div className="relative pl-4 space-y-4 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-[var(--border-subtle)]">
          {HITOS.map((h) => (
            <div key={h.hito} className="relative pl-4">
              <span className={`absolute -left-[9px] top-1 h-3 w-3 rounded-full border-2 border-white ${h.estado === 'Completado' ? 'bg-emerald-500' : h.estado === 'En proceso' ? 'bg-amber-400' : 'bg-slate-300'}`} />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--text-muted)] w-24 shrink-0">{h.fecha}</span>
                <span className="text-sm font-medium">{h.hito}</span>
                <Badge tono={h.estado === 'Completado' ? 'exito' : h.estado === 'En proceso' ? 'alerta' : 'neutral'}>{h.estado}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Instituciones con documentación pendiente ({pendientes.length})</h3><DemoTag /></div>
          <DataTable columnas={cols} filas={pendientes} keyExtractor={(i) => i.id} filasPorPagina={8} />
        </div>
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Documentos requeridos para el cierre</h3>
          <ul className="space-y-1.5 text-sm">
            {DOCUMENTOS_REQUERIDOS.map((d) => (
              <li key={d} className="flex items-center gap-2"><span className="text-emerald-500">✓</span> {d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
