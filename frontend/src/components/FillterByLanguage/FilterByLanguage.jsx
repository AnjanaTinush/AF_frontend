// FillterByLanguage.jsx
import React, { useState, useEffect } from 'react';
import CountryCard from '../../components/FillterByLanguage/CountryCard';

const FilterByLanguage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  
  // Common languages to show in quick filter buttons
  const popularLanguages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'ara', name: 'Arabic' },
    { code: 'zho', name: 'Chinese' },
    { code: 'rus', name: 'Russian' },
  ];

  // Fetch all countries only once when component mounts
  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchAllCountries();
  }, []);
  
  // Handle input change without triggering search
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle search button click - this is the ONLY place where filtering happens
  const handleSearchClick = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setSelectedLanguage('');
    
    // Filter countries based on search query
    const filtered = countries.filter(country => {
      if (!country.languages) return false;
      return Object.entries(country.languages).some(([code, name]) => {
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               code.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
    
    setFilteredCountries(filtered);
    setShowResults(true);
    setIsLoading(false);
  };
  
  // Handle language button click
  const handleLanguageClick = async (langCode) => {
    setIsLoading(true);
    setShowResults(true);
    setSelectedLanguage(langCode);
    setSearchQuery('');
    
    try {
      const response = await fetch(`https://restcountries.com/v3.1/lang/${langCode}`);
      if (!response.ok) throw new Error(`Failed to fetch countries for language: ${langCode}`);
      const data = await response.json();
      setFilteredCountries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset filters and hide results
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('');
    setFilteredCountries([]);
    setShowResults(false);
    setError(null);
  };
  
  // Group countries by continent for better organization
  const groupByContinent = (countries) => {
    const grouped = {};
    countries.forEach(country => {
      if (country.continents && country.continents.length > 0) {
        const continent = country.continents[0];
        if (!grouped[continent]) {
          grouped[continent] = [];
        }
        grouped[continent].push(country);
      }
    });
    return grouped;
  };
  
  const groupedCountries = groupByContinent(filteredCountries);
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">𝓛</span>
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Global Language Explorer</h1>
          <p className="text-gray-600 text-xl">Discover countries that speak specific languages around the world.</p>
        </div>
        
        {/* Search section - always visible */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearchClick}>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for a language..."
                value={searchQuery}
                onChange={handleInputChange}
              />
              <button 
                type="submit" 
                className="absolute right-2.5 bottom-2.5 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="mb-3">
            <p className="text-gray-600 mb-2">Popular languages:</p>
            <div className="flex flex-wrap gap-2">
              {popularLanguages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLanguage === lang.code 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleLanguageClick(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
              {showResults && (
                <button
                  type="button"
                  className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  onClick={resetFilters}
                >
                  Clear Results
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results section - only visible after search */}
        {showResults ? (
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedLanguage ? (
                      <span>Countries speaking {popularLanguages.find(l => l.code === selectedLanguage)?.name || selectedLanguage}</span>
                    ) : (
                      <span>Search results for "{searchQuery}"</span>
                    )}
                  </h2>
                  <p className="text-gray-600">{filteredCountries.length} countries found</p>
                </div>
                
                {Object.keys(groupedCountries).length > 0 ? (
                  Object.entries(groupedCountries).map(([continent, countries]) => (
                    <div key={continent} className="mb-10">
                      <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">{continent} ({countries.length})</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {countries.map(country => (
                          <CountryCard key={country.cca3} country={country} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No countries found matching your criteria.</p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={resetFilters}
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Show nothing when no search has been performed
          null
        )}
      </div>
    </div>
  );
};

export default FilterByLanguage;