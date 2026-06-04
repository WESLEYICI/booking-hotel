import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { SiTicktick } from 'react-icons/si';
import { MdError } from 'react-icons/md';
import api from '../../utils/api';

const DataDiscount = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalmsg, setModalmsg] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [datadiskon, setDatadiskon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diskon: '',
    code: '',
    tanggal_mulai: '',
    tanggal_akhir: '',
  });

  useEffect(() => {
    const fetchDiskon = async () => {
      try {
        const res = await api.get('/Discount/get-diskon');
        setDatadiskon(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal ambil data');
        setLoading(false);
      }
    };
    fetchDiskon();
  }, []);

  const { diskon, code, tanggal_mulai, tanggal_akhir } = formData;

  const handelOnchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/Discount', formData);
      setMessage('Berhasil menambahkan Voucer');
      setLoading(false);
      setFormData({ diskon: '', code: '', tanggal_mulai: '', tanggal_akhir: '' });
      setModalmsg(true);
      setOpenModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat voucher');
      setMessage('');
      setFormData({ diskon: '', code: '', tanggal_mulai: '', tanggal_akhir: '' });
      setOpenModal(false);
      setModalmsg(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-hotel-primary">Voucher Management</h2>
            <p className="text-hotel-charcoal/40 text-sm mt-1">{datadiskon.length} vouchers</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            + Add Voucher
          </button>
        </div>

        <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Code</th>
                  <th className="text-left">Discount</th>
                  <th className="text-left">Start Date</th>
                  <th className="text-left">End Date</th>
                </tr>
              </thead>
              <tbody>
                {datadiskon.map((diskon) => {
                  const tanggalMulai = new Date(diskon.tanggal_mulai).toLocaleDateString('id-ID');
                  const tanggalAkhir = new Date(diskon.tanggal_akhir).toLocaleDateString('id-ID');
                  return (
                    <tr key={diskon.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                      <td className="font-medium text-hotel-primary">#{diskon.id}</td>
                      <td>
                        <span className="badge bg-hotel-accent/10 text-hotel-accent font-mono">{diskon.code}</span>
                      </td>
                      <td className="text-hotel-charcoal/70 font-semibold">{diskon.diskon}%</td>
                      <td className="text-hotel-charcoal/70">{tanggalMulai}</td>
                      <td className="text-hotel-charcoal/70">{tanggalAkhir}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Voucher Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader className="bg-white rounded-t-xl">
          <span className="text-hotel-primary font-playfair font-semibold">Create New Voucher</span>
        </ModalHeader>
        <ModalBody className="bg-white rounded-b-xl">
          <form onSubmit={handelSubmit} className="space-y-4">
            <div>
              <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Voucher Code
              </label>
              <input
                type="text"
                name="code"
                onChange={handelOnchange}
                value={code}
                className="input-premium w-full text-sm"
                placeholder="e.g. PROMOLEBARAN"
                required
              />
            </div>
            <div>
              <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Discount (%)
              </label>
              <input
                type="number"
                name="diskon"
                onChange={handelOnchange}
                value={diskon}
                className="input-premium w-full text-sm"
                placeholder="50"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  name="tanggal_mulai"
                  onChange={handelOnchange}
                  value={tanggal_mulai}
                  className="input-premium w-full text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2 uppercase tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  name="tanggal_akhir"
                  onChange={handelOnchange}
                  value={tanggal_akhir}
                  className="input-premium w-full text-sm"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full btn-gold shimmer-btn py-3 rounded-xl text-sm font-semibold tracking-wider uppercase"
            >
              Create Voucher
            </button>
          </form>
        </ModalBody>
      </Modal>

      {/* Message Modal */}
      <Modal show={modalmsg} onClose={() => setModalmsg(false)}>
        <ModalHeader className="bg-white rounded-t-xl">
          <span className="text-hotel-primary font-playfair font-semibold">Result</span>
        </ModalHeader>
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            {error ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <MdError className="h-8 w-8 text-hotel-danger" />
                </div>
                <p className="text-hotel-primary font-semibold">{error}</p>
              </div>
            ) : message ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <SiTicktick className="h-6 w-6 text-hotel-success" />
                </div>
                <p className="text-hotel-primary font-semibold">{message}</p>
              </div>
            ) : (
              <p className="text-hotel-charcoal/50">Memproses data...</p>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DataDiscount;
