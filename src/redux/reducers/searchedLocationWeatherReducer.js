/**
 * reducer that returns the state of weather data belonging to places that the user manually searches for
 */

import { SET_SEARCHED_LOCATION_WEATHER } from '../actions/searchedLocationWeather';

let initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SEARCHED_LOCATION_WEATHER:
            state = action.data;
            break
        default:
            break;
    }

    return state;
}