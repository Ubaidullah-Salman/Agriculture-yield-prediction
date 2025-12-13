import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { mockFarms } from '../../utils/mockData';
import { Sprout, Plus, Edit, Trash2, MapPin, X } from 'lucide-react';

interface Farm {
  id: string;
  name: string;
  size: string;
  crop: string;
  soilType: string;
  irrigationType: string;
  status: string;
}

export function FarmManagement() {
  const [farms, setFarms] = useState<Farm[]>(mockFarms);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    crop: '',
    soilType: '',
    irrigationType: '',
    status: 'Active',
  });

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm: Farm = {
      id: Date.now().toString(),
      ...formData,
    };
    setFarms([...farms, newFarm]);
    setShowAddModal(false);
    setFormData({ name: '', size: '', crop: '', soilType: '', irrigationType: '', status: 'Active' });
  };

  const handleEditFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFarm) {
      setFarms(
        farms.map((farm) =>
          farm.id === selectedFarm.id ? { ...farm, ...formData } : farm
        )
      );
      setShowEditModal(false);
      setSelectedFarm(null);
      setFormData({ name: '', size: '', crop: '', soilType: '', irrigationType: '', status: 'Active' });
    }
  };

  const handleDeleteFarm = (farmId: string) => {
    if (confirm('Are you sure you want to delete this farm?')) {
      setFarms(farms.filter((farm) => farm.id !== farmId));
    }
  };

  const openEditModal = (farm: Farm) => {
    setSelectedFarm(farm);
    setFormData({
      name: farm.name,
      size: farm.size,
      crop: farm.crop,
      soilType: farm.soilType,
      irrigationType: farm.irrigationType,
      status: farm.status,
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>Farm Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your farm fields and cultivation details
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Farm
        </Button>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <Card key={farm.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sprout className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{farm.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{farm.size}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    farm.status === 'Active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}
                >
                  {farm.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Sprout className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Crop:</span>
                <span className="font-medium">{farm.crop}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Soil:</span>
                <span className="font-medium">{farm.soilType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Irrigation:</span>
                <span className="font-medium">{farm.irrigationType}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEditModal(farm)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteFarm(farm.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Add New Farm
                </CardTitle>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFarm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Farm Name</Label>
                    <Input
                      id="add-name"
                      name="name"
                      placeholder="e.g., North Field"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-size">Farm Size</Label>
                    <Input
                      id="add-size"
                      name="size"
                      placeholder="e.g., 12 acres"
                      value={formData.size}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-crop">Crop</Label>
                    <Select
                      id="add-crop"
                      name="crop"
                      value={formData.crop}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Crop</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Maize">Maize</option>
                      <option value="Sugarcane">Sugarcane</option>
                      <option value="Vegetables">Vegetables</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-soilType">Soil Type</Label>
                    <Select
                      id="add-soilType"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Soil Type</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Silt">Silt</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-irrigationType">Irrigation Type</Label>
                    <Select
                      id="add-irrigationType"
                      name="irrigationType"
                      value={formData.irrigationType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Irrigation</option>
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood">Flood</option>
                      <option value="Center Pivot">Center Pivot</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-status">Status</Label>
                    <Select
                      id="add-status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Fallow">Fallow</option>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Farm</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Farm Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Farm
                </CardTitle>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditFarm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Farm Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-size">Farm Size</Label>
                    <Input
                      id="edit-size"
                      name="size"
                      value={formData.size}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-crop">Crop</Label>
                    <Select
                      id="edit-crop"
                      name="crop"
                      value={formData.crop}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Crop</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Maize">Maize</option>
                      <option value="Sugarcane">Sugarcane</option>
                      <option value="Vegetables">Vegetables</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-soilType">Soil Type</Label>
                    <Select
                      id="edit-soilType"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Soil Type</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Silt">Silt</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-irrigationType">Irrigation Type</Label>
                    <Select
                      id="edit-irrigationType"
                      name="irrigationType"
                      value={formData.irrigationType}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select Irrigation</option>
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood">Flood</option>
                      <option value="Center Pivot">Center Pivot</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      id="edit-status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Fallow">Fallow</option>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
