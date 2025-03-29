async function getWeather() {
    const city = document.getElementById("cityInput").value;
    
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    try {
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error("City not found");
        }
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`;

        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error("Weather data not available");
        }
        const weatherData = await weatherResponse.json();

        // Get detailed weather info
        const temperature = weatherData.current_weather.temperature;
        const windSpeed = weatherData.current_weather.windspeed;
        const weatherCode = weatherData.current_weather.weathercode;

        // Fetch humidity from hourly data (current hour)
        const currentHour = new Date().getHours();
        const humidity = weatherData.hourly.relative_humidity_2m[currentHour];

        // Convert weather code to readable description
        const weatherDescriptions = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing Rime Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Dense Drizzle",
            61: "Light Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Light Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            95: "Thunderstorm",
            96: "Thunderstorm with Light Hail",
            99: "Thunderstorm with Heavy Hail"
        };
        
        const weatherDescription = weatherDescriptions[weatherCode] || "Unknown Weather Condition";

        // Update UI (Fixed duplication issue)
        document.getElementById("weatherInfo").style.display = "block";
        document.getElementById("cityName").innerText = `${name}, ${country}`;
        document.getElementById("temperature").innerText = `${temperature}`;  // ✅ Fixed
        document.getElementById("description").innerText = weatherDescription;
        document.getElementById("humidity").innerText = `${humidity}`;  // ✅ Fixed
        document.getElementById("wind").innerText = `${windSpeed}`;  // ✅ Fixed

    } catch (error) {
        alert(error.message);
    }
}
