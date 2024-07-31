import React from 'react';
import AddFlight from './AddFlight';
import ViewFlightDetails from './ViewFlightDetails';

interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
  flightId?:string
}


const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal, flightId  }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'addFlight' && <AddFlight closeModal={closeModal} openModal={openModal}  />}
      {activeModal === 'viewFlightDetails' && <ViewFlightDetails closeModal={closeModal} openModal={openModal} flightId={flightId||''}  />}
    </>
  );
};

export default ModalManager;