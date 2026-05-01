import { Heart, Star, Sparkles } from 'lucide-react';
import SparkleEffect from './Sparkles';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100"
    >
      <SparkleEffect />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl animate-float-delay" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-300/20 rounded-full blur-2xl animate-float-slow" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Floating icons */}
        <div className="absolute -top-8 left-1/4 animate-float">
          <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
        </div>
        <div className="absolute -top-4 right-1/4 animate-float-delay">
          <Star className="w-6 h-6 text-pink-300 fill-pink-300" />
        </div>
        <div className="absolute top-1/3 -left-8 animate-bounce-gentle">
          <Sparkles className="w-7 h-7 text-rose-300" />
        </div>
        <div className="absolute top-1/3 -right-8 animate-bounce-gentle">
          <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
        </div>

        {/* Main content */}
        <div className="animate-fade-in-down">
          <p className="font-dancing text-xl sm:text-2xl text-pink-400 mb-2">
            welcome to
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-pacifico text-5xl sm:text-7xl md:text-8xl text-gradient-barbie mb-6 leading-tight">
            Welcome to Ameera's
            <br />
            <span className="font-sacramento text-6xl sm:text-8xl md:text-9xl">
              World
            </span>
          </h1>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="font-quicksand text-lg sm:text-xl text-pink-500 max-w-2xl mx-auto mb-8 font-medium">
            A little corner of the internet filled with love, laughter, and all
            the pretty things that make life magical
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Photos', 'Quotes', ].map((tag, i) => (
              <span
                key={tag}
                className="px-5 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-pink-200 text-pink-600 font-quicksand font-semibold text-sm shadow-lg shadow-pink-100/50 hover:bg-pink-100/60 hover:scale-105 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${0.8 + i * 0.1}s` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 rounded-full border-2 border-pink-300 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-pink-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
