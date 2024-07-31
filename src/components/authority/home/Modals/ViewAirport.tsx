import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AuthorityAxios';
import { authorityEndpoints } from '../../../../services/endpoints/AuthorityEndpoints';
import { RootState } from '../../../../redux/store/store';

import {
  removeAirport,
  setAirportDetails,
} from '../../../../redux/slices/authoritySlice';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
  airportId: string;
}

const validationSchema = Yup.object({
  airport_code: Yup.string()
    .matches(/^[A-Za-z]{3}$/, 'Airport code must be exactly three letters')
    .required('Airport code is required'),
  airport_name: Yup.string().required('Name required'),
  city: Yup.string().required('city required'),
  country: Yup.string().required('countryrequired'),
});

const ViewAirport: React.FC<ProfileModalProps> = ({
  closeModal,
  openModal,
  airportId,
}) => {
  const userAuth = useSelector((state: RootState) => state.UserAuth.userData);

  const foundAirport = useSelector((state: RootState) => {
    const travellers = state.AuthorityAuth.airports; // Access travellers array
    if (!travellers) return null; // Handle empty array case
    return travellers.find((traveller: any) => traveller._id === airportId);
  });

  var initialValues = {
    _id: foundAirport?._id,
    airport_code: foundAirport?.airport_code || '',
    airport_name: foundAirport?.airport_name || '',
    city: foundAirport?.city || '',
    country: foundAirport?.country || '',
  };

  const dispatch = useDispatch();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await createAxios().post(
        authorityEndpoints.saveAirport,
        values
      );
      if (response.data.success) {
        console.log('response', response);
        toast.success('Saved Suceesfully');
        dispatch(setAirportDetails(response.data.airport));
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
    if (foundAirport?._id) {
      const response = await createAxios().delete(
        `${authorityEndpoints.deleteAirport}/${foundAirport._id}`
      );
      if (response.data.success) {
        dispatch(removeAirport(response.data.airport));
        toast.success('Traveller Removed');
        closeModal();
      } else {
        toast.error('Task Failed');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[35%] border border-black max-h-[80%] overflow-hidden">
          <div className=" flex justify-between items-center mb-4">
            <h2 className="text-3xl text-left font-PlayfairDisplay font-bold mb-3">
              Edit Airport Info
            </h2>
            <button
              onClick={() => handleDelete()}
              className="border-2 border-black font-lg text-black text-base p-1 font-bold hover:scale-105 transition-all ease-in-out duration-150 "
            >
              Delete
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="overflow-y-auto max-h-[70vh] px-2">
                <div id="basic-info" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* First Name */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="airport_code"
                        className="mb-1 text-sm font-semibold"
                      >
                        Airport Code <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="airport_code"
                        id="code"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="airport_code"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="airport_name"
                        className="mb-1 text-sm font-semibold"
                      >
                        Airport Name <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="airport_name"
                        id="airport_name"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="airport_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="city"
                        className="mb-1 text-sm font-semibold"
                      >
                        City <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="city"
                        id="city"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="country"
                        className="mb-1 text-sm font-semibold"
                      >
                        Country <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="country"
                        id="country"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 left-0 w-full bg-white py-4 px-8 border-t border-gray-300 flex justify-end space-x-4 ">
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 text-white rounded-lg font-semibold border-2 bg-black hover:text-black hover:bg-white hover:border-2 hover:border-black transition-all ease-in-out delay-20 duration-500  hover:scale-101 "
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
    </>
  );
};

export default ViewAirport;
