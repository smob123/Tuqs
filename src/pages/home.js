/**
 * the landing page
 */

import React, { Component } from 'react';
import CityCard from '../components/cityCard';
import WeatherCard from '../components/weatherCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import Graph from '../components/graph';

// gets the time for particular timezones
import { tz } from 'moment-timezone';

import { fetchWeatherByCity } from '../models/app';
import { setSearchedLocationWeather } from '../redux/actions/searchedLocationWeather';

import { connect } from 'react-redux';

SwiperCore.use([Navigation, Pagination]);

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            temps: []
        }
    }

    componentDidMount() {
        // check if weather data was already fetched
        if (this.props.temps && this.props.temps.length !== undefined) {
            // group the data by date
            this.groupTempsByDate();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if weather data has been updated
        if ((prevProps.temps === undefined && this.props.temps.length !== undefined) || (this.props.city !== prevProps.city) ||
            (prevProps.temps.length !== this.props.temps.length) || (prevProps.location.pathname !== this.props.location.pathname)) {
            // group the data by date
            this.groupTempsByDate();
        }
    }

    /**
     * gets the max and min temperatures of each date
     */
    groupTempsByDate() {
        const groupedTemps = [];
        for (let i = 0; i < this.props.temps.length; i++) {
            // always add the first value in the list
            if (i === 0) {
                groupedTemps.push(this.props.temps[i]);
                continue;
            }

            // get the value and date of the current item, as well as the previous item
            const currentItem = this.props.temps[i];
            const prevItem = this.props.temps[i - 1];
            const currentItemDate = new Date(this.props.temps[i].datetime);
            const prevItemDate = new Date(this.props.temps[i - 1].datetime);

            // check if the dates are different
            if (currentItemDate.getDate() !== prevItemDate.getDate()) {
                // add a the current item to the list
                groupedTemps.push(this.props.temps[i]);
            } else {
                // otherwise compare the max temperature of the current value with the max and min 
                // temperatures of the previous value, and update the last item in the list accordingly
                const tempsSize = groupedTemps.length;

                if (currentItem.minTemp < prevItem.minTemp) {
                    groupedTemps[tempsSize - 1].minTemp = currentItem.minTemp;
                }

                if (currentItem.maxTemp > prevItem.maxTemp) {
                    groupedTemps[tempsSize - 1].maxTemp = currentItem.maxTemp;
                }
            }
        }

        this.setState({ temps: groupedTemps });
    }

    /**
     * fetches weather data by city
     */
    async getWeatherByCityName(name) {
        const res = await fetchWeatherByCity(name);
        if (res.city) {
            this.props.dispatch(setSearchedLocationWeather(res));
        }
    }

    /**
     * returns slides that display top featured cities
     */
    getCitySlides() {
        // stores the names, images, and times of the cities
        const cities = [
            {
                cityName: 'Mecca',
                image: require('../assets/images/makkah.jpg'),
                time: tz('Asia/Riyadh')
            },
            {
                cityName: 'Auckland',
                image: require('../assets/images/auckland.jpg'),
                time: tz('Pacific/Auckland')
            },
            {
                cityName: 'New York',
                image: require('../assets/images/new york.jpg'),
                time: tz('America/New_York')
            },
            {
                cityName: 'Sydney',
                image: require('../assets/images/sydney.jpg'),
                time: tz('Australia/Sydney')
            },
            {
                cityName: 'London',
                image: require('../assets/images/london.jpg'),
                time: tz('Europe/London')
            }
        ];

        const slides = [];

        for (const city of cities) {
            // check if the current city's weather is stored in the global state
            let isSelected = this.props.city === city.cityName;

            // Mecca has a different name in the APi, so it needs a special check
            if (city.cityName === 'Mecca' && this.props.city === 'Makkah al Mukarramah') {
                isSelected = true;
            }

            slides.push(
                <SwiperSlide
                    className={isSelected ? 'selected clickable-slide' : 'clickable-slide'}
                    key={`${city.cityName}_slide`}>

                    <CityCard
                        image={city.image}
                        cityName={city.cityName}
                        time={city.time.format('H:M a')}
                        // get the city's weather data when the card is clicked only if the current city is not selected
                        onClick={() => isSelected ? {} : this.getWeatherByCityName(city.cityName)} />

                </SwiperSlide>
            );
        }

        return slides;
    }

    render() {
        return (
            <div className='home'>

                {/* displays the top featured cities */}
                <section className='weather-forecast'>
                    <h1 className='section-heading'>
                        Weather Forecast
                    </h1>

                    <Swiper
                        slidesPerView={1}
                        spaceBetween={50}
                        pagination={{ clickable: true, type: 'bullets' }}
                        watchOverflow={true}
                        breakpoints={{
                            640: {
                                slidesPerView: 2
                            },
                            800: {
                                slidesPerView: 3
                            },
                            1200: {
                                slidesPerView: 4
                            },
                            1800: {
                                slidesPerView: 5
                            }
                        }}>

                        {this.getCitySlides()}

                        <div className='pagination'></div>
                    </Swiper>
                </section>

                <section>
                    <h1 className='section-heading'>{this.props.city || '...'}</h1>
                    { /* displays the max and min temperatures in each day only if the data has been fetched */
                        (this.state.temps.length > 0 && this.props.city) &&
                        <Swiper
                            slidesPerView={2}
                            pagination={{ clickable: true, type: 'bullets' }}
                            watchOverflow={true}
                            breakpoints={{
                                640: {
                                    slidesPerView: 4
                                },
                                800: {
                                    slidesPerView: 6
                                }
                            }}>
                            {this.state.temps.map(temp => (
                                <SwiperSlide key={temp.datetime}>
                                    <WeatherCard
                                        icon={temp.icon}
                                        minTemp={temp.minTemp}
                                        maxTemp={temp.maxTemp}
                                        date={temp.datetime} />
                                </SwiperSlide>
                            ))
                            }
                        </Swiper>
                    }
                </section>

                {/* displays the temperature change across time */}
                <section>
                    <h1 className='section-heading'>Weather Graph</h1>

                    <Graph />
                </section>

            </div >
        );
    }
}

function mapStateToProps(state) {
    return state.searchedWeather;
}

export default connect(mapStateToProps)(Home);