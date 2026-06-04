import React, { useState } from 'react';
import { FaHome, FaAddressBook, FaMoneyCheckAlt, FaUsers } from 'react-icons/fa';
import { BiSolidDiscount } from 'react-icons/bi';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const Navdashboard = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/dashboard/Userlist', label: 'Users', icon: FaUsers },
    { to: '/dashboard/Databookings', label: 'Bookings', icon: FaAddressBook },
    { to: '/dashboard/DataPayments', label: 'Payments', icon: FaMoneyCheckAlt },
    { to: '/dashboard/Discount', label: 'Vouchers', icon: BiSolidDiscount },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-xl bg-hotel-primary text-white flex items-center justify-center shadow-lg hover:bg-hotel-secondary transition-colors"
        >
          {open ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 z-40 w-64 h-[calc(100vh-5rem)] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full bg-charcoal-gradient overflow-y-auto">
          {/* Profile Section */}
          <div className="px-6 py-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-hotel-primary font-playfair font-bold">
                A
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Admin Panel</p>
                <p className="text-white/30 text-xs">Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6">
            <p className="text-white/20 text-[10px] uppercase tracking-widest px-3 mb-4">Menu</p>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'bg-hotel-accent/15 text-hotel-accent'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`text-base ${active ? 'text-hotel-accent' : ''}`} />
                      <span>{item.label}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-hotel-accent" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Navdashboard;
