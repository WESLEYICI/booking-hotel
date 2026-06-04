import React from 'react';

const Team = () => {
  const stats = [
    { number: '10+', label: 'Tahun Berdiri' },
    { number: '50+', label: 'Kamar Premium' },
    { number: '5K+', label: 'Tamu Puas' },
    { number: '4.9', label: 'Rating Bintang' },
  ];

  const facilities = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Kamar Mewah',
      desc: 'Setiap kamar dirancang dengan sentuhan elegan dan dilengkapi fasilitas lengkap kelas bintang lima untuk kenyamanan maksimal.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      title: 'Kolam Renang Infinity',
      desc: 'Berenang sambil menikmati pemandangan panorama kota yang memukau. Kolam renang infinity tersedia 24 jam untuk Anda.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Restoran Fine Dining',
      desc: 'Chef berpengalaman kami menyajikan kuliner premium dari masakan lokal dan internasional dengan bahan-bahan pilihan terbaik.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Spa & Wellness Center',
      desc: 'Manjakan diri Anda dengan perawatan spa eksklusif dan pusat kebugaran modern yang dirancang untuk meremajakan jiwa dan raga.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      title: 'Concierge 24/7',
      desc: 'Tim concierge profesional kami selalu siap membantu setiap kebutuhan Anda kapan pun, siang maupun malam tanpa batas.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      title: 'Wi-Fi Berkecepatan Tinggi',
      desc: 'Nikmati koneksi internet super cepat di seluruh area hotel. Tersedia gratis untuk semua tamu tanpa batas kuota.',
    },
  ];

  const gallery = [
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', alt: 'Kamar Suite', span: 'md:col-span-2 md:row-span-2' },
    { src: 'https://images.unsplash.com/photo-1551882547-ff40c4a49ce4?w=600&q=80', alt: 'Kolam Renang', span: '' },
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', alt: 'Restoran', span: '' },
    { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', alt: 'Spa', span: '' },
    { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', alt: 'Lobby', span: '' },
  ];

  return (
    <div className="min-h-screen bg-hotel-cream">

      {/* ===== HERO SECTION ===== */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=90"
          alt="My Hotels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-primary/60 via-hotel-primary/40 to-hotel-primary/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.4em] uppercase mb-4">— Tentang Kami</p>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-6 leading-tight">
            My <span className="text-gradient-gold">Hotels</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
            Tempat peristirahatan mewah di jantung kota — di mana setiap momen menjadi kenangan tak ternilai.
          </p>
        </div>
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-hotel-cream" preserveAspectRatio="none">
            <path d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,56C1120,59,1280,53,1360,50.7L1440,48L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" />
          </svg>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="bg-hotel-primary -mt-1">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-gradient-gold font-playfair text-3xl md:text-4xl font-bold">{s.number}</p>
                <p className="text-white/40 text-xs mt-1 tracking-wider uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20 space-y-24">

        {/* ===== DESKRIPSI HOTEL ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-4">— Cerita Kami</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-hotel-primary font-bold mb-6 leading-tight">
              Pengalaman Menginap yang <br />Tak Terlupakan
            </h2>
            <div className="section-divider !ml-0 mb-8" />
            <p className="text-hotel-charcoal/60 text-base leading-relaxed mb-6">
              My Hotels adalah hotel bintang empat yang berdiri sejak lebih dari satu dekade lalu di lokasi paling strategis di kota. Dengan arsitektur modern yang memadukan keanggunan klasik dan estetika kontemporer, kami hadir sebagai destinasi pilihan untuk perjalanan bisnis maupun liburan keluarga.
            </p>
            <p className="text-hotel-charcoal/60 text-base leading-relaxed mb-8">
              Kami percaya bahwa setiap tamu berhak mendapatkan pengalaman terbaik. Itulah mengapa setiap detail — dari pilihan bahan tekstil kamar hingga sambutan hangat tim kami — dirancang untuk menciptakan kehangatan dan kemewahan yang sesungguhnya.
            </p>
            {/* Quote */}
            <div className="border-l-[3px] border-hotel-accent pl-6 py-2">
              <p className="text-hotel-charcoal/50 italic text-sm leading-relaxed">
                "Kami tidak hanya menyewakan kamar. Kami menciptakan kenangan yang akan selalu Anda rindukan."
              </p>
              <p className="text-hotel-accent text-xs mt-3 tracking-widest font-semibold uppercase">— Tim My Hotels</p>
            </div>
          </div>

          {/* Right: Photo Gallery Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[480px]">
            {gallery.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-xl group ${img.span}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ===== FASILITAS ===== */}
        <div>
          <div className="text-center mb-14">
            <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">— Yang Kami Tawarkan</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-hotel-primary font-bold mb-4">
              Fasilitas Premium Kami
            </h2>
            <div className="section-divider mb-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-7 border border-hotel-accent/5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-12 h-12 rounded-xl bg-hotel-accent/10 text-hotel-accent flex items-center justify-center mb-5 group-hover:bg-hotel-accent/20 transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-playfair text-lg font-semibold text-hotel-primary mb-3">{f.title}</h3>
                <p className="text-hotel-charcoal/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== VISI & MISI ===== */}
        <div className="relative rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80"
            alt="Hotel View"
            className="w-full h-72 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-hotel-primary/90 via-hotel-primary/70 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-lg">
              <p className="text-hotel-accent text-xs tracking-[0.3em] uppercase mb-4">— Visi Kami</p>
              <h2 className="font-playfair text-2xl md:text-3xl text-white font-bold mb-4 leading-tight">
                Menjadi Hotel Paling Dicintai di Setiap Perjalanan
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Kami berkomitmen untuk terus berinovasi dalam memberikan layanan terbaik, memastikan setiap tamu merasa seperti di rumah sendiri — dengan sentuhan kemewahan yang tiada duanya.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Team;
