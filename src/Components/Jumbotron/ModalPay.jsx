import React from 'react';

const ModalPay = ({ modalState, setModalState }) => {
  if (modalState !== 'opening') return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-hotel-dark/70 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-premium animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-playfair text-lg font-semibold text-hotel-primary">Payment Guide</h3>
          <button
            onClick={() => setModalState('closing')}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="font-semibold text-hotel-primary text-sm mb-2">Cara Membayar</h4>
            <p className="text-hotel-charcoal/50 text-sm leading-relaxed">
              Pembayaran dilakukan melalui payment gateway Midtrans secara otomatis saat melakukan booking.
            </p>
          </div>

          <div className="space-y-3">
            {[
              'Transfer jumlah total ke rekening/akun yang tersedia.',
              'Konfirmasi pembayaran saat checkout.',
              'Booking akan berstatus pending sampai pembayaran diverifikasi.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-hotel-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-hotel-accent text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-hotel-charcoal/60 text-sm">{step}</p>
              </div>
            ))}
          </div>

          <div className="bg-hotel-cream rounded-xl p-4 space-y-2">
            <p className="text-hotel-accent text-xs font-semibold uppercase tracking-wider">Bank Tujuan</p>
            <div className="space-y-1.5">
              <p className="text-hotel-primary text-sm">
                <span className="font-semibold">BCA:</span> 1234567890 a.n. Hotel Demo
              </p>
              <p className="text-hotel-primary text-sm">
                <span className="font-semibold">GoPay:</span> 081234567890 a.n. Hotel Demo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPay;
