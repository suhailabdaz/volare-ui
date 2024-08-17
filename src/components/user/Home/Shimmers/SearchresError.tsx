
function SearchresShimmer({ fetch }: { fetch: () => any }) {
  return (
    <div className="flex justify-center font-PlusJakartaSans  mb-7" id="profile">
      <div className="bg-white w-[90%] shadow-custom rounded-xl ">
        <div className="px-10 py-6">
          <div className="mt-8 flex justify-center items-center min-h-[60vh] text-gray-600 text-xs">
            <button className='font-PlusJakartaSans1000 text-xl underline' onClick={()=>fetch()}>Try again</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchresShimmer;
