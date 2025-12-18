import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      setWeather(res.data);
      setError("");
    } catch {
      setError("City not found");
      setWeather(null);
    }
  };

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
        );
        setWeather(res.data);
        setError("");
      },
      () => {
        setError("Location permission denied");
      }
    );
  };

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <h1>🌦 Weather App</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather(city)}
        />
        <button onClick={() => fetchWeather(city)}>Search</button>
        <button onClick={getCurrentLocationWeather}>📍 Location</button>
      </div>

      <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <h1>{weather.main.temp}°C</h1>
          <p>{weather.weather[0].description}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬 Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
