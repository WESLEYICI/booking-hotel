import React from 'react';
import { FaUser, FaEye } from 'react-icons/fa';
import { SlSizeFullscreen } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';

const RoomsAndSuites = ({ handlerooms }) => {
  const Navigate = useNavigate();

  const handleClick = (room) => {
    Navigate('/BookingRoom', {
      state: {
        name: room.name,
        Price: room.Price,
        imageUrl: room.imageUrl,
        imageUrl2: room.imageUrl2,
        user: room.user,
        facility: room.facility,
        size: room.size,
        description: room.description,
        amenities: room.amenities,
      },
    });
    handlerooms();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rooms = [
    {
      name: 'Classic Double Room',
      Price: '150000',
      imageUrl: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg',
      imageUrl2: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room-920x650.jpg',
      user: '2',
      facility: 'beach',
      size: '30 M',
      description: 'Let yourself fully relax in our luxurious favorable accommodations with lots of facilities and high-level service.',
      amenities: 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi',
    },
    {
      name: 'Comfort Triple Room',
      Price: '250000',
      imageUrl: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room-920x650.jpg',
      imageUrl2: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room2-920x650.jpg',
      user: '3',
      facility: 'beach',
      size: '40 M',
      description: 'Let yourself fully relax in our luxurious favorable accommodations with lots of facilities and high-level service.',
      amenities: 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi',
    },
    {
      name: 'Standard Single Room',
      Price: '100000',
      imageUrl: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room2-1536x1095.jpg',
      imageUrl2: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg',
      user: '1',
      facility: 'Swiming Pool',
      size: '25 M',
      description: 'Standard Single room is available with either double or single beds. Designed in an open-concept living area.',
      amenities: 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi',
    },
    {
      name: 'Superior Double Room',
      Price: '200000',
      imageUrl: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/superior-double-room2-1536x1094.jpg',
      imageUrl2: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/superior-double-room-920x650.jpg',
      user: '2',
      facility: 'Seaside',
      size: '40 M',
      description: 'Your perfect choice for staying in a big city, where you can come and fully relax after an eventful day.',
      amenities: 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi',
    },
    {
      name: 'Mountain View Suite',
      Price: '250000',
      imageUrl: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/classic-double-room-920x650.jpg',
      imageUrl2: 'https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg',
      user: '4',
      facility: 'beach',
      size: '35 M',
      description: 'Let yourself fully relax in our luxurious favorable accommodations with lots of facilities.',
      amenities: 'Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi',
    },
  ];

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

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-hotel-accent/5"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-hotel-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                  <button
                    onClick={() => handleClick(room)}
                    className="btn-gold px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    View Details
                  </button>
                </div>
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-hotel-primary/90 backdrop-blur-sm text-hotel-accent px-3 py-1.5 rounded-full text-xs font-semibold">
                  Rp {formatPrice(room.Price)}
                  <span className="text-white/50 text-[10px]"> /night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <button onClick={() => handleClick(room)} className="text-left w-full">
                  <h3 className="font-playfair text-lg font-semibold text-hotel-primary mb-3 group-hover:text-hotel-accent transition-colors duration-300">
                    {room.name}
                  </h3>
                </button>

                {/* Features */}
                <div className="flex items-center gap-5 text-hotel-charcoal/50">
                  <div className="flex items-center gap-1.5">
                    <FaUser className="text-xs text-hotel-accent/60" />
                    <span className="text-xs">{room.user} Guests</span>
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
      </div>
    </section>
  );
};

export default RoomsAndSuites;
