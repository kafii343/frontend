import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin, Users, DollarSign, User, Mail, Phone } from "lucide-react";

const BookingPending = () => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if booking details are passed in state from the booking page
    if (location.state?.bookingDetails) {
      // If we have booking details in state, use those directly
      setBooking(location.state.bookingDetails);
      setLoading(false);
    } else {
      // If no booking details in state, show an error
      setError('Data booking tidak ditemukan. Silakan kembali ke halaman booking.');
      setLoading(false);
    }
  }, []);

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
          <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-2xl">⚠️</span>
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
          <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Pembayaran Pending!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pembayaran Anda sedang diproses. Status akan diperbarui setelah pembayaran diverifikasi.
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
                  <span className="font-medium">{booking.referenceNumber || booking.bookingId || 'Tidak Tersedia'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Pembayaran</span>
                  <Badge 
                    variant="secondary"
                    className="bg-yellow-500"
                  >
                    Pending
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal Booking</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('id-ID', {
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
                  <span>{booking.tripName || 'Trip Title'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="font-medium">{booking.date || 'Belum Ditentukan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah Peserta</span>
                  <span className="font-medium">{booking.participants || 0} orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Harga</span>
                  <span className="font-medium text-lg">
                    Rp {Number(booking.totalPrice || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kontak yang Bisa Dihubungi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add our contact information */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">Customer Service</div>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">Nama</div>
                      <div className="font-medium">CS Carten'z</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">Kontak</div>
                      <div className="font-medium">083113575577</div>
                    </div>
                  </div>
                </div>
                
                {booking.guideName && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Guide</div>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">Nama</div>
                        <div className="font-medium">{booking.guideName}</div>
                      </div>
                    </div>
                    {booking.guideContact && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="text-sm text-muted-foreground">Kontak</div>
                          <div className="font-medium">{booking.guideContact}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {booking.porterName && (
                  <div className="space-y-3 mt-4">
                    <div className="text-sm font-medium text-muted-foreground">Porter</div>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">Nama</div>
                        <div className="font-medium">{booking.porterName}</div>
                      </div>
                    </div>
                    {booking.porterContact && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="text-sm text-muted-foreground">Kontak</div>
                          <div className="font-medium">{booking.porterContact}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                  <span className="font-medium">Rp {Number(booking.totalPrice || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant="secondary"
                    className="bg-yellow-500"
                  >
                    Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Status pembayaran akan diperbarui setelah pembayaran Anda selesai diproses.
            Simpan kode booking Anda: <strong className="text-primary">{booking.referenceNumber || booking.bookingId || 'Tidak Tersedia'}</strong> untuk referensi.
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

export default BookingPending;