function Logo({ className }) {
  return (
    <img
      src="/AgroTrends.svg"
      alt="AgroTrends Logo"
      className={`h-10 w-auto object-contain rounded-3xl ${className || ''}`}
    />
  );
}

export default Logo;
