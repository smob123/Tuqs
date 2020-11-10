/**
 * the map page
 */

import React, { Component } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import CityWeatherMap from '../components/cityWeatherCard';
import { fetchWeatherByCoordinates } from '../models/app';

import { setSearchedLocationWeather } from '../redux/actions/searchedLocationWeather';
import { connect } from 'react-redux';

const WeatherMap = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoic21vYjEyMyIsImEiOiJja2d6endpc2IxOHhkMnlxemlsNXBjdnF6In0.cvA1rNS9lxGpuHPtC_kQCw"
});

class Map extends Component {

    constructor(props) {
        super(props);
        // set the default map location based on whether there temperature data has been fetched or not
        this.state = {
            lat: props.lat || 0,
            lon: props.lon || 0,
            markerLat: props.lat || 0,
            markerLon: props.lon || 0,
            displayCard: (props.lat && props.lon) ? true : false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if the coordinates have been updated, and update the state accordingly
        if (this.props.lat && this.props.lon) {
            if (prevProps.lat !== this.props.lat || prevProps.lon !== this.props.lon) {
                this.setState({ lat: this.props.lat, lon: this.props.lon, markerLat: this.props.lat, markerLon: this.props.lon });
            }
        }
    }

    /**
     * fetches data based on where the user has clicked on the map
     */
    async updateLocation(newLat, newLon) {
        const data = await fetchWeatherByCoordinates(newLat, newLon);
        this.props.dispatch(setSearchedLocationWeather(data));
        this.setState({ lat: newLat, lon: newLon, markerLat: newLat, markerLon: newLon, displayCard: true })
    }

    render() {
        return (
            <WeatherMap
                className='map'
                style='mapbox://styles/mapbox/streets-v9'
                containerStyle={{
                    height: '100%',
                    width: '100%'
                }}
                center={[this.state.lon, this.state.lat]}
                zoom={[(this.state.lat && this.state.lon) ? 10 : 1]}
                // fetch weather data based on the location the user has selected on the map
                onClick={(map, e) => this.updateLocation(e.lngLat.lat, e.lngLat.lng)}
            >

                {/* displays an image of a marker */}
                <Marker coordinates={[this.state.markerLon, this.state.markerLat]} anchor='center' className='map-marker'>
                    <img alt='marker' src={require('../assets/images/marker.png')} onClick={() => this.setState({ displayCard: true })} />
                </Marker>


                { /* displays a card containing the selected location's weather data on top of the marker */
                    (this.state.displayCard && this.props.lat && this.props.lon) &&
                    <Marker coordinates={[this.state.markerLon, this.state.markerLat]} anchor='center'>
                        <div className='close-marker' onClick={() => this.setState({ displayCard: false })}>
                            X
                        </div>
                        <CityWeatherMap city={this.props.city} country={this.props.country} weather={this.props.temps[0]} />
                    </Marker>
                }
            </WeatherMap>
        );
    }
}

function mapStateToProps(state) {
    return state.searchedWeather;
}

export default connect(mapStateToProps)(Map);