import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { TrendingUp, Leaf, MapPin, Droplet, Sprout, FlaskConical } from 'lucide-react';

export function YieldPrediction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    District: '',
    Year: new Date().getFullYear().toString(),
    avg_rainfall: '',
    avg_temperature: '',
    Crop: '',
    soil_quality: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store data in localStorage to access on results page
    localStorage.setItem('yieldPredictionData', JSON.stringify(formData));
    // Navigate to results page
    navigate('/yield/results');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h1>AI Yield Prediction</h1>
        <p className="text-muted-foreground mt-2">
          Enter your farm details to get accurate yield predictions and recommendations
        </p>
      </div>

      {/* Prediction Form */}
      <Card>
        <CardHeader>
          <CardTitle>Farm & Crop Details</CardTitle>
          <CardDescription>
            Provide accurate information for better predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Information */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location & Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="District">District *</Label>
                  <Select
                    id="District"
                    name="District"
                    value={formData.District}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {[
                      'Attock', 'Bahawalnagar', 'Bahawalpur', 'Bhakkar', 'Cahkwal', 'Chakwal',
                      'D.G.khan', 'Faisalabad', 'Gujranwala', 'Gujrat', 'Hafizabad', 'Islamabad',
                      'Jhang', 'Jhelum', 'Kasur', 'Khanewal', 'Khushab', 'Lahore', 'Layyah',
                      'Lodhran', 'M.B.Din', 'Mianwali', 'Multan', 'Muzaffargarh', 'Nankana Sahib',
                      'Narowal', 'Okara', 'Pakpattan', 'R.Y.Khan', 'Rahim Yar Khan', 'Rajanpur',
                      'Rawalpindi', 'Sahiwal', 'Sargodha', 'Sheikhupura', 'Sialkot', 'T.T. Singh',
                      'T.T.Singh', 'Vehari'
                    ].sort().map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Year">Year *</Label>
                  <Input
                    id="Year"
                    name="Year"
                    type="number"
                    placeholder="e.g., 2024"
                    value={formData.Year}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Crop & Soil */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Crop & Soil Quality
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="Crop">Crop *</Label>
                  <Select
                    id="Crop"
                    name="Crop"
                    value={formData.Crop}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Crop</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Rice">Rice</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Wheat">Wheat</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soil_quality">Soil Quality *</Label>
                  <Select
                    id="soil_quality"
                    name="soil_quality"
                    value={formData.soil_quality}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Quality</option>
                    <option value="Good">Good</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Poor">Poor</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-primary" />
                Environment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avg_rainfall">Average Rainfall (mm) *</Label>
                  <Input
                    id="avg_rainfall"
                    name="avg_rainfall"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 600.5"
                    value={formData.avg_rainfall}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avg_temperature">Average Temperature (°C) *</Label>
                  <Input
                    id="avg_temperature"
                    name="avg_temperature"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 28.5"
                    value={formData.avg_temperature}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                <TrendingUp className="w-5 h-5 mr-2" />
                Generate Prediction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Leaf className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2">How it works</h4>
              <p className="text-sm text-muted-foreground">
                Our AI model analyzes your farm data including soil type, climate conditions,
                farming practices, and historical yields to provide accurate predictions.
                You&apos;ll receive personalized recommendations to optimize your crop yield
                and maximize profitability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}