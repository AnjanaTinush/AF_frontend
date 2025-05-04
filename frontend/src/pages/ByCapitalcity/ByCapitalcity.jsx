import React, { useState } from 'react';
import CountryCard from '../../components/ByCapitalcity/CountryCard'; // ✅ Adjust path if needed

const ByCapitalCity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a capital city');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://restcountries.com/v3.1/capital/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('No country found with that capital city');
      const data = await response.json();
      setCountryData(data);
    } catch (err) {
      setError(err.message);
      setCountryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const resetSearch = () => {
    setSearchQuery('');
    setCountryData(null);
    setError(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen p-3 sm:p-6"> 
      <div className="max-w-full mx-auto">

        {/* Header */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-blue-600 rounded-full p-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <span className="text-white text-xl sm:text-3xl">$</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-600 text-center mb-1 sm:mb-2">
          Global Capital Explorer
        </h1>
        <p className="text-gray-600 text-center mb-6 sm:mb-10 text-sm sm:text-base">
          Discover countries by capital city.
        </p>

        {/* 🔍 Search Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-10">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter capital city (e.g., London, Tokyo)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base transition-colors flex-1 sm:flex-none">
                Search
              </button>
              <button onClick={resetSearch} className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base transition-colors flex-1 sm:flex-none">
                Reset
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="mt-3 sm:mt-4 bg-red-100 text-red-700 px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>

        {/* 📦 Country Cards Section */}
        {countryData && countryData.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {countryData.map((country, index) => (
                <div key={index} className="h-full">
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs sm:text-sm mt-8 sm:mt-12">
          <p>© 2025 Global Capital Explorer. All rights reserved.</p>
          <p>Data via REST Countries API</p>
        </div>
      </div>
    </div>
  );
};

export default ByCapitalCity;