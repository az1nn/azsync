import { Float, OrbitControls, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'

type SceneProps = {
  palette: [string, string, string]
  intensity: number
}

function SignalCore({ palette, intensity }: SceneProps) {
  const group = useRef<Group>(null)
  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2
        const radius = 2.25 + (i % 3) * 0.18
        return [
          Math.cos(angle) * radius,
          Math.sin(i * 1.7) * 0.55,
          Math.sin(angle) * radius,
        ] as const
      }),
    [],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * (0.08 + intensity * 0.08)
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08
  })

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.45}>
        <mesh>
          <icosahedronGeometry args={[1.05, 2]} />
          <meshPhysicalMaterial
            color={palette[0]}
            emissive={palette[1]}
            emissiveIntensity={0.55 + intensity * 0.5}
            roughness={0.22}
            metalness={0.28}
            transmission={0.18}
            transparent
            opacity={0.82}
          />
        </mesh>
        <mesh scale={1.18}>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshBasicMaterial color={palette[2]} wireframe transparent opacity={0.36} />
        </mesh>
      </Float>

      {[2.0, 2.65, 3.25].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[
            Math.PI / 2 + index * 0.32,
            index * 0.74,
            index * 0.21,
          ]}
        >
          <torusGeometry args={[radius, 0.008 + index * 0.004, 12, 160]} />
          <meshBasicMaterial color={palette[index]} transparent opacity={0.35} />
        </mesh>
      ))}

      {nodes.map((position, index) => (
        <mesh key={index} position={position} scale={0.7 + (index % 4) * 0.08}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={palette[index % palette.length]} />
        </mesh>
      ))}
    </group>
  )
}

export function GrimoireScene({ palette, intensity }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.65, 7.8], fov: 44 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#05040a']} />
      <fog attach="fog" args={['#05040a', 7, 16]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={16} color={palette[0]} />
      <pointLight position={[-4, -2, -3]} intensity={10} color={palette[2]} />
      <Stars radius={45} depth={22} count={1600} factor={2.4} saturation={0.1} fade speed={0.25} />
      <SignalCore palette={palette} intensity={intensity} />
      <OrbitControls
        enablePan={false}
        minDistance={5.1}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  )
}
