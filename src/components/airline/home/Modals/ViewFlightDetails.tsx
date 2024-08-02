import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { RootState } from '../../../../redux/store/store';
import { setFlightDetails } from '../../../../redux/slices/airlineSlice';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
  flightId: string;
}

const validationSchema = Yup.object({
  flight_code: Yup.string()
    .matches(/^[A-Za-z0-9]{6,7}$/, 'Code must be 6 to 7 letters')
    .required('Flight code is required'),
  manufacturer: Yup.string().required('Manufacturer is required'),
  economy_seats: Yup.number()
    .min(0, 'Economy seats must be zero or more')
    .required('Economy seats are required'),
  business_seats: Yup.number()
    .min(0, 'Business seats must be zero or more')
    .required('Business seats are required'),
  first_class_seats: Yup.number()
    .min(0, 'First class seats must be zero or more')
    .required('First class seats are required'),
});

const ViewFlightDetails: React.FC<ProfileModalProps> = ({
  closeModal,

  flightId,
}) => {
  const foundFlight = useSelector((state: RootState) => {
    const flights = state.AirlineAuth.fleet;
    if (!flights) return null;
    return flights.find((flight: any) => flight._id === flightId);
  });

  const initialValues = {
    _id: foundFlight?._id,
    flight_code: foundFlight?.flight_code || '',
    business_seats: foundFlight?.business_seats || '',
    economy_seats: foundFlight?.economy_seats || '',
    first_class_seats: foundFlight?.first_class_seats || '',
    manufacturer: foundFlight?.manufacturer || '',
  };

  const dispatch = useDispatch();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await createAxios().post(
        airlineEndpoints.saveFlight,
        values
      );
      if (response.data.success) {
        toast.success('Saved Successfully');
        dispatch(setFlightDetails(response.data.flights));
        closeModal();
      } else {
        toast.error('Error while saving');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (foundFlight?._id) {
      const response = await createAxios().post(
        airlineEndpoints.suspendFlight,
        { id: foundFlight._id }
      );
      if (response.data.success) {
        dispatch(setFlightDetails(response.data.flights));
        toast.success('Flight suspended');
        closeModal();
      } else {
        toast.error('Task Failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-8 bg-white rounded-lg w-[40%] max-h-[85%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg p-[3px]">
          <div className="w-full h-full bg-black rounded-lg"></div>
        </div>
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl text-left font-Durk_bold_italic_1000 font-bold mb-3 text-white">
              Edit Flight Info
            </h2>
            <button
              onClick={handleDelete}
              className="border-2 border-white text-white p-1 font-bold hover:scale-105 transition-all ease-in-out duration-150"
            >
              Suspend
            </button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
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
                    onClick={closeModal}
                    className="px-6 py-2 font-semibold text-black bg-white rounded-lg transition-transform ease-in-out duration-150 hover:scale-101"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform ease-in-out duration-150 "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'SAVE'}
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

export default ViewFlightDetails;
