import React, { useState } from "react";
import WeatherInfo from "./WeatherInfo";
import "../Styles/Weather.css";

function WeatherContainer() {
    const API_KEY = 'eacfee494c3504c604f16b62c5c58337';
    const [searchQuery, setSearchQuery] = useState('');
    const [weatherData, setWeatherData] = useState({
        temp: null,
        humidity: null,
        desc: null,
        city: null
    });
    const [isValidZipCode, setIsValidZipCode] = useState(true);

    function updateSearchQuery(event) {
        let zipCode = event.target.value;
        let isValid = validateZipCode(zipCode);
        setSearchQuery(zipCode);

        if (isValid || zipCode === "" || isValid.length === 5) {
            setIsValidZipCode(true);
        } else {
            setIsValidZipCode(false);
        }
    }

    function validateZipCode(zipCode) {
        let regex = /[0-9]{5}/;
        return regex.test(zipCode);
    }

    async function getWeatherData() {
        if (!isValidZipCode || searchQuery === '') {
            setIsValidZipCode(false);
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${searchQuery},us&units=imperial&appid=${API_KEY}`);
        
            response.json()
            .then(data => {
                if (data.cod === 200)
                    setWeatherData({
                        temp: data.main.temp,
                        humidity: data.main.humidity,
                        desc: data.weather[0].main,
                        city: data.name});
                else {
                    setIsValidZipCode(false);
                }
            })
            .catch(error => {throw new Error(error.message)});

        } catch(error) {
            console.log(error);   
        }
    }

    return (
        <section className="weather-container">
            <header className="weather-header">
                <h3>Weather</h3>
                <div>
                    <input
                        placeholder="Zip Code"
                        className="search-input"
                        onChange={updateSearchQuery}
                        maxLength="5"
                    />
                    <button onClick={getWeatherData} className="material-icons">search</button>
                </div>
            </header>
            <p className="error">{isValidZipCode ? '' : 'Invalid Zip Code'}</p>
            <section className="weather-info">
                {weatherData.temp == null ? (
                    <p>No Weather to Display<i className="material-icons">wb_sunny</i></p>
                ) : <WeatherInfo data={weatherData} />
                }
            </section>
        </section>
    )
}

export default WeatherContainer;