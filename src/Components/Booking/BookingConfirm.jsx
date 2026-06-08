import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheckCircle } from 'react-icons/fa';
import { RiDiscountPercentFill } from 'react-icons/ri';
import api from '../../utils/api';
import { Spinner } from 'flowbite-react';
export default function Component({ setIsAuthenticated, isAuthenticated, setUser }) {
  const [openModal, setOpenModal] = useState(false);
  const [modalcekdiskon, setModalcekDiskon] = useState(false);
  const [modalDiskon, setModalDiskon] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [pendingSnapToken, setPendingSnapToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [hargaDiskon, setHargaDiskon] = useState(null);
  const [navigateData, setNavigateData] = useState(null);
  const [gatewayError, setGatewayError] = useState('');
  const [snapLoaded, setSnapLoaded] = useState(false);
  const state = location.state || {};
  const { name, harga, daysBetween, Checkin, Checkout } = state;
  const bookingReady = Boolean(name && harga && daysBetween && Checkin && Checkout);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (err) {
        console.error('Token validation failed:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, []);

  const Toggler = () => {
    setOpenModal(!openModal);
  };

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone_number: '',
    payment_type: 'all',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const goToMyBookings = () => {
    navigate('/my-bookings', { state: navigateData });
  };
  const Cekdiskon = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/vouchers/validate', { harga, code });
      const data = res.data.data;
      setMessage(`Selamat Anda Berhasil Mendapatkan Diskon sebesar ${data.diskon}%`);
      setModalcekDiskon(true);
      setHargaDiskon(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal Menggunakan Diskon');
      setModalcekDiskon(true);
      console.log(err.response?.data?.message);
    }
  };

  useEffect(() => {
    if (window.snap) {
      setSnapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'Mid-client-5lxiwuurfKXyAflc');
    script.async = true;
    script.onload = () => setSnapLoaded(true);
    script.onerror = () => setGatewayError('Gagal memuat Midtrans Snap.');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Generate token baru dari backend dengan payment_type yang dipilih, lalu buka Snap
  const refreshAndPay = async () => {
    if (!pendingSnapToken?.bookingData?.booking_id) return;
    setCancelModal(false);
    setLoading(true);
    try {
      const res = await api.post(`/bookings/${pendingSnapToken.bookingData.booking_id}/refresh-token`, {
        payment_type: formData.payment_type,
      });
      const newToken = res.data.snap_token;
      setLoading(false);
      if (!newToken || !window.snap) {
        setGatewayError('Gagal mendapatkan token pembayaran baru.');
        return;
      }
      // Update pending token dengan yang baru
      setPendingSnapToken(prev => ({ ...prev, token: newToken }));
      window.snap.pay(newToken, {
        onSuccess: () => {
          setCancelModal(false);
          setSuccess(true);
          setNavigateData(pendingSnapToken.bookingData);
        },
        onPending: () => {
          setCancelModal(false);
          setSuccess(true);
          setNavigateData(pendingSnapToken.bookingData);
        },
        onError: () => {
          setCancelModal(true);
        },
        onClose: () => {
          setCancelModal(true);
        },
      });
    } catch (err) {
      setLoading(false);
      setGatewayError('Gagal memperbarui metode pembayaran: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!snapLoaded || !window.snap) {
      setGatewayError('Midtrans Snap belum siap. Tunggu sebentar lalu coba lagi.');
      return;
    }

    setLoading(true);
    setGatewayError('');
    const formDataToSend = new FormData();
    formDataToSend.append('room_id', state.room_id);
    formDataToSend.append('nama', formData.nama);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('name', state.name);
    formDataToSend.append('check_in', state.Checkin);
    formDataToSend.append('check_out', state.Checkout);
    formDataToSend.append('harga', hargaDiskon ? hargaDiskon.harga_setelah_diskon : harga);
    formDataToSend.append('payment_type', formData.payment_type);
    if (hargaDiskon && hargaDiskon.code) {
      formDataToSend.append('voucher_code', hargaDiskon.code);
    }

    try {
      const response = await api.post('/bookings', formDataToSend);
      const booking = response.data.booking || response.data;
      const payment = response.data.payment;

      if (payment?.snap_token && window.snap) {
        const bookingData = {
          booking_id: booking.id,
          nama: formData.nama,
          email: formData.email,
          phone_number: formData.phone_number,
          harga: hargaDiskon ? hargaDiskon.harga_setelah_diskon : harga,
          name,
          daysBetween,
        };
        // Simpan token agar bisa retry tanpa re-submit form
        setPendingSnapToken({ token: payment.snap_token, bookingData });
        setLoading(false);
        window.snap.pay(payment.snap_token, {
          onSuccess: () => {
            setCancelModal(false);
            setSuccess(true);
            setNavigateData(bookingData);
          },
          onPending: () => {
            setCancelModal(false);
            setSuccess(true);
            setNavigateData(bookingData);
          },
          onError: () => {
            setCancelModal(true);
          },
          onClose: () => {
            // Tampilkan modal — tidak alert biasa
            setCancelModal(true);
          },
        });
      } else {
        setLoading(false);
        setGatewayError('Token pembayaran tidak diterima dari server.');
      }
    } catch (err) {
      setLoading(false);
      alert('Gagal membuat booking: ' + (err.response?.data?.message || err.message));
    }
  };
  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Spinner color="info" aria-label="Info spinner example" />
      </div>
    );

  if (!bookingReady)
    return (
      <div className="h-[100vh] flex items-center justify-center bg-[#FAF7F2]">
        <p className="text-center text-lg font-semibold">Data booking tidak tersedia. Silakan kembali ke halaman pemesanan.</p>
      </div>
    );

  return (
    <>
      <div className="h-[170vh] md:h-[120vh] lg:h-[220vh] bg-[#FAF7F2] w-full">
        <div className="flex flex-col justify-center items-center">
          <p className="font-bold text-[20px] mt-[20px]">Booking Confirmation</p>
          <div className="bg-white border flex flex-col justify-center items-center border-gray-300 rounded-lg shadow-lg h-[300px] mt-[30px] w-[350px] mr-[10px] ml-[10px] md:w-[700px] md:ml-[30px] lg:h-[370px] lg:w-[500px]">
            <p className=" text-[20px] mt-[17px]">Booking Details</p>
            <p className=" text-[15px] mt-[17px]">
              Check-in : <span className="font-bold">{Checkin}</span> , from 11:00 am
            </p>
            <p className=" text-[15px] mt-[17px]">
              Check-out :<span className="font-bold">{Checkout}</span> , until 10:00 am
            </p>
          </div>
          <div className="bg-white border flex flex-col justify-center items-center border-gray-300 rounded-lg shadow-lg h-[300px] mt-[30px] w-[350px] mr-[10px] ml-[10px] md:w-[700px] md:ml-[30px] lg:h-[370px] lg:w-[500px]">
            <p className=" text-[20px] mt-[17px]">Price BreakDown</p>
            <div className="flex gap-[20px] mt-[20px] ">
              <p className="text-black">
                Name <span className="">:</span>
              </p>
              <p className="text-black">{name}</p>
            </div>
            <div className="flex gap-[150px] mt-[20px] ">
              <p className="text-black">
                Nights <span className="ml-[10px]">:</span>
              </p>
              <p className="text-black">{daysBetween}</p>
            </div>

            <div className={`flex ${hargaDiskon ? 'gap-[10px]' : 'gap-[120px]'} mt-[20px]`}>
              <p className="text-black">
                Total <span className="ml-[30px]">:</span>
              </p>
              {!hargaDiskon ? (
                <p>Rp. {harga}</p>
              ) : (
                <div className="flex gap-2">
                  <p className="line-through">Rp. {harga}</p>
                  <p>Rp. {hargaDiskon.harga_setelah_diskon} </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border flex flex-col justify-center items-center border-gray-300 rounded-lg shadow-lg min-h-[400px] mt-[30px] w-[350px] mr-[10px] ml-[10px] md:w-[700px] md:ml-[30px] lg:h-[550px] lg:w-[500px]">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto w-full p-4">
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#FAF7F2] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@gmail.com"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900">
                  Your Name
                </label>
                <input
                  type="text"
                  id="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="bg-[#FAF7F2] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900">
                  Phone number
                </label>
                <input
                  type="number"
                  id="number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="bg-[#FAF7F2] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="0893156759"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="payment_type" className="block mb-2 text-sm font-medium text-gray-900">
                  Metode Pembayaran
                </label>
                <select
                  id="payment_type"
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  className="bg-[#FAF7F2] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="all">⭐ Tampilkan Semua (Direkomendasikan)</option>
                  <option value="bank_transfer">Virtual Account (BCA, BNI, Mandiri, dll)</option>
                  <option value="credit_card">Kartu Kredit / Debit</option>
                  <option value="gopay">GoPay</option>
                  <option value="qris">QRIS</option>
                  <option value="shopeepay">ShopeePay</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">💡 Pilih "Tampilkan Semua" agar semua metode tersedia di halaman pembayaran</p>
              </div>
              {gatewayError && <p className="text-sm text-red-600 mb-4">{gatewayError}</p>}

              {!hargaDiskon ? (
                <p className="mt-[20px] font-semibold">Total: Rp. {harga}</p>
              ) : (
                <div className="flex gap-2 mt-[20px]">
                  <p className="line-through">Rp. {harga}</p>
                  <p className="font-semibold">Rp. {hargaDiskon.harga_setelah_diskon}</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-2 mt-[20px] mb-5">
                <button
                  type={`${isAuthenticated ? 'submit' : 'button'}`}
                  onClick={isAuthenticated ? undefined : Toggler}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-[200px]"
                >
                  BOOK NOW
                </button>
                <button
                  type="button"
                  onClick={() => setModalDiskon(true)}
                  className="text-black bg-white flex gap-4 hover:bg-black hover:text-white border border-black hover:border-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none w-full md:w-[200px] justify-center"
                >
                  <RiDiscountPercentFill className="text-[20px]" />
                  Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal show={modalDiskon} onClose={() => setModalDiskon(false)}>
        <ModalHeader className="bg-white">
          <p className="text-black">Discount</p>
        </ModalHeader>
        <ModalBody className="bg-white">
          <form onSubmit={Cekdiskon}>
            <div className="space-y-6">
              <input
                type="text"
                id="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={`bg-[#FAF7F2] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${hargaDiskon ? 'cursor-not-allowed' : ''}`}
                placeholder="name"
                disabled={hargaDiskon}
                required={!hargaDiskon}
              />
            </div>
            <div className="my-[20px]">
              {!hargaDiskon ? (
                <p>Rp. {harga}</p>
              ) : (
                <div className="flex gap-2">
                  <p className="line-through">Rp. {harga}</p>
                  <p>Rp. {hargaDiskon.harga_setelah_diskon} </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              cek
            </button>
            {hargaDiskon ? (
              <button
                type="button"
                onClick={() => setModalDiskon(false)}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Gunakan
              </button>
            ) : (
              ''
            )}
          </form>
        </ModalBody>
      </Modal>
      {/* modal jika belum login */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader className="bg-white" />
        <ModalBody className="bg-white">
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400 " />
            <h3 className="mb-5 text-lg font-normal text-black">Untuk memesan hotel, Anda harus login terlebih dahulu</h3>
            <div className="flex bg-green-400 justify-center gap-4">
              <Button color="failure" className="w-full" onClick={() => setOpenModal(false)}>
                {'Oke'}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal show={success} size="md" onClose={() => setSuccess(false)} popup>
        <ModalHeader className="bg-white" />
        <ModalBody className="bg-white">
          <div className="text-center">
            <FaCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 " />
            <h3 className="mb-5 text-lg font-normal text-black">Booking Berhasil Silahkan melanjutkan pembayaran dihalaman mybookings</h3>
            <div className="flex bg-green-400 justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setSuccess(false);
                  goToMyBookings();
                }}
              >
                {'oke'}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* Modal: Pembayaran Dibatalkan / Ganti Metode */}
      {cancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-hotel-dark/70 backdrop-blur-sm z-[9999]">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-premium animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-playfair text-base font-semibold text-hotel-primary">Pembayaran Dibatalkan</h3>
                <p className="text-xs text-hotel-charcoal/40 mt-0.5">Anda menutup halaman pembayaran</p>
              </div>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-hotel-charcoal/70 leading-relaxed">
                Booking Anda sudah tersimpan dengan status{' '}
                <strong className="text-amber-600">Pending</strong>. Ganti metode pembayaran jika perlu, lalu coba bayar lagi.
              </p>
              {/* Dropdown ganti metode */}
              <div className="bg-hotel-cream rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-hotel-primary uppercase tracking-wider">Ganti Metode Pembayaran</p>
                <select
                  value={formData.payment_type}
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                  className="w-full bg-white border border-gray-200 text-hotel-charcoal text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-hotel-accent/30 focus:border-hotel-accent outline-none"
                >
                  <option value="all">Tampilkan Semua (Midtrans)</option>
                  <option value="bank_transfer">Virtual Account (BCA, BNI, Mandiri, dll)</option>
                  <option value="gopay">GoPay</option>
                  <option value="qris">QRIS</option>
                  <option value="shopeepay">ShopeePay</option>
                  <option value="credit_card">Kartu Kredit / Debit</option>
                </select>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              {pendingSnapToken && (
                <button
                  onClick={refreshAndPay}
                  className="flex-1 btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold text-center"
                >
                  🔄 Coba Bayar Lagi
                </button>
              )}
              <button
                onClick={() => {
                  setCancelModal(false);
                  navigate('/my-bookings');
                }}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 text-hotel-charcoal/70 text-sm font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Bayar Nanti di My Bookings
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal show={modalcekdiskon} size="md" onClose={() => setModalcekDiskon(false)} popup>
        <ModalHeader className="bg-white" />
        <ModalBody className="bg-white">
          <div className="text-center">
            {error && !message ? (
              <>
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400 " />
                <h3 className="mb-5 text-lg font-normal text-black">{error}</h3>
              </>
            ) : message && !error ? (
              <>
                <FaCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 " />
                <h3 className="mb-5 text-lg font-normal text-black">{message}</h3>
              </>
            ) : (
              <>
                <FaCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 " />
                <h3 className="mb-5 text-lg font-normal text-black">{message}</h3>
              </>
            )}
            <div className="flex bg-green-400 justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setModalcekDiskon(false);
                }}
              >
                {'oke'}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
