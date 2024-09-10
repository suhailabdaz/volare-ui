

function AirlineSimmer() {

  return (
    <div
      className="flex mx-[11%]  justify-center font-Durk_bold_italic_1000 my-7 bg-transparent text-white "
      id="myTravellers"
    >
      <div className=" w-[100%] shadow-custom border-2 border-white">
        <div className="px-10 py-6">
          <div className="flex justify-between">
            <div>
              <h1 className="font-extrabold text-3xl animate-pulse"></h1>
            </div>
          </div>
          <div className=" mt-8  text-gray-600 text-xs">
            <ul className="space-y-6">
              {Array(5).map(( index: any) => (
                <li key={index} className="mb-4 group">
                  <div className="relative flex items-center  text-white">
                    <div className="font-bold  mx-4 text-xl">{index + 1}. </div>
                    <div
                      className={`border-2 p-1 border-white animate-pulse  flex items-center text-lg justify-center text-white font-bold bg-transparent`}
                    >
                    </div>

                    <div className="ml-28 flex-1">
                      <div className="font-bold text-base animate-pulse ">
                      </div>
                    </div>
                    {/* Add a wrapper div with fixed width for consistent alignment */}
                    <div className="absolute right-8 flex items-start space-x-2 transition-all duration-300 delay-200">
                      <div className=" text-base mr-36 font-semibold animate-pulse">
                      </div>
                      <div className="text-base mr-36 font-semibold animate-pulse">
                      </div>{' '}
                     
                    </div>
                  </div>
                  <hr className="border-gray-300 mt-2" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default AirlineSimmer;
