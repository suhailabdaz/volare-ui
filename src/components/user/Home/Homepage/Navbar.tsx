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
    <div className="mx-[11%] pt-6 pb-3 border-b-2 bg-transparent">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">VOLARE</h1>
        <div className="space-x-4">
          <a href="#" className="text-lg">My Trips</a>
          {isAuthenticated ? (
            <Link to="/profile" className="text-lg">My Account</Link>
          ) : (
            <button className="text-lg" onClick={() => openModal('login')}>Login / Create</button>
          )}
        </div>
      </div>
       <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} />
    </div>
  );
}

export default Navbar;
