import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LEDPanel } from './LEDPanel'
import { useLabStore } from '../store'

export function KineticMachine() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Group>(null)
  const armsRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)

  const isAnimating = useLabStore((s) => s.isAnimating)
  const animationSpeed = useLabStore((s) => s.animationSpeed)
  const armAngle = useLabStore((s) => s.armAngle)
  const expandFactor = useLabStore((s) => s.expandFactor)
  const machineRotation = useLabStore((s) => s.machineRotation)

  // Generate ring panel positions
  const ringConfigs = useMemo(() => {
    const configs: { id: string; pos: [number, number, number]; rot: [number, number, number] }[] = []
    const rings = [
      { count: 8, radius: 1.6, y: 0.9, prefix: 'ring1', size: 0.38 },
      { count: 12, radius: 2.35, y: 0.0, prefix: 'ring2', size: 0.36 },
      { count: 16, radius: 3.1, y: -0.85, prefix: 'ring3', size: 0.32 },
    ]
    rings.forEach((ring) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2
        const x = Math.cos(angle) * ring.radius
        const z = Math.sin(angle) * ring.radius
        configs.push({
          id: `${ring.prefix}-${i}`,
          pos: [x, ring.y, z],
          rot: [0, -angle + Math.PI / 2, 0],
        })
      }
    })
    return configs
  }, [])

  // Vertical kinetic sections (moving arms)
  const sectionConfigs = useMemo(() => {
    const configs: {
      section: number
      panels: { id: string; localPos: [number, number, number] }[]
      baseAngle: number
    }[] = []
    for (let s = 0; s < 6; s++) {
      const baseAngle = (s / 6) * Math.PI * 2
      const panels = []
      for (let p = 0; p < 4; p++) {
        panels.push({
          id: `section-${s}-p${p}`,
          localPos: [0, 0.55 - p * 0.42, 0.55] as [number, number, number],
        })
      }
      configs.push({ section: s, panels, baseAngle })
    }
    return configs
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current || !coreRef.current || !armsRef.current || !ringsRef.current) return

    const t = state.clock.elapsedTime * animationSpeed

    // Base slow rotation + manual override
    if (isAnimating) {
      groupRef.current.rotation.y = t * 0.12 + machineRotation
      coreRef.current.rotation.y = -t * 0.25
      ringsRef.current.rotation.y = t * 0.08
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        machineRotation,
        delta * 3
      )
    }

    // Kinetic arms: expand / fold + wave motion
    armsRef.current.children.forEach((arm, i) => {
      const phase = t * 0.7 + i * (Math.PI / 3)
      const wave = Math.sin(phase) * 0.35
      const fold = armAngle + wave * (isAnimating ? 1 : 0)
      arm.rotation.x = fold
      arm.position.y = Math.sin(phase * 0.5) * 0.08 * expandFactor
    })

    // Subtle vertical breathing of the whole machine
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.04
  })

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Central core column */}
      <group ref={coreRef}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.7, 2.8, 32]} />
          <meshStandardMaterial
            color="#12121a"
            metalness={0.95}
            roughness={0.12}
            envMapIntensity={1.6}
          />
        </mesh>

        {/* Glowing core rings */}
        {[0.9, 0.3, -0.4, -1.0].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.58 + i * 0.02, 0.035, 12, 48]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={1.8}
              metalness={0.6}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Top beacon */}
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color="#ff2d95"
            emissive="#ff2d95"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Rotating LED rings */}
      <group ref={ringsRef}>
        {ringConfigs.map((cfg) => (
          <LEDPanel
            key={cfg.id}
            id={cfg.id}
            position={cfg.pos}
            rotation={cfg.rot}
            width={0.38}
            height={0.38}
          />
        ))}
      </group>

      {/* Kinetic moving arms / sections */}
      <group ref={armsRef}>
        {sectionConfigs.map((sec) => {
          const radius = 2.0 * expandFactor
          const x = Math.cos(sec.baseAngle) * radius
          const z = Math.sin(sec.baseAngle) * radius
          return (
            <group
              key={sec.section}
              position={[x, 0.4, z]}
              rotation={[0, -sec.baseAngle + Math.PI / 2, 0]}
            >
              {/* Arm structure */}
              <mesh position={[0, 0, 0.2]} castShadow>
                <boxGeometry args={[0.18, 1.9, 0.12]} />
                <meshStandardMaterial
                  color="#1c1c28"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
              {/* Joint sphere */}
              <mesh position={[0, 0.95, 0.15]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#333344" metalness={0.95} roughness={0.1} />
              </mesh>

              {sec.panels.map((p) => (
                <LEDPanel
                  key={p.id}
                  id={p.id}
                  position={p.localPos}
                  width={0.4}
                  height={0.36}
                  depth={0.05}
                />
              ))}
            </group>
          )
        })}
      </group>

      {/* Base platform */}
      <mesh position={[0, -1.55, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.6, 3.9, 0.25, 64]} />
        <meshStandardMaterial
          color="#0d0d14"
          metalness={0.85}
          roughness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Base accent ring */}
      <mesh position={[0, -1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.55, 0.04, 12, 64]} />
        <meshStandardMaterial
          color="#00b4ff"
          emissive="#00b4ff"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Floor reflection plate */}
      <mesh position={[0, -1.68, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial
          color="#05050a"
          metalness={0.98}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>
    </group>
  )
}