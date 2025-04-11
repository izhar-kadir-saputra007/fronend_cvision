import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import About from "../components/About";

import heroAbout from "../assets/images/heroAbout.png";

const AboutPage = () => {
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-20 pt-60">
        <div className="box grid grid-rows-2 gap-4 text-secondary border-l-4 border-secondary px-20 py-24">
          <h1 className="font-bold text-6xl">About</h1>
          <p className="text-lg">
            Our website offers a range of services to support your well-being,
            including online therapy sessions with licensed professionals,
            community forums for peer support, and personalized mental health
            assessments.
          </p>
        </div>
        <About />
        <div className="box hero grid grid-cols-2 items-center mt-52">
          <div className="flex flex-col gap-2 mr-20">
            <img
              src={heroAbout}
              alt="hero iamge"
              className="md:w-[550px] w-[450px] mx-auto"
            />
          </div>
          <div className="box flex flex-col gap-10 leading-relaxed">
            <h1 className="text-color1 lg:text-8xl text-3xl font-bold mb-5 text-center ">
              Mind Mates
            </h1>
            <p className="text-color3 tracking-widest lg:text-3xl text-2xl mb-10">
              Our mental health counselors are highly qualified professionals
              with extensive experience in their fields, providing expert
              support and guidance tailored to individual needs. Trust in their
              expertise to navigate and address your mental health concerns
              effectively.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
