import React from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'

interface AddButtonProps {
  handleDelete: () => any
}

const DeleteButton: React.FC<AddButtonProps> = ({handleDelete}) =>{
  return (
    <button onClick={() => handleDelete()}>
    <div className='flex text-red-500 font-PlusJakartaSans font-bold text-sm items-center'>
        <TrashIcon className='w-6 h-6 m-1'/>
        <span>Delete</span>
    </div>
    </button>
  )
}

export default DeleteButton