import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Invoice from './Invoice';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [modalState, setModalState] = useState('closed');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openModal, setOpenModal] = useState(true);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [cancelPayModal, setCancelPayModal] = useState(false);
  const [activeSnapToken, setActiveSnapToken] = useState(null);
  
  // Review state
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };
    if (modalState === 'closing') {
      setTimeout(() => {
        setModalState('closed');
      }, 300);
      document.body.style.overflow = 'auto';
    } else if (modalState === 'opening') {
      document.body.style.overflow = 'hidden';
    }
    fetchBookings();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalState]);

  useEffect(() => {
    if (window.snap) {
      setSnapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'Mid-client-5lxiwuurfKXyAflc');
    script.async = true;
    script.onload = () => setSnapLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const openSnap = (snapToken) => {
    setActiveSnapToken(snapToken);
    window.snap.pay(snapToken, {
      onSuccess: function () {
        setCancelPayModal(false);
        window.location.reload();
      },
      onPending: function () {
        setCancelPayModal(false);
        window.location.reload();
      },
      onError: function (result) {
        setCancelPayModal(true);
        console.error('Payment error:', result);
      },
      onClose: function () {
        setCancelPayModal(true);
      }
    });
  };

  const [retryPaymentMethod, setRetryPaymentMethod] = useState('all');
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);

  const handlePayNow = (snapToken, bookingId) => {
    if (!snapLoaded || !window.snap) return;
    setActiveBookingId(bookingId);
    openSnap(snapToken);
  };

  // Ambil token baru dari backend dengan metode pembayaran yang dipilih
  const refreshAndRetry = async () => {
    if (!activeBookingId) return;
    setCancelPayModal(false);
    setRetryLoading(true);
    try {
      const res = await api.post(`/bookings/${activeBookingId}/refresh-token`, {
        payment_type: retryPaymentMethod,
      });
      const newToken = res.data.snap_token;
      setRetryLoading(false);
      if (!newToken || !window.snap) return;
      setActiveSnapToken(newToken);
      window.snap.pay(newToken, {
        onSuccess: () => { setCancelPayModal(false); window.location.reload(); },
        onPending: () => { setCancelPayModal(false); window.location.reload(); },
        onError: () => { setCancelPayModal(true); },
        onClose: () => { setCancelPayModal(true); },
      });
    } catch (err) {
      setRetryLoading(false);
      console.error('Refresh token error:', err);
      setCancelPayModal(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReviewBooking) return;
    setReviewSubmitting(true);
    try {
      await api.post('/reviews', {
        booking_id: selectedReviewBooking.id,
        room_id: selectedReviewBooking.room_id,
        rating: reviewRating,
        comment: reviewComment
      });
      alert('Terima kasih atas ulasan Anda!');
      setReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      // Optional: Fetch bookings again to show if it's already reviewed, but we rely on ER_DUP_ENTRY for now
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim ulasan');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge badge-success',
      completed: 'badge bg-blue-100 text-blue-700',
      cancelled: 'badge badge-danger',
      pending: 'badge badge-warning',
    };
    return styles[status] || 'badge badge-warning';
  };

  return (
    <div className="min-h-screen bg-hotel-cream pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">— Your Reservations</p>
          <h1 className="font-playfair text-3xl md:text-4xl text-hotel-primary font-bold mb-4">My Bookings</h1>
          <div className="section-divider" />
        </div>

        {/* Table */}
        <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Booking ID</th>
                  <th className="text-left">Room</th>
                  <th className="text-left">Check-in</th>
                  <th className="text-left">Check-out</th>
                  <th className="text-left">Total</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-hotel-accent/10 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-hotel-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-hotel-charcoal/40 text-sm">Belum ada booking.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((book) => (
                    <tr key={book.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                      <td className="font-medium text-hotel-primary">#{book.id}</td>
                      <td className="text-hotel-charcoal/70">{book.name}</td>
                      <td className="text-hotel-charcoal/70">{new Date(book.check_in).toLocaleDateString()}</td>
                      <td className="text-hotel-charcoal/70">{new Date(book.check_out).toLocaleDateString()}</td>
                      <td className="text-hotel-primary font-medium">Rp {formatPrice(book.harga)}</td>
                      <td>
                        <span className={getStatusBadge(book.status)}>{book.status}</span>
                      </td>
                      <td>
                        {book.status === 'pending' ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-hotel-charcoal/40">Menunggu pembayaran</span>
                              <span className="badge badge-warning text-[10px]">Belum Lunas</span>
                            </div>
                            {book.snap_token && (
                              <button
                                onClick={() => handlePayNow(book.snap_token, book.id)}
                                className="btn-gold px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        ) : book.status === 'confirmed' ? (
                          <button
                            onClick={() => {
                              setModalState('opening');
                              setSelectedBooking(book);
                            }}
                            className="btn-gold px-4 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Invoice
                          </button>
                        ) : book.status === 'completed' || book.status === 'checked-out' ? (
                          <button
                            onClick={() => {
                              setSelectedReviewBooking(book);
                              setReviewModal(true);
                            }}
                            className="btn-gold px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700"
                          >
                            ⭐ Beri Ulasan
                          </button>
                        ) : (
                          <span className="text-xs text-hotel-charcoal/40">Dibatalkan</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Modal */}
        {modalState === 'opening' && (
          <div className="fixed inset-0 flex items-center justify-center bg-hotel-dark/70 backdrop-blur-sm z-50">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-premium animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-playfair text-lg font-semibold text-hotel-primary">Invoice</h3>
                <button
                  onClick={() => setModalState('closing')}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <Invoice booking={selectedBooking} />
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        <Modal show={reviewModal} onClose={() => setReviewModal(false)} size="md">
          <ModalHeader className="bg-white rounded-t-xl border-b border-gray-100">
            <span className="text-hotel-primary font-playfair font-semibold">Berikan Ulasan</span>
          </ModalHeader>
          <ModalBody className="bg-white">
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <p className="text-sm text-hotel-charcoal/70">Bagaimana pengalaman menginap Anda di <strong className="text-hotel-primary">{selectedReviewBooking?.name}</strong>?</p>
              
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-transform ${star <= reviewRating ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">Komentar & Saran</label>
                <textarea
                  required
                  rows="4"
                  className="w-full bg-hotel-cream border-none text-hotel-charcoal text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-hotel-accent/30 focus:outline-none resize-none"
                  placeholder="Ceritakan pengalaman Anda..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full btn-gold py-3 rounded-xl text-sm font-semibold tracking-wider uppercase disabled:opacity-60 transition-all"
              >
                {reviewSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </ModalBody>
        </Modal>

        {/* Alert Modal */}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <ModalHeader className="bg-white rounded-t-xl">
            <span className="text-hotel-primary font-playfair font-semibold">Important Notice</span>
          </ModalHeader>
          <ModalBody className="bg-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-hotel-accent/10 flex items-center justify-center flex-shrink-0">
                <HiOutlineInformationCircle className="w-5 h-5 text-hotel-accent" />
              </div>
              <p className="text-hotel-charcoal/70 text-sm leading-relaxed">
                Sebelum melakukan pembayaran, klik <strong className="text-hotel-primary">"How to Pay"</strong> di Navbar untuk melihat panduan pembayaran.
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="bg-white rounded-b-xl">
            <button
              onClick={() => setOpenModal(false)}
              className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Understood
            </button>
          </ModalFooter>
        </Modal>

        {/* Modal: Pembayaran Dibatalkan (dari Pay Now) */}
        {cancelPayModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-hotel-dark/70 backdrop-blur-sm z-[9999]">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-premium overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-playfair text-base font-semibold text-hotel-primary">Pembayaran Dibatalkan</h3>
                  <p className="text-xs text-hotel-charcoal/40 mt-0.5">Booking masih tersimpan dengan status Pending</p>
                </div>
              </div>
              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-hotel-charcoal/70 leading-relaxed">
                  Anda menutup halaman pembayaran. Ganti metode jika perlu, lalu coba bayar lagi.
                </p>
                {/* Dropdown ganti metode */}
                <div className="bg-hotel-cream rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-hotel-primary uppercase tracking-wider">Ganti Metode Pembayaran</p>
                  <select
                    value={retryPaymentMethod}
                    onChange={(e) => setRetryPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-hotel-charcoal text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-hotel-accent/30 focus:border-hotel-accent outline-none"
                  >
                    <option value="all">Tampilkan Semua (Midtrans)</option>
                    <option value="bank_transfer">Virtual Account (BCA, BNI, Mandiri, dll)</option>
                    <option value="gopay">GoPay</option>
                    <option value="qris">QRIS</option>
                    <option value="shopeepay">ShopeePay</option>
                    <option value="credit_card">Kartu Kredit / Debit</option>
                  </select>
                </div>
              </div>
              {/* Footer */}
              <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={refreshAndRetry}
                  disabled={retryLoading}
                  className="flex-1 btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold text-center disabled:opacity-60"
                >
                  {retryLoading ? '⏳ Memuat...' : '🔄 Coba Bayar Lagi'}
                </button>
                <button
                  onClick={() => setCancelPayModal(false)}
                  className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-hotel-charcoal/70 text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Bayar Nanti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
