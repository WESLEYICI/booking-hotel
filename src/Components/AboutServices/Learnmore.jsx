import './Services.css';
const Learn = () => {
  return (
    <button className="services-learn-more-btn group flex items-center gap-3 text-white font-semibold text-sm hover:text-hotel-accent transition-colors duration-300">
      <span className="w-10 h-10 rounded-full border-2 border-hotel-accent/30 flex items-center justify-center group-hover:bg-hotel-accent group-hover:border-hotel-accent transition-all duration-300">
        <svg className="w-4 h-4 group-hover:text-hotel-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      Learn More
    </button>
  );
};
export default Learn;
