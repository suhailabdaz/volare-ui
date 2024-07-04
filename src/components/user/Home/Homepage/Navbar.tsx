
import React, { useState } from 'react';
import LoginModal from '../../Authentication/LoginModal';

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-[13%] mt-8 p-6 border-b-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">VOLARE</h1>
        <div className="space-x-4">
          <a href="#" className="text-lg">My Trips</a>
          <a className="text-lg" onClick={handleOpenModal}>Login or create</a>
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default Navbar;
