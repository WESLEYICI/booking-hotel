import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = ({ phoneNumber = '6281234567890' }) => {
  const message = encodeURIComponent('Halo Admin Hotel, saya ingin bertanya tentang pemesanan kamar.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] group flex items-center justify-center animate-bounce-slow"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="absolute right-full mr-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-medium text-hotel-charcoal whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Butuh Bantuan?
        {/* Triangle arrow */}
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white"></div>
      </div>
      <div className="w-14 h-14 bg-green-500 rounded-full shadow-premium flex items-center justify-center text-white hover:bg-green-600 hover:scale-110 transition-all duration-300">
        <FaWhatsapp className="text-3xl" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
