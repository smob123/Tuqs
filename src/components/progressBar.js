/**
 * progress bar that is used inside the cityWeatherCard component
 */

import React from 'react';

export default function ProgressBar({ title, value }) {
    return (
        <div className='progress-bar'>
            <div className='info-container'>
                <p>{title}:</p>
                <p>{value}%</p>
            </div>

            <div className='progress-indicator'>
                <div style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
}