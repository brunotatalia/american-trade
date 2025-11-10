import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface CelebrationEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);

      // Generate particles
      const newParticles: Particle[] = [];
      const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE'];

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: 50, // Start from center
          y: 50,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20 - 10, // Bias upward
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10
        });
      }

      setParticles(newParticles);

      // Cleanup after animation
      setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, isActive, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall 3s ease-out forwards`,
            '--vx': `${particle.vx}vw`,
            '--vy': `${particle.vy}vh`,
            '--rotation': `${particle.rotationSpeed * 360}deg`
          } as React.CSSProperties}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--vx), calc(100vh + var(--vy))) rotate(var(--rotation));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Fireworks effect for big achievements
interface FireworksEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export const FireworksEffect: React.FC<FireworksEffectProps> = ({ trigger, onComplete }) => {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);

      // Create multiple bursts
      const newBursts = [];
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const x = 20 + Math.random() * 60; // Random horizontal position
          const y = 20 + Math.random() * 40; // Random vertical position (upper half)
          setBursts(prev => [...prev, { id: Date.now() + i, x, y }]);
        }, i * 500);
      }

      // Cleanup
      setTimeout(() => {
        setIsActive(false);
        setBursts([]);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`
          }}
        >
          {/* Create radial burst particles */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i * 360) / 20;
            const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#F7DC6F'];
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: colors[i % colors.length],
                  animation: `firework-particle 1s ease-out forwards`,
                  '--angle': `${angle}deg`,
                  '--distance': '100px'
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}

      <style>{`
        @keyframes firework-particle {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--distance)),
              calc(sin(var(--angle)) * var(--distance))
            );
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
