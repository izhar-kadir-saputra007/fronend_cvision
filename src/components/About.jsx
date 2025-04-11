import AboutImage from "../assets/images/testimoni3.png";
import TrueFocus from "../components/reactbits/TrueFocus";

const About = () => {
  return (
    <>
      <div className="about">
        <div className="box text-center grid grid-flow-row gap-10 text-4xl mb-20 mt-48">
       
          <TrueFocus 
sentence="Our Tim"
manualMode={false}
blurAmount={5}
borderColor="#00C3FE"
animationDuration={2}
pauseBetweenAnimations={1}
fontColor="#FFE100"
/>

          <h1 className="text-4xl text-color2 ">
            Manage your entire community in a single system
          </h1>
          <small className="text-[#9E9E9E] mb-36">
            Manage your entire community in a single system
          </small>
        </div>

        {/* card */}
        <div className="grid grid-cols-3 gap-20 m-auto">
          <div className="grid grid-flow-row-dense bg-color3 p-10 rounded-[30px] border hover:shadow-custom5 hover:scale-105 transition-all h-full">
            <div className="flex flex-col justify-between jush-full ">
              <div className="grid grid-flow-row gap-9">
                <div className=" relative flex flex-col justify-center items-center">
                  <img
                    className="w-[110px] object-cover mb-4 rounded-full absolute -top-25 left-44 z-20"
                    alt="Ellipse"
                    src={AboutImage}
                  />
                </div>
                <h3 className=" mt-24 text-center font-normal text-primary text-3xl mb-4">
                  Your Well Wisher
                </h3>
                <p className="text-color2 text-xl text-center mb-8">
                  Simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry standard dummy text ever
                  since the 1500s.
                </p>
                <div className="flex flex-col items-center mt-auto">
                  <a
                    href="https://www.instagram.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="px-20 py-3 bg-primary text-lg font-bold text-color3 flex items-center justify-center rounded-[30px] shadow-md"
                  >
                    Start Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-flow-row-dense bg-color3 p-10 rounded-[30px] border hover:shadow-custom5 hover:scale-105 transition-all h-full">
            <div className="flex flex-col justify-between jush-full ">
              <div className="grid grid-flow-row gap-9">
                <div className=" relative flex flex-col justify-center items-center">
                  <img
                    className="w-[110px] object-cover mb-4 rounded-full absolute -top-25 left-44 z-20"
                    alt="Ellipse"
                    src={AboutImage}
                  />
                </div>
                <h3 className=" mt-24 text-center font-normal text-primary text-3xl mb-4">
                  Your Well Wisher
                </h3>
                <p className="text-color2 text-xl text-center mb-8">
                  Simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry standard dummy text ever
                  since the 1500s.
                </p>
                <div className="flex flex-col items-center mt-auto">
                  <a
                    href="https://www.instagram.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="px-20 py-3 bg-primary text-lg font-bold text-color3 flex items-center justify-center rounded-[30px] shadow-md"
                  >
                    Start Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-flow-row-dense bg-color3 p-10 rounded-[30px] border hover:shadow-custom5 hover:scale-105 transition-all h-full">
            <div className="flex flex-col justify-between jush-full ">
              <div className="grid grid-flow-row gap-9">
                <div className=" relative flex flex-col justify-center items-center">
                  <img
                    className="w-[110px] object-cover mb-4 rounded-full absolute -top-25 left-44 z-20"
                    alt="Ellipse"
                    src={AboutImage}
                  />
                </div>
                <h3 className=" mt-24 text-center font-normal text-primary text-3xl mb-4">
                  Your Well Wisher
                </h3>
                <p className="text-color2 text-xl text-center mb-8">
                  Simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry standard dummy text ever
                  since the 1500s.
                </p>
                <div className="flex flex-col items-center mt-auto">
                  <a
                    href="https://www.instagram.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="px-20 py-3 bg-primary text-lg font-bold text-color3 flex items-center justify-center rounded-[30px] shadow-md"
                  >
                    Start Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
