import React from 'react'



interface ModalProps {
  closeModal: () => any,
}


const TravAndClass: React.FC<ModalProps> = ({ closeModal }) => {
  return (
    <div>
          <div>TravAndClass</div>
          <button onClick={closeModal}></button>
    </div>

  )
}

export default TravAndClass