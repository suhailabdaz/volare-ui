import React from 'react';
import AddFlight from './AddFlight';
import ViewFlightDetails from './ViewFlightDetails';
import ScheduleBooking from './ScheduleBooking';
import AddRefundPlicy from './AddRefundPolicy';
import AddBackagePolicy from './AddBaggage';
import AddMeal from './AddMeals'


interface LoginModalProps {
  activeModal?: string;
  closeModal: () => any;
  openModal: (modalName: string, schedule?: any | null, fromAirport?: any | null, toAirport?: any | null) => void;
  flightId?:string,
  schedule?:any,
  fromAirport?:any,
  toAirport?:any,
  closeModal2?:()=>any
}


const ModalManager :React.FC<LoginModalProps> =({ activeModal, closeModal, openModal, flightId,schedule,fromAirport,toAirport  }) => {
  if(activeModal==null){
    return null
  }
  return (
    <>
          {activeModal === 'addMeal' && <AddMeal closeModal={closeModal} openModal={openModal}  />}
      {activeModal === 'addFlight' && <AddFlight closeModal={closeModal} openModal={openModal}  />}
      {activeModal === 'addBaggage' && <AddBackagePolicy closeModal={closeModal} openModal={openModal}  />}
      {activeModal === 'addCancelation' && <AddRefundPlicy closeModal={closeModal} openModal={openModal}  />}
      {activeModal === 'viewFlightDetails' && <ViewFlightDetails closeModal={closeModal} openModal={openModal} flightId={flightId||''}  />}
      {activeModal === 'bookSchedule' && <ScheduleBooking closeModal={closeModal} openModal={openModal} schedule={schedule||''} fromAirport={fromAirport} toAirport={toAirport} />}
    </>
  );
};

export default ModalManager;