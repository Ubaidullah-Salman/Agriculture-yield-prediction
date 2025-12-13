import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Label } from '../../components/ui/Label';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Upload,
  Camera,
  Sparkles,
  Scale,
  Activity,
  Download
} from 'lucide-react';

export function CropPricePrediction() {
  const [showResults, setShowResults] = useState(false);
  const [cropType, setCropType] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImage && cropType) {
      setShowResults(true);
    }
  };

  // Mock AI analysis results
  const analysisResults = {
    qualityScore: 87,
    grainHealth: 'Excellent',
    moisture: '12.5%',
    impurities: '1.2%',
    grainSize: 'Large',
    color: 'Good',
    predictedPrice: 2580,
    marketPrice: 2450,
    priceDifference: 130,
    confidence: 94,
  };

  const getQualityColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h1>Crop Price Prediction</h1>
        <p className="text-muted-foreground mt-2">
          Upload grain images to analyze quality and predict market price
        </p>
      </div>

      {!showResults ? (
        /* Upload Form */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Crop Type</CardTitle>
              <CardDescription>
                Choose the type of grain you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  required
                >
                  <option value="">Select crop type</option>
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn (Maize)</option>
                  <option value="rice">Rice</option>
                  <option value="cotton">Cotton</option>
                  <option value="soybean">Soybean</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="barley">Barley</option>
                  <option value="oats">Oats</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Grain Image</CardTitle>
              <CardDescription>
                Take a clear photo of your grain sample for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
                      ? 'border-primary bg-primary/5'
                      : uploadedImage
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : 'border-border hover:border-primary'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img
                        src={uploadedImage}
                        alt="Uploaded grain"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <Activity className="w-5 h-5" />
                        <span className="font-medium">Image uploaded successfully</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadedImage(null)}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                          <Camera className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2">Drag & drop grain image here</h4>
                        <p className="text-sm text-muted-foreground">
                          or click to browse from your device
                        </p>
                      </div>
                      <div>
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="imageUpload">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Image
                            </span>
                          </Button>
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!uploadedImage || !cropType}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze & Predict Price
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6 animate-fadeIn">
          {/* Uploaded Image Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Analyzed Sample - {cropType.charAt(0).toUpperCase() + cropType.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src={uploadedImage!}
                  alt="Analyzed grain"
                  className="max-h-64 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card className="border-2 border-primary">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="mb-4">Grain Quality Score</h3>
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">
                        {analysisResults.qualityScore}
                      </div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </div>
                <p className={`mt-4 text-xl font-semibold ${getQualityColor(analysisResults.qualityScore)}`}>
                  {analysisResults.grainHealth}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  AI Confidence: {analysisResults.confidence}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Price Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  Predicted Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-500">
                    Rs {analysisResults.predictedPrice}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">per quintal</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on grain quality analysis
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-500" />
                  Current Market Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-500">
                    Rs {analysisResults.marketPrice}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">per quintal</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average market rate today
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Difference */}
          <Card className={analysisResults.priceDifference > 0 ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {analysisResults.priceDifference > 0 ? (
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <h4>Price Difference</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your grain quality vs market average
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${analysisResults.priceDifference > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {analysisResults.priceDifference > 0 ? '+' : ''}Rs {analysisResults.priceDifference}
                  </div>
                  <p className="text-sm text-muted-foreground">per quintal</p>
                </div>
              </div>
              {analysisResults.priceDifference > 0 && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    <strong>Great news!</strong> Your grain quality is above market average.
                    You can negotiate for a premium price of up to Rs {analysisResults.priceDifference} more per quintal.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quality Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Moisture Content</span>
                    <span className="text-sm text-green-500">{analysisResults.moisture}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Optimal: 12-14%</p>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Impurities</span>
                    <span className="text-sm text-green-500">{analysisResults.impurities}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lower is better: &lt;2%</p>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Grain Size</span>
                    <span className="text-sm text-green-500">{analysisResults.grainSize}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Uniform & large preferred</p>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Color Quality</span>
                    <span className="text-sm text-green-500">{analysisResults.color}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Natural color preferred</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Selling Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-1 text-green-700 dark:text-green-400">
                      Premium Quality - Negotiate Higher
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your grain quality score of {analysisResults.qualityScore}/100 is excellent.
                      Target buyers who pay premium for high-quality produce.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <Scale className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-1">Best Time to Sell</h4>
                    <p className="text-sm text-muted-foreground">
                      Current market conditions are favorable. Consider selling within the next 2-3 days
                      to capture the premium pricing window.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm mb-1">Storage Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      If holding for better prices, maintain moisture at {analysisResults.moisture} and
                      store in cool, dry conditions to preserve quality.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => {
              setShowResults(false);
              setUploadedImage(null);
              setCropType('');
            }}>
              New Analysis
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2">How It Works</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your grain image for moisture, color, size, and impurities to determine
                quality grade. The predicted price is calculated based on current market rates adjusted
                for your grain&apos;s quality. Always verify with local mandi prices before selling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}