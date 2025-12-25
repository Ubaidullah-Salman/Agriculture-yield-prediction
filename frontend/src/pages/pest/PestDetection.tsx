import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bug, Upload, Camera, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function PestDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('token');
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/detect/pest', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      setResult({
        detected: data.detected,
        pestName: data.pest_name,
        severity: data.severity,
        confidence: Math.round(data.confidence),
        recommendations: data.recommendations,
        preventiveMeasures: data.preventiveMeasures || []
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'High':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Bug className="w-8 h-8 text-primary" />
        </div>
        <h1>Pest & Disease Detection</h1>
        <p className="text-muted-foreground mt-2">
          Upload crop images for AI-powered pest and disease identification
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Crop Image</CardTitle>
          <CardDescription>
            Take a clear photo of affected leaves or crop parts for accurate detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!selectedImage ? (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="mb-2">Upload Image</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" onClick={() => document.getElementById('image-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={selectedImage}
                    alt="Uploaded crop"
                    className="w-full h-auto max-h-96 object-contain bg-accent"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedFile(null);
                      setResult(null);
                    }}
                  >
                    Upload New
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Detection Result */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.detected ? (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                Detection Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Pest/Disease Detected</p>
                  <h3>{result.pestName}</h3>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Severity Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="font-semibold">{result.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Treatment Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-accent rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preventive Measures - Only show if data exists */}
          {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-primary" />
                  Preventive Measures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.preventiveMeasures.map((measure: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{measure}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Bug className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2">Tips for Better Detection</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take photos in good natural lighting</li>
                <li>• Focus on affected areas (leaves, stems, fruits)</li>
                <li>• Capture clear, close-up images</li>
                <li>• Upload multiple images from different angles for better accuracy</li>
                <li>• Ensure images are not blurry or overexposed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
