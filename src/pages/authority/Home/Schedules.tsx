import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select, { SingleValue } from 'react-select';
import AuthNavbar from '../../../components/authority/home/AuthNavbar';
import ProfileShimmer from '../../../components/user/Home/Shimmers/ProfileShimmer';
import SchedulesList from '../../../components/authority/home/SchedulesList';
import { RootState } from '../../../redux/store/store';
import createAxios from '../../../services/axios/AuthorityAxios';
import { authorityEndpoints } from '../../../services/endpoints/AuthorityEndpoints';
import { setAirports } from '../../../redux/slices/authoritySlice';
import cloudImage from '../../../assets/images/White aesthetic widget in 2022 _ Black and white clouds, White clouds, Cloud wallpaper.jpeg';

interface AirportOption {
  value: string;
  label: string;
}

// Validation schema
const validationSchema = Yup.object().shape({
  fromAirport: Yup.object().required('From Airport is required'),
  toAirport: Yup.object().required('To Airport is required')
});

function Schedules() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedFromAirport, setSelectedFromAirport] = useState<AirportOption | null>(null);
  const [selectedToAirport, setSelectedToAirport] = useState<AirportOption | null>(null);
  const authState = useSelector((state: RootState) => state.AuthorityAuth.isAuthenticated);
  const airportsData = useSelector((state: RootState) => state.AuthorityAuth.airports);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAirportsData = async () => {
      try {
        if (authState && (!airportsData || airportsData.length === 0)) {
          const response = await createAxios(dispatch).get(authorityEndpoints.getAirports);
          dispatch(setAirports(response.data.airports));
        }
      } catch (err) {
        toast.error("Error getting data");
      } finally {
        setIsLoading(false);
      }
    };
    if (authState && (!airportsData || airportsData.length === 0)) {
      fetchAirportsData();
    } else {
      setIsLoading(false);
    }
  }, [authState, dispatch, airportsData]);

  if (isLoading) {
    return <ProfileShimmer />;
  }

  const formatAirportOption = (airport: any): AirportOption => ({
    value: airport._id,
    label: `${airport.airport_code}, ${airport.airport_name} (${airport.city}, ${airport.country})`,
  });

  const airportOptions = airportsData.map(formatAirportOption);

  const filteredToAirportOptions = airportOptions.filter(
    option => option.value !== selectedFromAirport?.value
  );

  const filteredFromAirportOptions = airportOptions.filter(
    option => option.value !== selectedToAirport?.value
  );

  const handleSubmit = (values: { fromAirport: AirportOption | null, toAirport: AirportOption | null }) => {
    console.log('Submitting:', values); // Check the form values
    setSelectedFromAirport(values.fromAirport);
    setSelectedToAirport(values.toAirport);
    setSearchTriggered(true); // Set searchTriggered to true on form submit
  };

  return (
    <div style={{ backgroundImage: `url(${cloudImage})`, backgroundSize: 'cover', height: '100vh' }}>
      <AuthNavbar />
      <div className='mx-[11%] my-5 font-PlayfairDisplay'>
        <Formik
          initialValues={{ fromAirport: null, toAirport: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className='flex items-center justify-center space-x-4'>
              <div className='border-2 border-black'>
                <Field
                  name="fromAirport"
                  component={({ field }: { field: any }) => (
                    <div>
                      <Select
                        {...field}
                        options={filteredFromAirportOptions}
                        onChange={(option: SingleValue<AirportOption>) => {
                          setFieldValue('fromAirport', option);
                          setSelectedFromAirport(option);
                        }}
                        placeholder="Select From Airport"
                        isClearable
                      />
                      {touched.fromAirport && errors.fromAirport && (
                        <div className="text-red-600">{errors.fromAirport}</div>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className='border-2 border-black'>
                <Field
                  name="toAirport"
                  component={({ field }: { field: any }) => (
                    <div>
                      <Select
                        {...field}
                        options={filteredToAirportOptions}
                        onChange={(option: SingleValue<AirportOption>) => {
                          setFieldValue('toAirport', option);
                          setSelectedToAirport(option);
                        }}
                        placeholder="Select To Airport"
                        isClearable
                      />
                      {touched.toAirport && errors.toAirport && (
                        <div className="text-red-600">{errors.toAirport}</div>
                      )}
                    </div>
                  )}
                />
              </div>
              <button type="submit" className='px-2 py-1 mx-2 border-2 border-black font-bold text-lg'>
                Search
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {searchTriggered && selectedFromAirport && selectedToAirport && (
        <SchedulesList
          key={`${selectedFromAirport.value}-${selectedToAirport.value}`} 
          fromAirport={selectedFromAirport}
          toAirport={selectedToAirport}
        />
      )}
    </div>
  );
}

export default Schedules;
