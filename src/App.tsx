import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Career } from './sections/Career';
import { Home } from './sections/Home';
import { Notes } from './sections/Notes';
import { Projects } from './sections/Projects';
import { Resume } from './sections/Resume';

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32rem),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#020617_100%)]">
      <Header />
      <main>
        <Home />
        <Career />
        <Projects />
        <Notes />
        <Resume />
      </main>
      <Footer />
    </div>
  );
}
