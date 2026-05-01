import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Quotes from './components/Quotes';
import Videos from './components/Videos';
import Footer from './components/Footer';
import FloatingBubbles from './components/FloatingBubbles';

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-quicksand sparkle-cursor">
      <FloatingBubbles />
      <Navbar />
      <Hero />
      <Gallery />
      <Quotes />
      <Videos />
      <Footer />
    </div>
  );
}
