import React from 'react';
import { Globe, MapPin, MessageSquare, X, DollarSign, Users, Map } from 'lucide-react';

const CountryDetailView = ({ country, onClose }) => {
  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population);
  };

  const getLanguages = (languagesObj) => {
    if (!languagesObj) return "Not available";
    return Object.values(languagesObj).join(', ');
  };

  const getCurrencies = (currenciesObj) => {
    if (!currenciesObj) return "Not available";
    return Object.values(currenciesObj)
      .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
      .join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 max-h-[90vh] overflow-y-auto">
      {/* Header with flag as background - added responsive height */}
      <div 
        className="relative h-36 sm:h-48 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${country.flags.svg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30">
          <div className="p-4 sm:p-6 flex justify-between items-start h-full">
            <div className="text-white mt-auto">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{country.name.common}</h1>
              <p className="text-sm sm:text-lg opacity-90 mt-1 sm:mt-2">{country.name.official}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
              aria-label="Close details"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content - added responsive padding */}
      <div className="p-4 sm:p-6">
        {/* Key stats row - modified for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
            <div className="flex items-start">
              <Users className="text-blue-600 mr-2 sm:mr-3 mt-1" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-blue-700 font-medium">Population</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{formatPopulation(country.population)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 shadow-sm border border-green-100">
            <div className="flex items-start">
              <Map className="text-green-600 mr-2 sm:mr-3 mt-1" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-green-700 font-medium">Region</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{country.region || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 shadow-sm border border-purple-100">
            <div className="flex items-start">
              <MapPin className="text-purple-600 mr-2 sm:mr-3 mt-1" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-purple-700 font-medium">Capital</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{country.capital ? country.capital[0] : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed information - improved mobile stacking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Country details - first column */}
          <div className="space-y-4 sm:space-y-5">
            <div className="border-b border-gray-200 pb-3 sm:pb-4">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-gray-800">
                <Globe size={18} className="mr-2 text-blue-600" />
                Location
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                <span className="font-medium">Continent:</span> {country.region}
                {country.subregion && <>, <span className="font-medium">Subregion:</span> {country.subregion}</>}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-3 sm:pb-4">
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-gray-800">
                <MessageSquare size={18} className="mr-2 text-blue-600" />
                Languages
              </h3>
              <p className="text-sm sm:text-base text-gray-700">{getLanguages(country.languages)}</p>
            </div>
          </div>
          
          {/* Country details - second column */}
          <div className="space-y-4 sm:space-y-5">
            {country.currencies && (
              <div className="border-b border-gray-200 pb-3 sm:pb-4">
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-gray-800">
                  <DollarSign size={18} className="mr-2 text-blue-600" />
                  Currencies
                </h3>
                <p className="text-sm sm:text-base text-gray-700">{getCurrencies(country.currencies)}</p>
              </div>
            )}

            {country.borders && country.borders.length > 0 && (
              <div className="border-b border-gray-200 pb-3 sm:pb-4">
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center text-gray-800">
                  <Map size={18} className="mr-2 text-blue-600" />
                  Borders With
                </h3>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map(border => (
                    <span key={border} className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {border}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional country information - full width section */}
        {country.area && (
          <div className="mt-6 sm:mt-8 p-3 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Area</p>
                <p className="text-sm sm:text-base font-medium">{new Intl.NumberFormat().format(country.area)} km²</p>
              </div>
              
              {country.timezones && country.timezones.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Timezone</p>
                  <p className="text-sm sm:text-base font-medium">{country.timezones[0]}</p>
                </div>
              )}
              
              {country.cca3 && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Country Code</p>
                  <p className="text-sm sm:text-base font-medium">{country.cca3}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetailView;