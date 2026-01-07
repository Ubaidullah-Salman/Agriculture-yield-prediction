import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
// import { mockUsers } from '../../utils/mockData';
import { Search, Plus, Edit, Trash2, X, UserPlus, Undo2, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmSize: string;
  joinDate: string;
  lastLogin: string;
  status: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [undoLoading, setUndoLoading] = useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch real users from backend
      // The api.get helper automatically attaches the Bearer token from localStorage
      const data: any[] = await api.get('/users/');

      // Map backend snake_case to frontend camelCase
      const mappedUsers: User[] = data.map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        location: u.location || 'Unknown',
        farmSize: u.farm_size || 'N/A',
        joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never',
        status: u.status || 'active'
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
      // Optional: Show error to user or empty list
      setUsers([]);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (!val.trim()) {
      fetchUsers();
      return;
    }

    setIsSearching(true);
    try {
      const data: any = await api.get(`/users/search?q=${encodeURIComponent(val)}`);
      // If result is a single user object, wrap in array
      const results = Array.isArray(data) ? data : [data];

      const mappedResults: User[] = results.map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        location: u.location || 'Unknown',
        farmSize: u.farm_size || 'N/A',
        joinDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never',
        status: u.status || 'active'
      }));
      setUsers(mappedResults);
    } catch (error) {
      console.log("No users found via Binary Search", error);
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUndo = async () => {
    setUndoLoading(true);
    try {
      const res: any = await api.post('/admin/undo', {});
      toast.success(res.message || 'Undo successful');
      fetchUsers();
    } catch (error) {
      toast.error('Nothing to undo');
    } finally {
      setUndoLoading(false);
    }
  };

  const toggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/users/${user.id}`, { status: newStatus });
      toast.success(`User marked as ${newStatus}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
  });


  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/', {
        ...formData,
        role: 'user'
      });
      toast.success('User created successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', location: '', farmSize: '' });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        await api.put(`/users/${selectedUser.id}`, {
          ...formData
        });
        toast.success('User updated successfully');
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', phone: '', location: '', farmSize: '' });
        fetchUsers();
      } catch (error: any) {
        toast.error(error.message || 'Failed to update user');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      farmSize: user.farmSize,
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
          <h1>User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all registered farmers (Sorted by MergeSort)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUndo} disabled={undoLoading}>
            <Undo2 className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name (Binary Search Powered)..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-pulse">
                  Searching...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-sm">Name</th>
                  <th className="text-left p-3 font-medium text-sm">Email</th>
                  <th className="text-left p-3 font-medium text-sm">Phone</th>
                  <th className="text-left p-3 font-medium text-sm">Location</th>
                  <th className="text-left p-3 font-medium text-sm">Farm Size</th>
                  <th className="text-left p-3 font-medium text-sm">Join Date</th>
                  <th className="text-left p-3 font-medium text-sm">Last Login</th>
                  <th className="text-left p-3 font-medium text-sm">Status</th>
                  <th className="text-left p-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-accent transition-colors">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-3 text-sm">{user.phone}</td>
                    <td className="p-3 text-sm">{user.location}</td>
                    <td className="p-3 text-sm">{user.farmSize}</td>
                    <td className="p-3 text-sm text-muted-foreground">{user.joinDate}</td>
                    <td className="p-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${user.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1 hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/20 rounded transition-colors"
                          title="Toggle Status"
                        >
                          <ArrowUpDown className="w-4 h-4 text-amber-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 hover:bg-destructive/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New User
                </CardTitle>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Full Name</Label>
                    <Input
                      id="add-name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-email">Email</Label>
                    <Input
                      id="add-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-phone">Phone</Label>
                    <Input
                      id="add-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-location">Location</Label>
                    <Select
                      id="add-location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="add-farmSize">Farm Size</Label>
                    <Input
                      id="add-farmSize"
                      name="farmSize"
                      placeholder="e.g., 25 acres"
                      value={formData.farmSize}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add User</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit User
                </CardTitle>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Select
                      id="edit-location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-farmSize">Farm Size</Label>
                    <Input
                      id="edit-farmSize"
                      name="farmSize"
                      placeholder="e.g., 25 acres"
                      value={formData.farmSize}
                      onChange={handleFormChange}
                      required
                    />
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
