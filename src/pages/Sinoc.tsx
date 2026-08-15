import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from 'recharts';
import { SectionHeader, KpiCard, Badge, DemoTag, RealTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { INDICADORES_POA } from '../data/generator';

interface Curso { curso: string; modalidad: string; matriculados: number; certificados: number; instituciones: number }

const CURSOS: Curso[] = [
  { curso: 'Fundamentos del Plan de Cuentas Contables 2.0', modalidad: 'Virtual', matriculados: 412, certificados: 356, instituciones: 88 },
  { curso: 'NICSP aplicadas al Sector Público Dominicano', modalidad: 'Semipresencial', matriculados: 298, certificados: 241, instituciones: 62 },
  { curso: 'SISACNOC: Autoevaluación de Cumplimiento', modalidad: 'Virtual', matriculados: 355, certificados: 312, instituciones: 95 },
  { curso: 'Consolidación de Estados Financieros', modalidad: 'Presencial', matriculados: 140, certificados: 118, instituciones: 40 },
  { curso: 'Gestión de Bienes y Activos (SIAB)', modalidad: 'Virtual', matriculados: 187, certificados: 149, instituciones: 55 },
  { curso: 'Elaboración del ERIR — Nivel Básico', modalidad: 'Semipresencial', matriculados: 96, certificados: 81, instituciones: 30 },
];

export default function Sinoc() {
  const indicadorTecnicos = INDICADORES_POA.find((i) => i.id === 'IND-REAL-03')!;
  const dataProgreso = CURSOS.map((c) => ({ curso: c.curso.slice(0, 18) + '…', pct: Math.round((c.certificados / c.matriculados) * 100) }));

  const columnas: ColumnaTabla<Curso>[] = [
    { key: 'curso', header: 'Curso', accessor: (c) => c.curso, sortable: true },
    { key: 'modalidad', header: 'Modalidad', accessor: (c) => c.modalidad, render: (c) => <Badge tono="info">{c.modalidad}</Badge> },
    { key: 'matriculados', header: 'Matriculados', accessor: (c) => c.matriculados, align: 'right', sortable: true },
    { key: 'certificados', header: 'Certificados', accessor: (c) => c.certificados, align: 'right', sortable: true },
    { key: 'instituciones', header: 'Instituciones', accessor: (c) => c.instituciones, align: 'right' },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="SINOC — Sistema de Capacitación" subtitulo="Seguimiento de técnicos capacitados, currículas, certificaciones y necesidades de asistencia técnica." />
      <div className="flex justify-end"><RealTag label="Meta de técnicos entrenados: real (PEI 2025-2028)" /></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Línea base 2024" valor={String(indicadorTecnicos.lineaBase2024)} esDemo={false} />
        <KpiCard titulo="Meta 2026" valor={String(indicadorTecnicos.meta2026)} esDemo={false} />
        <KpiCard titulo="Avance a la fecha" valor={String(indicadorTecnicos.avanceMensual[indicadorTecnicos.avanceMensual.length - 1])} />
        <KpiCard titulo="Instituciones incorporadas" valor={String(CURSOS.reduce((max, c) => Math.max(max, c.instituciones), 0))} />
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Tasa de certificación por curso</h3><DemoTag /></div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dataProgreso} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" horizontal={false} />
            <XAxis type="number" unit="%" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="curso" width={150} tick={{ fontSize: 10 }} />
            <RTooltip formatter={(v: any) => `${v}%`} />
            <Bar dataKey="pct" fill="var(--color-brand-600)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Catálogo de cursos activos</h3>
        <DataTable columnas={columnas} filas={CURSOS} keyExtractor={(c) => c.curso} filasPorPagina={10} />
      </div>
    </div>
  );
}
