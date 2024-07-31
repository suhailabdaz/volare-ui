import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AirlineAxios';
import { RootState } from '../../../../redux/store/store';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { setFlightDetails } from '../../../../redux/slices/airlineSlice';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
}

const validationSchema = Yup.object({
  flight_code: Yup.string()
    .matches(/^[A-Za-z0-9]{6,7}$/, "Code must be 6 to 7 letters")
    .required("Flight code is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
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

const AddFlight: React.FC<ProfileModalProps> = ({ closeModal, openModal }) => {
  const airlineData = useSelector(
    (state: RootState) => state.AirlineAuth.airlineData
  );
  const airlineCode = airlineData?.airline_code;
  const airlineId = airlineData?._id;


  const initialValues = {
    airline_id:airlineId,
    flight_code: airlineCode,
    manufacturer: '',
    economy_seats: '',
    business_seats: '',
    first_class_seats: '',
  };

  const dispatch = useDispatch();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await createAxios().post(
        airlineEndpoints.addFlight,
        values
      );
      if (response.data.success) {
        toast.success('Saved Successfully');
        dispatch(setFlightDetails(response.data.flight));
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

  return (
    <div className="fixed inset-0 flex items-center justify-center text-white font-Durk_bold_italic_1000 bg-black bg-opacity-50">
      <div className="relative p-8 bg-black rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg p-[3px]">
          <div className="w-full h-full bg-black rounded-lg"></div>
        </div>
        <div className="relative">
          <div className="flex justify-end">
            <button onClick={() => closeModal()}>
              <XMarkIcon className="h-8 w-8 text-white hover:text-gray-400" />
            </button>
          </div>
          <h2 className="text-2xl mb-3 text-left font-bold">Add Flight Info</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Flight Code */}
                    <div className="flex flex-col">
                      <label htmlFor="flight_code" className="mb-1 text-sm font-semibold">
                        Flight Code <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="flight_code"
                        id="flight_code"
                        className="p-3 border border-gray-500 rounded-lg text-black"
                      />
                      <ErrorMessage
                        name="flight_code"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
              
                    {/* Manufacturer */}
                    <div className="flex flex-col">
                      <label htmlFor="manufacturer" className="mb-1 text-sm font-semibold">
                        Manufacturer <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="manufacturer"
                        id="manufacturer"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="manufacturer"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
              
                    {/* Economy Seats */}
                    <div className="flex flex-col">
                      <label htmlFor="economy_seats" className="mb-1 text-sm font-semibold">
                        Economy Seats <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="economy_seats"
                        id="economy_seats"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="economy_seats"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
              
                    {/* Business Seats */}
                    <div className="flex flex-col">
                      <label htmlFor="business_seats" className="mb-1 text-sm font-semibold">
                        Business Seats <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="business_seats"
                        id="business_seats"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="business_seats"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
              
                    {/* First Class Seats */}
                    <div className="flex flex-col">
                      <label htmlFor="first_class_seats" className="mb-1 text-sm font-semibold">
                        First Class Seats <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="first_class_seats"
                        id="first_class_seats"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="first_class_seats"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="ml-4 px-8 py-2 text-white rounded-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all ease-in-out delay-50 duration-500 hover:scale-105"
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

export default AddFlight;
