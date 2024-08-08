import {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from 'react';
import ModalManager from './Modals/ModalManager';
import Tooltip from './Modals/ToolTip';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  setFromAirport,
  setToAirport,
  setDepartureDate,
  setReturnDate,
  setTripType,
  setSelectedValue,
  validateState
} from '../../../../redux/slices/HeroSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';



function Hero() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleChange = (event: {
    target: { value: string };
  }) => {
    dispatch(setSelectedValue(event.target.value));
  };
  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const dispatch = useDispatch()

  const returnDateInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const tripType = useSelector((state: RootState) => state.HeroAuth.tripType);
  const values = useSelector((state: RootState) => state.HeroAuth);

  const selectedValue = useSelector((state:RootState)=>state.HeroAuth.selectedValue)
  const classState = useSelector((state:RootState)=>state.HeroAuth.classState)
  const fromAirport = useSelector((state:RootState)=>state.HeroAuth.fromAirport)
  const toAirport = useSelector((state:RootState)=>state.HeroAuth.toAirport)
  const departureDate = useSelector((state:RootState)=>state.HeroAuth.departureDate)
  const returnDate = useSelector((state:RootState)=>state.HeroAuth.returnDate)
  const travellers = useSelector((state:RootState)=>state.HeroAuth.travellers)
  const hasErrors = useSelector((state: RootState) => state.HeroAuth.hasErrors);

  const [shouldSubmit, setShouldSubmit] = useState(false);



  const handleReturnDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);

    if (event.target.value == '') {
      const today = new Date();
      dispatch(setReturnDate({
        date: today,
        weekday: today.toLocaleDateString('en-US', { weekday: 'long' }),
      }));
    }
    const date = new Date(event.target.value);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    dispatch(setReturnDate({
      date: date,
      weekday: weekday,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let date = new Date(event.target.value);
    
    if (isNaN(date.getTime())) {
      date = new Date(); 
    }
  
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  
    dispatch(setDepartureDate({
      date: date,
      weekday: weekday,
    }));
  };
  

  const swap = () => {
    dispatch(setFromAirport(toAirport));
    dispatch(setToAirport(fromAirport));
  };

  const handleTripTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTripType(e.target.value as 'oneWay' | 'roundTrip'));

  };

  const handleParentDivClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.showPicker();
    }
  };

  const returnhandleParentDivClick = () => {
    if (returnDateInputRef.current) {
      returnDateInputRef.current.focus();
      returnDateInputRef.current.showPicker();
    }
  };

  const handleCombinedClick = () => {
    dispatch(setTripType('roundTrip'));
    returnhandleParentDivClick();
  };

  useEffect(() => {
    const submitFormIfValid = async () => {
      if (!hasErrors && shouldSubmit) {
        try {
         

          toast.success('Form submitted successfully');
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          toast.error('Failed to submit form');
        } finally {
          setShouldSubmit(false); 
        }
      }
    };

    submitFormIfValid();
  }, [hasErrors, shouldSubmit]); 

  


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    dispatch(validateState());
    setShouldSubmit(true); // Indicate that form submission should be attempted

  };

 

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
  
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      throw new Error('Invalid date');
    }
  
    const day = validDate.toLocaleDateString('en-US', { day: 'numeric' });
    const month = validDate.toLocaleDateString('en-US', { month: 'short' });
    const year = validDate.toLocaleDateString('en-US', { year: '2-digit' });
  
    return `
      <span class="text-black text-3xl m-1 font-PlusJakartaSans1000">${day}</span>
      <span class="text-black text-lg">${month}'</span>
      <span class="text-black text-xl">${year}</span>
    `;
  };
  

  return (
    <div className="mx-[13%] mt-8 p-6 pb-24 font-PlusJakartaSans ">
      <form
      onSubmit={handleSubmit}
        className="bg-white p-6 relative  shadow-md flex flex-col rounded-xl"
      >
        <div className="flex justify-start space-x-4 font-bold mb-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="tripType"
              value="oneWay"
              checked={tripType === 'oneWay'}
              onChange={handleTripTypeChange}
            />
            <span className="ml-2">One Way</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === 'roundTrip'}
              onChange={handleTripTypeChange}
            />
            <span className="ml-2">Round Trip</span>
          </label>
        </div>
        <div className="flex flex-wrap ">
          <button
          type='button'

            className="btn"
            onClick={() => {
              openModal('FromAirportSearch');
            }}
          >
            <div className="flex-1 min-w-[280px] h-32 border-l-2 border-t-2 border-b-2 rounded-l-lg border-gray-300">
              <label className="block text-black mb-1 text-left px-6 py-2 text-base">
                From
              </label>
              <h1 className="font-PlusJakartaSans1000 text-3xl ml-6 text-left">
                {fromAirport?.city}
              </h1>
              {fromAirport ? (
                <div className="flex text-left ml-6 mx-2">
                  <p className="">{fromAirport?.airport_code}</p>,
                  <span className="truncate max-w-[200px] block overflow-hidden ml-1">
                    {fromAirport?.airport_name}
                  </span>
                </div>
              ) : (
                <div>
                  <p className="p-2 text-gray-400  text-sm font-bold cursor-pointer">
                    Tap to select Airport.
                  </p>
                </div>
              )}
            </div>
          </button>
          <div
            onClick={() => swap()}
            className="absolute top-[105px] left-[285px]  h-10 w-10 cursor-pointer rounded-full justify-center flex items-center bg-gray-100 shadow-sm"
          >
            <ArrowsRightLeftIcon className="h-4 w-4 text-purple-800" />
          </div>
          <button
          type='button'
            className="btn"
            onClick={() => {
              openModal('ToAirportSearch');
            }}
          >
            <div className="flex-1 min-w-[280px] h-32 border-l-2 border-t-2 border-b-2  border-gray-300">
              <label className="block text-black mb-1 text-left px-10 py-2 text-base">
                To
              </label>
              <h1 className="font-PlusJakartaSans1000 text-3xl ml-10 text-left">
                {toAirport?.city}
              </h1>
              {toAirport ? (
                <div className="flex text-left ml-10 mx-2">
                  <p className="">{toAirport?.airport_code}</p>,
                  <span className="truncate max-w-[180px] block overflow-hidden ml-1">
                    {toAirport?.airport_name}
                  </span>
                </div>
              ) : (
                <div>
                  <p className="p-2 text-gray-400  text-sm font-bold cursor-pointer">
                    Tap to select Airport.
                  </p>
                </div>
              )}
            </div>
          </button>
          <div
            onClick={() => handleParentDivClick()}
            className="flex-1 min-w-[130px] hover:bg-blue-200 w-full p-2 border-l-2 border-t-2 border-b-2 h-32 border-gray-300"
          >
            <label className="flex text-gray-700 mb-2 items-end ">
              Departure <ChevronDownIcon className="text-blue-500 h-5 ml-2" />
            </label>
            <input
              type="date"
              ref={dateInputRef}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
            />
            <div className="mt-2 text-gray-700">
              {departureDate.date ? (
                <div className="items-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatDate(departureDate.date),
                    }}
                  />
                  <div className="m-2"> {departureDate.weekday}</div>
                </div>
              ) : (
                <p className="p-2 text-gray-400 text-sm font-bold cursor-pointer">
                  Tap to add a Date.
                </p>
              )}
            </div>
          </div>
          <div
            onClick={() => handleCombinedClick()}
            className="flex-1 min-w-[130px] w-full p-2 border-l-2 border-t-2 border-b-2 h-32 border-gray-300 "
          >
            <label className="flex text-gray-700 mb-2 items-end">
              Return <ChevronDownIcon className="text-blue-500 h-5 ml-2" />{' '}
            </label>
            {tripType === 'roundTrip' ? (
              <div>
                <input
                  type="date"
                  ref={returnDateInputRef}
                  onChange={handleReturnDateChange}
                  className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
                />
                <div className="mt-2 text-gray-700">
                  {returnDate.date ? (
                    <div className="items-center">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatDate(returnDate.date),
                        }}
                      />
                      <div className="m-2"> {returnDate.weekday}</div>
                    </div>
                  ) : (
                    <p className="p-2 text-gray-400 text-sm font-bold cursor-pointer">
                      Tap to add a Date.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="p-2 text-gray-400 text-sm font-bold cursor-pointer">
                  Tap to add a return Date.
                </p>
              </div>
            )}
          </div>
          <button
          type='button'
            className=""
            onClick={() => {
              openModal('TravAndClass');
            }}
          >
            <div
              onClick={() => openModal('TravAndClass')}
              className="flex-1 min-w-[200px] h-32 border-2  rounded-r-lg border-gray-300"
            >
              <label className="flex text-black mb-1 text-left px-4 py-2 text-base items-end ">
                Travellers & class{' '}
                <ChevronDownIcon className="text-blue-500 h-5 ml-2" />
              </label>
              {travellers ? (
                <div>
                  <div className="flex items-end justify-start mx-3">
                    <div className="mx-2 font-PlusJakartaSans1000 text-3xl">
                      {' '}
                      {travellers.total}
                    </div>
                    <p className="text-gray-500 text-xl">Travellers</p>
                  </div>
                  <div className="flex justify-start  items-center mx-5 mb-2 mt-1 text-md font-normal">
                    <p>{classState}</p>
                  </div>
                </div>
              ) : (
                <p className="p-2 text-gray-400 text-sm font-bold cursor-pointer">
                  Tap to add Details.
                </p>
              )}
            </div>
          </button>
        </div>
        <div className="flex items-center mb-4">
          <div>
            <p className="font-extrabold text-sm mb-1">Select a special Fare</p>
            <div className="bg-gradient-to-r from-teal-600 to-teal-400 flex justify-center rounded-lg">
              <p className="p-1 text-white font-extrabold">EXRA SAVINGS</p>
            </div>
          </div>
          <div className="flex text-sm justify-between  w-auto  m-5 space-x-4  select-none">
            <label
              className={`border ${
                selectedValue === 'Regular'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-gray-300'
              } transition-all ease-in-out duration-200 radio pr-3 py-2 flex items-center justify-center space-x-3 rounded-lg  cursor-pointer`}
            >
              <input
                type="radio"
                name="radio"
                value="Regular"
                className="peer hidden"
                defaultChecked
                onChange={handleChange}
              />
              <div
                className={`${
                  selectedValue === 'Regular'
                    ? 'border-blue-500'
                    : 'border-gray-500'
                } bg-white transition-all ease-in-out duration-200 border-2  h-5 w-5 rounded-full flex items-center justify-center `}
              >
                <div
                  className={`${
                    selectedValue === 'Regular' ? 'bg-blue-500' : 'bg-white'
                  } transition-all ease-in-out duration-200 rounded-full w-[70%] h-[70%]`}
                ></div>
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm">Regular</h3>
                <p className="text-xs">Regular Fare</p>
              </div>
            </label>
            <Tooltip text="Valid only for Students above 12 years old.Valid student Id card or student Visa (if applicable) are required to avail this">
              <label
                className={`border ${
                  selectedValue === 'Student'
                    ? 'border-blue-600 text-blue-500'
                    : 'border-gray-300'
                } radio py-2 pr-3 transition-all ease-in-out duration-200  flex items-center justify-center space-x-3 rounded-lg  cursor-pointer`}
              >
                <input
                  type="radio"
                  name="radio"
                  value="Student"
                  className="peer hidden"
                  onChange={handleChange}
                />
                <div
                  className={`${
                    selectedValue === 'Student'
                      ? 'border-blue-500'
                      : 'border-gray-500'
                  } bg-white transition-all ease-in-out duration-200  border-2  h-5 w-5 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'Student' ? 'bg-blue-500' : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[70%] h-[70%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm">Student</h3>
                  <p className="text-xs">up to Rs.300 off</p>
                </div>
              </label>
            </Tooltip>
            <Tooltip text="Applicable for Senior Citizens above 60 years age.A valid proof of Date of Birth is required at the airport to avail this.">
              <label
                className={`border ${
                  selectedValue === 'SeniorCitizen'
                    ? 'border-blue-600 text-blue-500'
                    : 'border-gray-300'
                } radio pr-3 py-2 transition-all ease-in-out duration-200  flex items-center justify-center space-x-3 rounded-lg  cursor-pointer`}
              >
                <input
                  type="radio"
                  name="radio"
                  value="SeniorCitizen"
                  className="peer hidden"
                  onChange={handleChange}
                />
                <div
                  className={`${
                    selectedValue === 'SeniorCitizen'
                      ? 'border-blue-500'
                      : 'border-gray-500'
                  } bg-white transition-all  ease-in-out duration-200 border-2  h-5 w-5 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'SeniorCitizen'
                        ? 'bg-blue-500'
                        : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[70%] h-[70%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm">Senior citizen</h3>
                  <p className="text-xs">up to Rs.600 off</p>
                </div>
              </label>
            </Tooltip>
            <Tooltip text="Applicable only for serving/retired army personnel and their dependents.A valid Armed Force ID is required at the airport to avail this.">
              <label
                className={`border ${
                  selectedValue === 'Army'
                    ? 'border-blue-600 text-blue-500'
                    : 'border-gray-300'
                } radio pr-3 py-2 transition-all ease-in-out duration-200  flex items-center justify-center space-x-3 rounded-lg  cursor-pointer`}
              >
                <input
                  type="radio"
                  name="radio"
                  value="Army"
                  className="peer hidden"
                  onChange={handleChange}
                />
                <div
                  className={`${
                    selectedValue === 'Army'
                      ? 'border-blue-500'
                      : 'border-gray-500'
                  } bg-white transition-all ease-in-out duration-200 border-2  h-5 w-5 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'Army' ? 'bg-blue-500' : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[70%] h-[70%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm">Armed Forces</h3>
                  <p className="text-xs">up to Rs.600 off</p>
                </div>
              </label>
            </Tooltip>
            <Tooltip text="Applicable only for medical personnel.A valid ID proof is required at the airport to avail this.">
              <label
                className={`border ${
                  selectedValue === 'Doctor'
                    ? 'border-blue-600 text-blue-500'
                    : 'border-gray-300'
                } radio pr-3 py-2 transition-all ease-in-out duration-200  flex items-center justify-center space-x-3 rounded-lg  cursor-pointer`}
              >
                <input
                  type="radio"
                  name="radio"
                  value="Doctor"
                  className="peer hidden"
                  onChange={handleChange}
                />
                <div
                  className={`${
                    selectedValue === 'Doctor'
                      ? 'border-blue-500'
                      : 'border-gray-500'
                  } bg-white transition-all ease-in-out duration-200 border-2  h-5 w-5 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'Doctor' ? 'bg-blue-500' : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[70%] h-[70%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-sm">Doctor and Nurses</h3>
                  <p className="text-xs">up to Rs.600 off</p>
                </div>
              </label>
            </Tooltip>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="absolute bottom-[-20px] text-2xl py-2 font-PlusJakartaSans rounded-3xl font-extrabold  mt-4 transition-all ease-in-out duration-300  bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600 text-white px-12 "
          >
            SEARCH
          </button>
        </div>
      </form>
      <ModalManager
        activeModal={activeModal || ''}
        closeModal={closeModal}
      />
      
    </div>
  );
}

export default Hero;
