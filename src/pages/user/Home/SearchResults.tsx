import { useEffect, useState } from 'react';
import FilterSort from '../../../components/user/Home/SearchResults/FilterSort';
import FlightResults from '../../../components/user/Home/SearchResults/FlightResults';
import ProfileShimmer from '../../../components/user/Home/Shimmers/ProfileShimmer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';

function SearchResults() {
  
  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      <PrNavbar />
      <div className="flex mx-[11%]">
        <div className="w-1/4 ">
          <FilterSort />
        </div>
        <div className="w-3/4">
          <FlightResults />
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
