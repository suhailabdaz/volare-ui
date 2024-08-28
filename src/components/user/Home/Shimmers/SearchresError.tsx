import { useNavigate } from 'react-router-dom';
import landscape from '../../../../assets/images/sannaata (1).png';

function SearchresShimmer() {

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/')
  };

  return (
    <div className="flex justify-center items-center w-full  font-PlusJakartaSans mb-7" id="profile">
      <div className="bg-white w-full  shadow-custom rounded-xl p-8">
        <div className="flex w-full flex-col items-center space-y-6 text-center">
          <img src={landscape} className="w-40" alt="" />
          <h2 className="font-PlusJakartaSans1000 text-lg">
            Sorry, Flights Not Found.
          </h2>
          <p className="text-black text-md">
            We could not find flights for this search. Please go back to
            make a different selection.
          </p>
          <button onClick={()=>{
            handleGoBack()
          }} className="w-1/6 px-4 py-3 text-white rounded-lg font-PlusJakartaSans1000 font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:scale-105">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchresShimmer;