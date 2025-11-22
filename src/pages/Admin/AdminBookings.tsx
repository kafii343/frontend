import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Plus, Edit2, Trash2, MapPin, Users, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define interfaces for booking and open trip data
interface OpenTrip {
  id: number;
  title: string;
  mountain_name: string;
  base_price: number;
  duration_days: number;
  duration_nights: number;
  difficulty: string;
  min_participants: number;
  max_participants: number;
}

interface Booking {
  id: string; // UUID string
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  open_trip_id: number;
  open_trip?: OpenTrip; // Optional since it might be populated from JOIN
  trip_title: string; // For backward compatibility
  status: "paid" | "confirmed" | "pending" | "cancelled";
  payment_status: "paid" | "confirmed" | "pending" | "cancelled";
  total_price: number;
  booking_date: string;
  participants_count: number;
  trip_date: string;
  special_requests?: string;
  start_date?: string;
  created_at?: string;
  mountain?: string;
  mountain_name?: string;
  total_participants?: number;
  duration_days?: number;
  duration_nights?: number;
}

interface CreateBookingRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  open_trip_id: number;
  status: "paid" | "confirmed" | "pending" | "cancelled";
  total_price: number;
  participants_count: number;
  trip_date: string;
  special_requests?: string;
}

interface UpdateBookingRequest {
  status?: "paid" | "confirmed" | "pending" | "cancelled";
  total_price?: number;
  participants_count?: number;
  special_requests?: string;
}

