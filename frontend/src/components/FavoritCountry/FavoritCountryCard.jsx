import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FavoritCountryCard = ({ country, onRemove }) => {
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const {
    _id,
    countryCode,
    countryName,
    flag,
    region,
    subregion,
    population,
    capital,
    currencies,
    languages
  } = country;

  // Format population with commas
  const formattedPopulation = population.toLocaleString();

  // Get first currency
  const currency = currencies ? Object.values(currencies)[0] : null;
  const currencyText = currency ? `${currency.name} (${currency.symbol})` : 'N/A';

  // Get languages list
  const languagesList = languages ? Object.values(languages).join(', ') : 'N/A';

  // Show confirmation dialog
  const handleShowConfirmation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(true);
  };
  
  // Handle cancel removal
  const handleCancelRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(false);
  };

  // Handle remove from favorites
  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmation(false);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotification({
          show: true,
          message: 'Authentication required. Please log in again.',
          type: 'error'
        });
        return;
      }
      
      // Call API to remove from favorites
      const response = await fetch(`http://localhost:5000/api/favorites/${countryCode}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Server responded with status code ${response.status}`
        );
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Show success notification
        setNotification({
          show: true,
          message: 'Country removed from favorites',
          type: 'success'
        });
        
        // Wait a short time to show the notification before reloading
        setTimeout(() => {
          // Reload the page
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      setNotification({
        show: true,
        message: `Error: ${error.message || 'Failed to remove from favorites'}`,
        type: 'error'
      });
      
      // Automatically hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  return (
    <>
      {/* Notification Toast */}
      {notification.show && (
        <div 
          className={`fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
              : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Remove from favorites?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-semibold">{countryName}</span> from your favorites?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={flag} 
            alt={`Flag of ${countryName}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <button 
              onClick={handleShowConfirmation}
              className="bg-white p-1 rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
              title="Remove from favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{countryName}</h2>
            <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">{countryCode}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">{capital}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              <span className="text-sm font-medium">{region}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">{formattedPopulation}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span className="text-sm font-medium">{currencyText}</span>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 font-medium">LANGUAGES</span>
            </div>
            <p className="text-sm">{languagesList}</p>
          </div>
          
          
        </div>
      </div>
    </>
  );
};

export default FavoritCountryCard;