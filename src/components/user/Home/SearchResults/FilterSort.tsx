import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import Sun from '../../../../assets/images/sun.png';
import Moon from '../../../../assets/images/night.png';
import Cloudy from '../../../../assets/images/cloudy-day.png';

interface TimeOptionProps {
  label: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

interface AirlineOptionProps {
  airline: string;
  selectedAirlines: string[];
  onChange: (airline: string) => void;
}

function Sidebar() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [departureTime, setDepartureTime] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

  const STEP = 100;
  const MIN = 0;
  const MAX = 10000;

  const airlines: string[] = ['Air India', 'IndiGo'];

  const TimeOption: React.FC<TimeOptionProps> = ({
    label,
    value,
    selectedValue,
    onChange,
  }) => (
    <div
      className={`p-2 mb-2 font-PlusJakartaSans w-[30%] text-[0.6rem] space-y-2  rounded-lg cursor-pointer ${
        selectedValue === value ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
      onClick={() => onChange(value)}
    >
      {' '}
      <div className="flex justify-center">
        <img
          className="h-6"
          src={value === 'early' ? Sun : value === 'noon' ? Cloudy : Moon}
          alt={value === 'early' ? 'Sun' : value === 'noon' ? 'Cloudy' : 'Moon'}
        />
      </div>
      <div className="flex justify-center">{label}</div>
    </div>
  );

  const AirlineOption: React.FC<AirlineOptionProps> = ({
    airline,
    selectedAirlines,
    onChange,
  }) => (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        id={airline}
        checked={selectedAirlines.includes(airline)}
        onChange={() => onChange(airline)}
        className="mr-2"
      />
      <label htmlFor={airline}>{airline}</label>
    </div>
  );

  const handleAirlineChange = (airline: string) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  return (
    <div className="bg-[#FFFF] h-auto mb-7 rounded-2xl w-[100%] left-0 top-10 sticky shadow-custom font-PlusJakartaSans">
      <div className="p-6">
        <h1 className="font-bold text-lg mb-4">Popular filters</h1>

        <div className="mb-4">
          <h2 className="font-semibold text-sm mb-1">Price Range</h2>
          <Range
            values={priceRange}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => setPriceRange(values as [number, number])}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: '36px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '5px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                      values: priceRange,
                      colors: ['#FFFFFF', '#A020F0', '#FFFFFF'],
                      min: MIN,
                      max: MAX,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '20px',
                  width: '20px',
                  borderRadius: '4px',
                  backgroundColor: '#FFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0px 2px 6px #AAA',
                }}
              >
                <div
                  style={{
                    height: '16px',
                    width: '5px',
                    backgroundColor: isDragged ? '#548BF4' : '#CCC',
                  }}
                />
              </div>
            )}
          />
          <div className="flex justify-between text-sm font-bold mt-1">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <h2 className="font-semibold text-sm mb-2 ">Departure Time</h2>
        <div className="mb-4 flex justify-start space-x-2">
          <TimeOption
            label="6 AM - 12 AM"
            value="early"
            selectedValue={departureTime}
            onChange={setDepartureTime}
          />
          <TimeOption
            label="After 6 PM"
            value="late"
            selectedValue={departureTime}
            onChange={setDepartureTime}
          />
        </div>

        <h2 className="font-semibold text-[0.6rem] mb-3 ">Arrival Time</h2>
        <div className="mb-4 flex justify-start space-x-2">
          <TimeOption
            label="6 AM - 12 AM"
            value="early"
            selectedValue={arrivalTime}
            onChange={setArrivalTime}
          />
          <TimeOption
            label="12 PM - 6 AM"
            value="noon"
            selectedValue={arrivalTime}
            onChange={setArrivalTime}
          />
          <TimeOption
            label="AFTER 6 PM"
            value="late"
            selectedValue={arrivalTime}
            onChange={setArrivalTime}
          />
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-sm mb-1">Airlines</h2>
          {airlines.map((airline) => (
            <AirlineOption
              key={airline}
              airline={airline}
              selectedAirlines={selectedAirlines}
              onChange={handleAirlineChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
