import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-hotel-accent/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-hotel-accent animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-hotel-accent-light animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-hotel-charcoal/40 text-sm font-medium tracking-wider">Loading...</p>
    </div>
  );
};

export default Loading;
