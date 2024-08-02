import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Toaster, toast } from 'sonner';
import { createAxios } from "../../../../../../services/axios/UserAxios";
import { userEndpoints } from '../../../../../../services/endpoints/UserEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store/store';
import { userProfileDetails } from '../../../../../../redux/slices/profileSlice';
import { userProfileDetails as authProfile } from '../../../../../../redux/slices/userSlice';

interface PasswordModalProps {
  closeModal: () => any,
  openModal: (modalName :string) => any
}

const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Password is required'),
    newPassword: Yup.string().required('New Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm Password is required')
});

const PasswordModal: React.FC<PasswordModalProps> = ({ closeModal,openModal}) => {
  const userAuth = useSelector((state: RootState) => state.UserAuth.userData);
  const userId = userAuth?._id


  var initialValues = {
    currentPassword:"",
    newPassword:"",
    confirmPassword:""
  }
  
  const dispatch = useDispatch();

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log(userId,"usreid");
      const response = await createAxios().patch(userEndpoints.resetPassword,{values:values , id:userId});
      console.log("user",response);
      if (response.data.success) {
        dispatch(userProfileDetails(response.data))
        dispatch(authProfile(response.data))
        toast.success("Saved successfully")
        closeModal()
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      
      toast.error("An error occured");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6  shadow-lg w-1/3 rounded-lg">
        <div className='flex justify-between items-center'>
        <h2 className="text-3xl mb-5 text-left font-PlusJakartaSans font-extrabold ">Change Password ?</h2>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
  {({ isSubmitting }) => (
    <Form>
    <div className="space-y-4 mb-4">
      {/* Current Password Field */}
      <div className="flex flex-col">
        <label htmlFor="currentPassword" className="mb-1 text-sm font-semibold">Current Password</label>
        <Field
          type="password"
          name="currentPassword"
          id="currentPassword"
          placeholder="Enter current password"
          className="p-3 border border-gray-500 rounded-lg"
        />
        <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-xs mt-1" />
      </div>
  
      {/* New Password Field */}
      <div className="flex flex-col">
        <label htmlFor="newPassword" className="mb-1 text-sm font-semibold">New Password</label>
        <Field
          type="password"
          name="newPassword"
          id="newPassword"
          placeholder="Enter new password"
          className="p-3 border border-gray-500 rounded-lg"
        />
        <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1" />
      </div>
  
      {/* Confirm Password Field */}
      <div className="flex flex-col">
        <label htmlFor="confirmPassword" className="mb-1 text-sm font-semibold">Confirm Password</label>
        <Field
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          className="p-3 border border-gray-500 rounded-lg"
        />
        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
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
        {isSubmitting ? 'Submitting...' : 'SAVE'}
      </button>
    </div>
  </Form>
  )}
</Formik>
          <Toaster position="top-center" expand={false} richColors  />
        </div>
      </div>
    </>
  );
};

export default PasswordModal;
