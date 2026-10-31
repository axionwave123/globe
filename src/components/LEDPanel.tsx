import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLabStore } from '../store'

interface LEDPanelProps {
  id: string
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  depth?: number
}

export function LEDPanel({
  id,
  position,
  rotation = [0, 0, 0],
  width = 0.42,
  height = 0.42,
  depth = 0.06,
}: LEDPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const frameRef = useRef<THREE.Mesh>(null)

  const panel = useLabStore((s) => s.panels[id])
  const globalIntensity = useLabStore((s) => s.globalIntensity)
  const selectPanel = useLabStore((s) => s.selectPanel)
  const selectedPanelId = useLabStore((s) => s.selectedPanelId)

  const isSelected = selectedPanelId === id

  const emissiveColor = useMemo(() => new THREE.Color(panel?.color || '#00ffff'), [panel?.color])

  useFrame((_, delta) => {
    if (!meshRef.current || !panel) return
    // subtle pulse when selected
    if (isSelected) {
      const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.15
      meshRef.current.scale.setScalar(pulse)
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8)
    }
  })

  if (!panel) return null

  const intensity = panel.intensity * globalIntensity

  return (
    <group position={position} rotation={rotation}>
      {/* Outer metallic frame */}
      <mesh ref={frameRef} castShadow receiveShadow>
        <boxGeometry args={[width + 0.04, height + 0.04, depth + 0.02]} />
        <meshStandardMaterial
          color="#1a1a22"
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Inner LED face — actual glowing surface */}
      <mesh
        ref={meshRef}
        position={[0, 0, depth / 2 + 0.005]}
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          selectPanel(id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[width - 0.02, height - 0.02, 0.02]} />
        <meshStandardMaterial
          color={panel.color}
          emissive={emissiveColor}
          emissiveIntensity={intensity}
          metalness={0.1}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>

      {/* Selection highlight ring */}
      {isSelected && (
        <mesh position={[0, 0, depth / 2 + 0.02]}>
          <ringGeometry args={[Math.max(width, height) * 0.55, Math.max(width, height) * 0.62, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Tiny LED grid dots for realism */}
      <mesh position={[0, 0, depth / 2 + 0.012]}>
        <planeGeometry args={[width - 0.06, height - 0.06]} />
        <meshBasicMaterial
          color={panel.color}
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}