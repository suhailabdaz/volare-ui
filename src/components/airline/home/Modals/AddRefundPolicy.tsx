import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AirlineAxios';
import { RootState } from '../../../../redux/store/store';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
}

const validationSchema = Yup.object({
  policyName: Yup.string()
    .matches(/^[A-Za-z0-9]{6,7}$/, "Code must be 6 to 7 letters")
    .required("Flight code is required"),
    firstPeriodPenalty: Yup.number()
    .min(0, 'Economy seats must be zero or more')
    .required('Economy seats are required')
    .max(100,'muat be 100 or less'),
    secondPeriodPenalty: Yup.number()
    .min(0, 'Business seats must be zero or more')
    .required('Business seats are required')
    .max(100,'muat be 100 or less'),
    
    thirdPeriodPenalty: Yup.number()
    .min(0, 'First class seats must be zero or more')
    .required('First class seats are required')
    .max(100,'muat be 100 or less'),
    
});

const   AddRefundPlicy: React.FC<ProfileModalProps> = ({ closeModal }) => {
  const airlineData = useSelector(
    (state: RootState) => state.AirlineAuth.airlineData
  );
  const airlineId = airlineData?._id;

  const initialValues = {
    airline_id: airlineId,
    policyName: '',
    firstPeriodPenalty: 0,
    secondPeriodPenalty: 0,
    thirdPeriodPenalty: 0,
  };

  const dispatch = useDispatch();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
     

      const flightData = {
        airlineId: values.airline_id,
        cancellation: {
          policyName: values.policyName,
          firstPeriodPenalty: values.firstPeriodPenalty,
          secondPeriodPenalty: values.secondPeriodPenalty,
          thirdPeriodPenalty: values.thirdPeriodPenalty,
        },
      };
  
      
      const response = await createAxios(dispatch).post(
        airlineEndpoints.addCancellation,
        flightData
      );
      if (response.data) {
        toast.success('Saved Successfully');
        
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
          <h2 className="text-2xl mb-3 text-left font-bold">Add Refund Policy</h2>
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
                      <label htmlFor="policyName" className="mb-1 text-sm font-semibold">
                        Policy Name <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="policyName"
                        id="policyName"
                        className="p-3 border border-gray-500 rounded-lg text-black"
                      />
                      <ErrorMessage
                        name="policyName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                   
                       {/* firstPeriodPenalty */}
                    <div className="flex flex-col">
                      <label htmlFor="firstPeriodPenalty" className="mb-1 text-sm font-semibold">
                      First period penalty <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="firstPeriodPenalty"
                        id="firstPeriodPenalty"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="firstPeriodPenalty"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
              
                    {/* secondPeriodPenalty */}
                    <div className="flex flex-col">
                      <label htmlFor="secondPeriodPenalty" className="mb-1 text-sm font-semibold">
                      Second period penalty<span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="secondPeriodPenalty"
                        id="secondPeriodPenalty"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="secondPeriodPenalty"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
              
                    {/* thirdPeriodPenalty */}
                    <div className="flex flex-col">
                      <label htmlFor="thirdPeriodPenalty" className="mb-1 text-sm font-semibold">
                      Third period penalty<span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="thirdPeriodPenalty"
                        id="thirdPeriodPenalty"
                        className="p-3 border border-gray-500 rounded-lg  text-black"
                      />
                      <ErrorMessage
                        name="thirdPeriodPenalty"
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

export default AddRefundPlicy;