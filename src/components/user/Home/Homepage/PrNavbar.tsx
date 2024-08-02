import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { Link } from 'react-router-dom';
import ModalManager from '../../Authentication/ModalManager';
import logo from '../../../../assets/images/envato.png'
import suitcase from '../../../../assets/images/luggage_8174282.png'

function Navbar() {
  const useAuth = useSelector((state:RootState)=>state.UserAuth.isAuthenticated)
  let userName
  if(useAuth){
   userName = useSelector((state:RootState)=>state.UserAuth.userData?.name) || null
  }
  const isAuthenticated = useSelector((state: RootState) => state.UserAuth.token);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    
  };

  useEffect(() => {
    console.log("The current modal is", activeModal);
  }, [activeModal]);


  return (
    <div className="  shadow-xl  pt-6 pb-3 bg-transparent ">
      <div className=" mx-[11%] flex justify-between items-center  text-black ">
        
        <Link to='/'>
        <div className='flex items-center p-2 space-x-2 text-slate-600 '>
          <img src={logo} className='h-10' alt="" />
        <h1 className="text-3xl font-extrabold   font-Durk_bold_italic_1000 ">VOLARE</h1>
        </div>
        </Link>
        <div className="space-x-10 text-black flex">
          <div className='flex space-x-1 font-PlusJakartaSans items-center'>
            
            <img src={suitcase}  className='h-10'alt="" />
            <div className='flex-1 items-start'>
            <Link to="/trips"className=' text-sm font-semibold'>
            My Trips
            <p className='text-xs font-light'>Manage bookings</p>
            </Link>
            </div>
          </div>
          {isAuthenticated ? (
            <div className='flex space-x-2 items-center text-center'>
              <div className='w-8 h-8 rounded-full font-PlusJakartaSans font-sm font-bold flex items-center justify-center text-white bg-gradient-to-r from-green-400 to-blue-500 text-center '>{`${userName?.charAt(0).toUpperCase()}${userName?.split(' ')[1]?.charAt(0).toUpperCase() || userName?.charAt(1).toUpperCase()}`}</div>
              <div className='font-PlusJakartaSans text-start'>
              <Link to="/profile"className='text-sm font-semibold'>My Account
                <p className='text-xs font-light'>Manage Account</p>
                </Link>
              </div>
            </div>
          ) : (
            <button className='ml-3 p-3 border-2 border-black font-semibold 'onClick={() => openModal('login')}>Login / Create</button> 
          )}
        </div>
      </div>
       <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} />
    </div>
  );
}

export default Navbar;
