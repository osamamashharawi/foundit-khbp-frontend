import { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";
import { api } from "../services/api";
export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    api("/weather")
      .then(setWeather)
      .catch(() => setWeather(false));
  }, []);
  return (
    <aside className="weather-card">
      <CloudSun size={25} aria-hidden="true" />
      <div>
        <strong>Heading to the park?</strong>
        <p>
          {weather
            ? `Amman · ${weather.temperature}°C · ${weather.precipitation > 0 ? "Rain — bring an umbrella" : "No rain reported"}`
            : weather === false
              ? "Weather unavailable right now."
              : "Checking Amman weather…"}
        </p>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Weather by Open-Meteo
        </a>
      </div>
    </aside>
  );
}
