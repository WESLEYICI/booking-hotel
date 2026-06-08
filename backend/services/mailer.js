const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendInvoiceEmail = async (bookingData, userEmail, userName) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Skipping invoice email.');
    return;
  }

  try {
    const transporter = createTransporter();
    
    // Format tanggal
    const checkIn = new Date(bookingData.check_in).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const checkOut = new Date(bookingData.check_out).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const harga = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(bookingData.harga);

    const mailOptions = {
      from: `"My Hotels" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Invoice Pemesanan Kamar - #${bookingData.id}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c5a880; margin: 0;">My Hotels</h1>
            <p style="color: #666; margin: 5px 0;">Booking Confirmation</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Halo, ${userName}!</h2>
            <p style="color: #4a4a4a; line-height: 1.6;">Terima kasih telah memilih My Hotels. Pembayaran Anda telah kami terima dan pesanan Anda kini berstatus <strong>Confirmed</strong>.</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eaeaea; color: #666;">ID Booking</td>
              <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: bold;">#${bookingData.id}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eaeaea; color: #666;">Check-In</td>
              <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: bold;">${checkIn}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eaeaea; color: #666;">Check-Out</td>
              <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: bold;">${checkOut}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #666;">Total Pembayaran</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #c5a880; font-size: 1.1em;">${harga}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea;">
            <p style="color: #666; font-size: 0.9em;">Sampai jumpa di My Hotels!<br>Jika ada pertanyaan, silakan hubungi kami via WhatsApp.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return false;
  }
};

module.exports = { sendInvoiceEmail };
