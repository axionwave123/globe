import { useControls, button, folder } from 'leva'
import { useEffect } from 'react'
import { useLabStore } from '../store'

export function ControlStudio() {
  const selectedPanelId = useLabStore((s) => s.selectedPanelId)
  const panels = useLabStore((s) => s.panels)
  const setPanelColor = useLabStore((s) => s.setPanelColor)
  const setPanelIntensity = useLabStore((s) => s.setPanelIntensity)
  const setGlobalIntensity = useLabStore((s) => s.setGlobalIntensity)
  const setAnimationSpeed = useLabStore((s) => s.setAnimationSpeed)
  const toggleAnimation = useLabStore((s) => s.toggleAnimation)
  const setArmAngle = useLabStore((s) => s.setArmAngle)
  const setExpandFactor = useLabStore((s) => s.setExpandFactor)
  const setMachineRotation = useLabStore((s) => s.setMachineRotation)
  const setBloomIntensity = useLabStore((s) => s.setBloomIntensity)
  const setAmbientIntensity = useLabStore((s) => s.setAmbientIntensity)
  const resetPanels = useLabStore((s) => s.resetPanels)
  const randomizeColors = useLabStore((s) => s.randomizeColors)

  const selected = selectedPanelId ? panels[selectedPanelId] : null

  // Global & machine controls
  useControls(
    'ENGINEERING LAB',
    {
      'Global Intensity': {
        value: 1.4,
        min: 0.1,
        max: 4,
        step: 0.05,
        onChange: setGlobalIntensity,
      },
      'Bloom Intensity': {
        value: 1.8,
        min: 0,
        max: 4,
        step: 0.05,
        onChange: setBloomIntensity,
      },
      'Ambient Light': {
        value: 0.25,
        min: 0,
        max: 1,
        step: 0.02,
        onChange: setAmbientIntensity,
      },
      'Animation Speed': {
        value: 1,
        min: 0,
        max: 3,
        step: 0.05,
        onChange: setAnimationSpeed,
      },
      'Toggle Animation': button(() => toggleAnimation()),
      'Randomize All Colors': button(() => randomizeColors()),
      'Reset Panels': button(() => resetPanels()),
    },
    { collapsed: false }
  )

  useControls(
    'KINETIC MECHANICS',
    {
      'Arm Fold Angle': {
        value: 0,
        min: -1.2,
        max: 1.2,
        step: 0.02,
        onChange: setArmAngle,
      },
      'Expand Factor': {
        value: 1,
        min: 0.6,
        max: 1.5,
        step: 0.02,
        onChange: setExpandFactor,
      },
      'Manual Y Rotation': {
        value: 0,
        min: -Math.PI,
        max: Math.PI,
        step: 0.02,
        onChange: setMachineRotation,
      },
    },
    { collapsed: false }
  )

  // Selected panel controls — updates live when selection changes
  const [, setPanelControls] = useControls(
    () => ({
      'SELECTED PANEL': folder(
        {
          info: {
            value: selectedPanelId ?? 'Click any LED panel…',
            editable: false,
          },
          color: {
            value: selected?.color ?? '#00ffff',
            onChange: (c: string) => {
              if (selectedPanelId) setPanelColor(selectedPanelId, c)
            },
          },
          intensity: {
            value: selected?.intensity ?? 1.2,
            min: 0,
            max: 5,
            step: 0.05,
            onChange: (v: number) => {
              if (selectedPanelId) setPanelIntensity(selectedPanelId, v)
            },
          },
        },
        { collapsed: false }
      ),
    }),
    [selectedPanelId, selected?.color, selected?.intensity]
  )

  // Keep the info field in sync (cast to avoid leva schema narrowing)
  useEffect(() => {
    setPanelControls({
      info: selectedPanelId ?? 'Click any LED panel…',
      color: selected?.color ?? '#00ffff',
      intensity: selected?.intensity ?? 1.2,
    } as Record<string, unknown>)
  }, [selectedPanelId, selected, setPanelControls])

  return null // Leva renders its own UI
}