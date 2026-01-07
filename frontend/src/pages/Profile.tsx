import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { User, Mail, Phone, MapPin, Ruler, Edit, Save, X } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+92 300 1234567',
    location: user?.location || 'Punjab',
    city: user?.city || 'Multan',
    farmSize: user?.farmSize || '25 acres',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update local storage to persist the changes across refreshes
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        setIsEditing(false);
        // Refresh page to sync all contexts
        window.location.reload();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+92 300 1234567',
      location: user?.location || 'Punjab',
      city: user?.city || 'Multan',
      farmSize: user?.farmSize || '25 acres',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-4">
          <User className="w-12 h-12 text-primary" />
        </div>
        <h1>{user?.name}</h1>
        <p className="text-muted-foreground mt-1">{user?.email}</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.location}</span>
                  </div>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City / District</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.city}</span>
                  </div>
                )}
              </div>

              {/* Farm Size */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="farmSize">Farm Size</Label>
                {isEditing ? (
                  <Input
                    id="farmSize"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder="e.g., 25 acres"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.farmSize}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Member Since</p>
              <h3>Jan 2024</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Predictions</p>
              <h3>24</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Farms Managed</p>
              <h3>3</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <h4 className="text-sm mb-1">Email Notifications</h4>
              <p className="text-xs text-muted-foreground">
                Receive alerts and updates via email
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <h4 className="text-sm mb-1">Weather Alerts</h4>
              <p className="text-xs text-muted-foreground">
                Get notified about weather changes
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <h4 className="text-sm mb-1">Market Price Updates</h4>
              <p className="text-xs text-muted-foreground">
                Daily market price notifications
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div>
              <h4 className="text-sm mb-1">Delete Account</h4>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
