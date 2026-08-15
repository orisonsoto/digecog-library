import { useMemo, useState } from 'react';
import { SectionHeader, Breadcrumb, Badge, DemoTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { CATALOGO_CUENTAS, hijosDe, rutaCompleta, FUENTE_PLAN_CUENTAS } from '../data/catalogoCuentas';
import { INSTITUCIONES, saldosDeInstitucionPeriodo, transaccionesDeInstitucion } from '../data/generator';
import { useAppStore } from '../store/appStore';
import type { CuentaContable, SaldoContable, Transaccion } from '../data/types';
import { fmtRD } from '../lib/format';

export default function ExploradorContable() {
  const periodoKey = useAppStore((s) => s.periodoKey);
  const [nodoActual, setNodoActual] = useState<string | null>(null);
  const [institucionId, setInstitucionId] = useState(INSTITUCIONES[0].id);
  const [busquedaVariacion, setBusquedaVariacion] = useState(false);

  const hijos = hijosDe(nodoActual);
  const ruta = nodoActual ? rutaCompleta(nodoActual) : [];
  const nodoEsHoja = nodoActual ? CATALOGO_CUENTAS.find((c) => c.id === nodoActual)?.nivel === 4 : false;

  const saldosInst = useMemo(() => saldosDeInstitucionPeriodo(institucionId, periodoKey), [institucionId, periodoKey]);
  const movimientosCuenta = useMemo(() => {
    if (!nodoActual) return [] as Transaccion[];
    return transaccionesDeInstitucion(institucionId).filter((t) => t.cuentaId === nodoActual);
  }, [institucionId, nodoActual]);

  function saldoDe(cuentaId: string): number {
    // Suma saldos de la cuenta y de todos sus descendientes (para niveles superiores)
    const descendientes = new Set<string>();
    const acumular = (id: string) => { descendientes.add(id); hijosDe(id).forEach((h) => acumular(h.id)); };
    acumular(cuentaId);
    return saldosInst.filter((s) => descendientes.has(s.cuentaId)).reduce((sum, s) => sum + s.saldoFinal, 0);
  }

  const columnasHijos: ColumnaTabla<CuentaContable>[] = [
    { key: 'codigo', header: 'Código', accessor: (c) => c.codigo, width: '110px' },
    { key: 'desc', header: 'Cuenta', accessor: (c) => c.descripcion, sortable: true },
    { key: 'nat', header: 'Naturaleza', accessor: (c) => c.naturaleza, render: (c) => <Badge tono="neutral">{c.naturaleza}</Badge> },
    { key: 'saldo', header: 'Saldo (institución seleccionada)', accessor: (c) => saldoDe(c.id), align: 'right', sortable: true, render: (c) => fmtRD(saldoDe(c.id), { compacto: true }) },
  ];

  const columnasSaldosInst: ColumnaTabla<SaldoContable>[] = [
    { key: 'cuenta', header: 'Cuenta', accessor: (s) => CATALOGO_CUENTAS.find((c) => c.id === s.cuentaId)?.descripcion ?? '', render: (s) => {
      const c = CATALOGO_CUENTAS.find((cc) => cc.id === s.cuentaId);
      return <span className="text-xs">{c?.codigo} · {c?.descripcion}</span>;
    } },
    { key: 'ini', header: 'Saldo inicial', accessor: (s) => s.saldoInicial, align: 'right', render: (s) => fmtRD(s.saldoInicial, { compacto: true }) },
    { key: 'deb', header: 'Débitos', accessor: (s) => s.debitos, align: 'right', render: (s) => fmtRD(s.debitos, { compacto: true }) },
    { key: 'cred', header: 'Créditos', accessor: (s) => s.creditos, align: 'right', render: (s) => fmtRD(s.creditos, { compacto: true }) },
    { key: 'fin', header: 'Saldo final', accessor: (s) => s.saldoFinal, align: 'right', sortable: true, render: (s) => <strong>{fmtRD(s.saldoFinal, { compacto: true })}</strong> },
  ];

  const columnasMov: ColumnaTabla<Transaccion>[] = [
    { key: 'fecha', header: 'Fecha', accessor: (t) => t.fecha },
    { key: 'tipo', header: 'Tipo', accessor: (t) => t.tipo, render: (t) => <Badge tono={t.tipo === 'Débito' ? 'info' : 'neutral'}>{t.tipo}</Badge> },
    { key: 'monto', header: 'Monto', accessor: (t) => t.monto, align: 'right', render: (t) => fmtRD(t.monto, { compacto: true }) },
    { key: 'fuente', header: 'Fuente', accessor: (t) => t.fuente },
    { key: 'glosa', header: 'Glosa', accessor: (t) => t.glosa },
  ];

  const inst = INSTITUCIONES.find((i) => i.id === institucionId)!;

  return (
    <div className="space-y-4">
      <SectionHeader
        titulo="Explorador Contable"
        subtitulo="Navegue el Plan de Cuentas Contables oficial (Clase → Grupo → Rubro → Cuenta) hasta el detalle de saldos y movimientos por institución."
      />
      <div className="flex flex-wrap items-center gap-3">
        <select value={institucionId} onChange={(e) => setInstitucionId(e.target.value)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm">
          {INSTITUCIONES.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
        </select>
        <button onClick={() => setBusquedaVariacion((v) => !v)} className="text-xs rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 hover:border-[var(--color-brand-400)]">
          🔎 Instituciones con variación &gt;20% en cuentas por cobrar
        </button>
      </div>

      {busquedaVariacion && (
        <div className="card p-3 text-xs bg-[var(--color-brand-50)] border-[var(--color-brand-200)]">
          Búsqueda inteligente (DEMO): identificando instituciones cuya cuenta <em>1.1.04 Cuentas por cobrar a corto plazo</em> presenta una variación superior al 20% respecto del período anterior — consulte el módulo <strong>Analítica Financiera → Detección de Anomalías</strong> para el listado con IA aplicada.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <Breadcrumb items={[{ label: 'Plan de Cuentas', onClick: () => setNodoActual(null) }, ...ruta.map((r, i) => ({ label: `${r.codigo}`, onClick: i < ruta.length - 1 ? () => setNodoActual(r.id) : undefined }))]} />
          <div className="mt-3">
            {!nodoEsHoja ? (
              <DataTable columnas={columnasHijos} filas={hijos.length ? hijos : CATALOGO_CUENTAS.filter((c) => c.nivel === 1)} keyExtractor={(c) => c.id} onRowClick={(c) => setNodoActual(c.id)} filasPorPagina={12} buscarPlaceholder="Buscar cuenta..." />
            ) : (
              <div>
                <div className="mb-2 text-sm font-semibold">Movimientos de "{ruta[ruta.length - 1]?.descripcion}" — {inst.siglas}</div>
                <DataTable columnas={columnasMov} filas={movimientosCuenta} keyExtractor={(t) => t.id} filasPorPagina={8} vacio="Sin movimientos registrados en el año vigente para esta cuenta." />
              </div>
            )}
          </div>
        </div>
        <div className="card p-4">
          <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Balanza de comprobación — {inst.siglas}</h3><DemoTag /></div>
          <div className="text-xs text-[var(--text-muted)] mb-2">Período {periodoKey}</div>
          <div className="max-h-96 overflow-y-auto">
            <DataTable columnas={columnasSaldosInst} filas={saldosInst} keyExtractor={(s) => `${s.institucionId}-${s.cuentaId}`} filasPorPagina={8} />
          </div>
        </div>
      </div>

      <div className="card p-4 text-xs text-[var(--text-secondary)]">
        <strong>Fuente normativa:</strong> {FUENTE_PLAN_CUENTAS.nombre} ({FUENTE_PLAN_CUENTAS.emisor}, {FUENTE_PLAN_CUENTAS.fecha}), basado en {FUENTE_PLAN_CUENTAS.marcoConceptual}. {FUENTE_PLAN_CUENTAS.nota}
      </div>
    </div>
  );
}
