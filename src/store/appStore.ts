import { create } from 'zustand';
import { PERIODO_ACTUAL } from '../data/periodos';

// ---------------------------------------------------------------------------
// AUTENTICACIÓN SIMULADA (DEMO)
// Este prototipo NO tiene backend: la validación ocurre en el navegador contra
// una credencial fija. No es un mecanismo de seguridad real y no debe usarse
// para proteger información sensible. En una implementación real, la
// autenticación se delegaría a Single Sign-On institucional + MFA (ver §52
// del prompt maestro y docs/01-descubrimiento-arquitectura.md).
// ---------------------------------------------------------------------------
export const CREDENCIAL_DEMO = {
  usuario: 'lauraperez@gmail.com',
  clave: '1234',
};

const CLAVE_SESION = 'digecog360.sesion';

interface SesionGuardada {
  usuario: string;
  rol: string;
}

function leerSesion(): SesionGuardada | null {
  try {
    const raw = sessionStorage.getItem(CLAVE_SESION);
    return raw ? (JSON.parse(raw) as SesionGuardada) : null;
  } catch {
    return null;
  }
}

function guardarSesion(s: SesionGuardada | null) {
  try {
    if (s) sessionStorage.setItem(CLAVE_SESION, JSON.stringify(s));
    else sessionStorage.removeItem(CLAVE_SESION);
  } catch {
    /* sessionStorage no disponible: la sesión solo vive en memoria */
  }
}

const sesionInicial = leerSesion();

/** Valida las credenciales sin modificar el estado de sesión. */
export function validarCredencial(usuario: string, clave: string): { ok: boolean; error?: string } {
  const usuarioNormalizado = usuario.trim().toLowerCase();
  if (!usuarioNormalizado || !clave) {
    return { ok: false, error: 'Ingrese usuario y contraseña.' };
  }
  if (usuarioNormalizado !== CREDENCIAL_DEMO.usuario) {
    return { ok: false, error: 'Usuario no reconocido en el entorno de demostración.' };
  }
  if (clave !== CREDENCIAL_DEMO.clave) {
    return { ok: false, error: 'Contraseña incorrecta.' };
  }
  return { ok: true };
}

interface AppState {
  // Sesión
  autenticado: boolean;
  usuario: string | null;
  rol: string | null;
  iniciarSesion: (usuario: string, clave: string, rol: string) => { ok: boolean; error?: string };
  cerrarSesion: () => void;

  // Contexto de navegación
  periodoKey: string;
  setPeriodoKey: (k: string) => void;
  institucionSeleccionadaId: string | null;
  setInstitucionSeleccionada: (id: string | null) => void;
  panelDerechoAbierto: boolean;
  setPanelDerechoAbierto: (v: boolean) => void;
  miaAbierta: boolean;
  setMiaAbierta: (v: boolean) => void;
  sidebarColapsado: boolean;
  toggleSidebar: () => void;
  /** Drawer de navegación en móvil (< lg). En escritorio el sidebar es fijo. */
  menuMovilAbierto: boolean;
  setMenuMovilAbierto: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  autenticado: sesionInicial !== null,
  usuario: sesionInicial?.usuario ?? null,
  rol: sesionInicial?.rol ?? null,

  iniciarSesion: (usuario, clave, rol) => {
    const resultado = validarCredencial(usuario, clave);
    if (!resultado.ok) return resultado;
    const usuarioNormalizado = usuario.trim().toLowerCase();
    guardarSesion({ usuario: usuarioNormalizado, rol });
    set({ autenticado: true, usuario: usuarioNormalizado, rol });
    return { ok: true };
  },

  cerrarSesion: () => {
    guardarSesion(null);
    set({ autenticado: false, usuario: null, rol: null });
  },

  periodoKey: PERIODO_ACTUAL.key,
  setPeriodoKey: (k) => set({ periodoKey: k }),
  institucionSeleccionadaId: null,
  setInstitucionSeleccionada: (id) => set({ institucionSeleccionadaId: id }),
  // En móvil el panel es una hoja a pantalla completa: debe iniciar cerrado.
  panelDerechoAbierto: typeof window === 'undefined' ? true : window.innerWidth >= 1024,
  setPanelDerechoAbierto: (v) => set({ panelDerechoAbierto: v }),
  miaAbierta: false,
  setMiaAbierta: (v) => set({ miaAbierta: v }),
  sidebarColapsado: false,
  toggleSidebar: () => set((s) => ({ sidebarColapsado: !s.sidebarColapsado })),
  menuMovilAbierto: false,
  setMenuMovilAbierto: (v) => set({ menuMovilAbierto: v }),
}));
