import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdLockOutline } from 'react-icons/md';

const DataBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, paymentRes] = await Promise.all([
          api.get('/bookings/all'),
          api.get('/bookings/all-payments'),
        ]);
        setBookings(bookingRes.data.data);
        setPayments(paymentRes.data);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cek apakah booking sudah dibayar (settlement/capture)
  const hasPaid = (bookingId) => {
    return payments.some(
      (p) =>
        p.booking_id === bookingId &&
        (p.transaction_status === 'settlement' || p.transaction_status === 'capture')
    );
  };

  // Ambil status pembayaran terbaru untuk booking tertentu
  const getPaymentStatus = (bookingId) => {
    const pay = payments
      .filter((p) => p.booking_id === bookingId)
      .sort((a, b) => new Date(b.transaction_time) - new Date(a.transaction_time))[0];
    return pay ? pay.transaction_status : null;
  };

  const Toggler = () => setOpen(!open);

  const handleStatusChange = async (id, newStatus) => {
    // Guard di frontend: blokir jika coba confirm tapi belum bayar
    if (newStatus === 'confirmed' && !hasPaid(id)) {
      setMsg('');
      setError('Tidak dapat mengkonfirmasi. User belum melakukan pembayaran!');
      setOpen(true);
      return;
    }

    try {
      const response = await api.patch(`/bookings/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking)));
        setError('');
        setMsg('Status berhasil diupdate!');
      } else {
        setMsg('');
        setError(`Gagal: ${response.data.message}`);
      }
      Toggler();
    } catch (err) {
      setMsg('');
      setError(err.response?.data?.message || err.message);
      Toggler();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus booking ini?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking.id !== id));
      setError('');
      setMsg('Booking berhasil dihapus');
      Toggler();
    } catch (err) {
      setMsg('');
      setError(`Gagal menghapus: ${err.response?.data?.message || err.message}`);
      Toggler();
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge badge-success',
      cancelled: 'badge badge-danger',
      pending: 'badge badge-warning',
    };
    return styles[status] || 'badge badge-warning';
  };

  const getPaymentBadge = (bookingId) => {
    const status = getPaymentStatus(bookingId);
    if (!status) return <span className="badge bg-gray-100 text-gray-400">Belum Bayar</span>;
    if (status === 'settlement' || status === 'capture')
      return <span className="badge badge-success">Lunas ✓</span>;
    if (status === 'pending')
      return <span className="badge badge-warning">Pending</span>;
    return <span className="badge badge-danger">{status}</span>;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-hotel-charcoal/40 text-sm">Loading bookings...</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-hotel-primary">Booking Management</h2>
          <p className="text-hotel-charcoal/40 text-sm mt-1">{bookings.length} bookings total</p>
        </div>

        {/* Info Notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <MdLockOutline className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs leading-relaxed">
            Status booking hanya bisa diubah ke <strong>Confirmed</strong> jika user sudah melakukan pembayaran (status Lunas). 
            Jika belum bayar, pilihan Confirm akan diblokir secara otomatis.
          </p>
        </div>

        <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Check-in</th>
                  <th className="text-left">Check-out</th>
                  <th className="text-left">Status Booking</th>
                  <th className="text-left">Status Bayar</th>
                  <th className="text-left">Ubah Status</th>
                  <th className="text-left">Hapus</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((book) => {
                  const paid = hasPaid(book.id);
                  return (
                    <tr key={book.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                      <td className="font-medium text-hotel-primary">#{book.id}</td>
                      <td className="text-hotel-charcoal/70">{book.email}</td>
                      <td className="text-hotel-charcoal/70">{new Date(book.check_in).toLocaleDateString()}</td>
                      <td className="text-hotel-charcoal/70">{new Date(book.check_out).toLocaleDateString()}</td>
                      <td>
                        <span className={getStatusBadge(book.status)}>{book.status}</span>
                      </td>
                      <td>{getPaymentBadge(book.id)}</td>
                      <td>
                        <div className="relative group/select">
                          <select
                            value={book.status}
                            onChange={(e) => handleStatusChange(book.id, e.target.value)}
                            className="input-premium text-xs py-1.5 px-3 pr-8"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed" disabled={!paid}>
                              {paid ? 'Confirm' : 'Confirm (Belum Bayar)'}
                            </option>
                            <option value="cancelled">Cancel</option>
                          </select>
                          {/* Lock indicator jika belum bayar */}
                          {!paid && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center" title="User belum membayar">
                              <MdLockOutline className="text-white text-[10px]" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-hotel-danger text-xs font-medium hover:bg-red-100 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <Modal show={open} size="md" onClose={() => setOpen(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            {error ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <HiOutlineExclamationCircle className="h-8 w-8 text-hotel-danger" />
                </div>
                <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{error}</h3>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <IoMdCheckmarkCircleOutline className="h-8 w-8 text-hotel-success" />
                </div>
                <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{msg}</h3>
              </>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-full px-6 py-2.5 rounded-xl bg-hotel-accent text-hotel-primary text-sm font-semibold hover:bg-hotel-accent-light transition-all duration-300"
            >
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DataBookings;
