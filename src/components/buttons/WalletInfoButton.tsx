import React from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'


interface EditButtonProps {
  openModal: (modalName :string) => any
  modalName:string
}


const WalletInfoButton: React.FC<EditButtonProps> = ({openModal,modalName}) => {
  return (
    <>
    <div className='flex font-PlusJakartaSans font-extrabold text-sm text-blue-500 rounded-md'>
      <button onClick={()=>openModal(modalName)}>
    <div className='p-2 flex justify-center items-center'>
    <InformationCircleIcon className=' w-4 h-4 mr-1'/>
        <h1>What is my cash ?</h1>
    </div>
    </button>
    </div>
    </>
  )
}

export default WalletInfoButton