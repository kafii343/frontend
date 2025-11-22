import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MapPin, DollarSign, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: number;
  booking_code: string;
  user_id: number;
  open_trip_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  emergency_contact: string;
  total_participants: number;
  payment_status: string;
  booking_status: string;
  created_at: string;
}

const API_BASE = "http://localhost:5000/api";

interface TripBookingsProps {
  tripId: number;
  tripTitle: string;
  children?: React.ReactNode;
}

const TripBookings: React.FC<TripBookingsProps> = ({ tripId, tripTitle, children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    if (!open) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/open-trips/${tripId}/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
      } else {
        console.error("Failed to fetch trip bookings:", result.message);
        toast({
          title: "Error",
          description: "Failed to fetch trip bookings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching trip bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trip bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBookings();
    }
  }, [open, tripId]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View Bookings
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bookings for: {tripTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found for this trip
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking Code</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.booking_code}
                      </TableCell>
                      <TableCell>
                        {booking.customer_name}
                      </TableCell>
                      <TableCell>
                        {booking.customer_email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {booking.total_participants}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.payment_status === "paid" ? "default" : 
                          booking.payment_status === "pending" ? "secondary" : 
                          "destructive"
                        }>
                          {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.booking_status === "confirmed" ? "default" : 
                          booking.booking_status === "pending" ? "secondary" : 
                          booking.booking_status === "cancelled" ? "destructive" : 
                          "outline"
                        }>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(booking.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripBookings;