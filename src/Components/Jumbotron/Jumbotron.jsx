import { Link } from 'react-router-dom';
import './jumbotron.css';

const Jumbotron = () => {
  return (
    <div>
      <section className="relative h-screen bg-center bg-no-repeat bg-cover bg-[url('https://wallpaperaccess.com/full/2690784.jpg')] overflow-hidden">
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/80 via-hotel-primary/60 to-hotel-dark/90" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-hotel-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-hotel-accent/3 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          {/* Decorative line */}
          <div className="w-12 h-[1px] bg-hotel-accent mb-6 opacity-0 animate-fade-in" />

          <p className="text-hotel-accent font-inter text-sm md:text-base tracking-[0.35em] uppercase mb-4 opacity-0 animate-fade-in-up delay-100">
            Welcome To
          </p>

          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 opacity-0 animate-fade-in-up delay-200">
            My Hotels
          </h1>

          <p className="font-inter text-white/60 text-sm md:text-base max-w-md mb-10 opacity-0 animate-fade-in-up delay-300">
            Experience luxury beyond imagination. Your perfect stay awaits.
          </p>

          {/* Decorative line */}
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-hotel-accent to-transparent mb-10 opacity-0 animate-fade-in delay-400" />

          <button
            type="button"
            onClick={() => {
              const element = document.getElementById('rooms');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-gold shimmer-btn px-10 py-3.5 rounded-full text-sm md:text-base font-semibold tracking-wider uppercase opacity-0 animate-fade-in-up delay-500"
          >
            Book Now
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in delay-600">
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-hotel-accent/60 to-transparent scroll-line" />
        </div>
      </section>
    </div>
  );
};

export default Jumbotron;
