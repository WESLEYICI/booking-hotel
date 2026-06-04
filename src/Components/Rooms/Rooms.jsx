import React, { useState, useEffect } from 'react';
import { FaUser, FaEye } from 'react-icons/fa';
import { SlSizeFullscreen } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Rooms.css';

const RoomsAndSuites = ({ handlerooms, searchCriteria }) => {
  const Navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        let endpoint = '/rooms';
        if (searchCriteria && searchCriteria.checkIn && searchCriteria.checkOut) {
          endpoint = `/rooms/available?checkIn=${searchCriteria.checkIn}&checkOut=${searchCriteria.checkOut}&guests=${searchCriteria.guests}`;
        }
        
        const res = await api.get(endpoint);
        if (res.data.success) {
          setRooms(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [searchCriteria]);

  const handleClick = (room) => {
    Navigate('/BookingRoom', {
      state: {
        room_id: room.id,
        name: room.name,
        Price: room.price,
        imageUrl: room.image_url,
        imageUrl2: room.image_url_2,
        user: room.capacity,
        facility: room.facility,
        size: room.size,
        description: room.description,
        amenities: room.amenities,
        searchCheckIn: searchCriteria?.checkIn || '',
        searchCheckOut: searchCriteria?.checkOut || '',
      },
    });
    if (handlerooms) handlerooms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <section id="rooms" className="py-24 md:py-32 bg-hotel-cream">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-hotel-accent font-inter text-xs tracking-[0.3em] uppercase mb-3">
            — Explore Our Accommodations
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-[42px] text-hotel-primary font-bold mb-4">
            Rooms & Suites
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-hotel-charcoal/60 max-w-2xl mx-auto text-base">
            Each room is thoughtfully designed to provide the highest comfort with stunning views and premium amenities.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-hotel-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Room Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-hotel-accent/5"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={room.image_url}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className={`absolute inset-0 flex items-end p-5 transition-all duration-500 ${
                    room.is_available === 0 
                      ? 'bg-hotel-dark/60 opacity-100' 
                      : 'bg-gradient-to-t from-hotel-primary/80 to-transparent opacity-0 group-hover:opacity-100'
                  }`}>
                    {room.is_available === 0 ? (
                      <div className="w-full text-center mb-4">
                        <span className="bg-hotel-danger text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClick(room)}
                        className="btn-gold px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-hotel-primary/90 backdrop-blur-sm text-hotel-accent px-3 py-1.5 rounded-full text-xs font-semibold">
                    Rp {formatPrice(room.price)}
                    <span className="text-white/50 text-[10px]"> /night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <button 
                    onClick={() => room.is_available !== 0 && handleClick(room)} 
                    className={`text-left w-full ${room.is_available === 0 ? 'cursor-not-allowed opacity-60' : ''}`}
                    disabled={room.is_available === 0}
                  >
                    <h3 className="font-playfair text-lg font-semibold text-hotel-primary mb-3 group-hover:text-hotel-accent transition-colors duration-300">
                      {room.name}
                    </h3>
                  </button>

                  {/* Features */}
                  <div className="flex items-center gap-5 text-hotel-charcoal/50">
                    <div className="flex items-center gap-1.5">
                      <FaUser className="text-xs text-hotel-accent/60" />
                      <span className="text-xs">{room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaEye className="text-xs text-hotel-accent/60" />
                      <span className="text-xs capitalize">{room.facility}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <SlSizeFullscreen className="text-xs text-hotel-accent/60" />
                      <span className="text-xs">{room.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomsAndSuites;
