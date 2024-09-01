import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowsRightLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  setFromAirport,
  setToAirport,
  setDepartureDate,
  setReturnDate,
  setTripType,
  setSelectedValue,
  validateState,
} from '../../../../redux/slices/HeroSlice';
import { RootState } from '../../../../redux/store/store';
import ModalManager from '../Homepage/Modals/ModalManager';

const isEqual = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

const useStateChanged = () => {
  const searchState = useSelector((state: RootState) => ({
    tripType: state.HeroAuth.tripType,
    selectedValue: state.HeroAuth.selectedValue,
    classState: state.HeroAuth.classState,
    fromAirport: state.HeroAuth.fromAirport,
    toAirport: state.HeroAuth.toAirport,
    departureDate: state.HeroAuth.departureDate,
    returnDate: state.HeroAuth.returnDate,
    travellers: state.HeroAuth.travellers,
  }));

  const [initialState] = useState(searchState);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const stateHasChanged = !isEqual(initialState, searchState);
    setHasChanges(stateHasChanged);
  }, [searchState, initialState]);

  return hasChanges;
};

function SearchBar() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const returnDateInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const tripType = useSelector((state: RootState) => state.HeroAuth.tripType);
  const selectedValue = useSelector((state: RootState) => state.HeroAuth.selectedValue);
  const classState = useSelector((state: RootState) => state.HeroAuth.classState);
  const fromAirport = useSelector((state: RootState) => state.HeroAuth.fromAirport);
  const toAirport = useSelector((state: RootState) => state.HeroAuth.toAirport);
  const departureDate = useSelector((state: RootState) => state.HeroAuth.departureDate);
  const returnDate = useSelector((state: RootState) => state.HeroAuth.returnDate);
  const travellers = useSelector((state: RootState) => state.HeroAuth.travellers);
  const hasErrors = useSelector((state: RootState) => state.HeroAuth.hasErrors);

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const hasChanges = useStateChanged();

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleChange = (event: { target: { value: string } }) => {
    dispatch(setSelectedValue(event.target.value));
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const handleReturnDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == '') {
      const today = new Date();
      dispatch(
        setReturnDate({
          date: today.toISOString(),
          weekday: today.toLocaleDateString('en-US', { weekday: 'long' }),
        })
      );
    }
    const date = new Date(event.target.value);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    dispatch(
      setReturnDate({
        date: date.toISOString(),
        weekday: weekday,
      })
    );
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let date = new Date(event.target.value);
    if (isNaN(date.getTime())) {
      date = new Date();
    }

    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    dispatch(
      setDepartureDate({
        date: date.toISOString(),
        weekday: weekday,
      })
    );
  };

  const swap = () => {
    dispatch(setFromAirport(toAirport));
    dispatch(setToAirport(fromAirport));
  };

  const handleTripTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
          navigate(
            `/search/${fromAirport?._id}/${toAirport?._id}/${departureDate?.date}/${classState}/${travellers.adults}/${travellers.children}/${travellers.infants}/${selectedValue}/${tripType}${tripType === 'roundTrip' ? `/${returnDate?.date}` : ''}`
          );
        } catch (error) {
          toast.error('error occurred');
        } finally {
          setShouldSubmit(false);
        }
      }
    };

    submitFormIfValid();
  }, [hasErrors, shouldSubmit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasChanges) {
      dispatch(validateState());
      setShouldSubmit(true);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);

    return `
      <span class="text-white text-sm m-1 font-PlusJakartaSans1000">${day}</span>
      <span class="text-white text-xs">${month}'</span>
      <span class="text-white text-sm">${year}</span>
    `;
  };

  return (
    <div className="ml-[10%] font-PlusJakartaSans ">
      <form
        onSubmit={handleSubmit}
        className="p-6 relative rounded-xl"
      >
        <div className='flex space-x-3'>
          <div className="relative inline-block h-16 w-32 ">
            <select
              className="form-select block w-full py-5 px-3 border rounded-md bg-purple-900 text-white font-bold "
              name="tripType"
              value={tripType}
              onChange={handleTripTypeChange}
            >
              <option className='p-3 font-bold text-gray-700 bg-white hover:bg-gray-300' value="oneWay">One Way</option>
              <option className='p-3 font-bold text-gray-700 bg-white' value="roundTrip">Round Trip</option>
            </select>
          </div>
          <div className="flex items-start flex-wrap ">
            <button
              type="button"
              className="btn"
              onClick={() => {
                openModal('FromAirportSearch');
              }}
            >
              <div className="flex-1 min-w-[180px] max-w-[180px] h-16 border-2 bg-purple-900 rounded-lg border-gray-300">
                <label className="block text-white text-left px-2 pt-2 text-sm">
                  From
                </label>
                {fromAirport ? (
                  <h1 className="font-PlusJakartaSans1000 truncate text-white text-base ml-2 text-left">
                    {fromAirport?.city},{fromAirport?.country}
                  </h1>
                ) : (
                  <div>
                    <p className="p-2 text-gray-400 text-sm font-bold cursor-pointer">
                      Tap to select Airport.
                    </p>
                  </div>
                )}
              </div>
            </button>
            <div
              onClick={() => swap()}
              className="absolute top-[40px] left-[350px] h-6 w-6 cursor-pointer rounded-full justify-center flex items-center bg-purple-900 border-white border shadow-sm"
            >
              <ArrowsRightLeftIcon className="h-4 w-4 text-white" />
            </div>
            <button
              type="button"
              className="btn ml-9"
              onClick={() => {
                openModal('ToAirportSearch');
              }}
            >
              <div className="flex-1 min-w-[180px] max-w-[150px] h-16 border-2 bg-purple-900 rounded-lg border-gray-300">
                <label className="block text-white text-left px-2 pt-2 text-sm">
                  To
                </label>
                {toAirport ? (
                  <h1 className="font-PlusJakartaSans1000 text-white truncate text-base ml-2 text-left">
                    {toAirport?.city},{toAirport?.country}
                  </h1>
                ) : (
                  <div>
                    <p className="p-2 text-gray-400 text-sm font-bold cursor-pointer">
                      Tap to select Airport.
                    </p>
                  </div>
                )}
              </div>
            </button>
            <div
              onClick={() => handleParentDivClick()}
              className="flex-1 w-[130px] p-2 border-2 rounded-lg cursor-pointer bg-purple-900 mx-2 h-16 border-gray-300"
            >
              <label className="flex text-white items-end text-xs mb-1 ">
                Departure <ChevronDownIcon className="text-white h-3 ml-2" />
              </label>
              <input
                type="date"
                ref={dateInputRef}
                onChange={handleDateChange}
                className="border border-gray-300 rounded-md py-2 px-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
              />
              <div className=" text-white">
                {departureDate.date ? (
                  <div className="items-center flex">
                    <div className=' text-sm'> {departureDate.weekday?.slice(0,3)},</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatDate(departureDate.date),
                      }}
                    />
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
              className="flex-1 min-w-[130px] w-full p-2 border-2 rounded-lg cursor-pointer bg-purple-900 mr-2 h-16 border-gray-300"
            >
              <label className="flex text-white text-sm items-end">
                Return <ChevronDownIcon className="text-white h-3 ml-2" />
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
                  <div className=" text-white">
                    {returnDate?.date ? (
                      <div className="items-center flex">
                        <div className='text-sm'> {returnDate.weekday?.slice(0,3)},</div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatDate(returnDate.date),
                          }}
                        />
                      </div>
                    ) : (
                      <p className="p-2 text-white text-sm font-bold cursor-pointer">
                        Tap to add a Date.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="p-2 text-gray-400 text-xs font-bold cursor-pointer">
                    Tap to add Date.
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              className=""
              onClick={() => {
                openModal('TravAndClass');
              }}
            >
              <div
                onClick={() => openModal('TravAndClass')}
                className="flex-1 min-w-[160px] max-w-[160px] h-16 bg-purple-900 border rounded-lg border-white"
              >
                <label className="flex text-white text-left pt-2 px-2 text-sm items-end ">
                  Travellers & class
                  <ChevronDownIcon className="text-white h-3 ml-2" />
                </label>
                {travellers ? (
                  <div className='flex'>
                    <div className="flex items-end justify-start mb-2">
                      <div className="ml-2 mr-1 text-white font-PlusJakartaSans1000 text-xl">
                        {travellers.total}
                      </div>
                      <p className="text-white text-sm mb-1">nos,</p>
                    </div>
                    <div className="flex justify-start text-white items-center mx-3 mb-2 mt-1 text-md font-normal">
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
          <div className="flex justify-center">
          <button
            type="submit"
            disabled={!hasChanges}
            className={`absolute top-[24px] right-[200px] text-xl py-2 font-PlusJakartaSans rounded-xl font-extrabold transition-all ease-in-out duration-300 h-16 ${
              hasChanges
                ? 'bg-gradient-to-r from-pink-400 to-purple-600 text-white'
                : 'bg-gray-400 text-white cursor-not-allowed'
            } px-8 transition-all duration-200 delay-100`}
          >
            SEARCH
          </button>
        </div>
        </div>
        </div>
        <div className="flex items-center">
          <div>
            <p className="font-extrabold text-white text-xs mr-5 ">Fare-Type</p>
        
          </div>
          <div className="flex text-sm justify-between text-white  w-auto  mt-3 mb-4 space-x-4  select-none">
            <label
              className={`border ${
                selectedValue === 'Regular'
                  ? 'bg-purple-800'
                  : 'border-gray-300 '
              } transition-all  ease-in-out duration-200 radio pr-3 py-1 flex items-center justify-center space-x-3 rounded-lg  cursor-pointer`}
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
                } bg-white transition-all ease-in-out duration-200 border-2  h-3 w-3 rounded-full flex items-center justify-center `}
              >
                <div
                  className={`${
                    selectedValue === 'Regular' ? 'bg-blue-500' : 'bg-white'
                  } transition-all ease-in-out duration-200 rounded-full w-[80%] h-[80%]`}
                ></div>
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-xs">Regular</h3>
              </div>
            </label>
              <label
                className={`border ${
                  selectedValue === 'Student'
                    ? 'bg-purple-800 '
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
                  } bg-white transition-all ease-in-out duration-200  border-2  h-3 w-3 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'Student' ? 'bg-blue-500' : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[80%] h-[80%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs">Student</h3>
                </div>
              </label>
              <label
                className={`border ${
                  selectedValue === 'SeniorCitizen'
                    ? 'bg-purple-800 '
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
                  } bg-white transition-all  ease-in-out duration-200 border-2  h-3 w-3 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'SeniorCitizen'
                        ? 'bg-blue-500'
                        : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[80%] h-[80%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs">Senior citizen</h3>
                </div>
              </label>
              <label
                className={`border ${
                  selectedValue === 'Army'
                    ? 'bg-purple-800'
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
                  } bg-white transition-all ease-in-out duration-200 border-2  h-3 w-3 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'Army' ? 'bg-blue-500' : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[80%] h-[80%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs">Armed Forces</h3>
                </div>
              </label>
              <label
                className={`border ${
                  selectedValue === 'Doctor'
                    ? 'bg-purple-800 '
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
                  } bg-white transition-all ease-in-out duration-200 border-2  h-3 w-3 rounded-full flex items-center justify-center `}
                >
                  <div
                    className={`${
                      selectedValue === 'Doctor' ? 'bg-blue-500' : 'bg-white'
                    } transition-all ease-in-out duration-200 rounded-full w-[80%] h-[80%]`}
                  ></div>
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-xs">Doctor and Nurses</h3>
                </div>
              </label>
          </div>
        </div>

       
      </form>
      <ModalManager activeModal={activeModal || ''} closeModal={closeModal} />
    </div>
  );
}

export default SearchBar;