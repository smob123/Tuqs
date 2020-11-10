/**
 * displays the icon, max, and min temperatures on a given date
 */

import React from 'react';

export default function WeatherCard({ minTemp, maxTemp, date, icon }) {
    const getParsedDate = () => {
        const datetime = new Date(date);
        return datetime.toLocaleString('en-US', { day: '2-digit', weekday: 'short' });
    }
    return (
        <div className='weather-card'>
            <img src={icon} alt='weather_icon' />
            <p className='temp'>{minTemp}&deg;/{maxTemp}&deg;</p>
            <p className='date'>{getParsedDate()}</p>
        </div>
    );
}