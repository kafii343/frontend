import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Mountain = {
  id: number;
  name: string;
  location: string;
  altitude: number;
  difficulty: string;
  description: string;
  image_url?: string;
};

const API_BASE = "http://localhost:5000/api";

export default function AdminMountains() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMountainForm, setShowMountainForm] = useState(false);
  const [editing, setEditing] = useState<Mountain | null>(null);

  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchMountains = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Sending token for mountains:', token ? 'Token present' : 'No token');

      const response = await fetch(`${API_BASE}/mountains`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Mountains response status:', response.status);

      if (!response.ok) {
        // Check if response is HTML or JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch mountains');
        } else {
          // If it's not JSON, read as text to see what's returned
          const errorText = await response.text();
          console.error('API Error (non-JSON response):', errorText);
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Unexpected response format:', textResponse);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (data.success) {
        setMountains(data.data);
      } else {
        setError(data.message || 'Failed to load mountains');
      }
    } catch (err: any) {
      console.error('Error fetching mountains:', err);
      setError(err.message || 'Failed to load mountains');
      toast({
        title: "Error",
        description: "Failed to load mountains. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMountains();
  }, []);

  const confirmAndDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus mountain ini? Data yang dihapus tidak bisa dikembalikan.")) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Sending token for delete mountain:', token ? 'Token present' : 'No token');
      console.log('Deleting mountain with ID:', id);

      const response = await fetch(`${API_BASE}/mountains/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete mountain response status:', response.status);

      if (!response.ok) {
        // Check if response is HTML or JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to delete mountain');
        } else {
          // If it's not JSON, read as text to see what's returned
          const errorText = await response.text();
          console.error('API Error (non-JSON response):', errorText);
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Unexpected response format:', textResponse);
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();

      if (result.success) {
        fetchMountains(); // Refresh the mountains list
        toast({
          title: "Success",
          description: "Mountain deleted successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to delete mountain');
      }
    } catch (err: any) {
      console.error('Error deleting mountain:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete mountain. Please try again.",
        variant: "destructive",
      });
    }
  };

  // --- MountainForm
  function MountainForm({ initial = null, onClose }: { initial?: Mountain | null; onClose: () => void; }) {
    const [form, setForm] = useState({
      name: initial?.name ?? "",
      location: initial?.location ?? "",
      altitude: initial?.altitude ?? 0,
      difficulty: initial?.difficulty ?? "Menengah",
      description: initial?.description ?? "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.image_url ? `${API_BASE.replace("/api", "")}${initial.image_url}` : null);
    const isEdit = !!initial?.id;

    const handleFile = (f?: File) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };

    const submit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      try {
        const token = localStorage.getItem('token');
        console.log('Sending token for mountain form:', token ? 'Token present' : 'No token');
        console.log(isEdit ? 'Editing mountain with data:' : 'Creating mountain with data:', form);

        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("location", form.location);
        fd.append("altitude", String(form.altitude));
        fd.append("difficulty", form.difficulty);
        fd.append("description", form.description);
        if (file) fd.append("image_url", file);

        const url = isEdit ? `${API_BASE}/mountains/${initial.id}` : `${API_BASE}/mountains`;
        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: fd
        });

        console.log('Mountain form response status:', response.status);

        if (!response.ok) {
          // Check if response is HTML or JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'Failed to submit mountain');
          } else {
            // If it's not JSON, read as text to see what's returned
            const errorText = await response.text();
            console.error('API Error (non-JSON response):', errorText);
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
          }
        }

        // Check content type before parsing JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Unexpected response format:', textResponse);
          throw new Error('Server returned non-JSON response');
        }

        const result = await response.json();

        if (result.success) {
          onClose();
          fetchMountains(); // Refresh the mountains list
          toast({
            title: "Success",
            description: isEdit ? "Mountain updated successfully!" : "Mountain created successfully!",
          });
        } else {
          throw new Error(result.message || 'Failed to submit mountain');
        }
      } catch (err: any) {
        console.error('Error in mountain form:', err);
        toast({
          title: "Error",
          description: err.message || "Failed to save mountain. Please try again.",
          variant: "destructive",
        });
      }
    };

    return (
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Nama</Label>
            <Input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Lokasi</Label>
            <Input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div>
            <Label>Altitude (mdpl)</Label>
            <Input
              type="number"
              value={form.altitude || ''}
              onChange={e => setForm({ ...form, altitude: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label>Difficulty</Label>
            <select
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="Mudah">Mudah</option>
              <option value="Menengah">Menengah</option>
              <option value="Sulit">Sulit</option>
            </select>
          </div>
        </div>
        <div>
          <Label>Deskripsi</Label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <Label>Gambar</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e: any) => handleFile(e.target.files?.[0])}
          />
          {preview && <img src={preview} alt="preview" className="w-24 h-24 object-contain rounded mt-2" />}
        </div>
        <DialogFooter>
          <Button type="submit">{isEdit ? "Update" : "Simpan"}</Button>
        </DialogFooter>
      </form>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading mountains...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Mountain Management</h1>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Mountain Management</h1>
        <Button onClick={() => { setShowMountainForm(true); setEditing(null); }}>
          <Plus className="h-4 w-4 mr-2"/>Tambah Mountain
        </Button>
      </div>

      <div className="space-y-4">
        {mountains.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Tidak ada mountain ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          mountains.map(m => (
            <Card key={m.id}>
              <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex items-start gap-4">
                  {m.image_url && (
                    <img
                      src={`${API_BASE.replace("/api", "")}${m.image_url}`}
                      alt={m.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="space-y-1">
                    <CardTitle>{m.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{m.location}</p>
                    <p className="text-sm text-muted-foreground">{m.altitude} mdpl</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Badge variant={
                    m.difficulty === "Mudah" ? "default" :
                    m.difficulty === "Menengah" ? "secondary" :
                    "destructive"
                  }>
                    {m.difficulty}
                  </Badge>
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditing(m); setShowMountainForm(true); }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmAndDelete(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Mountain Modal */}
      <Dialog open={showMountainForm} onOpenChange={(open) => {
        if (!open) {
          setShowMountainForm(false);
          setEditing(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Mountain" : "Tambah Mountain Baru"}</DialogTitle>
          </DialogHeader>
          <MountainForm
            initial={editing}
            onClose={() => {
              setShowMountainForm(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}