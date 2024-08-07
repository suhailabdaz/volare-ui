import React, { useRef, useState } from 'react';
import { Input } from '@material-tailwind/react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AuthorityAxios';
import { authorityEndpoints } from '../../../../services/endpoints/AuthorityEndpoints';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import {
  geocordLocation,
  reverseGeocodeForCityCountry,
} from '../../../../hooks/GoogleMap';
import { setAirportDetails } from '../../../../redux/slices/authoritySlice';

interface ProfileModalProps {
  closeModal: () => any;
  openModal: (modalName: string) => any;
}

const validationSchema = Yup.object({
  airport_code: Yup.string()
    .matches(/^[A-Za-z]{3}$/, 'Airport code must be exactly three letters')
    .required('Airport code is required'),
  airport_name: Yup.string().required('Name required'),
  city: Yup.string().required('City required'),
  country: Yup.string().required('Country required'),
});

const AddAirport: React.FC<ProfileModalProps> = ({ closeModal }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 13.003371, lng: 77.589134 });
  const [zoom, setZoom] = useState(9);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  const originRef = useRef<HTMLInputElement | null>(null);
  const initialValues = {
    airport_code: '',
    airport_name: '',
    city: '',
    country: '',
    coordinates: { lat: '', long: '' },
  };

  const dispatch = useDispatch();

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      console.log('onsubmit', values);

      const response = await createAxios(dispatch).post(
        authorityEndpoints.addAirport,
        values
      );
      if (response.data.success) {
        toast.success('Saved Successfully');
        dispatch(setAirportDetails(response.data.airport));
        closeModal();
      } else {
        toast.error('Error while saving');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceChanged = async (setFieldValue: any) => {
    if (originRef.current) {
      const place = originRef.current.value;
      const { latitude, longitude }: any = await geocordLocation(place);
      const { city, country }: any = await reverseGeocodeForCityCountry(
        latitude,
        longitude
      );

      setFieldValue('city', city);
      setFieldValue('country', country);
      setFieldValue('coordinates.lat', latitude);
      setFieldValue('coordinates.long', longitude);

      setCenter({ lat: latitude, lng: longitude });
      map?.panTo({ lat: latitude, lng: longitude });
      setZoom(16);
    }
  };


   
  // Ensure map is loaded
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[35%] border border-black max-h-[80%] overflow-hidden">
          <div className="justify-between items-center mb-4">
            <h2 className="text-3xl text-left font-PlayfairDisplay font-bold mb-3">
              Add Airport Info
            </h2>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="overflow-y-auto max-h-[70vh] px-2">
                <div id="basic-info" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="airport_code"
                        className="mb-1 text-sm font-semibold"
                      >
                        Airport Code <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="airport_code"
                        id="code"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="airport_code"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="airport_name"
                        className="mb-1 text-sm font-semibold"
                      >
                        Airport Name <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="airport_name"
                        id="airport_name"
                        className="p-3 border border-gray-500 rounded-lg"
                      />
                      <ErrorMessage
                        name="airport_name"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="city"
                        className="mb-1 text-sm font-semibold"
                      >
                        City <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="city"
                        id="city"
                        className="p-3 border border-gray-500 rounded-lg"
                        disabled
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="country"
                        className="mb-1 text-sm font-semibold"
                      >
                        Country <span className="text-red-900">*</span>
                      </label>
                      <Field
                        type="text"
                        name="country"
                        id="country"
                        className="p-3 border border-gray-500 rounded-lg"
                        disabled
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-4 items-end">
                    <div className="w-4/5">
                      <Autocomplete
                        onPlaceChanged={() => handlePlaceChanged(setFieldValue)}
                      >
                        <Input
                          variant="standard"
                          inputRef={originRef}
                          placeholder="Enter Location"
                          className="w-full border-2 border-black font-PlayfairDisplay p-3 hover:animate-pulse"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                          crossOrigin={undefined}
                        />
                      </Autocomplete>
                    </div>
                    <div
                      className="tooltip"
                      data-tip="Choose your current location"
                    ></div>
                  </div>
                </div>

                <div className="mb-6">
                  {/* Google Map */}
                  <div style={{ height: '200px', width: '100%' }}>
                    <GoogleMap
                      center={center}
                      zoom={zoom}
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      onLoad={(mapInstance) => setMap(mapInstance)}
                    >
                      <Marker position={center} />
                    </GoogleMap>
                  </div>
                </div>

                <div className="sticky bottom-0 left-0 w-full bg-white py-6 px-8 border-t border-gray-300 flex justify-end space-x-4 ">
                  <button
                    type="button"
                    onClick={() => closeModal()}
                    className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 text-white font-semibold bg-black transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'SAVE'}
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

export default AddAirport;
