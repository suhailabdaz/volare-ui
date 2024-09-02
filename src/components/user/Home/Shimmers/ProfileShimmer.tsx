import flight from '../../../../assets/images/fliIcon.png';
import line1 from '../../../../assets/images/strip (1).png';
import line2 from '../../../../assets/images/strip.png';

function profileShimmer() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative w-[50%] h-[50%] bg-white p-10 flex flex-col items-center justify-center shadow-custom rounded-xl overflow-hidden">
        <div className="flex justify-center items-center mb-8">
          <div className="w-32 h-12 space-y-6 overflow-hidden">
            <div className="animate-scroll-left">
              <img src={line1} alt="Line 1" className="w-48 h-1" />
            </div>
            <div className="animate-scroll-right">
              <img src={line2} alt="Line 2" className="w-48 h-1" />
            </div>
          </div>
          <img 
            src={flight} 
            alt="Flight" 
            className="w-44 mx-4"
          />
        </div>
        <p className="text-center text-xl  text-black font-PlusJakartaSans1000">
          
        </p>
      </div>
    </div>
  );
}

export default profileShimmer;