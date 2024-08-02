import React from 'react';
import ViewUser from './ViewUser';
import AirlineView from './AirlineView';



interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
  userId? : string;
}

const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal,userId }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'viewUser' && <ViewUser closeModal={closeModal} openModal={openModal} userId={userId||''} />}
      {activeModal === 'viewAirline' && <AirlineView closeModal={closeModal} openModal={openModal} airlineId={userId||''} />}
    </>
  );
};

export default ModalManager;