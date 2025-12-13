import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { mockCropAdvisory } from '../../utils/mockData';
import { MessageSquare, Search, Leaf, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

export function CropAdvisory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<any>(null);

  const filteredAdvisory = mockCropAdvisory.filter(
    (advisory) =>
      advisory.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1>Crop Advisory</h1>
        <p className="text-muted-foreground mt-1">
          Get expert recommendations for different crops and seasons
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by crop name or season..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvisory.map((advisory) => (
          <Card
            key={advisory.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedCrop(advisory)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{advisory.crop}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{advisory.season} Season</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Key Recommendations:</p>
                  <ul className="space-y-1">
                    {advisory.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Expected Yield:</span>
                    <span className="text-sm text-muted-foreground">{advisory.expectedYield}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedCrop && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCrop(null)}
        >
          <Card
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedCrop.crop} Cultivation Guide</CardTitle>
                  <CardDescription>{selectedCrop.season} Season</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Expected Yield */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h4>Expected Yield</h4>
                </div>
                <p className="text-2xl font-bold text-primary">{selectedCrop.expectedYield}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Expert Recommendations
                </h4>
                <div className="space-y-3">
                  {selectedCrop.recommendations.map((rec: string, index: number) => (
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
              </div>

              {/* Growing Stages */}
              <div>
                <h4 className="mb-4">Growth Stages & Care</h4>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="text-sm mb-2">Sowing Stage (0-15 days)</h4>
                    <p className="text-sm text-muted-foreground">
                      Prepare seedbed properly, ensure proper seed depth, and maintain adequate moisture.
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="text-sm mb-2">Vegetative Stage (15-45 days)</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply first dose of nitrogen, control weeds, and ensure regular irrigation.
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="text-sm mb-2">Flowering Stage (45-75 days)</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply remaining fertilizer, monitor for pests, and maintain optimal water levels.
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="text-sm mb-2">Maturity Stage (75+ days)</h4>
                    <p className="text-sm text-muted-foreground">
                      Reduce irrigation, monitor crop maturity, and plan harvesting operations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={() => setSelectedCrop(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* General Tips Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-2">General Advisory</h4>
              <p className="text-sm text-muted-foreground">
                Always conduct soil testing before sowing. Choose certified seeds from reliable sources. 
                Follow integrated pest management practices. Maintain proper farm records for better decision making. 
                Consult with local agricultural extension officers for region-specific advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
