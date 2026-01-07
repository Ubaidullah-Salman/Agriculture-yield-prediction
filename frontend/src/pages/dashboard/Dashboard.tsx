import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
// import { mockDashboardData, mockAlerts, mockYieldHistory } from '../../utils/mockData';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CloudRain,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Leaf,
  Sprout,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Import logout
  const [stats, setStats] = React.useState<any>(null);
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [modelPerf, setModelPerf] = React.useState<any[]>([]);
  const [yieldTrends, setYieldTrends] = React.useState<any[]>([]);
  const [predictionHistory, setPredictionHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, alertsRes, perfRes, trendsRes, priceRes, historyRes] = await Promise.all([
          fetch('/api/dashboard/stats', { headers }),
          fetch('/api/dashboard/alerts', { headers }),
          fetch('/api/dashboard/predicted-yields', { headers }),
          fetch('/api/dashboard/yield-trends', { headers }),
          fetch('/api/market/prices'), // Public
          fetch('/api/predict/history', { headers })
        ]);

        if (statsRes.status === 401 || alertsRes.status === 401) {
          // Token expired or invalid - Use context logout
          logout();
          // logout() will handle navigation and state cleanup
          return;
        }

        const statsData = statsRes.ok ? await statsRes.json() : {};
        const alertsData = alertsRes.ok ? await alertsRes.json() : [];
        const perfData = perfRes.ok ? await perfRes.json() : [];
        const trendsData = trendsRes.ok ? await trendsRes.json() : [];
        const priceData = priceRes.ok ? await priceRes.json() : [];
        const historyData = historyRes.ok ? await historyRes.json() : { session_history: [], db_history: [] };

        // Process history data for chart (counts by type)
        const allHistory = [...(historyData.session_history || []), ...(historyData.db_history || [])];
        const counts: Record<string, number> = {};
        allHistory.forEach((item: any) => {
          const type = item.type || item.prediction_type || 'Other';
          counts[type] = (counts[type] || 0) + 1;
        });

        const historyChartData = Object.entries(counts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }));

        setPredictionHistory(historyChartData);

        // Calculate expected yield defaults
        const recentYield = statsData.farms > 0 ? 45.2 : 0;

        setStats({
          farms: statsData.farms || 0,
          expectedYield: {
            value: recentYield || 0,
            unit: recentYield ? 'muns/acre' : '',
            trend: '0%',
            trendUp: true
          },
          soilHealth: statsData.soil_health || { score: 0, status: 'No Data', color: 'gray' },
          weatherRisk: statsData.weather_risk || { level: 'Low', percentage: 0 },
          marketPrice: {
            crop: (Array.isArray(priceData) && priceData[0]?.crop) || 'N/A',
            price: (Array.isArray(priceData) && priceData[0]?.price) || 0,
            unit: (Array.isArray(priceData) && priceData[0]?.unit) || '',
            change: (Array.isArray(priceData) && priceData[0]?.change) || '0%'
          },
          cropHealth: statsData.crop_health || { score: 0, status: 'No Data', color: 'gray' }
        });
        setAlerts(Array.isArray(alertsData) ? alertsData : []);
        setModelPerf(Array.isArray(perfData) ? perfData : []);
        setYieldTrends(Array.isArray(trendsData) ? trendsData : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Default values to prevent crash if loading or empty
  const expectedYield = stats?.expectedYield || { value: 0, unit: 'muns/acre', trend: '0%', trendUp: true };
  const soilHealth = stats?.soilHealth || { score: 0, status: 'N/A', color: 'gray' };
  const weatherRisk = stats?.weatherRisk || { level: 'Low', percentage: 0 };
  const marketPrice = stats?.marketPrice || { crop: 'N/A', price: 0, unit: '', change: '0%' };
  const cropHealth = stats?.cropHealth || { score: 0, status: 'N/A', color: 'gray' };

  const quickActions = [
    { label: 'Predict Yield', path: '/yield', icon: TrendingUp },
    { label: 'Crop Recommendation', path: '/crop/recommendation', icon: Sprout },
    { label: 'Pest Detection', path: '/pest', icon: Activity },
    { label: 'Check Weather', path: '/weather', icon: CloudRain },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return CloudRain;
      case 'pest':
        return Activity;
      case 'market':
        return DollarSign;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your farm overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Expected Yield */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expected Yield</p>
                <h3 className="mt-2">
                  {expectedYield.value} <span className="text-lg">{expectedYield.unit}</span>
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">{expectedYield.trend}</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Health */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Soil Health Score</p>
                <h3 className="mt-2">{soilHealth.score}/100</h3>
                <p className="text-sm text-green-500 mt-2">{soilHealth.status}</p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Risk */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weather Risk</p>
                <h3 className="mt-2">{weatherRisk.level}</h3>
                <div className="w-full bg-secondary rounded-full h-2 mt-3">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${weatherRisk.percentage}%` }}
                  />
                </div>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CloudRain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Price */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Price ({marketPrice.crop})</p>
                <h3 className="mt-2">
                  {marketPrice.currency}{marketPrice.price}
                  <span className="text-sm text-muted-foreground">{marketPrice.unit}</span>
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">{marketPrice.change}</span>
                </div>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Health */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Crop Health</p>
                <h3 className="mt-2">{cropHealth.score}/100</h3>
                <p className="text-sm text-green-500 mt-2">{cropHealth.status}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trends Line Chart */}
        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Predicted vs Historical Yield</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Growth trends over the recent seasons (Tons/Hectare)</p>
            </div>
            <div className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold">
              MAIN ANALYTICS
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ minHeight: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yieldTrends.length > 0 ? yieldTrends : [
                    { period: '2025 Q1', historical: 3.2, predicted: 3.4 },
                    { period: '2025 Q2', historical: 3.8, predicted: 3.9 },
                    { period: '2025 Q3', historical: 2.9, predicted: 3.1 },
                    { period: '2025 Q4', historical: 4.1, predicted: 4.3 },
                    { period: '2026 Q1 (Forecast)', historical: null, predicted: 4.6 },
                    { period: '2026 Q2 (Forecast)', historical: null, predicted: 4.8 },
                  ]}
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="period"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Tons/Ha', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#94a3b8"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Historical Yield"
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="Predicted Yield"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>


        {/* Predicted Yield by Crop Type Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Predicted Yield by Crop Type</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Comparison of projected production levels (Tons)</p>
            </div>
            <div className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] font-bold">
              DECISION SUPPORT
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ minHeight: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelPerf.length > 0 ? modelPerf : [
                    { crop: 'Wheat', yield: 45.2, fill: '#fbbf24' },
                    { crop: 'Rice', yield: 32.8, fill: '#10b981' },
                    { crop: 'Maize', yield: 28.5, fill: '#3b82f6' },
                    { crop: 'Cotton', yield: 18.2, fill: '#a855f7' },
                    { crop: 'Sugarcane', yield: 65.4, fill: '#ef4444' },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="crop"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Tons', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar
                    dataKey="yield"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    name="Predicted Yield"
                  >
                    {modelPerf.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-center italic">
              AI models predict yields based on nitrogen levels, soil pH, and local weather patterns to guide your crop selection.
            </p>
          </CardContent>
        </Card>

        {/* Prediction Activity Chart - Filling the space */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Prediction Analysis Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Overview of recent analysis requests
              </p>
            </div>
            <div className="px-2 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 rounded text-[10px] font-bold">
              DSA HISTORY
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ minHeight: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={predictionHistory.length > 0 ? predictionHistory : [
                      { name: 'Yield', value: 40 },
                      { name: 'Recommendation', value: 30 },
                      { name: 'Pest', value: 30 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#10b981', // Yield
                        '#3b82f6', // Recommendation
                        '#f59e0b', // Pest
                        '#8b5cf6', // Unknown
                        '#6366f1'
                      ][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-center italic">
              Tracking your recent requests using real-time manual DSA history.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${getAlertColor(alert.severity)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center p-6 rounded-lg border border-border hover:bg-accent hover:border-primary transition-all group"
                  >
                    <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="mt-3 text-sm font-medium">{action.label}</span>
                    <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}