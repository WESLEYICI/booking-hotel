const About = () => {
  return (
    <section className="relative py-24 md:py-32 bg-charcoal-gradient overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-hotel-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-hotel-secondary/50 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Image */}
        <div className="flex-shrink-0 animate-float">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-hotel-accent/20 to-transparent rounded-2xl blur-xl" />
            <img
              src="https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/home-1.png"
              className="relative w-[320px] md:w-[380px] lg:w-[420px] rounded-2xl"
              alt="Hotel interior"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-lg">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">
            — Discover Our Story
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-[42px] text-white leading-tight mb-6">
            The right choice for those seeking the best place to relax
          </h2>
          <div className="section-divider !ml-0 mb-8" />
          <h3 className="text-hotel-accent font-playfair text-lg font-semibold mb-4">About Us</h3>
          <p className="text-white/60 text-base leading-relaxed">
            The Hotel Spice is the right choice for visitors who are searching for a combination of charm and a convenient position from where to explore surroundings. We offer an unforgettable experience with world-class amenities and personalized service.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '5K+', label: 'Happy Guests' },
              { number: '50+', label: 'Luxury Rooms' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-gradient-gold font-playfair text-2xl md:text-3xl font-bold">{stat.number}</p>
                <p className="text-white/40 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
