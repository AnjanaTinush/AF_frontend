import React, { useState } from 'react';
import { Search, RefreshCw, Info, AlertCircle, DollarSign, Globe, BarChart2 } from 'lucide-react';
import CurrencyCountryCard from '../../components/FillterByCurruncy/CurrencyCountryCard';

const CurrencySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' }
  ];

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`https://restcountries.com/v3.1/currency/${query}?_=${timestamp}`);
      if (!response.ok) throw new Error(`No countries found with currency: ${query}`);

      const data = await response.json();
      const sortedData = [...data].sort((a, b) => a.name.common.localeCompare(b.name.common));
      setCountries(sortedData);
    } catch (err) {
      setError(err.message);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchQuery('');
    setCountries([]);
    setError(null);
    setSearched(false);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handlePopularCurrencyClick = (currencyCode) => {
    setSearchQuery(currencyCode);
    handleSearch(currencyCode);
  };

  const regionStats = countries.reduce((acc, country) => {
    acc[country.region] = (acc[country.region] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-6 sm:mb-10">
          <div className="inline-block p-2 bg-blue-50 rounded-full mb-3 sm:mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 text-transparent bg-clip-text">
            Global Currency Explorer
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Discover countries that use specific currencies around the world.
          </p>
        </header>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-10 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter currency code (e.g., USD, EUR)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-gray-50 hover:bg-white shadow-sm text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => handleSearch()}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-0 bg-indigo-600 text-white font-medium rounded-lg sm:rounded-xl transition-colors hover:bg-indigo-700 shadow-md flex items-center justify-center"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="sm:hidden">Search</span>
              </button>
              <button
                onClick={handleRefresh}
                className={`px-4 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-md py-2 sm:py-0 ${
                  !loading && !isRefreshing ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 flex items-center">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-indigo-400" />
              Popular currencies:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {popularCurrencies.map(({ code, name }) => (
                <button
                  key={code}
                  onClick={() => handlePopularCurrencyClick(code)}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 text-xs sm:text-sm transition-all"
                >
                  <span className="font-medium">{code}</span>
                  <span className="mx-1 text-gray-400 hidden xs:inline">•</span>
                  <span className="text-xs text-gray-500 hidden xs:inline">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-lg px-4 sm:px-6 py-6 sm:py-8 mb-6 sm:mb-10 flex items-start">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-3 sm:mr-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Currency Not Found</p>
              <p className="text-gray-600 text-sm sm:text-base">{error}</p>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                Please check the currency code and try again using a valid 3-letter ISO code.
              </p>
            </div>
          </div>
        )}

        {!loading && searched && !error && countries.length === 0 && (
          <div className="bg-white border-l-4 border-yellow-400 rounded-lg shadow-lg px-4 sm:px-6 py-6 sm:py-8 mb-6 sm:mb-10 flex items-start">
            <Info className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-3 sm:mr-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">No Results Found</p>
              <p className="text-gray-600 text-sm sm:text-base">No countries use this currency code.</p>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">Try a different one or check your spelling.</p>
            </div>
          </div>
        )}

        {!loading && countries.length > 0 && (
          <div className="mb-8 sm:mb-16">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Countries using <span className="text-indigo-600">{searchQuery}</span> ({countries.length})
              </h2>
              {Object.keys(regionStats).length > 0 && (
                <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center text-xs sm:text-sm overflow-x-auto">
                  <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-2 flex-shrink-0" />
                  {Object.entries(regionStats).map(([region, count], i) => (
                    <span key={region} className="text-gray-600 whitespace-nowrap mr-2 sm:mr-0">
                      {region}: <strong>{count}</strong>
                      {i < Object.entries(regionStats).length - 1 && <span className="mx-1 text-gray-400 hidden sm:inline">|</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {countries.map((country, index) => (
                <div key={country.cca3} className="h-full">
                  <CurrencyCountryCard country={country} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 sm:mt-20 text-center text-gray-500 text-xs sm:text-sm border-t pt-6 sm:pt-8">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700">Global Currency Explorer</h3>
          </div>
          <p>© {new Date().getFullYear()} Global Currency Explorer. All rights reserved.</p>
          <p className="mt-1">
            Data via <a href="https://restcountries.com" className="text-indigo-600 hover:underline">REST Countries API</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CurrencySearch;