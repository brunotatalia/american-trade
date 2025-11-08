import { useState, useEffect, useCallback } from 'react';

export interface ShakeConfig {
  duration?: number; // milliseconds
  intensity?: number; // pixels
  trigger: boolean;
}

export const useScreenShake = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [shakeStyle, setShakeStyle] = useState<React.CSSProperties>({});

  const shake = useCallback((duration: number = 500, intensity: number = 10) => {
    if (isShaking) return;

    setIsShaking(true);

    const startTime = Date.now();
    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        clearInterval(shakeInterval);
        setShakeStyle({});
        setIsShaking(false);
        return;
      }

      // Decrease intensity over time
      const currentIntensity = intensity * (1 - progress);
      const x = (Math.random() - 0.5) * currentIntensity * 2;
      const y = (Math.random() - 0.5) * currentIntensity * 2;

      setShakeStyle({
        transform: `translate(${x}px, ${y}px)`
      });
    }, 16); // ~60fps

    return () => clearInterval(shakeInterval);
  }, [isShaking]);

  return { shake, shakeStyle, isShaking };
};

// Component wrapper for screen shake
export const ScreenShakeWrapper: React.FC<{
  children: React.ReactNode;
  trigger: boolean;
  duration?: number;
  intensity?: number;
  onComplete?: () => void;
}> = ({ children, trigger, duration = 500, intensity = 10, onComplete }) => {
  const { shake, shakeStyle } = useScreenShake();

  useEffect(() => {
    if (trigger) {
      shake(duration, intensity);
      if (onComplete) {
        setTimeout(onComplete, duration);
      }
    }
  }, [trigger, duration, intensity, shake, onComplete]);

  return <div style={shakeStyle}>{children}</div>;
};
