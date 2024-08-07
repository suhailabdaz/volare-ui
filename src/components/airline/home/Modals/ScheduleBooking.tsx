import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'sonner';
import { useGetFlightsQuery,useSubmitScheduleMutation } from '../../../../redux/apis/airlineApiSlice';
import { RootState } from '../../../../redux/store/store';
import SeeFlight from './SeeFlight';
import * as Yup from 'yup';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import bgimage from '../../../../assets/images/Black Purple Background ·①  WallpaperTag.jpeg';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { log } from 'console';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
  schedule: any;
  fromAirport: any;
  toAirport: any;
}

interface InitialValues {
  _id: string;
  departure: string;
  arrival: string;
  duration: string;
  from_airport: string;
  from_code: string;
  to_airport: string;
  to_code: string;
  flightId: string;
  economyPrice: string;
  businessPrice: string;
  firstClassPrice: string;
  weekendIncrement: string;
  premiumIncrement: string;
  airlineId:string;
  available:Boolean
}

const ScheduleBooking: React.FC<ProfileModalProps> = ({
  closeModal,
  schedule,
  fromAirport,
  toAirport,
}) => {
  const [availableFlights, setAvailableFlights] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [infomodal, setinfomodal] = useState<boolean>(false);

  const airlineId = useSelector(
    (state: RootState) => state.AirlineAuth.airlineData?._id
  );

  const validationSchema = Yup.object({
    flightId: Yup.string().required('Flight is required'),
    economyPrice: Yup.number()
      .required('Economy price is required')
      .positive('Economy price must be a positive number'),
    businessPrice: Yup.number()
      .required('Business price is required')
      .positive('Business price must be a positive number'),
    firstClassPrice: Yup.number()
      .required('First class price is required')
      .positive('First class price must be a positive number'),
    weekendIncrement: Yup.number()
      .required('Weekend increment is required')
      .positive('Weekend increment must be a positive number'),
    premiumIncrement: Yup.number()
      .required('Premium increment is required')
      .positive('Premium increment must be a positive number'),
  });

  const initialValues: InitialValues = {
    _id: schedule?._id || '',
    departure: schedule?.departureTime || '',
    arrival: schedule?.arrivalTime || '',
    duration: schedule?.duration || '',
    from_airport: fromAirport?.airport_name || '',
    from_code: fromAirport?.airport_code || '',
    to_airport: toAirport?.airport_name || '',
    to_code: toAirport?.airport_code || '',
    flightId: selectedFlight || '',
    airlineId:airlineId || '',
    economyPrice: '',
    businessPrice: '',
    firstClassPrice: '',
    weekendIncrement: '',
    premiumIncrement: '',
    available:false
  };

  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetFlightsQuery(airlineId, {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });
  const [submitSchedule] = useSubmitScheduleMutation();

  


  useEffect(() => {
    if (data) {
      setAvailableFlights(data.flights);
    }
  }, [data]);

  const onSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    setSubmitting(true);
    try {
      await submitSchedule(values).unwrap();
      toast.success('Schedule submitted successfully!');
      closeModal();
    } catch (error) {
      toast.error('Failed to submit schedule.');
    }
    setSubmitting(false);
  };

  const handleFlightSelect = (
    flightId: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setSelectedFlight(flightId);
    setFieldValue('flightId', flightId);
    const selectedFlightDetails = availableFlights.find(
      (flight) => flight._id === flightId
    );
    setFlightDetails(selectedFlightDetails || null);
  };

  const closeModaltwo = () => {
    setinfomodal(!infomodal);
  };

  const handleInfo = (flightId: string) => {
    setSelectedFlight(flightId);
    closeModaltwo();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="rounded-lg w-[90vw] h-[90vh] overflow-hidden flex"
        style={{
          backgroundImage: `url(${bgimage})`,
        }}
      >
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4">Schedule Details</h2>
          <div className="text-sm space-y-4">
            <div className="border border-white p-3 space-x-3 text-lg items-center inline-flex">
              {initialValues.from_code}
              <ArrowRightCircleIcon className="h-6" />
              {initialValues.to_code}
            </div>
            <div>
              <span className="font-semibold">From: </span>
              {initialValues.from_airport}
            </div>
            <div>
              <span className="font-extralight">Departure Time: </span>
              {initialValues.departure}
            </div>
            <div>
              <span className="font-semibold">To Airport: </span>
              {initialValues.to_airport}
            </div>
            <div>
              <span className="font-semibold">Arrival Time: </span>
              {initialValues.arrival}
            </div>
            <div>
              <span className="font-semibold">Duration: </span>
              {initialValues.duration}
            </div>
          </div>
        </div>
        <div className="w-1/2 p-8 bg-black overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4">Available Flights</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue, handleSubmit }) => (
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="grid grid-cols-3 gap-4 max-h-80 mr-16">
                  {availableFlights.map((flight) => (
                    <div
                      key={flight._id}
                      className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:border-white"
                    >
                      <Field
                        type="radio"
                        id={flight._id}
                        name="flightId"
                        value={flight._id}
                        onChange={() =>
                          handleFlightSelect(flight._id, setFieldValue)
                        }
                        className="form-radio text-white focus:outline-none"
                      />
                      <label htmlFor={flight._id} className="text-lg">
                        {flight.flight_code}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleInfo(flight._id)}
                        className="text-white"
                      >
                        <InformationCircleIcon className="h-8 font-serif" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 space-y-4 text-black">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Field
                        type="number"
                        id="economyPrice"
                        name="economyPrice"
                        placeholder="Economy Price"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <ErrorMessage
                        name="economyPrice"
                        component="div"
                        className="text-red-500 font-PlusJakartaSans text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Field
                        type="number"
                        id="businessPrice"
                        name="businessPrice"
                        placeholder="Business Class Price"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <ErrorMessage
                        name="businessPrice"
                        component="div"
                        className="text-red-500 font-PlusJakartaSans text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Field
                        type="number"
                        id="firstClassPrice"
                        name="firstClassPrice"
                        placeholder="First Class Price"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <ErrorMessage
                        name="firstClassPrice"
                        component="div"
                        className="text-red-500 font-PlusJakartaSans text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Field
                        type="number"
                        id="weekendIncrement"
                        name="weekendIncrement"
                        placeholder="Weekend Increment"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <ErrorMessage
                        name="weekendIncrement"
                        component="div"
                        className="text-red-500 font-PlusJakartaSans text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Field
                      type="number"
                      id="premiumIncrement"
                      name="premiumIncrement"
                      placeholder="Premium Increment"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <ErrorMessage
                      name="premiumIncrement"
                      component="div"
                      className="text-red-500 font-PlusJakartaSans text-sm"
                      />
                  </div>
                </div>
                <div className="flex justify-end space-x-5 mt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r p-3 from-pink-500 via-purple-500 to-blue-500 text-white rounded "
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      {infomodal && (
        <SeeFlight flightId={selectedFlight} closeModal2={closeModaltwo} />
      )}
    </div>
  );
};

export default ScheduleBooking;
