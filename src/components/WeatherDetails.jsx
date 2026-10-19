
import WeatherCard from "./WeatherCard";

function WeatherDetails({ weather }) {
    // Format weather values safely
    const formatValue = (value, unit, decimals = 0) => {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            return "N/A";
        }

        return `${value.toFixed(decimals)}${unit}`;
    };

    // Weather information cards
    const weatherMetrics = [
        {
            id: "humidity",
            icon: "💧",
            title: "Humidity",
            value: formatValue(weather.humidity, "%"),
            description: "Relative humidity in the air",
        },
        {
            id: "wind",
            icon: "🌬️",
            title: "Wind Speed",
            value: formatValue(weather.windSpeed, " km/h", 1),
            description: "Wind speed measured at 10 meters",
        },
        {
            id: "feels-like",
            icon: "🌡️",
            title: "Feels Like",
            value: formatValue(weather.feelsLike, "°C", 1),
            description: "Apparent temperature",
        },
        {
            id: "precipitation",
            icon: "🌧️",
            title: "Precipitation",
            value: formatValue(weather.precipitation, " mm", 1),
            description: "Precipitation in the preceding interval",
        },
    ];

    return (
        <section
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6"
            aria-label="Current weather measurements"
        >
            {weatherMetrics.map((metric) => (
                <WeatherCard
                    key={metric.id}
                    icon={metric.icon}
                    title={metric.title}
                    value={metric.value}
                    description={metric.description}
                />
            ))}
        </section>
    );
}

export default WeatherDetails;
