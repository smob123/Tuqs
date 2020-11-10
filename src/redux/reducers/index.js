import { combineReducers } from 'redux';
import userLocationWeatherReducer from '../reducers/userLocationWeatherReducer';
import searchedWeatherReducer from '../reducers/searchedLocationWeatherReducer';

export default combineReducers({
    userLocationWeather: userLocationWeatherReducer,
    searchedWeather: searchedWeatherReducer
});