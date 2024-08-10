import React from 'react';
import FromAirportSearch from './FromAirportSearch';
import TravAndClass from './TravAndClass';
import ToAirportSearch from './ToAirportSearch';



interface ModalProps {
  activeModal: string;
  closeModal: () => any;
}

const ModalManager :React.FC<ModalProps> =({ activeModal, closeModal}) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'ToAirportSearch' && <ToAirportSearch closeModal={closeModal}  />}
      {activeModal === 'FromAirportSearch' && <FromAirportSearch closeModal={closeModal}    />}
      {activeModal === 'TravAndClass' && <TravAndClass closeModal={closeModal}   />}
    </>
  );
};

export default ModalManager; 