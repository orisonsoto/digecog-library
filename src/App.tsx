import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

const Login = lazy(() => import('./pages/Login'));
const HomeEjecutivo = lazy(() => import('./pages/HomeEjecutivo'));
const MonitorNacional = lazy(() => import('./pages/MonitorNacional'));
const FichaInstitucion = lazy(() => import('./pages/FichaInstitucion'));
const ExploradorContable = lazy(() => import('./pages/ExploradorContable'));
const EstadosFinancieros = lazy(() => import('./pages/EstadosFinancieros'));
const Consolidacion = lazy(() => import('./pages/Consolidacion'));
const CentroCierre = lazy(() => import('./pages/CentroCierre'));
const Sisacnoc = lazy(() => import('./pages/Sisacnoc'));
const Erir = lazy(() => import('./pages/Erir'));
const AnaliticaFinanciera = lazy(() => import('./pages/AnaliticaFinanciera'));
const EmpresasPublicas = lazy(() => import('./pages/EmpresasPublicas'));
const GobiernosLocales = lazy(() => import('./pages/GobiernosLocales'));
const CalidadDato = lazy(() => import('./pages/CalidadDato'));
const CentroAlertas = lazy(() => import('./pages/CentroAlertas'));
const MiaAI = lazy(() => import('./pages/MiaAI'));
const Normativas = lazy(() => import('./pages/Normativas'));
const Sinoc = lazy(() => import('./pages/Sinoc'));
const Siab = lazy(() => import('./pages/Siab'));
const Interoperabilidad = lazy(() => import('./pages/Interoperabilidad'));
const Pei = lazy(() => import('./pages/Pei'));
const Poa = lazy(() => import('./pages/Poa'));
const Proyectos = lazy(() => import('./pages/Proyectos'));
const Riesgos = lazy(() => import('./pages/Riesgos'));
const Sig = lazy(() => import('./pages/Sig'));
const GestionDocumental = lazy(() => import('./pages/GestionDocumental'));
const Innovacion = lazy(() => import('./pages/Innovacion'));
const Estadisticas = lazy(() => import('./pages/Estadisticas'));
const Transparencia = lazy(() => import('./pages/Transparencia'));
const Administracion = lazy(() => import('./pages/Administracion'));

function Cargando() {
  return <div className="flex items-center justify-center h-full w-full text-sm text-[var(--text-muted)]">Cargando módulo…</div>;
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Cargando />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<HomeEjecutivo />} />
            <Route path="/monitor" element={<MonitorNacional />} />
            <Route path="/institucion/:id" element={<FichaInstitucion />} />
            <Route path="/contabilidad" element={<ExploradorContable />} />
            <Route path="/estados-financieros" element={<EstadosFinancieros />} />
            <Route path="/consolidacion" element={<Consolidacion />} />
            <Route path="/cierre" element={<CentroCierre />} />
            <Route path="/sisacnoc" element={<Sisacnoc />} />
            <Route path="/erir" element={<Erir />} />
            <Route path="/analitica" element={<AnaliticaFinanciera />} />
            <Route path="/empresas-publicas" element={<EmpresasPublicas />} />
            <Route path="/gobiernos-locales" element={<GobiernosLocales />} />
            <Route path="/calidad-dato" element={<CalidadDato />} />
            <Route path="/alertas" element={<CentroAlertas />} />
            <Route path="/mia" element={<MiaAI />} />
            <Route path="/normativas" element={<Normativas />} />
            <Route path="/sinoc" element={<Sinoc />} />
            <Route path="/siab" element={<Siab />} />
            <Route path="/interoperabilidad" element={<Interoperabilidad />} />
            <Route path="/pei" element={<Pei />} />
            <Route path="/poa" element={<Poa />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/riesgos" element={<Riesgos />} />
            <Route path="/sig" element={<Sig />} />
            <Route path="/documental" element={<GestionDocumental />} />
            <Route path="/innovacion" element={<Innovacion />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/transparencia" element={<Transparencia />} />
            <Route path="/administracion" element={<Administracion />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
