import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../services/axios/AirlineAxios';
import { authorityEndpoints } from '../../../services/endpoints/AuthorityEndpoints';
import { login } from '../../../redux/slices/authoritySlice';
import CustomField from './CustomField';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { airlineEndpoints } from '../../../services/endpoints/AirlineEndpoints';
import { useState } from 'react';
import ModalManager from './ModalManager';

interface LoginModalProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = Yup.object({
  airline_name: Yup.string().required('Airline name is required'),
  airline_email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  airline_code: Yup.string().required('Code is required'),
  airline_password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  airline_confirm_password: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('airline_password')], 'Passwords must match'),
  airline_logo_image: Yup.mixed<File>()
    .test('fileSize', 'File too large', (value) => {
      if (value) {
        return (value as File).size <= 5 * 1024 * 1024;
      }
      return true;
    })
    .test('fileFormat', 'Unsupported Format', (value) => {
      if (value) {
        const file = value as File;
        return ['image/jpeg', 'image/png'].includes(file.type);
      }
      return true;
    }),
});

const initialValues = {
  airline_name: '',
  airline_code: '',
  airline_email: '',
  airline_password: '',
  airline_confirm_password: '',
  airline_logo_image: null as File | null,
};

const SignupModal: React.FC<LoginModalProps> = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formDataState,setformData] = useState<FormData | null>(null)
  

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const formData = new FormData();
    formData.append('airline_name', values.airline_name);
    formData.append('airline_code', values.airline_code);
    formData.append('airline_email', values.airline_email);
    formData.append('airline_password', values.airline_password);
    formData.append(
      'airline_confirm_password',
      values.airline_confirm_password
    );
    if (values.airline_logo_image) {
      formData.append('airline_logo_image', values.airline_logo_image);
    }

    try {
      const isMultipart = false;
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await createAxios(dispatch).post(
        airlineEndpoints.register,
        {email:values.airline_email},
        {
          headers: {
            'Content-Type': isMultipart
              ? 'multipart/form-data'
              : 'application/json',
          },
        }
      );
      if (response.data.success) {
        sessionStorage.setItem('airlineEmail',values.airline_email)
        setformData(formData)
          openModal('otpModal')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0">
      <div className="flex m-10">
        <h2 className="text-[171px] text-white relative font-Durk_bold_italic_1000 font-bold tracking-[-0.10em]">
          AIRLINE
        </h2>
        <div className="flex items-end pb-10 mx-16">
          <h2 className="text-[40px] text-white relative font-Durk_bold_italic_1000 font-bold tracking-[-0.10em]">
            REGISTER
          </h2>
        </div>
      </div>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex m-7 min-h-full">
              <div className="bg-white rounded-xl w-[60%] min-h-full font-PlusJakartaSans text-black font-extrabold text-sm">
                <div className="flex justify-between mx-1 my-1 space-x-1">
                  <div className="flex-1">
                    <CustomField type="text" name="airline_code" label="CODE" />
                  </div>
                  <div className="flex-1">
                    <CustomField type="text" name="airline_name" label="NAME" />
                  </div>
                </div>
                <div className="flex justify-between mx-1 mb-1 space-x-1">
                  <div className="flex-1">
                    <CustomField
                      type="email"
                      name="airline_email"
                      label="E-MAIL"
                    />
                  </div>
                  <div className="flex-1">
                    <CustomField
                      type="file"
                      name="airline_logo_image"
                      label="LOGO IMAGE"
                      accept="image/*"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        if (event.currentTarget.files) {
                          setFieldValue(
                            'airline_logo_image',
                            event.currentTarget.files[0]
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mx-1 mb-1 space-x-1">
                  <div className="flex-1">
                    <CustomField
                      type="password"
                      name="airline_password"
                      label="PASSWORD"
                    />
                  </div>
                  <div className="flex-1">
                    <CustomField
                      type="password"
                      name="airline_confirm_password"
                      label="CONFIRM PASSWORD"
                    />
                  </div>
                </div>
                <div className="flex justify-between mx-2 mb-2 space-x-1">
                  <div className="flex-1">
                    <p className="font-PlusJakartaSans font-light text-center text-sm">
                      Already have an Account{' '}
                      <button onClick={() => setIsLogin(true)}>
                        <span className="font-semibold text-black-900">
                          login
                        </span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center ml-3 w-[40%]">
                <button
                  type="submit"
                  className="w-full text-4xl text-white rounded-[4rem] font-Durk_bold_400 font-semibold bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 transition-all ease-in-out duration-500 hover:shadow-neon"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <div className="flex justify-center items-center">
                      <span>REGISTER</span>
                      <ArrowRightCircleIcon className="h-10 w-10 text-bold" />
                    </div>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ModalManager activeModal={activeModal || ''} closeModal={closeModal} openModal={openModal} formData={formDataState}  />
    </div>
  );
};

export default SignupModal;
