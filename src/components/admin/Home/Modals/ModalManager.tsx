import React from 'react';
import ViewUser from './ViewUser';



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
    </>
  );
};

export default ModalManager;