import React, { useState, useEffect } from 'react';
import wesley from './wesley.jpg';
import giri from './giri.jpg';
import tiara from './tiara.jpg';
import william from './william.jpg';
import Loading from './Loading';

const Team = () => {
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-charcoal-gradient">
        <Loading />
      </div>
    );
  }

  const teams = [
    {
      nama: 'Wesley Jonathan Thomas',
      npm: '152024095',
      role: 'Project Lead & Full Stack Developer',
      jpg: wesley,
      socials: ['GitHub', 'LinkedIn'],
    },
    {
      nama: 'William Jonathan Bena',
      npm: '152024097',
      role: 'Backend Developer',
      jpg: william,
      socials: ['GitHub', 'LinkedIn'],
    },
    {
      nama: 'Giri Aryono Putro',
      npm: '152024091',
      role: 'Frontend Developer',
      jpg: giri,
      socials: ['GitHub', 'LinkedIn'],
    },
    {
      nama: 'Tiara Destiarani',
      npm: '152024135',
      role: 'UI/UX Designer',
      jpg: tiara,
      socials: ['GitHub', 'LinkedIn'],
    },
  ];

  return (
    <div className="min-h-screen bg-charcoal-gradient relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-hotel-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hotel-secondary/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8 pt-28 pb-20">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.4em] uppercase mb-4">— Meet The Creators</p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-[54px] text-white font-bold mb-5 leading-tight">
            Tim di Balik{' '}
            <span className="text-gradient-gold">My Hotels</span>
          </h1>
          <div className="section-divider mb-6" />
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Empat mahasiswa berbakat yang bersatu membangun pengalaman booking hotel modern dan premium dari nol.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {teams.map((member, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl bg-hotel-secondary border border-white/5 transition-all duration-500 group-hover:border-hotel-accent/30 group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]">

                {/* Photo */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.jpg}
                    alt={member.nama}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay — always visible at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-hotel-primary via-hotel-primary/20 to-transparent" />

                  {/* Hover Overlay with accent */}
                  <div className="absolute inset-0 bg-hotel-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* NPM Badge */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full">
                    <span className="text-white/60 text-xs tracking-wider font-mono">{member.npm}</span>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-hotel-accent/20 border border-hotel-accent/40 flex items-center justify-center">
                    <span className="text-hotel-accent text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-5">
                  <h3 className="font-playfair text-lg font-semibold text-white mb-1 group-hover:text-hotel-accent transition-colors duration-300 leading-tight">
                    {member.nama}
                  </h3>
                  <p className="text-hotel-accent/70 text-xs tracking-wide mb-4">{member.role}</p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-hotel-accent/30 via-hotel-accent/10 to-transparent mb-4 transition-all duration-300 group-hover:via-hotel-accent/30" />

                  {/* Social Links — shown on hover */}
                  <div className="flex items-center gap-2 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    {/* GitHub Icon */}
                    <a
                      href="#"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-hotel-accent/20 border border-white/10 hover:border-hotel-accent/40 flex items-center justify-center transition-all duration-300"
                      title="GitHub"
                    >
                      <svg className="w-4 h-4 text-white/60 hover:text-hotel-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    {/* LinkedIn Icon */}
                    <a
                      href="#"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-hotel-accent/20 border border-white/10 hover:border-hotel-accent/40 flex items-center justify-center transition-all duration-300"
                      title="LinkedIn"
                    >
                      <svg className="w-4 h-4 text-white/60 hover:text-hotel-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <span className="text-white/20 text-xs ml-auto">Hover for more</span>
                  </div>
                </div>
              </div>

              {/* Glow effect on active */}
              {activeIndex === index && (
                <div className="absolute -inset-1 bg-gradient-to-br from-hotel-accent/20 to-transparent rounded-2xl blur-xl -z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Attribution */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {[wesley, william, giri, tiara].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-hotel-primary object-cover object-top"
                />
              ))}
            </div>
            <span className="text-white/50 text-sm">Dikembangkan oleh 4 mahasiswa sebagai proyek akhir</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Team;
