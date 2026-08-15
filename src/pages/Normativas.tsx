import { useState } from 'react';
import { SectionHeader, Badge, RealTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { DOCUMENTOS_NORMATIVOS } from '../data/generator';
import { CUENTAS_HOJA, FUENTE_PLAN_CUENTAS } from '../data/catalogoCuentas';
import type { DocumentoNormativo } from '../data/types';

export default function Normativas() {
  const [cuentaId, setCuentaId] = useState(CUENTAS_HOJA[0].id);
  const cuenta = CUENTAS_HOJA.find((c) => c.id === cuentaId)!;

  const columnas: ColumnaTabla<DocumentoNormativo>[] = [
    { key: 'codigo', header: 'Código', accessor: (d) => d.codigo, width: '140px' },
    { key: 'nombre', header: 'Nombre', accessor: (d) => d.nombre, sortable: true },
    { key: 'tipo', header: 'Tipo', accessor: (d) => d.tipo },
    { key: 'version', header: 'Versión', accessor: (d) => d.version },
    { key: 'emision', header: 'Emisión', accessor: (d) => d.fechaEmision, sortable: true },
    { key: 'estado', header: 'Estado', accessor: (d) => d.estado, render: (d) => <Badge tono={d.estado === 'Vigente' ? 'exito' : d.estado === 'En revisión' ? 'alerta' : 'neutral'}>{d.estado}</Badge> },
    { key: 'responsable', header: 'Responsable', accessor: (d) => d.responsable },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Normativas Contables" subtitulo="Marco normativo, políticas y procedimientos institucionales, con trazabilidad Cuenta contable → Normativa relacionada." />
      <div className="flex justify-end"><RealTag label="Documentos, versiones y fechas citados en el Contexto Maestro Institucional" /></div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Relación Cuenta Contable → Normativa NICSP</h3>
        <div className="flex gap-2 items-center mb-3">
          <select value={cuentaId} onChange={(e) => setCuentaId(e.target.value)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm max-w-md">
            {CUENTAS_HOJA.map((c) => <option key={c.id} value={c.id}>{c.codigo} · {c.descripcion}</option>)}
          </select>
        </div>
        <div className="rounded-lg bg-[var(--color-brand-50)] p-3 text-sm">
          <div className="font-semibold">{cuenta.codigo} · {cuenta.descripcion}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            Clasificación: {cuenta.clasificacion} · Naturaleza {cuenta.naturaleza}. Fundamentada en {FUENTE_PLAN_CUENTAS.marcoConceptual}.
            {cuenta.clasificacion === 'Activo' && ' Presentación regida por NICSP 1 "Presentación de Estados Financieros" e IPSAS relacionadas con reconocimiento de activos.'}
            {cuenta.clasificacion === 'Pasivo' && ' Reconocimiento y medición conforme a NICSP relacionadas con provisiones, pasivos contingentes e instrumentos financieros.'}
            {cuenta.clasificacion === 'Patrimonio' && ' Presentación conforme a NICSP 1 y NICSP 35 "Estados Financieros Consolidados".'}
            {cuenta.clasificacion === 'Ingresos' && ' Reconocimiento conforme a NICSP de ingresos con y sin contraprestación.'}
            {cuenta.clasificacion === 'Gastos' && ' Reconocimiento conforme a NICSP de gastos de operación, transferencias y beneficios a empleados.'}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-sm mb-2">Repositorio de normativas y políticas institucionales</h3>
        <DataTable columnas={columnas} filas={DOCUMENTOS_NORMATIVOS} keyExtractor={(d) => d.id} filasPorPagina={10} buscarPlaceholder="Buscar documento, ley, política..." />
      </div>
    </div>
  );
}
