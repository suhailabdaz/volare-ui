import { useState } from 'react';

interface TripStatus {
  upcoming: boolean;
  completed: boolean;
  cancelled: boolean;
  unsuccessful: boolean;
}

function MytripsList() {
  const [selectedStatus, setSelectedStatus] = useState<TripStatus>({
    upcoming: true,
    completed: false,
    cancelled: false,
    unsuccessful: false,
  });

  const handleStatusChange = (status: keyof TripStatus) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [status]: true,
      upcoming: status === 'upcoming',
      completed: status === 'completed',
      cancelled: status === 'cancelled',
      unsuccessful: status === 'unsuccessful',
    }));
  };

  return (
    <div
    className={`flex justify-center ${
      selectedStatus.upcoming
        ? 'bg-gradient-to-r from-[#5ee7cd] to-[#7dbfcc]'
        : selectedStatus.completed
        ? 'bg-gradient-to-r from-[#cfcfcf] to-[#afb3ba]'
        : selectedStatus.cancelled
        ? 'bg-gradient-to-r from-[#f3d452] to-[#f09819]'
        : selectedStatus.unsuccessful
        ? 'bg-gradient-to-r from-[#ff7f3f] to-[#ff3e5e]'
        : ''
    } h-full`}
  >
      <div className="bg-white mt-20  min-h-96 rounded-md shadow-custom_shadow w-full mx-[11%] p-6">
        <div className="flex w-full shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.1)] font-PlusJakartaSans1000 text-gray-600 text-lg  justify-between  pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.upcoming
                  ? ' border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('upcoming')}
            >
              UPCOMING
            </button>
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.completed
                  ? 'border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('completed')}
            >
              COMPLETED
            </button>
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.cancelled
                  ? 'border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('cancelled')}
            >
              CANCELLED
            </button>
            <button
              className={`px-4 py-2  transition-all duration-300 ${
                selectedStatus.unsuccessful
                  ? 'border-b-4 border-b-blue-600 '
                  : 'border-b-4 border-b-transparent'
              }`}
              onClick={() => handleStatusChange('unsuccessful')}
            >
              UNSUCCESSFUL
            </button>
          </div>
        </div>

        {/* Your content goes here */}
      </div>
    </div>
  );
}

export default MytripsList;