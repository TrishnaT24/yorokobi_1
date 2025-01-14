import React, { useState } from 'react';
const FilterComponent = ({ filterOptions, onFilterChange }) => {
  const [searchTerms, setSearchTerms] = useState({
    cuisines: '',
    rating: ''
  });

  const handleSearchChange = (category, value) => {
    setSearchTerms(prevTerms => ({
      ...prevTerms,
      [category]: value
    }));
  };

  const renderCheckboxes = (category) => {
    const filteredOptions = filterOptions[category].filter(option =>
      option.toLowerCase().includes(searchTerms[category].toLowerCase())
    );

    return filteredOptions.map((option, index) => (
      <div key={index} className="flex items-center mb-2">
        <input
          type="checkbox"
          id={`${category}-${index}`}
          onChange={() => onFilterChange(category, option)}
          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
        />
        <label
          htmlFor={`${category}-${index}`}
          className="ml-2 block text-sm text-gray-900"
        >
          {option}
        </label>
      </div>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Filters</h2>
      {Object.keys(filterOptions).map(category => (
        <div className="mb-6" key={category}>
          <h3 className="text-lg font-semibold mb-2 capitalize">{category}</h3>
          <input
            type="text"
            placeholder={`Search ${category}...`}
            value={searchTerms[category]}
            onChange={(e) => handleSearchChange(category, e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          />
          <div className="max-h-48 overflow-y-auto">
            {renderCheckboxes(category)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterComponent;
