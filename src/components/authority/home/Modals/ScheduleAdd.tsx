import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'sonner';
import { createAxios } from '../../../../services/axios/AuthorityAxios';
import { authorityEndpoints } from '../../../../services/endpoints/AuthorityEndpoints';
import {  setSchedule } from '../../../../redux/slices/authoritySlice';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';

interface ScheduleAddProps {
  closeModal: () => void;
  openModal: (modalName: string) => void;
  fromAirport: AirportOption | null;
  toAirport: AirportOption | null;
  to: string;
  from: string;
}

interface AirportOption {
  value: string;
  label: string;
}

interface FormValues {
  fromAirport_Id: string;
  toAirport_Id: string;
  daysOfWeek: string[];
  departureTime: string;
  duration: string;
  arrivalTime: string;
}

const validationSchema = Yup.object({
  daysOfWeek: Yup.array()
    .of(Yup.string().oneOf(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']))
    .required('At least one operating day is required'),
  departureTime: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid departure time format')
    .required('Departure time is required'),
  duration: Yup.string()
    .matches(/^(\d{1,2}):([0-5]\d)$/, 'Invalid duration format (HH:mm)')
    .required('Duration is required'),
  arrivalTime: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid arrival time format')
    .required('Arrival time is required'),
});

const ScheduleAdd: React.FC<ScheduleAddProps> = ({ closeModal, openModal, fromAirport, toAirport, to, from }) => {
  const [fromAirportState, setFromAirport] = useState<AirportOption | null>(fromAirport);
  const [toAirportState, setToAirport] = useState<AirportOption | null>(toAirport);
  


  useEffect(() => {
    console.log(fromAirport,toAirport,"noke");
    
    setFromAirport(fromAirport);
    setToAirport(toAirport);
  }, [fromAirport, toAirport]);

  const initialValues: FormValues = {
    fromAirport_Id: fromAirportState?.value || '',
    toAirport_Id: toAirportState?.value || '',
    daysOfWeek: [],
    departureTime: '',
    duration: '',
    arrivalTime: '',
  };

  const dispatch = useDispatch();

  const calculateArrivalTime = (departure: string, duration: string) => {
    if (!departure || !duration) return '';

    const [depHours, depMinutes] = departure.split(':').map(Number);
    const [durHours, durMinutes] = duration.split(':').map(Number);
    
    const departureDate = new Date();
    departureDate.setHours(depHours, depMinutes);
    
    const arrivalDate = new Date(departureDate.getTime() + (durHours * 60 + durMinutes) * 60000);
    
    const arrivalHours = String(arrivalDate.getHours()).padStart(2, '0');
    const arrivalMinutes = String(arrivalDate.getMinutes()).padStart(2, '0');
    
    return `${arrivalHours}:${arrivalMinutes}`;
  };

  const onSubmit = async (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await createAxios().post(authorityEndpoints.addSchedule, values);
      if (response.data.success) {
        dispatch(setSchedule(response.data.schedule));
        toast.success('Saved Successfully');
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

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-8 py-6 shadow-lg w-[35%] border border-black max-h-[80%] overflow-hidden">
          <div className='justify-between items-center mb-4'>
            <h2 className="flex justify-between text-3xl text-left font-PlayfairDisplay font-bold mb-4">
              Add Schedule
              <span className='text-xl flex mx-5 items-end font-semibold'>{from}<ArrowRightCircleIcon className='h-6' />{to}</span>
            </h2>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => {
              useEffect(() => {
                const arrivalTime = calculateArrivalTime(values.departureTime, values.duration);
                setFieldValue('arrivalTime', arrivalTime);
              }, [values.departureTime, values.duration, setFieldValue]);

              return (
                <Form className="overflow-y-auto max-h-[70vh] px-2">
                  <div id="schedule-info" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Days of the Week */}
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-semibold">Operating Days <span className='text-red-900'>*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <label key={day} className={`flex items-center p-2 border border-gray-500 rounded-lg cursor-pointer ${values.daysOfWeek.includes(day) ? 'bg-black text-white' : ''}`}>
                              <Field
                                type="checkbox"
                                name="daysOfWeek"
                                value={day}
                                onChange={() => {
                                  if (values.daysOfWeek.includes(day)) {
                                    setFieldValue('daysOfWeek', values.daysOfWeek.filter(d => d !== day));
                                  } else {
                                    setFieldValue('daysOfWeek', [...values.daysOfWeek, day]);
                                  }
                                }}
                                className="mr-2"
                              />
                              {day}
                            </label>
                          ))}
                        </div>
                        <ErrorMessage name="daysOfWeek" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Departure Time */}
                      <div className="flex flex-col">
                        <label htmlFor="departureTime" className="mb-1 text-sm font-semibold">Departure Time <span className='text-red-900'>*</span></label>
                        <Field
                          type="text"
                          name="departureTime"
                          id="departureTime"
                          className="p-3 border border-gray-500 rounded-lg"
                        />
                        <ErrorMessage name="departureTime" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col">
                        <label htmlFor="duration" className="mb-1 text-sm font-semibold">Duration <span className='text-red-900'>*</span></label>
                        <Field
                          type="text"
                          name="duration"
                          id="duration"
                          className="p-3 border border-gray-500 rounded-lg"
                        />
                        <ErrorMessage name="duration" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Arrival Time */}
                      <div className="flex items-center">
                        <label htmlFor="arrivalTime" className="mr-4 text-sm font-semibold">Calculated Arrival Time:</label>
                        <div id="arrivalTime" className="p-3 border border-gray-500 rounded-lg">
                          {values.arrivalTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 left-0 w-full bg-white py-4 px-8 border-t border-gray-300 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => closeModal()}
                      className="px-6 py-2 text-black font-semibold bg-white transition-all ease-in-out delay-50 duration-500 hover:scale-105"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2 text-white rounded-lg font-semibold border-2 bg-black hover:text-black hover:bg-white hover:border-2 hover:border-black transition-all ease-in-out delay-20 duration-500 hover:scale-101"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'SAVE'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ScheduleAdd;
