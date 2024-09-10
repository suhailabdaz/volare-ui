import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import {  toast } from 'sonner';
import { createAxios } from "../../../../../../services/axios/UserAxios";
import { userEndpoints } from '../../../../../../services/endpoints/UserEndpoints';
import { RootState } from '../../../../../../redux/store/store';
import {setTravellerDetails} from '../../../../../../redux/slices/travellersSlice'
import { removeTraveller } from '../../../../../../redux/slices/travellersSlice';
import DeleteButton from '../../../../../buttons/DeleteButton';

interface ProfileModalProps {
  closeModal: () => any,
  openModal: (modalName: string) => any
  travellerId : string
}
// interface TravellerFormValues {
//   firstName: string;
//   lastName: string;
//   gender: string;
//   dateOfBirth: string; // Assuming date is stored as a string, adjust according to actual usage
//   nationality: string;
//   mealPreference: string;
//   passportNo: string;
//   passportNationality: string;
//   passportExpiry: Date; // Yup.date() corresponds to a Date object in TypeScript
//   phone: string;
//   email: string;
// }


const validationSchema = Yup.object({
  firstName: Yup.string().required("First name required"),
  lastName: Yup.string().required("Last name required"),
  gender: Yup.string().required("Gender required"),
  dateOfBirth: Yup.string().required("Date of birth required"),
  nationality: Yup.string().required("required"),
  mealPreference: Yup.string().required("required"),
  passportNo: Yup.string().required("required"),
  passportNationality: Yup.string().required("required"),
  passportExpiry: Yup.date().required("required"),
  phone: Yup.string().required("required"),
  email: Yup.string().email("Invalid email").required("required")
});

const ViewTraveller: React.FC<ProfileModalProps> = ({ closeModal,travellerId }) => {
  // const userData = useSelector((state: RootState) => state.ProfileAuth.userData);
  // const userAuth = useSelector((state: RootState) => state.UserAuth.userData);
  // const [fetchedTraveller, setFetchedTraveller] = useState(null);
  // const [isLoading, setIsLoading] = useState(false); // Optional loading state

  const foundTraveller = useSelector((state: RootState) => {
    const travellers = state.TravellerAuth.travellers; // Access travellers array
    if (!travellers) return null; // Handle empty array case
  
    return travellers.find((traveller:any) => traveller._id === travellerId);
  }); 


  var initialValues = {
  userId : foundTraveller?.userId || "",
  firstName: foundTraveller?.firstName || "",
  lastName: foundTraveller?.lastName || "",
  gender: foundTraveller?.gender || "",
  dateOfBirth: foundTraveller?.dateOfBirth || "",
  nationality: foundTraveller?.nationality || "",
  mealPreference: foundTraveller?.mealPreference || "",
  passportNo: foundTraveller?.passportNo || "",
  passportNationality: foundTraveller?.passportNationality || "",
  passportExpiry: foundTraveller?.passportExpiry || "",
  phone: foundTraveller?.phone || "",
  email:foundTraveller?.email || "",
  _id:foundTraveller?._id
  }

  const dispatch = useDispatch();

  const onSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await createAxios(dispatch).post(userEndpoints.saveTravellers, values);
      if(response.data.success){
        toast.success("Saved Suceesfully")
        dispatch(setTravellerDetails(response.data.travellers))
        closeModal()
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async()=>{
    if(foundTraveller?._id){
      const response = await createAxios(dispatch).delete(`${userEndpoints.deleteTraveller}/${foundTraveller._id}`);
      if(response.data.success){
        dispatch(removeTraveller(response.data.traveller))
        toast.success("Traveller Removed")
        closeModal()
      }else{
        toast.error("Task Failed")
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[50%] rounded-lg max-h-[80%] overflow-hidden">
          <div className='flex justify-between items-center mb-4 mt-2'>
            <h2 className="text-3xl text-left font-PlusJakartaSans font-bold">Edit Traveller Info</h2>
            <DeleteButton handleDelete={handleDelete} />
          </div>
          
          <div className=" m-1 font-PlusJakartaSans font-bold text-lg flex justify-normal items-center mb-6 ">
            <button
              className="text-blue-500 hover:underline mr-5"
              onClick={() => document.getElementById('basic-info')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Basic Info
            </button>
            <button
              className="text-blue-500 hover:underline mr-5"
              onClick={() => document.getElementById('passport-details')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Passport Details
            </button>
            <button
              className="text-blue-500 hover:underline mr-5"
              onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Information
            </button>
          </div>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form className="overflow-y-auto max-h-[60vh] px-2">
                <div id="basic-info" className="mb-6">
                  <h3 className="text-xl mb-4 font-semibold">Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* First Name */}
                    <div className="flex flex-col">
                      <label htmlFor="firstName" className="mb-1 text-sm font-semibold">First Name <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="firstName"
                        id="firstName"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                      <label htmlFor="lastName" className="mb-1 text-sm font-semibold">Last Name <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="lastName"
                        id="lastName"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                      <label htmlFor="gender" className="mb-1 text-sm font-semibold">Gender <span className='text-red-900'>*</span></label>
                      <Field
                        type="text"
                        name="gender"
                        id="gender"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col">
                      <label htmlFor="dateOfBirth" className="mb-1 text-sm font-semibold">Date Of Birth <span className='text-red-900'>*</span></label>
                      <Field
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Nationality */}
                    <div className="flex flex-col">
                      <label htmlFor="nationality" className="mb-1 text-sm font-semibold">Nationality</label>
                      <Field
                        type="text"
                        name="nationality"
                        id="nationality"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="nationality" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Meal Preference */}
                    <div className="flex flex-col">
                      <label htmlFor="mealPreference" className="mb-1 text-sm font-semibold">Meal Preference</label>
                      <Field
                        type="text"
                        name="mealPreference"
                        id="mealPreference"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="mealPreference" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                <div id="passport-details" className="mb-6">
                  <h3 className="text-xl mb-4 font-semibold">Passport Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Passport Number */}
                    <div className="flex flex-col">
                      <label htmlFor="passportNo" className="mb-1 text-sm font-semibold">Passport No</label>
                      <Field
                        type="text"
                        name="passportNo"
                        id="passportNo"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="passportNo" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Passport Nationality */}
                    <div className="flex flex-col">
                      <label htmlFor="passportNationality" className="mb-1 text-sm font-semibold">Passport Nationality</label>
                      <Field
                        type="text"
                        name="passportNationality"
                        id="passportNationality"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="passportNationality" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Passport Expiry */}
                    <div className="flex flex-col">
                      <label htmlFor="passportExpiry" className="mb-1 text-sm font-semibold">Passport Expiry</label>
                      <Field
                        type="date"
                        name="passportExpiry"
                        id="passportExpiry"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="passportExpiry" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                <div id="contact-info" className="mb-6">
                  <h3 className="text-xl mb-4 font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Phone */}
                    <div className="flex flex-col">
                      <label htmlFor="phone" className="mb-1 text-sm font-semibold">Phone</label>
                      <Field
                        type="text"
                        name="phone"
                        id="phone"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label htmlFor="email" className="mb-1 text-sm font-semibold">Email</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 left-0 w-full bg-white py-4 px-8 border-t border-gray-300 flex justify-end space-x-4 ">
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
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
         </div>
      </div>
    </>
  );
};

export default ViewTraveller;
