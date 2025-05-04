import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, MessageSquare, Filter, ChevronDown, X, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

const CountryFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedRegion, 
  setSelectedRegion,
  selectedLanguage,
  setSelectedLanguage,
  regions,
  languages,
  clearFilters,
  activeFiltersCount
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages || []);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery || '');
  
  const regionDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Handle clicking outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setShowRegionDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter languages based on search query and update when languages prop changes
  useEffect(() => {
    if (languages && languages.length > 0) {
      if (!languageSearchQuery) {
        setFilteredLanguages(languages);
      } else {
        const filtered = languages.filter(language => 
          language.name.toLowerCase().includes(languageSearchQuery.toLowerCase()) || 
          language.code.toLowerCase().includes(languageSearchQuery.toLowerCase())
        );
        setFilteredLanguages(filtered);
      }
    } else {
      setFilteredLanguages([]);
    }
  }, [languageSearchQuery, languages]);

  // Set tempSearchQuery when searchQuery changes
  useEffect(() => {
    setTempSearchQuery(searchQuery || '');
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      searchInputRef.current.blur();
    } else if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Handle search submission - send to Redux
  const handleSearchSubmit = () => {
    setSearchQuery(tempSearchQuery);
  };

  // Make sure we handle null or undefined values
  const safeRegions = regions || [];
  const safeLanguages = languages || [];

  return (
    <div className="mb-8 font-sans">
      {/* Main Filters Bar */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-4 transition-all duration-300 border border-gray-100 hover:border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-5">
          {/* Search Input - Always visible */}
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-102' : ''}`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a country..."
                value={tempSearchQuery}
                onChange={(e) => setTempSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={handleSearchKeyDown}
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all ${
                  isSearchFocused ? 'shadow-md' : 'shadow-sm border-gray-200'
                }`}
              />
              <Search className={`absolute left-3 top-3 transition-colors duration-200 ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
              {tempSearchQuery && (
                <button 
                  onClick={() => setTempSearchQuery('')}
                  className="absolute right-10 top-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={handleSearchSubmit}
                className="absolute right-3 top-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-150 p-1"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Toggle for mobile filters */}
          <button 
            className="md:hidden flex items-center justify-between w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 shadow-sm hover:bg-gray-100 transition-colors duration-150"
            onClick={() => setShowAllFilters(!showAllFilters)}
            aria-expanded={showAllFilters}
            aria-controls="mobile-filters"
          >
            <span className="flex items-center">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span>
                {activeFiltersCount > 0 
                  ? `Filters (${activeFiltersCount})` 
                  : 'Filters'}
              </span>
            </span>
            <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${showAllFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Desktop Filters - Always visible on desktop */}
          <div 
            id="mobile-filters"
            className={`${showAllFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-3 md:mt-0 w-full md:w-1/2`}
          >
            {/* Region Filter */}
            <div className="relative w-full md:w-1/2" ref={regionDropdownRef}>
              <button
                onClick={() => {
                  setShowRegionDropdown(!showRegionDropdown);
                  setShowLanguageDropdown(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={showRegionDropdown}
                className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 shadow-sm hover:shadow transition-all duration-200 ${
                  selectedRegion 
                    ? 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100 focus:ring-blue-500'
                }`}
              >
                <span className="flex items-center truncate">
                  <Globe size={18} className={`mr-2 ${selectedRegion ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="truncate font-medium">
                    {selectedRegion || 'Region'}
                  </span>
                </span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${showRegionDropdown ? 'rotate-180' : ''} ${selectedRegion ? 'text-blue-500' : 'text-gray-400'}`} />
              </button>
              
              {showRegionDropdown && (
                <div 
                  className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-dropdown"
                  role="listbox"
                >
                  <div className="p-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Region</h3>
                  </div>
                  <ul className="py-1">
                    {/* Clear option */}
                    {selectedRegion && (
                      <li>
                        <button
                          onClick={() => {
                            setSelectedRegion('');
                            setShowRegionDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-600 flex items-center justify-between transition-colors"
                          role="option"
                        >
                          <span>Clear selection</span>
                          <X size={14} />
                        </button>
                      </li>
                    )}
                    {safeRegions.map((region) => (
                      <li key={region}>
                        <button
                          onClick={() => {
                            setSelectedRegion(region);
                            setShowRegionDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between transition-colors ${
                            selectedRegion === region ? 'bg-blue-50' : ''
                          }`}
                          role="option"
                          aria-selected={selectedRegion === region}
                        >
                          <span className={selectedRegion === region ? 'font-medium text-blue-600' : 'text-gray-700'}>
                            {region}
                          </span>
                          {selectedRegion === region && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Language Filter */}
            <div className="relative w-full md:w-1/2" ref={languageDropdownRef}>
              <button
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowRegionDropdown(false);
                  setLanguageSearchQuery('');
                }}
                aria-haspopup="listbox"
                aria-expanded={showLanguageDropdown}
                className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 shadow-sm hover:shadow transition-all duration-200 ${
                  selectedLanguage 
                    ? 'border-purple-400 bg-purple-50 text-purple-700 hover:bg-purple-100' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100 focus:ring-purple-500'
                }`}
              >
                <span className="flex items-center truncate">
                  <MessageSquare size={18} className={`mr-2 ${selectedLanguage ? 'text-purple-500' : 'text-gray-400'}`} />
                  <span className="truncate font-medium">
                    {selectedLanguage ? safeLanguages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage : 'Language'}
                  </span>
                </span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''} ${selectedLanguage ? 'text-purple-500' : 'text-gray-400'}`} />
              </button>
              
              {showLanguageDropdown && (
                <div 
                  className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-dropdown"
                  role="listbox"
                >
                  <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Language</h3>
                    <div className="relative">
                      <input
                        type="text"
                        value={languageSearchQuery}
                        placeholder="Search languages..."
                        className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setLanguageSearchQuery(e.target.value)}
                        aria-autocomplete="list"
                      />
                      <Search className="absolute left-2 top-2 text-gray-400" size={16} />
                      {languageSearchQuery && (
                        <button
                          onClick={() => setLanguageSearchQuery('')}
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                          aria-label="Clear language search"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <ul className="py-1">
                    {/* Clear option */}
                    {selectedLanguage && (
                      <li>
                        <button
                          onClick={() => {
                            setSelectedLanguage('');
                            setShowLanguageDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-purple-600 flex items-center justify-between transition-colors"
                          role="option"
                        >
                          <span>Clear selection</span>
                          <X size={14} />
                        </button>
                      </li>
                    )}
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((language) => (
                        <li key={language.code}>
                          <button
                            onClick={() => {
                              setSelectedLanguage(language.code);
                              setShowLanguageDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between transition-colors ${
                              selectedLanguage === language.code ? 'bg-purple-50' : ''
                            }`}
                            role="option"
                            aria-selected={selectedLanguage === language.code}
                          >
                            <span className={selectedLanguage === language.code ? 'font-medium text-purple-600' : 'text-gray-700'}>
                              {language.name} <span className="text-xs text-gray-500">({language.code})</span>
                            </span>
                            {selectedLanguage === language.code && (
                              <Check size={16} className="text-purple-600" />
                            )}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-gray-500 text-center">
                        No languages found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Filters Tags Display */}
      {(selectedRegion || selectedLanguage || searchQuery) && (
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-3 flex flex-wrap items-center gap-2 animate-fadeIn shadow-md border border-gray-100">
          <span className="text-sm text-gray-600 font-medium px-2.5 py-1.5 bg-gray-100 rounded-md flex items-center">
            <SlidersHorizontal size={14} className="mr-1.5" />
            Active filters:
          </span>
          
          {searchQuery && (
            <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200 shadow-sm">
              <span className="font-medium mr-1">Search:</span> {searchQuery.length > 20 ? `${searchQuery.substring(0, 20)}...` : searchQuery}
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-1.5 text-blue-500 hover:text-blue-700 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                aria-label="Remove search filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {selectedRegion && (
            <span className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200 shadow-sm">
              <span className="font-medium mr-1">Region:</span> {selectedRegion}
              <button 
                onClick={() => setSelectedRegion('')}
                className="ml-1.5 text-green-500 hover:text-green-700 p-0.5 hover:bg-green-200 rounded-full transition-colors"
                aria-label="Remove region filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {selectedLanguage && (
            <span className="flex items-center bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm border border-purple-200 shadow-sm">
              <span className="font-medium mr-1">Language:</span> 
              {safeLanguages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage}
              <button 
                onClick={() => setSelectedLanguage('')}
                className="ml-1.5 text-purple-500 hover:text-purple-700 p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                aria-label="Remove language filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          <button 
            onClick={clearFilters}
            className="ml-auto text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center shadow-sm"
            aria-label="Clear all filters"
          >
            <RefreshCw size={14} className="mr-1.5" />
            Reset all
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default CountryFilters;