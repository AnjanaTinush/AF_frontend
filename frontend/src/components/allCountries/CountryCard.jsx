import React, { useState, useEffect } from 'react';
import { Users, Globe, MapPin, ChevronRight, Heart, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const CountryCard = ({ country, onClick, onFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Check if the country is already in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`http://localhost:5000/api/favorites/check/${country.cca3}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    checkFavoriteStatus();
  }, [country]);
  
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    try {
      // Get user from local storage
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.error('User not found in local storage');
        setNotification({
          show: true,
          message: 'User not logged in. Please log in to add favorites.',
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
        return;
      }
      
      const user = JSON.parse(userString);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Authentication token not found');
        setNotification({
          show: true,
          message: 'Authentication required. Please log in again.',
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
        return;
      }
      
      // Prepare the request body
      const requestBody = {
        country: {
          cca3: country.cca3,
          name: {
            common: country.name.common
          },
          flags: {
            svg: country.flags.svg
          },
          region: country.region,
          subregion: country.subregion,
          population: country.population,
          capital: country.capital,
          languages: country.languages,
          currencies: country.currencies,
          area: country.area
        }
      };
      
      // Send request to the API
      const response = await fetch('http://localhost:5000/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle favorite status');
      }
      
      // Parse the response
      const data = await response.json();
      
      // Update local state
      setIsFavorite(data.isFavorite);
      
      // Show notification at the top of the page
      setNotification({
        show: true,
        message: data.isFavorite 
          ? `${country.name.common} added to favorites` 
          : `${country.name.common} removed from favorites`,
        type: data.success ? 'success' : 'error'
      });
      
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
      
      // Call the parent component's onFavorite callback if provided
      if (onFavorite) {
        onFavorite(country, data.isFavorite);
      }
      
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      setNotification({
        show: true,
        message: 'Error: ' + (error.message || 'Failed to process favorite request'),
        type: 'error'
      });
      
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  // Extract language names from the languages object
  const languages = country.languages ? Object.values(country.languages).slice(0, 2) : [];
  const hasMoreLanguages = country.languages && Object.values(country.languages).length > 2;
  
  // Currency formatting
  const currencies = country.currencies ? Object.values(country.currencies) : [];
  const currencyName = currencies.length > 0 ? currencies[0].name : 'N/A';
  const currencySymbol = currencies.length > 0 ? currencies[0].symbol : '';

  return (
    <>
      {/* Top Notification */}
      {notification.show && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' 
              ? 'bg-white border border-green-200' 
              : 'bg-white border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          <p className={`font-medium ${notification.type === 'success' ? 'text-gray-800' : 'text-red-600'}`}>
            {notification.message}
          </p>
        </div>
      )}
      
      <div 
        className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 hover:border-blue-200"
        style={{
          boxShadow: isHovered 
            ? '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick(country)}
      >
      {/* Favorite Button */}
      <button 
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 backdrop-blur-md ${
          isFavorite 
            ? 'bg-red-100 text-red-500 shadow-md' 
            : 'bg-black bg-opacity-25 text-white opacity-0 group-hover:opacity-100'
        }`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>
      
      {/* Flag with overlay gradient */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30 z-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-70'
        }`}></div>
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex flex-wrap gap-2">
            {country.region && (
              <span className="text-xs font-medium py-1 px-2 bg-black/30 backdrop-blur-md rounded-full">
                {country.region}
              </span>
            )}
            {country.subregion && (
              <span className="text-xs font-medium py-1 px-2 bg-black/30 backdrop-blur-md rounded-full">
                {country.subregion}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {country.name.common}
          </h2>
          <div className="flex gap-1 flex-wrap justify-end">
            {country.cca2 && (
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {country.cca2}
              </span>
            )}
            {country.cca3 && (
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {country.cca3}
              </span>
            )}
          </div>
        </div>
        
        {/* Official name if different */}
        {country.name.official !== country.name.common && (
          <p className="text-xs text-gray-500 mb-3 italic line-clamp-1">
            {country.name.official}
          </p>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
          <div className="col-span-2">
            <div className="flex items-start">
              <Users className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Population</p>
                <p className="text-sm text-gray-700 font-semibold">{formatPopulation(country.population)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-start">
              <Globe className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Region</p>
                <p className="text-sm text-gray-700 font-semibold">{country.region || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Capital</p>
                <p className="text-sm text-gray-700 font-semibold">{country.capital?.[0] || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="pt-3 border-t border-gray-100">
          {/* Languages */}
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {languages.map((language, index) => (
                <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {language}
                </span>
              ))}
              {hasMoreLanguages && (
                <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                  +{Object.values(country.languages).length - 2} more
                </span>
              )}
            </div>
          )}
          
          {/* Currency */}
          {currencyName !== 'N/A' && (
            <div className="text-xs text-gray-600">
              <span className="font-medium">Currency:</span> {currencyName} 
              {currencySymbol && <span className="ml-1 text-gray-500">({currencySymbol})</span>}
            </div>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Area: <span className="font-medium">{country.area ? `${formatPopulation(Math.round(country.area))} km²` : 'N/A'}</span>
        </span>
        <div className={`flex items-center text-sm font-medium text-blue-600 transition-all duration-300 ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
        }`}>
          <span className="mr-1">Details</span>
          <ChevronRight size={16} />
        </div>
      </div>
      
      {/* Quick Actions Overlay - Appears on Hover */}
      <div className={`absolute inset-0 bg-blue-600 bg-opacity-0 flex items-center justify-center transition-all duration-300 
        pointer-events-none group-hover:bg-opacity-5`}
      >
        <div className={`transition-all duration-300 transform ${
          isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          {isHovered && country.maps?.googleMaps && (
            <a 
              href={country.maps.googleMaps} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-16 right-5 p-2 bg-white rounded-full shadow-md text-blue-600 hover:text-blue-700"
              aria-label="View on Google Maps"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CountryCard;