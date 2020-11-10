/**
 * handles retrieving data from the network
 */
import sunIcon from '../assets/images/sun.png';
import cloudIcon from '../assets/images/cloud.png';
import rainIcon from '../assets/images/rain.png';
import snowIcon from '../assets/images/snow.png';

/**
 * fetches weather data by coordinates
 */
export async function fetchWeatherByCoordinates(latitude, longitude) {
    // fetch the weather data
    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=12a1d4d0cb0df5fcb131d94b2a1369f9`);
    const json = await weatherData.json();

    // make sure that the required data was returned
    if (!json.list || !json.city) {
        return {};
    }

    // get the full name of the country
    const countryData = await fetch(`https://restcountries.eu/rest/v2/alpha/${json.city.country}`);
    const countryJson = await countryData.json();
    const countryName = countryJson.name;

    // stores the list of tempretures
    const temps = [];

    for (const item of json.list) {
        // decide the icon of the current value's weather status
        let icon;

        switch (item.weather[0].main) {
            case 'Clouds':
                icon = cloudIcon;
                break;
            case 'Clear':
                icon = sunIcon;
                break;
            case 'Rain':
                icon = rainIcon;
                break;
            case 'Snow':
                icon = snowIcon;
                break;
            default:
                icon = sunIcon;
                break;
        }

        temps.push({
            temp: item.main.temp,
            minTemp: item.main.temp_min,
            maxTemp: item.main.temp_max,
            humidity: item.main.humidity,
            clouds: item.clouds.all,
            datetime: item.dt_txt,
            icon
        })
    }

    return {
        city: json.city.name,
        country: countryName,
        lat: latitude,
        lon: longitude,
        temps
    };
}

/**
 * fetches weather data by city
 */
export async function fetchWeatherByCity(city) {
    // fetch the weather data
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=12a1d4d0cb0df5fcb131d94b2a1369f9`);
    const json = await res.json();

    // make sure that the required data was returned
    if (!json.list || !json.city) {
        return {};
    }

    // get the full name of the country
    const countryData = await fetch(`https://restcountries.eu/rest/v2/alpha/${json.city.country}`);
    const countryJson = await countryData.json();
    const countryName = countryJson.name;

    const temps = [];

    for (const item of json.list) {
        // decide the icon of the current value's weather status
        let icon;

        switch (item.weather[0].main) {
            case 'Clouds':
                icon = cloudIcon;
                break;
            case 'Clear':
                icon = sunIcon;
                break;
            case 'Rain':
                icon = rainIcon;
                break;
            case 'Snow':
                icon = snowIcon;
                break;
            default:
                icon = sunIcon;
                break;
        }

        temps.push({
            temp: item.main.temp,
            minTemp: item.main.temp_min,
            maxTemp: item.main.temp_max,
            humidity: item.main.humidity,
            clouds: item.clouds.all,
            datetime: item.dt_txt,
            icon
        })
    }

    return {
        city: json.city.name,
        country: countryName,
        lat: json.city.coord.lat,
        lon: json.city.coord.lon,
        temps
    };
}

/**
 * fetches cities with names matching a given search term
 */
export async function searchCityByName(name) {
    const res = await fetch(`https://api.teleport.org/api/cities/?search=${name}`);
    const json = await res.json();
    const cityNames = [];

    for (const city of json['_embedded']['city:search-results']) {
        cityNames.push(city['matching_full_name'])
    }

    return cityNames;
}