const AdminBookings = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [openTrips, setOpenTrips] = useState<OpenTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOpenTrips, setLoadingOpenTrips] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [addForm, setAddForm] = useState<CreateBookingRequest>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    open_trip_id: 0,
    status: "pending",
    total_price: 0,
    participants_count: 1,
    trip_date: "",
    special_requests: "",
  });
  const [editForm, setEditForm] = useState<Partial<UpdateBookingRequest>>({});
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    fetchBookings();
    fetchOpenTrips();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Sending token for bookings:', token ? 'Token present' : 'No token');

      // For admin endpoints, use port 5000 (admin service) instead of 5001 (payment service)
      const API_BASE_URL = "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        // Check if response is HTML or JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch bookings');
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
        setBookings(data.data);
        setFilteredBookings(data.data);
      } else {
        setError(data.message || 'Failed to load bookings');
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever bookings or filters change
  useEffect(() => {
    let result = [...bookings];

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter(booking => booking.status === filters.status);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(booking => new Date(booking.booking_date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the full day
      result = result.filter(booking => new Date(booking.booking_date) <= toDate);
    }

    setFilteredBookings(result);
  }, [bookings, filters]);

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const fetchOpenTrips = async () => {
    try {
      setLoadingOpenTrips(true);

      const token = localStorage.getItem('token');
      console.log('Sending token for open trips:', token ? 'Token present' : 'No token');

      // For consistency, use the same base URL as bookings
      const API_BASE_URL = "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/open-trips`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Open trips response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error (open trips):', errorData);
        throw new Error(errorData.message || 'Failed to fetch open trips');
      }

      const data = await response.json();

      if (data.success) {
        setOpenTrips(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching open trips:', err);
      toast({
        title: "Error",
        description: "Failed to load open trips. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingOpenTrips(false);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log('Sending token for add booking:', token ? 'Token present' : 'No token');
      console.log('Adding booking with data:', addForm);

      // Base URL from environment variable
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });

      console.log('Add booking response status:', response.status);

      if (!response.ok) {
        // Check if response is HTML or JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to create booking');
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
        setShowAddModal(false);
        setAddForm({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          open_trip_id: 0,
          status: "pending",
          total_price: 0,
          participants_count: 1,
          trip_date: "",
          special_requests: "",
        });
        fetchBookings(); // Refresh the bookings list
        toast({
          title: "Success",
          description: "Booking created successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to create booking');
      }
    } catch (err: any) {
      console.error('Error adding booking:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      status: booking.status,
      total_price: booking.total_price,
      participants_count: booking.participants_count,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBooking) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Sending token for edit booking:', token ? 'Token present' : 'No token');
      console.log('Editing booking with ID:', editingBooking.id, 'and data:', editForm);

      // Use the correct endpoint for updating booking status (admin endpoint)
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      // For the update-status endpoint, we can update status and total_price
      if (editForm.status || editForm.total_price !== undefined) {
        const updateData: any = {
          booking_id: editingBooking.id,
        };

        if (editForm.status) {
          updateData.status = editForm.status;
        }

        if (editForm.total_price !== undefined) {
          updateData.total_price = editForm.total_price;
        }

        const response = await fetch(`${API_BASE_URL}/api/bookings/update-status`, {
          method: 'POST', // Use POST method as per backend API
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        console.log('Edit booking response status:', response.status);

        if (!response.ok) {
          // Check if response is HTML or JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'Failed to update booking');
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
          setShowEditModal(false);
          setEditingBooking(null);
          setEditForm({});
          fetchBookings(); // Refresh the bookings list
          toast({
            title: "Success",
            description: "Booking status updated successfully!",
          });
        } else {
          throw new Error(result.message || 'Failed to update booking');
        }
      } else {
        // If only non-status fields are being updated, show an error
        throw new Error("Only status updates are supported via this endpoint");
      }
    } catch (err: any) {
      console.error('Error updating booking:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update booking. Only status can be updated currently.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus booking ini? Data yang dihapus tidak bisa dikembalikan.")) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Sending token for delete booking:', token ? 'Token present' : 'No token');
      console.log('Deleting booking with ID:', id);

      // Use admin server for deletion
      const API_BASE_URL = "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Delete booking response status:', response.status);

      if (!response.ok) {
        // Check if response is HTML or JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to delete booking');
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
        fetchBookings(); // Refresh the bookings list
        toast({
          title: "Success",
          description: "Booking deleted successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to delete booking');
      }
    } catch (err: any) {
      console.error('Error deleting booking:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Booking Management</h1>
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
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          {filters.status !== "all" || filters.dateFrom || filters.dateTo ? (
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="mr-2">
                {filters.status !== "all" ? `Status: ${filters.status}` : null}
              </Badge>
              {filters.dateFrom && (
                <Badge variant="secondary" className="mr-2">
                  From: {new Date(filters.dateFrom).toLocaleDateString()}
                </Badge>
              )}
              {filters.dateTo && (
                <Badge variant="secondary">
                  To: {new Date(filters.dateTo).toLocaleDateString()}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-2 text-xs">
                Clear Filters
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-3 space-y-4">
                <div>
                  <Label htmlFor="filter-status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-from">Date From</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date-to">Date To</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Booking Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Nama Customer</Label>
                    <Input
                      id="customer_name"
                      value={addForm.customer_name}
                      onChange={(e) => setAddForm({...addForm, customer_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email Customer</Label>
                    <Input
                      id="customer_email"
                      value={addForm.customer_email}
                      onChange={(e) => setAddForm({...addForm, customer_email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">No. Telp</Label>
                    <Input
                      id="customer_phone"
                      value={addForm.customer_phone}
                      onChange={(e) => setAddForm({...addForm, customer_phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="open_trip_id">Open Trip</Label>
                    {loadingOpenTrips ? (
                      <div className="h-10 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Loading trips...</span>
                      </div>
                    ) : (
                      <Select value={addForm.open_trip_id.toString()} onValueChange={(value) => setAddForm({...addForm, open_trip_id: Number(value)})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Open Trip" />
                        </SelectTrigger>
                        <SelectContent>
                          {openTrips.map((trip) => (
                            <SelectItem key={trip.id} value={trip.id.toString()}>
                              {trip.title} - {trip.mountain_name} (Rp {trip.base_price.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="total_price">Total Harga</Label>
                    <Input
                      id="total_price"
                      type="number"
                      value={addForm.total_price || ''}
                      onChange={(e) => setAddForm({...addForm, total_price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="participants_count">Jumlah Peserta</Label>
                    <Input
                      id="participants_count"
                      type="number"
                      value={addForm.participants_count}
                      onChange={(e) => setAddForm({...addForm, participants_count: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="trip_date">Tanggal Trip</Label>
                    <Input
                      id="trip_date"
                      type="date"
                      value={addForm.trip_date}
                      onChange={(e) => setAddForm({...addForm, trip_date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={addForm.status} onValueChange={(value: "paid" | "confirmed" | "pending" | "cancelled") => setAddForm({...addForm, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="special_requests">Permintaan Khusus</Label>
                    <Input
                      id="special_requests"
                      value={addForm.special_requests || ''}
                      onChange={(e) => setAddForm({...addForm, special_requests: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Tambah Booking</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            // Get the open trip details if available
            const tripDetails = booking.open_trip || openTrips.find(t => t.id === booking.open_trip_id);

            return (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <CardTitle>{booking.customer_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        booking.payment_status === "paid" ? "default" :
                        booking.payment_status === "confirmed" ? "secondary" :
                        booking.payment_status === "pending" ? "outline" :
                        "destructive"
                      }>
                        {booking.payment_status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBooking(booking)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{booking.customer_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">No. Telp</p>
                      <p className="font-medium">{booking.customer_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> Trip
                      </p>
                      <p className="font-medium">{tripDetails ? tripDetails.title : booking.trip_title || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mountain</p>
                      <p className="font-medium">{tripDetails ? tripDetails.mountain_name : booking.mountain_name || booking.mountain || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">Rp {(booking.total_price || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Tanggal Booking
                      </p>
                      <p className="font-medium">
                        {booking.booking_date
                          ? new Date(booking.booking_date).toLocaleDateString()
                          : booking.created_at
                            ? new Date(booking.created_at).toLocaleDateString()
                            : 'Invalid Date'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Trip</p>
                      <p className="font-medium">
                        {booking.trip_date
                          ? new Date(booking.trip_date).toLocaleDateString()
                          : booking.start_date
                            ? new Date(booking.start_date).toLocaleDateString()
                            : 'Invalid Date'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" /> Jumlah Peserta
                      </p>
                      <p className="font-medium">
                        {booking.participants_count !== undefined ? booking.participants_count : booking.total_participants || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Durasi</p>
                      <p className="font-medium">
                        {tripDetails
                          ? `${tripDetails.duration_days}D ${tripDetails.duration_nights}N`
                          : booking.duration_days !== undefined && booking.duration_nights !== undefined
                            ? `${booking.duration_days}D ${booking.duration_nights}N`
                            : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{booking.payment_status}</p>
                    </div>
                    {booking.special_requests && (
                      <div className="lg:col-span-2">
                        <p className="text-sm text-muted-foreground">Permintaan Khusus</p>
                        <p className="font-medium">{booking.special_requests}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {bookings.length === 0
                  ? "Tidak ada booking ditemukan"
                  : "Tidak ada booking yang sesuai dengan filter"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Booking Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status || editingBooking.status}
                    onValueChange={(value: "paid" | "confirmed" | "pending" | "cancelled") => setEditForm({...editForm, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-total-price">Total Harga</Label>
                  <Input
                    id="edit-total-price"
                    type="number"
                    value={editForm.total_price !== undefined ? editForm.total_price : editingBooking.total_price}
                    onChange={(e) => setEditForm({...editForm, total_price: Number(e.target.value)})}
                  />
                </div>
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

export default AdminBookings;