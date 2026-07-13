const AppLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" fill="#1DB954" />
    <path
      d="M8 16V8.5L16 7V14.5"
      stroke="black"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="16.5" r="1.8" fill="black" />
    <circle cx="15" cy="15" r="1.8" fill="black" />
  </svg>
);

export default AppLogo;