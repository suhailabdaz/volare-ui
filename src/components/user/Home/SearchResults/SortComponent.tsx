import React, { useState, useEffect } from 'react';
import Rupee from '../../../../assets/images/Cheapest.png';
import Fastest from '../../../../assets/images/Fastest.png';
import Popular from '../../../../assets/images/Popular.png';
import otherSort from '../../../../assets/images/otherSort.png';
import { useParams } from 'react-router-dom';


interface SortOptionProps {
  image: string;
  label: string;
  desc:string;
  isSelected: boolean;
  onClick: () => void;
}

interface Params {
  from: string;
  to: string;
  date: string;
  class: string;
}

const SortOption: React.FC<SortOptionProps> = ({ image, label,desc, isSelected, onClick }) => (
  <div className='font-PlusJakartaSans1000 text-sm font-bold  rounded-lg cursor-pointer w-1/4'>
  <div 
    className={`flex items-center  space-x-2  pl-2 py-2 rounded-t-lg ${isSelected ? 'bg-purple-100' : 'bg-gray-200'}   `}
    onClick={onClick}
  ><div className={`  rounded-md ${isSelected ? 'bg-purple-500' : 'bg-gray-300'}`}>
        <img src={image} alt={label} className="w-8  " />

  </div>
  <div>
  <span >{label}</span>
  <p className='font-PlusJakartaSans font-light text-xs'>{desc}</p>
  </div>
  </div>
  <div className={` rounded-b-lg  h-1 w-full ${isSelected ? 'bg-purple-500 ' : 'bg-gray-200'}`}></div>
  </div>
);

interface OptionType {
  id: string;
  label: string;
  desc:string;
  image: string;
}

export interface FlightInstance {
  _id?: string;
  scheduleId: string;
  flightId: string;
  airlineId: string;
  departureDate: Date;
  arrivalDate: Date;
  fromAirport_Id: string;
  toAirport_Id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  availableSeats: {
    economy: number;
    business: number;
    firstClass: number;
  };
  currentPrices: {
    economy: number;
    business: number;
    firstClass: number;
  };
  seatLayout: {
    economyClass: Row[];
    businessClass: Row[];
    firstClass: Row[];
  };
}

interface Seat {
  number: string;
  position: 'window' | 'middle' | 'aisle';
  isAvailable: boolean;
  userId?: string;
}

interface Row {
  row: number;
  seats: Seat[];
}

interface SortComponentProps {
  scheduleData: FlightInstance[];
  onSortChange: (sortedData: FlightInstance[]) => void;
}

const SortComponent: React.FC<SortComponentProps> = ({ scheduleData, onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>('popular');

  const params = useParams() as unknown as Params;
  // const getSortText = (option: string): string => {
  //   switch (option) {
  //     case 'cheapest':
  //       return `Flights sorted by Cheapest ${params.class}`;
  //     case 'fastest':
  //       return 'Flights sorted by Fastest';
  //     case 'popular':
  //       return 'Flights sorted by Popular';
  //     default:
  //       return 'Flights sorted by Popular';
  //   }
  // };
  const options: OptionType[] = [
    { id: 'cheapest', label: 'CHEAPEST',desc:'Best deals', image: Rupee },
    { id: 'fastest', label: 'FASTEST',desc:'Lightning!', image: Fastest },
    { id: 'popular', label: 'POPULAR',desc:'You may prefer', image: Popular },
    { id: 'otherSort', label: 'OTHER SORT',desc:'others', image: otherSort },

  ];

  useEffect(() => {
    sortData(selectedOption);
  }, [selectedOption, scheduleData]);

  const sortData = (option: string) => {
    let sortedData = [...scheduleData];

    switch (option) {
      case 'cheapest':
        sortedData.sort((a, b) => {
          const priceA = a.currentPrices[params.class.toLowerCase() as keyof typeof a.currentPrices];
          const priceB = b.currentPrices[params.class.toLowerCase() as keyof typeof b.currentPrices];
          return priceA - priceB;
        });
        break;
      case 'fastest':
        sortedData.sort((a, b) => {
          const durationA = parseDuration(a.duration);
          const durationB = parseDuration(b.duration);
          return durationA - durationB;
        });
        break;
      case 'popular':
        // No sorting for popular, keep original order
        break;
    }

    onSortChange(sortedData);
  };

  const parseDuration = (duration: string): number => {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="flex justify-center items-start mb-3">
      <div className="bg-white p-4 w-[90%] space-y-6 mx-4 shadow-[0,0,10px,rgb(0,0,0,0.1)]">
        <div className="flex justify-between space-x-4">
          {options.map((option) => (
            <SortOption
              key={option.id}
              image={option.image}
              label={option.label}
              desc={option.desc}
              isSelected={selectedOption === option.id}
              onClick={() => setSelectedOption(option.id)}
            />
          ))}
        </div>
        {/* <p className="text-base font-bold mb-3">{getSortText(selectedOption)}</p> */}
        </div>
    </div>
  );
};

export default SortComponent;