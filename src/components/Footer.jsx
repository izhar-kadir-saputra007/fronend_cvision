import FallingText from "./reactbits/FallingText";

const Footer = () => {
  return (
    <>
      <div className="footer container mx-auto pt-28 my-36  ">
        <div className="box grid grid-flow-col gap-2 justify-between pb-24 border-b-2 border-secondary">
          <div className="flex flex-col gap-8 font-bodoni">
            <h1 className="text-3xl text-secondary font-bold">CV<span className="text-color1">ision</span></h1>
            <h3 className="text-color3 text-[13px]">
              You’ve reached the end,
              <br /> but it’s not the end! <br />
              Remember, you’re not alone. <br />Reach out,
              <br /> seek support, <br /> and prioritize your <br />
              mental well-being.
            </h3>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-3xl text-secondary font-bold">Service</h1>
            <div className="flex flex-col gap-2 text-[15px]">
              <h3 className="text-color3">Physicotherapy</h3>
              <h3 className="text-color3">Physicotherapy</h3>
              <h3 className="text-color3">Physicotherapy</h3>
              <h3 className="text-color3">Physicotherapy</h3>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-3xl text-secondary font-bold">Contact</h1>
            <ul className="flex flex-col space-y-2 text-secondary text-[15px]">
              <li className="flex items-center space-x-2">
                <i className="ri-phone-line text-secondary text-2xl"></i>
                <span className="text-color3">1234567890</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-mail-line text-secondary"></i>
                <span className="text-color3">izhar@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-instagram-line text-secondary text-2xl"></i>
                <span className="text-color3">Izhar_KadirS</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-map-pin-line text-secondary text-2xl"></i>
                <span className="text-color3">Sulawesi Tenggara</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-3xl text-secondary font-bold">Links</h1>
            <div className="flex flex-col gap-2 text-[13px]">
              <h3 className="text-color3">Privacy Policy</h3>
              <h3 className="text-color3">Term of Use</h3>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 text-secondary ">
        <FallingText
  text={`© 2024 CVision. All rights reserved. Designed by Izhar Kadir Saputra.`}
  highlightWords={["2024", "Izhar", "Kadir", "Saputra","CVision"]}
  highlightClass="highlighted"
  trigger="hover"
  backgroundColor="transparent"
  wireframes={false}
  gravity={0.56}
  fontSize="2rem"
  mouseConstraintStiffness={0.9}
/>
          {/* <h1 className="text-3xl text-secondary font-bold">
            © 2024 Me-<span className="text-color1">Time</span>.{" "}
            <span className="text-color3">
              All rights reserved. Designed by
            </span>{" "}
            <span className="text-color1">Izhar Kadir Saputra.</span>
          </h1> */}
        </div>
      </div>
    </>
  );
};

export default Footer;
