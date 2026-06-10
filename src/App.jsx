import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Process from './sections/Process';
import Cases from './sections/Cases';
import About from './sections/About';
import Stack from './sections/Stack';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <Process />
        <Cases />
        <About />
        <Stack />
      </main>
      <Footer />
    </>
  );
}

export default App;
