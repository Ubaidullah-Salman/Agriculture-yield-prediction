// Mock data for demonstration purposes
// In production, this would come from backend APIs

export const mockUsers = [];

export const mockDashboardData = {
  expectedYield: {
    value: 0,
    unit: 'kg/acre',
    trend: '0%',
    trendUp: true,
  },
  soilHealth: {
    score: 0,
    status: 'Unknown',
    color: 'gray',
  },
  weatherRisk: {
    level: 'Unknown',
    percentage: 0,
    color: 'gray',
  },
  marketPrice: {
    crop: '-',
    price: 0,
    currency: 'Rs',
    unit: '/quintal',
    change: '0%',
  },
  cropHealth: {
    score: 0,
    status: 'Unknown',
    color: 'gray',
  },
};

export const mockAlerts = [];

export const mockYieldHistory = [];

export const mockCropAdvisory = [];

export const mockMarketPrices = [];

export const mockWeatherData = {
  current: {
    temp: 0,
    condition: 'Unknown',
    humidity: 0,
    windSpeed: 0,
  },
  forecast: [],
};

export const mockFarms = [];
