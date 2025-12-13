import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { mockWeatherData } from '../../utils/mockData';
import { CloudRain, Droplets, Wind, Sun, Cloud, CloudDrizzle, AlertTriangle } from 'lucide-react';

export function WeatherAlerts() {
  const { current, forecast } = mockWeatherData;

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return Sun;
      case 'cloudy':
      case 'partly cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      default:
        return CloudDrizzle;
    }
  };

  const alerts = [
    {
      id: '1',
      type: 'weather',
      severity: 'high',
      title: 'Heavy Rainfall Alert',
      message: 'Heavy rainfall expected in the next 48 hours. Take necessary precautions for your crops.',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'temperature',
      severity: 'medium',
      title: 'Temperature Rise',
      message: 'Temperatures expected to rise above 35°C. Ensure adequate irrigation.',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'wind',
      severity: 'low',
      title: 'Moderate Wind Speed',
      message: 'Wind speed expected to be 15-20 km/h. Monitor young plants.',
      time: '1 day ago',
    },
  ];

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
      <div>
        <h1>Weather & Alerts</h1>
        <p className="text-muted-foreground mt-1">
          Current weather conditions and important alerts for your farm
        </p>
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
            {forecast.map((day, index) => {
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
            {alerts.map((alert) => (
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
            ))}
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
                    <h4 className="text-sm mb-1">Current Status</h4>
                    <p className="text-sm text-muted-foreground">
                      Soil moisture is adequate. Heavy rainfall expected, so skip irrigation for the next 2-3 days.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <h4 className="text-sm mb-2">Next Irrigation</h4>
                <p className="text-2xl font-bold">December 9, 2025</p>
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
                    Good conditions for fertilizer application and pest control spraying today
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-red-700 dark:text-red-400 mb-1">Not Recommended</h4>
                  <p className="text-sm text-muted-foreground">
                    Avoid harvesting operations in the next 48 hours due to expected rainfall
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
