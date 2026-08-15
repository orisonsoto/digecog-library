import { create } from 'zustand';
import { PERIODO_ACTUAL } from '../data/periodos';

interface AppState {
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
}

export const useAppStore = create<AppState>((set) => ({
  periodoKey: PERIODO_ACTUAL.key,
  setPeriodoKey: (k) => set({ periodoKey: k }),
  institucionSeleccionadaId: null,
  setInstitucionSeleccionada: (id) => set({ institucionSeleccionadaId: id }),
  panelDerechoAbierto: true,
  setPanelDerechoAbierto: (v) => set({ panelDerechoAbierto: v }),
  miaAbierta: false,
  setMiaAbierta: (v) => set({ miaAbierta: v }),
  sidebarColapsado: false,
  toggleSidebar: () => set((s) => ({ sidebarColapsado: !s.sidebarColapsado })),
}));
