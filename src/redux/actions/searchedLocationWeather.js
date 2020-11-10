/**
 * actions that can be applied to the state of weather data belonging to places that the user manually searches for
 */

export const SET_SEARCHED_LOCATION_WEATHER = 'SET_SEARCHED_LOCATION_WEATHER';

export function setSearchedLocationWeather(data) {
    return {
        type: SET_SEARCHED_LOCATION_WEATHER,
        data
    }
}