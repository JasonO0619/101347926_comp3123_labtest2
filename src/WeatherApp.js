import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";


const WeatherApp = () => {
  const [city, setCity] = useState(""); 
  const [suggestions, setSuggestions] = useState([]); 
  const [weatherData, setWeatherData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false); 

  const Api_Key = "478178f555754051ba5212359242811";


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!city) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${Api_Key}&q=${city}`
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();

        const filteredSuggestions = data.map((location) => ({
          name: location.name,
          region: location.region,
          country: location.country,
        }));
        setSuggestions(filteredSuggestions);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [city, isSuggestionClicked]);


  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      setWeatherData(null);

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${Api_Key}&q=${cityName}`
      );
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data = await response.json();
      setTimeout(() => {
        setWeatherData(data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name); 
    setIsSuggestionClicked(true); 
    fetchWeatherData(suggestion.name); 
    setSuggestions([]); 
    setTimeout(() => setIsSuggestionClicked(false)); 

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Weather App</h1>

      
      <div style={styles.inputField}>
        <input
          type="text"
          placeholder="Enter city (Type atleast 3 characters to see suggestions)"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setIsSuggestionClicked(false);
          }}
          style={styles.input}
        />
      </div>

      
      {suggestions.length > 0 && (
        <ul style={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={styles.suggestionItem}
            >
              {suggestion.name}, {suggestion.region}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}

      {loading && <ClipLoader color="#3498db" loading={loading} size={30} />}

      {error && <p style={styles.error}>{error}</p>}

      {weatherData && (
        <div style={styles.weatherCard}>
          <h2 style={styles.city}>
            {weatherData.location.name}, {weatherData.location.country}
          </h2>
          <p style={styles.description}>
            {weatherData.current.condition.text}
          </p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
            style={styles.icon}
          />
          <p style={styles.temperature}>
            {weatherData.current.temp_c}°C
          </p>
          <p style={styles.labels}>
            Feels Like: {weatherData.current.feelslike_c}°C
          </p>
          <p style={styles.labels}>
            Humidity: {weatherData.current.humidity}%
          </p>
          <p style={styles.labels}>
            Precipitation: {weatherData.current.precip_mm}%
          </p>
          <p style={styles.labels}>
            Pressure: {weatherData.current.pressure_mb} mb
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
      fontFamily: "'Poiret One', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100vh",
      backgroundImage: `url(${require('./images/calm-unsplash.jpg')})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      color: "#ffffff",
      padding: "20px",
      width: "100%",
    },
    title: {
      fontSize: "2rem",
      fontFamily: "'Poiret One', sans-serif",
      margin: "20px 0",
      color: "#f8f9fa", 
    },
    inputField: {
      width: "500px", 
      display: "flex",
      justifyContent: "center",
      
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "none",
      fontSize: "1rem",
      width: "500px",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    suggestionsList: {
      listStyleType: "none",
      padding: 0,
      margin: "5px 0 0 0",
      backgroundColor: "#ffffff",
      color: "#333",
      borderRadius: "5px",
      width: "500px",
      maxHeight: "500px",
    },
    suggestionItem: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    error: {
      color: "#ff6b6b",
      fontSize: "1.2rem",
      marginTop: "10px",
    },
    weatherCard: {
      color: "#ffffff",
      padding: "30px",
      borderRadius: "20%",
      textAlign: "center",
      width: "400px",
      marginTop: "40px",
    },
    city: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    description: {
      fontSize: "1.2rem",
      textTransform: "capitalize",
      marginBottom: "10px",
    },
    icon: {
      width: "100px",
      height: "100px",
     
    },
    temperature: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#ffffff",
    },
    labels: {
      fontSize: "1.2rem",
      color: "#ffffff",
    },
  };
}
export default WeatherApp;
