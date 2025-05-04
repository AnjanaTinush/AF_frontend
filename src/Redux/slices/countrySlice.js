import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countries: [],
  filteredCountries: [],
  regions: [],
  languages: [],
  loading: false,
  error: null,
  selectedCountry: null,
  searchQuery: '',
  selectedRegion: '',
  selectedLanguage: ''
};

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    fetchCountriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCountriesSuccess: (state, action) => {
      state.loading = false;
      state.countries = action.payload;
      state.filteredCountries = action.payload;
      
      // Extract regions
      const uniqueRegions = [...new Set(action.payload.map(country => country.region))]
        .filter(Boolean)
        .sort();
      state.regions = uniqueRegions;
      
      // Extract languages
      const languageCodes = new Map();
      action.payload.forEach(country => {
        if (country.languages) {
          Object.entries(country.languages).forEach(([code, name]) => {
            if (!languageCodes.has(code)) {
              languageCodes.set(code, name);
            }
          });
        }
      });
      
      // Convert to array and sort
      const languageArray = Array.from(languageCodes.entries()).map(([code, name]) => ({
        code: code,
        name: name
      }));
      
      languageArray.sort((a, b) => a.name.localeCompare(b.name));
      state.languages = languageArray;
    },
    fetchCountriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilteredCountries: (state, action) => {
      state.filteredCountries = action.payload;
      state.loading = false; // Ensure loading is set to false when filtered countries are updated
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedRegion: (state, action) => {
      state.selectedRegion = action.payload;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedRegion = '';
      state.selectedLanguage = '';
      state.selectedCountry = null;
      state.filteredCountries = state.countries;
      state.loading = false; // Ensure loading is false when filters are cleared
    }
  }
});

export const {
  fetchCountriesStart,
  fetchCountriesSuccess,
  fetchCountriesFailure,
  setFilteredCountries,
  setLoading,
  setSelectedCountry,
  setSearchQuery,
  setSelectedRegion,
  setSelectedLanguage,
  clearFilters
} = countrySlice.actions;

export default countrySlice.reducer;