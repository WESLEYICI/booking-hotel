const About = () => {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Kamar Mewah',
      desc: 'Setiap kamar dirancang dengan sentuhan elegan dan dilengkapi fasilitas bintang lima.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Restoran & Bar',
      desc: 'Nikmati kuliner premium dari chef berpengalaman dengan cita rasa lokal dan internasional.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Spa & Wellness',
      desc: 'Pusat kebugaran dan spa eksklusif untuk memanjakan tubuh dan pikiran Anda.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      title: 'Kolam Renang Infinity',
      desc: 'Kolam renang dengan pemandangan panorama yang memukau, tersedia 24 jam sehari.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      title: 'Wi-Fi Ultra Cepat',
      desc: 'Koneksi internet berkecepatan tinggi tersedia di seluruh area hotel tanpa biaya tambahan.',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Concierge 24/7',
      desc: 'Tim concierge kami siap melayani setiap kebutuhan Anda kapan saja, siang maupun malam.',
    },
  ];

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
      alt: 'Hotel Room',
      className: 'col-span-2 row-span-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1551882547-ff40c4a49ce4?w=400&q=80',
      alt: 'Hotel Pool',
      className: 'col-span-1',
    },
    {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      alt: 'Hotel Restaurant',
      className: 'col-span-1',
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 bg-charcoal-gradient overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-hotel-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-hotel-secondary/50 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">— Tentang Hotel Kami</p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-[46px] text-white leading-tight mb-6">
            My Hotels — Tempat Peristirahatan <br className="hidden md:block" />
            <span className="text-gradient-gold">Terbaik di Kota Ini</span>
          </h2>
          <div className="section-divider mb-0" />
        </div>

        {/* Main Two-Column */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20 mb-20">

          {/* Left: Photo Gallery Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-3 grid-rows-2 gap-3 h-[420px] flex-shrink-0">
            {galleryImages.map((img) => (
              <div key={img.alt} className={`${img.className} overflow-hidden rounded-2xl relative group`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hotel-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Right: Description */}
          <div className="w-full lg:w-1/2">
            <h3 className="font-playfair text-2xl text-hotel-accent font-semibold mb-5">
              Selamat Datang di My Hotels
            </h3>
            <p className="text-white/70 text-base leading-relaxed mb-5">
              My Hotels adalah hotel bintang empat yang berlokasi strategis di jantung kota, menawarkan pengalaman menginap yang tak terlupakan bagi setiap tamu. Dibangun dengan arsitektur modern yang memadukan sentuhan klasik dan kontemporer, hotel kami hadir sebagai destinasi pilihan untuk perjalanan bisnis maupun liburan keluarga.
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Dengan lebih dari <span className="text-hotel-accent font-semibold">50 kamar mewah</span>, restoran bintang lima, fasilitas spa kelas dunia, dan kolam renang infinity yang memukau, kami berkomitmen untuk memberikan layanan terbaik yang melampaui ekspektasi setiap tamu. Tim kami yang berpengalaman siap memastikan setiap momen Anda bersama kami menjadi kenangan tak ternilai.
            </p>

            {/* Quote Block */}
            <div className="border-l-2 border-hotel-accent pl-5 mb-8">
              <p className="text-white/60 italic text-sm leading-relaxed">
                "Kami percaya bahwa setiap tamu berhak mendapatkan pengalaman menginap yang sempurna — penuh kehangatan, kenyamanan, dan keanggunan yang sesungguhnya."
              </p>
              <p className="text-hotel-accent text-xs mt-2 tracking-wider">— Tim My Hotels</p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { number: '10+', label: 'Tahun Berdiri' },
                { number: '5K+', label: 'Tamu Puas' },
                { number: '50+', label: 'Kamar Mewah' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-gradient-gold font-playfair text-2xl md:text-3xl font-bold">{stat.number}</p>
                  <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fasilitas Grid */}
        <div>
          <h3 className="font-playfair text-2xl text-white font-semibold text-center mb-10">
            Fasilitas & Keunggulan Kami
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group glass-card rounded-2xl p-6 hover:border-hotel-accent/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-hotel-accent/10 flex items-center justify-center mb-4 text-hotel-accent group-hover:bg-hotel-accent/20 transition-colors duration-300">
                  {f.icon}
                </div>
                <h4 className="text-white font-semibold text-base mb-2">{f.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
