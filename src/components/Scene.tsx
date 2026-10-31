import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Stars,
  Float,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { KineticMachine } from './KineticMachine'
import { useLabStore } from '../store'

function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  useFrame((state) => {
    if (!cameraRef.current) return
    // gentle idle sway
    cameraRef.current.position.x = THREE.MathUtils.lerp(
      cameraRef.current.position.x,
      Math.sin(state.clock.elapsedTime * 0.15) * 0.3,
      0.02
    )
  })
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[6.5, 3.2, 7.5]}
      fov={42}
      near={0.1}
      far={100}
    />
  )
}

function LabLighting() {
  const ambient = useLabStore((s) => s.ambientIntensity)
  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#e8f0ff"
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.45} color="#4060ff" />
      <pointLight position={[0, 4, 0]} intensity={0.8} color="#00e5ff" distance={12} />
      <spotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.6}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
    </>
  )
}

function PostFX() {
  const bloom = useLabStore((s) => s.bloomIntensity)
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={bloom}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.7}
        mipmapBlur
      />
      <Vignette offset={0.25} darkness={0.65} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0006, 0.0006)}
      />
    </EffectComposer>
  )
}

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <CameraRig />
        <LabLighting />

        <Stars radius={80} depth={50} count={4000} factor={3} saturation={0.4} fade speed={0.6} />

        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
          <KineticMachine />
        </Float>

        <ContactShadows
          position={[0, -1.68, 0]}
          opacity={0.65}
          scale={14}
          blur={2.5}
          far={6}
        />

        <Environment preset="city" environmentIntensity={0.55} />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={3.5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 1.75}
          target={[0, 0.3, 0]}
        />

        <PostFX />
      </Suspense>
    </Canvas>
  )
}