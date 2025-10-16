import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "Search", value, onChange }) => {
  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 rounded-[14px] bg-[#053256] text-white text-opacity-70 placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-vanta-neon-blue w-56 text-base font-outfit"
      />
      <Search className="absolute left-3 text-[#00eeee]" size={20} />
    </div>
  );
};

export default SearchInput;