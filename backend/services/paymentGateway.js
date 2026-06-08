const https = require('https');
const Payment = require('../Models/Payment.js');

function generateOrderId(bookingId) {
  return `ORDER-${bookingId}-${Date.now()}`;
}

function getMidtransUrl() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  return isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
}

function getBasicAuth() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error('MIDTRANS_SERVER_KEY is not configured');
  }
  return Buffer.from(`${serverKey}:`).toString('base64');
}

const BANK_NAMES = {
  bca: 'BCA',
  mandiri: 'Mandiri',
  bni: 'BNI',
  bri: 'BRI',
};

function normalizePaymentType(paymentType) {
  if (!paymentType || paymentType === 'all') {
    return 'Midtrans Snap';
  }
  if (BANK_NAMES[paymentType]) {
    return `Bank Transfer ${BANK_NAMES[paymentType]}`;
  }
  const mapping = {
    bank_transfer: 'Bank Transfer',
    qris: 'QRIS',
    gopay: 'GoPay',
    shopeepay: 'ShopeePay',
    credit_card: 'Credit Card',
  };
  return mapping[paymentType] || 'Payment Gateway';
}

function buildEnabledPayments(paymentType) {
  if (!paymentType || paymentType === 'all') {
    return [];
  }
  if (BANK_NAMES[paymentType]) {
    return [paymentType];
  }
  const mapping = {
    bank_transfer: ['bca_va', 'bni_va', 'bri_va', 'echannel', 'permata_va', 'other_va'],
    qris: ['qris'],
    gopay: ['gopay'],
    shopeepay: ['shopeepay'],
    credit_card: ['credit_card'],
  };
  return mapping[paymentType] || [];
}

function requestMidtrans(payload) {
  const url = new URL(getMidtransUrl());
  const body = JSON.stringify(payload);
  const options = {
    method: 'POST',
    hostname: url.hostname,
    path: url.pathname,
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(json.status_message || data || 'Midtrans error'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function createPaymentSession({ booking_id, amount, payment_type, customer, item_name }) {
  const order_id = generateOrderId(booking_id);
  const transaction_time = new Date();
  const snapPayload = {
    transaction_details: {
      order_id,
      gross_amount: Number(amount),
    },
    customer_details: {
      first_name: customer?.nama || customer?.name || 'Guest',
      email: customer?.email || 'guest@example.com',
      phone: customer?.phone_number || customer?.phone || '081234567890',
    },
    item_details: [
      {
        id: order_id,
        price: Number(amount),
        quantity: 1,
        name: item_name || 'Hotel Booking',
      },
    ],
    credit_card: {
      secure: true,
    },
  };

  const enabled = buildEnabledPayments(payment_type);
  if (payment_type !== 'all' && enabled.length > 0) {
    snapPayload.enabled_payments = enabled;
  }

  const midtransResponse = await requestMidtrans(snapPayload);
  const payment = await Payment.create({
    booking_id,
    order_id,
    gross_amount: amount,
    transaction_status: 'pending',
    payment_type: normalizePaymentType(payment_type),
    transaction_time,
    snap_token: midtransResponse.token,
    redirect_url: midtransResponse.redirect_url,
  });

  return {
    ...payment,
    snap_token: midtransResponse.token,
    redirect_url: midtransResponse.redirect_url,
  };
}

// Hanya panggil Midtrans API dan kembalikan token, tanpa INSERT ke DB
// Digunakan oleh refreshPaymentToken yang melakukan UPDATE sendiri
async function createSnapToken({ booking_id, order_id, amount, payment_type, customer, item_name }) {
  const snapPayload = {
    transaction_details: {
      order_id,
      gross_amount: Number(amount),
    },
    customer_details: {
      first_name: customer?.nama || customer?.name || 'Guest',
      email: customer?.email || 'guest@example.com',
      phone: customer?.phone_number || customer?.phone || '081234567890',
    },
    item_details: [
      {
        id: order_id,
        price: Number(amount),
        quantity: 1,
        name: item_name || 'Hotel Booking',
      },
    ],
    credit_card: {
      secure: true,
    },
  };

  const enabled = buildEnabledPayments(payment_type);
  if (payment_type && payment_type !== 'all' && enabled.length > 0) {
    snapPayload.enabled_payments = enabled;
  }

  const midtransResponse = await requestMidtrans(snapPayload);
  return {
    snap_token: midtransResponse.token,
    redirect_url: midtransResponse.redirect_url,
  };
}

module.exports = {
  createPaymentSession,
  createSnapToken,
};
