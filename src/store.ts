import { create } from 'zustand'

export type PanelId = string

export interface PanelState {
  id: PanelId
  color: string
  intensity: number
  selected: boolean
}

interface LabState {
  panels: Record<PanelId, PanelState>
  globalIntensity: number
  animationSpeed: number
  isAnimating: boolean
  selectedPanelId: PanelId | null
  machineRotation: number
  armAngle: number
  expandFactor: number
  bloomIntensity: number
  ambientIntensity: number

  selectPanel: (id: PanelId | null) => void
  setPanelColor: (id: PanelId, color: string) => void
  setPanelIntensity: (id: PanelId, intensity: number) => void
  setGlobalIntensity: (v: number) => void
  setAnimationSpeed: (v: number) => void
  toggleAnimation: () => void
  setMachineRotation: (v: number) => void
  setArmAngle: (v: number) => void
  setExpandFactor: (v: number) => void
  setBloomIntensity: (v: number) => void
  setAmbientIntensity: (v: number) => void
  resetPanels: () => void
  randomizeColors: () => void
}

const createInitialPanels = (): Record<PanelId, PanelState> => {
  const panels: Record<PanelId, PanelState> = {}
  // 3 rings of panels + center
  const rings = [
    { count: 8, prefix: 'ring1' },
    { count: 12, prefix: 'ring2' },
    { count: 16, prefix: 'ring3' },
  ]
  rings.forEach((ring) => {
    for (let i = 0; i < ring.count; i++) {
      const id = `${ring.prefix}-${i}`
      panels[id] = {
        id,
        color: `hsl(${(i * 360) / ring.count}, 90%, 55%)`,
        intensity: 1.2,
        selected: false,
      }
    }
  })
  // vertical kinetic sections
  for (let s = 0; s < 6; s++) {
    for (let p = 0; p < 4; p++) {
      const id = `section-${s}-p${p}`
      panels[id] = {
        id,
        color: `hsl(${s * 60 + p * 15}, 85%, 50%)`,
        intensity: 1.0,
        selected: false,
      }
    }
  }
  return panels
}

export const useLabStore = create<LabState>((set, get) => ({
  panels: createInitialPanels(),
  globalIntensity: 1.4,
  animationSpeed: 1.0,
  isAnimating: true,
  selectedPanelId: null,
  machineRotation: 0,
  armAngle: 0,
  expandFactor: 1,
  bloomIntensity: 1.8,
  ambientIntensity: 0.25,

  selectPanel: (id) =>
    set((state) => {
      const panels = { ...state.panels }
      Object.keys(panels).forEach((k) => {
        panels[k] = { ...panels[k], selected: k === id }
      })
      return { panels, selectedPanelId: id }
    }),

  setPanelColor: (id, color) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], color },
      },
    })),

  setPanelIntensity: (id, intensity) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], intensity },
      },
    })),

  setGlobalIntensity: (v) => set({ globalIntensity: v }),
  setAnimationSpeed: (v) => set({ animationSpeed: v }),
  toggleAnimation: () => set((s) => ({ isAnimating: !s.isAnimating })),
  setMachineRotation: (v) => set({ machineRotation: v }),
  setArmAngle: (v) => set({ armAngle: v }),
  setExpandFactor: (v) => set({ expandFactor: v }),
  setBloomIntensity: (v) => set({ bloomIntensity: v }),
  setAmbientIntensity: (v) => set({ ambientIntensity: v }),

  resetPanels: () => set({ panels: createInitialPanels(), selectedPanelId: null }),

  randomizeColors: () =>
    set((state) => {
      const panels = { ...state.panels }
      Object.keys(panels).forEach((k) => {
        panels[k] = {
          ...panels[k],
          color: `hsl(${Math.random() * 360}, ${70 + Math.random() * 30}%, ${45 + Math.random() * 20}%)`,
        }
      })
      return { panels }
    }),
}))