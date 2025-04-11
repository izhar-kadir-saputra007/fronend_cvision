const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;
  
    return (
      <div
        className={`text-[#ffe100c2] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
        style={{
          backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 60%)',
          backgroundSize: '200% 100%', // Pastikan ukuran background 200%
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text', // Untuk browser modern
         
          animationDuration: animationDuration,
        }}
      >
        {text}
      </div>
    );
  };
  
  export default ShinyText;