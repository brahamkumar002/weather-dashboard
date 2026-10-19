
# 🌤️ Weather Dashboard

A responsive Weather Dashboard built using **React.js, JavaScript, Tailwind CSS, and the Open-Meteo API**.

The application allows users to search for cities worldwide and view current weather information, including temperature, humidity, wind speed, apparent temperature, precipitation, and weather conditions.

## 🚀 Features

- 🌍 Search for cities worldwide
- 📍 Select locations from city suggestions
- 🌡️ View current temperature in Celsius
- 💧 Check relative humidity
- 🌬️ View wind speed in km/h
- 🌡️ Display feels-like temperature
- 🌧️ View precipitation measurements
- ☀️ Display weather conditions with dynamic icons
- 🔄 Refresh weather information
- ⏳ Loading indicators for API requests
- ⚠️ Error handling for invalid cities and API failures
- 📱 Responsive layout for mobile, tablet, and desktop
- 🧩 Reusable React components

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| React.js | Building the user interface |
| JavaScript (ES6+) | Application logic |
| Tailwind CSS | Responsive styling |
| Open-Meteo API | Retrieving weather information |
| Fetch API | Making HTTP requests |
| React Hooks | State management and side effects |
| Vite | Development server and production builds |
| Git & GitHub | Version control and source code hosting |

## 📂 Project Structure

```text
weather-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── WeatherCard.jsx
│   │   └── WeatherDetails.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure Node.js and npm are installed.

### 1. Clone the repository

```bash
git clone https://github.com/brahamkumar002/weather-dashboard.git
```

### 2. Navigate to the project directory

```bash
cd weather-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

http://localhost:5173/

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## 🌐 Open-Meteo API Integration

This project uses two Open-Meteo endpoints.

### 1. Geocoding API

Converts a city name into geographic coordinates.

Endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search
```

Example:

```text
https://geocoding-api.open-meteo.com/v1/search?name=Mumbai&count=5&language=en&format=json
```

The response provides location information including:

- City name
- Country
- State or administrative region
- Latitude
- Longitude

Users can choose the correct location from the search results.

### 2. Weather Forecast API

Retrieves current weather measurements using the selected location's latitude and longitude.

Endpoint:

```text
https://api.open-meteo.com/v1/forecast
```

Example:

```text
https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.8777&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation,weather_code&timezone=auto
```

### Weather Variables

| API Variable | Description |
|--------------|-------------|
| temperature_2m | Current air temperature |
| relative_humidity_2m | Relative humidity |
| wind_speed_10m | Wind speed at 10 meters |
| apparent_temperature | Feels-like temperature |
| precipitation | Precipitation amount |
| weather_code | Weather condition code |

The application converts weather codes into readable conditions such as Clear Sky, Partly Cloudy, Rainy, Snowy, and Thunderstorm.

**API Key:** The Open-Meteo free non-commercial API endpoints used in this project do not require an API key.

**Note:** Current weather values are based on available weather-model data and are not guaranteed to represent direct live sensor observations.

Official documentation:
- https://open-meteo.com/en/docs
- https://open-meteo.com/en/docs/geocoding-api

## 🔄 How the Application Works

1. The application loads with London as the default city.
2. React's `useEffect` Hook triggers a request to Open-Meteo.
3. The Fetch API retrieves current weather information.
4. React's `useState` Hook stores the returned data.
5. Weather information is displayed using reusable components.
6. Users can search for other cities.
7. The Geocoding API provides matching locations.
8. Selecting a location triggers a new weather request.
9. The dashboard dynamically updates the displayed weather.
10. The Refresh Weather button requests updated information.

## 🧩 React Components

### App.jsx

The main application component handles:

- City search input
- Location suggestions
- Selected location state
- Open-Meteo API requests
- Weather data management
- Loading and error handling
- Refresh functionality
- Weather condition mapping

### WeatherDetails.jsx

Organizes the weather measurements into a responsive grid.

Displays:

- Humidity
- Wind speed
- Feels-like temperature
- Precipitation

### WeatherCard.jsx

A reusable component for displaying individual weather measurements.

Receives properties such as:

- Icon
- Title
- Value
- Description

This component-based structure improves code reusability and maintainability.

## 🪝 React Hooks Used

### useState

Used to manage:

- City input
- Search suggestions
- Selected location
- Weather data
- Loading states
- Error messages
- Refresh count

### useEffect

Used to fetch weather information when the component mounts or when the selected location changes.

It also handles cleanup of API requests.

### useRef

Used to retain references to active city-search requests, allowing outdated requests to be cancelled.

## 📱 Responsive Design

Tailwind CSS is used to create a responsive interface.

- Desktop: Spacious dashboard layout with weather metric cards
- Tablet: Responsive two-column card grid
- Mobile: Single-column cards with adjusted spacing
- Accessible focus styles for keyboard navigation
- Reduced-motion support for users who prefer fewer animations

## 🔮 Future Enhancements

- 7-day weather forecast
- Hourly weather updates
- Weather charts and visualizations
- Automatic location detection
- Celsius and Fahrenheit toggle
- Dark and light theme switch
- Favorite cities
- Local storage for recently searched cities

## 🎯 What I Learned

Through this project, I gained practical experience in:

- Building responsive applications with React.js
- Styling interfaces using Tailwind CSS
- Integrating REST APIs using Fetch API
- Working with asynchronous JavaScript
- Managing application state using React Hooks
- Passing data between reusable components
- Handling API errors and loading states
- Implementing city-based search
- Using Git and GitHub for version control

## 👨‍💻 Author

**Braham Kumar**

GitHub: https://github.com/brahamkumar002

Project Repository:
https://github.com/brahamkumar002/weather-dashboard

## 🙏 Acknowledgment

Weather data is provided by [Open-Meteo](https://open-meteo.com/).

This project was developed for learning and portfolio purposes.
