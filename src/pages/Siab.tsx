import { useMemo, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, Legend } from 'recharts';
import { SectionHeader, KpiCard, Badge } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { ACTIVOS, INSTITUCIONES_POR_ID } from '../data/generator';
import type { Activo } from '../data/types';
import { fmtRD } from '../lib/format';

const COLORES = ['#0f3d73', '#1968b3', '#2382cf', '#4ea3e0', '#8cc4ec', '#0ea5a0'];

export default function Siab() {
  const [categoria, setCategoria] = useState<string>('Todas');
  const categorias = Array.from(new Set(ACTIVOS.map((a) => a.categoria)));

  const dataCategoria = categorias.map((c) => ({ name: c, value: ACTIVOS.filter((a) => a.categoria === c).reduce((s, a) => s + a.valorNeto, 0) }));

  const filtrados = useMemo(() => categoria === 'Todas' ? ACTIVOS : ACTIVOS.filter((a) => a.categoria === categoria), [categoria]);

  const valorTotal = ACTIVOS.reduce((s, a) => s + a.valorNeto, 0);
  const enMantenimiento = ACTIVOS.filter((a) => a.estado === 'En mantenimiento').length;
  const dadosBaja = ACTIVOS.filter((a) => a.estado === 'Dado de baja').length;

  const columnas: ColumnaTabla<Activo>[] = [
    { key: 'inst', header: 'Institución', accessor: (a) => INSTITUCIONES_POR_ID.get(a.institucionId)?.nombre ?? '', sortable: true, render: (a) => <span className="text-xs">{INSTITUCIONES_POR_ID.get(a.institucionId)?.siglas}</span> },
    { key: 'cat', header: 'Categoría', accessor: (a) => a.categoria },
    { key: 'valorAdq', header: 'Valor adquisición', accessor: (a) => a.valorAdquisicion, align: 'right', render: (a) => fmtRD(a.valorAdquisicion, { compacto: true }) },
    { key: 'dep', header: 'Depreciación acum.', accessor: (a) => a.depreciacionAcumulada, align: 'right', render: (a) => fmtRD(a.depreciacionAcumulada, { compacto: true }) },
    { key: 'neto', header: 'Valor neto', accessor: (a) => a.valorNeto, align: 'right', sortable: true, render: (a) => <strong>{fmtRD(a.valorNeto, { compacto: true })}</strong> },
    { key: 'ubicacion', header: 'Ubicación', accessor: (a) => a.ubicacion },
    { key: 'estado', header: 'Estado', accessor: (a) => a.estado, render: (a) => <Badge tono={a.estado === 'Activo' ? 'exito' : a.estado === 'En mantenimiento' ? 'alerta' : 'peligro'}>{a.estado}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="SIAB — Sistema de Administración de Bienes" subtitulo="Bienes muebles e inmuebles, depreciación, movimientos y conciliación con el catálogo contable." esDemo />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Registros de activos" valor={String(ACTIVOS.length)} />
        <KpiCard titulo="Valor neto total" valor={fmtRD(valorTotal, { compacto: true })} />
        <KpiCard titulo="En mantenimiento" valor={String(enMantenimiento)} />
        <KpiCard titulo="Dados de baja" valor={String(dadosBaja)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-2">Valor neto por categoría</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={dataCategoria} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} onClick={(d: any) => setCategoria(d.name)}>
                {dataCategoria.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} cursor="pointer" />)}
              </Pie>
              <RTooltip formatter={(v: any) => fmtRD(v, { compacto: true })} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Inventario ({categoria})</h3>
            <button onClick={() => setCategoria('Todas')} className="text-xs text-[var(--color-brand-600)] hover:underline">Limpiar filtro</button>
          </div>
          <DataTable columnas={columnas} filas={filtrados} keyExtractor={(a) => a.id} filasPorPagina={8} />
        </div>
      </div>
    </div>
  );
}
