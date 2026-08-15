import { SectionHeader, Badge, DemoTag, RealTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';

interface Dataset { nombre: string; fuente: string; corte: string; responsable: string; estado: 'Publicado' | 'En validación' }

const DATASETS: Dataset[] = [
  { nombre: 'Instituciones con SCG implementado por año', fuente: 'DIGECOG — Dirección de Procesamiento Contable', corte: '2026-07', responsable: 'Planificación y Desarrollo', estado: 'Publicado' },
  { nombre: 'Resultados SISACNOC por semestre', fuente: 'DIGECOG — Análisis de Información Financiera', corte: '2026-S1', responsable: 'Dirección de Análisis de Información Financiera', estado: 'Publicado' },
  { nombre: 'Estados Financieros consolidados del Gobierno Central', fuente: 'DIGECOG — Procesamiento Contable', corte: '2025-12', responsable: 'Dirección de Procesamiento Contable', estado: 'Publicado' },
  { nombre: 'Técnicos capacitados por curso (SINOC)', fuente: 'DIGECOG — Capacitación y Asistencia Técnica', corte: '2026-07', responsable: 'Dirección de Capacitación', estado: 'En validación' },
  { nombre: 'Inventario de activos por institución (SIAB)', fuente: 'DIGECOG — Procesamiento Contable', corte: '2026-06', responsable: 'Dirección de Procesamiento Contable', estado: 'En validación' },
];

export default function Estadisticas() {
  const columnas: ColumnaTabla<Dataset>[] = [
    { key: 'nombre', header: 'Dataset', accessor: (d) => d.nombre, sortable: true },
    { key: 'fuente', header: 'Fuente', accessor: (d) => d.fuente },
    { key: 'corte', header: 'Fecha de corte', accessor: (d) => d.corte, sortable: true },
    { key: 'responsable', header: 'Responsable', accessor: (d) => d.responsable },
    { key: 'estado', header: 'Estado', accessor: (d) => d.estado, render: (d) => <Badge tono={d.estado === 'Publicado' ? 'exito' : 'alerta'}>{d.estado}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Statistical Data Hub — SIPEI" subtitulo="Sistema Integrado de Producción de Estadísticas Institucional: catálogo de indicadores, datasets, fuentes, validación y publicación." />
      <div className="flex justify-end"><RealTag label="Política SIPEI v2 (abr. 2026) real — catálogo de datasets DEMO" /></div>

      <div className="card p-4 text-sm text-[var(--text-secondary)]">
        Los datos deben provenir preferentemente de fuentes primarias, sistemas, registros y matrices institucionales; ser validados por los dueños de proceso antes de su publicación; y mantener trazabilidad con la fuente y período correspondiente — conforme a la Política del Sistema Integrado de Producción de Estadísticas Institucional (SIPEI), versión 2, abril 2026.
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Catálogo de indicadores y datasets institucionales</h3><DemoTag /></div>
        <DataTable columnas={columnas} filas={DATASETS} keyExtractor={(d) => d.nombre} filasPorPagina={10} />
      </div>
    </div>
  );
}
