/**
 * a card displaying the name, image, and time of a given city
 */

import React from 'react';

export default function CityCard({ image, cityName, time, onClick }) {
    return (
        <div className='city-card' onClick={() => onClick()}>
            <div className='image-container'>
                <img src={image} alt={cityName} />

                <div className='time-container'>
                    <p>
                        {time}
                    </p>
                </div>
            </div>
            <p>{cityName}</p>
        </div>
    );
}