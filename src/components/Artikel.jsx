import artikel1 from "../assets/images/artikel1.png";
import artikel2 from "../assets/images/artikel2.png";
import artikel3 from "../assets/images/artikel3.png";
import artikel4 from "../assets/images/artikel4.png";

const Artikel = () => {
  return (
    <>
    <div className="box grid grid-rows-2 text-color1 border-b-2 border-color1 mt-64 mb-24">
          <h1 className="font-bold text-4xl">All Post</h1>
        </div>
     <div className="grid grid-rows-3 gap-20">
          <div className="box flex flex-row gap-10 hover:shadow-custom3 hover:scale-105 transition-all hover:m-2 hover:rounded-lg hover:border-secondary hover:border-2">
            <img src={artikel1} alt="artikel image" className="h-[200px]" />
            <div className="flex flex-col gap-5 justify-center pb-16">
              <h3 className="text-secondary font-semibold text-2xl">Startup</h3>
              <h1 className="font-bold text-5xl text-color3">
                Design tips for designers that cover everything you need
              </h1>
              <p className="text-color2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </div>
          </div>
          <div className="box flex flex-row gap-10 hover:shadow-custom3 hover:scale-105 transition-all hover:m-2 hover:rounded-lg hover:border-secondary hover:border-2">
            <img src={artikel2} alt="artikel image" className="h-[200px]" />
            <div className="flex flex-col gap-5 justify-center pb-16">
              <h3 className="text-secondary font-semibold text-2xl">Startup</h3>
              <h1 className="font-bold text-5xl text-color3">
                Design tips for designers that cover everything you need
              </h1>
              <p className="text-color2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </div>
          </div>
          <div className="box flex flex-row gap-10 hover:shadow-custom3 hover:scale-105 transition-all hover:m-2 hover:rounded-lg hover:border-secondary hover:border-2">
            <img src={artikel3} alt="artikel image" className="h-[200px]" />
            <div className="flex flex-col gap-5 justify-center pb-16">
              <h3 className="text-secondary font-semibold text-2xl">Startup</h3>
              <h1 className="font-bold text-5xl text-color3">
                Design tips for designers that cover everything you need
              </h1>
              <p className="text-color2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </div>
          </div>
          <div className="box flex flex-row gap-10 hover:shadow-custom3 hover:scale-105 transition-all hover:m-2 hover:rounded-lg hover:border-secondary hover:border-2">
            <img src={artikel4} alt="artikel image" className="h-[200px]" />
            <div className="flex flex-col gap-5 justify-center pb-16">
              <h3 className="text-secondary font-semibold text-2xl">Startup</h3>
              <h1 className="font-bold text-5xl text-color3">
                Design tips for designers that cover everything you need
              </h1>
              <p className="text-color2">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </div>
          </div>
        </div>
    </>
  )
}

export default Artikel