import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockUsers } from '../../utils/mockData';
import { Users, UserCheck, UserX, Activity, TrendingUp, Shield, Cpu, Zap, Network, Wifi, WifiOff, Globe, Server } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter((u) => u.status === 'active').length,
    inactiveUsers: mockUsers.filter((u) => u.status === 'inactive').length,
    newUsersThisMonth: 12,
  };

  const userActivityData = [
    { day: 'Mon', logins: 45 },
    { day: 'Tue', logins: 52 },
    { day: 'Wed', logins: 48 },
    { day: 'Thu', logins: 61 },
    { day: 'Fri', logins: 55 },
    { day: 'Sat', logins: 38 },
    { day: 'Sun', logins: 42 },
  ];

  const statusData = [
    { name: 'Active', value: stats.activeUsers, color: '#10b981' },
    { name: 'Inactive', value: stats.inactiveUsers, color: '#ef4444' },
  ];

  // AI Model Accuracy Data
  const modelAccuracyData = [
    { name: 'Yield Prediction', accuracy: 94.5, requests: 1240 },
    { name: 'Pest Detection', accuracy: 91.2, requests: 856 },
    { name: 'Crop Price Pred', accuracy: 88.7, requests: 642 },
    { name: 'Soil Analysis', accuracy: 92.8, requests: 523 },
  ];

  // System Health Metrics
  const systemHealthData = [
    { metric: 'CPU Usage', value: 62, status: 'good', color: '#10b981' },
    { metric: 'Memory Usage', value: 58, status: 'good', color: '#10b981' },
    { metric: 'API Response Time', value: 142, unit: 'ms', status: 'good', color: '#10b981' },
    { metric: 'Database Load', value: 45, status: 'good', color: '#10b981' },
  ];

  // User Connectivity Data
  const connectivityData = [
    { region: 'Punjab', latency: 42, packetLoss: 0.8, users: 156, quality: 'Excellent' },
    { region: 'Sindh', latency: 38, packetLoss: 0.5, users: 142, quality: 'Excellent' },
    { region: 'KPK', latency: 58, packetLoss: 1.2, users: 98, quality: 'Good' },
    { region: 'Balochistan', latency: 45, packetLoss: 0.9, users: 134, quality: 'Excellent' },
  ];

  // ISP Performance Data
  const ispPerformanceData = [
    { isp: 'Jazz', avgLatency: 45, reliability: 98.5, users: 235 },
    { isp: 'Telenor', avgLatency: 42, reliability: 98.8, users: 198 },
    { isp: 'Zong', avgLatency: 52, reliability: 97.2, users: 142 },
    { isp: 'PTCL', avgLatency: 68, reliability: 95.4, users: 87 },
  ];

  // Real-time Connection Quality
  const connectionQualityData = [
    { time: '00:00', quality: 95 },
    { time: '04:00', quality: 97 },
    { time: '08:00', quality: 92 },
    { time: '12:00', quality: 88 },
    { time: '16:00', quality: 90 },
    { time: '20:00', quality: 93 },
    { time: '23:59', quality: 96 },
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'Good':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'Fair':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System overview and user management
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-medium">Administrator</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="mt-2">{stats.totalUsers}</h3>
                <p className="text-sm text-muted-foreground mt-2">Registered farmers</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <h3 className="mt-2">{stats.activeUsers}</h3>
                <p className="text-sm text-green-500 mt-2">Currently active</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive Users</p>
                <h3 className="mt-2">{stats.inactiveUsers}</h3>
                <p className="text-sm text-red-500 mt-2">Need attention</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <h3 className="mt-2">{stats.newUsersThisMonth}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+15%</span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ minHeight: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="logins" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center" style={{ minHeight: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Button onClick={() => navigate('/admin/users')}>View All Users</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-sm">Name</th>
                  <th className="text-left p-3 font-medium text-sm">Email</th>
                  <th className="text-left p-3 font-medium text-sm">Location</th>
                  <th className="text-left p-3 font-medium text-sm">Farm Size</th>
                  <th className="text-left p-3 font-medium text-sm">Status</th>
                  <th className="text-left p-3 font-medium text-sm">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.slice(0, 5).map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-accent transition-colors">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-3 text-sm">{user.location}</td>
                    <td className="p-3 text-sm">{user.farmSize}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${user.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Health & Performance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-primary" />
          <h2>System Health & Performance</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Model Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI Models Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelAccuracyData.map((model) => (
                  <div key={model.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{model.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{model.requests} requests</span>
                        <span className={`text-sm font-bold ${model.accuracy >= 90 ? 'text-green-500' : 'text-blue-500'}`}>
                          {model.accuracy}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${model.accuracy >= 90 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${model.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                System Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {systemHealthData.map((item) => (
                  <div key={item.metric} className="p-4 bg-accent rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{item.metric}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-green-500">{item.value}</span>
                      <span className="text-sm text-muted-foreground mb-1">{item.unit || '%'}</span>
                    </div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${item.unit ? 70 : item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Connectivity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Network className="w-6 h-6 text-primary" />
          <h2>User Connectivity & Network Performance</h2>
        </div>

        {/* Regional Connectivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Regional Connectivity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium text-sm">Region</th>
                    <th className="text-left p-3 font-medium text-sm">Avg Latency</th>
                    <th className="text-left p-3 font-medium text-sm">Packet Loss</th>
                    <th className="text-left p-3 font-medium text-sm">Active Users</th>
                    <th className="text-left p-3 font-medium text-sm">Connection Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {connectivityData.map((region) => (
                    <tr key={region.region} className="border-b border-border hover:bg-accent transition-colors">
                      <td className="p-3 font-medium">{region.region}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-primary" />
                          <span>{region.latency}ms</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={region.packetLoss < 1 ? 'text-green-500' : 'text-yellow-500'}>
                          {region.packetLoss}%
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{region.users}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getQualityColor(region.quality)}`}>
                          {region.quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Connection Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Connection Quality Index (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64" style={{ minHeight: '256px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={connectionQualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Quality Index</span>
                  <span className="text-xl font-bold text-green-500">93%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ISP Performance Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                ISP-Level Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ispPerformanceData.map((isp) => (
                  <div key={isp.isp} className="p-3 bg-accent rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{isp.isp}</span>
                      <span className="text-xs text-muted-foreground">{isp.users} users</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Latency</p>
                        <p className="font-medium text-primary">{isp.avgLatency}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reliability</p>
                        <p className={`font-medium ${isp.reliability >= 98 ? 'text-green-500' : 'text-blue-500'}`}>
                          {isp.reliability}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${isp.reliability >= 98 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${isp.reliability}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/users')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4>Manage Users</h4>
                <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4>System Logs</h4>
                <p className="text-sm text-muted-foreground mt-1">View activity logs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4>Settings</h4>
                <p className="text-sm text-muted-foreground mt-1">Configure system settings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}