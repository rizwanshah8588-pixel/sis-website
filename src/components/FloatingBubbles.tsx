import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generated: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 40 + 10,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setBubbles(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}
