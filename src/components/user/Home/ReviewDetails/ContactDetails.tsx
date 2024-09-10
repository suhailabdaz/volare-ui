import { ErrorMessage, Field, Form, Formik } from 'formik';
import PhoneInput from 'react-phone-input-2';
import * as Yup from 'yup';
import { RootState } from '../../../../redux/store/store';
import { useSelector } from 'react-redux';
import { BookingData } from '../../../../pages/user/Home/ReviewDetails';


interface ContactDetails {
  phone: string;
  email: string;
}

interface ContactDetailsProps {
  onUpdateContact: (contactDetails: ContactDetails) => void;
  bookingData:BookingData
}

const validationSchema = Yup.object({
  phoneNumber: Yup.string().required('Mobile number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ContactDetails: React.FC<ContactDetailsProps> = ({
  onUpdateContact,
  bookingData
}) => {
  const userData = useSelector((state: RootState) => state.UserAuth.userData);

  const initialValues = {
    phoneNumber:bookingData.contactDetails?.phone || userData?.mobile?.toString() || '', 
    email: bookingData.contactDetails?.email || userData?.email || ''
  };
  const onSubmit = async (
    _values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="bg-white px-8 w-[99%] py-6 mt-3  rounded-md shadow-custom_shadow " id='contactDetails'>
      <div className="items-center mb-5">
        <h2 className="text-xl mb-1 text-left font-PlusJakartaSans font-extrabold">
          Contact Details
        </h2>
        <p className="font-light text-sm">Booking details will be sent to </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue,values }) => (
          <Form>
            <div className=" mb-4 flex  space-x-4">
              {/* Phone Number Field with react-phone-input-2 */}
              <div className='w-1/2 space-y-2'>
              <p className='font-PlusJakartaSan font-sm'>Mobile no.</p>
                <PhoneInput
                  country={'in'} // Default country code
                  value={initialValues.phoneNumber }
                  onChange={(value: string) =>{
                    setFieldValue('phoneNumber', value)
                    onUpdateContact({ phone: value, email: values.email });
                  }
                  }
                  inputClass="p-6 border border-gray-500 rounded-lg flex-1"
                  containerClass="flex flex-1"
                  countryCodeEditable={false}
                  specialLabel=""
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div className="w-1/2   flex justify-center items-center">
              <div className='w-full space-y-2'>
              <p className='font-PlusJakartaSans font-sm'>E-mail</p>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                  placeholder="email@domain.com"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('email', e.target.value);
                    onUpdateContact({
                      phone: values.phoneNumber,
                      email: e.target.value,
                    });
                  }}
                />
                {/* <ErrorMessage
                  name="email"
                  component="div"
                  className="w-4/5 text-red-500 text-xs mt-1"
                /> */}
              </div>
              </div>
            </div>

            <div className="flex justify-end mb-4 space-x-4">
              {/* Cancel Button */}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactDetails;
