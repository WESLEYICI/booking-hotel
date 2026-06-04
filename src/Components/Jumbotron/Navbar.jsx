import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, Drawer, DrawerHeader, DrawerItems, Modal, ModalBody, ModalHeader, Button } from 'flowbite-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FiMenu, FiX } from 'react-icons/fi';
import ModalPay from './ModalPay';
import api from '../../utils/api';

const Navbars = ({ setIsAuthenticated, isAuthenticated, user, logout, setUser }) => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';
  const MyBookings = location.pathname === '/my-bookings';
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalState, setModalState] = useState('closed');
  const [scrolled, setScrolled] = useState(false);

  const Navigate = useNavigate();
  const handleClose = () => setIsOpen(false);
  const [screen, setScreen] = useState(window.innerWidth < 768);

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    if (modalState === 'closing') {
      setTimeout(() => {
        setModalState('closed');
      }, 300);
      document.body.style.overflow = 'auto';
    } else if (modalState === 'opening') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [modalState]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      setOpenModal(false);
      setTimeout(() => {
        Navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const Toggler = () => {
    setOpenModal(!openModal);
  };

  if (isAuthenticated === null) return null;

  const handleResize = () => {
    setScreen(window.innerWidth < 768);
  };

  const navBg = isHomepage
    ? scrolled
      ? 'rgba(26, 26, 46, 0.95)'
      : 'transparent'
    : '#FBF8F1';

  const textColor = isHomepage ? 'text-white' : 'text-hotel-primary';
  const linkHoverClass = isHomepage
    ? 'hover:text-hotel-accent'
    : 'hover:text-hotel-accent-dark';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled && isHomepage ? 'shadow-lg backdrop-blur-xl' : ''
        } ${!isHomepage ? 'shadow-sm' : ''}`}
        style={{ backgroundColor: navBg }}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center text-hotel-primary font-playfair font-bold text-lg">
              M
            </div>
            <span className={`font-playfair text-xl font-semibold ${textColor} group-hover:text-hotel-accent transition-colors duration-300`}>
              My Hotels
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {!screen && (
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium ${textColor} ${linkHoverClass} transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-hotel-accent after:transition-all after:duration-300 hover:after:w-full`}
              >
                Home
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium ${textColor} ${linkHoverClass} transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-hotel-accent after:transition-all after:duration-300 hover:after:w-full`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/team"
                className={`text-sm font-medium ${textColor} ${linkHoverClass} transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-hotel-accent after:transition-all after:duration-300 hover:after:w-full`}
              >
                About
              </Link>
              <Link
                to="/Contact"
                className={`text-sm font-medium ${textColor} ${linkHoverClass} transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-hotel-accent after:transition-all after:duration-300 hover:after:w-full`}
              >
                Contact
              </Link>
              <Link
                to="/my-bookings"
                className={`text-sm font-medium ${textColor} ${linkHoverClass} transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-hotel-accent after:transition-all after:duration-300 hover:after:w-full`}
              >
                My Bookings
              </Link>
              {MyBookings && (
                <button
                  onClick={() => setModalState('opening')}
                  className={`text-sm font-medium ${textColor} ${linkHoverClass} transition-all duration-300 cursor-pointer relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-hotel-accent after:transition-all after:duration-300 hover:after:w-full`}
                >
                  How to Pay
                </button>
              )}
            </div>
          )}

          {/* Right Side: Auth Button + Mobile Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={Toggler}
                className="btn-gold shimmer-btn px-5 py-2 rounded-full text-sm font-semibold tracking-wide"
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="btn-gold shimmer-btn px-6 py-2 rounded-full text-sm font-semibold tracking-wide">
                  Login
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            {screen && (
              <button
                onClick={() => setIsOpen(true)}
                className={`p-2 rounded-lg ${textColor} hover:bg-white/10 transition-colors duration-300`}
              >
                <FiMenu className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {screen && isOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <div className="absolute top-0 right-0 w-72 h-full bg-hotel-primary shadow-2xl animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="font-playfair text-xl text-white font-semibold">Menu</span>
                <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                  <FiX className="text-xl" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { to: '/', label: 'Home' },
                  ...(isAuthenticated && user?.role === 'admin'
                    ? [{ to: '/dashboard', label: 'Dashboard' }]
                    : []),
                  { to: '/team', label: 'About' },
                  { to: '/Contact', label: 'Contact' },
                  { to: '/my-bookings', label: 'My Bookings' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleClose}
                    className="text-white/80 hover:text-hotel-accent hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {MyBookings && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setModalState('opening');
                    }}
                    className="text-left text-white/80 hover:text-hotel-accent hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    How to Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader className="bg-white rounded-t-xl" />
        <ModalBody className="bg-white rounded-b-xl">
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hotel-accent/10 flex items-center justify-center">
              <HiOutlineExclamationCircle className="h-8 w-8 text-hotel-accent" />
            </div>
            <h3 className="mb-6 text-lg font-semibold text-hotel-primary">
              Apakah anda yakin akan keluar?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-full bg-hotel-danger text-white text-sm font-medium hover:bg-red-600 transition-all duration-300"
              >
                Ya, Keluar
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all duration-300"
              >
                Batal
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <ModalPay modalState={modalState} setModalState={setModalState} />
    </>
  );
};

export default Navbars;
