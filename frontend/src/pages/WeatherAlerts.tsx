import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
// import { mockWeatherData } from '../utils/mockData';
import { CloudRain, Droplets, Wind, Sun, Cloud, CloudDrizzle, AlertTriangle, Search, MapPin } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Interfaces for Weather Data
interface WeatherAlert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  time: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  rain: number;
}

interface AdvisoryData {
  alerts: WeatherAlert[];
  irrigation: {
    status: string;
    message: string;
    next_date: string;
  };
  activities: {
    recommended: string[];
    restricted: string[];
  };
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    location: string;
  };
  forecast: ForecastDay[];
  advisories: AdvisoryData;
}

export function WeatherAlerts() {
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchCity, setSearchCity] = React.useState('Islamabad');
  const [displayCity, setDisplayCity] = React.useState('Islamabad');

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/weather/all?location=${city}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
        setDisplayCity(city);
      }
    } catch (e) {
      console.error("Weather fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeather('Islamabad');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity);
    }
  };

  const current = weatherData?.current || { temp: 0, condition: 'Loading...', humidity: 0, windSpeed: 0, location: '' };
  const forecast = weatherData?.forecast || [];
  const advisories = weatherData?.advisories;
  const alerts = advisories?.alerts || [];

  const getWeatherIcon = (condition: string) => {
    if (!condition) return Cloud;
    switch (condition.toLowerCase()) {
      case 'sunny':
        return Sun;
      case 'cloudy':
      case 'partly cloudy':
        return Cloud;
      case 'rainy':
      case 'rain':
        return CloudRain;
      default:
        return CloudDrizzle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1>Weather & Alerts</h1>
          <p className="text-muted-foreground mt-1">
            Real-time weather updates for <span className="font-semibold text-primary">{displayCity}</span>
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              type="text"
              placeholder="Search city..."
              className="pl-3"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? '...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Current Weather */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-4">
                <Cloud className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-5xl font-bold">{current.temp}°C</h2>
              <p className="text-lg text-muted-foreground mt-2">{current.condition}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Humidity</span>
                </div>
                <p className="text-2xl font-bold">{current.humidity}%</p>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Wind Speed</span>
                </div>
                <p className="text-2xl font-bold">{current.windSpeed} km/h</p>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Rainfall</span>
                </div>
                <p className="text-2xl font-bold">0 mm</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.map((day: ForecastDay, index: number) => {
              const Icon = getWeatherIcon(day.condition);
              return (
                <div
                  key={index}
                  className="p-4 bg-accent rounded-lg text-center hover:bg-accent/80 transition-colors"
                >
                  <p className="font-medium mb-3">{day.day}</p>
                  <Icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <p className="text-2xl font-bold mb-2">{day.temp}°C</p>
                  <p className="text-xs text-muted-foreground mb-2">{day.condition}</p>
                  <div className="flex items-center justify-center gap-1 text-blue-500">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-xs">{day.rain}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Weather Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-muted-foreground">No alerts for this location.</p>
            ) : (
              alerts.map((alert: WeatherAlert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold">{alert.title}</h4>
                        <span className="text-xs opacity-75">{alert.time}</span>
                      </div>
                      <p className="text-sm opacity-90">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Irrigation Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-3">
                  <Droplets className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-1">{advisories?.irrigation ? advisories.irrigation.status : "Loading status..."}</h4>
                    <p className="text-sm text-muted-foreground">
                      {advisories?.irrigation ? advisories.irrigation.message : "Fetching data..."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="text-sm mb-2">Next Irrigation</h4>
                <p className="text-2xl font-bold">{advisories?.irrigation ? advisories.irrigation.next_date : "--"}</p>
                <p className="text-sm text-muted-foreground mt-1">Based on weather forecast</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900">
                <Sun className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-green-700 dark:text-green-400 mb-1">Recommended</h4>
                  <p className="text-sm text-muted-foreground">
                    {advisories?.activities?.recommended?.length
                      ? advisories.activities.recommended.join(', ')
                      : "General farm maintenance."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-red-700 dark:text-red-400 mb-1">Not Recommended</h4>
                  <p className="text-sm text-muted-foreground">
                    {advisories?.activities?.restricted?.length
                      ? advisories.activities.restricted.join(', ')
                      : "No specific restrictions."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <CloudRain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2">Weather Data Source</h4>
              <p className="text-sm text-muted-foreground">
                Weather data is updated every 3 hours from reliable meteorological sources.
                Forecasts are subject to change. For critical farm decisions, please consult
                with local agricultural extension services and meteorological departments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
