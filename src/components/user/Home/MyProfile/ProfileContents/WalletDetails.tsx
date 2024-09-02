import { useState } from 'react';
import WalletInfoButton from '../../../../buttons/WalletInfoButton';
import ModalManager from './EditModals/ModalManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store/store';

function WalletDetails() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const userData = useSelector(
    (state: RootState) => state.ProfileAuth.userData
  );

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div
      className="flex justify-center font-PlusJakartaSans mb-4 "
      id="myWallet"
    >
      <div className="bg-white w-[90%] border-l-4 border-l-gray-400 shadow-custom rounded-2xl">
        <div className="px-10 pt-6 pb-4 ">
          <div className="flex justify-between">
            <h1 className="font-extrabold text-3xl text-black">My Cash</h1>
            <WalletInfoButton openModal={openModal} modalName="AddToWallet" />
          </div>
          <div className="flex justify-between items-center">
            <div className=" w-full py-8 rounded-l-2xl rounded-tr-full ">
            <div className='flex justify-start items-end space-x-8'>
            <h1 className='text-3xl font-PlusJakartaSans1000 '>
                <span className='font-PlusJakartaSans font-bold mr-2'>Rs.</span>{typeof userData?.wallet === 'number' ? userData.wallet : 0}
              </h1>
              <h1 className='text-gray-500 font-PlusJakartaSans font-bold text-2xl'>Wallet Balance</h1>
            </div>
              
            </div>
          </div>
        </div>
      </div>
      <ModalManager
        activeModal={activeModal || ''}
        closeModal={closeModal}
        openModal={openModal}
      />
    </div>
  );
}

export default WalletDetails;
