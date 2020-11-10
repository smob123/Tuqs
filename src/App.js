import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Header from './components/header';
import Nav from './components/nav';
import Home from './pages/home';
import Map from './pages/map';

import { Provider } from 'react-redux';
import store from './redux/store/store';

import { fetchWeatherByCoordinates, fetchWeatherByCity } from './models/app';
import { setUserLocationWeather } from './redux/actions/userLocationWeather';
import { setSearchedLocationWeather } from './redux/actions/searchedLocationWeather';

import './App.scss';

function App() {

  useEffect(() => {
    // try to get the user's current location
    navigator.geolocation.getCurrentPosition(async (location) => {
      // get the coordinates
      const { latitude, longitude } = location.coords;
      // get the weather information
      const data = await fetchWeatherByCoordinates(latitude, longitude);
      // update the global state
      store.dispatch(setUserLocationWeather({ city: data.city, country: data.country, temps: data.temps[0] }));
      store.dispatch(setSearchedLocationWeather(data));
    }, async (err) => {
      // get the weather of the default city (Wellington in this case) if an error occurs
      const defaultCity = 'Wellington';
      const data = await fetchWeatherByCity(defaultCity);
      store.dispatch(setUserLocationWeather({ city: data.city, country: data.country, temps: data.temps[0] }));
      store.dispatch(setSearchedLocationWeather(data));
    });
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <div className='app-container'>
          <div className='nav-container'>
            <Nav />
          </div>
          <div className='main-content-container'>
            <Header />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/map' component={Map} />
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
