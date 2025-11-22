import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for porter data
interface Porter {
  id: number;
  name: string;
  experience_years: number;
  max_capacity_kg: number;
  specialties: string;
  price_per_day: number;
  description: string;
  photo?: string;
  status: "active" | "inactive";
}

interface CreatePorterRequest {
  name: string;
  experience_years: number;
  max_capacity_kg: number;
  specialties: string;
  price_per_day: number;
  description: string;
  photo?: File;
}

interface UpdatePorterRequest {
  name?: string;
  experience_years?: number;
  max_capacity_kg?: number;
  specialties?: string;
  price_per_day?: number;
  description?: string;
  photo?: File;
}

const AdminPorters = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [porters, setPorters] = useState<Porter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPorter, setEditingPorter] = useState<Porter | null>(null);
  const [addForm, setAddForm] = useState<CreatePorterRequest>({
    name: "",
    experience_years: 0,
    max_capacity_kg: 0,
    specialties: "",
    price_per_day: 0,
    description: "",
  });
  const [editForm, setEditForm] = useState<UpdatePorterRequest>({});

  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    fetchPorters();
  }, []);

  const fetchPorters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/porters', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch porters');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPorters(data.data);
      } else {
        setError(data.message || 'Failed to load porters');
      }
    } catch (err: any) {
      console.error('Error fetching porters:', err);
      setError(err.message || 'Failed to load porters');
      toast({
        title: "Error",
        description: "Failed to load porters. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPorter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('experience_years', addForm.experience_years.toString());
      formData.append('max_capacity_kg', addForm.max_capacity_kg.toString());
      formData.append('specialties', addForm.specialties);
      formData.append('price_per_day', addForm.price_per_day.toString());
      formData.append('description', addForm.description);
      
      if (addForm.photo) {
        formData.append('photo', addForm.photo);
      }

      const response = await fetch('http://localhost:5000/api/porters', {
        method: 'POST',
        headers: {
          // Don't include Content-Type header when using FormData
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowAddModal(false);
        setAddForm({
          name: "",
          experience_years: 0,
          max_capacity_kg: 0,
          specialties: "",
          price_per_day: 0,
          description: "",
        });
        fetchPorters(); // Refresh the porters list
        toast({
          title: "Success",
          description: "Porter created successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to create porter');
      }
    } catch (err: any) {
      console.error('Error adding porter:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create porter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPorter = (porter: Porter) => {
    setEditingPorter(porter);
    setEditForm({
      name: porter.name,
      experience_years: porter.experience_years,
      max_capacity_kg: porter.max_capacity_kg,
      specialties: porter.specialties,
      price_per_day: porter.price_per_day,
      description: porter.description,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPorter) return;
    
    try {
      const formData = new FormData();
      if (editForm.name) formData.append('name', editForm.name);
      if (editForm.experience_years !== undefined) formData.append('experience_years', editForm.experience_years.toString());
      if (editForm.max_capacity_kg !== undefined) formData.append('max_capacity_kg', editForm.max_capacity_kg.toString());
      if (editForm.specialties) formData.append('specialties', editForm.specialties);
      if (editForm.price_per_day !== undefined) formData.append('price_per_day', editForm.price_per_day.toString());
      if (editForm.description) formData.append('description', editForm.description);
      
      if (editForm.photo) {
        formData.append('photo', editForm.photo);
      }

      const response = await fetch(`http://localhost:5000/api/porters/${editingPorter.id}`, {
        method: 'PUT',
        headers: {
          // Don't include Content-Type header when using FormData
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowEditModal(false);
        setEditingPorter(null);
        setEditForm({});
        fetchPorters(); // Refresh the porters list
        toast({
          title: "Success",
          description: "Porter updated successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to update porter');
      }
    } catch (err: any) {
      console.error('Error updating porter:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update porter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePorter = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus porter ini? Data yang dihapus tidak bisa dikembalikan.")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/porters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchPorters(); // Refresh the porters list
        toast({
          title: "Success",
          description: "Porter deleted successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to delete porter');
      }
    } catch (err: any) {
      console.error('Error deleting porter:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete porter. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading porters...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Porter Management</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-500">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Porter Management</h1>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Porter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Porter Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPorter} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="experience_years">Pengalaman (tahun)</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={addForm.experience_years || ''}
                  onChange={(e) => setAddForm({...addForm, experience_years: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="max_capacity_kg">Kapasitas Maks (kg)</Label>
                <Input
                  id="max_capacity_kg"
                  type="number"
                  value={addForm.max_capacity_kg || ''}
                  onChange={(e) => setAddForm({...addForm, max_capacity_kg: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="specialties">Spesialisasi (pisah koma)</Label>
                <Input
                  id="specialties"
                  value={addForm.specialties}
                  onChange={(e) => setAddForm({...addForm, specialties: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="price_per_day">Harga per hari</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  value={addForm.price_per_day || ''}
                  onChange={(e) => setAddForm({...addForm, price_per_day: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={addForm.description}
                  onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo">Foto</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAddForm({...addForm, photo: e.target.files[0]});
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Tambah Porter</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {porters.length > 0 ? (
          porters.map((porter) => (
            <Card key={porter.id}>
              <CardHeader>
                <CardTitle>{porter.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Experience:</span> {porter.experience_years} tahun</p>
                  <p className="text-sm"><span className="font-medium">Kapasitas Maks:</span> {porter.max_capacity_kg} kg</p>
                  <p className="text-sm"><span className="font-medium">Harga/hari:</span> Rp {porter.price_per_day.toLocaleString()}</p>
                  <p className="text-sm"><span className="font-medium">Spesialisasi:</span> {porter.specialties}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Badge variant={porter.status === "active" ? "default" : "secondary"}>
                      {porter.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPorter(porter)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeletePorter(porter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Tidak ada porter ditemukan</p>
          </div>
        )}
      </div>

      {/* Edit Porter Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Porter</DialogTitle>
          </DialogHeader>
          {editingPorter && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama</Label>
                <Input
                  id="edit-name"
                  value={editForm.name || editingPorter.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-experience_years">Pengalaman (tahun)</Label>
                <Input
                  id="edit-experience_years"
                  type="number"
                  value={editForm.experience_years !== undefined ? editForm.experience_years : editingPorter.experience_years}
                  onChange={(e) => setEditForm({...editForm, experience_years: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-max_capacity_kg">Kapasitas Maks (kg)</Label>
                <Input
                  id="edit-max_capacity_kg"
                  type="number"
                  value={editForm.max_capacity_kg !== undefined ? editForm.max_capacity_kg : editingPorter.max_capacity_kg}
                  onChange={(e) => setEditForm({...editForm, max_capacity_kg: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-specialties">Spesialisasi (pisah koma)</Label>
                <Input
                  id="edit-specialties"
                  value={editForm.specialties || editingPorter.specialties}
                  onChange={(e) => setEditForm({...editForm, specialties: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-price_per_day">Harga per hari</Label>
                <Input
                  id="edit-price_per_day"
                  type="number"
                  value={editForm.price_per_day !== undefined ? editForm.price_per_day : editingPorter.price_per_day}
                  onChange={(e) => setEditForm({...editForm, price_per_day: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description || editingPorter.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-photo">Foto</Label>
                <Input
                  id="edit-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditForm({...editForm, photo: e.target.files[0]});
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPorters;