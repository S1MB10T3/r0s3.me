import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

/**
 * Placeholder R3F hero scene — swap the mesh for the real hero model
 * (draco-compressed .glb in public/models). Loaded lazily from Hero.tsx.
 * Honor prefers-reduced-motion with a static fallback (ADR-001).
 */
export default function HeroScene() {
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    return <div aria-hidden style={{ height: '50vh' }} />
  }

  return (
    <Canvas camera={{ position: [0, 0, 4] }} style={{ height: '50vh' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 4, 3]} />
      <mesh rotation={[0.4, 0.6, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="#111111" wireframe />
      </mesh>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
