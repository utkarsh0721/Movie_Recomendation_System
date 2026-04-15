import { useState } from 'react';
import { X, ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { GENRES, MOODS, CONTENT_TYPES, AGE_RATINGS, COUNTRIES, PACES } from '../utils/constants';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-dark-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-white font-medium"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

const CheckboxGroup = ({ options, selected, onChange }) => {
  const handleChange = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${selected.includes(option)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                      : 'bg-dark-800 text-dark-300 border border-dark-700 hover:border-dark-600'
                    }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => handleChange(option)}
            className="hidden"
          />
          <span className="text-sm truncate">{option}</span>
        </label>
      ))}
    </div>
  );
};

const FilterSidebar = ({ filters, onFilterChange, onClear, isMobile = false, onClose }) => {
  const selectedGenres = filters.genre?.split(',').filter(Boolean) || [];
  const selectedMoods = filters.mood?.split(',').filter(Boolean) || [];
  const selectedTypes = filters.contentType?.split(',').filter(Boolean) || [];
  const selectedRatings = filters.ageRating?.split(',').filter(Boolean) || [];
  const selectedCountries = filters.country?.split(',').filter(Boolean) || [];
  const selectedPaces = filters.pace?.split(',').filter(Boolean) || [];

  const handleMultiSelectChange = (key, values) => {
    onFilterChange({ [key]: values.join(',') || undefined });
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value || undefined });
  };

  const handleRatingChange = (e) => {
    onFilterChange({ minRating: e.target.value || undefined });
  };

  const activeFiltersCount = [
    selectedGenres.length,
    selectedMoods.length,
    selectedTypes.length,
    selectedRatings.length,
    selectedCountries.length,
    selectedPaces.length,
    filters.yearFrom ? 1 : 0,
    filters.yearTo ? 1 : 0,
    filters.minRating ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`${isMobile ? '' : 'sticky top-20'} bg-dark-900 rounded-2xl border border-dark-700 overflow-hidden`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-400" />
          <span className="font-semibold text-white">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500 text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={onClear}
              className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="px-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Genres */}
        <FilterSection title="Genres">
          <CheckboxGroup
            options={GENRES}
            selected={selectedGenres}
            onChange={(values) => handleMultiSelectChange('genre', values)}
          />
        </FilterSection>

        {/* Mood */}
        <FilterSection title="Mood">
          <CheckboxGroup
            options={MOODS}
            selected={selectedMoods}
            onChange={(values) => handleMultiSelectChange('mood', values)}
          />
        </FilterSection>

        {/* Content Type */}
        <FilterSection title="Content Type">
          <CheckboxGroup
            options={CONTENT_TYPES}
            selected={selectedTypes}
            onChange={(values) => handleMultiSelectChange('contentType', values)}
          />
        </FilterSection>

        {/* Age Rating */}
        <FilterSection title="Age Rating" defaultOpen={false}>
          <CheckboxGroup
            options={AGE_RATINGS}
            selected={selectedRatings}
            onChange={(values) => handleMultiSelectChange('ageRating', values)}
          />
        </FilterSection>

        {/* Country */}
        <FilterSection title="Country" defaultOpen={false}>
          <CheckboxGroup
            options={COUNTRIES}
            selected={selectedCountries}
            onChange={(values) => handleMultiSelectChange('country', values)}
          />
        </FilterSection>

        {/* Pace */}
        <FilterSection title="Pace" defaultOpen={false}>
          <CheckboxGroup
            options={PACES}
            selected={selectedPaces}
            onChange={(values) => handleMultiSelectChange('pace', values)}
          />
        </FilterSection>

        {/* Year Range */}
        <FilterSection title="Release Year" defaultOpen={false}>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              name="yearFrom"
              placeholder="From"
              value={filters.yearFrom || ''}
              onChange={handleYearChange}
              min="1900"
              max={new Date().getFullYear()}
              className="input-field text-sm"
            />
            <span className="text-dark-500">-</span>
            <input
              type="number"
              name="yearTo"
              placeholder="To"
              value={filters.yearTo || ''}
              onChange={handleYearChange}
              min="1900"
              max={new Date().getFullYear()}
              className="input-field text-sm"
            />
          </div>
        </FilterSection>

        {/* Minimum Rating */}
        <FilterSection title="Minimum Rating" defaultOpen={false}>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.minRating || 0}
              onChange={handleRatingChange}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-sm text-dark-400">
              <span>0</span>
              <span className="text-primary-400 font-medium">
                {filters.minRating || 0}+
              </span>
              <span>10</span>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Apply Button (Mobile) */}
      {isMobile && (
        <div className="p-4 border-t border-dark-700">
          <button onClick={onClose} className="w-full btn-primary">
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;