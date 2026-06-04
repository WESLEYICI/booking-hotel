import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Invoice from './Invoice';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [modalState, setModalState] = useState('closed');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openModal, setOpenModal] = useState(true);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge badge-success',
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
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-hotel-charcoal/40">Menunggu pembayaran</span>
                            <span className="badge badge-warning text-[10px]">Belum Lunas</span>
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
      </div>
    </div>
  );
};

export default MyBookings;
