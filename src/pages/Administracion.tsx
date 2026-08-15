import { useState } from 'react';
import { SectionHeader, Tabs, KpiCard, Badge, DemoTag } from '../components/ui/primitives';

export default function Administracion() {
  const [tab, setTab] = useState('rrhh');

  return (
    <div className="space-y-4">
      <SectionHeader titulo="Administración del Sistema" subtitulo="Necesidades administrativas internas de DIGECOG: Recursos Humanos, Administrativo-Financiero, Tecnología, Jurídico, Comunicaciones, OAI y Planificación." esDemo />
      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'rrhh', label: 'Recursos Humanos' }, { id: 'admfin', label: 'Admin. Financiero' }, { id: 'tec', label: 'Tecnología' },
        { id: 'juridico', label: 'Jurídico' }, { id: 'comunicaciones', label: 'Comunicaciones' }, { id: 'oai', label: 'OAI' },
      ]} />

      {tab === 'rrhh' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard titulo="Colaboradores activos" valor="286" />
          <KpiCard titulo="Vacantes abiertas" valor="14" />
          <KpiCard titulo="Índice de rotación" valor="8.2%" />
          <KpiCard titulo="Capacitaciones internas 2026" valor="22" />
        </div>
      )}

      {tab === 'admfin' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard titulo="Presupuesto institucional 2026" valor="RD$412M" />
          <KpiCard titulo="Ejecución presupuestaria" valor="68.4%" />
          <KpiCard titulo="Proveedores activos" valor="47" />
          <KpiCard titulo="Cuentas por pagar" valor="RD$8.1M" />
        </div>
      )}

      {tab === 'tec' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard titulo="Sistemas en producción" valor="9" />
          <KpiCard titulo="Incidentes abiertos" valor="3" />
          <KpiCard titulo="Disponibilidad de sistemas" valor="99.1%" />
          <KpiCard titulo="Activos TIC gestionados" valor="512" />
        </div>
      )}

      {tab === 'juridico' && (
        <div className="card p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Contratos vigentes</span><Badge tono="info">31</Badge></div>
          <div className="flex justify-between"><span>Verificaciones de cumplimiento (Ley 47-25)</span><Badge tono="alerta">En proceso</Badge></div>
          <div className="flex justify-between"><span>Obligaciones legales monitoreadas</span><Badge tono="neutral">18</Badge></div>
        </div>
      )}

      {tab === 'comunicaciones' && (
        <div className="card p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Campañas activas</span><span>2</span></div>
          <div className="flex justify-between"><span>Publicaciones institucionales (2026)</span><span>34</span></div>
          <div className="flex justify-between"><span>Eventos realizados</span><span>7</span></div>
        </div>
      )}

      {tab === 'oai' && (
        <div className="card p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Solicitudes de acceso a la información (2026)</span><span>58</span></div>
          <div className="flex justify-between"><span>Tiempo promedio de respuesta</span><span>4.2 días</span></div>
          <div className="flex justify-between"><span>Solicitudes vía 311</span><span>12</span></div>
        </div>
      )}
      <div className="flex justify-end"><DemoTag /></div>
    </div>
  );
}
