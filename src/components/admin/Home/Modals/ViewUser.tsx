import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AdminAxios'
import { adminEndpoints } from '../../../../services/endpoints/AdminEndpoints';
import { RootState } from '../../../../redux/store/store';
import { setUsers } from '../../../../redux/slices/adminSlice';

interface ProfileModalProps {
  closeModal: () => any,
  openModal: (modalName: string) => any
  userId:string 
}

const validationSchema = Yup.object({
  airport_code: Yup.string()
  .matches(/^[A-Za-z]{3}$/, "Airport code must be exactly three letters")
  .required("Airport code is required"),
  airport_name: Yup.string().required("Name required"),
  city: Yup.string().required("city required"),
  country: Yup.string().required("countryrequired"),

});

const ViewUser: React.FC<ProfileModalProps> = ({ closeModal, openModal,userId }) => {

  const foundUser = useSelector((state: RootState) => {
    const users = state.AdminAuth.users; // Access travellers array
    if (!users) return null; // Handle empty array case
    return users.find((user:any) => user._id === userId);
  }); 

  var initialValues = {
    _id: foundUser?._id || '',
    name: foundUser?.name || '',
    email: foundUser?.email || '',
    status: foundUser?.status ? 'Active' : 'Blocked',  // Display status as 'Active' or 'Blocked'
    gender: foundUser?.gender || '',
    address: foundUser?.address || '',
    birthday: foundUser?.birthday ? new Date(foundUser.birthday).toISOString().split('T')[0] : '',
    pincode: foundUser?.pincode || '',
    state: foundUser?.state || '',
    mobile: foundUser?.mobile || ''
  };
  

  const dispatch = useDispatch();

 const onsubmit = async()=>{
  // console.log('hjh');
  
 }
  const handleDelete = async()=>{
    if(foundUser?._id){
      const response = await createAxios().post(adminEndpoints.blockUser,{Id:foundUser._id})
      console.log("respinse in block ",response);
      
        if(response.data.success){
        dispatch(setUsers(response.data.users))
        toast.success("User Blocked")
        closeModal()
      }else{
        toast.error("Task Failed")
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[35%] border border-black max-h-[80%] overflow-hidden">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-3xl text-left font-PlayfairDisplay font-bold mb-3">View User Info</h2>
            <button onClick={handleDelete} className='border-2 border-black font-lg text-black text-base p-1 font-bold hover:scale-105 transition-all ease-in-out duration-150 '>Block User</button>
          </div>
          
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onsubmit}>
            {({ isSubmitting }) => (
              <Form className="overflow-y-auto max-h-[60vh] px-2">
                <div id="basic-info" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label htmlFor="name" className="mb-1 text-sm font-semibold">Name <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="email" className="mb-1 text-sm font-semibold">Email <span className='text-red-900'>*</span></label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="status" className="mb-1 text-sm font-semibold">Status <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="status"
                        id="status"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="gender" className="mb-1 text-sm font-semibold">Gender</label>
                      <Field
                        type="text"
                        name="gender"
                        id="gender"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="address" className="mb-1 text-sm font-semibold">Address</label>
                      <Field
                        type="text"
                        name="address"
                        id="address"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="birthday" className="mb-1 text-sm font-semibold">Birthday</label>
                      <Field
                        type="date"
                        name="birthday"
                        id="birthday"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="birthday" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="pincode" className="mb-1 text-sm font-semibold">Pincode</label>
                      <Field
                        type="number"
                        name="pincode"
                        id="pincode"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="pincode" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="state" className="mb-1 text-sm font-semibold">State</label>
                      <Field
                        type="text"
                        name="state"
                        id="state"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
  
                    <div className="flex flex-col">
                      <label htmlFor="mobile" className="mb-1 text-sm font-semibold">Mobile</label>
                      <Field
                        type="text"
                        name="mobile"
                        id="mobile"
                        className="p-3 border border-gray-500 rounded-lg"
                        readOnly
                      />
                      <ErrorMessage name="mobile" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>
  
                <div className="sticky bottom-0 left-0 w-full bg-white py-4 px-8 border-t border-gray-300 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-2 py-3 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CANCEL
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

export default ViewUser;
