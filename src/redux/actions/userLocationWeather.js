/**
 * actions that can be applied to the state of weather data belonging to the user's current location
 */

export const SET_SEARCHED_USER_WEATHER = 'SET_SEARCHED_USER_WEATHER';

export function setUserLocationWeather(data) {
    return {
        type: SET_SEARCHED_USER_WEATHER,
        data
    }
}