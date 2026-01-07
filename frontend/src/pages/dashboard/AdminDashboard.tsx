import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
// import { mockUsers } from '../../utils/mockData';
import { Users, UserCheck, UserX, Activity, TrendingUp, Shield, Globe, Leaf, Sprout, AlertTriangle, DollarSign, Signal, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { UserMap } from '../../components/admin/UserMap';

export function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [connectivityData, setConnectivityData] = React.useState<any[]>([]);
  const [ispStats, setIspStats] = React.useState<any[]>([]);
  const [systemHealth, setSystemHealth] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        // Note: This endpoint requires admin privileges
        const res = await fetch('/api/users/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const mappedUsers = data.map((u: any) => ({
            id: u.id.toString(),
            name: u.name,
            email: u.email,
            location: u.location || 'Unknown',
            farmSize: u.farm_size || 'N/A',
            status: u.status || 'active',
            lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'
          }));
          setUsers(mappedUsers);
        }

        // Fetch connectivity stats
        const connRes = await fetch('/api/admin/connectivity-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (connRes.ok) setConnectivityData(await connRes.json());

        // Fetch ISP statistics
        const ispRes = await fetch('/api/admin/isp-performance', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ispRes.ok) setIspStats(await ispRes.json());

        // Fetch system health
        const healthRes = await fetch('/api/admin/system/health', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (healthRes.ok) setSystemHealth(await healthRes.json());

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'active').length,
    inactiveUsers: users.filter((u) => u.status === 'inactive').length,
    newUsersThisMonth: 12, // Hardcoded for simplified view
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
  const systemHealthData = systemHealth.length > 0 ? systemHealth : [
    { metric: 'CPU Usage', value: 62, status: 'good', color: '#10b981' },
    { metric: 'Memory Usage', value: 58, status: 'good', color: '#10b981' },
    { metric: 'API Response Time', value: 142, unit: 'ms', status: 'good', color: '#10b981' },
    { metric: 'Database Load', value: 45, status: 'good', color: '#10b981' },
  ];

  // User Connectivity Data (fetched from backend)
  const userConnectivityData = connectivityData.length > 0 ? connectivityData : [
    { region: 'Punjab', latency: 42, packetLoss: 0.8, users: 156, quality: 'Excellent', isReachable: true },
    { region: 'Sindh', latency: 38, packetLoss: 0.5, users: 142, quality: 'Excellent', isReachable: true },
    { region: 'KPK', latency: 58, packetLoss: 1.2, users: 98, quality: 'Good', isReachable: true },
    { region: 'Balochistan', latency: 45, packetLoss: 0.9, users: 134, quality: 'Excellent', isReachable: true },
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
                {users.slice(0, 5).map((user) => (
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

      {/* Agricultural Platform Analytics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <h2>Platform Agricultural Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Crops */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Crops Monitored
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Wheat', farms: 145, coverage: '4,500 acres' },
                  { name: 'Rice', farms: 98, coverage: '3,200 acres' },
                  { name: 'Cotton', farms: 76, coverage: '2,800 acres' },
                  { name: 'Sugarcane', farms: 45, coverage: '1,500 acres' },
                ].map((crop) => (
                  <div key={crop.name} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                        {crop.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{crop.name}</p>
                        <p className="text-xs text-muted-foreground">{crop.farms} farms</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{crop.coverage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Alerts Dispatched (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64" style={{ minHeight: '256px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { type: 'Weather', count: 145 },
                    { type: 'Pest', count: 86 },
                    { type: 'Disease', count: 32 },
                    { type: 'Irrigation', count: 58 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {
                        [
                          { type: 'Weather', count: 145, color: '#3b82f6' },
                          { type: 'Pest', count: 86, color: '#ef4444' },
                          { type: 'Disease', count: 32, color: '#f59e0b' },
                          { type: 'Irrigation', count: 58, color: '#10b981' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Market Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2>Crop Market Trends (10-Day)</h2>
        </div>

        <div className="flex flex-col gap-6">
          {/* Full Width Chart */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Price Fluctuations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={[
                    { day: 'Day 1', wheat: 2400, rice: 3100, cotton: 5200 },
                    { day: 'Day 2', wheat: 2420, rice: 3150, cotton: 5180 },
                    { day: 'Day 3', wheat: 2380, rice: 3120, cotton: 5250 },
                    { day: 'Day 4', wheat: 2450, rice: 3180, cotton: 5300 },
                    { day: 'Day 5', wheat: 2500, rice: 3200, cotton: 5280 },
                    { day: 'Day 6', wheat: 2480, rice: 3250, cotton: 5350 },
                    { day: 'Day 7', wheat: 2550, rice: 3220, cotton: 5400 },
                    { day: 'Day 8', wheat: 2600, rice: 3300, cotton: 5450 },
                    { day: 'Day 9', wheat: 2580, rice: 3280, cotton: 5500 },
                    { day: 'Day 10', wheat: 2650, rice: 3350, cotton: 5600 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" hide />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="wheat" stroke="#f59e0b" name="Wheat (PKR)" strokeWidth={2} />
                    <Line type="monotone" dataKey="rice" stroke="#10b981" name="Rice (PKR)" strokeWidth={2} />
                    <Line type="monotone" dataKey="cotton" stroke="#3b82f6" name="Cotton (PKR)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Volatility</p>
                    <h3 className="text-2xl font-bold text-red-600">High</h3>
                    <p className="text-xs text-muted-foreground mt-1">Due to recent rains</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Harvest Value</p>
                    <h3 className="text-2xl font-bold">Rs. 45.2M</h3>
                    <p className="text-xs text-muted-foreground mt-1">+12% vs last season</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Geo IP & User Locations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          <h2>Geo IP User Locations</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Users by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8">
              {/* 3D Global User Map */}
              <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">
                <div className="p-4 border-b border-border bg-accent/30">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                      <h3 className="font-semibold leading-none tracking-tight">User Distribution (Pakistan)</h3>
                    </div>
                    <div className="p-6 pt-0">
                      <UserMap users={users} height="500px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Monitoring Analysis (Integrated) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Signal className="w-6 h-6 text-primary" />
          <h2>Network Monitoring Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Reachability Table */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Reachability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b border-border">
                      <th className="pb-3">REGION</th>
                      <th className="pb-3">LATENCY</th>
                      <th className="pb-3">USERS</th>
                      <th className="pb-3">QUALITY</th>
                      <th className="pb-3">PATH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userConnectivityData.map((reg, idx) => (
                      <tr key={idx} className="border-b border-border/50 text-sm">
                        <td className="py-3 font-medium">{reg.region}</td>
                        <td className="py-3">{reg.latency}ms</td>
                        <td className="py-3">{reg.users}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${getQualityColor(reg.quality)}`}>
                            {reg.quality}
                          </span>
                        </td>
                        <td className="py-3">
                          {reg.isReachable !== false ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold">Isolated</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ISP Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>ISP Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ispStats.length > 0 ? ispStats : [
                    { isp: 'Jazz', avgLatency: 45 },
                    { isp: 'PTCL', avgLatency: 52 },
                    { isp: 'Zong', avgLatency: 38 },
                    { isp: 'StormFiber', avgLatency: 28 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="isp" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="avgLatency" name="Latency (ms)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[10px] text-muted-foreground">
                  * Real-time ISP latency tracking based on client metrics.
                </p>
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

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/logs')}>
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
      </div>
    </div>
  );
}