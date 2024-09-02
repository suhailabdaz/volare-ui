import React from 'react';
import ProfileModal from './ProfileEditModal';
import PasswordModal from './PasswordEdit';
import AddMobileModal from './AddMobileModal';
import TravellerModal from './TravellersModal';
import ViewTraveller from './ViewTraveller';
import WalletInfo from './WalletInfoModal';

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
      {activeModal === 'profileEdit' && <ProfileModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'passwordEdit' && <PasswordModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'addMobile' && <AddMobileModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'traveller' && <TravellerModal closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'AddToWallet' && <WalletInfo closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'viewTraveller' && <ViewTraveller closeModal={closeModal} openModal={openModal} travellerId={travellerId||""} />}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default ModalManager;