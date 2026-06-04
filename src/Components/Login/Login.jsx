import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import api from '../../utils/api';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [formData, setformData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { email, password } = formData;

  const handleregis = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const Toggler = () => {
    setOpenModal(!openModal);
  };

  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handelogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      setUser(res.data.user);
      setTimeout(() => {
        navigate(res.data.user.role === 'admin' ? '/dashboard' : '/');
      }, 100);
    } catch (err) {
      Toggler();
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-center bg-no-repeat bg-cover bg-[url('https://wallpapercave.com/wp/wp9913903.jpg')] flex items-center justify-center px-4 pt-20">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-hotel-dark/90 via-hotel-primary/80 to-hotel-dark/90 -z-0" />

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md glass rounded-2xl p-8 md:p-10 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold-gradient flex items-center justify-center">
              <span className="font-playfair font-bold text-hotel-primary text-xl">M</span>
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl text-white font-semibold">Welcome Back</h2>
            <p className="text-white/40 text-sm mt-2">Sign in to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handelogin} className="space-y-5">
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

            <button
              type="submit"
              className="w-full btn-gold shimmer-btn py-3 rounded-xl text-sm font-semibold tracking-wider uppercase mt-2"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-white/40 text-sm">Don't have an account?</span>
            <button
              onClick={handleregis}
              className="text-hotel-accent text-sm font-semibold hover:text-hotel-accent-light transition-colors duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <HiOutlineExclamationCircle className="h-8 w-8 text-hotel-danger" />
            </div>
            <h3 className="mb-5 text-lg font-semibold text-hotel-primary">{error}</h3>
            <button
              onClick={() => setOpenModal(false)}
              className="w-full px-6 py-2.5 rounded-xl bg-hotel-danger text-white text-sm font-medium hover:bg-red-600 transition-all duration-300"
            >
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Login;
