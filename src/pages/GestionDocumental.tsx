import { SectionHeader, Badge, DemoTag } from '../components/ui/primitives';
import { DataTable, type ColumnaTabla } from '../components/ui/DataTable';
import { DOCUMENTOS_NORMATIVOS } from '../data/generator';
import type { DocumentoNormativo } from '../data/types';

export default function GestionDocumental() {
  const enRevision = DOCUMENTOS_NORMATIVOS.filter((d) => d.estado === 'En revisión');
  const columnas: ColumnaTabla<DocumentoNormativo>[] = [
    { key: 'codigo', header: 'Código', accessor: (d) => d.codigo },
    { key: 'nombre', header: 'Nombre', accessor: (d) => d.nombre, sortable: true },
    { key: 'tipo', header: 'Tipo', accessor: (d) => d.tipo },
    { key: 'version', header: 'Versión', accessor: (d) => d.version },
    { key: 'proceso', header: 'Proceso asociado', accessor: (d) => d.proceso },
    { key: 'responsable', header: 'Responsable', accessor: (d) => d.responsable },
    { key: 'estado', header: 'Estado', accessor: (d) => d.estado, render: (d) => <Badge tono={d.estado === 'Vigente' ? 'exito' : d.estado === 'En revisión' ? 'alerta' : 'neutral'}>{d.estado}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Gestión Documental" subtitulo="Repositorio institucional de políticas, procedimientos, manuales, matrices y formularios con control de versión, vigencia y proceso asociado." />

      {enRevision.length > 0 && (
        <div className="card p-3 text-xs bg-amber-50 border-amber-200 text-amber-800">
          ⚠ {enRevision.length} documento(s) requieren revisión: {enRevision.map((d) => d.nombre).join('; ')}.
        </div>
      )}

      <div className="card p-4">
        <div className="flex justify-between items-center mb-2"><h3 className="font-semibold text-sm">Documentos controlados</h3><DemoTag label="Vinculación a proceso simulada" /></div>
        <DataTable columnas={columnas} filas={DOCUMENTOS_NORMATIVOS} keyExtractor={(d) => d.id} buscarPlaceholder="Buscar documento..." filasPorPagina={12} />
      </div>

      <div className="card p-4 text-xs text-[var(--text-secondary)] space-y-1">
        <div className="font-semibold text-[var(--text-primary)] mb-1">Elementos mínimos de control documental (§22 Contexto Maestro)</div>
        Código · Nombre · Tipo · Versión · Fecha de emisión · Fecha de revisión · Responsable · Elaboró/revisó/aprobó · Documentos relacionados · Base legal y normativa · Proceso asociado · Alineación PEI/POA · Riesgos · Indicadores · Registros/evidencias · Estado · Ubicación oficial · Historial de cambios.
      </div>
    </div>
  );
}
