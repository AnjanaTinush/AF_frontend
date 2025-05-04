// CountryCard.jsx
import React from 'react';

const CountryCard = ({ country }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-28 sm:h-40 overflow-hidden bg-gray-200">
        {country.flags?.png && (
          <img
            src={country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/api/placeholder/320/200";
              e.target.alt = "Flag image unavailable";
            }}
          />
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1 text-gray-800 line-clamp-1">{country.name.common}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-1">{country.name.official}</p>
        
        <div className="mt-2 sm:mt-3">
          <div className="flex items-start mb-1">
            <span className="text-gray-500 text-xs sm:text-sm mr-1.5 sm:mr-2 whitespace-nowrap">Languages:</span>
            <div>
              {country.languages ? (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(country.languages).map(([code, name]) => (
                    <span key={code} className="inline-block bg-blue-100 text-blue-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded line-clamp-1">
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-xs sm:text-sm">Not available</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center mb-1">
            <span className="text-gray-500 text-xs sm:text-sm mr-1.5 sm:mr-2 whitespace-nowrap">Capital:</span>
            <span className="text-gray-700 text-xs sm:text-sm line-clamp-1">
              {country.capital && country.capital.length > 0 ? country.capital.join(', ') : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500 text-xs sm:text-sm mr-1.5 sm:mr-2 whitespace-nowrap">Region:</span>
            <span className="text-gray-700 text-xs sm:text-sm line-clamp-1">
              {country.region}{country.subregion ? ` (${country.subregion})` : ''}
            </span>
          </div>
          
          {country.currencies && (
            <div className="flex items-start mt-1">
              <span className="text-gray-500 text-xs sm:text-sm mr-1.5 sm:mr-2 whitespace-nowrap flex-shrink-0">Currency:</span>
              <div className="flex flex-wrap gap-1">
                {Object.entries(country.currencies).map(([code, currency]) => (
                  <span key={code} className="inline-block bg-green-100 text-green-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded line-clamp-1">
                    {currency.name} ({currency.symbol || code})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryCard;