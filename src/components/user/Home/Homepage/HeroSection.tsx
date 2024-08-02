
function Hero() {
  return (
    <div className="mx-[13%] mt-8 p-6 pb-24">
      <h2 className="text-3xl font-bold mb-6">Book Your Flight</h2>
      <form className="bg-white p-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">From City</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select City</option>
              <option value="city1">City 1</option>
              <option value="city2">City 2</option>
              <option value="city3">City 3</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">To City</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select City</option>
              <option value="city1">City 1</option>
              <option value="city2">City 2</option>
              <option value="city3">City 3</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Departure Date</label>
            <input type="date" className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Number of Persons</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select Number</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
        <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 rounded">Search Flights</button>
      </form>
    </div>
  );
}

export default Hero;
