/**
 * header containing hamburger menu icon and search bar
 */

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';

import Autocomplete from './autocomplete';

import { searchCityByName, fetchWeatherByCity } from '../models/app';
import { setSearchedLocationWeather } from '../redux/actions/searchedLocationWeather';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // suggestions of the current search term
            searchSuggestions: [],
            searchTerm: ''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if the user has navigated to a different screen
        if (prevProps.location.pathname !== this.props.location.pathname) {
            // hide the navigation and reset the hamburger icon
            const hamburger = document.querySelector('.nav-hamburger');
            const nav = document.querySelector('.nav');
            const body = document.querySelector('body');
            nav.classList.add('hidden');
            hamburger.classList.remove('nav-displayed');
            body.style['overflowY'] = 'initial';
        }
    }

    /**
     * displays/hides the navigation menu, and updates the updates the hamburger icon accordingly
     */
    triggerNavigation() {
        const hamburger = document.querySelector('.nav-hamburger');
        const nav = document.querySelector('.nav');
        const body = document.querySelector('body');

        if (nav.classList.contains('hidden')) {
            nav.classList.remove('hidden');
            hamburger.classList.add('nav-displayed');
            body.style['overflowY'] = 'hidden';
            window.scrollTo(0, 0);
        } else {
            nav.classList.add('hidden');
            hamburger.classList.remove('nav-displayed');
            body.style['overflowY'] = 'initial';
        }
    }

    /**
     * gets city name suggestions based on the serach term
     */
    async getCityNameSuggestions(searchTerm) {
        this.setState({ searchTerm });

        // check if the search term is not empty
        if (searchTerm.trim() !== '') {
            let res = await searchCityByName(searchTerm);
            // check if the API has returned more than 5 suggestions
            if (res.length > 5) {
                res = res.slice(0, 5);
            }
            this.setState({ searchSuggestions: res });
        } else {
            this.setState({ searchSuggestions: [] });
        }
    }

    /**
     * handles selecting a suggestion from the search's dropdown menu
     */
    async handleSuggestionSelection(value) {
        // get the city name, and updates the state
        const cityName = value.substring(0, value.indexOf(','));
        this.setState({ searchSuggestions: [], searchTerm: cityName });

        // fetch weather data of the selected city
        const results = await fetchWeatherByCity(cityName);

        // check if the api has returned data
        if (results.city) {
            this.props.dispatch(setSearchedLocationWeather(results));
        }
    }

    /**
     * fetches weather data when the user presses enter
     */
    async searchWeatherByCityName() {
        // check if the search term is empty
        if (this.state.searchTerm.trim() === '') {
            return;
        }

        // reset search suggestions
        this.setState({ searchSuggestions: [] });

        // fetch weather data
        const results = await fetchWeatherByCity(this.state.searchTerm);

        // check if the API has returned data
        if (results.city) {
            this.props.dispatch(setSearchedLocationWeather(results));
        }
    }

    render() {
        return (
            <header>
                <FontAwesomeIcon className='nav-hamburger' icon={faBars} size='lg' onClick={() => this.triggerNavigation()} />

                <div className='search-container'>
                    <div className='search-button' onClick={() => this.searchWeatherByCityName()}>
                        <FontAwesomeIcon icon={faSearch} size='sm' />
                    </div>

                    <Autocomplete suggestions={this.state.searchSuggestions}
                        onChange={(searchTerm) => this.getCityNameSuggestions(searchTerm)}
                        onSuggestionSelected={(value) => this.handleSuggestionSelection(value)}
                        onSubmit={() => this.searchWeatherByCityName()} />
                </div>
            </header>
        )
    }
}

export default connect()(withRouter(Header));