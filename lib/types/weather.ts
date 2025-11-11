export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface WeatherMain {
  temp: number;
  feels_like?: number;
  temp_min?: number;
  temp_max?: number;
  humidity: number;
  pressure: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
}

export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  main: WeatherMain;
  wind: WeatherWind;
  weather: WeatherCondition[];
  clouds: { all: number };
  visibility: number;
  dt: number;
  coord: { lat: number; lon: number };
  name: string;
  rainfall: number;
  rain?: { '1h'?: number; '3h'?: number };
  snow?: { '1h'?: number; '3h'?: number };
}

export interface ForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  wind: WeatherWind;
  clouds: { all: number };
  rainfall: number;
  pop: number;
}

export interface ForecastData {
  city: {
    name: string;
    coord: { lat: number; lon: number };
  };
  list: ForecastItem[];
}

export interface RiskData {
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
  factors: string[];
  warnings?: string[];
}

export interface FormattedWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  rainfall: number;
  condition: string;
  description: string;
  icon: string;
  location: string;
  timestamp: Date;
}

