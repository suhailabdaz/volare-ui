import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import { RootState } from '../../../../redux/store/store';
import { useGetFlightsQuery } from '../../../../redux/apis/airlineApiSlice';

interface ProfileModalProps {
  closeModal2: () => any;
  flightId: string;
}

const SeeFlight: React.FC<ProfileModalProps> = ({
  closeModal2,
  flightId,
}) => {
  const airlineId = useSelector((state: RootState) => state.AirlineAuth.airlineData?._id);
  
  const [foundFlight, setFoundFlight] = useState<any>(null);
  const [formValues, setFormValues] = useState({
    _id: '',
    flight_code: '',
    business_seats: '',
    economy_seats: '',
    first_class_seats: '',
    manufacturer: '',
  });

  const { data, isLoading, error } = useGetFlightsQuery(airlineId, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data && data.flights) {
      console.log('propid', flightId);
      const flight = data.flights.find((flight: any) => flight._id === flightId);
      console.log('Found flight:', flight);
      setFoundFlight(flight || null);
    }
  }, [data, flightId]);

  useEffect(() => {
    if (foundFlight) {
      setFormValues({
        _id: foundFlight._id || '',
        flight_code: foundFlight.flight_code || '',
        business_seats: foundFlight.business_seats || '',
        economy_seats: foundFlight.economy_seats || '',
        first_class_seats: foundFlight.first_class_seats || '',
        manufacturer: foundFlight.manufacturer || '',
      });
    }
  }, [foundFlight]);

  const onSubmit = async () => {
    // Your submit logic here (if needed)
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading flight data</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-8 bg-white rounded-lg w-[40%] max-h-[85%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg p-[3px]">
          <div className="w-full h-full bg-black rounded-lg"></div>
        </div>
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl text-left font-Durk_bold_italic_1000 font-bold mb-3 text-white">
              Flight Info
            </h2>
          </div>
          <Formik
            initialValues={formValues}
            enableReinitialize={true}
            onSubmit={onSubmit}
          >
            {({ }) => (
              <Form className="overflow-y-auto max-h-[70vh] px-2 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="flight_code"
                      className="mb-1 text-sm font-semibold text-white"
                    >
                      Flight Code <span className="text-red-900">*</span>
                    </label>
                    <Field
                      type="text"
                      name="flight_code"
                      id="flight_code"
                      className="p-3 border border-gray-500 rounded-lg"
                      readOnly
                    />
                    <ErrorMessage
                      name="flight_code"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="manufacturer"
                      className="mb-1 text-sm font-semibold text-white"
                    >
                      Manufacturer <span className="text-red-900">*</span>
                    </label>
                    <Field
                      type="text"
                      name="manufacturer"
                      id="manufacturer"
                      className="p-3 border border-gray-500 rounded-lg"
                      readOnly
                    />
                    <ErrorMessage
                      name="manufacturer"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="economy_seats"
                      className="mb-1 text-sm font-semibold text-white"
                    >
                      Economy Seats <span className="text-red-900">*</span>
                    </label>
                    <Field
                      type="number"
                      name="economy_seats"
                      id="economy_seats"
                      className="p-3 border border-gray-500 rounded-lg"
                      readOnly
                    />
                    <ErrorMessage
                      name="economy_seats"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="business_seats"
                      className="mb-1 text-sm font-semibold text-white"
                    >
                      Business Seats <span className="text-red-900">*</span>
                    </label>
                    <Field
                      type="number"
                      name="business_seats"
                      id="business_seats"
                      className="p-3 border border-gray-500 rounded-lg"
                      readOnly
                    />
                    <ErrorMessage
                      name="business_seats"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="first_class_seats"
                      className="mb-1 text-sm font-semibold text-white"
                    >
                      First Class Seats <span className="text-red-900">*</span>
                    </label>
                    <Field
                      type="number"
                      name="first_class_seats"
                      id="first_class_seats"
                      className="p-3 border border-gray-500 rounded-lg"
                      readOnly
                    />
                    <ErrorMessage
                      name="first_class_seats"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={closeModal2}
                    className="px-6 py-2 font-semibold text-black bg-white rounded-lg transition-transform ease-in-out duration-150 hover:scale-101"
                  >
                    CANCEL
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SeeFlight;