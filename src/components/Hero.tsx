import { useEffect, useRef } from 'react';

interface HeroProps {
  onJoinClick?: () => void;
}

export function Hero({ onJoinClick }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 700;
    canvas.height = 220;

    const bars = 60;
    const barWidth = canvas.width / bars;
    let animationId: number;

    // Add unique randomness to each bar for a more organic feel
    const randomOffsets = Array.from({ length: bars }, () => Math.random() * 10);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.005;

      for (let i = 0; i < bars; i++) {
        const height =
          Math.abs(Math.sin(time + i * 0.2 + randomOffsets[i])) * 100 +
          Math.random() * 60;

        const x = i * barWidth;
        const y = canvas.height - height;

        // Neon gradient
        const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
        gradient.addColorStop(0, "#ff00ff");
        gradient.addColorStop(0.5, "#a855f7");
        gradient.addColorStop(1, "#3b0764");

        ctx.fillStyle = gradient;
        ctx.shadowColor = "#e879f9";
        ctx.shadowBlur = 8;

        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black pt-16">

      {/* Dark noise + streak overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>

      {/* Soft concert lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-10 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-purple-900/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-6xl sm:text-7xl font-bold text-white mb-4 tracking-tight">
          Discover Music Events
        </h2>

        <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Find live performances, concerts, and festivals happening near you.
        </p>

        <div className="mb-12 flex justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ maxHeight: "220px" }}
          />
        </div>

        <button onClick={onJoinClick} className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-xl">
          Join the movement
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
