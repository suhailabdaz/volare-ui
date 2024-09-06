import React, { useEffect, useState, useCallback } from 'react';
import { useGetChartedFlightQuery } from '../../../../redux/apis/userApiSlice';
import Cockpit from '../../../../assets/images/ic_flightSmallFront.1e0e0ad4.png';
import {
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { setFareBreakdown } from '../../../../redux/slices/bookingSlice';
import { RootState } from '../../../../redux/store/store';

type ClassType = 'Economy' | 'Business' | 'FirstClass';
type SeatClass = 'economyClass' | 'businessClass' | 'firstClass';

interface DataProps {
  flightChartId: string;
  classType: ClassType;
  travellers: { _id: string; firstName: string; lastName: string }[];
  bookingData: any;
  onSeatSelected: (
    newSelectedSeats: {
      seatNumber: string;
      travellerId: string;
      class: SeatClass;
      isPaid: boolean;
    }[]
  ) => void;
  onFareUpdate: (additionalFare: number) => void;
}

interface Seat {
  number: string;
  isAvailable: boolean;
  position: 'window' | 'middle' | 'aisle';
  isPaid: boolean;
}

type IconType = 'available' | 'paid' | 'selected' | 'unavailable' | 'free';

interface SeatIconProps {
  iconType: IconType;
}

interface Row {
  row: string;
  seats: Seat[];
}

const SeatLayout: React.FC<DataProps> = ({
  flightChartId,
  classType,
  travellers,
  onSeatSelected,
  onFareUpdate,
}) => {
  const {
    data: scheduleData,
    isLoading,
    error: chartError,
  } = useGetChartedFlightQuery(flightChartId, {
    refetchOnMountOrArgChange: true,
  });

  const [seatLayout, setSeatLayout] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<
    {
      seatNumber: string;
      travellerId: string;
      class: SeatClass;
      isPaid: boolean;
    }[]
  >([]);
  const [additionalFare, setAdditionalFare] = useState(0);
  const dispatch = useDispatch();
  const fareBreakdown = useSelector((state: RootState) => state.BookingAuth.fareBreakdown);

  const updateFareBreakdown = useCallback((newExtraCharges: number) => {
    console.log("newxtra", newExtraCharges);
    
    if (fareBreakdown) {
      const updatedFareBreakdown = {
        ...fareBreakdown,
        extraCharges: newExtraCharges,
      };
      console.log("newfares", updatedFareBreakdown);

      dispatch(setFareBreakdown({ FareBreakdown: updatedFareBreakdown }));
    }
  }, [fareBreakdown, dispatch]);


  const addPaidSeatFeature = useCallback(
    (originalSeatLayout: any) => {
      const updatedSeatLayout = JSON.parse(JSON.stringify(originalSeatLayout));
      const seatClass = mapClassType(classType);
      let freeSeatsCount = 0;

      updatedSeatLayout[seatClass] = updatedSeatLayout[seatClass].map(
        (row: Row) => {
          const updatedRow = {
            ...row,
            seats: row.seats.map((seat: Seat) => {
              if (seat.isAvailable) {
                if (freeSeatsCount < 10) {
                  freeSeatsCount++;
                  return { ...seat, isPaid: false };
                } else {
                  return { ...seat, isPaid: true };
                }
              }
              return seat;
            }),
          };
          return updatedRow;
        }
      );

      return updatedSeatLayout;
    },
    [classType]
  );

  useEffect(() => {
    if (scheduleData) {
      console.log('Seat Layout Data:', scheduleData.seatLayout);
      const updatedSeatLayout = addPaidSeatFeature(scheduleData.seatLayout);
      setSeatLayout(updatedSeatLayout);
    }
  }, [scheduleData, addPaidSeatFeature]);

  useEffect(() => {
    // Automatically select free seats if no seats are selected
    if (selectedSeats.length === 0 && seatLayout) {
      const seatClass = mapClassType(classType);
      const freeSeats = getFreeSeats(seatLayout[seatClass]);
      const autoSelectedSeats = freeSeats
        .slice(0, travellers.length)
        .map((seat, index) => ({
          seatNumber: seat.number,
          travellerId: travellers[index]._id,
          class: seatClass,
          isPaid: false,
        }));
      setSelectedSeats(autoSelectedSeats);
      onSeatSelected(autoSelectedSeats);
    }
  }, [seatLayout, travellers, classType, onSeatSelected]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (chartError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading seat layout
      </div>
    );
  }

  const getFreeSeats = (rows: Row[]) => {
    return rows.flatMap((row) =>
      row.seats.filter((seat) => seat.isAvailable && !seat.isPaid)
    );
  };

  const mapClassType = (type: ClassType): SeatClass => {
    if (type === 'Economy') return 'economyClass';
    if (type === 'Business') return 'businessClass';
    return 'firstClass';
  };

    const handleSeatClick = useCallback((seatNumber: string, isPaid: boolean) => {
    setSelectedSeats((prevSelectedSeats) => {
      const existingSeatIndex = prevSelectedSeats.findIndex(
        (seat) => seat.seatNumber === seatNumber
      );

      let newSelectedSeats;
      let newAdditionalFare;

      if (existingSeatIndex !== -1) {
        // Deselecting a seat
        newSelectedSeats = prevSelectedSeats.filter(
          (seat) => seat.seatNumber !== seatNumber
        );
        newAdditionalFare = isPaid ? additionalFare - 500 : additionalFare;
      } else if (prevSelectedSeats.length < travellers.length) {
        // Selecting a new seat
        const availableTravellerId = travellers.find(
          (traveller) =>
            !prevSelectedSeats.some((seat) => seat.travellerId === traveller._id)
        )?._id;

        if (availableTravellerId) {
          const newSeat = {
            seatNumber,
            travellerId: availableTravellerId,
            class: mapClassType(classType),
            isPaid,
          };
          newSelectedSeats = [...prevSelectedSeats, newSeat];
          newAdditionalFare = isPaid ? additionalFare + 500 : additionalFare;
        } else {
          return prevSelectedSeats; // No change if no available traveller
        }
      } else {
        return prevSelectedSeats; // No change if all travellers have seats
      }

      // Update state and trigger callbacks
      setAdditionalFare(newAdditionalFare);
      onSeatSelected(newSelectedSeats);
      onFareUpdate(newAdditionalFare);
      updateFareBreakdown(newAdditionalFare);

      return newSelectedSeats;
    });
  }, [travellers, classType, additionalFare, onSeatSelected, onFareUpdate, updateFareBreakdown, mapClassType]);

  

  const SeatIcon: React.FC<SeatIconProps> = ({ iconType }) => {
    switch (iconType) {
      case 'available':
        return null;
      case 'paid':
        return null;
      case 'free':
        return null;
      case 'selected':
        return <CheckIcon className="text-white w-6 h-6 text-sm" />;
      case 'unavailable':
        return <XMarkIcon className="text-gray-300 w-8 h-10 text-sm" />;
      default:
        return null;
    }
  };

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.some(
      (selectedSeat) => selectedSeat.seatNumber === seat.number
    );
    const getSeatIcon = () => {
      if (!seat.isAvailable) return 'unavailable';
      if (isSelected) return 'selected';
      if (seat.isPaid) return 'paid';
      if (seat.isAvailable && !seat.isPaid) return 'free';
      return 'available';
    };
    return (
      <div
        className={`w-8 h-10 flex items-center justify-center text-xs font-bold rounded
          ${
            seat.isAvailable && !isSelected && !seat.isPaid
              ? 'bg-green-300 border-b-gray-800 border-b-4 text-gray-800 cursor-pointer hover:bg-green-500'
              : ''
          }
          ${
            seat.isAvailable && !isSelected && seat.isPaid
              ? 'bg-purple-300 border-b-gray-800 border-b-4 text-gray-800 cursor-pointer hover:bg-purple-500'
              : ''
          }
          ${
            seat.isAvailable && isSelected
              ? 'bg-blue-500  border-2 border-blue-500 cursor-pointer'
              : ''
          }
          ${
            !seat.isAvailable
              ? 'bg-white border border-black cursor-not-allowed'
              : ''
          }
        `}
        title={`Seat ${seat.number}${
          !seat.isAvailable ? ' - Not Available' : ''
        }${seat.isPaid ? ' - ₹ 500' : ' - Free'}`}
        onClick={() =>
          seat.isAvailable && handleSeatClick(seat.number, seat.isPaid)
        }
      >
        <span className=" flex items-center justify-center">
          <SeatIcon iconType={getSeatIcon()} />
        </span>
      </div>
    );
  };

  const inferConfiguration = (seats: Seat[]): number[] => {
    const config: number[] = [];
    let currentGroup = 0;

    for (let i = 0; i < seats.length; i++) {
      currentGroup++;
      if (seats[i].position === 'aisle') {
        if (i < seats.length - 1 && seats[i + 1].position === 'aisle') {
          config.push(currentGroup);
          currentGroup = 0;
        } else if (
          i === seats.length - 1 ||
          seats[i + 1].position === 'window'
        ) {
          config.push(currentGroup);
          currentGroup = 0;
        }
      }
    }

    if (currentGroup > 0) {
      config.push(currentGroup);
    }

    return config;
  };

  const renderRow = (row: Row) => {
    const configuration = inferConfiguration(row.seats);
    let seatIndex = 0;

    return (
      <div className="flex mb-3 items-center">
        {configuration.map((groupSize, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <div className="w-8 " />}
            <div className="flex">
              {Array.from({ length: groupSize }).map((_, seatInGroupIndex) => {
                const seat = row.seats[seatIndex];
                seatIndex++;
                return (
                  <React.Fragment key={seatInGroupIndex}>
                    {renderSeat(seat)}
                    {seatInGroupIndex < groupSize - 1 && (
                      <div className="w-2" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderSeatClass = (seatClass: SeatClass) => {
    if (!seatLayout) return null;

    return (
      <div className="bg-transparent mr-9">
        <div className="w-full ">
          <img src={Cockpit} className="w-full max-h-56" alt="Cockpit" />
        </div>
        <div className="bg-white">
          <h3 className="text-lg font-bold mb-4 text-center capitalize">
            {seatClass.replace('Class', ' Class')}
          </h3>
          <div className="flex flex-col items-center">
            {seatLayout[seatClass].map((row: Row, rowIndex: number) => (
              <React.Fragment key={rowIndex}>{renderRow(row)}</React.Fragment>
            ))}
          </div>
        </div>
        <div className="bg-white h-20 w-full"></div>
      </div>
    );
  };

  return (
    <div className="w-[99%] bg-purple-100 mr-3 flex justify-between items-start rounded p-6 shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans max-h-[600px] overflow-y-auto">
      <div className="w-2/5 sticky top-12 space-y-20 justify-start">
        <div className="mt-4  w-full  mr-5  bg-gray-100 rounded-xl p-2 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
          {travellers.map(
            (
              traveller: {
                _id: string;
                firstName: string;
                lastName: string;
              },
              index
            ) => (
              <div key={index} className="m-5 items-center ">
                <div className="flex justify-between items-center">
                  <div className="flex justify-start space-x-1">
                    <h4 className="text-base font-bold ">
                      {traveller.firstName || ''}{' '}
                    </h4>
                    <h4 className="text-base font-bold ">
                      {traveller.lastName || ''}{' '}
                    </h4>
                  </div>
                  {selectedSeats.find(
                    (seat) => seat.travellerId === traveller._id
                  ) ? (
                    <p className="px-4 bg-white border text-sm border-black rounded">
                      {
                        selectedSeats.find(
                          (seat) => seat.travellerId === traveller._id
                        )?.seatNumber
                      }
                    </p>
                  ) : (
                    <p className="">none</p>
                  )}
                </div>
                {selectedSeats.find(
                  (seat) => seat.travellerId === traveller._id
                ) ? (
                  <p className="text-xs font-bold">
                    {selectedSeats.find(
                      (seat) => seat.travellerId === traveller._id
                    )?.isPaid
                      ? 'Paid (₹ 500)'
                      : 'Free'}
                  </p>
                ) : (
                  <p className="text-xs">No Seat Selected</p>
                )}
              </div>
            )
          )}
        </div>
        <div className=" w-[60%] px-5 py-4 bg-white space-y-4">
        <div className="flex  justify-start space-x-10 items-center  h-full w-full">
        <div
              className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded bg-white border border-black cursor-not-allowed `}
            >
              <span className=" flex items-center justify-center">
                <XMarkIcon className="text-gray-300 w-6 h-8 text-sm" />
              </span>
            </div>
            <p className='font-PlusJakartaSans text-sm'>Unavailable</p>

          </div>
          <div className="flex  justify-start space-x-10 items-center  h-full w-full">
        <div
              className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded bg-blue-500 border border-blue-500  `}
            >
              <span className=" flex items-center justify-center">
              <CheckIcon className="text-white w-5 h-5 text-sm" />
              </span>
            </div>
            <p className='font-PlusJakartaSans text-sm'>Selected</p>

          </div>
          <div className="flex  justify-start space-x-10 items-center  h-full w-full">
            <div
              className={`w-6 h-6 bg-green-300 border-b-gray-800 border-b-4 text-gray-800  `}
            >
            
            </div>
            <p className='font-PlusJakartaSans text-sm'>Free</p>

          </div>
          <div className="flex  justify-start space-x-10 items-center  h-full w-full">
            <div
              className={`w-6 h-6 bg-purple-300 border-b-gray-800 border-b-4 text-gray-800  `}
            >
            
            </div>
            <p className='font-PlusJakartaSans text-sm'> ₹ 500</p>

          </div>
          <div className="flex justify-between items-center  h-full w-full"></div>
        </div>
      </div>
      {renderSeatClass(mapClassType(classType))}
    </div>
  );
};

export default SeatLayout;
