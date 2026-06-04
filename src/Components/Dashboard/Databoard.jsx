import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarCheck, FaCreditCard } from 'react-icons/fa';
import api from '../../utils/api';

const Databoard = () => {
  const [totalUser, settotalUser] = useState(0);
  const [totalBook, settotalBook] = useState(0);
  const [totalpayment, settotalPayment] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        settotalUser(res.data.length);
        setLoading(false);
      } catch (err) {
        console.error('Gagal ambil user:', err);
        setLoading(false);
      }
    };
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/all');
        settotalBook(res.data.data.length);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchPayments = async () => {
      try {
        const res = await api.get('/bookings/all-payments');
        settotalPayment(res.data.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPayments();
    fetchBookings();
    fetchUsers();
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};

export default Databoard;
