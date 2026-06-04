import React, { useState, useEffect } from 'react';
import wesley from './wesley.jpg';
import giri from './giri.jpg';
import tiara from './tiara.jpg';
import william from './william.jpg';
import Loading from './Loading';

const Team = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-hotel-cream pt-20">
        <Loading />
      </div>
    );
  }

  const teams = [
    { nama: 'Wesley Jonathan Thomas', npm: '152024095', jpg: wesley },
    { nama: 'William Jonathan Bena', npm: '152024097', jpg: william },
    { nama: 'Giri Aryono Putro', npm: '152024091', jpg: giri },
    { nama: 'Tiara Destiarani', npm: '152024135', jpg: tiara },
  ];

  return (
    <div className="min-h-screen bg-hotel-cream pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">— Meet The Team</p>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-[42px] text-hotel-primary font-bold mb-4">
            Our Team
          </h1>
          <div className="section-divider mb-6" />
          <p className="text-hotel-charcoal/60 max-w-2xl mx-auto text-base">
            The talented people behind My Hotels who make your stay unforgettable.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teams.map((team, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-hotel-accent/5"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-72">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={team.jpg}
                  alt={team.nama}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-hotel-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="font-playfair text-base font-semibold text-hotel-primary mb-1 group-hover:text-hotel-accent transition-colors duration-300">
                  {team.nama}
                </h3>
                <p className="text-hotel-charcoal/40 text-xs tracking-wider">{team.npm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
