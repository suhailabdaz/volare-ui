import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
// import { XMarkIcon } from '@heroicons/react/24/solid'; 
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {  toast } from 'sonner';
// import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom';
import { createAxios } from "../../../services/axios/UserAxios";
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
import { login as userLogin } from '../../../redux/slices/userSlice';
import finish from '../../../assets/images/finish-flag.png'

interface SignupModalProps {
  closeModal: () => any,
  openModal: (modalName :string) => any
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
});



const SignupModal: React.FC<SignupModalProps> = ({ closeModal}) => {
  const userEmail = sessionStorage.getItem('userEmail')
  console.log("login in the login component");
  const initialValues = {
    name: '',
    password: '',
    email :userEmail,
    confirmPassword:''
  };
  
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log("signup submit");
      const response = await createAxios(dispatch).post(userEndpoints.register,values);
      console.log(response.data)
      if (response.data) {
        localStorage.setItem("accessToken",response.data.accessToken)
        localStorage.setItem("refreshToken",response.data.refreshToken)
        dispatch(userLogin({token:response.data.accessToken,user_data:response.data.user}))
        toast.success("Succesfully logged in")
        setTimeout(()  => {
          closeModal()
        }, 1500);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white p-8  shadow-lg w-1/3 rounded-lg">
        <div className='flex mb-4 m-8 items-center justify-center' >
          <div className='w-10 h-8 '>
            <img src={finish} alt="svg" />
          </div>
          <h2 className="text-3xl mb-1 font-PlusJakartaSans font-bold text-center mx-5 ">Almost There !!</h2>
          </div>
          <p className="text-base mb-4 text-center font-PlusJakartaSans font-normal ">Enter your name and password to create Account</p>
          <Formik initialValues={initialValues } validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form>
               <div className="mb-4 flex flex-col items-center">
  <Field
    type="text"
    name="name"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="Please Enter your Name"
  />
  <ErrorMessage name="name" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
<div className="mb-4 flex flex-col items-center">
  <Field
    type="password"
    name="password"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="Create a Password"
  />
  <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
<div className="mb-4 flex flex-col items-center">
  <Field
    type="password"
    name="confirmPassword"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="Re-enter Password"
  />
  <ErrorMessage name="confirmPassword" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
        
                <div className="flex justify-center mb-6 ">
                  <button
                    type="submit"
                    className="w-4/5 px-4 py-3 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:scale-105 "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Create Account'}
                  </button>
                </div>
                
            
                
              </Form>
            )}
          </Formik>
          <div className='flex justify-center'>
          <p className='mx-12 mt-14 font-PlusJakartaSans text-center text-xs'>By continuing, you agree to our <span className='font-semibold text-blue-900'>Terms of Service</span> and <span className='font-semibold text-blue-900'>Privacy Policy</span></p>

          </div>


         </div>
      </div>
    </>
  );
};

export default SignupModal;
