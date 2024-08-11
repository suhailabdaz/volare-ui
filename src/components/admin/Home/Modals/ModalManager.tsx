import React from 'react';
import ViewUser from './ViewUser';
import AddCoupon from './AddCoupon';
import AddBanner from './AddBanner';



interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
  userId? : string;
  refetch?:()=>any
}

const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal,userId,refetch }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'viewUser' && <ViewUser closeModal={closeModal} openModal={openModal} userId={userId||''} />}
      {activeModal === 'addBanner' && <AddBanner closeModal={closeModal} openModal={openModal}   refetch={refetch || (() => {})} 
 />}
      {activeModal === 'addCoupon' && <AddCoupon closeModal={closeModal} openModal={openModal}   refetch={refetch || (() => {})} 
  />}

    </>
  );
};

export default ModalManager;