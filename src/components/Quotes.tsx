import { useState, useEffect } from 'react';
import { Heart, RefreshCw, Quote } from 'lucide-react';

const quotes = [
  {
    text: "She believed she could, so she did.",
    author: "R.S. Grey",
    emoji: "crown",
  },
  {
    text: "Be a girl with a mind, a woman with attitude, and a lady with class.",
    author: "Unknown",
    emoji: "sparkles",
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    emoji: "star",
  },
  {
    text: "Girls compete with each other. Women empower one another.",
    author: "Unknown",
    emoji: "heart",
  },
  {
    text: "She was beautiful, but not like those girls in the magazines. She was beautiful for the way she thought.",
    author: "Unknown",
    emoji: "flower",
  },
  {
    text: "The most courageous act is still to think for yourself. Aloud.",
    author: "Coco Chanel",
    emoji: "star",
  },
  {
    text: "I am not what happened to me, I am what I choose to become.",
    author: "Carl Jung",
    emoji: "sparkles",
  },
  {
    text: "You alone are enough. You have nothing to prove to anybody.",
    author: "Maya Angelou",
    emoji: "heart",
  },
  {
    text: "Life is tough, my darling, but so are you.",
    author: "Stephanie Bennett-Henry",
    emoji: "crown",
  },
  {
    text: "She remembered who she was and the game changed.",
    author: "Lalah Delia",
    emoji: "sparkles",
  },
  {
    text: "A girl should be two things: who and what she wants.",
    author: "Coco Chanel",
    emoji: "crown",
  },
  {
    text: "You can't break a girl who is already broken, but you can watch her rebuild herself.",
    author: "Unknown",
    emoji: "star",
  },
];

const bgColors = [
  'from-pink-400 to-rose-400',
  'from-rose-400 to-pink-500',
  'from-pink-300 to-fuchsia-400',
  'from-fuchsia-400 to-pink-400',
  'from-pink-500 to-rose-500',
  'from-rose-300 to-pink-400',
];

export default function Quotes() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      nextQuote();
    }, 8000);
    return () => clearInterval(interval);
  }, [current]);

  const nextQuote = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
      setAnimating(false);
    }, 300);
  };

  const toggleLike = (idx: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const quote = quotes[current];

  return (
    <section
      id="quotes"
      className="relative py-24 px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50"
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-rose-200/30 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-dancing text-pink-400 text-xl mb-2">
            words to live by
          </p>
          <h2 className="font-pacifico text-4xl sm:text-5xl text-gradient-barbie mb-4">
            Daily Quotes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-rose-300 mx-auto rounded-full" />
        </div>

        {/* Main quote card */}
        <div className="relative mb-16">
          <div
            className={`relative bg-gradient-to-br ${bgColors[current]} rounded-3xl p-8 sm:p-12 shadow-2xl shadow-pink-200/50 transition-all duration-300 ${
              animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <Quote className="absolute top-6 left-6 w-12 h-12 text-white/20" />
            <Quote className="absolute bottom-6 right-6 w-12 h-12 text-white/20 rotate-180" />

            <div className="relative z-10 text-center">
              <p className="font-dancing text-2xl sm:text-4xl text-white leading-relaxed mb-6">
                "{quote.text}"
              </p>
              <p className="font-quicksand text-white/80 text-lg font-medium">
                -- {quote.author}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => toggleLike(current)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked.has(current) ? 'fill-white' : ''
                  }`}
                />
                <span className="font-quicksand text-sm font-medium">
                  {liked.has(current) ? 'Loved' : 'Love this'}
                </span>
              </button>
              <button
                onClick={nextQuote}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-quicksand text-sm font-medium">Next</span>
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setAnimating(true);
                  setTimeout(() => {
                    setCurrent(i);
                    setAnimating(false);
                  }, 300);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-pink-500 w-6'
                    : 'bg-pink-200 hover:bg-pink-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quote cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.slice(0, 6).map((q, i) => (
            <div
              key={i}
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-pink-100/30 border border-pink-100 card-hover"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleLike(i)}
                  className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      liked.has(i)
                        ? 'text-pink-500 fill-pink-500'
                        : 'text-pink-300'
                    }`}
                  />
                </button>
              </div>
              <p className="font-dancing text-lg text-pink-700 mb-3 leading-relaxed">
                "{q.text}"
              </p>
              <p className="font-quicksand text-pink-400 text-sm font-medium">
                -- {q.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
