import React, { useEffect, useState } from 'react';
import { useGetChartedFlightQuery } from '../../../../redux/apis/userApiSlice';
import Cockpit from '../../../../assets/images/ic_flightSmallFront.1e0e0ad4.png';
import socket from '../../../../utils/socket/socket';

interface DataProps {
  flightChartId: string;
  classType: 'Economy' | 'Business' | 'FirstClass';
  travellers: { _id: string; firstName: string; lastName: string }[];
  bookingData: any;
  onSeatSelected: (
    newSelectedSeats: {
      seatNumber: string;
      travellerId: string;
      class: 'economyClass' | 'businessClass' | 'firstClass';
    }[]
  ) => void;
}

interface Seat {
  number: string;
  isAvailable: boolean;
  position: 'window' | 'middle' | 'aisle';
}

interface Row {
  row: string;
  seats: Seat[];
}

const SeatLayout: React.FC<DataProps> = ({
  flightChartId,
  classType,
  travellers,
  bookingData,
  onSeatSelected,
}) => {
  const {
    data: scheduleData,
    isLoading,
    error: chartError,
  } = useGetChartedFlightQuery(flightChartId,{
    refetchOnMountOrArgChange:true
  });
  const [selectedSeats, setSelectedSeats] = useState<
    {
      seatNumber: string;
      travellerId: string;
      class: 'economyClass' | 'businessClass' | 'firstClass';
    }[]
  >([]);

  // useEffect(()=>{
  //   socket.emit('join-flight', flightChartId);

  //   socket.on('seat-update', (updatedSeats) => {
  //     // setSeats(updatedSeats);
  //   });

  //   // fetchSeatData();

  //   return () =>{
  //     socket.disconnect();
  //   }
  // }, [flightChartId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }
  useEffect(() => {
    if (scheduleData) {
      console.log('Seat Layout Data:', scheduleData.seatLayout);
    }
  }, [scheduleData]);

  if (chartError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading seat layout
      </div>
    );
  }

  const mapClassType = (
    type: 'Economy' | 'Business' | 'FirstClass'
  ): 'economyClass' | 'businessClass' | 'firstClass' => {
    if (type === 'Economy') return 'economyClass';
    if (type === 'Business') return 'businessClass';
    return 'firstClass';
  };

  const handleSeatClick = (seatNumber: string) => {
    const existingSeatIndex = selectedSeats.findIndex(
      (seat) => seat.seatNumber === seatNumber
    );
    console.log(travellers);

    if (existingSeatIndex !== -1) {
      const newSelectedSeats = selectedSeats.filter(
        (seat) => seat.seatNumber !== seatNumber
      );
      setSelectedSeats(newSelectedSeats);
      onSeatSelected(newSelectedSeats);
    } else if (selectedSeats.length < travellers.length) {
      const availableTravellerId = travellers.find(
        (traveller) =>
          !selectedSeats.some((seat) => seat.travellerId === traveller._id)
      )?._id;

      if (availableTravellerId) {
        const newSeat = {
          seatNumber,
          travellerId: availableTravellerId,
          class: mapClassType(classType),
        };
        const newSelectedSeats = [...selectedSeats, newSeat];
        setSelectedSeats(newSelectedSeats);
        onSeatSelected(newSelectedSeats);
      }
    }
  };

  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.some(
      (selectedSeat) => selectedSeat.seatNumber === seat.number
    );

    return (
      <div
        className={`w-8 h-12 flex items-center justify-center text-xs font-bold  rounded
          ${
            seat.isAvailable && !isSelected
              ? 'bg-blue-500 border-blue-500 border-2 text-white cursor-pointer hover:bg-blue-300'
              : ''
          }
          ${
            seat.isAvailable && isSelected
              ? 'bg-white text-green-500 border-2 border-green-500 cursor-pointer'
              : ''
          }
          ${!seat.isAvailable ? 'bg-gray-400 text-white cursor-not-allowed' : ''}
        `}
        title={`Seat ${seat.number}${!seat.isAvailable ? ' - Not Available' : ''}`}
        onClick={() => seat.isAvailable && handleSeatClick(seat.number)}
        >
        {seat.number}
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
            {groupIndex > 0 && <div className="w-8 " />}{' '}
            {/* Space between seat groups */}
            <div className="flex">
              {Array.from({ length: groupSize }).map((_, seatInGroupIndex) => {
                const seat = row.seats[seatIndex];
                seatIndex++;
                return (
                  <React.Fragment key={seatInGroupIndex}>
                    {renderSeat(seat)}
                    {seatInGroupIndex < groupSize - 1 && (
                      <div className="w-2" />
                    )}{' '}
                    {/* Small gap between seats in a group */}
                  </React.Fragment>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderSeatClass = (
    seatClass: 'economyClass' | 'businessClass' | 'firstClass'
  ) => {
    return (
      <div className=" bg-transparent mr-9">
        <div className="w-full ">
          <img src={Cockpit} className="w-full max-h-56" />
        </div>
        <div className="bg-white">
          <h3 className="text-lg font-bold mb-4 text-center capitalize">
            {seatClass.replace('Class', ' Class')}
          </h3>
          <div className="flex flex-col items-center">
            {scheduleData.seatLayout[seatClass].map(
              (row: Row, rowIndex: number) => (
                <React.Fragment key={rowIndex}>{renderRow(row)}</React.Fragment>
              )
            )}
          </div>
        </div>
        <div className="bg-white h-20 w-full"></div>
      </div>
    );
  };

  return (
    <div className="w-[99%] bg-purple-100 mr-3 flex justify-between items-start rounded p-6 shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans max-h-[600px] overflow-y-auto">
      <div className="mt-4 sticky w-2/5 mr-5 top-12 bg-gray-100 rounded-xl p-2 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
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
                <p className="text-xs font-bold">Free</p>
              ) : (
                <p className="text-xs">No Seat Selected</p>
              )}
            </div>
          )
        )}
      </div>
      {renderSeatClass(mapClassType(classType))}
    </div>
  );
};

export default SeatLayout;
