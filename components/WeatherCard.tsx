import React from 'react';
import { WeatherDay } from '../types';
import { Cloud, Sun, CloudRain, CloudLightning, CloudSnow, Wind } from 'lucide-react';

interface WeatherCardProps {
  day: WeatherDay;
  isToday: boolean;
}

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes('mưa')) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (c.includes('nắng') || c.includes('quang')) return <Sun className="w-8 h-8 text-yellow-400" />;
  if (c.includes('sấm') || c.includes('bão')) return <CloudLightning className="w-8 h-8 text-purple-400" />;
  if (c.includes('tuyết')) return <CloudSnow className="w-8 h-8 text-white" />;
  if (c.includes('gió')) return <Wind className="w-8 h-8 text-slate-300" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ day, isToday }) => {
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]
      ${isToday 
        ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-900/50 border border-blue-500/50' 
        : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-bold text-lg ${isToday ? 'text-white' : 'text-slate-200'}`}>
            {day.dayName}
          </h3>
          <p className={`text-sm ${isToday ? 'text-blue-200' : 'text-slate-400'}`}>
            {day.date}
          </p>
        </div>
        <div className={`p-2 rounded-full ${isToday ? 'bg-white/10' : 'bg-slate-700/50'}`}>
          {getWeatherIcon(day.condition)}
        </div>
      </div>

      <div className="space-y-1">
        <p className={`text-3xl font-bold ${isToday ? 'text-white' : 'text-slate-100'}`}>
          {day.temp}
        </p>
        <p className={`text-sm font-medium ${isToday ? 'text-blue-100' : 'text-slate-300'}`}>
          {day.condition}
        </p>
        <p className={`text-xs mt-2 ${isToday ? 'text-blue-200' : 'text-slate-500'} line-clamp-2`}>
          {day.description}
        </p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10 flex gap-3 text-xs">
         {day.humidity && (
            <span className={`flex items-center gap-1 ${isToday ? 'text-blue-100' : 'text-slate-400'}`}>
              💧 {day.humidity}
            </span>
         )}
         {day.wind && (
            <span className={`flex items-center gap-1 ${isToday ? 'text-blue-100' : 'text-slate-400'}`}>
              💨 {day.wind}
            </span>
         )}
      </div>
    </div>
  );
};

export default WeatherCard;