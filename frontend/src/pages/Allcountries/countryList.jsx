import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Globe } from 'lucide-react';
import CountryFilters from '../../components/allCountries/CountryFilters ';
import CountryCard from '../../components/allCountries/CountryCard';
import CountryDetailView from '../../components/allCountries/CountryDetailView';
import { fetchAllCountries, applyFilters } from '../../Redux/actions/countryActions';
import { 
  setSelectedCountry, 
  setSearchQuery, 
  setSelectedRegion, 
  setSelectedLanguage, 
  clearFilters 
} from '../../Redux/slices/countrySlice';

const CountryList = () => {
  const dispatch = useDispatch();
  const { 
    filteredCountries, 
    loading, 
    error, 
    searchQuery, 
    selectedRegion, 
    selectedLanguage, 
    regions, 
    languages, 
    selectedCountry 
  } = useSelector(state => state.countries);

  useEffect(() => {
    dispatch(fetchAllCountries());
  }, [dispatch]);

  // Apply filters when search query, region or language changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(applyFilters(searchQuery, selectedRegion, selectedLanguage));
    }, 300); // 300ms debounce to avoid too many filter operations

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, searchQuery, selectedRegion, selectedLanguage]);

  useEffect(() => {
    // Lock scroll when modal is open
    if (selectedCountry) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCountry]);

  const handleSearchChange = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleRegionChange = (region) => {
    dispatch(setSelectedRegion(region));
  };

  const handleLanguageChange = (language) => {
    dispatch(setSelectedLanguage(language));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleCountryClick = (country) => {
    dispatch(setSelectedCountry(country));
  };

  const closeCountryDetail = () => {
    dispatch(setSelectedCountry(null));
  };

  const activeFiltersCount = [searchQuery, selectedRegion, selectedLanguage].filter(Boolean).length;

  // Only show the full-screen loader on initial data loading
  if (loading && filteredCountries.length === 0 && !searchQuery && !selectedRegion && !selectedLanguage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Loading countries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchAllCountries())} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-gray-800">Country Explorer</h1>
            </div>
            <div>
             
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CountryFilters 
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          selectedRegion={selectedRegion}
          setSelectedRegion={handleRegionChange}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={handleLanguageChange}
          regions={regions}
          languages={languages}
          clearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <div>
          {/* Only show small loader during filtering operations */}
          {loading && filteredCountries.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {!loading && filteredCountries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No countries found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button 
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Showing {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
              </p>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredCountries.map((country) => (
                  <CountryCard
                    key={country.cca3}
                    country={country}
                    onClick={handleCountryClick}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* MODAL for Country Details */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className="max-w-4xl w-full">
            <CountryDetailView country={selectedCountry} onClose={closeCountryDetail} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryList;