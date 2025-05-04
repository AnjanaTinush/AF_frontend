import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoritCountryCard from '../../components/FavoritCountry/FavoritCountryCard';
import { useSelector } from 'react-redux';

const FavoriteCountryList = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  
  // Get authentication state from Redux store
  const auth = useSelector(state => state.auth);

  // Fetch favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // First check localStorage for user data (this is more reliable than redux state which might not persist)
        const userString = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userString || !token) {
          setError('User not logged in. Please log in to view favorites.');
          setLoading(false);
          return;
        }

        // Parse the user information
        let user;
        try {
          user = JSON.parse(userString);
        } catch (e) {
          console.error('Error parsing user data:', e);
          setError('Invalid user data. Please log in again.');
          setLoading(false);
          return;
        }

        // Get user ID from localStorage
        const userId = user._id || user.id;
        
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Using userId:', userId);
        console.log('Using token:', token);

        // Fetch favorites from API with authorization header
        const response = await fetch(`https://afbackend-production.up.railway.app/api/favorites/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Response status:', response.status);
        
        // Check if response is ok
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - token issue
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setError('Authentication expired. Please log in again.');
          } else {
            const errorData = await response.json().catch(() => null);
            console.log('Error data:', errorData);
            throw new Error(
              errorData?.message || `Server responded with status code ${response.status}`
            );
          }
          setLoading(false);
          return;
        }
        
        // Parse JSON
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          setFavorites(data.data || []);
          setFilteredFavorites(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch favorites');
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError(`Error fetching favorites: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Only run this effect once on component mount
    fetchFavorites();
  }, []); // Empty dependency array means this runs once on mount

  // Filter favorites based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter(country => 
        country.countryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.capital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
  }, [searchTerm, favorites]);

  // Handle removing a country from favorites
  const handleRemoveFromFavorites = async (favoriteId) => {
    try {
      // Get token from localStorage directly
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Set up the fetch options
      const fetchOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await fetch(`https://afbackend-production.up.railway.app/api/favorites/${favoriteId}`, fetchOptions);
      
      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Server responded with status code ${response.status}`
        );
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update state to remove the deleted favorite
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav._id !== favoriteId));
        setFilteredFavorites(prevFiltered => prevFiltered.filter(fav => fav._id !== favoriteId));
      } else {
        throw new Error(data.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      alert(`Failed to remove from favorites: ${error.message}`);
    }
  };

  // Function to retry fetching
  const handleRetryFetch = () => {
    setLoading(true);
    setError(null);
    // This will trigger the useEffect again
    window.location.reload();
  };

  // Function to navigate to login page
  const handleGoToLogin = () => {
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            
            {error.includes('log in') ? (
              <button 
                onClick={handleGoToLogin}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Go to Login
              </button>
            ) : (
              <button 
                onClick={handleRetryFetch}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">My Favorite Countries</h1>
          </div>
          <div className="relative text-gray-600 focus-within:text-gray-800 w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="search" 
              className="py-2 pl-10 pr-3 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search favorites..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
            <p className="text-gray-600 mb-4">Explore countries and add them to your favorites.</p>
            <a href="/" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Explore Countries
            </a>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow px-4 py-3 mb-6">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <p className="text-sm text-gray-600">
                  You have <span className="font-medium">{favorites.length}</span> favorite {favorites.length === 1 ? 'country' : 'countries'}
                </p>
              </div>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No matches found</h3>
                <p className="text-gray-600">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map(country => (
                  <FavoritCountryCard 
                    key={country._id} 
                    country={country} 
                    onRemove={handleRemoveFromFavorites}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteCountryList;