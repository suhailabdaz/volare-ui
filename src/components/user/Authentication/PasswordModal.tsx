import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/solid'; 
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createAxios } from "../../../services/axios/UserAxios";
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
import {  login as userLogin } from '../../../redux/slices/userSlice';

interface PasswordModalProps {
  closeModal: () => any,
  openModal: (modalName :string) => any
}

const PasswordModal: React.FC<PasswordModalProps> = ({ closeModal,openModal}) => {
  const [storedEmail, setStoredEmail] = useState<string | null>(null); 
  const [isLoggedin , setLoggedin] = useState<boolean>(false)

  useEffect(() => {
    const emailFromStorage = sessionStorage.getItem('userEmail');
    if (emailFromStorage) {
      setStoredEmail(emailFromStorage);
    }
  }, []);

  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
  });


  console.log("login in the login component");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values: { password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log("userEmail",storedEmail);
      
      const requestData = {
        email: storedEmail,  
        password: values.password  
      };
      console.log("login submit");
      const response = await createAxios().post(userEndpoints.login, requestData);
      if(!response.data.success){
        toast.error("Incorrect Password")
      }else{
        localStorage.setItem("accessToken",response.data.accessToken)
        localStorage.setItem("refreshToken",response.data.refreshToken)
        dispatch(userLogin({token:response.data.accessToken,user_data:response.data.user}))
        toast.success("Succesfully logged in")
          closeModal()
        
      }
      
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = () => {
  const response = createAxios().post(userEndpoints.resendOtp,{email:storedEmail})
  closeModal()
  openModal('resetotp')
  };
  const handleClosing=()=>{
    closeModal()
    openModal('login')
  }


  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8  shadow-lg w-1/3 rounded-lg">
        <div className='flex justify-end'>
        <button className='' onClick={() => handleClosing()}>
        <XMarkIcon className=" h-8 w-8 text-slate-700 hover:text-gray-400" />
        </button>
        </div>
        
          <h2 className="text-2xl mb-1 text-center font-PlusJakartaSans font-bold ">Enter your Password</h2>
          <p className="text-base mb-4 text-center font-PlusJakartaSans font-normal ">Enter your Password to login</p>
          <Formik initialValues={{password:''}} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form>
               <div className="mb-4 flex flex-col items-center">
  <Field
    type="password"
    name="password"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="Please Enter your Password"
  />
  <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
        
                <div className="flex justify-center mb-6 ">
                  <button
                    type="submit"
                    className="w-4/5 px-4 py-3 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:scale-105 "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Continue'}
                  </button>
                </div>
                
              </Form>
            )}
          </Formik>
          <div className='flex justify-center'>
            <button
              onClick={handlePasswordReset}
              className='text-sm text-blue-600 hover:underline focus:outline-none'
            >
              Forgot your password? Reset it here.
            </button>
          </div>
         </div>
      </div>
    </>
  );
};

export default PasswordModal;
