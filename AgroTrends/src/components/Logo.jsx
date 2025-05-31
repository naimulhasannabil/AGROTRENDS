function Logo({ className }) {
  return (
    <img
      src="/public/AgroTrends.svg"
      alt="AgroTrends Logo"
      className={`h-10 w-auto object-contain rounded-3xl ${className || ''}`}
    />
  );
}

export default Logo;
