import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generated: Sparkle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1.5,
    }));
    setSparkles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-pink-300"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
