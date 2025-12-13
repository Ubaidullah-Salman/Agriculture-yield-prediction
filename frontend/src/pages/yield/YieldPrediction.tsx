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
    cropName: '',
    soilType: '',
    landSize: '',
    fertilizerUsage: '',
    previousYield: '',
    location: '',
    irrigationType: '',
    rainfall: '',
    temperature: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
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
            {/* Crop Information */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Crop Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cropName">Crop Name *</Label>
                  <Select
                    id="cropName"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Crop</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Pulses">Pulses</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landSize">Land Size (acres) *</Label>
                  <Input
                    id="landSize"
                    name="landSize"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.landSize}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousYield">Previous Yield (kg/acre)</Label>
                  <Input
                    id="previousYield"
                    name="previousYield"
                    type="number"
                    placeholder="e.g., 4500"
                    value={formData.previousYield}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Soil & Location */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Soil & Location Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type *</Label>
                  <Select
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Soil Type</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Silt">Silt</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Black Soil">Black Soil</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Province</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Farming Practices */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-primary" />
                Farming Practices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fertilizerUsage">Fertilizer Usage (kg/acre) *</Label>
                  <Input
                    id="fertilizerUsage"
                    name="fertilizerUsage"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.fertilizerUsage}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="irrigationType">Irrigation Type *</Label>
                  <Select
                    id="irrigationType"
                    name="irrigationType"
                    value={formData.irrigationType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Irrigation</option>
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood">Flood Irrigation</option>
                    <option value="Center Pivot">Center Pivot</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall">Average Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    name="rainfall"
                    type="number"
                    placeholder="e.g., 800"
                    value={formData.rainfall}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Average Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    placeholder="e.g., 28"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Soil Nutrients */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Soil Nutrients
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">Nitrogen (mg/kg)</Label>
                  <Input
                    id="nitrogen"
                    name="nitrogen"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.nitrogen}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phosphorus">Phosphorus (mg/kg)</Label>
                  <Input
                    id="phosphorus"
                    name="phosphorus"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.phosphorus}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (mg/kg)</Label>
                  <Input
                    id="potassium"
                    name="potassium"
                    type="number"
                    placeholder="e.g., 200"
                    value={formData.potassium}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ph">pH</Label>
                  <Input
                    id="ph"
                    name="ph"
                    type="number"
                    placeholder="e.g., 6.5"
                    value={formData.ph}
                    onChange={handleChange}
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