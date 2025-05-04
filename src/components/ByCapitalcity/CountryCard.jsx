import React from 'react';

const CountryCard = ({ country }) => {
  const formatNumber = (num) => num ? num.toLocaleString() : 'N/A';
  
  // Format phone code properly
  const formatPhoneCode = () => {
    if (!country.idd) return 'N/A';
    const { root, suffixes } = country.idd;
    return suffixes && suffixes.length > 0 ? `${root}${suffixes[0]}` : root;
  };

  return (
    <div className="overflow-hidden mb-4 sm:mb-8 h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      {/* Flag section at the top */}
      <div className="relative w-full bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4">
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-md">
            {country.cca2}
          </span>
        </div>
        
        <div className="flex justify-center items-center h-32 sm:h-48 overflow-hidden">
          {country.flags ? (
            <img 
              src={country.flags.png || country.flags.svg} 
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="max-h-32 sm:max-h-48 w-auto object-contain rounded-md shadow-md"
            />
          ) : (
            <div className="w-64 h-32 sm:h-44 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-sm">No flag available</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Information section */}
      <div className="p-3 sm:p-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-5">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 line-clamp-1">{country.name.common}</h2>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {country.independent && (
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Independent
                </span>
              )}
              {country.unMember && (
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  UN Member
                </span>
              )}
              {country.fifa && (
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  FIFA: {country.fifa}
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-500 italic text-xs sm:text-sm line-clamp-1">{country.name.official}</p>
          
          {/* Native name if available */}
          {country.name.nativeName && Object.keys(country.name.nativeName).length > 0 && (
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Native name: </span>
              <span className="line-clamp-1">{Object.values(country.name.nativeName)[0].common}</span>
            </div>
          )}
        </div>
        
        {/* Two-column grid for main info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-5 gap-x-4 sm:gap-x-8">
          <InfoItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            } 
            label="Capital" 
            value={country.capital?.join(', ') || 'N/A'} 
          />
          <InfoItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            }
            label="Region" 
            value={`${country.region}${country.subregion ? ` (${country.subregion})` : ''}`} 
          />
          <InfoItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            }
            label="Population" 
            value={formatNumber(country.population)} 
          />
          <InfoItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
              </svg>
            }
            label="Languages" 
            value={country.languages ? Object.values(country.languages).join(', ') : 'N/A'} 
          />
          <InfoItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
              </svg>
            }
            label="Area" 
            value={`${formatNumber(country.area)} km²`} 
          />
          <InfoItem 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            }
            label="Timezone" 
            value={country.timezones?.[0] || 'N/A'} 
          />
        </div>
        
        {/* Currency Section */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Currency</h3>
          </div>
          <div className="pl-4 sm:pl-7">
            {country.currencies ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(country.currencies).map(([code, currency]) => (
                  <div key={code} className="bg-gray-50 rounded-md p-2 sm:p-3 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 text-xs sm:text-sm">{code}</span>
                      {currency.symbol && (
                        <span className="text-gray-500 font-mono text-xs sm:text-sm">{currency.symbol}</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-1">{currency.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-xs sm:text-sm">No currency information available</p>
            )}
          </div>
        </div>
        
        {/* Borders Section */}
        {country.borders && country.borders.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Borders with</h3>
            </div>
            <div className="pl-4 sm:pl-7 flex flex-wrap gap-1 sm:gap-2">
              {country.borders.map((border) => (
                <span key={border} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium rounded-md border border-blue-100">
                  {border}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional info section */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
          {/* Phone code */}
          <div>
            <p className="font-medium text-gray-600">Calling Code</p>
            <p className="text-gray-800">{formatPhoneCode()}</p>
          </div>
          
          {/* Driving side */}
          {country.car?.side && (
            <div>
              <p className="font-medium text-gray-600">Driving Side</p>
              <p className="text-gray-800 capitalize">{country.car.side}</p>
            </div>
          )}
          
          {/* Top-level domain */}
          {country.tld && country.tld.length > 0 && (
            <div>
              <p className="font-medium text-gray-600">Domain</p>
              <p className="text-gray-800">{country.tld.join(', ')}</p>
            </div>
          )}
        </div>
        
        {/* Map links */}
        {country.maps && (
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex flex-wrap gap-2">
                {country.maps.googleMaps && (
                  <a 
                    href={country.maps.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Google Maps
                  </a>
                )}
                {country.maps.openStreetMaps && (
                  <a 
                    href={country.maps.openStreetMaps} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    OpenStreetMap
                  </a>
                )}
              </div>
              
              {country.latlng && country.latlng.length === 2 && (
                <div className="text-right text-xs sm:text-sm text-gray-500">
                  <span className="font-mono">{country.latlng[0]}°, {country.latlng[1]}°</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="mr-2 sm:mr-3 text-blue-600 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-xs sm:text-sm font-medium text-gray-600">{label}</p>
      <p className="text-xs sm:text-sm text-gray-800 line-clamp-1">{value}</p>
    </div>
  </div>
);

export default CountryCard;