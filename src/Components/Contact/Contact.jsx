import React from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-screen bg-hotel-cream pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">— Get In Touch</p>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-[42px] text-hotel-primary font-bold mb-4">
            Contact Us
          </h1>
          <div className="section-divider mb-6" />
          <p className="text-hotel-charcoal/60 max-w-2xl mx-auto text-base">
            We'd love to hear from you. Whether you have a question about rooms, amenities, or anything else, our team is ready to answer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="space-y-6">
            {[
              {
                icon: FiPhone,
                title: 'Phone',
                detail: '+62 812 3456 7890',
                sub: 'Mon-Sun, 24/7',
              },
              {
                icon: FiMail,
                title: 'Email',
                detail: 'info@myhotels.com',
                sub: 'We reply within 24h',
              },
              {
                icon: FiMapPin,
                title: 'Address',
                detail: 'Jl. Hotel Indah No. 123',
                sub: 'Bali, Indonesia',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-6 shadow-card border border-hotel-accent/5 hover-lift flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-hotel-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="text-xl text-hotel-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-hotel-primary mb-1">{item.title}</h3>
                    <p className="text-hotel-primary text-sm font-medium">{item.detail}</p>
                    <p className="text-hotel-charcoal/40 text-xs mt-1">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-card border border-hotel-accent/5">
            <h3 className="font-playfair text-xl font-semibold text-hotel-primary mb-6">Send Us a Message</h3>
            <div className="section-divider !ml-0 !w-12 mb-8" />

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-premium w-full text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-premium w-full text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  className="input-premium w-full text-sm"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows="5"
                  className="input-premium w-full text-sm resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="button"
                className="btn-gold shimmer-btn px-8 py-3 rounded-xl text-sm font-semibold tracking-wider uppercase"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
