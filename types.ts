export interface WeatherDay {
  date: string;
  dayName: string; // e.g., "Hôm nay", "Thứ Hai"
  temp: string; // e.g., "28°C"
  condition: string; // e.g., "Nắng", "Mưa rào"
  description: string;
  humidity?: string;
  wind?: string;
}

export interface WeatherResponse {
  location: string;
  forecast: WeatherDay[];
  sources: string[]; // URLs from grounding
}

export enum WeatherStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}