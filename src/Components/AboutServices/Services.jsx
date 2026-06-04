import './Services.css';

const Services = () => {
  const services = [
    {
      icon: '🏖️',
      title: 'Beach Access',
      desc: 'Private beach with premium loungers and umbrella service.',
    },
    {
      icon: '🍽️',
      title: 'Fine Dining',
      desc: 'World-class restaurants with international and local cuisine.',
    },
    {
      icon: '💆',
      title: 'Spa & Wellness',
      desc: 'Rejuvenating treatments and therapies for ultimate relaxation.',
    },
    {
      icon: '🏊',
      title: 'Infinity Pool',
      desc: 'Stunning rooftop pool with panoramic views of the ocean.',
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-hotel-cream overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-hotel-accent/20 to-transparent" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">
            — What We Offer
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-[42px] text-hotel-primary font-bold mb-4">
            Our Services
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-hotel-charcoal/60 max-w-2xl mx-auto text-base">
            The rooms are arranged on the first, second and third floors. On the top floor, there is also a charming terrace available for guests.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-500 border border-hotel-accent/5"
            >
              <div className="w-14 h-14 rounded-xl bg-hotel-accent/10 flex items-center justify-center text-2xl mb-5 group-hover:bg-hotel-accent/20 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="font-playfair text-lg font-semibold text-hotel-primary mb-3">
                {service.title}
              </h3>
              <p className="text-hotel-charcoal/60 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Image Feature */}
        <div className="mt-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-lg">
            <h3 className="font-playfair text-2xl md:text-3xl text-hotel-primary font-bold mb-4">
              Unparalleled Views From Every Floor
            </h3>
            <p className="text-hotel-charcoal/60 text-base leading-relaxed mb-6">
              The rooms are arranged on the first, second and third floors. On the top floor, there is also a charming terrace or solarium available for the use of guests, from where you can enjoy the breathtaking view.
            </p>
            <button className="services-learn-more-btn group flex items-center gap-3 text-hotel-primary font-semibold text-sm hover:text-hotel-accent transition-colors duration-300">
              <span className="w-10 h-10 rounded-full border-2 border-hotel-accent/30 flex items-center justify-center group-hover:bg-hotel-accent group-hover:border-hotel-accent transition-all duration-300">
                <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              Learn More
            </button>
          </div>
          <div className="flex-shrink-0">
            <div className="img-zoom rounded-2xl overflow-hidden shadow-premium">
              <img
                src="https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/home-2.png"
                className="w-[350px] md:w-[420px] lg:w-[480px]"
                alt="Hotel terrace view"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
