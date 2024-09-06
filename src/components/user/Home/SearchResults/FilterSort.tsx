import React, { useState, useEffect, useCallback } from 'react';
import { Range, getTrackBackground } from 'react-range';
import Sun from '../../../../assets/images/sun.png';
import Moon from '../../../../assets/images/night.png';
import Cloudy from '../../../../assets/images/cloudy-day.png';

interface TimeOptionProps {
  label: string;
  value: string;
  selectedValue: string | null;
  onChange: (value: string | null) => void;
}

interface FilterSortProps {
  schedules: any[]; 
  onFilterChange: (filters: any) => void; 
}

function FilterSort({ schedules, onFilterChange }: FilterSortProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [departureTime, setDepartureTime] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const prices = schedules.flatMap(schedule => [
        schedule.currentPrices.economy,
        schedule.currentPrices.business,
        schedule.currentPrices.firstClass
      ]);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [schedules]);

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      priceRange,
      departureTime,
      arrivalTime,
    });
  }, [priceRange, departureTime, arrivalTime, onFilterChange]);

  useEffect(() => {
    handleFilterChange();
  }, [priceRange, departureTime, arrivalTime, handleFilterChange]);

  const STEP = 100;

  const TimeOption: React.FC<TimeOptionProps> = React.memo(({
    label,
    value,
    selectedValue,
    onChange,
  }) => (
    <div
      className={`p-2 mb-2 font-PlusJakartaSans w-[30%] text-[0.6rem] space-y-2 rounded-lg cursor-pointer ${
        selectedValue === value ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
      onClick={() => onChange(selectedValue === value ? null : value)}
    >
      <div className="flex justify-center">
        <img
          className="h-6"
          src={value === 'early' ? Sun : value === 'noon' ? Cloudy : Moon}
          alt={value === 'early' ? 'Sun' : value === 'noon' ? 'Cloudy' : 'Moon'}
        />
      </div>
      <div className="flex justify-center">{label}</div>
    </div>
  ));

  return (
    <div className="bg-[#FFFF] h-auto mb-7 rounded-xl w-full left-0 top-10 sticky shadow-custom font-PlusJakartaSans">
      <div className="p-6">
        <h1 className="font-bold text-lg mb-4">Popular filters</h1>

        <div className="mb-4">
          <h2 className="font-semibold text-sm mb-1">Price Range</h2>
          <Range
            values={priceRange}
            step={STEP}
            min={minPrice}
            max={maxPrice}
            onChange={(values) => setPriceRange(values as [number, number])}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center', 
                  width: '100%',
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '4px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                      values: priceRange,
                      colors: ['#FFFFFF', '#A020F0', '#FFFFFF'],
                      min: minPrice,
                      max: maxPrice,
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
                  borderRadius: '19px',
                  backgroundColor: 'white',
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
                    backgroundColor: isDragged ? 'white' : 'white',
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

        <h2 className="font-semibold text-sm mb-2">Departure Time</h2>
        <div className="mb-4 flex justify-start space-x-2">
          <TimeOption
            label="6 AM - 12 PM"
            value="early"
            selectedValue={departureTime}
            onChange={setDepartureTime}
          />
          <TimeOption
            label="12 PM - 6 PM"
            value="noon"
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

        <h2 className="font-semibold text-sm mb-2">Arrival Time</h2>
        <div className="mb-4 flex justify-start space-x-2">
          <TimeOption
            label="6 AM - 12 PM"
            value="early"
            selectedValue={arrivalTime}
            onChange={setArrivalTime}
          />
          <TimeOption
            label="12 PM - 6 PM"
            value="noon"
            selectedValue={arrivalTime}
            onChange={setArrivalTime}
          />
          <TimeOption
            label="After 6 PM"
            value="late"
            selectedValue={arrivalTime}
            onChange={setArrivalTime}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(FilterSort);