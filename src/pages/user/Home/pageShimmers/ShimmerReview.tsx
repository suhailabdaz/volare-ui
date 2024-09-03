import PrNavbar from '../../../../components/user/Home/Homepage/PrNavbar';
import Image from '../../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg';

function ShimmerReview() {
  return (
    <div className="bg-[#f9f1fe] min-h-screen font-PlusJakartaSans">
      <PrNavbar />
      <div className="relative">
        <div className="">
          <img
            src={Image}
            className="w-full h-[40vh] absolute z-0 opacity-95 "
            alt="Background"
          />
        </div>
        <div className="relative z-10 ">
          <div className="flex justify-between mx-[11%] pt-8 text-white">
           
          </div>
          <div className="flex justify-between pb-48 mx-[11%] mt-8">
            <div className="w-3/4 pr-4 space-y-4">
              <div
                className="bg-white animate-pulse rounded w-[99%] flex flex-col items-center justify-center h-[150px] shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5  "
                id="flight_details"
              >
                <div className="w-full  items-center justify-center p-4">
                  <div className="my-6 w-full    mb-4 h-5 animate-pulse bg-gray-200"></div>
                  <div className="my-6 w-full    mb-4 h-5 animate-pulse bg-gray-200"></div>
                </div>
              </div>
              <div
                className="bg-white rounded w-[99%] shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5 animate-pulse  h-[150px]"
                id="important_info"
              >
                <h1 className="font-PlusJakartaSans1000 text-xl h-6 w-1/3 animate-pulse bg-gray-200"></h1>
                <div className="my-4 space-y-2 pr-3 py-2">
                  <div className="bg-gray-200 h-4 w-full animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full animate-pulse"></div>
                </div>
              </div>
              <div
                className="bg-white rounded w-[99%] shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5 animate-pulse  h-[150px]"
                id="traveller_details"
              >
                <h1 className="font-PlusJakartaSans1000 text-xl h-6 w-1/3 animate-pulse bg-gray-200"></h1>
                <div className="my-4 space-y-2 pr-3 py-2">
                  <div className="bg-gray-200 h-4 w-full animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="w-1/4 sticky top-12 h-full">
              <div className="bg-white mb-3 space-y-4 rounded w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5 animate-pulse h-[200px]">
                <div className="bg-gray-200 h-6 w-2/3 animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-2/3 animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShimmerReview;
