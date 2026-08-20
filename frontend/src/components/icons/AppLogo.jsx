const AppLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="musifyGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" /> 
        <stop offset="1" stopColor="#EC4899" /> 
      </linearGradient>
    </defs>

    <path 
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" 
      fill="url(#musifyGradient)"
    />
    
    <path 
      d="M7 15.5L7 10L12 14.5L17 10L17 15.5" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default AppLogo;