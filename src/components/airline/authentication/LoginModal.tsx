import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../services/axios/AirlineAxios';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';
import { airlinelogin as login } from '../../../redux/slices/airlineSlice';
import CustomField from './CustomField';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';

interface LoginModalProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = Yup.object({
  airline_name: Yup.string().required('Name is required'),
  airline_password: Yup.string().required('pass is required'),
  airline_code: Yup.string().required('Code is required'),
  airline_email: Yup.string().required('email is required'),
});

const initialValues = {
  airline_name: '',
  airline_password: '',
  airline_code:'',
  airline_email:''
};

const LoginModal: React.FC<LoginModalProps> = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await createAxios(dispatch).post(
        airlineEndpoints.login,
        values
      );
      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        localStorage.setItem('airlineAccessToken', response.data.accessToken);
        localStorage.setItem(
          'airlineRefreshToken',
          response.data.refreshToken
        );
        dispatch(login({ token: response.data.accessToken, airline_data:response.data.airline }));
        toast.success('Access granted');
        navigate('/airline/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0">
        <div className="flex  m-10 ">
          <h2 className=" text-[171px] text-white relative font-Durk_bold_italic_1000 font-bold tracking-[-0.10em] ">
            AIRLINE
          </h2>
          <div className="flex items-end pb-10 mx-16">
            <h2 className=" text-[40px] text-white relative font-Durk_bold_italic_1000 font-bold tracking-[-0.10em] ">
              LOGIN
            </h2>
          </div>
        </div>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex m-7 min-h-full">
                <div className="bg-white rounded-xl w-[60%] min-h-full  font-PlusJakartaSans text-black font-extrabold text-sm ">
                  <div className="flex justify-between mx-1 my-1 space-x-1">
                    <div className="flex-1 ">
                      <CustomField type="text" name="airline_code" label="CODE" />
                    </div>
                    <div className="flex-1 ">
                      <CustomField type="text" name="airline_name" label="NAME" />
                    </div>
                  </div>
                  <div className=" flex justify-between mx-1 mb-1 space-x-1 ">
                    <div className="flex-1 ">
                      <CustomField type="email" name="airline_email" label="E-MAIL" />
                    </div>
                  </div>
                  <div className=" flex justify-between mx-1 mb-1   space-x-1  ">
                    <div className="flex-1 ">
                      <CustomField
                        type="password"
                        name="airline_password"
                        label="PASSWORD"
                      />
                    </div>
                  </div>
                  <div className=" flex justify-between mx-2 mb-2  space-x-1  ">
                    <div className="flex-1 ">
                      <p className="font-PlusJakartaSans font-light text-center text-sm">
                        Don't have an Account{' '}
                        <button onClick={() => setIsLogin(false)}>
                          <span className="font-semibold text-black-900">
                            Signup
                          </span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center ml-3 w-[40%] ">
                  <button
                    type="submit"
                    className="w-full text-4xl text-white rounded-[4rem] font-Durk_bold_400 font-semibold bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 
transition-all ease-in-out  duration-500 
  hover:shadow-neon 
  "
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <div className='flex justify-center items-center'>
                        <span>LOGIN</span>
                        <ArrowRightCircleIcon className="h-10 w-10 text-bold" />
                      </div>
                    )}
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

export default LoginModal;
