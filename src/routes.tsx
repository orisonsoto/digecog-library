import {
  LayoutDashboard, Radar, BookOpenText, FileBarChart2, GitMerge, CalendarCheck2,
  ShieldCheck, FileStack, LineChart, Factory, MapPinned, Gauge, BellRing, Sparkles,
  Scale, GraduationCap, Boxes, Cable, Target, ClipboardList, FolderKanban, TriangleAlert,
  Award, FolderOpen, BarChart3, Globe2, Settings, Lightbulb,
} from 'lucide-react';
import type { ComponentType } from 'react';

export interface RutaModulo {
  path: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  grupo: string;
}

export const GRUPOS_ORDEN = [
  'Centro de Mando',
  'Monitoreo Nacional',
  'Contabilidad Gubernamental',
  'Cumplimiento y Calidad',
  'Analítica e Inteligencia',
  'Normativa y Conocimiento',
  'Interoperabilidad y Transparencia',
  'Gestión Institucional',
  'Administración',
];

export const RUTAS: RutaModulo[] = [
  { path: '/', label: 'Centro de Mando Ejecutivo', icon: LayoutDashboard, grupo: 'Centro de Mando' },

  { path: '/monitor', label: 'Monitor Nacional', icon: Radar, grupo: 'Monitoreo Nacional' },
  { path: '/empresas-publicas', label: 'Empresas Públicas', icon: Factory, grupo: 'Monitoreo Nacional' },
  { path: '/gobiernos-locales', label: 'Gobiernos Locales', icon: MapPinned, grupo: 'Monitoreo Nacional' },

  { path: '/contabilidad', label: 'Explorador Contable', icon: BookOpenText, grupo: 'Contabilidad Gubernamental' },
  { path: '/estados-financieros', label: 'Estados Financieros', icon: FileBarChart2, grupo: 'Contabilidad Gubernamental' },
  { path: '/consolidacion', label: 'Consolidación', icon: GitMerge, grupo: 'Contabilidad Gubernamental' },
  { path: '/cierre', label: 'Centro de Cierre', icon: CalendarCheck2, grupo: 'Contabilidad Gubernamental' },

  { path: '/sisacnoc', label: 'SISACNOC 360°', icon: ShieldCheck, grupo: 'Cumplimiento y Calidad' },
  { path: '/erir', label: 'ERIR', icon: FileStack, grupo: 'Cumplimiento y Calidad' },
  { path: '/calidad-dato', label: 'Calidad del Dato', icon: Gauge, grupo: 'Cumplimiento y Calidad' },

  { path: '/analitica', label: 'Analítica Financiera', icon: LineChart, grupo: 'Analítica e Inteligencia' },
  { path: '/alertas', label: 'Centro de Alertas', icon: BellRing, grupo: 'Analítica e Inteligencia' },
  { path: '/mia', label: 'Copiloto Mía AI', icon: Sparkles, grupo: 'Analítica e Inteligencia' },

  { path: '/normativas', label: 'Normativas', icon: Scale, grupo: 'Normativa y Conocimiento' },
  { path: '/sinoc', label: 'SINOC — Capacitación', icon: GraduationCap, grupo: 'Normativa y Conocimiento' },
  { path: '/siab', label: 'SIAB — Activos', icon: Boxes, grupo: 'Normativa y Conocimiento' },

  { path: '/interoperabilidad', label: 'Interoperabilidad', icon: Cable, grupo: 'Interoperabilidad y Transparencia' },
  { path: '/estadisticas', label: 'Estadísticas / SIPEI', icon: BarChart3, grupo: 'Interoperabilidad y Transparencia' },
  { path: '/transparencia', label: 'Transparencia', icon: Globe2, grupo: 'Interoperabilidad y Transparencia' },

  { path: '/pei', label: 'PEI 2025-2028', icon: Target, grupo: 'Gestión Institucional' },
  { path: '/poa', label: 'POA 2026', icon: ClipboardList, grupo: 'Gestión Institucional' },
  { path: '/proyectos', label: 'Proyectos', icon: FolderKanban, grupo: 'Gestión Institucional' },
  { path: '/riesgos', label: 'Riesgos', icon: TriangleAlert, grupo: 'Gestión Institucional' },
  { path: '/sig', label: 'Sistema Integrado de Gestión', icon: Award, grupo: 'Gestión Institucional' },
  { path: '/documental', label: 'Gestión Documental', icon: FolderOpen, grupo: 'Gestión Institucional' },
  { path: '/innovacion', label: 'Innovación y Mejora Continua', icon: Lightbulb, grupo: 'Gestión Institucional' },

  { path: '/administracion', label: 'Administración del Sistema', icon: Settings, grupo: 'Administración' },
];

export function rutaActivaPara(pathname: string): RutaModulo | undefined {
  if (pathname.startsWith('/institucion/')) return RUTAS.find((r) => r.path === '/monitor');
  return RUTAS.find((r) => r.path === pathname) ?? RUTAS.find((r) => pathname.startsWith(r.path) && r.path !== '/');
}
