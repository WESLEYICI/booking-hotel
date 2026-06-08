import React, { useState, useEffect } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { FaStar } from 'react-icons/fa';
import api from '../../utils/api';

const DataReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus ulasan ini?')) return;
    try {
      const res = await api.delete(`/reviews/${id}`);
      setMsg(res.data.message);
      setError('');
      setOpen(true);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus ulasan');
      setMsg('');
      setOpen(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-hotel-cream p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-hotel-primary mb-2">Manajemen Ulasan</h1>
            <p className="text-hotel-charcoal/60">Kelola semua ulasan tamu dari berbagai kamar</p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-hotel-accent/5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-hotel-accent/5 text-hotel-primary border-b border-hotel-accent/10">
                    <th className="text-left p-4 font-semibold">Tamu</th>
                    <th className="text-left p-4 font-semibold">Kamar</th>
                    <th className="text-left p-4 font-semibold">Rating</th>
                    <th className="text-left p-4 font-semibold">Komentar</th>
                    <th className="text-left p-4 font-semibold">Tanggal</th>
                    <th className="text-left p-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <p className="text-hotel-charcoal/40">Belum ada ulasan.</p>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((rev) => (
                      <tr key={rev.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                        <td className="p-4 font-medium text-hotel-primary">{rev.user_name}</td>
                        <td className="p-4 text-hotel-charcoal/70">{rev.room_name}</td>
                        <td className="p-4">
                          <div className="flex text-yellow-400 text-xs">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar key={star} className={star <= rev.rating ? 'text-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-hotel-charcoal/70 max-w-xs truncate" title={rev.comment}>
                          "{rev.comment}"
                        </td>
                        <td className="p-4 text-hotel-charcoal/70">
                          {new Date(rev.created_at).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDelete(rev.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-hotel-danger text-xs font-medium hover:bg-red-100 transition-all"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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

export default DataReviews;
