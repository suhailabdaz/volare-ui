import React from 'react'
import { PencilIcon } from '@heroicons/react/24/outline'


interface EditButtonProps {
  openModal: (modalName :string) => any
  modalName:string
}


const EditButton: React.FC<EditButtonProps> = ({openModal,modalName}) => {
  return (
    <>
    <div className='border-2 border-gray-400 flex font-PlusJakartaSans font-extrabold text-sm text-blue-500 rounded-md'>
      <button onClick={()=>openModal(modalName)}>
    <div className='p-2 flex justify-center items-center'>
    <PencilIcon className=' w-4 h-4 mr-1'/>
        <h1>EDIT</h1>
    </div>
    </button>
    </div>
    </>
  )
}

export default EditButton