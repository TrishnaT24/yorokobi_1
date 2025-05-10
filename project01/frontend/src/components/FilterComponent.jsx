import React, { useState } from 'react';

const FilterComponent = ({ filterOptions, onFilterChange, category }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = filterOptions[category]?.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-64">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold capitalize">{category}</h3>
        <input
          type="text"
          placeholder={`Search ${category}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="max-h-48 overflow-y-auto pt-2">
          {filteredOptions.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`${category}-${index}`}
                onChange={() => onFilterChange(category, option)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label
                htmlFor={`${category}-${index}`}
                className="ml-2 text-sm text-gray-700"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;






