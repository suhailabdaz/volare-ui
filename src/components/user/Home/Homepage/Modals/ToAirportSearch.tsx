import React, { useState, useEffect, useRef } from 'react';
import { useGetsearchAirportsQuery } from '../../../../../redux/apis/userApiSlice';
import airportImage from '../../../../../assets/images/departure (1).png'
import { useDispatch } from 'react-redux';
import { setToAirport } from '../../../../../redux/slices/HeroSlice';

interface Airport {
  _id: string;
  airport_code: string;
  city: string;
  country: string;
  airport_name: string;
}

interface ModalProps {
  closeModal: () => any;
}

const ToAirportSearch: React.FC<ModalProps> = ({ closeModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch()

  const { data, isLoading, error } = useGetsearchAirportsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAirport = (airport: Airport) => {
    dispatch(setToAirport(airport)); 
    closeModal();
  };

  const filteredAirports = Array.isArray(data?.airports)
    ? data.airports.filter((airport: Airport) =>
        airport.airport_name.toLowerCase().includes(searchTerm.toLowerCase()) ||airport.airport_code.toLowerCase().includes(searchTerm.toLowerCase()) || airport.country.toLowerCase().includes(searchTerm.toLowerCase()) || airport.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="relative z-50">
      <div className="absolute -bottom-32 left-[19rem] w-[300px]   bg-white rounded-lg p-4 shadow-custom_shadow" ref={modalRef}>
        <div className="modal-body">
          <input
            type="text"
            placeholder="From"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            className="w-full p-2 mb-4 border border-gray-300 rounded outline-none"
          />
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading airports</p>}
          {filteredAirports.length > 0 ? (
            <ul className="airport-list space-y-2 overflow-y-auto h-64 ">
              {filteredAirports.map((airport: Airport) => (
                <li key={airport._id} onClick={() => handleSelectAirport(airport)} className="airport-item items-center cursor-pointer p-2 hover:bg-gray-100 rounded">
                  <div className='flex space-x-3 items-center justify-between'>
                  <div className='flex justify-start space-x-3 items-center'>
                      <img className='w-6 h-5' src={airportImage} />
                        <p className='text-sm'>{airport.city}, {airport.country}</p>
                      </div>
                      <div>
                      <p className='text-base mr-2 text-gray-500 font-PlusJakartaSans1000 text-right'>{airport.airport_code}</p>
                      </div>
                  </div>
                  <p className='text-xs ml-8 mr-2 text-gray-500 items-center  text-left'>{airport.airport_name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className='h-64'>
            <p>No airports found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToAirportSearch;
