// WeatherApp.jsx
import React, { useEffect, useState } from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('London');
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('light');

  const fetchWeather = (loc) => {
    setLoading(true);
    setError(null);
    fetch(`http://api.weatherapi.com/v1/current.json?key=898ff9b4943a4b2c97650503252406&q=${loc}&aqi=yes`)
      .then((response) => {
        if (!response.ok) throw new Error('Location not found');
        return response.json();
      })
      .then((data) => {
        setWeather(data);
        setLocation(loc);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchWeather(input);
    }
  };

  const getBackgroundClass = (condition) => {
    if (!condition) return 'default-bg';
    const c = condition.toLowerCase();
    if (c.includes('cloud')) return 'cloudy-bg';
    if (c.includes('rain')) return 'rainy-bg';
    if (c.includes('sun') || c.includes('clear')) return 'sunny-bg';
    if (c.includes('snow')) return 'snowy-bg';
    return 'default-bg';
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`weather-container ${theme} ${getBackgroundClass(weather?.current?.condition?.text)}`}>
      <nav className="navbar">
        <h2>🌤 Weather App</h2>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading weather...</p>}
      {error && <p className="error">Error: {error}</p>}

      {weather && !loading && !error && (
        <div className="card">
          <h1 className="location">{weather.location.name}, {weather.location.country}</h1>
          <h2 className="temp">{weather.current.temp_c}°C</h2>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="weather-icon"
          />
          <p className="condition">{weather.current.condition.text}</p>
          <div className="details">
            <p>Humidity: {weather.current.humidity}%</p>
            <p>Wind: {weather.current.wind_kph} kph</p>
            <p>Air Quality: {weather.current.air_quality.pm2_5.toFixed(1)} µg/m³</p>
          </div>
        </div>
      )}

      <footer className="footer">© 2025 WeatherApp by Shubham</footer>
    </div>
  );
};

export default WeatherApp;
