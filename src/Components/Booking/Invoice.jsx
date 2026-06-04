const Invoice = ({ booking }) => {
  if (!booking) return null;

  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const timeDiff = Math.abs(checkOut - checkIn);
  const daysBetween = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const timestamp = Date.now();
  const OrderId = `ORDER-${booking.id}-${timestamp}`;
  const date = booking.transaction_time ? new Date(booking.transaction_time) : new Date();
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  };
  const formatted = date.toLocaleString('en-GB', options).replace(',', '');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className="space-y-4">
      {/* Invoice Number */}
      <div className="text-center pb-4 border-b border-dashed border-gray-200">
        <p className="text-hotel-accent text-xs tracking-widest uppercase mb-1">Invoice</p>
        <p className="font-playfair text-xl font-bold text-hotel-primary">#{booking.id}</p>
      </div>

      {/* Check-in/out */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-hotel-cream rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-hotel-accent uppercase tracking-wider mb-1">Check-in</p>
          <p className="text-sm text-hotel-primary font-medium">{checkIn.toLocaleDateString()}</p>
        </div>
        <div className="bg-hotel-cream rounded-xl p-3 text-center">
          <p className="text-[11px] font-semibold text-hotel-accent uppercase tracking-wider mb-1">Check-out</p>
          <p className="text-sm text-hotel-primary font-medium">{checkOut.toLocaleDateString()}</p>
        </div>
      </div>

      {/* Client */}
      <div className="bg-hotel-cream rounded-xl p-3">
        <p className="text-[11px] font-semibold text-hotel-accent uppercase tracking-wider mb-1">Client</p>
        <p className="text-sm text-hotel-primary font-medium">{booking.nama}</p>
      </div>

      {/* Details Table */}
      <div className="table-premium rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left !py-2.5 !px-3 !text-[10px]">Room</th>
              <th className="text-left !py-2.5 !px-3 !text-[10px]">Nights</th>
              <th className="text-right !py-2.5 !px-3 !text-[10px]">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="!py-2.5 !px-3 !text-xs">{booking.name}</td>
              <td className="!py-2.5 !px-3 !text-xs">{daysBetween}</td>
              <td className="!py-2.5 !px-3 !text-xs text-right font-semibold">Rp {formatPrice(booking.harga)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info rows */}
      {[
        { label: 'Order ID', value: booking.order_id || OrderId },
        { label: 'Payment Type', value: booking.payment_type },
        { label: 'Transaction Time', value: formatted },
      ].map((item) => (
        <div key={item.label} className="bg-hotel-cream rounded-xl p-3">
          <p className="text-[11px] font-semibold text-hotel-accent uppercase tracking-wider mb-1">{item.label}</p>
          <p className="text-sm text-hotel-primary font-medium break-all">{item.value}</p>
        </div>
      ))}

      {/* Status */}
      <div className="bg-hotel-cream rounded-xl p-3">
        <p className="text-[11px] font-semibold text-hotel-accent uppercase tracking-wider mb-2">Status</p>
        <span className="badge badge-success">{booking.status}</span>
      </div>
    </div>
  );
};

export default Invoice;
