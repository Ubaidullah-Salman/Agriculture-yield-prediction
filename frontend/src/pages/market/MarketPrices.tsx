import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { mockMarketPrices } from '../../utils/mockData';
import { DollarSign, TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';

export function MarketPrices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchPrices();

    // Poll for live prices every 3 seconds
    const interval = setInterval(() => {
      fetchPrices(true); // silent update
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.get('/market/prices');
      if (Array.isArray(data)) {
        setMarketPrices(data);
      }
    } catch (error) {
      console.error('Failed to fetch prices', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const displayPrices = marketPrices.length > 0 ? marketPrices : mockMarketPrices;

  const filteredPrices = displayPrices.filter((item) =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button onClick={() => fetchPrices(false)} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Prices'}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrices.map((item) => {
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
                    <p className="text-xs text-muted-foreground">Last updated: Live</p>
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
            <CardTitle>Top Gainers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayPrices
                .filter((item) => item.trend === 'up')
                .slice(0, 3)
                .map((item) => (
                  <div key={item.crop} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <div>
                      <p className="font-medium">{item.crop}</p>
                      <p className="text-sm text-muted-foreground">Rs {item.price.toLocaleString()}</p>
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
            <CardTitle>Market News</CardTitle>
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