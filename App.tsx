import React, { useState } from 'react';
import { WeatherResponse, WeatherStatus } from './types';
import WeatherCard from './components/WeatherCard';
import SourceCitations from './components/SourceCitations';
import { getWeatherForecast } from './services/geminiService';
import { Search, CloudSun, MapPin, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [status, setStatus] = useState<WeatherStatus>(WeatherStatus.IDLE);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setStatus(WeatherStatus.LOADING);
      setErrorMsg('');
      setWeatherData(null);

      const data = await getWeatherForecast(city);
      setWeatherData(data);
      setStatus(WeatherStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(WeatherStatus.ERROR);
      setErrorMsg(err.message || 'Có lỗi xảy ra khi lấy dữ liệu thời tiết.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 sm:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Header Section */}
      <header className="mb-10 text-center space-y-2 animate-fade-in-down">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 mb-4">
          <CloudSun className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
          Weather AI
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          Dự báo thời tiết thông minh sử dụng Gemini & Google Search
        </p>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-4xl space-y-8">
        
        {/* Search Box */}
        <form onSubmit={handleSearch} className="relative max-w-lg mx-auto group z-10">
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
            <MapPin className="ml-3 text-slate-500 w-5 h-5" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Nhập tên thành phố (ví dụ: Hà Nội, Đà Lạt...)"
              className="w-full bg-transparent border-none text-white placeholder-slate-500 px-4 py-3 focus:outline-none focus:ring-0"
              disabled={status === WeatherStatus.LOADING}
            />
            <button
              type="submit"
              disabled={status === WeatherStatus.LOADING || !city.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
            >
              {status === WeatherStatus.LOADING ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {status === WeatherStatus.ERROR && (
          <div className="max-w-lg mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Results */}
        {status === WeatherStatus.SUCCESS && weatherData && (
          <div className="animate-fade-in-up space-y-6">
            <div className="flex items-end gap-3 px-2">
              <h2 className="text-2xl font-bold text-white">{weatherData.location}</h2>
              <span className="text-slate-400 pb-1 text-sm">Dự báo 3 ngày tới</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weatherData.forecast.map((day, index) => (
                <WeatherCard 
                  key={index} 
                  day={day} 
                  isToday={index === 0} 
                />
              ))}
            </div>

            <SourceCitations sources={weatherData.sources} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-10 pb-4 text-center">
        <p className="text-xs text-slate-600">
          Powered by React & Google Gemini 2.5 Flash
        </p>
      </footer>
    </div>
  );
};

export default App;