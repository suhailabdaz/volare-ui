import medal from '../../../../assets/images/medal.png';
import plane from '../../../../assets/images/plane (2).png';
import coupons from '../../../../assets/images/coupons.png';



function About() {
  return (
    <div className="mx-[13%] my-16 rounded font-PlusJakartaSans font-bold text-gray-500 ">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
        <div className="shadow-[0_0_10px_rgba(0,0,0,0.2)] bg-white rounded-lg px-3 py-5 text-sm flex max-w-[33%] items-center">
          <img src={medal} className="h-16 flex-shrink-0 " alt="" />
          <p className="ml-4 pl-1 ">
            We are India’s No. 1 flight booking app, seamless booking, and
            exceptional customer service.
          </p>
        </div>

        <div className="shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg bg-white px-3 py-5  text-sm flex max-w-[33%] items-center">
          <img src={plane} className="h-12 flex-shrink-0 " alt="" />
          <p className="ml-4 pl-1 ">
          Our platform offers seamless airline search, hassle-free flight options with easy booking, and convenience.
          </p>
        </div>
        <div className="shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-lg bg-white px-3 py-5 text-sm flex max-w-[33%] items-center">
          <img src={coupons} className="h-16  flex-shrink-0" alt="" />
          <p className="ml-4 pl-1 ">
          Unlock amazing deals with our exclusive offers and coupons! Save big !
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
