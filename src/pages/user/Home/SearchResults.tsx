import FilterSort from '../../../components/user/Home/SearchResults/FilterSort';
import FlightResults from '../../../components/user/Home/SearchResults/FlightResults';
import SearchBar from '../../../components/user/Home/SearchResults/SearchBar';
import Image from '../../../assets/images/Premium Vector _ Abstract gradient purple and blue background.jpeg'
import PrNavbar from '../../../components/user/Home/Homepage/PrNavbar';

function SearchResults() {
  
  return (
    <div className="bg-[#f9f1fe] min-h-screen">
      <PrNavbar />
      <img src={Image} className=' w-full h-[40vh] absolute z-0 opacity-95' />
      <SearchBar/> 
      <div className="z-10 relative flex mx-[11%]">
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
