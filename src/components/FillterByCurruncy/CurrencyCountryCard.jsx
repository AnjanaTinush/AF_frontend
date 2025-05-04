import React, { useState } from 'react';
import {
  MapPin,
  Globe,
  DollarSign,
  ChevronDown,
} from 'lucide-react';

// FadeIn animation wrapper
const FadeIn = ({ children, delay = 0 }) => {
  return (
    <div 
      className="transition-all duration-700 ease-out transform"
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        animation: `fadeInUp 0.6s ease-out forwards ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// Currency Badge component
const CurrencyBadge = ({ code, data }) => {
  return (
    <div className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium shadow-sm">
      <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 opacity-70" />
      <span>{code}</span>
      <span className="mx-1 font-bold">{data.symbol}</span>
      <span className="hidden sm:inline text-indigo-600 text-opacity-80"> - {data.name}</span>
    </div>
  );
};

// Main Country Card
const CurrencyCountryCard = ({ country, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <FadeIn delay={0.05 * (index % 10)}>
      <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
        {/* Flag & Hover Info */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
          <img 
            src={country.flags.png} 
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-32 sm:h-48 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform z-20">
            <p className="text-xs sm:text-sm font-medium opacity-90">Population: {country.population.toLocaleString()}</p>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2 line-clamp-1">{country.name.common}</span>
              <span className="text-xl sm:text-2xl">{country.flag}</span>
            </h3>
            <div className="text-xs font-mono bg-gray-100 text-gray-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ml-1 flex-shrink-0">
              {country.cca3}
            </div>
          </div>

          <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2">{country.name.official}</p>

          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-2 mb-3 sm:mb-4">
            <div className="flex items-start space-x-1.5 sm:space-x-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Capital</p>
                <p className="font-medium text-xs sm:text-sm line-clamp-1">{country.capital ? country.capital.join(', ') : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-1.5 sm:space-x-2">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Region</p>
                <p className="font-medium text-xs sm:text-sm">{country.region}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{country.subregion}</p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center mb-1.5 sm:mb-2">
              <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-indigo-400" />
              Currencies
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {country.currencies && Object.entries(country.currencies).map(([code, currency]) => (
                <CurrencyBadge key={code} code={code} data={currency} />
              ))}
            </div>
          </div>

          {/* Expand Button */}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-auto flex items-center justify-center py-1.5 sm:py-2 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 transition-colors border-t border-gray-100"
          >
            {expanded ? 'Show less' : 'Show more'}
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Expandable Section */}
          {expanded && (
            <div className="mt-2 sm:mt-3 pt-2 border-t border-gray-100 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div>
                  <p className="text-xs text-gray-500">Languages</p>
                  <p className="font-medium text-xs sm:text-sm line-clamp-2">
                    {country.languages 
                      ? Object.values(country.languages).join(', ') 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Population</p>
                  <p className="font-medium text-xs sm:text-sm">{country.population.toLocaleString()}</p>
                </div>
              </div>

              {country.maps && (
                <div className="mt-1.5 sm:mt-2">
                  <a 
                    href={country.maps.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default CurrencyCountryCard;