import { IconSearch } from '../assets';

export function SearchBar() {
  return (
    <div className="flex items-center bg-[#EAECEF] rounded-full px-4 py-2 w-72 mb-[10px] transition-colors focus-within:bg-gray-200">
      <img src={IconSearch} alt="Search" className="w-4 h-4 mr-2 opacity-60" />
      <input
        type="text"
        placeholder="Search question"
        className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder-gray-500 font-medium"
      />
    </div>
  );
}
