import { 
    fetchCountriesStart, 
    fetchCountriesSuccess, 
    fetchCountriesFailure,
    setFilteredCountries
  } from '../slices/countrySlice';
  
  // Fetch all countries
  export const fetchAllCountries = () => async (dispatch) => {
    try {
      dispatch(fetchCountriesStart());
      const response = await fetch('https://restcountries.com/v3.1/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      
      const data = await response.json();
      dispatch(fetchCountriesSuccess(data));
      return data;
    } catch (error) {
      dispatch(fetchCountriesFailure(error.message));
      return null;
    }
  };
  
  // Optimized filter function that properly handles filtering
  export const applyFilters = (searchQuery, selectedRegion, selectedLanguage) => async (dispatch, getState) => {
    dispatch(fetchCountriesStart());
    
    try {
      const { countries, languages } = getState().countries;
      
      // Make sure we have the countries data
      if (!countries || countries.length === 0) {
        // If we don't have countries, try fetching them first
        await dispatch(fetchAllCountries());
        // Get the updated state
        const updatedState = getState().countries;
        if (!updatedState.countries || updatedState.countries.length === 0) {
          dispatch(setFilteredCountries([]));
          return;
        }
      }
      
      // Get a fresh copy of countries from state
      let result = [...getState().countries.countries];
      
      // Apply filters one by one
      
      // Step 1: Filter by region if selected
      if (selectedRegion) {
        result = result.filter(country => country.region === selectedRegion);
      }
      
      // Step 2: Filter by language if selected
      if (selectedLanguage && result.length > 0) {
        result = result.filter(country => {
          // Ensure we have languages data
          if (!country.languages) return false;
          
          // Check if the country has the selected language
          return Object.keys(country.languages).includes(selectedLanguage);
        });
      }
      
      // Step 3: Filter by search query
      if (searchQuery && result.length > 0) {
        const lowercaseQuery = searchQuery.toLowerCase().trim();
        
        // Check if search query matches a language name
        const matchingLanguage = languages && languages.length > 0 
          ? languages.find(lang => lang.name.toLowerCase().includes(lowercaseQuery))
          : null;
        
        if (matchingLanguage) {
          // Filter by matching language
          result = result.filter(country => 
            country.languages && 
            Object.keys(country.languages).includes(matchingLanguage.code)
          );
        } else {
          // Filter by country name and other properties
          result = result.filter(country => {
            // Search in common name
            if (country.name && country.name.common && 
                country.name.common.toLowerCase().includes(lowercaseQuery)) {
              return true;
            }
            
            // Search in official name
            if (country.name && country.name.official && 
                country.name.official.toLowerCase().includes(lowercaseQuery)) {
              return true;
            }
            
            // Search in capital cities
            if (country.capital && Array.isArray(country.capital)) {
              return country.capital.some(cap => 
                cap.toLowerCase().includes(lowercaseQuery)
              );
            }
            
            // Search in country code
            if (country.cca3 && country.cca3.toLowerCase().includes(lowercaseQuery)) {
              return true;
            }
            
            return false;
          });
        }
      }
      
      // If no results found locally and we have search criteria, try API as fallback
      if (result.length === 0 && (searchQuery || selectedLanguage)) {
        try {
          // For language filtering
          if (selectedLanguage) {
            const langResponse = await fetch(`https://restcountries.com/v3.1/lang/${selectedLanguage}`);
            if (langResponse.ok) {
              let langResults = await langResponse.json();
              
              // Apply other filters to API results
              if (selectedRegion) {
                langResults = langResults.filter(country => country.region === selectedRegion);
              }
              
              if (searchQuery) {
                const lowercaseQuery = searchQuery.toLowerCase();
                langResults = langResults.filter(country => 
                  country.name.common.toLowerCase().includes(lowercaseQuery) ||
                  (country.name.official && country.name.official.toLowerCase().includes(lowercaseQuery))
                );
              }
              
              result = langResults;
            }
          } 
          // For search query filtering
          else if (searchQuery) {
            const nameResponse = await fetch(`https://restcountries.com/v3.1/name/${searchQuery}`);
            if (nameResponse.ok) {
              let nameResults = await nameResponse.json();
              
              // Apply other filters to API results
              if (selectedRegion) {
                nameResults = nameResults.filter(country => country.region === selectedRegion);
              }
              
              result = nameResults;
            }
          }
        } catch (apiError) {
          console.error("API fallback failed:", apiError);
          // Keep result as empty array if API calls fail
        }
      }
      
      // Update the filtered countries in state
      dispatch(setFilteredCountries(result));
      
    } catch (error) {
      console.error("Error during filtering:", error);
      dispatch(fetchCountriesFailure(error.message));
    } finally {
      // Make sure loading state is cleared
      setTimeout(() => {
        const { loading } = getState().countries;
        if (loading) {
          // If still in loading state, end it
          const { countries } = getState().countries;
          dispatch(setFilteredCountries(getState().countries.filteredCountries || []));
        }
      }, 500); // Give a small buffer time for other operations to complete
    }
  };