
import { useState, useEffect, useRef } from "react";
import WeatherDetails from "./components/WeatherDetails";

// Convert weather codes into readable conditions
function getWeatherCondition(code) {
  if (code === 0) {
    return { text: "Clear Sky", icon: "☀️" };
  }

  if ([1, 2].includes(code)) {
    return { text: "Partly Cloudy", icon: "⛅" };
  }

  if (code === 3) {
    return { text: "Cloudy", icon: "☁️" };
  }

  if ([45, 48].includes(code)) {
    return { text: "Foggy", icon: "🌫️" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { text: "Drizzle", icon: "🌦️" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { text: "Rainy", icon: "🌧️" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: "Snowy", icon: "❄️" };
  }

  if ([95, 96, 99].includes(code)) {
    return { text: "Thunderstorm", icon: "⛈️" };
  }

  return { text: "Unknown", icon: "🌤️" };
}

// Default location
const INITIAL_LOCATION = {
  id: 2643743,
  name: "London",
  country: "United Kingdom",
  latitude: 51.5085,
  longitude: -0.1257,
};

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

function App() {
  // City search states
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] =
    useState(INITIAL_LOCATION);

  // Weather states
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Error states
  const [searchError, setSearchError] = useState("");
  const [weatherError, setWeatherError] = useState("");

  // Refresh trigger
  const [refreshCount, setRefreshCount] = useState(0);

  // Reference to current city search request
  const searchControllerRef = useRef(null);

  // Cancel city search on unmount
  useEffect(() => {
    return () => {
      searchControllerRef.current?.abort();
    };
  }, []);

  // Handle city search
  const handleSearch = async (e) => {
    e.preventDefault();

    const searchText = city.trim();

    // Cancel previous search
    searchControllerRef.current?.abort();

    setSuggestions([]);
    setSearchError("");

    if (searchText.length < 2) {
      setSearching(false);
      setSearchError(
        "Please enter at least 2 characters."
      );
      return;
    }

    const controller = new AbortController();
    searchControllerRef.current = controller;

    setSearching(true);

    try {
      const params = new URLSearchParams({
        name: searchText,
        count: "5",
        language: "en",
        format: "json",
      });

      const response = await fetch(
        `${GEOCODING_URL}?${params}`,
        {
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to search cities. Please try again."
        );
      }

      const data = await response.json();

      if (controller.signal.aborted) return;

      if (!data.results?.length) {
        throw new Error(
          "No matching cities found. Try another name."
        );
      }

      setSuggestions(data.results);
    } catch (err) {
      if (!controller.signal.aborted) {
        setSearchError(
          err.message || "City search failed."
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setSearching(false);
      }
    }
  };

  // Update search input
  const handleCityChange = (e) => {
    searchControllerRef.current?.abort();

    setSearching(false);
    setCity(e.target.value);
    setSuggestions([]);
    setSearchError("");
  };

  // Select a city
  const handleSelectCity = (location) => {
    searchControllerRef.current?.abort();

    setSelectedLocation(location);
    setSuggestions([]);
    setCity("");
    setSearching(false);
    setSearchError("");
  };

  // Fetch weather for selected city
  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setWeatherError("");
      setWeather(null);

      try {
        const { latitude, longitude } =
          selectedLocation;

        const params = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "apparent_temperature",
            "precipitation",
            "weather_code",
          ].join(","),
          timezone: "auto",
          temperature_unit: "celsius",
          wind_speed_unit: "kmh",
          precipitation_unit: "mm",
        });

        const response = await fetch(
          `${WEATHER_URL}?${params}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to fetch weather data. Please try again."
          );
        }

        const data = await response.json();

        if (!data.current) {
          throw new Error(
            "Weather information is unavailable."
          );
        }

        const current = data.current;

        if (!controller.signal.aborted) {
          setWeather({
            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            feelsLike: current.apparent_temperature,
            precipitation: current.precipitation,
            condition: getWeatherCondition(
              current.weather_code
            ),
            updatedAt: current.time,
          });
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setWeatherError(
            err.message || "Failed to load weather."
          );
          setWeather(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [selectedLocation, refreshCount]);

  // Refresh current weather
  const handleRefresh = () => {
    setRefreshCount((count) => count + 1);
  };

  // Format selected location
  const locationName = [
    selectedLocation.name,
    selectedLocation.admin1,
    selectedLocation.country,
  ]
    .filter(Boolean)
    .join(", ");

  // Format temperature safely
  const temperature =
    typeof weather?.temperature === "number" &&
      Number.isFinite(weather.temperature)
      ? `${weather.temperature.toFixed(1)}°C`
      : "N/A";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

      {/* NAVIGATION BAR */}
      <nav className="border-b border-white/10 bg-slate-900/60 px-5 py-5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">

          <h1 className="text-xl font-bold text-sky-400 sm:text-2xl">
            ☁ Weather Dashboard
          </h1>

          <span className="hidden text-sm text-gray-300 sm:block">
            Your Daily Weather Companion
          </span>

        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">

        {/* PAGE HEADING */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
            Check Your City's Weather
          </h2>

          <p className="text-sm text-gray-400 sm:text-base">
            Search for any city to explore current
            weather information.
          </p>
        </div>

        {/* CITY SEARCH FORM */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Enter city name..."
            aria-label="Search city"
            value={city}
            onChange={handleCityChange}
            className="w-full min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />

          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-sky-500 px-7 py-4 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching
              ? "Searching..."
              : "Search Weather"}
          </button>
        </form>

        {/* SEARCH ERROR */}
        {searchError && (
          <div
            role="alert"
            className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-center text-red-300"
          >
            ⚠️ {searchError}
          </div>
        )}

        {/* CITY SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-white/10 bg-slate-800 p-4 shadow-xl">

            <h3 className="mb-4 font-semibold text-sky-300">
              Select Your Location
            </h3>

            <div className="space-y-2">
              {suggestions.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() =>
                    handleSelectCity(location)
                  }
                  className="block w-full rounded-lg bg-slate-700/70 p-4 text-left transition hover:bg-slate-600 focus-visible:outline-2 focus-visible:outline-sky-400"
                >
                  <span className="font-medium">
                    📍 {location.name}
                  </span>

                  {location.admin1
                    ? `, ${location.admin1}`
                    : ""}

                  {location.country
                    ? `, ${location.country}`
                    : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SELECTED LOCATION */}
        <div className="mb-8 text-center">
          <h3 className="text-xl font-semibold sm:text-2xl">
            📍 {locationName}
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Current Weather
          </p>

          {/* REFRESH BUTTON */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="mt-4 rounded-xl border border-sky-400/60 px-5 py-3 text-sm font-semibold text-sky-300 transition hover:bg-sky-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "↻ Refresh Weather"}
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-400/20 border-t-sky-400" />

            <p className="mt-5 text-lg font-medium text-sky-300">
              Fetching latest weather...
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Loading weather information
            </p>
          </div>
        )}

        {/* WEATHER ERROR */}
        {!loading && weatherError && (
          <div
            role="alert"
            className="mx-auto mb-8 max-w-xl rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center"
          >
            <h3 className="mb-2 text-xl font-semibold text-red-300">
              ⚠️ Unable to Load Weather
            </h3>

            <p className="text-sm text-red-200">
              {weatherError}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-5 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* WEATHER INFORMATION */}
        {!loading && !weatherError && weather && (
          <>
            {/* MAIN TEMPERATURE CARD */}
            <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-slate-800/50 p-7 text-center shadow-2xl backdrop-blur-lg sm:p-12">

              {/* Background decoration */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl"
              />

              <div className="relative">

                <p className="mb-5 text-sm font-medium uppercase tracking-widest text-sky-200">
                  Current Weather
                </p>

                {/* Weather Icon */}
                <div
                  className="mb-5 text-7xl sm:text-8xl"
                  role="img"
                  aria-label={weather.condition.text}
                >
                  {weather.condition.icon}
                </div>

                {/* Temperature */}
                <h2 className="text-6xl font-bold tracking-tight sm:text-8xl">
                  {temperature}
                </h2>

                {/* Weather Condition */}
                <p className="mt-5 text-xl font-semibold text-sky-200 sm:text-2xl">
                  {weather.condition.text}
                </p>

                {/* Last Weather Update */}
                <p className="mt-5 text-sm text-gray-400">
                  Weather data time: {weather.updatedAt}
                </p>

              </div>
            </section>

            {/* REUSABLE WEATHER DETAIL CARDS */}
            <WeatherDetails weather={weather} />
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-4 py-6 text-center text-sm text-gray-400">

        <p>
          Weather Dashboard | React.js & Tailwind CSS
        </p>

        <p className="mt-2">
          Weather data by Open-Meteo.com
        </p>

      </footer>
    </div>
  );
}

export default App;
