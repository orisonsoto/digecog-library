import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RRadar } from 'recharts';
import { Breadcrumb, Badge, DemoTag, Tabs } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import {
  INSTITUCIONES_POR_ID, estadosFinancierosDeInstitucion, sisacnocDeInstitucion,
  CALIDAD_DATOS, ACTIVOS, transaccionesDeInstitucion, ERIR_REGISTROS, INSTITUCIONES,
  EJECUCION_PRESUPUESTARIA,
} from '../data/generator';
import { rutaCompleta, CUENTAS_POR_ID } from '../data/catalogoCuentas';
import type { Transaccion } from '../data/types';
import { fmtRD, fmtPct } from '../lib/format';

export default function FichaInstitucion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('resumen');
  const inst = id ? INSTITUCIONES_POR_ID.get(id) : undefined;

  const efs = useMemo(() => (inst ? estadosFinancierosDeInstitucion(inst.id) : []), [inst]);
  const sis = useMemo(() => (inst ? sisacnocDeInstitucion(inst.id) : []), [inst]);
  const calidad = useMemo(() => (inst ? CALIDAD_DATOS.filter((c) => c.institucionId === inst.id) : []), [inst]);
  const activos = useMemo(() => (inst ? ACTIVOS.filter((a) => a.institucionId === inst.id) : []), [inst]);
  const movimientos = useMemo(() => (inst ? transaccionesDeInstitucion(inst.id) : []), [inst]);
  const erir = useMemo(() => (inst ? ERIR_REGISTROS.filter((e) => e.institucionId === inst.id) : []), [inst]);
  const ejecucion = useMemo(() => (inst ? EJECUCION_PRESUPUESTARIA.filter((e) => e.institucionId === inst.id) : []), [inst]);

  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string | null>(null);

  if (!inst) {
    return <div className="p-6 text-sm text-[var(--text-muted)]">Institución no encontrada. <button className="text-[var(--color-brand-600)] underline" onClick={() => navigate('/monitor')}>Volver al Monitor Nacional</button></div>;
  }

  const ultimo = efs[efs.length - 1];
  const anterior = efs[efs.length - 2];
  const activoTotal = ultimo.activoCorriente + ultimo.activoNoCorriente;
  const pasivoTotal = ultimo.pasivoCorriente + ultimo.pasivoNoCorriente;
  const variacion = (campo: 'activo' | 'ingresos' | 'gastos') => {
    if (!anterior) return 0;
    if (campo === 'activo') return (((ultimo.activoCorriente + ultimo.activoNoCorriente) - (anterior.activoCorriente + anterior.activoNoCorriente)) / (anterior.activoCorriente + anterior.activoNoCorriente)) * 100;
    if (campo === 'ingresos') return (((ultimo.ingresosCorrientes + ultimo.ingresosCapital) - (anterior.ingresosCorrientes + anterior.ingresosCapital)) / (anterior.ingresosCorrientes + anterior.ingresosCapital)) * 100;
    return (((ultimo.gastosFuncionamiento + ultimo.gastosCapital) - (anterior.gastosFuncionamiento + anterior.gastosCapital)) / (anterior.gastosFuncionamiento + anterior.gastosCapital)) * 100;
  };

  const ultimoSis = sis[sis.length - 1];
  const ultimaCalidad = calidad[calidad.length - 1];

  const dataSerieActivo = efs.map((e) => ({ periodo: `${e.anio}${e.mes === 12 ? '' : '-' + e.mes}`, activo: e.activoCorriente + e.activoNoCorriente, pasivo: e.pasivoCorriente + e.pasivoNoCorriente, patrimonio: e.patrimonio }));
  const dataSisacnocRadar = ultimoSis ? [
    { dim: 'Oportunidad', v: ultimoSis.oportunidad }, { dim: 'Transparencia', v: ultimoSis.transparencia },
    { dim: 'Comparabilidad', v: ultimoSis.comparabilidad }, { dim: 'Gest. Activos', v: ultimoSis.gestionActivos },
  ] : [];

  const promedioSector = useMemo(() => {
    const pares = INSTITUCIONES.filter((i) => i.sector === inst.sector);
    const efsPares = pares.map((p) => estadosFinancierosDeInstitucion(p.id)).map((arr) => arr[arr.length - 1]).filter(Boolean);
    if (!efsPares.length) return 0;
    return efsPares.reduce((s, e) => s + e.activoCorriente + e.activoNoCorriente, 0) / efsPares.length;
  }, [inst]);

  const columnasMov: ColumnaTabla<Transaccion>[] = [
    { key: 'fecha', header: 'Fecha', accessor: (t) => t.fecha, sortable: true },
    { key: 'cuenta', header: 'Cuenta', accessor: (t) => CUENTAS_POR_ID.get(t.cuentaId)?.descripcion ?? '', render: (t) => <span className="text-xs">{CUENTAS_POR_ID.get(t.cuentaId)?.codigo} · {CUENTAS_POR_ID.get(t.cuentaId)?.descripcion}</span> },
    { key: 'tipo', header: 'Tipo', accessor: (t) => t.tipo, render: (t) => <Badge tono={t.tipo === 'Débito' ? 'info' : 'neutral'}>{t.tipo}</Badge> },
    { key: 'monto', header: 'Monto', accessor: (t) => t.monto, sortable: true, align: 'right', render: (t) => fmtRD(t.monto, { compacto: true }) },
    { key: 'fuente', header: 'Fuente', accessor: (t) => t.fuente },
    { key: 'glosa', header: 'Glosa', accessor: (t) => t.glosa, render: (t) => <span className="text-xs text-[var(--text-secondary)]">{t.glosa}</span> },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'Monitor Nacional', onClick: () => navigate('/monitor') }, { label: inst.nombre }]} />

      <div className="card p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{inst.nombre}</h1>
            <Badge tono="info">{inst.siglas}</Badge>
            <Badge tono={inst.scgImplementado ? 'exito' : 'alerta'}>{inst.scgImplementado ? 'SCG Implementado' : 'SCG Pendiente'}</Badge>
          </div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">{inst.nivelGobierno} · {inst.sector} · {inst.provincia}, {inst.region}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Responsable: {inst.responsable} — {inst.cargoResponsable}</div>
        </div>
        <div className="flex gap-4 text-center">
          <div><div className="text-lg font-bold">{fmtRD(activoTotal, { compacto: true })}</div><div className="text-[10px] text-[var(--text-muted)] uppercase">Activo Total</div></div>
          <div><div className="text-lg font-bold">{fmtPct(ultimoSis?.cumplimientoGeneral ?? 0)}</div><div className="text-[10px] text-[var(--text-muted)] uppercase">SISACNOC</div></div>
          <div><div className="text-lg font-bold">{fmtPct(ultimaCalidad?.indiceGeneral ?? 0)}</div><div className="text-[10px] text-[var(--text-muted)] uppercase">Calidad</div></div>
        </div>
      </div>

      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { id: 'resumen', label: 'Resumen' }, { id: 'ef', label: 'Estados Financieros' },
          { id: 'sisacnoc', label: 'SISACNOC' }, { id: 'activos', label: 'Activos (SIAB)' },
          { id: 'movimientos', label: 'Movimientos' }, { id: 'erir', label: 'ERIR' },
        ]}
      />

      {tab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-4 lg:col-span-2">
            <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Evolución Activo / Pasivo / Patrimonio</h3><DemoTag /></div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={dataSerieActivo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8f0" />
                <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => fmtRD(v, { compacto: true })} tick={{ fontSize: 10 }} />
                <RTooltip formatter={(v: any) => fmtRD(v, { compacto: true })} />
                <Area type="monotone" dataKey="activo" stroke="var(--color-brand-600)" fill="var(--color-brand-100)" name="Activo" />
                <Area type="monotone" dataKey="pasivo" stroke="var(--color-accent-red)" fill="#fce8e6" name="Pasivo" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4 space-y-3">
            <h3 className="font-semibold text-sm">Variaciones interanuales</h3>
            {[
              { label: 'Activo total', v: variacion('activo') }, { label: 'Ingresos', v: variacion('ingresos') }, { label: 'Gastos de funcionamiento', v: variacion('gastos') },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">{r.label}</span>
                <span className={`font-semibold ${r.v >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{r.v >= 0 ? '▲' : '▼'} {Math.abs(r.v).toFixed(1)}%</span>
              </div>
            ))}
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">Comparación sectorial (activo promedio de {inst.sector})</span></div>
              <div className="text-sm font-semibold mt-1">{fmtRD(promedioSector, { compacto: true })} <span className="text-xs font-normal text-[var(--text-muted)]">vs. {fmtRD(activoTotal, { compacto: true })} de esta institución</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'ef' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-3">Estado de Situación Financiera (último corte)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="font-semibold"><td className="py-1">ACTIVO</td><td className="text-right">{fmtRD(activoTotal, { compacto: true })}</td></tr>
                <tr><td className="pl-3 text-[var(--text-secondary)]">Corriente</td><td className="text-right">{fmtRD(ultimo.activoCorriente, { compacto: true })}</td></tr>
                <tr className="border-b border-[var(--border-subtle)]"><td className="pl-3 text-[var(--text-secondary)]">No corriente</td><td className="text-right">{fmtRD(ultimo.activoNoCorriente, { compacto: true })}</td></tr>
                <tr className="font-semibold pt-1"><td className="pt-2">PASIVO</td><td className="text-right pt-2">{fmtRD(pasivoTotal, { compacto: true })}</td></tr>
                <tr><td className="pl-3 text-[var(--text-secondary)]">Corriente</td><td className="text-right">{fmtRD(ultimo.pasivoCorriente, { compacto: true })}</td></tr>
                <tr className="border-b border-[var(--border-subtle)]"><td className="pl-3 text-[var(--text-secondary)]">No corriente</td><td className="text-right">{fmtRD(ultimo.pasivoNoCorriente, { compacto: true })}</td></tr>
                <tr className="font-semibold pt-1"><td className="pt-2">PATRIMONIO</td><td className="text-right pt-2">{fmtRD(ultimo.patrimonio, { compacto: true })}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-3">Estado de Rendimiento Financiero (último corte)</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="text-[var(--text-secondary)]">Ingresos corrientes</td><td className="text-right">{fmtRD(ultimo.ingresosCorrientes, { compacto: true })}</td></tr>
                <tr className="border-b border-[var(--border-subtle)]"><td className="text-[var(--text-secondary)]">Ingresos de capital</td><td className="text-right">{fmtRD(ultimo.ingresosCapital, { compacto: true })}</td></tr>
                <tr><td className="text-[var(--text-secondary)]">Gastos de funcionamiento</td><td className="text-right">({fmtRD(ultimo.gastosFuncionamiento, { compacto: true })})</td></tr>
                <tr><td className="text-[var(--text-secondary)]">Gastos de capital</td><td className="text-right">({fmtRD(ultimo.gastosCapital, { compacto: true })})</td></tr>
                <tr className="border-b border-[var(--border-subtle)]"><td className="text-[var(--text-secondary)]">Transferencias otorgadas</td><td className="text-right">({fmtRD(ultimo.transferencias, { compacto: true })})</td></tr>
                <tr className="font-semibold pt-1"><td className="pt-2">Resultado del ejercicio</td><td className={`text-right pt-2 ${ultimo.resultadoEjercicio >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtRD(ultimo.resultadoEjercicio, { compacto: true })}</td></tr>
              </tbody>
            </table>
            <h3 className="font-semibold text-sm mt-4 mb-2">Ejecución presupuestaria</h3>
            {ejecucion.slice(-1).map((e) => (
              <div key={e.anio} className="text-xs space-y-1">
                <div className="flex justify-between"><span>Aprobado</span><span>{fmtRD(e.presupuestoAprobado, { compacto: true })}</span></div>
                <div className="flex justify-between"><span>Devengado</span><span>{fmtRD(e.devengado, { compacto: true })} ({fmtPct((e.devengado / e.presupuestoModificado) * 100)})</span></div>
                <div className="flex justify-between"><span>Pagado</span><span>{fmtRD(e.pagado, { compacto: true })}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'sisacnoc' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">Dimensiones de cumplimiento (último corte)</h3>
            {ultimoSis ? (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={dataSisacnocRadar}>
                  <PolarGrid /><PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} /><PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <RRadar dataKey="v" stroke="var(--color-brand-600)" fill="var(--color-brand-400)" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <div className="text-sm text-[var(--text-muted)] py-8 text-center">Institución sin evaluación SISACNOC activa.</div>}
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">Histórico semestral</h3>
            <table className="w-full text-sm">
              <thead><tr className="text-[11px] text-[var(--text-muted)] uppercase"><th className="text-left py-1">Período</th><th className="text-right">Cumplimiento</th><th className="text-right">Categoría</th></tr></thead>
              <tbody>
                {sis.map((s) => (
                  <tr key={`${s.anio}-${s.semestre}`} className="border-t border-[var(--border-subtle)]">
                    <td className="py-1.5">{s.anio}-S{s.semestre}</td>
                    <td className="text-right">{fmtPct(s.cumplimientoGeneral)}</td>
                    <td className="text-right"><Badge tono={s.categoria === 'Óptimo' || s.categoria === 'Satisfactorio' ? 'exito' : s.categoria === 'En proceso' ? 'alerta' : 'peligro'}>{s.categoria}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'activos' && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Inventario de activos (SIAB)</h3><DemoTag /></div>
          {activos.length === 0 ? <div className="text-sm text-[var(--text-muted)] py-6 text-center">SIAB no activo para esta institución.</div> : (
            <DataTable
              columnas={[
                { key: 'cat', header: 'Categoría', accessor: (a) => a.categoria },
                { key: 'desc', header: 'Descripción', accessor: (a) => a.descripcion },
                { key: 'valor', header: 'Valor adquisición', accessor: (a) => a.valorAdquisicion, align: 'right', render: (a) => fmtRD(a.valorAdquisicion, { compacto: true }) },
                { key: 'dep', header: 'Depreciación', accessor: (a) => a.depreciacionAcumulada, align: 'right', render: (a) => fmtRD(a.depreciacionAcumulada, { compacto: true }) },
                { key: 'neto', header: 'Valor neto', accessor: (a) => a.valorNeto, align: 'right', render: (a) => fmtRD(a.valorNeto, { compacto: true }) },
                { key: 'estado', header: 'Estado', accessor: (a) => a.estado, render: (a) => <Badge tono={a.estado === 'Activo' ? 'exito' : a.estado === 'En mantenimiento' ? 'alerta' : 'peligro'}>{a.estado}</Badge> },
              ]}
              filas={activos} keyExtractor={(a) => a.id} filasPorPagina={8}
            />
          )}
        </div>
      )}

      {tab === 'movimientos' && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Diario de movimientos ({movimientos.length} registros — año vigente)</h3><DemoTag /></div>
          <DataTable columnas={columnasMov} filas={movimientos} keyExtractor={(t) => t.id} filasPorPagina={10} onRowClick={(t) => setCuentaSeleccionada(t.cuentaId)} />
          {cuentaSeleccionada && (
            <div className="mt-3 text-xs bg-[var(--color-brand-50)] rounded-lg p-3">
              <span className="font-semibold">Ruta contable: </span>
              {rutaCompleta(cuentaSeleccionada).map((c) => c.descripcion).join(' → ')}
            </div>
          )}
        </div>
      )}

      {tab === 'erir' && (
        <div className="card p-4">
          <h3 className="font-semibold text-sm mb-3">Integración al ERIR por año fiscal</h3>
          <div className="flex flex-wrap gap-3">
            {erir.map((e) => (
              <div key={e.anio} className="rounded-lg border border-[var(--border-subtle)] p-3 min-w-[140px]">
                <div className="text-xs text-[var(--text-muted)]">{e.anio}</div>
                <Badge tono={e.estado === 'Publicado' ? 'exito' : e.estado === 'Pendiente' ? 'peligro' : 'info'}>{e.estado}</Badge>
                <div className="text-[11px] mt-1.5 space-y-0.5 text-[var(--text-secondary)]">
                  <div>Cuentas presupuestarias: {e.cuentasPresupuestariasIntegradas ? '✓' : '—'}</div>
                  <div>Cuentas patrimoniales: {e.cuentasPatrimonialesIntegradas ? '✓' : '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
