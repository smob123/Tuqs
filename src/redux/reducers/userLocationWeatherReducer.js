/**
 * reducer that returns the state of weather data belonging to the user's current location
 */

import { SET_SEARCHED_USER_WEATHER } from '../actions/userLocationWeather';

let initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_SEARCHED_USER_WEATHER:
            state = action.data;
            break;
        default:
            break;
    }

    return state;
}