import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search movies..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`relative flex items-center transition-all duration-300
                ${isFocused ? "ring-2 ring-primary-500/50" : ""}`}
    >
      <div className="absolute left-4 text-dark-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-xl
                 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500
                 transition-all duration-300"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 p-1 rounded-full text-dark-400 
                   hover:text-white hover:bg-dark-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
