import React from 'react';
import GODSPEED from '../../../assets/images/GODSPEED.png';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { adminAxios } from '../../../services/axios/AdminAxios';
import { adminEndpoints } from '../../../services/endpoints/AdminEndpoints';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/adminSlice';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const initialValues = {
  email: '',
  password: ''
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
values: typeof initialValues
  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log('Admin gonna login', values);
      const response = await adminAxios.post(adminEndpoints.login, values);
      console.log('Success logging', response);

      if (response.data.success) {
        console.log('Dispatching admin login', response);
        dispatch(login({ token: response.data.token, adminData: response.data.admin_data }));
        toast.success("Successfully logged in")
        setTimeout(()=>navigate('/admin/dashboard'),1000)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error logging in', error);
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 pt-4 bg-gray-100">
      <div className="flex justify-center items-center mb-4 md:mb-0 p-4">
        <img
          src={GODSPEED}
          alt="HireHub"
          className="max-w-full h-auto rounded-lg w-32 md:w-auto"
        />
      </div>
      <div className="flex justify-center items-center p-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
          <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Welcome, Admin
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    className="border-gray-300 border rounded-md text-sm py-2 px-4 w-full focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="mb-6">
                  <Field
                    type="password"
                    name="password"
                    className="border-gray-300 border rounded-md text-sm py-2 px-4 w-full focus:outline-none focus:border-blue-500"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="border border-black w-64 py-2 rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Login'}
                  </button>
                </div>
                {isSubmitting && (
                  <div className="flex justify-center mt-4">
                    <span>Loading...</span>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster position="top-center" expand={false} richColors />
    </div>
  );
}

export default Login;
