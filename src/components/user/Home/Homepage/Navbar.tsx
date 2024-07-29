import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { Link } from 'react-router-dom';
import ModalManager from '../../Authentication/ModalManager';

function Navbar() {
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
    <div className="mx-[11%] pt-6 pb-3 bg-transparent font-PlusJakartaSans">
      <div className="flex justify-between items-center  text-white ">
        
        <Link to='/'>
        <h1 className="text-3xl font-extrabold p-2 border-2 border-white ">VOLARE</h1>
        </Link>
        <div className="space-x-4 text-white">
          <Link to='/authority ' className='mx-3 text-sm px-3'>Authority</Link> |
          <Link to='/admin'className='mx-3 text-sm px-3'>Admin</Link> |
          <Link to='/airline'className='mx-3 text-sm px-3'>Airline</Link> |
          {/* <a href="#" className='mx-3 text-sm'>My Trips</a> | */}
          {isAuthenticated ? (
            
            <Link to="/profile"className='ml-3 p-3 border-2 border-white font-semibold'>My Account</Link>
          ) : (
            <button className='ml-3 p-3 border-2 border-white font-semibold 'onClick={() => openModal('login')}>Login / Create</button> 
          )}
        </div>
      </div>
       <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} />
    </div>
  );
}

export default Navbar;
