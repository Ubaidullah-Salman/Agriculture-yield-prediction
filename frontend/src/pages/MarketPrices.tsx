import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DollarSign, TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export function MarketPrices() {
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (!val.trim()) {
      fetchMarketData();
      return;
    }

    setIsSearching(true);
    try {
      const data: any = await api.get(`/market/search?q=${encodeURIComponent(val)}`);
      // Backend now returns an array of matches
      setMarketPrices(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.log("Not found via Binary Search", error);
      setMarketPrices([]);
    } finally {
      setIsSearching(false);
    }
  };
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      // 1. Fetch search-sorted prices (using manual QuickSort on backend)
      const priceRes = await fetch('/api/market/prices');
      const priceData = await priceRes.json();
      setMarketPrices(Array.isArray(priceData) ? priceData : []);

      // 2. Fetch Top Gainers (using manual Heap logic on backend)
      const gainerRes = await fetch('/api/market/top-gainers');
      const gainerData = await gainerRes.json();
      setTopGainers(Array.isArray(gainerData) ? gainerData : []);

    } catch (error) {
      console.error("Error fetching market prices:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchMarketData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMarketData();
  };


  // Mock historical data for selected crop
  const priceHistory = [
    { month: 'Jul', price: 2000 },
    { month: 'Aug', price: 2050 },
    { month: 'Sep', price: 1980 },
    { month: 'Oct', price: 2100 },
    { month: 'Nov', price: 2120 },
    { month: 'Dec', price: 2150 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>Market Prices</h1>
          <p className="text-muted-foreground mt-1">
            Live market rates and price trends for major crops
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Prices'}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search crop (Binary Search Powered)..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Searching...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketPrices.map((item) => {
          const isPositive = item.trend === 'up';
          return (
            <Card
              key={item.crop}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedCrop(item.crop)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4>{item.crop}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Per Quintal</p>
                    </div>
                  </div>
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h2 className="text-3xl">Rs {item.price.toLocaleString()}</h2>
                  </div>

                  <div className={`flex items-center gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{item.change}</span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Last updated: Today, 10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Price Trend Chart */}
      {selectedCrop && (
        <Card className="animate-fadeIn">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Price Trend - {selectedCrop}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCrop(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80" style={{ minHeight: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Gainers (Manual Heap Rank)</CardTitle>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">DSA Optimized</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGainers.map((item) => (
                <div key={item.crop} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div>
                    <p className="font-medium">{item.crop}</p>
                    <p className="text-sm text-muted-foreground">Rs {item.price.toLocaleString()}/{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-medium">{item.change}</p>
                    <div className="flex items-center gap-1 text-green-500 text-sm">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stable Market Prices (Sorted via MergeSort)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pb-4 border-b border-border">
                <h4 className="text-sm mb-1">Wheat Prices Rise Due to Strong Demand</h4>
                <p className="text-xs text-muted-foreground">December 6, 2025 • 2 hours ago</p>
              </div>
              <div className="pb-4 border-b border-border">
                <h4 className="text-sm mb-1">Government Announces MSP Increase</h4>
                <p className="text-xs text-muted-foreground">December 5, 2025 • 1 day ago</p>
              </div>
              <div>
                <h4 className="text-sm mb-1">Export Opportunities for Cotton Farmers</h4>
                <p className="text-xs text-muted-foreground">December 4, 2025 • 2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <DollarSign className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2">Market Information</h4>
              <p className="text-sm text-muted-foreground">
                Prices shown are indicative market rates and may vary by location and quality.
                For actual selling prices, please contact your local mandi or agricultural market.
                MSP (Minimum Support Price) information is available from government agricultural departments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}