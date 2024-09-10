import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {  toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createAxios } from "../../../services/axios/UserAxios";
import { authorityEndpoints } from '../../../services/endpoints/AuthorityEndpoints';
import { login } from '../../../redux/slices/authoritySlice';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  password:Yup.string().required('pass is required'),
});

const initialEmail = {
  name: '',
  password:'',
};

const LoginModal= () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values: typeof initialEmail, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await createAxios(dispatch).post(authorityEndpoints.login,values);
      if(!response.data.success){
        toast.error("Incorrect Password")
      }else{
        localStorage.setItem("authorityAccessToken",response.data.accessToken)
        localStorage.setItem("authorityRefreshToken",response.data.refreshToken)
        dispatch(login({token:response.data.accessToken,}))
        toast.success("Access granted")
        navigate('/authority/dashboard')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white p-8  shadow-lg w-1/3 rounded-lg">
        <div className='flex justify-end'>
   
        </div>
        
          <h2 className="text-4xl  text-center font-PlayfairDisplay font-bold ">Airline Authority</h2>
          <p className=" text-4xl  text-gray-400 text-center font-PlayfairDisplay font-bold ">Airline Authority</p>
          <p className=" text-4xl mb-8 text-center text-gray-200 font-PlayfairDisplay font-bold ">Airline Authority</p>
          <Formik initialValues={initialEmail} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form>
               <div className="mb-4 flex flex-col items-center">
  <Field
    type="password"
    name="name"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="Name Key"
  />
  <ErrorMessage name="name" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
<div className="mb-4 flex flex-col items-center">
  <Field
    type="password"
    name="password"
    className="w-4/5 p-3 border border-gray-500 rounded-lg"
    placeholder="Password"
  />
  <ErrorMessage name="password" component="div" className="w-4/5 text-red-500 text-xs mt-1" />
</div>
        
                <div className="flex justify-center mb-6 ">
                  <button
                    type="submit"
                    className="w-4/5 px-4 py-3 text-white rounded-lg font-PlayfairDisplay font-semibold bg-black hover:text-black hover:bg-white hover:border-2 hover:border-black transition-all ease-in-out delay-50 duration-500  hover:scale-105 "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ?<div className="flex-col gap-4 w-full flex items-center justify-center">
                        <div className="w-7 h-7 border-4 border-transparent text-gray-300 text-4xl animate-spin flex items-center justify-center border-t-gray-300 rounded-full">
                          <div className="w-5 h-5 border-4 border-transparent text-gray-300 text-2xl animate-spin flex items-center justify-center border-t-gray-300 rounded-full"></div>
                        </div>
                      </div> : 'Continue'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className='flex justify-center'>
          <p className='mx-12 mt-4 font-PlusJakartaSans text-center text-xs'>Unauthorized Access is Strictly Prohibited, if found guilty <span className='font-semibold text-black-900'>Regulationary rules</span> will be imposed</p>
          </div>
         </div>
      </div>
    </>
  );
};

export default LoginModal;
