'use client';
import { JSX, useEffect, useState } from 'react';
import axios from 'axios';
import WeatherWidget from './v2';

const cache = new Map<string, iWeatherData>();

export interface iWeatherData {
  currentTime: string;
  timeZone: {
    id: string;
  };
  isDaytime: boolean;
  weatherCondition: {
    iconBaseUri: string;
    description: {
      text: string;
      languageCode: string;
    };
    type: string;
  };
  temperature: {
    degrees: number;
    unit: string;
  };
  feelsLikeTemperature: {
    degrees: number;
    unit: string;
  };
  dewPoint: {
    degrees: number;
    unit: string;
  };
  heatIndex: {
    degrees: number;
    unit: string;
  };
  windChill: {
    degrees: number;
    unit: string;
  };
  relativeHumidity: number;
  uvIndex: number;
  precipitation: {
    probability: {
      percent: number;
      type: string;
    };
    snowQpf: {
      quantity: number;
      unit: string;
    };
    qpf: {
      quantity: number;
      unit: string;
    };
  };
  thunderstormProbability: number;
  airPressure: {
    meanSeaLevelMillibars: number;
  };
  wind: {
    direction: {
      degrees: number;
      cardinal: string;
    };
    speed: {
      value: number;
      unit: string;
    };
    gust: {
      value: number;
      unit: string;
    };
  };
  visibility: {
    distance: number;
    unit: string;
  };
  cloudCover: number;
  currentConditionsHistory: {
    temperatureChange: {
      degrees: number;
      unit: string;
    };
    maxTemperature: {
      degrees: number;
      unit: string;
    };
    minTemperature: {
      degrees: number;
      unit: string;
    };
    snowQpf: {
      quantity: number;
      unit: string;
    };
    qpf: {
      quantity: number;
      unit: string;
    };
  };
}

interface iWeatherProps {
  location: string;
  eventDate: string; // Format: YYYY-MM-DD
  version?: 'v1' | 'v2';
  eventTime: `${string} - ${string}`;
}

const Weather: React.FC<iWeatherProps> = ({
  location,
  eventDate,
  eventTime,
}): JSX.Element | null => {
  const [weatherData, setWeatherData] = useState<iWeatherData | undefined>();

  useEffect(() => {
    const fetchWeather = async () => {
      const cacheKey = `${location}-${eventDate}-${eventTime}`;
      if (cache.has(cacheKey)) {
        setWeatherData(cache.get(cacheKey)!);
        return;
      }

      try {
        // Call your own Next.js API route instead of Google directly
        const res = await axios.get(`/api/weather`, {
          params: { location, eventDate, eventTime },
        });
        const weather = res.data;
        setWeatherData(weather);
        cache.set(cacheKey, weather);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [location, eventDate, eventTime]);

  if (!weatherData) {
    console.log('no weather data found');
    return null;
  }

  return <WeatherWidget data={weatherData} eventTime={eventTime} />;
};

export default Weather;
