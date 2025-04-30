import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThermometer, WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { ImSpinner8 } from 'react-icons/im';
import './Weather.css';

interface WeatherData {
    name: string;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };
    weather: {
        description: string;
        icon: string;
        main: string;
    }[];
    wind: {
        speed: number;
    };
}
interface WeatherStyle {
    background: string;
    textColor: string;
}

interface WeatherBackgrounds {
    Clear: WeatherStyle;
    Clouds: WeatherStyle;
    Rain: WeatherStyle;
    Snow: WeatherStyle;
    Thunderstorm: WeatherStyle;
    Drizzle: WeatherStyle;
    Mist: WeatherStyle;
    default: WeatherStyle;
    Dust: WeatherStyle;
    Sand: WeatherStyle;
    [key: string]: WeatherStyle;
}

const weatherBackgrounds: WeatherBackgrounds = {
    Clear: {
        background: 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)',
        textColor: '#ffffff'
    },
    Clouds: {
        background: 'linear-gradient(135deg, #BBD2C5 0%, #536976 100%)',
        textColor: '#333333'
    },
    Rain: {
        background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
        textColor: '#ffffff'
    },
    Snow: {
        background: 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
        textColor: '#333333'
    },
    Thunderstorm: {
        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        textColor: '#ffffff'
    },
    Drizzle: {
        background: 'linear-gradient(135deg, #89CFF0 0%, #6BB9F0 100%)',
        textColor: '#333333'
    },
    Mist: {
        background: 'linear-gradient(135deg, #D3D3D3 0%, #A9A9A9 100%)',
        textColor: '#333333'
    },
    Dust: {
        background: 'linear-gradient(135deg, #D7CEC7 0%, #C09F80 100%)',
        textColor: '#333333'
    },
    Sand: {
        background: 'linear-gradient(135deg, #E6C35C 0%, #B88A44 100%)',
        textColor: '#333333'
    },
    default: {
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        textColor: '#333333'
    }
};

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>('London');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [appStyle, setAppStyle] = useState(weatherBackgrounds.default);
    const [currentWeatherType, setCurrentWeatherType] = useState('');

    const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'Clear': return <WiDaySunny className="weather-icon" />;
            case 'Rain': return <WiRain className="weather-icon" />;
            case 'Clouds': return <WiCloudy className="weather-icon" />;
            case 'Snow': return <WiSnow className="weather-icon" />;
            default: return <WiDaySunny className="weather-icon" />;
        }
    };

    const updateAppStyle = (weatherCondition: string) => {
        const condition = weatherCondition in weatherBackgrounds
            ? weatherCondition
            : 'default';
        setAppStyle(weatherBackgrounds[condition]);
        setCurrentWeatherType(weatherCondition);
    };

    const fetchWeather = useCallback(async () => {
        if (!city.trim()) {
            setError('Please enter a city name.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(API_URL);
            setWeather(response.data);
            updateAppStyle(response.data.weather[0].main);
        } catch (err) {
            setError('City not found. Please try again.');
            setAppStyle(weatherBackgrounds.default);
            setCurrentWeatherType('');
        } finally {
            setLoading(false);
        }
    }, [API_URL, city]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return (
        <div className={`App weather-${currentWeatherType.toLowerCase()}`} style={{
            background: appStyle.background,
            color: appStyle.textColor,
            minHeight: '100vh',
            transition: 'all 0.5s ease',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>

            <div className="weather-animation">
                {currentWeatherType === 'Rain' || currentWeatherType === 'Drizzle' ? (
                    <>
                        {[...Array(60)].map((_, i) => (
                            <div key={`rain-${i}`} className="raindrop" style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                                animationDelay: `${Math.random() * 0.5}s`,
                                opacity: `${0.5 + Math.random() * 0.5}`
                            }} />
                        ))}
                    </>
                ) : currentWeatherType === 'Snow' ? (
                    <>
                        {[...Array(50)].map((_, i) => (
                            <div key={`snow-${i}`} className="snowflake" style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                fontSize: `${Math.random() * 10 + 10}px`
                            }}>❄</div>
                        ))}
                    </>
                ) : currentWeatherType === 'Thunderstorm' ? (
                    <>
                        <div className="lightning"></div>
                        {[...Array(40)].map((_, i) => (
                            <div key={`thunder-rain-${i}`} className="raindrop heavy" style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${0.3 + Math.random() * 0.3}s`,
                                opacity: `${0.7 + Math.random() * 0.3}`
                            }} />
                        ))}
                    </>
                ) : currentWeatherType === 'Dust' || currentWeatherType === 'Sand' ? (
                    <>
                        {[...Array(40)].map((_, i) => (
                            <div key={`dust-${i}`} className="dust-particle" style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${10 + Math.random() * 10}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: `${0.3 + Math.random() * 0.7}`,
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`
                            }} />
                        ))}
                    </>
                ) : null}

            </div>

            <div className="weather-container" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
                <h1 className="app-title" style={{ marginBottom: '1.5rem' }}>Weather</h1>

                <div className="search-container" style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: `1px solid ${appStyle.textColor === '#ffffff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}`,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: appStyle.textColor,
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={fetchWeather}
                        disabled={loading}
                        style={{
                            padding: '1rem 2rem',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: appStyle.textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            color: appStyle.textColor === '#ffffff' ? '#333' : '#fff',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    >
                        {loading ? <ImSpinner8 className="spinner" style={{
                            animation: 'spin 1s linear infinite'
                        }} /> : 'Search'}
                    </button>
                </div>

                {loading && (
                    <div className="loading" style={{ textAlign: 'center', margin: '2rem 0' }}>
                        <ImSpinner8 className="spinner" style={{
                            fontSize: '2rem',
                            animation: 'spin 1s linear infinite'
                        }} />
                    </div>
                )}

                {error && <p className="error" style={{
                    color: '#ff4444',
                    textAlign: 'center',
                    marginTop: '1rem'
                }}>{error}</p>}

                {weather && (
                    <div className="weather-info">
                        <h2 className="location" style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }}>{weather.name}</h2>

                        <div className="weather-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            {getWeatherIcon(weather.weather[0].main)}
                            <p className="temperature" style={{
                                fontSize: '4rem',
                                fontWeight: 'bold'
                            }}>{Math.round(weather.main.temp)}°C</p>
                        </div>

                        <p className="description" style={{
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            textTransform: 'capitalize',
                            marginBottom: '2rem'
                        }}>{weather.weather[0].description}</p>

                        <div className="details" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1.5rem',
                            marginTop: '2rem'
                        }}>
                            {[
                                { icon: <WiThermometer style={{ fontSize: '2rem' }} />, label: 'Feels Like', value: `${Math.round(weather.main.temp)}°C` },
                                { icon: <WiHumidity style={{ fontSize: '2rem' }} />, label: 'Humidity', value: `${weather.main.humidity}%` },
                                { icon: <WiStrongWind style={{ fontSize: '2rem' }} />, label: 'Wind Speed', value: `${weather.wind.speed} m/s` },
                                { icon: <WiBarometer style={{ fontSize: '2rem' }} />, label: 'Pressure', value: `${weather.main.pressure} hPa` }
                            ].map((detail, index) => (
                                <div key={index} className="detail-card" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    padding: '1.5rem',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div className="detail-icon" style={{ color: appStyle.textColor }}>
                                        {detail.icon}
                                    </div>
                                    <div>
                                        <p style={{
                                            color: appStyle.textColor === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)',
                                            fontSize: '0.9rem'
                                        }}>{detail.label}</p>
                                        <p style={{
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            color: appStyle.textColor
                                        }}>{detail.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;