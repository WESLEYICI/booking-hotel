import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const DataBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/all');
        setBookings(res.data.data);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const Toggler = () => setOpen(!open);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: newStatus } : booking)));
        setMsg('Status berhasil diupdate!');
      } else {
        setError(`Gagal: ${response.data.message}`);
      }
      Toggler();
    } catch (err) {
      console.error('Full error:', err);
      setError(`Update gagal: ${err.response?.data?.message || err.message}`);
      Toggler();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus booking ini?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking.id !== id));
      setMsg('Booking berhasil dihapus');
      Toggler();
    } catch (err) {
      console.error('Delete error:', err);
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

        <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Check-in</th>
                  <th className="text-left">Check-out</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Change Status</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((book) => (
                  <tr key={book.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                    <td className="font-medium text-hotel-primary">#{book.id}</td>
                    <td className="text-hotel-charcoal/70">{book.email}</td>
                    <td className="text-hotel-charcoal/70">{new Date(book.check_in).toLocaleDateString()}</td>
                    <td className="text-hotel-charcoal/70">{new Date(book.check_out).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadge(book.status)}>{book.status}</span>
                    </td>
                    <td>
                      <select
                        value={book.status}
                        onChange={(e) => handleStatusChange(book.id, e.target.value)}
                        className="input-premium text-xs py-1.5 px-3"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </select>
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
                ))}
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
            {error && !msg ? (
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
