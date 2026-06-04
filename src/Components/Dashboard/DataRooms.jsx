import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Modal, ModalBody, ModalHeader, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

const DataRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', capacity: '', size: '', facility: '', description: '', amenities: '', image_url: '', image_url_2: ''
  });

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

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({ name: '', price: '', capacity: '', size: '', facility: '', description: '', amenities: '', image_url: '', image_url_2: '' });
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
      image_url: room.image_url,
      image_url_2: room.image_url_2
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, formData);
        setMsg('Room updated successfully!');
      } else {
        await api.post('/rooms', formData);
        setMsg('Room created successfully!');
      }
      setModalOpen(false);
      setError('');
      setMsgOpen(true);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
      setMsg('');
      setMsgOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this room? It will be hidden from guests but kept in the history.')) return;
    try {
      await api.delete(`/rooms/${id}`);
      setMsg('Room deactivated successfully!');
      setError('');
      setMsgOpen(true);
      fetchRooms();
    } catch (err) {
      setError('Failed to deactivate room');
      setMsg('');
      setMsgOpen(true);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

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
          <p className="text-hotel-charcoal/40 text-sm mt-1">{rooms.length} rooms total</p>
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
                <th className="text-left">ID</th>
                <th className="text-left">Image</th>
                <th className="text-left">Name</th>
                <th className="text-left">Price/Night</th>
                <th className="text-left">Capacity</th>
                <th className="text-left">Facility</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                  <td className="font-medium text-hotel-primary">#{room.id}</td>
                  <td>
                    <img src={room.image_url} alt={room.name} className="w-16 h-12 object-cover rounded-md" />
                  </td>
                  <td className="text-hotel-charcoal/70">{room.name}</td>
                  <td className="text-hotel-primary font-semibold">Rp {formatPrice(room.price)}</td>
                  <td className="text-hotel-charcoal/70">{room.capacity} Guests</td>
                  <td className="text-hotel-charcoal/70 capitalize">{room.facility}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(room)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleDelete(room.id)} className="p-2 rounded-lg bg-red-50 text-hotel-danger hover:bg-red-100 transition-colors" title="Deactivate">
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
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </ModalHeader>
        <ModalBody className="bg-white rounded-b-xl max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Room Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Price / Night (Rp)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Capacity (Guests)</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Size (e.g., 30 M)</label>
                <input type="text" name="size" value={formData.size} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div>
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Main Facility / View</label>
                <input type="text" name="facility" value={formData.facility} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-premium w-full text-sm" rows={3} required></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Amenities</label>
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Image URL 1</label>
                <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-hotel-charcoal/60 text-xs font-medium mb-1">Image URL 2</label>
                <input type="text" name="image_url_2" value={formData.image_url_2} onChange={handleChange} className="input-premium w-full text-sm" required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-xl text-hotel-charcoal text-sm font-semibold border border-gray-200">Cancel</button>
              <button type="submit" className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold">{editingRoom ? 'Save Changes' : 'Create Room'}</button>
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
            <button onClick={() => setMsgOpen(false)} className="w-full px-6 py-2.5 rounded-xl bg-hotel-accent text-hotel-primary text-sm font-semibold">OK</button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DataRooms;
