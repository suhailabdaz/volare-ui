import React from 'react';
import { useGetChartedFlightQuery } from '../../../../redux/apis/userApiSlice';

interface DataProps {
  flightChartId: string;
  classType: 'Economy' | 'Business' | 'FirstClass';
  travellers:[]
}

const SeatLayout: React.FC<DataProps> = ({ flightChartId, classType }) => {
  const { data: scheduleData, isLoading, error: chartError } = useGetChartedFlightQuery(flightChartId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (chartError) {
    return <div>Error loading seat layout</div>;
  }

  const mapClassType = (type: 'Economy' | 'Business' | 'FirstClass'): 'economyClass' | 'businessClass' | 'firstClass' => {
    if (type === 'Economy') return 'economyClass';
    if (type === 'Business') return 'businessClass';
    return 'firstClass';
  };

  const renderSeatClass = (seatClass: 'economyClass' | 'businessClass' | 'firstClass') => {
    return (
      <div className="">
        <h3 className="text-lg font-bold mb-2">{seatClass.replace('Class', ' Class')}</h3>
        <div className="flex flex-col items-center">
          {scheduleData.seatLayout[seatClass].map((row: any, rowIndex: number) => (
            <div key={rowIndex} className="flex mb-2">
              <span className="w-8 text-right mr-2">{row.row}</span>
              {row.seats.map((seat: any, seatIndex: number) => (
                <div
                  key={seatIndex}
                  className={`w-8 h-8 mx-1 flex items-center justify-center text-xs font-bold text-white
                    ${seat.isAvailable ? 'bg-blue-600 cursor-pointer hover:bg-blue-600' : 'bg-gray-400'}
                    ${seat.position === 'aisle' ? 'mr-5' : ''}
                  `}
                  title={`Seat ${seat.number}`}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white rounded w-[99%] shadow-[0_0_10px_rgba(0,0,0,0.2)] font-PlusJakartaSans p-5'>
      <h2 className=" text-2xl font-bold mb-4">Seat Layout</h2>
      {renderSeatClass(mapClassType(classType))} 
    </div>
  );
};

export default SeatLayout;
