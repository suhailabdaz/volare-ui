import React from 'react';
import TicketTypes from './TicketTypes';




interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal?: (modalName: string) => any;
  airlineData?:any;
  flightData?:any;
  scheduleData?:any
  fromAirport?:any
  toAirport?:any
  imageURLs?:any
}



const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal,imageURLs,airlineData,flightData,scheduleData,fromAirport,toAirport }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'ticketTypes' &&  <TicketTypes imageURLs={imageURLs} closeModal={closeModal} airlineData={airlineData} flightData={flightData} scheduleData={scheduleData} fromAirport={fromAirport} toAirport={toAirport}  />}
    </>
  );
};

export default ModalManager;  