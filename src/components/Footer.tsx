import { Heart, Sparkles, Instagram, Music2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-rose-200/20 rounded-full blur-2xl" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="mb-8">
          <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-4 animate-bounce-gentle" />
          <h3 className="font-pacifico text-3xl sm:text-4xl text-gradient-barbie mb-3">
            Made with Love
          </h3>
          <p className="font-dancing text-xl text-pink-400">
            for the most amazing sister in the world
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[
            { icon: Instagram, label: 'Instagram' },
            { icon: Music2, label: 'TikTok' },
            { icon: Heart, label: 'Love' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-pink-200 shadow-md shadow-pink-100/30 hover:bg-pink-100/70 hover:shadow-lg hover:shadow-pink-200/40 transition-all duration-300 hover:-translate-y-1"
            >
              <Icon className="w-5 h-5 text-pink-400 group-hover:text-pink-500 transition-colors" />
              <span className="font-quicksand font-semibold text-pink-500 text-sm">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-px bg-pink-200" />
          <Heart className="w-4 h-4 text-pink-300 fill-pink-300 animate-heart-beat" />
          <div className="w-16 h-px bg-pink-200" />
        </div>

        <p className="font-quicksand text-pink-400 text-sm">
          Stay pretty, stay happy, stay you
        </p>
        <p className="font-quicksand text-pink-300 text-xs mt-2">
          Made with all the love in the world
        </p>
      </div>
    </footer>
  );
}
