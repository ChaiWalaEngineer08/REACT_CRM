import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function ThreeBG() {
    return (
        <Canvas
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -10,
            }}
            camera={{ position: [0, 0, 10], fov: 60 }}
        >
            {/* @ts-ignore */}
            <color attach="background" args={['#0f172a']} />


            <Stars
                radius={100}
                depth={80}
                count={8000}
                factor={4}
                saturation={0}
                fade
            />

            {/* @ts-ignore */}
            <ambientLight intensity={0.6} />
            {/* @ts-ignore */}
            <pointLight position={[10, 10, 4]} intensity={1.2} />


            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
        </Canvas>
    );
}
