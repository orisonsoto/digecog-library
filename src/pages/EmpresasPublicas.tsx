import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend } from 'recharts';
import { SectionHeader, KpiCard, DemoTag, Toggle2, RealTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { EMPRESAS_PUBLICAS_LISTA, estadosFinancierosDeInstitucion } from '../data/generator';
import type { Institucion } from '../data/types';
import { fmtRD, fmtPct } from '../lib/format';

interface FilaEmpresa {
  inst: Institucion; activos: number; pasivos: number; patrimonio: number; ingresos: number; gastos: number;
  resultado: number; liquidez: number; endeudamiento: number;
}

export default function EmpresasPublicas() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<'todas' | 'no-financieras' | 'financieras'>('todas');

  const filas: FilaEmpresa[] = useMemo(() => EMPRESAS_PUBLICAS_LISTA
    .filter((i) => tipo === 'todas' || (tipo === 'no-financieras' ? i.nivelGobierno === 'Empresa Pública No Financiera' : i.nivelGobierno === 'Empresa Pública Financiera'))
    .map((inst) => {
      const efs = estadosFinancierosDeInstitucion(inst.id);
      const u = efs[efs.length - 1];
      const activos = u.activoCorriente + u.activoNoCorriente;
      const pasivos = u.pasivoCorriente + u.pasivoNoCorriente;
      return {
        inst, activos, pasivos, patrimonio: u.patrimonio,
        ingresos: u.ingresosCorrientes + u.ingresosCapital, gastos: u.gastosFuncionamiento + u.gastosCapital,
        resultado: u.resultadoEjercicio, liquidez: u.pasivoCorriente > 0 ? u.activoCorriente / u.pasivoCorriente : 0,
        endeudamiento: (pasivos / activos) * 100,
      };
    }), [tipo]);

  const dataComparativo = filas.map((f) => ({ nombre: f.inst.siglas, Activos: f.activos, Pasivos: f.pasivos }));

  const columnas: ColumnaTabla<FilaEmpresa>[] = [
    { key: 'nombre', header: 'Empresa', accessor: (f) => f.inst.nombre, sortable: true, render: (f) => <div><div className="font-medium">{f.inst.siglas}</div><div className="text-[11px] text-[var(--text-muted)]">{f.inst.sector}</div></div> },
    { key: 'activos', header: 'Activos', accessor: (f) => f.activos, sortable: true, align: 'right', render: (f) => fmtRD(f.activos, { compacto: true }) },
    { key: 'pasivos', header: 'Pasivos', accessor: (f) => f.pasivos, sortable: true, align: 'right', render: (f) => fmtRD(f.pasivos, { compacto: true }) },
    { key: 'patrimonio', header: 'Patrimonio', accessor: (f) => f.patrimonio, sortable: true, align: 'right', render: (f) => fmtRD(f.patrimonio, { compacto: true }) },
    { key: 'resultado', header: 'Resultado', accessor: (f) => f.resultado, sortable: true, align: 'right', render: (f) => <span className={f.resultado >= 0 ? 'text-emerald-600' : 'text-red-600'}>{fmtRD(f.resultado, { compacto: true })}</span> },
    { key: 'liquidez', header: 'Liquidez', accessor: (f) => f.liquidez, sortable: true, align: 'right', render: (f) => f.liquidez.toFixed(2) },
    { key: 'endeudamiento', header: 'Endeudamiento', accessor: (f) => f.endeudamiento, sortable: true, align: 'right', render: (f) => fmtPct(f.endeudamiento) },
  ];

  const totalActivos = filas.reduce((s, f) => s + f.activos, 0);
  const totalIngresos = filas.reduce((s, f) => s + f.ingresos, 0);
  const masEndeudada = [...filas].sort((a, b) => b.endeudamiento - a.endeudamiento)[0];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Monitor Financiero de Empresas Públicas" subtitulo="Comparativo de empresas públicas no financieras y financieras del Estado dominicano." />
      <div className="flex justify-end"><RealTag label="Nombres y clasificación de empresas verificados — cifras financieras DEMO" /></div>

      <Toggle2 value={tipo} onChange={setTipo} options={[{ value: 'todas', label: 'Todas' }, { value: 'no-financieras', label: 'No Financieras' }, { value: 'financieras', label: 'Financieras' }]} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard titulo="Empresas en la muestra" valor={String(filas.length)} />
        <KpiCard titulo="Activos totales" valor={fmtRD(totalActivos, { compacto: true })} />
        <KpiCard titulo="Ingresos totales" valor={fmtRD(totalIngresos, { compacto: true })} />
        <KpiCard titulo="Mayor endeudamiento" valor={masEndeudada ? masEndeudada.inst.siglas : '—'} subtitulo={masEndeudada ? fmtPct(masEndeudada.endeudamiento) : ''} />
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Activos vs. Pasivos por empresa</h3><DemoTag /></div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dataComparativo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" />
            <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => fmtRD(v, { compacto: true })} tick={{ fontSize: 10 }} />
            <RTooltip formatter={(v: any) => fmtRD(v, { compacto: true })} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Activos" fill="var(--color-brand-600)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pasivos" fill="var(--color-accent-red)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Comparativo detallado</h3></div>
        <DataTable columnas={columnas} filas={filas} keyExtractor={(f) => f.inst.id} onRowClick={(f) => navigate(`/institucion/${f.inst.id}`)} filasPorPagina={10} />
      </div>
    </div>
  );
}
