import React from 'react';
import LoginModal from './LoginModal';
import OtpModal from './OtpModal';
import PasswordModal from './PasswordModal';
import SignupModal from './SignupModal';
import ResetPasswordModal from './ResetPasswordModal';
import ResetOtpModal from './ResetOtpModal';

interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
}


const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'login' && <LoginModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'password' && <PasswordModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'otp' && <OtpModal closeModal={closeModal} openModal={openModal}/>}
      {activeModal === 'signup' && <SignupModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'reset' && <ResetPasswordModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'resetotp' && <ResetOtpModal closeModal={closeModal} openModal={openModal} />}
    </>
  );
};

export default ModalManager;