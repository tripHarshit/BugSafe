import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

const GalaxyField = ({ count = 800, speed = 0.03 }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      ],
      velocity: [
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed
      ],
      size: Math.random() * 0.04 + 0.02,
      brightness: Math.random() * 0.8 + 0.2
    }));
    setStars(newStars);
  }, [count, speed]);

  useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      setStars(prev => prev.map(star => ({
        ...star,
        position: star.position.map((pos, i) => {
          const newPos = pos + star.velocity[i];
          if (Math.abs(newPos) > 20) {
            return -20 * Math.sign(newPos);
          }
          return newPos;
        })
      })));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <group>
      {stars.map(star => (
        <mesh key={star.id} position={star.position}>
          <sphereGeometry args={[star.size, 6, 6]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={star.brightness}
          />
        </mesh>
      ))}
    </group>
  );
};

const NebulaClouds = () => {
  return (
    <group>
      {/* Primary nebula */}
      <mesh position={[8, 3, -8]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.02}
        />
      </mesh>
      
      {/* Secondary nebula */}
      <mesh position={[-5, -2, 6]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.015}
        />
      </mesh>
      
      {/* Accent nebula */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.01}
        />
      </mesh>
    </group>
  );
};

const LowPowerFallback = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-white/2 via-white/1 to-white/3" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-float" style={{ animationDuration: '12s' }} />
    <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-white/2 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '15s' }} />
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/2 rounded-full blur-3xl animate-float" style={{ animationDelay: '8s', animationDuration: '18s' }} />
  </div>
);

export const BackgroundScene = ({ children, lowPower = false }) => {
  const [isLowPower, setIsLowPower] = useState(lowPower);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const hasLowEndGPU = navigator.hardwareConcurrency < 4;
    
    setIsLowPower(prefersReducedMotion || isMobile || hasLowEndGPU);
  }, []);

  if (isLowPower) {
    return (
      <div className="relative min-h-screen">
        <LowPowerFallback />
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.05} />
            <pointLight position={[15, 15, 15]} intensity={0.3} color="#ffffff" />
            <pointLight position={[-15, -15, -15]} intensity={0.2} color="#ffffff" />
            
            <Stars radius={150} depth={80} count={4000} factor={4} saturation={0} fade speed={0.08} />
            
            <GalaxyField count={600} speed={0.02} />
            <NebulaClouds />
            
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              autoRotate
              autoRotateSpeed={0.05}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
