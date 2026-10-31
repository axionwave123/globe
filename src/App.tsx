import { Scene } from './components/Scene'
import { ControlStudio } from './components/ControlStudio'
import { useLabStore } from './store'

function Header() {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        pointerEvents: 'none',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 800,
            fontSize: '1.65rem',
            letterSpacing: '0.18em',
            background: 'linear-gradient(135deg, #00e5ff 0%, #ff2d95 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(0, 229, 255, 0.35)',
          }}
        >
          GLOBE
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: 'rgba(180, 220, 255, 0.65)',
            letterSpacing: '0.12em',
            marginTop: '0.15rem',
          }}
        >
          KINETIC RGB LED ENGINEERING LAB
        </div>
      </div>

      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          color: 'rgba(0, 229, 255, 0.7)',
          textAlign: 'right',
          lineHeight: 1.6,
        }}
      >
        <div>DRAG · ROTATE · ZOOM</div>
        <div>CLICK PANELS TO SELECT</div>
        <div style={{ marginTop: '0.4rem', opacity: 0.5 }}>REAL-TIME 3D · THREE.JS</div>
      </div>
    </header>
  )
}

function StatusBar() {
  const selectedPanelId = useLabStore((s) => s.selectedPanelId)
  const isAnimating = useLabStore((s) => s.isAnimating)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        pointerEvents: 'none',
        padding: '1rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.68rem',
        color: 'rgba(160, 200, 255, 0.75)',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
      }}
    >
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <span>
          STATUS:{' '}
          <span style={{ color: isAnimating ? '#00ff9d' : '#ff6b6b' }}>
            {isAnimating ? 'ANIMATING' : 'PAUSED'}
          </span>
        </span>
        <span>
          SELECTED:{' '}
          <span style={{ color: selectedPanelId ? '#00e5ff' : 'rgba(255,255,255,0.35)' }}>
            {selectedPanelId ?? 'NONE'}
          </span>
        </span>
      </div>
      <div style={{ opacity: 0.55 }}>REACT THREE FIBER · DREI · LEVA</div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Scene />
      <ControlStudio />
      <Header />
      <StatusBar />
    </div>
  )
}