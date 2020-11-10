/**
 * a card displaying weather data of a given location
 */

import React from 'react';
import ProgressBar from './progressBar';

export default function CityWeatherCard({ city, country, weather }) {

    // returns the current time in the format "HH:MM AM/PM"
    const getCurrentTime = () => {
        const now = new Date(weather.datetime);
        const hour = now.getHours() > 12 ? Math.abs(12 - now.getHours()) : now.getHours();
        const minute = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
        const timeOfDay = now.getHours() > 12 ? 'PM' : 'AM';
        return `${hour}:${minute} ${timeOfDay}`;
    }

    /**
     * returns the current date in the format "a, B d"
     */
    const getCurrentDate = () => {
        const now = new Date(weather.datetime);
        return `${now.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'long' })}`;
    }

    return (
        <div className='city-weather-card'>
            <div className='top-container'>
                <div>
                    <img src={weather.icon} alt='sun' />
                </div>

                <div>
                    <h2>Today</h2>
                    <h3>{getCurrentTime()}</h3>
                    <h4>{getCurrentDate()}</h4>
                </div>
            </div>

            <div>
                <h1>{weather.temp}&deg; C</h1>
                <h2 className='city'>{city}</h2>
                <h3 className='country'>{country}</h3>

                <ProgressBar title='Humidity' value={weather.humidity} />
                <ProgressBar title='Clouds' value={weather.clouds} />
            </div>
        </div>
    )
}