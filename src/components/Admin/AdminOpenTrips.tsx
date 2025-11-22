import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search, Calendar, MapPin, Users, DollarSign, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TripBookings from "./TripBookings";

interface OpenTrip {
  id: number;
  title: string;
  mountain_id?: number;
  mountain_name: string;
  base_price: number;
  original_price: number;
  duration_days: number;
  duration_nights: number;
  difficulty: string;
  min_participants: number;
  max_participants: number;
  quota_remaining: number;
  is_closed: boolean;
  description: string;
  includes: string[];
  highlights: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface Mountain {
  id: number;
  name: string;
}

interface Guide {
  id: number;
  name: string;
  rating: number;
}

interface Porter {
  id: number;
  name: string;
  rating: number;
}

interface CreateOpenTripRequest {
  title: string;
  mountain_id?: number;
  duration_days: number;
  duration_nights: number;
  difficulty: string;
  base_price: number;
  original_price: number;
  min_participants: number;
  max_participants: number;
  description: string;
  includes: string[];
  highlights: string[];
  image_url?: string;
}

interface UpdateOpenTripRequest {
  title?: string;
  mountain_id?: number;
  duration_days?: number;
  duration_nights?: number;
  difficulty?: string;
  base_price?: number;
  original_price?: number;
  min_participants?: number;
  max_participants?: number;
  description?: string;
  includes?: string[];
  highlights?: string[];
  image_url?: string;
}

const API_BASE = "http://localhost:5000/api";

export default function AdminOpenTrips() {
  const [openTrips, setOpenTrips] = useState<OpenTrip[]>([]);
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [porters, setPorters] = useState<Porter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<OpenTrip | null>(null);
  const [createForm, setCreateForm] = useState<CreateOpenTripRequest>({
    title: "",
    mountain_id: undefined,
    duration_days: 1,
    duration_nights: 0,
    difficulty: "Easy",
    base_price: 0,
    original_price: 0,
    min_participants: 1,
    max_participants: 10,
    description: "",
    includes: [],
    highlights: [],
    image_url: undefined,
  });
  const [editForm, setEditForm] = useState<UpdateOpenTripRequest>({});
  const [includesInput, setIncludesInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [editIncludesInput, setEditIncludesInput] = useState("");
  const [editHighlightsInput, setEditHighlightsInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch open trips, mountains, guides, and porters
  useEffect(() => {
    fetchOpenTrips();
    fetchMountains();
    fetchGuides();
    fetchPorters();
  }, []);

  // Apply filters whenever openTrips or filters change
  const [filteredOpenTrips, setFilteredOpenTrips] = useState<OpenTrip[]>([]);
  useEffect(() => {
    let result = [...openTrips];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(trip => 
        trip.title.toLowerCase().includes(term) || 
        trip.mountain_name.toLowerCase().includes(term) ||
        trip.description.toLowerCase().includes(term)
      );
    }

    setFilteredOpenTrips(result);
  }, [openTrips, searchTerm]);

  const fetchOpenTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/open-trips`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const result = await response.json();

      if (result.success) {
        setOpenTrips(result.data);
      } else {
        console.error("Failed to fetch open trips:", result.message);
        toast({
          title: "Error",
          description: "Failed to fetch open trips",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching open trips:", error);
      toast({
        title: "Error",
        description: "Failed to fetch open trips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMountains = async () => {
    try {
      const response = await fetch(`${API_BASE}/mountains`);
      const result = await response.json();
      if (result.success) {
        setMountains(result.data);
      }
    } catch (error) {
      console.error("Error fetching mountains:", error);
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await fetch(`${API_BASE}/guides`);
      const result = await response.json();
      if (result.success) {
        setGuides(result.data);
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const fetchPorters = async () => {
    try {
      const response = await fetch(`${API_BASE}/porters`);
      const result = await response.json();
      if (result.success) {
        setPorters(result.data);
      }
    } catch (error) {
      console.error("Error fetching porters:", error);
    }
  };

  const handleCreateOpenTrip = async () => {
    try {
      // Add debug log for form data
      console.log("Create form data before submitting:", createForm);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', createForm.title);
      if (createForm.mountain_id !== undefined && createForm.mountain_id !== null) {
        const mountain_id = Number(createForm.mountain_id);
        if (!isNaN(mountain_id)) {
          formData.append('mountain_id', mountain_id.toString());
        }
      }
      const duration_days = Number(createForm.duration_days);
      if (!isNaN(duration_days)) {
        formData.append('duration_days', duration_days.toString());
      }
      const duration_nights = Number(createForm.duration_nights);
      if (!isNaN(duration_nights)) {
        formData.append('duration_nights', duration_nights.toString());
      }
      formData.append('difficulty', createForm.difficulty);
      const base_price = Number(createForm.base_price);
      if (!isNaN(base_price)) {
        formData.append('base_price', base_price.toString());
      }
      const original_price = Number(createForm.original_price);
      if (!isNaN(original_price)) {
        formData.append('original_price', original_price.toString());
      }
      const min_participants = Number(createForm.min_participants);
      if (!isNaN(min_participants)) {
        formData.append('min_participants', min_participants.toString());
      }
      const max_participants = Number(createForm.max_participants);
      if (!isNaN(max_participants)) {
        formData.append('max_participants', max_participants.toString());
      }
      formData.append('description', createForm.description);
      formData.append('includes', JSON.stringify(createForm.includes));
      formData.append('highlights', JSON.stringify(createForm.highlights));
      
      // If there's an image file, add it to the form data
      if (imageFile) {
        formData.append('image_url', imageFile);
      }

      const response = await fetch(`${API_BASE}/admin/open-trips`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setShowCreateModal(false);
        setCreateForm({
          title: "",
          mountain_id: undefined,
          duration_days: 1,
          duration_nights: 0,
          difficulty: "Easy",
          base_price: 0,
          original_price: 0,
          min_participants: 1,
          max_participants: 10,
          description: "",
          includes: [],
          highlights: [],
          image_url: undefined,
        });
        setIncludesInput("");
        setHighlightsInput("");
        setImageFile(null);
        fetchOpenTrips(); // Refresh the open trips list
        toast({
          title: "Success",
          description: "Open trip created successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to create open trip");
      }
    } catch (error: any) {
      console.error("Error creating open trip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create open trip",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOpenTrip = async () => {
    if (!editingTrip) return;

    try {
      // Add debug log for form data
      console.log("Edit form data before submitting:", editForm);

      // Verify required fields and data types before submission
      if (editForm.title === undefined || editForm.title === null || editForm.title.trim() === "") {
        throw new Error("Title is required and cannot be empty");
      }

      // Create form data for file upload
      const formData = new FormData();
      if (editForm.title) formData.append('title', editForm.title);
      if (editForm.mountain_id !== undefined && editForm.mountain_id !== null) {
        const mountain_id = Number(editForm.mountain_id);
        if (!isNaN(mountain_id)) {
          formData.append('mountain_id', mountain_id.toString());
        }
      }
      if (editForm.duration_days !== undefined && editForm.duration_days !== null) {
        const duration_days = Number(editForm.duration_days);
        if (!isNaN(duration_days)) {
          formData.append('duration_days', duration_days.toString());
        }
      }
      if (editForm.duration_nights !== undefined && editForm.duration_nights !== null) {
        const duration_nights = Number(editForm.duration_nights);
        if (!isNaN(duration_nights)) {
          formData.append('duration_nights', duration_nights.toString());
        }
      }
      if (editForm.difficulty) formData.append('difficulty', editForm.difficulty);
      if (editForm.base_price !== undefined && editForm.base_price !== null) {
        const base_price = Number(editForm.base_price);
        if (!isNaN(base_price)) {
          formData.append('base_price', base_price.toString());
        }
      }
      if (editForm.original_price !== undefined && editForm.original_price !== null) {
        const original_price = Number(editForm.original_price);
        if (!isNaN(original_price)) {
          formData.append('original_price', original_price.toString());
        }
      }
      if (editForm.min_participants !== undefined && editForm.min_participants !== null) {
        const min_participants = Number(editForm.min_participants);
        if (!isNaN(min_participants)) {
          formData.append('min_participants', min_participants.toString());
        }
      }
      if (editForm.max_participants !== undefined && editForm.max_participants !== null) {
        const max_participants = Number(editForm.max_participants);
        if (!isNaN(max_participants)) {
          formData.append('max_participants', max_participants.toString());
        }
      }
      if (editForm.description) formData.append('description', editForm.description);
      if (editForm.includes) formData.append('includes', JSON.stringify(editForm.includes));
      if (editForm.highlights) formData.append('highlights', JSON.stringify(editForm.highlights));
      
      // If there's an image file, add it to the form data
      if (editImageFile) {
        formData.append('image_url', editImageFile);
      }

      const response = await fetch(`${API_BASE}/admin/open-trips/${editingTrip.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setShowEditModal(false);
        setEditingTrip(null);
        setEditForm({});
        setEditImageFile(null);
        fetchOpenTrips(); // Refresh the open trips list
        toast({
          title: "Success",
          description: "Open trip updated successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to update open trip");
      }
    } catch (error: any) {
      console.error("Error updating open trip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update open trip",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOpenTrip = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this open trip? This action cannot be undone.")) return;

    try {
      const response = await fetch(`${API_BASE}/admin/open-trips/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        fetchOpenTrips(); // Refresh the open trips list
        toast({
          title: "Success",
          description: "Open trip deleted successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to delete open trip");
      }
    } catch (error: any) {
      console.error("Error deleting open trip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete open trip",
        variant: "destructive",
      });
    }
  };

  const handleIncludesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludesInput(e.target.value);
  };

  const handleAddInclude = () => {
    if (includesInput.trim() !== "") {
      setCreateForm({
        ...createForm,
        includes: [...createForm.includes, includesInput.trim()]
      });
      setIncludesInput("");
    }
  };

  const handleRemoveInclude = (index: number) => {
    const updatedIncludes = [...createForm.includes];
    updatedIncludes.splice(index, 1);
    setCreateForm({
      ...createForm,
      includes: updatedIncludes
    });
  };

  const handleHighlightsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighlightsInput(e.target.value);
  };

  const handleAddHighlight = () => {
    if (highlightsInput.trim() !== "") {
      setCreateForm({
        ...createForm,
        highlights: [...createForm.highlights, highlightsInput.trim()]
      });
      setHighlightsInput("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    const updatedHighlights = [...createForm.highlights];
    updatedHighlights.splice(index, 1);
    setCreateForm({
      ...createForm,
      highlights: updatedHighlights
    });
  };

  const handleEditIncludesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditIncludesInput(e.target.value);
  };

  const handleAddEditInclude = () => {
    if (editIncludesInput.trim() !== "") {
      setEditForm({
        ...editForm,
        includes: [...(editForm.includes || editingTrip?.includes || []), editIncludesInput.trim()]
      });
      setEditIncludesInput("");
    }
  };

  const handleRemoveEditInclude = (index: number) => {
    const updatedIncludes = [...(editForm.includes || editingTrip?.includes || [])];
    updatedIncludes.splice(index, 1);
    setEditForm({
      ...editForm,
      includes: updatedIncludes
    });
  };

  const handleEditHighlightsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditHighlightsInput(e.target.value);
  };

  const handleAddEditHighlight = () => {
    if (editHighlightsInput.trim() !== "") {
      setEditForm({
        ...editForm,
        highlights: [...(editForm.highlights || editingTrip?.highlights || []), editHighlightsInput.trim()]
      });
      setEditHighlightsInput("");
    }
  };

  const handleRemoveEditHighlight = (index: number) => {
    const updatedHighlights = [...(editForm.highlights || editingTrip?.highlights || [])];
    updatedHighlights.splice(index, 1);
    setEditForm({
      ...editForm,
      highlights: updatedHighlights
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
    }
  };

  const handleCloseTrip = async (id: number) => {
    if (!window.confirm("Are you sure you want to close this trip for bookings? This will prevent new bookings from being made.")) return;

    try {
      const response = await fetch(`${API_BASE}/admin/open-trips/${id}/close`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        fetchOpenTrips(); // Refresh the open trips list
        toast({
          title: "Success",
          description: "Trip closed successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to close trip");
      }
    } catch (error: any) {
      console.error("Error closing trip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to close trip",
        variant: "destructive",
      });
    }
  };

  const handleOpenTrip = async (id: number) => {
    if (!window.confirm("Are you sure you want to reopen this trip for bookings? This will allow new bookings to be made.")) return;

    try {
      const response = await fetch(`${API_BASE}/admin/open-trips/${id}/open`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        fetchOpenTrips(); // Refresh the open trips list
        toast({
          title: "Success",
          description: "Trip reopened successfully!",
        });
      } else {
        throw new Error(result.message || "Failed to open trip");
      }
    } catch (error: any) {
      console.error("Error opening trip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to open trip",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Manage Open Trips</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search open trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Open Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Open Trip</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={createForm.title}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mountain_id">Mountain</Label>
                      <select
                        id="mountain_id"
                        value={createForm.mountain_id || ""}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            mountain_id: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Select a mountain</option>
                        {mountains.map((mountain) => (
                          <option key={mountain.id} value={mountain.id}>
                            {mountain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={createForm.difficulty}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            difficulty: e.target.value,
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration_days">Duration (Days)</Label>
                      <Input
                        id="duration_days"
                        type="number"
                        min="1"
                        value={createForm.duration_days}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            duration_days: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="duration_nights">Duration (Nights)</Label>
                      <Input
                        id="duration_nights"
                        type="number"
                        min="0"
                        value={createForm.duration_nights}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            duration_nights: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="min_participants">Min Participants</Label>
                      <Input
                        id="min_participants"
                        type="number"
                        min="1"
                        value={createForm.min_participants}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            min_participants: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="base_price">Base Price (IDR)</Label>
                      <Input
                        id="base_price"
                        type="number"
                        min="0"
                        value={createForm.base_price}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            base_price: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="original_price">Original Price (IDR)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        min="0"
                        value={createForm.original_price}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            original_price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      min="1"
                      value={createForm.max_participants}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          max_participants: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                      <div className="p-2 bg-gray-100 rounded-md">
                        <Upload className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    {imageFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Includes</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={includesInput}
                        onChange={handleIncludesInput}
                        placeholder="Add an include (e.g., Food, Equipment)"
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddInclude} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {createForm.includes.map((include, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {include}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveInclude(index)}
                            className="ml-1 text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Highlights</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={highlightsInput}
                        onChange={handleHighlightsInput}
                        placeholder="Add a highlight (e.g., Sunrise, Camping)"
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddHighlight} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {createForm.highlights.map((highlight, index) => (
                        <Badge key={index} variant="default" className="flex items-center gap-1">
                          {highlight}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveHighlight(index)}
                            className="ml-1 text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Guide Selection</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {guides.map((guide) => (
                        <div key={guide.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`guide-${guide.id}`}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`guide-${guide.id}`}>
                            {guide.name} (Rating: {guide.rating})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Porter Selection</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {porters.map((porter) => (
                        <div key={porter.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`porter-${porter.id}`}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`porter-${porter.id}`}>
                            {porter.name} (Rating: {porter.rating})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateOpenTrip}>Create Open Trip</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading open trips...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Mountain</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpenTrips.length > 0 ? (
                  filteredOpenTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">
                        #{trip.id}
                      </TableCell>
                      <TableCell>{trip.title}</TableCell>
                      <TableCell>{trip.mountain_name}</TableCell>
                      <TableCell>{trip.duration_days}D{trip.duration_nights}N</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {trip.quota_remaining}/{trip.max_participants}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {trip.base_price.toLocaleString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          trip.difficulty === "Easy" ? "default" : 
                          trip.difficulty === "Medium" ? "secondary" : 
                          trip.difficulty === "Hard" ? "destructive" : 
                          "outline"
                        }>
                          {trip.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={trip.is_closed ? "destructive" : "default"}>
                          {trip.is_closed ? "Closed" : "Open"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(trip.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {trip.is_closed ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleOpenTrip(trip.id)}
                            >
                              Reopen
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCloseTrip(trip.id)}
                            >
                              Close Order
                            </Button>
                          )}
                          <TripBookings tripId={trip.id} tripTitle={trip.title}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Bookings
                            </Button>
                          </TripBookings>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTrip(trip);
                              setEditForm({
                                title: trip.title,
                                mountain_id: trip.mountain_id,
                                duration_days: trip.duration_days,
                                duration_nights: trip.duration_nights,
                                difficulty: trip.difficulty,
                                base_price: trip.base_price,
                                original_price: trip.original_price,
                                min_participants: trip.min_participants,
                                max_participants: trip.max_participants,
                                description: trip.description,
                                includes: trip.includes,
                                highlights: trip.highlights,
                              });
                              setEditIncludesInput("");
                              setEditHighlightsInput("");
                              setEditImageFile(null);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteOpenTrip(trip.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No open trips found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Open Trip Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Open Trip</DialogTitle>
          </DialogHeader>
          {editingTrip && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title || editingTrip.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-mountain_id">Mountain</Label>
                  <select
                    id="edit-mountain_id"
                    value={editForm.mountain_id || editingTrip.mountain_id}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        mountain_id: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select a mountain</option>
                    {mountains.map((mountain) => (
                      <option key={mountain.id} value={mountain.id}>
                        {mountain.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <select
                    id="edit-difficulty"
                    value={editForm.difficulty || editingTrip.difficulty}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-duration_days">Duration (Days)</Label>
                  <Input
                    id="edit-duration_days"
                    type="number"
                    min="1"
                    value={editForm.duration_days || editingTrip.duration_days}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        duration_days: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-duration_nights">Duration (Nights)</Label>
                  <Input
                    id="edit-duration_nights"
                    type="number"
                    min="0"
                    value={editForm.duration_nights || editingTrip.duration_nights}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        duration_nights: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-min_participants">Min Participants</Label>
                  <Input
                    id="edit-min_participants"
                    type="number"
                    min="1"
                    value={editForm.min_participants || editingTrip.min_participants}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        min_participants: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-base_price">Base Price (IDR)</Label>
                  <Input
                    id="edit-base_price"
                    type="number"
                    min="0"
                    value={editForm.base_price || editingTrip.base_price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        base_price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-original_price">Original Price (IDR)</Label>
                  <Input
                    id="edit-original_price"
                    type="number"
                    min="0"
                    value={editForm.original_price || editingTrip.original_price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        original_price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-max_participants">Max Participants</Label>
                <Input
                  id="edit-max_participants"
                  type="number"
                  min="1"
                  value={editForm.max_participants || editingTrip.max_participants}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      max_participants: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <textarea
                  id="edit-description"
                  value={editForm.description || editingTrip.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-image-upload">Update Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="flex-1"
                  />
                  <div className="p-2 bg-gray-100 rounded-md">
                    <Upload className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                {editImageFile ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {editImageFile.name}
                  </p>
                ) : editingTrip.image_url ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current: {editingTrip.image_url.split('/').pop()}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    No image uploaded
                  </p>
                )}
              </div>
              
              <div>
                <Label>Includes</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={editIncludesInput}
                    onChange={handleEditIncludesInput}
                    placeholder="Add an include (e.g., Food, Equipment)"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddEditInclude} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(editForm.includes || editingTrip.includes || []).map((include, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {include}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveEditInclude(index)}
                        className="ml-1 text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Highlights</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={editHighlightsInput}
                    onChange={handleEditHighlightsInput}
                    placeholder="Add a highlight (e.g., Sunrise, Camping)"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddEditHighlight} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(editForm.highlights || editingTrip.highlights || []).map((highlight, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {highlight}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveEditHighlight(index)}
                        className="ml-1 text-destructive hover:text-destructive/80"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateOpenTrip}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}