import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MapPin, Users, DollarSign, Clock, User, Mail, Phone } from "lucide-react";

const BookingSuccessFixed = () => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract booking code from URL or state
  const bookingCode = location.state?.bookingCode ||
                     new URLSearchParams(location.search).get('booking_code') ||
                     new URLSearchParams(location.search).get('bookingCode');

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetails();
    }
  }, [bookingCode]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          // Find booking with matching code
          const matchedBooking = result.data.find((b: any) => b.booking_code === bookingCode);

          if (matchedBooking) {
            setBooking(matchedBooking);
          } else {
            setError('Booking tidak ditemukan');
          }
        } else {
          setError('Gagal mengambil data booking');
        }
      } else {
        setError('Gagal menghubungi server');
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Terjadi kesalahan saat mengambil data booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Memproses pembayaran Anda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Gagal Memuat Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/booking')}>Kembali ke Booking</Button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Booking tidak ditemukan</p>
          <Button onClick={() => navigate('/booking')} className="mt-4">Kembali ke Booking</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Pembayaran Berhasil!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Terima kasih telah melakukan booking dengan Carten'z. Berikut adalah detail booking Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Detail Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kode Booking</span>
                  <span className="font-medium">{booking.booking_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Pembayaran</span>
                  <Badge
                    variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}
                    className={booking.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}
                  >
                    {booking.payment_status || 'pending'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Booking</span>
                  <span className="font-medium">
                    {new Date(booking.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Trip Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Informasi Trip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.open_trip_title || 'Trip Title'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah Peserta</span>
                  <span className="font-medium">{booking.total_participants} orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Harga</span>
                  <span className="font-medium text-lg">
                    Rp {Number(booking.total_price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-sm text-muted-foreground">Nama</div>
                    <div className="font-medium">{booking.customer_name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{booking.customer_email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-sm text-muted-foreground">Telepon</div>
                    <div className="font-medium">{booking.customer_phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-sm text-muted-foreground">Kontak Darurat</div>
                    <div className="font-medium">{booking.emergency_contact}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Ringkasan Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">Rp {Number(booking.total_price || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}
                    className={booking.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}
                  >
                    {booking.payment_status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Silakan simpan kode booking Anda untuk referensi. Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              Cetak Bukti Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessFixed;