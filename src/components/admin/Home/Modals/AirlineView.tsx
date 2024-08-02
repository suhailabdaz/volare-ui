import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AdminAxios'
import { adminEndpoints } from '../../../../services/endpoints/AdminEndpoints';
import { RootState } from '../../../../redux/store/store';
import { setAirlines } from '../../../../redux/slices/adminSlice';

interface ProfileModalProps {
  closeModal: () => any,
  openModal: (modalName: string) => any,
  airlineId: string
}

const validationSchema = Yup.object({
  airline_name: Yup.string().required("Airline name is required"),
  airline_code: Yup.string()
    .matches(/^[A-Z]{2,3}$/, "Airline code must be 2 or 3 uppercase letters")
    .required("Airline code is required"),
  airline_email: Yup.string().email("Invalid email format").required("Email required"),
  status: Yup.string().required("Status required"),
});

const ViewAirline: React.FC<ProfileModalProps> = ({ closeModal, airlineId }) => {
  const foundAirline = useSelector((state: RootState) => {
    const airlines = state.AdminAuth.airlines;
    if (!airlines) return null;
    return airlines.find((airline: any) => airline._id === airlineId);
  });

  const initialValues = {
    _id: foundAirline?._id || '',
    airline_name: foundAirline?.airline_name || '',
    airline_code: foundAirline?.airline_code || '',
    airline_email: foundAirline?.airline_email || '',
    status: foundAirline?.status ? 'Active' : 'Inactive',
  };

  const dispatch = useDispatch();

  const onSubmit = async () => {
    // Handle form submission
  };

  const handleDelete = async () => {
    if (foundAirline?._id) {
      const response = await createAxios().post(adminEndpoints.blockAirline, { Id: foundAirline._id });
      if (response.data.success) {
        dispatch(setAirlines(response.data.airlines));
        toast.success("Airline Blocked");
        closeModal();
      } else {
        toast.error("Task Failed");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[35%] border border-black max-h-[80%] overflow-hidden">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-3xl text-left font-PlayfairDisplay font-bold mb-3">View Airline Info</h2>
            <button onClick={handleDelete} className='border-2 border-black font-lg text-black text-base p-1 font-bold hover:scale-105 transition-all ease-in-out duration-150 '>Block Airline</button>
          </div>
          
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form className="overflow-y-auto max-h-[60vh] px-2">
                <div id="basic-info" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label htmlFor="airline_name" className="mb-1 text-sm font-semibold">Airline Name <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="airline_name"
                        id="airline_name"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="airline_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="airline_code" className="mb-1 text-sm font-semibold">Airline Code <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="airline_code"
                        id="airline_code"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="airline_code" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="airline_email" className="mb-1 text-sm font-semibold">Email <span className='text-red-900'>*</span></label>
                      <Field
                        type="email"
                        name="airline_email"
                        id="airline_email"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="airline_email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="status" className="mb-1 text-sm font-semibold">Status <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="status"
                        id="status"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    {/* Additional fields can be added here if needed */}
  
                  </div>
                </div>
  
                <div className="sticky bottom-0 left-0 w-full bg-white py-4 px-8 border-t border-gray-300 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-2 py-3 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CANCEL
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

export default ViewAirline;
