import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './Redux/store';

// Pages
import CountryList from './pages/Allcountries/countryList';
import FillterdByCurruncy from './pages/FillterdByCurruncy/FillterdByCurruncy';
import SignIn from './pages/Auth/signIn';
import SignUp from './pages/Auth/signUp';
import FillterByLanguage from './pages/ByLanguage/FillterByLanguage';
import ByCapitalcity from './pages/ByCapitalcity/ByCapitalcity';
import FavoriteCountryList from './pages/FavoriteCountry/FavoriteCountryList';

// Layout
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Default route - opens SignIn */}
          <Route path="/" element={<SignIn />} />

          {/* Routes with sidebar/layout */}
          <Route element={<MainLayout />}>
            <Route path="/countrylist" element={<CountryList />} />
            <Route path="/country/currancy" element={<FillterdByCurruncy />} />
            <Route path="/country/language" element={<FillterByLanguage />} />
            <Route path="/country/capital" element={<ByCapitalcity />} />
            <Route path="/favoritecountry" element={<FavoriteCountryList />} />
          </Route>

          {/* Auth routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;