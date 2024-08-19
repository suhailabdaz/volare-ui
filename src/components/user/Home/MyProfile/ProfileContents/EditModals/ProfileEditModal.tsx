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

interface ProfileModalProps {
  closeModal: () => any,
  openModal: (modalName :string) => any
}

const validationSchema = Yup.object({
    name: Yup.string(),
    birthday: Yup.date(),
    gender: Yup.string(),
    address: Yup.string(),
    pincode: Yup.string(),
    state: Yup.string()
});

const ProfileModal: React.FC<ProfileModalProps> = ({ closeModal,openModal}) => {
  const userData = useSelector((state: RootState) => state.ProfileAuth.userData);
  const userAuth = useSelector((state: RootState) => state.UserAuth.userData);
  const userId = userAuth?._id


  var initialValues = {
    name:userData?.name || "",
    birthday:userData?.birthday || "",
    gender:userData?.gender || "",
    address:userData?.address || "",
    pincode:userData?.pincode || "",
    state:userData?.state || ""
  }
  
  const dispatch = useDispatch();

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      console.log(userId,"usreid");
      const response = await createAxios(dispatch).post(userEndpoints.updateUser,{values:values , id:userId});
      console.log("user",response);
      
      if (response.data.success) {
        dispatch(userProfileDetails(response.data))
        dispatch(authProfile(response.data))
        toast.success("Saved successfully")
        closeModal()
      } else {
        toast.error("error while saving data");
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
        <h2 className="text-3xl mb-5 text-left font-PlusJakartaSans font-bold  ">Edit Profile</h2>
        
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
  {({ isSubmitting }) => (
    <Form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name Field */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-sm font-semibold">Name</label>
          <Field
            type="text"
            name="name"
            id="name"
            className="p-3 border border-gray-500 rounded-lg"
          />
          <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
        </div>

        {/* Birthday Field */}
        <div className="flex flex-col">
          <label htmlFor="birthday" className="mb-1 text-sm font-semibold">Birthday</label>
          <Field
            type="date"
            name="birthday"
            id="birthday"
            className="p-3 border border-gray-500 rounded-lg"
          />
          <ErrorMessage name="birthday" component="div" className="text-red-500 text-xs mt-1" />
        </div>

        {/* Gender Field */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-1 text-sm font-semibold">Gender</label>
          <Field
            type="text"
            name="gender"
            id="gender"
            className="p-3 border border-gray-500 rounded-lg"
          />
          <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
        </div>

        {/* Address Field */}
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 text-sm font-semibold">Address</label>
          <Field
            type="text"
            name="address"
            id="address"
            className="p-3 border border-gray-500 rounded-lg"
          />
          <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
        </div>

        {/* Pincode Field */}
        <div className="flex flex-col">
          <label htmlFor="pincode" className="mb-1 text-sm font-semibold">Pincode</label>
          <Field
            type="text"
            name="pincode"
            id="pincode"
            className="p-3 border border-gray-500 rounded-lg"
          />
          <ErrorMessage name="pincode" component="div" className="text-red-500 text-xs mt-1" />
        </div>

        {/* State Field */}
        <div className="flex flex-col">
          <label htmlFor="state" className="mb-1 text-sm font-semibold">State</label>
          <Field
            type="text"
            name="state"
            id="state"
            className="p-3 border border-gray-500 rounded-lg"
          />
          <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
        </div>
      </div>

      <div className="flex justify-end mb-4 space-x-4">
  {/* Submit Button */}
  

  <button
    type="button"
    onClick={() => closeModal()} 
    className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500  hover:scale-105"
  >
    CANCEL
  </button>
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

export default ProfileModal;
