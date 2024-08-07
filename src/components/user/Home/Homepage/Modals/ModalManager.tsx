import React from 'react';
import FromAirportSearch from './FromAirportSearch';
import TravAndClass from './TravAndClass';
import ToAirportSearch from './ToAirportSearch';


interface Airport {
  _id: string;
  airport_code: string;
  city: string;
  country:string,
  airport_name: string;

}

interface ModalProps {
  activeModal: string;
  closeModal: () => any;
  setFromAirport: React.Dispatch<React.SetStateAction<Airport | null>>;
  setToAirport: React.Dispatch<React.SetStateAction<Airport | null>>;
}

const ModalManager :React.FC<ModalProps> =({ activeModal, closeModal ,setFromAirport,setToAirport}) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'ToAirportSearch' && <ToAirportSearch closeModal={closeModal}  setToAirport={setToAirport}  />}
      {activeModal === 'FromAirportSearch' && <FromAirportSearch closeModal={closeModal}  setFromAirport={setFromAirport}  />}
      {activeModal === 'TravAndClass' && <TravAndClass closeModal={closeModal}  />}
    </>
  );
};

export default ModalManager; 