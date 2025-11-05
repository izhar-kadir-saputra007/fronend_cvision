import FallingText from "./reactbits/FallingText";

const Footer = () => {
  return (
    <footer className="footer container mx-auto pt-12 md:pt-20 lg:pt-28 my-12 md:my-24 lg:my-36 px-4 sm:px-6">
      <div className="box grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12 md:pb-16 lg:pb-24 border-b-2 border-secondary">
       {/* Column 1 - Logo & Description */}
<div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4 md:gap-6 lg:gap-8 font-bodoni">
  <h1 className="text-2xl md:text-3xl text-secondary font-bold">
    CV<span className="text-color1">ision</span>
  </h1>
  <p className="text-color3 text-xs sm:text-sm max-w-xs">
    You've reached the end,
    <br /> but it's not the end! <br />
    Remember, you're not alone. <br />Reach out,
    <br /> seek support, <br /> and prioritize your <br />
    mental well-being.
  </p>
</div>

{/* Column 2 - Services */}
<div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4 md:gap-6 lg:gap-8">
  <h1 className="text-2xl md:text-3xl text-secondary font-bold">Service</h1>
  <div className="flex flex-col gap-1 md:gap-2 text-sm">
    <h3 className="text-color3">Physicotherapy</h3>
    <h3 className="text-color3">Physicotherapy</h3>
    <h3 className="text-color3">Physicotherapy</h3>
    <h3 className="text-color3">Physicotherapy</h3>
  </div>
</div>

{/* Column 3 - Contact */}
<div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4 md:gap-6 lg:gap-8">
  <h1 className="text-2xl md:text-3xl text-secondary font-bold">Contact</h1>
  <ul className="flex flex-col space-y-1 md:space-y-2 text-secondary text-sm">
    <li className="flex items-center space-x-2">
      <i className="ri-phone-line text-secondary text-xl md:text-2xl"></i>
      <span className="text-color3">1234567890</span>
    </li>
    <li className="flex items-center space-x-2">
      <i className="ri-mail-line text-secondary text-xl md:text-2xl"></i>
      <span className="text-color3">izhar@gmail.com</span>
    </li>
    <li className="flex items-center space-x-2">
      <i className="ri-instagram-line text-secondary text-xl md:text-2xl"></i>
      <span className="text-color3">Izhar_KadirS</span>
    </li>
    <li className="flex items-center space-x-2">
      <i className="ri-map-pin-line text-secondary text-xl md:text-2xl"></i>
      <span className="text-color3">Sulawesi Tenggara</span>
    </li>
  </ul>
</div>

{/* Column 4 - Links */}
<div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4 md:gap-6 lg:gap-8">
  <h1 className="text-2xl md:text-3xl text-secondary font-bold">Links</h1>
  <div className="flex flex-col gap-1 md:gap-2 text-xs sm:text-sm">
    <h3 className="text-color3">Privacy Policy</h3>
    <h3 className="text-color3">Term of Use</h3>
  </div>
</div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 md:mt-12 lg:mt-16 text-secondary px-4">
        <FallingText
          text={`© 2024 CVision. All rights reserved. Designed by Izhar Kadir Saputra.`}
          highlightWords={["2024", "Izhar", "Kadir", "Saputra", "CVision"]}
          highlightClass="highlighted"
          trigger="hover"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.56}
          fontSize="1rem sm:1.25rem md:1.5rem lg:2rem"
          mouseConstraintStiffness={0.9}
        />
      </div>
    </footer>
  );
};

export default Footer;