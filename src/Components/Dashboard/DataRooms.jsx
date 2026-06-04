import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Modal, ModalBody, ModalHeader, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { FaUpload, FaImage } from 'react-icons/fa';

const DataRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', capacity: '', size: '', facility: '', description: '', amenities: '',
  });

  // File states
  const [imageFile, setImageFile] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [image2Preview, setImage2Preview] = useState('');

  const imageRef = useRef();
  const image2Ref = useRef();

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data.data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, slot) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (slot === 1) {
      setImageFile(file);
      setImagePreview(preview);
    } else {
      setImage2File(file);
      setImage2Preview(preview);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', capacity: '', size: '', facility: '', description: '', amenities: '' });
    setImageFile(null);
    setImage2File(null);
    setImagePreview('');
    setImage2Preview('');
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      price: room.price,
      capacity: room.capacity,
      size: room.size,
      facility: room.facility,
      description: room.description,
      amenities: room.amenities,
    });
    setImageFile(null);
    setImage2File(null);
    setImagePreview(room.image_url || '');
    setImage2Preview(room.image_url_2 || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingRoom && !imageFile) {
      setError('Gambar utama kamar wajib diunggah!');
      setMsg('');
      setMsgOpen(true);
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('image', imageFile);
      if (image2File) data.append('image_2', image2File);

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Kamar berhasil diperbarui!');
      } else {
        await api.post('/rooms', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Kamar baru berhasil ditambahkan!');
      }
      setModalOpen(false);
      setError('');
      setMsgOpen(true);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Aksi gagal, coba lagi.');
      setMsg('');
      setMsgOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menonaktifkan kamar ini? Kamar akan disembunyikan dari tamu namun data tetap tersimpan.')) return;
    try {
      await api.delete(`/rooms/${id}`);
      setMsg('Kamar berhasil dinonaktifkan!');
      setError('');
      setMsgOpen(true);
      fetchRooms();
    } catch (err) {
      setError('Gagal menonaktifkan kamar');
      setMsg('');
      setMsgOpen(true);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="xl" color="warning" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-hotel-primary">Room Management</h2>
          <p className="text-hotel-charcoal/40 text-sm mt-1">{rooms.length} kamar terdaftar</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-gold px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold">
          <MdAdd /> Add Room
        </button>
      </div>

      <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">No. Kamar</th>
                <th className="text-left">Gambar</th>
                <th className="text-left">Nama</th>
                <th className="text-left">Harga/Malam</th>
                <th className="text-left">Kapasitas</th>
                <th className="text-left">Fasilitas</th>
                <th className="text-left">Status</th>
                <th className="text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                  <td>
                    <div className="flex flex-col">
                      <span className="inline-flex items-center justify-center w-14 px-2 py-1 rounded-lg bg-hotel-primary/10 text-hotel-primary text-xs font-bold tracking-widest border border-hotel-primary/20">
                        R-{String(room.id).padStart(3, '0')}
                      </span>
                    </div>
                  </td>
                  <td>
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="w-16 h-12 object-cover rounded-md"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/64x48?text=No+Img'; }}
                    />
                  </td>
                  <td className="text-hotel-charcoal/70 font-medium">{room.name}</td>
                  <td className="text-hotel-primary font-semibold">Rp {formatPrice(room.price)}</td>
                  <td className="text-hotel-charcoal/70">{room.capacity} Tamu</td>
                  <td className="text-hotel-charcoal/70 capitalize">{room.facility}</td>
                  <td>
                    {room.is_available === false || room.is_available === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                        Penuh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                        Tersedia
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(room)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="p-2 rounded-lg bg-red-50 text-hotel-danger hover:bg-red-100 transition-colors" title="Nonaktifkan">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal show={modalOpen} size="2xl" onClose={() => setModalOpen(false)}>
        <ModalHeader className="bg-white rounded-t-xl text-hotel-primary font-playfair font-semibold">
          {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
        </ModalHeader>
        <ModalBody className="bg-white rounded-b-xl max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Nama Kamar</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Harga / Malam (Rp)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Kapasitas (Tamu)</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Ukuran (misal: 30 M²)</label>
                <input type="text" name="size" value={formData.size} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Fasilitas Utama / View</label>
                <input type="text" name="facility" value={formData.facility} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Deskripsi</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-premium w-full text-sm" rows={3} required></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Amenities (pisah koma)</label>
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>

              {/* Image Upload 1 */}
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2">
                  Foto Kamar Utama {!editingRoom && <span className="text-red-500">*</span>}
                </label>
                <div
                  onClick={() => imageRef.current.click()}
                  className="relative border-2 border-dashed border-hotel-accent/30 rounded-xl p-4 cursor-pointer hover:border-hotel-accent/60 hover:bg-hotel-accent/5 transition-all group"
                >
                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img src={imagePreview} alt="Preview 1" className="w-20 h-16 object-cover rounded-lg shadow-sm" />
                      <div>
                        <p className="text-sm font-medium text-hotel-primary">
                          {imageFile ? imageFile.name : 'Gambar saat ini'}
                        </p>
                        <p className="text-xs text-hotel-charcoal/40 mt-0.5">Klik untuk ganti foto</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4 text-hotel-charcoal/40">
                      <FaUpload className="text-2xl mb-2 group-hover:text-hotel-accent transition-colors" />
                      <p className="text-sm font-medium">Klik untuk pilih foto utama</p>
                      <p className="text-xs mt-1">JPG, PNG, WebP — maks. 5 MB</p>
                    </div>
                  )}
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 1)}
                  />
                </div>
              </div>

              {/* Image Upload 2 */}
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-2">
                  Foto Kamar Tambahan <span className="text-hotel-charcoal/30">(opsional)</span>
                </label>
                <div
                  onClick={() => image2Ref.current.click()}
                  className="relative border-2 border-dashed border-hotel-accent/20 rounded-xl p-4 cursor-pointer hover:border-hotel-accent/50 hover:bg-hotel-accent/5 transition-all group"
                >
                  {image2Preview ? (
                    <div className="flex items-center gap-4">
                      <img src={image2Preview} alt="Preview 2" className="w-20 h-16 object-cover rounded-lg shadow-sm" />
                      <div>
                        <p className="text-sm font-medium text-hotel-primary">
                          {image2File ? image2File.name : 'Gambar saat ini'}
                        </p>
                        <p className="text-xs text-hotel-charcoal/40 mt-0.5">Klik untuk ganti foto</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4 text-hotel-charcoal/30">
                      <FaImage className="text-2xl mb-2 group-hover:text-hotel-accent transition-colors" />
                      <p className="text-sm font-medium">Klik untuk pilih foto tambahan</p>
                      <p className="text-xs mt-1">JPG, PNG, WebP — maks. 5 MB</p>
                    </div>
                  )}
                  <input
                    ref={image2Ref}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 2)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-xl text-hotel-charcoal text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={submitting} className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                {submitting ? <Spinner size="sm" /> : null}
                {editingRoom ? 'Simpan Perubahan' : 'Tambah Kamar'}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* Result Modal */}
      <Modal show={msgOpen} size="md" onClose={() => setMsgOpen(false)} popup>
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
            <button onClick={() => setMsgOpen(false)} className="w-full px-6 py-2.5 rounded-xl bg-hotel-accent text-hotel-primary text-sm font-semibold hover:bg-hotel-accent-dark transition-colors">
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DataRooms;
