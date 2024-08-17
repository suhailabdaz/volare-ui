
function SearchresShimmer() {
  return (
    <div className="flex justify-center font-PlusJakartaSans  mb-7" id="profile">
      <div className="bg-white w-[90%] shadow-custom rounded-xl ">
        <div className="px-10 py-6">
          <div className="mt-8 text-gray-600 text-xs">
            <ul className="space-y-6">
              {Array.from({ length:7 }).map((_, index) => (
                <li key={index}>
                  <div className="mb-4 w-full flex space-x-10 items-center animate-pulse">
                    <div className="flex space-x-5 w-full items-center">
                      <div className="space-y-1 w-full">
                        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-48 h-4 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex space-x-4 justify-end">
                      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-12 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchresShimmer;
