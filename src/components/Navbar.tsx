import { useState, useEffect } from 'react';
import { Heart, Camera, MessageCircle, Video, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Heart },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'quotes', label: 'Quotes', icon: MessageCircle },
  { id: 'videos', label: 'Videos', icon: Video },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActive(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-pink-100/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 group"
          >
            <Sparkles className="w-6 h-6 text-pink-500 group-hover:animate-spin" />
            <span className="font-pacifico text-xl text-gradient-barbie">
              My World
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-quicksand font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-pink-700 bg-pink-100'
                      : 'text-pink-400 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-pink-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="sm:hidden flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`p-2 rounded-full transition-all ${
                    isActive
                      ? 'text-pink-600 bg-pink-100'
                      : 'text-pink-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
