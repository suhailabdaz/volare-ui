import React from 'react';
import AddAirport from './AddAirport';
import ViewAirport from './ViewAirport';
import ScheduleAdd from './ScheduleAdd';

interface AirportOption {
  value: string;
  label: string;
}

interface LoginModalProps {
  activeModal: string;
  closeModal: () => any;
  openModal: (modalName: string) => any;
  airportId? : string;
  toAirport?: AirportOption | null;
  fromAirport?:AirportOption | null;
  from?:string,
  to?:string
}



const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal,airportId,toAirport,fromAirport,from,to }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
      {activeModal === 'addAirport' &&  <AddAirport closeModal={closeModal} openModal={openModal} />}
      {activeModal === 'viewAirport' && <ViewAirport closeModal={closeModal} openModal={openModal} airportId={airportId||''} />}
      {activeModal === 'scheduleAdd' && <ScheduleAdd closeModal={closeModal} openModal={openModal} 
        fromAirport={fromAirport ||null } toAirport={toAirport || null} from={from ||''} to={to ||''}/>}
    </>
  );
};

export default ModalManager;