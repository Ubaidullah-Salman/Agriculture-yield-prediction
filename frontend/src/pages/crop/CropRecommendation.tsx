import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import {
    Sprout,
    Droplets,
    Thermometer,
    Beaker,
    CloudRain,
    MapPin,
    RefreshCw,
    Lightbulb,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export function CropRecommendation() {
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: '',
        district: ''
    });

    const [predictionResult, setPredictionResult] = useState<{
        recommended_crop: string;
        confidence: number;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                N: parseFloat(formData.N),
                P: parseFloat(formData.P),
                K: parseFloat(formData.K),
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                ph: parseFloat(formData.ph),
                rainfall: parseFloat(formData.rainfall),
                district: formData.district
            };

            const token = localStorage.getItem('token');
            const headers: any = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/crop/recommendation', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get recommendation');
            }

            const result = await response.json();
            setPredictionResult(result);
            setShowResults(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to get recommendation. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const districts = [
        'Attock', 'Bahawalnagar', 'Bahawalpur', 'Bhakkar', 'Chakwal', 'Chiniot',
        'D.G. Khan', 'Faisalabad', 'Gujranwala', 'Gujrat', 'Hafizabad', 'Jhang',
        'Jhelum', 'Kasur', 'Khanewal', 'Khushab', 'Lahore', 'Layyah', 'Lodhran',
        'M.B. Din', 'Mianwali', 'Multan', 'Muzaffargarh', 'Nankana Sahib',
        'Narowal', 'Okara', 'Pakpattan', 'Rahim Yar Khan', 'Rajanpur',
        'Rawalpindi', 'Sahiwal', 'Sargodha', 'Sheikhupura', 'Sialkot',
        'Toba Tek Singh', 'Vehari'
    ].sort();

    // Mapping for internal values (consistent with DISTRICT_MAP in backend)
    const districtMapping: Record<string, string> = {
        'Rahim Yar Khan': 'ryk',
        'M.B. Din': 'm.b.din',
        'Muzaffargarh': 'muzafargarh',
        'D.G. Khan': 'd.g.khan',
        'Toba Tek Singh': 'tobataiksingh',
        'Sheikhupura': 'shekupora',
        'Narowal': 'narowall',
        'Vehari': 'vihari',
        'Chakwal': 'chakwall',
        'Jhelum': 'jehlum',
        'Sargodha': 'sarjodha',
        'Chiniot': 'chainiot',
        'Bahawalpur': 'bwp',
        'Islamabad': 'isl',
        'Bhakkar': 'bakar'
    };

    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Sprout className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Smart Crop Recommendation</h1>
                <p className="text-muted-foreground mt-2">
                    Get scientific crop suggestions based on your soil nutrients, weather, and region
                </p>
            </div>

            {!showResults ? (
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle>Soil & Environmental Analysis</CardTitle>
                        <CardDescription>
                            Fill in the details below to find the most suitable crop for your land
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Region Selection */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" /> Regional Data
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District</Label>
                                        <Select
                                            id="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(d => (
                                                <option key={d} value={districtMapping[d] || d.toLowerCase()}>{d}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Soil Nutrients */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center">
                                    <Beaker className="w-4 h-4 mr-2" /> Soil Nutrients (NPK)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="N">Nitrogen (N)</Label>
                                        <Input
                                            id="N"
                                            type="number"
                                            placeholder="e.g. 90"
                                            value={formData.N}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="P">Phosphorus (P)</Label>
                                        <Input
                                            id="P"
                                            type="number"
                                            placeholder="e.g. 42"
                                            value={formData.P}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="K">Potassium (K)</Label>
                                        <Input
                                            id="K"
                                            type="number"
                                            placeholder="e.g. 43"
                                            value={formData.K}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Environmental Factors */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center">
                                    <Thermometer className="w-4 h-4 mr-2" /> Environmental Factors
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="temperature">Temperature (°C)</Label>
                                        <div className="relative">
                                            <Thermometer className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="temperature"
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="e.g. 25.5"
                                                value={formData.temperature}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="humidity">Humidity (%)</Label>
                                        <div className="relative">
                                            <Droplets className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="humidity"
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="e.g. 80"
                                                value={formData.humidity}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ph">Soil pH</Label>
                                        <div className="relative">
                                            <Beaker className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="ph"
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="e.g. 6.5"
                                                value={formData.ph}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rainfall">Rainfall (mm)</Label>
                                        <div className="relative">
                                            <CloudRain className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="rainfall"
                                                type="number"
                                                step="0.01"
                                                className="pl-9"
                                                placeholder="e.g. 200"
                                                value={formData.rainfall}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center border border-destructive/20">
                                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <Button type="submit" size="lg" className="w-full text-lg h-12 shadow-md hover:shadow-lg transition-all" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center">
                                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                        Finding Best Crop...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Lightbulb className="w-5 h-5 mr-2" />
                                        Generate Recommendation
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                /* Results View */
                <div className="animate-scaleIn">
                    <Card className="border-2 border-primary overflow-hidden shadow-2xl bg-gradient-to-br from-background to-primary/5">
                        <div className="bg-primary/10 p-8 text-center border-b border-primary/20">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-xl font-medium text-muted-foreground mb-2">
                                The Recommended Crop is
                            </h2>
                            <div className="text-6xl font-black text-primary my-4 tracking-tight capitalize">
                                {predictionResult?.recommended_crop}
                            </div>
                            <div className="flex items-center justify-center space-x-2 mt-4">
                                <div className="h-1 w-24 bg-primary/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${predictionResult?.confidence}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-primary">
                                    {predictionResult?.confidence}% Confidence
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="p-4 bg-accent/50 rounded-xl border border-accent/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">District</p>
                                    <p className="text-lg font-semibold capitalize">{formData.district.replace('muzafargarh', 'Muzaffargarh').replace('ryk', 'Rahim Yar Khan')}</p>
                                </div>
                                <div className="p-4 bg-accent/50 rounded-xl border border-accent/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Soil pH</p>
                                    <p className="text-lg font-semibold">{formData.ph}</p>
                                </div>
                                <div className="p-4 bg-accent/50 rounded-xl border border-accent/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Nutrients (N-P-K)</p>
                                    <p className="text-lg font-semibold">{formData.N}-{formData.P}-{formData.K}</p>
                                </div>
                                <div className="p-4 bg-accent/50 rounded-xl border border-accent/20">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Environment</p>
                                    <p className="text-lg font-semibold">{formData.temperature}°C / {formData.humidity}%</p>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={() => setShowResults(false)} variant="outline" size="lg" className="flex-1 sm:flex-none">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Analyze Different Land
                                </Button>
                                <Button size="lg" className="flex-1 sm:flex-none" onClick={() => window.print()}>
                                    Download Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advisory Tip */}
                    <div className="mt-8 p-6 bg-secondary/30 rounded-2xl border border-secondary flex items-start space-x-4">
                        <div className="p-3 bg-secondary rounded-xl">
                            <Lightbulb className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Why {predictionResult?.recommended_crop}?</h4>
                            <p className="text-muted-foreground">
                                Based on the soil pH of {formData.ph} and high Nitrogen levels, your soil is perfectly suited for {predictionResult?.recommended_crop}.
                                The rainfall level of {formData.rainfall}mm also aligns with the water requirements for this crop in {formData.district}.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
