import React, { useState } from 'react';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';
import {  toast } from 'sonner';

import {
  ConfirmationResult,
} from "firebase/auth";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { sendOtp } from '../../../../../../hooks/MobileOtp';
import {auth} from '../../../../../../config/firebase.config';
import OtpModal from './MobileOtpModal';

interface PasswordModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
}

const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required('Mobile number is required')
});

const AddMobileModal: React.FC<PasswordModalProps> = ({ closeModal, openModal }) => {
  const [otpInput, setotpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [mobile,setMobile] = useState("")
  // const userId = userAuth?._id;


  const initialValues = {
    phoneNumber: ""
  };

  // const dispatch = useDispatch();

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await sendOtp(setotpInput,auth,values.phoneNumber,setConfirmationResult);
      setMobile(values.phoneNumber)
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const sendOtpToMobile = async () => {
    await sendOtp(setotpInput, auth, mobile, setConfirmationResult);
  };

  return (
    <>
      <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-1/3 rounded-lg">
          <div className='items-center mb-5'>
            <h2 className="text-3xl mb-1 text-left font-PlusJakartaSans font-extrabold">Add Your Mobile Number</h2>
            <p className='font-light text-sm'>For a faster booking experience, exclusive offers and rewards</p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="space-y-4 mb-4">
                  {/* Phone Number Field with react-phone-input-2 */}
                  <div>
                    <PhoneInput
                      country={'in'} // Default country code
                      value={initialValues.phoneNumber}
                      onChange={(value: string) => setFieldValue('phoneNumber', value)}
                      inputClass="p-6 border border-gray-500 rounded-lg flex-1"
                      containerClass="flex flex-1"
                      buttonClass="p-6 border border-gray-500 rounded-lg"
                      countryCodeEditable={false}
                      specialLabel=""
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="flex justify-end mb-4 space-x-4">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CANCEL
                  </button>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="px-8 py-2 text-white rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'SEND OTP'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
         </div>
      </div>
      {otpInput && (
  <OtpModal
    closeModal={closeModal}
    openModal={openModal}
    confirmationResult={confirmationResult}
    sendOtp={sendOtpToMobile}
  />
)}    </>
  );
};

export default AddMobileModal;
