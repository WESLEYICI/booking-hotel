import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DataPayments = () => {
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPayments = async () => {
      try {
        const res = await api.get('/bookings/all-payments');
        setPayment(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-hotel-charcoal/40 text-sm">Loading payments...</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-hotel-primary">Payment Records</h2>
        <p className="text-hotel-charcoal/40 text-sm mt-1">{payment.length} transactions</p>
      </div>

      <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Book ID</th>
                <th className="text-left">Order ID</th>
                <th className="text-left">Payment Type</th>
                <th className="text-left">Status</th>
                <th className="text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {payment.map((pay) => (
                <tr key={pay.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                  <td className="font-medium text-hotel-primary">#{pay.booking_id}</td>
                  <td className="text-hotel-charcoal/70 text-xs">{pay.order_id}</td>
                  <td>
                    <span className="badge bg-hotel-accent/10 text-hotel-accent">{pay.payment_type}</span>
                  </td>
                  <td>
                    <span className={`badge ${
                      pay.transaction_status === 'settlement' || pay.transaction_status === 'capture'
                        ? 'badge-success'
                        : pay.transaction_status === 'pending'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}>
                      {pay.transaction_status}
                    </span>
                  </td>
                  <td className="text-hotel-charcoal/70 text-xs">{pay.transaction_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataPayments;
