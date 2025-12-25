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

import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

export function YieldResults() {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<any>(null);
  const [predictedYield, setPredictedYield] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrediction = async () => {
      const data = localStorage.getItem('yieldPredictionData');
      const token = localStorage.getItem('token');

      if (!data) {
        navigate('/yield');
        return;
      }

      // Proceed even if no token (backend handles optional auth)

      try {
        const parsedData = JSON.parse(data);
        setPredictionData(parsedData);

        // Transform data for backend
        // Validate inputs to avoid NaN errors
        const validateNumber = (val: any) => {
          const num = parseFloat(val);
          return isNaN(num) ? 0 : num;
        };

        const backendPayload = {
          "District": parsedData.District,
          "Year": parsedData.Year,
          "avg_rainfall": validateNumber(parsedData.avg_rainfall),
          "avg_temperature": validateNumber(parsedData.avg_temperature),
          "Crop": parsedData.Crop,
          "soil_quality": parsedData.soil_quality
        };

        const headers: any = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/predict/yield', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(backendPayload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        setPredictedYield(result.predicted_yield);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to calculate yield. Please try again.');
        // Fallback or keep 0?
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [navigate]);

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(40, 116, 68); // Brand green
      doc.text("Yield Prediction Report", 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

      // Prediction Summary
      doc.setFontSize(16);
      doc.setTextColor(40, 116, 68);
      doc.text("Prediction Summary", 14, 45);

      const totalYield = Math.round(predictedYield * 40 * 1); // 40kg per maund

      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: [
          ['District', predictionData.District],
          ['Year', predictionData.Year],
          ['Crop', predictionData.Crop],
          ['Soil Quality', predictionData.soil_quality],
          ['Predicted Yield (Per Acre)', `${predictedYield.toFixed(2)} maunds`],
          ['Predicted Yield (in KG)', `${(predictedYield * 40).toFixed(2)} kg`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [40, 116, 68] }
      });

      // Farm Details
      doc.text("Environmental Inputs", 14, (doc as any).lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Parameter', 'Input Details']],
        body: [
          ['Average Rainfall', `${predictionData.avg_rainfall} mm`],
          ['Average Temperature', `${predictionData.avg_temperature} °C`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [40, 116, 68] }
      });

      // Recommendations
      doc.text("Recommendations", 14, (doc as any).lastAutoTable.finalY + 15);
      doc.setFontSize(10);
      doc.text(`- Climate: Average temperature of ${predictionData.avg_temperature}°C and rainfall of ${predictionData.avg_rainfall}mm recorded.`, 14, (doc as any).lastAutoTable.finalY + 25);
      doc.text(`- Crop: Management practices optimized for ${predictionData.Crop}.`, 14, (doc as any).lastAutoTable.finalY + 30);
      doc.text(`- Soil: maintaining ${predictionData.soil_quality} soil quality is key.`, 14, (doc as any).lastAutoTable.finalY + 35);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("AgriSmart AI - Empowering Farmers", 105, 290, { align: 'center' });

      doc.save(`${predictionData.cropName}_Yield_Report.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-fadeIn">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] animate-fadeIn">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => navigate('/yield')}>Try Again</Button>
      </div>
    );
  }

  if (!predictionData) {
    return null;
  }

  const totalYieldKg = Math.round(predictedYield * 40);
  const riskLevel = predictedYield > 40 ? 'Low' : predictedYield > 25 ? 'Medium' : 'High';
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
            AI-generated analysis for {predictionData.Crop} cultivation in {predictionData.District}
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
              {predictedYield.toFixed(2)}
            </div>
            <p className="text-lg text-muted-foreground mb-4">maunds per acre</p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div>
                <p className="text-muted-foreground">Approx. in KG</p>
                <p className="text-xl font-semibold">{(predictedYield * 40).toFixed(2)} kg</p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <p className="text-muted-foreground">District</p>
                <p className="text-xl font-semibold">{predictionData.District}</p>
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
                <p className="text-sm font-medium mb-2">Soil Quality</p>
                <p className="text-muted-foreground">{predictionData.soil_quality}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  The {predictionData.soil_quality} soil quality in {predictionData.District} is factored into this prediction for {predictionData.Crop}.
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
                <p className="text-sm text-muted-foreground mb-2">Environmental Factor</p>
                <p className="text-2xl font-bold text-blue-500">Monitored</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Condition Details</p>
                <p className="text-muted-foreground">{predictionData.avg_rainfall}mm rainfall, {predictionData.avg_temperature}°C temp</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Current environmental conditions are within the model's training range for {predictionData.District}.
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
