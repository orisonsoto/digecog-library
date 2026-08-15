import { SectionHeader, KpiCard, Badge } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';

interface Conector { sistema: string; tipo: string; ultimaSync: string; registrosProcesados: number; disponibilidad: number; estado: 'Activo' | 'Degradado' | 'Inactivo' }

const CONECTORES: Conector[] = [
  { sistema: 'SIGEF (Ministerio de Hacienda y Economía)', tipo: 'API REST', ultimaSync: '2026-08-13 22:10', registrosProcesados: 184_320, disponibilidad: 99.4, estado: 'Activo' },
  { sistema: 'DIGEPRES — Ejecución Presupuestaria', tipo: 'Servicio Web (SOAP)', ultimaSync: '2026-08-13 21:45', registrosProcesados: 62_110, disponibilidad: 98.1, estado: 'Activo' },
  { sistema: 'Tesorería Nacional — Cuenta Única del Tesoro', tipo: 'API REST', ultimaSync: '2026-08-13 20:30', registrosProcesados: 41_875, disponibilidad: 97.6, estado: 'Activo' },
  { sistema: 'SIAB — Sistema de Administración de Bienes', tipo: 'Interno (batch)', ultimaSync: '2026-08-13 06:00', registrosProcesados: 8_940, disponibilidad: 96.2, estado: 'Activo' },
  { sistema: 'SINOC — Capacitación Técnica', tipo: 'Interno (batch)', ultimaSync: '2026-08-12 06:00', registrosProcesados: 3_210, disponibilidad: 95.0, estado: 'Degradado' },
  { sistema: 'DGII — Dirección General de Impuestos Internos', tipo: 'Archivo (SFTP)', ultimaSync: '2026-08-10 03:00', registrosProcesados: 15_402, disponibilidad: 91.3, estado: 'Degradado' },
  { sistema: 'DGA — Dirección General de Aduanas', tipo: 'Archivo (SFTP)', ultimaSync: '2026-08-13 04:00', registrosProcesados: 9_870, disponibilidad: 94.8, estado: 'Activo' },
  { sistema: 'Oficina Virtual DIGECOG', tipo: 'API REST', ultimaSync: '2026-08-13 22:50', registrosProcesados: 7_640, disponibilidad: 99.0, estado: 'Activo' },
];

export default function Interoperabilidad() {
  const activos = CONECTORES.filter((c) => c.estado === 'Activo').length;
  const dispPromedio = CONECTORES.reduce((s, c) => s + c.disponibilidad, 0) / CONECTORES.length;

  const columnas: ColumnaTabla<Conector>[] = [
    { key: 'sistema', header: 'Sistema', accessor: (c) => c.sistema, sortable: true },
    { key: 'tipo', header: 'Tipo de integración', accessor: (c) => c.tipo },
    { key: 'sync', header: 'Última sincronización', accessor: (c) => c.ultimaSync, sortable: true },
    { key: 'reg', header: 'Registros procesados', accessor: (c) => c.registrosProcesados, align: 'right', sortable: true, render: (c) => c.registrosProcesados.toLocaleString('es-DO') },
    { key: 'disp', header: 'Disponibilidad', accessor: (c) => c.disponibilidad, align: 'right', render: (c) => `${c.disponibilidad}%` },
    { key: 'estado', header: 'Estado', accessor: (c) => c.estado, render: (c) => <Badge tono={c.estado === 'Activo' ? 'exito' : c.estado === 'Degradado' ? 'alerta' : 'peligro'}>{c.estado}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Integration Hub — Interoperabilidad" subtitulo="Representación conceptual de conexiones con sistemas del Estado, inspirada en arquitecturas modernas de interoperabilidad (ej. X-Road). No se afirman integraciones reales activas." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Conectores configurados" valor={String(CONECTORES.length)} />
        <KpiCard titulo="Activos" valor={String(activos)} />
        <KpiCard titulo="Disponibilidad promedio" valor={`${dispPromedio.toFixed(1)}%`} />
        <KpiCard titulo="Registros procesados (24h)" valor={CONECTORES.reduce((s, c) => s + c.registrosProcesados, 0).toLocaleString('es-DO')} />
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-sm mb-4">Arquitectura de interoperabilidad (conceptual)</h3>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-xl px-5 py-2.5 text-white text-sm font-semibold" style={{ background: 'var(--color-brand-800)' }}>DIGECOG 360° — Núcleo de Datos</div>
          <div className="text-[var(--text-muted)]">⇅</div>
          <div className="rounded-xl border-2 border-dashed border-[var(--color-brand-300)] px-5 py-2 text-sm font-medium text-[var(--color-brand-700)]">Bus de Interoperabilidad (Hub)</div>
          <div className="text-[var(--text-muted)]">⇅</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            {['SIGEF', 'DIGEPRES', 'Tesorería Nacional', 'SIAB', 'SINOC', 'DGII', 'DGA', 'Oficina Virtual'].map((s) => (
              <div key={s} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-center text-xs font-medium bg-slate-50">{s}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Conectores y servicios</h3>
        <DataTable columnas={columnas} filas={CONECTORES} keyExtractor={(c) => c.sistema} filasPorPagina={10} />
      </div>
    </div>
  );
}
