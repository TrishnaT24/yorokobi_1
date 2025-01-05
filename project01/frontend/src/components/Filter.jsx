import React from 'react';

const Filter = ({ onFilterChange, cuisineOptions }) => {
  return (
    <div className="w-64 px-4 mb-4">
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        defaultValue=""
      >
        <option value="">All Cuisines</option>
        {cuisineOptions.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;