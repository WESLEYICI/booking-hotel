import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const Register = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const Toggler = () => {
    setOpenModal(!openModal);
  };

  const handleNavigate = () => {
    navigate('/login');
  };

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    try {
      const response = await api.post('/auth/register', { name, email, password });
      setMessage(response.data.message || 'Register berhasil');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-center bg-no-repeat bg-cover bg-[url('https://wallpaperaccess.com/full/2690557.jpg')] flex items-center justify-center px-4 pt-20">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-hotel-dark/90 via-hotel-primary/80 to-hotel-dark/90 -z-0" />

        {/* Register Card */}
        <div className="relative z-10 w-full max-w-md glass rounded-2xl p-8 md:p-10 animate-scale-in my-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold-gradient flex items-center justify-center">
              <span className="font-playfair font-bold text-hotel-primary text-xl">M</span>
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl text-white font-semibold">Create Account</h2>
            <p className="text-white/40 text-sm mt-2">Join us for an exclusive experience</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-hotel-accent focus:ring-1 focus:ring-hotel-accent/30 transition-all duration-300 outline-none"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-hotel-accent focus:ring-1 focus:ring-hotel-accent/30 transition-all duration-300 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-hotel-accent focus:ring-1 focus:ring-hotel-accent/30 transition-all duration-300 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:border-hotel-accent focus:ring-1 focus:ring-hotel-accent/30 transition-all duration-300 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              onClick={Toggler}
              className="w-full btn-gold shimmer-btn py-3 rounded-xl text-sm font-semibold tracking-wider uppercase mt-2"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-white/40 text-sm">Already have an account?</span>
            <button
              onClick={() => navigate('/login')}
              className="text-hotel-accent text-sm font-semibold hover:text-hotel-accent-light transition-colors duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            {error && !message ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <HiOutlineExclamationCircle className="h-8 w-8 text-hotel-danger" />
                </div>
                <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{error}</h3>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <IoIosCheckmarkCircleOutline className="h-8 w-8 text-hotel-success" />
                </div>
                <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{message}</h3>
              </>
            )}

            <button
              onClick={error && !message ? Toggler : handleNavigate}
              className={`w-full px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-300 ${
                error && !message
                  ? 'bg-hotel-danger hover:bg-red-600'
                  : 'bg-hotel-success hover:bg-green-600'
              }`}
            >
              {error && !message ? 'Try Again' : 'Go to Login'}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Register;
