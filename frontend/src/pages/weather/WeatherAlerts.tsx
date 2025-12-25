import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { mockWeatherData } from '../../utils/mockData';
import { CloudRain, Droplets, Wind, Sun, Cloud, CloudDrizzle, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search } from 'lucide-react';

export function WeatherAlerts() {
  const [current, setCurrent] = React.useState<any>(mockWeatherData.current);
  const [forecast, setForecast] = React.useState<any[]>(mockWeatherData.forecast);
  const [loading, setLoading] = React.useState(false); // Start false, effect sets true
  const [searchQuery, setSearchQuery] = React.useState('Islamabad');
  const [advisory, setAdvisory] = React.useState<any>(null); // New state for advisory

  // Use a ref to track if we've already fetched to prevent double-fetch in StrictMode
  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchWeather('Islamabad');
  }, []);

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);
      // Fetch current weather
      const currentRes = await api.get(`/weather/current?location=${encodeURIComponent(location)}`);
      setCurrent(currentRes);

      // Fetch forecast
      const forecastRes = await api.get(`/weather/forecast?location=${encodeURIComponent(location)}`);
      if (Array.isArray(forecastRes)) {
        setForecast(forecastRes);
      }

      // Fetch Advisory/Alerts
      const advisoryRes = await api.get(`/weather/alerts?location=${encodeURIComponent(location)}`);
      setAdvisory(advisoryRes);

      toast.success(`Weather updated for ${location}`);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      toast.error('Failed to update weather info. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return Sun;
      case 'cloudy':
      case 'clouds':
      case 'partly cloudy':
        return Cloud;
      case 'rain':
      case 'rainy':
      case 'drizzle':
        return CloudRain;
      case 'thunderstorm':
        return AlertTriangle;
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
            Current weather conditions and important alerts for your farm
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Enter city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Button type="submit" disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            {loading ? '...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Current Weather */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Current Weather in <span className="text-primary">{current.location || 'Loading...'}</span></CardTitle>
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
                <p className="text-2xl font-bold">{current.rain || 0} mm</p>
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
            {forecast.map((day, index) => {
              const Icon = getWeatherIcon(day.condition);
              return (
                <div
                  key={index}
                  className="p-4 bg-accent rounded-lg text-center hover:bg-accent/80 transition-colors"
                >
                  <p className="font-medium mb-3">{day.day}</p>
                  <Icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                  <p className="text-2xl font-bold">{day.temp}°C</p>
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
            {advisory?.alerts && advisory.alerts.length > 0 ? (
              advisory.alerts.map((alert: any) => (
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
            ) : (
              <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-700">
                <p className="text-sm">No critical weather alerts at this time.</p>
              </div>
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
            {advisory?.irrigation ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm mb-1">{advisory.irrigation.status}</h4>
                      <p className="text-sm text-muted-foreground">
                        {advisory.irrigation.message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="text-sm mb-2">Next Irrigation</h4>
                  <p className="text-2xl font-bold">{advisory.irrigation.next_date}</p>
                  <p className="text-sm text-muted-foreground mt-1">Based on weather forecast</p>
                </div>
              </div>
            ) : (
              <p>Loading recommendations...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {advisory?.activities?.recommended?.map((activity: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900">
                  <Sun className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-green-700 dark:text-green-400 mb-1">Recommended</h4>
                    <p className="text-sm text-muted-foreground">
                      {activity}
                    </p>
                  </div>
                </div>
              ))}
              {advisory?.activities?.restricted?.map((activity: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-red-700 dark:text-red-400 mb-1">Not Recommended</h4>
                    <p className="text-sm text-muted-foreground">
                      {activity}
                    </p>
                  </div>
                </div>
              ))}
              {(!advisory?.activities?.recommended?.length && !advisory?.activities?.restricted?.length) && (
                <p className="text-sm text-muted-foreground">No specific activity restrictions today.</p>
              )}
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
