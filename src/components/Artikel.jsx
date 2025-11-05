import artikel1 from "../assets/images/artikel1.png";
import artikel2 from "../assets/images/artikel2.png";
import artikel3 from "../assets/images/artikel3.png";
import artikel4 from "../assets/images/artikel4.png";

const Artikel = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="box border-b-2 border-color1 mt-16 md:mt-32 lg:mt-64 mb-12 md:mb-20 lg:mb-24">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-color1">All Post</h1>
      </div>
      
      {/* Artikel List */}
      <div className="grid gap-10 sm:gap-14 lg:gap-20">
        {/* Artikel 1 */}
        <div className="box flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 hover:shadow-custom3 hover:scale-[1.02] transition-all hover:rounded-lg hover:border-secondary hover:border-2 p-2">
          <img 
            src={artikel1} 
            alt="artikel image" 
            className="w-full sm:w-1/3 md:w-1/4 h-auto sm:h-[150px] md:h-[180px] lg:h-[200px] object-cover rounded-lg" 
          />
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center pb-4 sm:pb-8 md:pb-12 lg:pb-16">
            <h3 className="text-secondary font-semibold text-lg sm:text-xl lg:text-2xl">Startup</h3>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-color3">
              Design tips for designers that cover everything you need
            </h1>
            <p className="text-color2 text-sm sm:text-base md:text-lg">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident.
            </p>
          </div>
        </div>

        {/* Artikel 2 */}
        <div className="box flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 hover:shadow-custom3 hover:scale-[1.02] transition-all hover:rounded-lg hover:border-secondary hover:border-2 p-2">
          <img 
            src={artikel2} 
            alt="artikel image" 
            className="w-full sm:w-1/3 md:w-1/4 h-auto sm:h-[150px] md:h-[180px] lg:h-[200px] object-cover rounded-lg" 
          />
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center pb-4 sm:pb-8 md:pb-12 lg:pb-16">
            <h3 className="text-secondary font-semibold text-lg sm:text-xl lg:text-2xl">Startup</h3>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-color3">
              Design tips for designers that cover everything you need
            </h1>
            <p className="text-color2 text-sm sm:text-base md:text-lg">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident.
            </p>
          </div>
        </div>

        {/* Artikel 3 */}
        <div className="box flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 hover:shadow-custom3 hover:scale-[1.02] transition-all hover:rounded-lg hover:border-secondary hover:border-2 p-2">
          <img 
            src={artikel3} 
            alt="artikel image" 
            className="w-full sm:w-1/3 md:w-1/4 h-auto sm:h-[150px] md:h-[180px] lg:h-[200px] object-cover rounded-lg" 
          />
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center pb-4 sm:pb-8 md:pb-12 lg:pb-16">
            <h3 className="text-secondary font-semibold text-lg sm:text-xl lg:text-2xl">Startup</h3>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-color3">
              Design tips for designers that cover everything you need
            </h1>
            <p className="text-color2 text-sm sm:text-base md:text-lg">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident.
            </p>
          </div>
        </div>

        {/* Artikel 4 */}
        <div className="box flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 hover:shadow-custom3 hover:scale-[1.02] transition-all hover:rounded-lg hover:border-secondary hover:border-2 p-2">
          <img 
            src={artikel4} 
            alt="artikel image" 
            className="w-full sm:w-1/3 md:w-1/4 h-auto sm:h-[150px] md:h-[180px] lg:h-[200px] object-cover rounded-lg" 
          />
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center pb-4 sm:pb-8 md:pb-12 lg:pb-16">
            <h3 className="text-secondary font-semibold text-lg sm:text-xl lg:text-2xl">Startup</h3>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-color3">
              Design tips for designers that cover everything you need
            </h1>
            <p className="text-color2 text-sm sm:text-base md:text-lg">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Artikel;