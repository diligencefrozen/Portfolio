import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Career } from './sections/Career';
import { Home } from './sections/Home';
import { Notes } from './sections/Notes';
import { Projects } from './sections/Projects';
import { Resume } from './sections/Resume';

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_32rem),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_45%,_#eef6ff_100%)] text-slate-900">
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
