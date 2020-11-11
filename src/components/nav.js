/**
 * app's navigation
 */

import React, { Component } from 'react';
import CityWeatherCard from './cityWeatherCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faGlobeAfrica } from '@fortawesome/free-solid-svg-icons';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Nav extends Component {

    /**
     * returns the links to the app's pages
     */
    getNavLinks() {
        // stores the titles, icons, and routes of the pages
        const navDetails = [
            {
                title: 'Home',
                icon: faHome,
                route: '/'
            },
            {
                title: 'Map',
                icon: faGlobeAfrica,
                route: '/map'
            }
        ];

        const navElements = [];

        for (let i = 0; i < navDetails.length; i++) {
            const navItem = navDetails[i];

            navElements.push(
                <li
                    // set the element as selected if the current route matches the element's route
                    className={this.props.location.pathname === navItem.route ? 'selected' : ''}
                    key={`${navItem.title}_${Date.now()}`}
                    onClick={() => this.props.history.push(navItem.route)}>

                    <FontAwesomeIcon icon={navItem.icon} size='lg' /> &nbsp;
                        {navItem.title}

                </li>
            )
        }

        return navElements;
    }


    render() {
        return (
            <div className='nav hidden'>
                <h1 className='title'>Tuqs</h1>

                <nav className='nav-routes'>
                    <ul>
                        {this.getNavLinks()}
                    </ul>
                </nav>

                {
                    // displays a card containing the user's location's weather data
                    this.props.temps &&
                    <CityWeatherCard city={this.props.city} country={this.props.country} weather={this.props.temps} datetime={this.props.datetime} />
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state.userLocationWeather;
}

export default connect(mapStateToProps)(withRouter(Nav));