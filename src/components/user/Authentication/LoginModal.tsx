import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/solid'; 
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Toaster, toast } from 'sonner';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { createAxios } from "../../../services/axios/UserAxios";
import { userEndpoints } from '../../../services/endpoints/UserEndpoints';
import { login as userLogin } from '../../../redux/slices/userSlice';

interface LoginModalProps {
  closeModal: () => any,
  openModal: (modalName :string) => any
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const initialEmail = {
  email: '',
};

const LoginModal: React.FC<LoginModalProps> = ({ closeModal,openModal}) => {
  console.log("login in the login component");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (value: typeof initialEmail, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await createAxios(dispatch).post(userEndpoints.checkAccount,value);
      if (response.data.success) {
        sessionStorage.setItem('userEmail', response.data.email);
        if(response.data.created){
          toast.success(response.data.message)
          closeModal()
          openModal('password')
        }else{
          toast.success(response.data.message)
          closeModal()
          openModal('otp')
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    console.log("credentials in handle login",credential);
    try {
      const response = await createAxios(dispatch).post(userEndpoints.google_login, { credential });

      if (response.data.success) {
        localStorage.setItem("accessToken",response.data.accessToken)
        localStorage.setItem("refreshToken",response.data.refreshToken)
        dispatch(userLogin({token:response.data.accessToken,user_data:response.data.user_data}))
        toast.success("Succesfully logged in with google")
        setTimeout(()  => {
          closeModal()
        }, 1500);
      } else {
        toast.error('Failed to log in with Google');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    }
  };


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white p-8  shadow-lg w-1/3 rounded-lg">
        <div className='flex justify-end'>
        <button className='' onClick={() => closeModal()}>
        <XMarkIcon className=" h-8 w-8 text-slate-700 hover:text-gray-400" />
        </button>
        </div>
        
          <h2 className="text-2xl mb-1 text-center font-PlusJakartaSans font-bold ">Personal Account</h2>
          <p className="text-base mb-4 text-center font-PlusJakartaSans font-normal ">Enter your email to login or create for Volare</p>
          <Formik initialValues={initialEmail} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form>
               <div className="mb-4 flex flex-col items-center">
  <Field
    type="email"
    name="email"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="email@domain.com"
  />
  <ErrorMessage name="email" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
        
                <div className="flex justify-center mb-6 ">
                  <button
                    type="submit"
                    className="w-4/5 px-4 py-3 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:scale-105 "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Continue'}
                  </button>
                </div>
                <div className="flex justify-center mb-4">
                    <div className=" w-1/4 border-t border-gray-300 mt-3"></div>
                    <span className="mx-4">or continue with</span>
                    <div className="w-1/4 border-t border-gray-300 mt-3"></div>    
                </div>
                    <div className="flex justify-center mb-4">
                  
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => console.log('Login Failed')}
                    />
                </div>
                
              </Form>
            )}
          </Formik>
          <div className='flex justify-center'>
          <p className='mx-12 mt-14 font-PlusJakartaSans text-center text-xs'>By clicking continue, you agree to our <span className='font-semibold text-blue-900'>Terms of Service</span> and <span className='font-semibold text-blue-900'>Privacy Policy</span></p>
          </div>
         </div>
      </div>
    </>
  );
};

export default LoginModal;
