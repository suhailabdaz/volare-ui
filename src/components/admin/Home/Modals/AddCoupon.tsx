import React from 'react';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner'; // Assuming you are using the 'sonner' library for toast notifications
import { useCreateCouponMutation } from '../../../../redux/apis/adminApiSlice';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
  refetch:()=>any;
}

const validationSchema = Yup.object({
  coupon_code: Yup.string()
    .matches(/^[A-Za-z]{5}$/, 'Code must be exactly five letters')
    .required('Code is required'),
  coupon_description: Yup.string().required('Description is required'),
  discount: Yup.number()
    .required('Discount is required')
    .min(1, 'Discount must be at least 1')
    .max(99, 'Discount cannot be more than 99')
    .default(1),
  coupon_logo_image: Yup.mixed<File>()
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

const AddCoupon: React.FC<ProfileModalProps> = ({ closeModal ,refetch}) => {
  const [createCoupon] = useCreateCouponMutation();
  
  var initialValues = {
    coupon_code: '',
    coupon_description: '',
    discount: 1, 
    coupon_logo_image: null as File | null,
  };

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append('coupon_code', values.coupon_code.toUpperCase());
      formData.append('coupon_description', values.coupon_description);
      formData.append('discount', values.discount.toString());
      if (values.coupon_logo_image) {
        formData.append('coupon_logo_image', values.coupon_logo_image);
      }

      await createCoupon(formData).unwrap();

      toast.message('Coupon created',{
        className:'border-2 border-black font-PlusJakartaSans1000 bg-gray-100 rounded-none'
      });      
      closeModal();
      refetch()
    } catch (error) {
      toast.error('Failed to create coupon. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[35%] border border-black max-h-[80%] overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl text-left font-PlayfairDisplay font-bold mb-3">
              Add New Coupon
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="overflow-y-auto max-h-[60vh] px-2">
                <div id="basic-info" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="coupon_code"
                        className="mb-1 text-sm font-semibold"
                      >
                        Coupon Code <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="coupon_code"
                        id="coupon_code"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="coupon_code"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="discount"
                        className="mb-1 text-sm font-semibold"
                      >
                        Discount Percentage{' '}
                        <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="number"
                        name="discount"
                        id="discount"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="discount"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="coupon_description"
                        className="mb-1 text-sm font-semibold"
                      >
                        Description
                      </label>
                      <Field
                        type="text"
                        name="coupon_description"
                        id="coupon_description"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="coupon_description"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="coupon_logo_image"
                        className="mb-1 text-sm font-semibold"
                      >
                        Coupon Banner
                      </label>
                      <input
                        type="file"
                        name="coupon_logo_image"
                        accept="image/*"
                        onChange={(event) => {
                          if (event.currentTarget.files) {
                            setFieldValue(
                              'coupon_logo_image',
                              event.currentTarget.files[0]
                            );
                          }
                        }}
                      />
                      <ErrorMessage
                        name="coupon_logo_image"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-2 py-2 text-white font-semibold bg-black transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CREATE
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

export default AddCoupon;
