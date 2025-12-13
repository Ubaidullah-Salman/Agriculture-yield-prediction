import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  Download,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Droplet,
  Sun,
  ArrowLeft,
} from 'lucide-react';

export function YieldResults() {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<any>(null);
  const [predictedYield, setPredictedYield] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem('yieldPredictionData');
    if (data) {
      const parsedData = JSON.parse(data);
      setPredictionData(parsedData);
      
      // Mock AI prediction calculation
      const baseYield = {
        'Wheat': 4500,
        'Rice': 5500,
        'Cotton': 1600,
        'Maize': 5000,
        'Sugarcane': 70000,
        'Soybean': 2200,
        'Pulses': 1800,
      }[parsedData.cropName] || 4000;

      // Adjust based on inputs
      let adjustedYield = baseYield;
      
      // Soil type factor
      const soilFactors: any = {
        'Loamy': 1.1,
        'Clay': 0.95,
        'Sandy': 0.85,
        'Sandy Loam': 1.0,
        'Silt': 1.05,
        'Red Soil': 0.95,
        'Black Soil': 1.1,
      };
      adjustedYield *= soilFactors[parsedData.soilType] || 1.0;

      // Irrigation factor
      const irrigationFactors: any = {
        'Drip': 1.15,
        'Sprinkler': 1.1,
        'Flood': 0.95,
        'Center Pivot': 1.12,
      };
      adjustedYield *= irrigationFactors[parsedData.irrigationType] || 1.0;

      setPredictedYield(Math.round(adjustedYield));
    } else {
      navigate('/yield');
    }
  }, [navigate]);

  const handleDownloadReport = () => {
    alert('PDF report download functionality will be implemented in production version.');
  };

  if (!predictionData) {
    return null;
  }

  const totalYield = Math.round(predictedYield * parseFloat(predictionData.landSize || 1));
  const riskLevel = predictedYield > 4500 ? 'Low' : predictedYield > 3500 ? 'Medium' : 'High';
  const riskColor = riskLevel === 'Low' ? 'text-green-500' : riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/yield')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
          <h1>Yield Prediction Results</h1>
          <p className="text-muted-foreground mt-1">
            AI-generated analysis for {predictionData.cropName} cultivation
          </p>
        </div>
        <Button onClick={handleDownloadReport} size="lg">
          <Download className="w-5 h-5 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Main Prediction Card */}
      <Card className="border-2 border-primary">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <h2 className="mb-2">Predicted Yield</h2>
            <div className="text-5xl font-bold text-primary mb-2">
              {predictedYield.toLocaleString()}
            </div>
            <p className="text-lg text-muted-foreground mb-4">kg per acre</p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div>
                <p className="text-muted-foreground">Total Land</p>
                <p className="text-xl font-semibold">{predictionData.landSize} acres</p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <p className="text-muted-foreground">Total Expected Yield</p>
                <p className="text-xl font-semibold">{totalYield.toLocaleString()} kg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${riskColor}`} />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                <p className={`text-2xl font-bold ${riskColor}`}>{riskLevel}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Favorable soil type</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Good irrigation system</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Monitor weather conditions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              Soil Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Compatibility Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <span className="font-semibold">85%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Soil Type</p>
                <p className="text-muted-foreground">{predictionData.soilType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {predictionData.soilType} soil is well-suited for {predictionData.cropName} cultivation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              Water Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Efficiency Rating</p>
                <p className="text-2xl font-bold text-blue-500">Good</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Irrigation Type</p>
                <p className="text-muted-foreground">{predictionData.irrigationType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {predictionData.irrigationType} irrigation provides optimal water distribution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fertilizer Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Fertilizer Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Nitrogen (N)</p>
              <p className="text-2xl font-bold">120-150 kg/acre</p>
              <p className="text-sm text-muted-foreground mt-2">Apply at tillering and flowering stages</p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Phosphorus (P)</p>
              <p className="text-2xl font-bold">60-80 kg/acre</p>
              <p className="text-sm text-muted-foreground mt-2">Apply as basal dose at sowing</p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Potassium (K)</p>
              <p className="text-2xl font-bold">40-60 kg/acre</p>
              <p className="text-sm text-muted-foreground mt-2">Apply at panicle initiation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary" />
            Improvement Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4>Optimize Fertilizer Application</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use soil testing to determine exact nutrient requirements. Apply fertilizers 
                  in split doses for better absorption and reduced wastage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4>Implement Precision Irrigation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor soil moisture levels regularly. Adjust irrigation schedule based on 
                  crop growth stage and weather conditions for optimal water use.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4>Pest and Disease Management</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Conduct weekly field inspections. Use integrated pest management strategies 
                  and apply pesticides only when threshold levels are reached.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4>Soil Health Improvement</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add organic matter through compost or green manure. Practice crop rotation 
                  to maintain soil fertility and reduce pest build-up.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/yield')} variant="outline" size="lg">
          New Prediction
        </Button>
        <Button onClick={handleDownloadReport} size="lg">
          <Download className="w-5 h-5 mr-2" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
}
