import React from 'react';
import LoginModal from './LoginModal';
import OtpModal from './OtpModal';


interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
  formData:FormData | null
}


const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal , formData }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'otpModal' && <OtpModal closeModal={closeModal} openModal={openModal} formData={formData || null} />}
    </>
  );
};

export default ModalManager;