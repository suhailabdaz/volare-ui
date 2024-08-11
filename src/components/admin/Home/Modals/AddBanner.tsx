import React from 'react';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner'; // Assuming you are using the 'sonner' library for toast notifications
import { useCreateBannerMutation } from '../../../../redux/apis/adminApiSlice';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
  refetch: ()=>any;
}

const validationSchema = Yup.object({
  banner_content: Yup.string().required('Content is required'),
  banner_logo_image: Yup.mixed<File>()
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

const AddCoupon: React.FC<ProfileModalProps> = ({ closeModal,refetch }) => {
  const [createBanner] = useCreateBannerMutation();

  var initialValues = {
    banner_content: '',
    banner_logo_image: null as File | null,
  };

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append('banner_content', values.banner_content);
      if (values.banner_logo_image) {
        formData.append('banner_logo_image', values.banner_logo_image);
      }

      await createBanner(formData).unwrap();

      toast.message('Banner created', {
        className:
          'border-2 border-black font-PlusJakartaSans1000 bg-gray-100 rounded-none',
      });
      closeModal();
      refetch()
    } catch (error) {
      toast.error('Failed to create banner. Please try again.');
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
              Add New Banner
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
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="banner_content"
                        className="mb-1 text-sm font-semibold"
                      >
                        Banner Content
                      </label>
                      <Field
                        type="text"
                        name="banner_content"
                        id="banner_content"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="banner_content"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="banner_logo_image"
                        className="mb-1 text-sm font-semibold"
                      >
                        Coupon Banner
                      </label>
                      <input
                        type="file"
                        name="banner_logo_image"
                        accept="image/*"
                        onChange={(event) => {
                          if (event.currentTarget.files) {
                            setFieldValue(
                              'banner_logo_image',
                              event.currentTarget.files[0]
                            );
                          }
                        }}
                      />
                      <ErrorMessage
                        name="banner_logo_image"
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
