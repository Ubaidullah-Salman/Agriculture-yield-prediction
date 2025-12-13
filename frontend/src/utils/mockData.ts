// Mock data for demonstration purposes
// In production, this would come from backend APIs

export const mockUsers = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed@farmer.com',
    phone: '+92 300 1234567',
    location: 'Punjab',
    farmSize: '25 acres',
    joinDate: '2024-01-15',
    lastLogin: '2025-12-05 09:30 AM',
    status: 'active',
  },
  {
    id: '2',
    name: 'Fatima Bibi',
    email: 'fatima@farmer.com',
    phone: '+92 301 2345678',
    location: 'Sindh',
    farmSize: '15 acres',
    joinDate: '2024-02-20',
    lastLogin: '2025-12-04 02:15 PM',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bilal Ahmed',
    email: 'bilal@farmer.com',
    phone: '+92 302 3456789',
    location: 'KPK',
    farmSize: '40 acres',
    joinDate: '2024-03-10',
    lastLogin: '2025-12-03 11:00 AM',
    status: 'active',
  },
  {
    id: '4',
    name: 'Zainab Malik',
    email: 'zainab@farmer.com',
    phone: '+92 303 4567890',
    location: 'Balochistan',
    farmSize: '30 acres',
    joinDate: '2024-04-05',
    lastLogin: '2025-12-02 04:45 PM',
    status: 'inactive',
  },
];

export const mockDashboardData = {
  expectedYield: {
    value: 4850,
    unit: 'kg/acre',
    trend: '+12%',
    trendUp: true,
  },
  soilHealth: {
    score: 78,
    status: 'Good',
    color: 'green',
  },
  weatherRisk: {
    level: 'Medium',
    percentage: 45,
    color: 'yellow',
  },
  marketPrice: {
    crop: 'Wheat',
    price: 2150,
    currency: 'Rs',
    unit: '/quintal',
    change: '+5%',
  },
  cropHealth: {
    score: 85,
    status: 'Excellent',
    color: 'green',
  },
};

export const mockAlerts = [
  {
    id: '1',
    type: 'weather',
    severity: 'high',
    title: 'Heavy Rain Alert',
    message: 'Heavy rainfall expected in next 48 hours',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'pest',
    severity: 'medium',
    title: 'Pest Activity Detected',
    message: 'Aphid population increase detected in Zone A',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'market',
    severity: 'low',
    title: 'Price Increase',
    message: 'Wheat prices increased by 8% in local market',
    timestamp: '1 day ago',
  },
];

export const mockYieldHistory = [
  { month: 'Jan', yield: 3200 },
  { month: 'Feb', yield: 3500 },
  { month: 'Mar', yield: 3800 },
  { month: 'Apr', yield: 4100 },
  { month: 'May', yield: 4400 },
  { month: 'Jun', yield: 4850 },
];

export const mockCropAdvisory = [
  {
    id: '1',
    crop: 'Wheat',
    season: 'Rabi',
    recommendations: [
      'Apply nitrogen fertilizer at tillering stage',
      'Ensure proper irrigation every 15-20 days',
      'Monitor for rust diseases',
    ],
    expectedYield: '4500-5000 kg/acre',
  },
  {
    id: '2',
    crop: 'Rice',
    season: 'Kharif',
    recommendations: [
      'Maintain water level 2-3 inches above soil',
      'Apply potash at panicle initiation',
      'Control weeds in first 30 days',
    ],
    expectedYield: '5500-6000 kg/acre',
  },
  {
    id: '3',
    crop: 'Cotton',
    season: 'Kharif',
    recommendations: [
      'Deep plowing before sowing',
      'Apply balanced NPK fertilizer',
      'Regular monitoring for bollworm',
    ],
    expectedYield: '1500-1800 kg/acre',
  },
];

export const mockMarketPrices = [
  { crop: 'Wheat', price: 2150, change: '+5%', trend: 'up' },
  { crop: 'Rice', price: 2850, change: '-2%', trend: 'down' },
  { crop: 'Cotton', price: 6200, change: '+8%', trend: 'up' },
  { crop: 'Sugarcane', price: 315, change: '+3%', trend: 'up' },
  { crop: 'Maize', price: 1950, change: '-1%', trend: 'down' },
  { crop: 'Soybean', price: 4500, change: '+12%', trend: 'up' },
];

export const mockWeatherData = {
  current: {
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
  },
  forecast: [
    { day: 'Mon', temp: 30, condition: 'Sunny', rain: 10 },
    { day: 'Tue', temp: 28, condition: 'Cloudy', rain: 40 },
    { day: 'Wed', temp: 26, condition: 'Rainy', rain: 80 },
    { day: 'Thu', temp: 27, condition: 'Cloudy', rain: 30 },
    { day: 'Fri', temp: 29, condition: 'Sunny', rain: 5 },
  ],
};

export const mockFarms = [
  {
    id: '1',
    name: 'North Field',
    size: '12 acres',
    crop: 'Wheat',
    soilType: 'Loamy',
    irrigationType: 'Drip',
    status: 'Active',
  },
  {
    id: '2',
    name: 'South Field',
    size: '8 acres',
    crop: 'Cotton',
    soilType: 'Clay',
    irrigationType: 'Sprinkler',
    status: 'Active',
  },
  {
    id: '3',
    name: 'East Field',
    size: '5 acres',
    crop: 'Vegetables',
    soilType: 'Sandy Loam',
    irrigationType: 'Drip',
    status: 'Fallow',
  },
];
