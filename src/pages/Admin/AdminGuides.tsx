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

// Define interfaces for guide data
interface Guide {
  id: number;
  name: string;
  title: string;
  experience_years: number;
  languages: string;
  specialties: string;
  price_per_day: number;
  description: string;
  photo?: string;
  status: "active" | "inactive";
}

interface CreateGuideRequest {
  name: string;
  title: string;
  experience_years: number;
  languages: string;
  specialties: string;
  price_per_day: number;
  description: string;
  photo?: File;
}

interface UpdateGuideRequest {
  name?: string;
  title?: string;
  experience_years?: number;
  languages?: string;
  specialties?: string;
  price_per_day?: number;
  description?: string;
  photo?: File;
}

const AdminGuides = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [addForm, setAddForm] = useState<CreateGuideRequest>({
    name: "",
    title: "Mountain Guide",
    experience_years: 0,
    languages: "",
    specialties: "",
    price_per_day: 0,
    description: "",
  });
  const [editForm, setEditForm] = useState<UpdateGuideRequest>({});

  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/guides', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGuides(data.data);
      } else {
        setError(data.message || 'Failed to load guides');
      }
    } catch (err: any) {
      console.error('Error fetching guides:', err);
      setError(err.message || 'Failed to load guides');
      toast({
        title: "Error",
        description: "Failed to load guides. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('title', addForm.title);
      formData.append('experience_years', addForm.experience_years.toString());
      formData.append('languages', addForm.languages);
      formData.append('specialties', addForm.specialties);
      formData.append('price_per_day', addForm.price_per_day.toString());
      formData.append('description', addForm.description);
      
      if (addForm.photo) {
        formData.append('photo', addForm.photo);
      }

      const response = await fetch('http://localhost:5000/api/guides', {
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
          title: "Mountain Guide",
          experience_years: 0,
          languages: "",
          specialties: "",
          price_per_day: 0,
          description: "",
        });
        fetchGuides(); // Refresh the guides list
        toast({
          title: "Success",
          description: "Guide created successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to create guide');
      }
    } catch (err: any) {
      console.error('Error adding guide:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create guide. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditGuide = (guide: Guide) => {
    setEditingGuide(guide);
    setEditForm({
      name: guide.name,
      title: guide.title,
      experience_years: guide.experience_years,
      languages: guide.languages,
      specialties: guide.specialties,
      price_per_day: guide.price_per_day,
      description: guide.description,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingGuide) return;
    
    try {
      const formData = new FormData();
      if (editForm.name) formData.append('name', editForm.name);
      if (editForm.title) formData.append('title', editForm.title);
      if (editForm.experience_years !== undefined) formData.append('experience_years', editForm.experience_years.toString());
      if (editForm.languages) formData.append('languages', editForm.languages);
      if (editForm.specialties) formData.append('specialties', editForm.specialties);
      if (editForm.price_per_day !== undefined) formData.append('price_per_day', editForm.price_per_day.toString());
      if (editForm.description) formData.append('description', editForm.description);
      
      if (editForm.photo) {
        formData.append('photo', editForm.photo);
      }

      const response = await fetch(`http://localhost:5000/api/guides/${editingGuide.id}`, {
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
        setEditingGuide(null);
        setEditForm({});
        fetchGuides(); // Refresh the guides list
        toast({
          title: "Success",
          description: "Guide updated successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to update guide');
      }
    } catch (err: any) {
      console.error('Error updating guide:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update guide. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGuide = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus guide ini? Data yang dihapus tidak bisa dikembalikan.")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/guides/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        fetchGuides(); // Refresh the guides list
        toast({
          title: "Success",
          description: "Guide deleted successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to delete guide');
      }
    } catch (err: any) {
      console.error('Error deleting guide:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete guide. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading guides...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Guide Management</h1>
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
        <h1 className="text-3xl font-bold">Guide Management</h1>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Guide
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Guide Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGuide} className="space-y-4">
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={addForm.title}
                  onChange={(e) => setAddForm({...addForm, title: e.target.value})}
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
                <Label htmlFor="languages">Bahasa (pisah koma)</Label>
                <Input
                  id="languages"
                  value={addForm.languages}
                  onChange={(e) => setAddForm({...addForm, languages: e.target.value})}
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
                <Button type="submit">Tambah Guide</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.length > 0 ? (
          guides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader>
                <CardTitle>{guide.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Title:</span> {guide.title}</p>
                  <p className="text-sm"><span className="font-medium">Experience:</span> {guide.experience_years} tahun</p>
                  <p className="text-sm"><span className="font-medium">Harga/hari:</span> Rp {guide.price_per_day.toLocaleString()}</p>
                  <p className="text-sm"><span className="font-medium">Spesialisasi:</span> {guide.specialties}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Badge variant={guide.status === "active" ? "default" : "secondary"}>
                      {guide.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditGuide(guide)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteGuide(guide.id)}
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
            <p className="text-muted-foreground">Tidak ada guide ditemukan</p>
          </div>
        )}
      </div>

      {/* Edit Guide Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guide</DialogTitle>
          </DialogHeader>
          {editingGuide && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama</Label>
                <Input
                  id="edit-name"
                  value={editForm.name || editingGuide.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title || editingGuide.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-experience_years">Pengalaman (tahun)</Label>
                <Input
                  id="edit-experience_years"
                  type="number"
                  value={editForm.experience_years !== undefined ? editForm.experience_years : editingGuide.experience_years}
                  onChange={(e) => setEditForm({...editForm, experience_years: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-languages">Bahasa (pisah koma)</Label>
                <Input
                  id="edit-languages"
                  value={editForm.languages || editingGuide.languages}
                  onChange={(e) => setEditForm({...editForm, languages: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-specialties">Spesialisasi (pisah koma)</Label>
                <Input
                  id="edit-specialties"
                  value={editForm.specialties || editingGuide.specialties}
                  onChange={(e) => setEditForm({...editForm, specialties: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-price_per_day">Harga per hari</Label>
                <Input
                  id="edit-price_per_day"
                  type="number"
                  value={editForm.price_per_day !== undefined ? editForm.price_per_day : editingGuide.price_per_day}
                  onChange={(e) => setEditForm({...editForm, price_per_day: Number(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description || editingGuide.description}
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

export default AdminGuides;