import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, MapPin, Mountain, Loader2, TrendingUp, Calendar, UserCheck } from "lucide-react";

// Define interfaces for the data structures
interface StatsData {
  confirmed_bookings: number;
  paid_bookings: number;
  total_revenue: number;
  available_guides: number;
  available_porters: number;
  active_trips: number;
}

interface RecentBooking {
  id: number;
  customer_name: string;
  trip_title: string;
  status: string;
}

interface RecentUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats data
      const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats data');
      }
      
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch recent bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!bookingsResponse.ok) {
        throw new Error('Failed to fetch bookings data');
      }
      
      const bookingsData = await bookingsResponse.json();
      if (bookingsData.success) {
        // Get only the 3 most recent bookings
        const recent = bookingsData.data.slice(0, 3);
        setRecentBookings(recent);
      }

      // Fetch recent users
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users data');
      }
      
      const usersData = await usersResponse.json();
      if (usersData.success) {
        // Get only the 3 most recent users
        const recent = usersData.data.users.slice(0, 3);
        setRecentUsers(recent);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          <Card className="shadow-lg border-0 bg-red-50">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-forest-light transition-colors"
              >
                Coba Lagi
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Kelola dan pantau aktivitas platform Carten'z</p>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Booking Konfirmasi</CardTitle>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.confirmed_bookings}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+2 dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Booking Lunas</CardTitle>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.paid_bookings}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+5 dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <p className="text-2xl font-bold mt-1 text-gray-800">Rp {Number(stats.total_revenue).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+10% dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Guide Tersedia</CardTitle>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.available_guides}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+1 dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Porter Tersedia</CardTitle>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.available_porters}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <UserCheck className="h-6 w-6 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <span>0 dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Open Trip Aktif</CardTitle>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.active_trips}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Mountain className="h-6 w-6 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+2 dari bulan lalu</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Recent Bookings */}
          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-semibold text-gray-800">Booking Terbaru</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800">{booking.customer_name}</p>
                        <p className="text-sm text-gray-600 mt-1">{booking.trip_title}</p>
                      </div>
                      <Badge variant={booking.status === 'paid' ? 'default' : 
                                    booking.status === 'confirmed' ? 'secondary' : 
                                    booking.status === 'pending' ? 'outline' : 'destructive'}
                            className={`text-xs px-3 py-1 font-medium ${
                              booking.status === 'paid' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">Tidak ada booking terbaru</p>
                )}
              </div>
              <button className="w-full mt-4 py-2 text-center text-primary font-medium hover:text-forest-light transition-colors">
                Lihat Semua Booking
              </button>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg font-semibold text-gray-800">User Terbaru</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800">{user.full_name}</p>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={`text-xs px-3 py-1 font-medium ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                        {user.role}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">Tidak ada user terbaru</p>
                )}
              </div>
              <button className="w-full mt-4 py-2 text-center text-primary font-medium hover:text-forest-light transition-colors">
                Lihat Semua User
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;