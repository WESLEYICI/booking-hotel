import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { SiTicktick } from 'react-icons/si';
import { MdError, MdDelete, MdToggleOn, MdToggleOff, MdAdd } from 'react-icons/md';
import { HiOutlineTicket } from 'react-icons/hi';
import api from '../../utils/api';

const DataDiscount = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalmsg, setModalmsg] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [datadiskon, setDatadiskon] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    diskon: '',
    code: '',
    tanggal_mulai: '',
    tanggal_akhir: '',
    max_uses: '',
  });

  const fetchDiskon = async () => {
    try {
      setLoadingData(true);
      const res = await api.get('/vouchers');
      setDatadiskon(res.data.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal ambil data voucher');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDiskon();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/vouchers', {
        ...formData,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      });
      setMessage('Voucher berhasil ditambahkan!');
      setErrorMsg('');
      setFormData({ diskon: '', code: '', tanggal_mulai: '', tanggal_akhir: '', max_uses: '' });
      setOpenModal(false);
      setModalmsg(true);
      fetchDiskon();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal membuat voucher');
      setMessage('');
      setModalmsg(true);
      setOpenModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (voucher) => {
    try {
      if (voucher.is_active) {
        await api.patch(`/vouchers/${voucher.id}/deactivate`);
      } else {
        await api.patch(`/vouchers/${voucher.id}/activate`);
      }
      fetchDiskon();
    } catch (err) {
      setErrorMsg('Gagal mengubah status voucher');
      setMessage('');
      setModalmsg(true);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Hapus voucher "${code}" secara permanen?`)) return;
    try {
      await api.delete(`/vouchers/${id}`);
      setMessage(`Voucher "${code}" berhasil dihapus`);
      setErrorMsg('');
      setModalmsg(true);
      fetchDiskon();
    } catch (err) {
      setErrorMsg('Gagal menghapus voucher');
      setMessage('');
      setModalmsg(true);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isExpired = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return end < today;
  };
  
  const isNotStarted = (startDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    return start > today;
  };

  const getStatusBadge = (v) => {
    if (!v.is_active) return <span className="badge bg-gray-100 text-gray-500">Nonaktif</span>;
    if (isExpired(v.tanggal_akhir)) return <span className="badge bg-red-50 text-red-500">Kedaluwarsa</span>;
    if (isNotStarted(v.tanggal_mulai)) return <span className="badge bg-blue-50 text-blue-500">Belum Mulai</span>;
    if (v.max_uses && v.used_count >= v.max_uses) return <span className="badge bg-orange-50 text-orange-500">Habis</span>;
    return <span className="badge bg-green-50 text-green-600">Aktif</span>;
  };

  const activeCount = datadiskon.filter(v => v.is_active && !isExpired(v.tanggal_akhir) && !isNotStarted(v.tanggal_mulai)).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-hotel-primary">Voucher Management</h2>
            <p className="text-hotel-charcoal/40 text-sm mt-1">
              {datadiskon.length} total · {activeCount} aktif
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <MdAdd className="text-base" /> Add Voucher
          </button>
        </div>

        {/* Table */}
        <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Code</th>
                  <th className="text-left">Diskon</th>
                  <th className="text-left">Berlaku</th>
                  <th className="text-left">Berakhir</th>
                  <th className="text-left">Pemakaian</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-hotel-charcoal/30">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
                        Memuat data...
                      </div>
                    </td>
                  </tr>
                ) : datadiskon.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <HiOutlineTicket className="w-10 h-10 mx-auto text-hotel-charcoal/20 mb-3" />
                      <p className="text-hotel-charcoal/30 text-sm">Belum ada voucher</p>
                    </td>
                  </tr>
                ) : (
                  datadiskon.map((v) => (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                      <td>
                        <span className="font-mono font-bold text-hotel-primary bg-hotel-accent/10 px-3 py-1 rounded-lg text-sm tracking-wider">
                          {v.code}
                        </span>
                      </td>
                      <td>
                        <span className="text-lg font-bold text-hotel-accent">{v.diskon}%</span>
                      </td>
                      <td className="text-hotel-charcoal/60 text-xs">{formatDate(v.tanggal_mulai)}</td>
                      <td className="text-hotel-charcoal/60 text-xs">{formatDate(v.tanggal_akhir)}</td>
                      <td>
                        <span className="text-hotel-charcoal/70 text-xs">
                          {v.used_count}
                          {v.max_uses ? ` / ${v.max_uses}` : ' / ∞'}
                        </span>
                      </td>
                      <td>{getStatusBadge(v)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggle(v)}
                            title={v.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            className={`p-2 rounded-lg transition-colors ${
                              v.is_active
                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {v.is_active ? <MdToggleOn className="text-lg" /> : <MdToggleOff className="text-lg" />}
                          </button>
                          <button
                            onClick={() => handleDelete(v.id, v.code)}
                            title="Hapus permanen"
                            className="p-2 rounded-lg bg-red-50 text-hotel-danger hover:bg-red-100 transition-colors"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Voucher Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <ModalHeader className="bg-white rounded-t-xl">
          <span className="text-hotel-primary font-playfair font-semibold">Buat Voucher Baru</span>
        </ModalHeader>
        <ModalBody className="bg-white rounded-b-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Kode Voucher <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="code"
                onChange={handleChange}
                value={formData.code}
                className="input-premium w-full text-sm font-mono tracking-widest"
                placeholder="PROMO2025"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Diskon (%) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="diskon"
                  onChange={handleChange}
                  value={formData.diskon}
                  className="input-premium w-full text-sm"
                  placeholder="20"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Maks. Pemakaian
                </label>
                <input
                  type="number"
                  name="max_uses"
                  onChange={handleChange}
                  value={formData.max_uses}
                  className="input-premium w-full text-sm"
                  placeholder="Kosong = tak terbatas"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Tanggal Mulai <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_mulai"
                  onChange={handleChange}
                  value={formData.tanggal_mulai}
                  className="input-premium w-full text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Tanggal Akhir <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_akhir"
                  onChange={handleChange}
                  value={formData.tanggal_akhir}
                  className="input-premium w-full text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold py-3 rounded-xl text-sm font-semibold tracking-wider uppercase disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
              ) : (
                'Buat Voucher'
              )}
            </button>
          </form>
        </ModalBody>
      </Modal>

      {/* Result Modal */}
      <Modal show={modalmsg} onClose={() => setModalmsg(false)} size="sm" popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            {errorMsg ? (
              <>
                <div className="w-16 h-16 mb-4 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                  <MdError className="h-8 w-8 text-hotel-danger" />
                </div>
                <p className="text-hotel-primary font-semibold">{errorMsg}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mb-4 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <SiTicktick className="h-6 w-6 text-hotel-success" />
                </div>
                <p className="text-hotel-primary font-semibold">{message}</p>
              </>
            )}
            <button
              onClick={() => { setModalmsg(false); setErrorMsg(''); }}
              className="mt-5 w-full px-6 py-2.5 rounded-xl bg-hotel-accent text-hotel-primary text-sm font-semibold hover:bg-hotel-accent-dark transition-colors"
            >
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DataDiscount;
