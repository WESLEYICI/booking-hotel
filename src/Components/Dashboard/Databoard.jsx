import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarCheck, FaCreditCard, FaBed, FaDoorOpen } from 'react-icons/fa';
import { MdHotel } from 'react-icons/md';
import api from '../../utils/api';

const Databoard = () => {
  const [totalUser, settotalUser] = useState(0);
  const [totalBook, settotalBook] = useState(0);
  const [totalpayment, settotalPayment] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [roomsFull, setRoomsFull] = useState(0);
  const [roomsAvailable, setRoomsAvailable] = useState(0);
  const [fullRoomsList, setFullRoomsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        settotalUser(res.data.length);
      } catch (err) {
        console.error('Gagal ambil user:', err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/all');
        settotalBook(res.data.data.length);
      } catch (err) {
        console.error('Gagal mengambil data booking:', err);
      }
    };

    const fetchPayments = async () => {
      try {
        const res = await api.get('/bookings/all-payments');
        settotalPayment(res.data.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        const rooms = res.data.data || [];
        setTotalRooms(rooms.length);
        const full = rooms.filter(r => r.is_available === false || r.is_available === 0);
        setRoomsFull(full.length);
        setRoomsAvailable(rooms.length - full.length);
        setFullRoomsList(full);
      } catch (err) {
        console.error('Gagal ambil kamar:', err);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchUsers(), fetchBookings(), fetchPayments(), fetchRooms()]);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: totalUser,
      icon: FaUsers,
      gradient: 'from-blue-600 to-blue-800',
      iconBg: 'bg-blue-500/20',
    },
    {
      title: 'Total Bookings',
      value: totalBook,
      icon: FaCalendarCheck,
      gradient: 'from-hotel-accent-dark to-hotel-accent',
      iconBg: 'bg-hotel-accent/20',
    },
    {
      title: 'Total Payments',
      value: totalpayment,
      icon: FaCreditCard,
      gradient: 'from-emerald-600 to-emerald-800',
      iconBg: 'bg-emerald-500/20',
    },
    {
      title: 'Total Kamar',
      value: totalRooms,
      icon: MdHotel,
      gradient: 'from-violet-600 to-violet-800',
      iconBg: 'bg-violet-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-charcoal-gradient rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-hotel-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-hotel-accent text-xs tracking-widest uppercase mb-2">Dashboard Overview</p>
          <h1 className="font-playfair text-2xl md:text-3xl text-white font-bold mb-2">Welcome Back, Admin</h1>
          <p className="text-white/40 text-sm">Here's what's happening with your hotel today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`stat-card bg-gradient-to-br ${card.gradient} text-white`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">{card.title}</p>
                  <p className="font-playfair text-4xl font-bold">
                    {loading ? '...' : card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="text-xl text-white/80" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Availability Status */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-playfair text-lg font-bold text-hotel-primary mb-1">Status Kamar Hari Ini</h3>
        <p className="text-hotel-charcoal/40 text-xs mb-5">Berdasarkan booking aktif yang sedang berlangsung</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tersedia */}
          <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-xl px-5 py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <FaDoorOpen className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Tersedia</p>
              <p className="font-playfair text-3xl font-bold text-green-700">
                {loading ? '...' : roomsAvailable}
              </p>
              <p className="text-xs text-green-600/70 mt-0.5">kamar siap dipesan</p>
            </div>
          </div>
          {/* Penuh */}
          <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <FaBed className="text-red-500 text-xl" />
            </div>
            <div>
              <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Sedang Penuh</p>
              <p className="font-playfair text-3xl font-bold text-red-600">
                {loading ? '...' : roomsFull}
              </p>
              <p className="text-xs text-red-500/70 mt-0.5">kamar sedang terisi</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {!loading && totalRooms > 0 && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-hotel-charcoal/50 mb-1.5">
              <span>Tingkat Hunian</span>
              <span>{Math.round((roomsFull / totalRooms) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${(roomsFull / totalRooms) * 100}%`,
                  background: 'linear-gradient(90deg, #C9A84C, #E8C56D)',
                }}
              />
            </div>
          </div>
        )}

        {/* Daftar kamar yang sedang penuh */}
        {!loading && fullRoomsList.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">🔴 Kamar Sedang Penuh:</p>
            <div className="flex flex-wrap gap-2">
              {fullRoomsList.map(room => (
                <div
                  key={room.id}
                  className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2"
                >
                  <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-md tracking-widest">
                    R-{String(room.id).padStart(3, '0')}
                  </span>
                  <span className="text-xs text-red-700 font-medium">{room.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && fullRoomsList.length === 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-xs text-green-600 font-medium">✅ Semua kamar saat ini tersedia!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Databoard;
