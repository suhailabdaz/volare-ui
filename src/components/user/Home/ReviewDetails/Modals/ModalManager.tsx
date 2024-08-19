import React from 'react';
import TravellerModal from './TravellersModal';
import ViewTraveller from './ViewTraveller';

interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
  travellerId? : string;
}

const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal,travellerId }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'addTraveller' && <TravellerModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'editTraveller' && <ViewTraveller closeModal={closeModal} openModal={openModal} travellerId={travellerId||""} />}

    </>
  );
};

export default ModalManager;