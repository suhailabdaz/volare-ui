import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Toaster, toast } from 'sonner';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import  {userAxios}  from "../../../services/axios/UserAxios";
import {userEndpoints} from '../../../services/endpoints/UserEndpoints';
import { login as userLogin } from '../../../redux/slices/userSlice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clientId = '650627989436-803iq1kf32r3vm928ilnuh04f098tf4r.apps.googleusercontent.com';

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const axiosInstance = userAxios;
      const endpoint =  userEndpoints;

      const response = await axiosInstance.post(endpoint.login, values);

      if (response.data.success ) {
        dispatch(userLogin({ token: response.data.token, UserData: response.data.user_data }));
        navigate('/home');
      } else {
        console.log(response.data)
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    console.log("handleggl");
    
    const { credential } = credentialResponse;

    console.log(credential,"credentials");
    

    try {
      const response = await userAxios.post('/google-login', { credential });

      if (response.data.success) {
        dispatch(userLogin({ token: response.data.token, UserData: response.data.user_data }));
        navigate('/');
      } else {
        toast.error('Failed to log in with Google');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-2xl mb-4 text-center">Login or create</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Login'}
                </button>
              </div>
              
                <>
                  <div className="flex justify-center mb-4">
                    <span>or continue with</span>
                  </div>
                  <div className="flex justify-center mb-4">
                    <GoogleOAuthProvider clientId={clientId}>
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => console.log('Login Failed')}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </>
              
              
            </Form>
          )}
        </Formik>
        <Toaster position="top-center" expand={false} richColors />
      </div>
    </div>
  );
}

export default LoginModal;
