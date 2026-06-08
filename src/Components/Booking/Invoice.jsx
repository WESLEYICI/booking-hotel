import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Invoice = ({ booking }) => {
  const invoiceRef = useRef();

  if (!booking) return null;

  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const timeDiff = Math.abs(checkOut - checkIn);
  const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const date = booking.transaction_time ? new Date(booking.transaction_time) : new Date();
  const formatted = date.toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-Booking-${booking.id}.pdf`);
  };

  const statusColor = {
    confirmed: { bg: '#d1fae5', text: '#065f46', label: 'CONFIRMED' },
    pending: { bg: '#fef3c7', text: '#92400e', label: 'PENDING' },
    cancelled: { bg: '#fee2e2', text: '#991b1b', label: 'CANCELLED' },
  }[booking.status] || { bg: '#f3f4f6', text: '#374151', label: booking.status?.toUpperCase() };

  return (
    <div>
      {/* Invoice Content (for PDF capture) */}
      <div ref={invoiceRef} style={{ fontFamily: 'Georgia, serif', background: '#fff', padding: '32px', color: '#1a1a2e' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '20px', borderBottom: '2px solid #C9A84C' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #C9A84C, #E8C56D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1a1a2e', fontSize: '18px' }}>M</div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>My Hotels</span>
            </div>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>Jl. Hotel Mewah No. 1, Jakarta</p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>info@myhotels.com | +62 21 1234 5678</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#C9A84C', margin: 0 }}>INVOICE</p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>#{booking.order_id || `ORDER-${booking.id}`}</p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>{formatted}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <span style={{ background: statusColor.bg, color: statusColor.text, padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
            {statusColor.label}
          </span>
        </div>

        {/* Bill To */}
        <div style={{ marginBottom: '20px', background: '#f9f7f2', borderRadius: '10px', padding: '16px' }}>
          <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Bill To</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px' }}>{booking.nama || booking.name}</p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{booking.email}</p>
          {booking.phone_number && <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{booking.phone_number}</p>}
        </div>

        {/* Stay Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#f9f7f2', borderRadius: '10px', padding: '14px' }}>
            <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>Check-In</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{checkIn.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>Mulai pukul 11:00 WIB</p>
          </div>
          <div style={{ background: '#f9f7f2', borderRadius: '10px', padding: '14px' }}>
            <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>Check-Out</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{checkOut.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>Hingga pukul 10:00 WIB</p>
          </div>
        </div>

        {/* Item Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: '#C9A84C' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderRadius: '8px 0 0 0', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Deskripsi</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Malam</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', borderRadius: '0 8px 0 0', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 14px', color: '#1a1a2e', fontWeight: '600' }}>{booking.name}</td>
              <td style={{ padding: '12px 14px', textAlign: 'center', color: '#4b5563' }}>{nights}</td>
              <td style={{ padding: '12px 14px', textAlign: 'right', color: '#1a1a2e', fontWeight: '600' }}>{formatPrice(booking.harga)}</td>
            </tr>
          </tbody>
        </table>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '14px 20px', minWidth: '220px', textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Pembayaran</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#C9A84C', margin: 0 }}>{formatPrice(booking.harga)}</p>
            {booking.payment_type && <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>via {booking.payment_type}</p>}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Terima kasih telah menginap di My Hotels. Kami berharap dapat melayani Anda kembali! 🏨</p>
        </div>
      </div>

      {/* Download Button */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px', borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8C56D)',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 28px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ⬇ Download PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
