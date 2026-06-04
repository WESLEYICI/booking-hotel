import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export default function Component() {
  return (
    <footer className="bg-charcoal-gradient text-white">
      {/* Top Decorative Line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-hotel-accent/40 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center text-hotel-primary font-playfair font-bold text-xl">
                M
              </div>
              <span className="font-playfair text-2xl font-semibold text-white">My Hotels</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mt-4">
              Experience unparalleled luxury and comfort. Where every moment becomes a cherished memory.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: BsFacebook, label: 'Facebook' },
                { icon: BsInstagram, label: 'Instagram' },
                { icon: BsTwitter, label: 'Twitter' },
                { icon: BsGithub, label: 'Github' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-hotel-accent hover:text-hotel-primary transition-all duration-300"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-hotel-accent font-semibold text-sm uppercase tracking-wider mb-5">About</h4>
            <ul className="space-y-3">
              {['Contact Us', 'Hotel Amenities', 'Restaurant & Bar'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-hotel-accent text-sm transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Reservations */}
          <div>
            <h4 className="text-hotel-accent font-semibold text-sm uppercase tracking-wider mb-5">Reservations</h4>
            <ul className="space-y-3">
              {[
                { label: 'Reception', value: '1.954.456.6789' },
                { label: 'Booking', value: '1.954.456.6780' },
                { label: 'Support', value: '1.954.456.6781' },
              ].map((item) => (
                <li key={item.label} className="text-white/50 text-sm">
                  <span className="text-white/30">{item.label}:</span>{' '}
                  <span className="hover:text-hotel-accent transition-colors duration-300 cursor-pointer">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-hotel-accent font-semibold text-sm uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-hotel-accent text-sm transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2026 My Hotels. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Crafted with ♥ for the finest hospitality
          </p>
        </div>
      </div>
    </footer>
  );
}
