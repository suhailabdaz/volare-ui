import React from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

interface AddButtonProps {
  openModal: (modalName :string) => any
  modalName:string
}

const AddMobileButton: React.FC<AddButtonProps> = ({openModal,modalName}) =>{
  return (
    <button onClick={() => openModal(modalName)}>
    <div className='flex text-blue-500 font-PlusJakartaSans font-bold text-sm items-center'>
        <PlusIcon className='w-4 h-4'/>
        <span>Add your mobile number</span>
    </div>
    </button>
  )
}

export default AddMobileButton