import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Phone,
  Mail,
  User,
  MessageSquare,
  Loader2,
  Package
} from "lucide-react";

const Booking = () => {
  const { toast } = useToast();
  const { token } = useAuth(); // Get the authentication token
  const [searchParams] = useSearchParams();
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedPorter, setSelectedPorter] = useState(null);
  const [availablePorters, setAvailablePorters] = useState([]);
  const [selectedAdditionalPorter, setSelectedAdditionalPorter] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Midtrans script is already loaded to prevent duplicate loading
    const existingScript = document.querySelector('script[src*="midtrans"]');
    if (existingScript) return;

    const snapScript = document.createElement('script');
    snapScript.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    snapScript.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-hhXUY39s5fDRler6');
    snapScript.async = true;
    snapScript.crossOrigin = 'anonymous'; // Add CORS handling
    snapScript.onload = () => {
      console.log('Midtrans Snap script loaded successfully');
    };
    snapScript.onerror = () => {
      console.error('Failed to load Midtrans Snap script');
    };
    document.body.appendChild(snapScript);

    return () => {
      document.body.removeChild(snapScript);
    };
  }, []);

  // Effect to fetch porters data
  useEffect(() => {
    // Fetch all available porters
    api.get("/porters")
      .then(response => {
        if (response.data.success) {
          setAvailablePorters(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching porters:', error);
      });

    // Effect to fetch selected guide/porter data
    const guideId = searchParams.get('guideId');
    const porterId = searchParams.get('porterId');
    const tripId = searchParams.get('trip'); // Get trip ID from URL parameter

    if (guideId) {
      // Fetch specific guide by ID
      api.get("/guides")
        .then(response => {
          if (response.data.success) {
            const guide = response.data.data.find(g => g.id === guideId);
            if (guide) {
              setSelectedGuide(guide);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching guide:', error);
        });
    }

    if (porterId) {
      // Fetch specific porter by ID
      api.get("/porters")
        .then(response => {
          if (response.data.success) {
            const porter = response.data.data.find(p => p.id === porterId);
            if (porter) {
              setSelectedPorter(porter);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching porter:', error);
        });
    }

    if (tripId) {
      // Fetch specific open trip by ID
      api.get("/open-trips")
        .then(response => {
          if (response.data.success) {
            const trip = response.data.data.find(t => t.id === tripId);
            if (trip) {
              // If needed, we could store the trip details in state
              // For now, we just need the trip ID for booking
            }
          }
        })
        .catch(error => {
          console.error('Error fetching open trip:', error);
        });
    }
  }, [searchParams]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    emergencyContact: "",
    address: "",
    serviceType: "",
    destination: "",
    startDate: "",
    duration: "",
    participants: 2,
    dietary: "",
    medical: "",
    specialRequests: "",
    documentation: false,
    equipment: false,
    transport: false
  });



  // Calculate duration in days if dates are selected
  const calculateDuration = () => {
    if (!formData.startDate || !formData.duration) return 1; // Default to 1 day if not specified

    // For simple calculation based on duration string (e.g., "3d2n" = 3 days, "2d1n" = 2 days)
    const matches = formData.duration.match(/(\d+)d/);
    if (matches) {
      return parseInt(matches[1]) || 1;
    }

    // If duration field is a number of days directly
    const numericDuration = parseInt(formData.duration);
    if (!isNaN(numericDuration) && numericDuration > 0) {
      return numericDuration;
    }

    return 1;
  };

  // Calculate additional porter cost if selected
  const additionalPorterCost = selectedAdditionalPorter
    ? selectedAdditionalPorter.price_per_day * calculateDuration() * formData.participants
    : 0;

  const bookingSummary = {
    service: selectedGuide
      ? `Guide: ${selectedGuide.name}`
      : selectedPorter
        ? `Porter: ${selectedPorter.name}`
        : "Layanan Pilihan",
    guide: selectedGuide,
    porter: selectedPorter,
    dates: formData.startDate ? new Date(formData.startDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : "Belum dipilih",
    participants: formData.participants,
    basePrice: selectedGuide
      ? selectedGuide.price_per_day || 0
      : selectedPorter
        ? selectedPorter.price_per_day || 0
        : 0,
    additionalServices: [
      ...(selectedAdditionalPorter ? [{
        name: `Porter Tambahan: ${selectedAdditionalPorter.name}`,
        price: additionalPorterCost
      }] : []),
      ...(formData.documentation ? [{ name: "Dokumentasi Foto", price: 150000 }] : []),
      ...(formData.equipment ? [{ name: "Sewa Peralatan", price: 75000 }] : [])
    ],
    insurance: 25000,
    adminFee: 15000
  };

  const totalAdditional = bookingSummary.additionalServices.reduce((sum, service) => sum + service.price, 0);
  const subtotal = (bookingSummary.basePrice * bookingSummary.participants) + totalAdditional;
  const totalPrice = subtotal + (bookingSummary.insurance * bookingSummary.participants) + bookingSummary.adminFee;

  // Validate form
  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.emergencyContact) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi (*)",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.serviceType || !formData.destination || !formData.startDate || !formData.duration) {
      toast({
        title: "Detail Perjalanan Tidak Lengkap",
        description: "Mohon lengkapi detail perjalanan Anda",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email) {
      toast({
        title: "Email Diperlukan",
        description: "Mohon masukkan email untuk pembayaran",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Handle Midtrans payment
const handlePayment = async () => {
  if (!validateForm()) return;

  try {
    setIsProcessing(true);

    // Generate a booking code that's not UUID but follows ORDER-XXXX format
    const orderId = `ORDER-${Date.now()}`;

    const itemDetails = [
      {
        id: 'tour-package',
        name: bookingSummary.service,
        quantity: bookingSummary.participants,
        price: bookingSummary.basePrice,
        category: 'Tour Package'
      },
      ...bookingSummary.additionalServices.map((service, index) => ({
        id: `add-service-${index}`,
        name: service.name,
        quantity: 1,
        price: service.price,
        category: 'Additional Service'
      })),
      {
        id: 'insurance',
        name: 'Asuransi Perjalanan',
        quantity: bookingSummary.participants,
        price: bookingSummary.insurance,
        category: 'Insurance'
      },
      {
        id: 'admin-fee',
        name: 'Biaya Admin',
        quantity: 1,
        price: bookingSummary.adminFee,
        category: 'Admin Fee'
      }
    ];

    // Base URL backend - Updated to use the correct API URL from environment
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Get trip ID from URL parameter to include in booking
    const tripId = searchParams.get('trip');

    // First, create the booking in the database
    const bookingData = {
      booking_id: orderId, // Use the ORDER-XXXX format instead of UUID
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_emergency_contact: formData.emergencyContact, // Backend expects this exact name
      service_type: formData.serviceType || 'open-trip', // Provide a default value if not set
      start_date: formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : null, // Format to YYYY-MM-DD
      total_participants: formData.participants,
      total_price: totalPrice,
      special_requests: formData.specialRequests,
      dietary_requirements: formData.dietary,
      medical_conditions: formData.medical,
      need_porter: selectedAdditionalPorter ? true : false,
      need_documentation: formData.documentation,
      need_equipment: formData.equipment,
      need_transport: formData.transport,
      base_price: bookingSummary.basePrice,
      additional_services_price: totalAdditional,
      insurance_price: bookingSummary.insurance * bookingSummary.participants,
      admin_fee: bookingSummary.adminFee,
      open_trip_id: tripId || null // Include the trip ID if available
    };

    console.log('Creating booking with data:', bookingData);

    // Create booking record
    const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    if (!bookingResponse.ok) {
      const bookingError = await bookingResponse.text(); // Get error text
      console.error('Booking creation error:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError}`);
    }

    const bookingResult = await bookingResponse.json();
    console.log('Booking creation response:', bookingResult);

    // Use the actual booking code or id from the response
    const actualBookingId = bookingResult.data?.booking_code || bookingResult.data?.id || orderId;
    console.log('Using booking ID for transaction:', actualBookingId);

    console.log('Requesting payment transaction with data:', {
      booking_id: actualBookingId,
      amount: totalPrice,
      customer_email: formData.email,
      customer_name: formData.fullName,
      item_details: itemDetails
    });

    // Then request token from Midtrans
    const response = await fetch(`${API_BASE_URL}/api/payment/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        booking_id: actualBookingId, // Use the actual booking ID returned from backend
        amount: totalPrice,
        customer_email: formData.email,
        customer_name: formData.fullName,
        item_details: itemDetails
      })
    });

    // Check if the response is ok before parsing JSON to avoid the 'Unexpected token' error
    if (!response.ok) {
      const errorText = await response.text(); // Get raw text response
      console.error('Response error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}. ${errorText || 'Gagal membuat transaksi pembayaran.'}`);
    }

    const data = await response.json();

    console.log('Midtrans API response:', data);

    if (!data.success || !data.token) {
      // Handle error case properly, checking for both error and message properties
      const errorMessage = data.message || data.error || 'Token pembayaran tidak valid atau gagal membuat transaksi.';
      throw new Error(errorMessage);
    }

    // If token is successfully received
    if (data.token) {
      toast({
        title: "Mengarahkan ke Pembayaran",
        description: "Anda akan dialihkan ke halaman pembayaran...",
      });

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function(result) {
            console.log('✅ Payment Success:', result);
            // Update status to 'paid' using the actual booking ID
            fetch(`${API_BASE_URL}/api/payment/update-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: actualBookingId, // Use the actual booking ID
                status: 'paid',
                payment_data: result
              })
            })
            .then(response => response.json())
            .then(updateResult => {
              if (updateResult.success) {
                toast({
                  title: "Pembayaran Berhasil",
                  description: "Terima kasih! Pembayaran telah diproses.",
                });

                // Prepare booking details for success page
                const bookingDetails = {
                  tripName: bookingSummary.service,
                  date: bookingSummary.dates,
                  participants: bookingSummary.participants,
                  totalPrice: totalPrice,
                  referenceNumber: actualBookingId, // Use actual booking ID
                  guideName: selectedGuide?.name,
                  guideContact: selectedGuide?.contact || selectedGuide?.phone,
                  porterName: selectedPorter?.name,
                  porterContact: selectedPorter?.contact || selectedPorter?.phone,
                  bookingId: actualBookingId // Use actual booking ID
                };

                // Navigate to success page with booking details
                navigate('/booking-success', { state: { bookingDetails } });
              } else {
                console.error('Failed to update booking status:', updateResult);
              }
            })
            .catch(err => {
              console.error('Error updating booking:', err);
              toast({
                title: "Terjadi Kesalahan",
                description: "Pembayaran berhasil tetapi gagal memperbarui status pemesanan.",
                variant: "destructive",
              });

              // Navigate anyway with booking details
              const bookingDetails = {
                tripName: bookingSummary.service,
                date: bookingSummary.dates,
                participants: bookingSummary.participants,
                totalPrice: totalPrice,
                referenceNumber: actualBookingId, // Use actual booking ID
                guideName: selectedGuide?.name,
                guideContact: selectedGuide?.contact || selectedGuide?.phone,
                porterName: selectedPorter?.name,
                porterContact: selectedPorter?.contact || selectedPorter?.phone,
                bookingId: actualBookingId // Use actual booking ID
              };

              navigate('/booking-success', { state: { bookingDetails } });
            });
          },

          onPending: function(result) {
            console.log('⏳ Payment Pending:', result);
            fetch(`${API_BASE_URL}/api/payment/update-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: actualBookingId, // Use actual booking ID
                status: 'pending',
                payment_data: result
              })
            })
            .then(response => response.json())
            .then(updateResult => {
              console.log('Payment pending, status updated:', updateResult);
            })
            .catch(err => console.error('Error updating pending status:', err))
            .finally(() => {
              // Prepare booking details for pending page
              const bookingDetails = {
                tripName: bookingSummary.service,
                date: bookingSummary.dates,
                participants: bookingSummary.participants,
                totalPrice: totalPrice,
                referenceNumber: actualBookingId, // Use actual booking ID
                guideName: selectedGuide?.name,
                guideContact: selectedGuide?.contact || selectedGuide?.phone,
                porterName: selectedPorter?.name,
                porterContact: selectedPorter?.contact || selectedPorter?.phone,
                bookingId: actualBookingId // Use actual booking ID
              };

              navigate('/booking-pending', { state: { bookingDetails } });
            });
          },

          onError: function(result) {
            console.log('❌ Payment Error:', result);
            // Update status to 'failed'
            fetch(`${API_BASE_URL}/api/payment/update-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: actualBookingId, // Use actual booking ID
                status: 'failed',
                payment_data: result
              })
            })
            .then(response => response.json())
            .then(updateResult => {
              console.log('Payment failed, status updated:', updateResult);
            })
            .catch(err => console.error('Error updating failed status:', err));

            toast({
              title: "Pembayaran Gagal",
              description: result.status_message || "Terjadi kesalahan dalam pembayaran. Silakan coba lagi.",
              variant: "destructive",
            });
          },

          onClose: function() {
            console.log(' doorway Popup Closed by User');
            toast({
              title: "Pembayaran Dibatalkan",
              description: "Pembayaran dibatalkan oleh pengguna.",
              variant: "destructive",
            });
          }
        });
      } else {
        console.error('Midtrans Snap is not loaded');
        toast({
          title: "Gagal Memuat Pembayaran",
          description: "Layanan pembayaran gagal dimuat. Silakan refresh halaman dan coba lagi.",
          variant: "destructive",
        });
      }
    } else {
      console.error('Midtrans token not found or invalid.');
      toast({
        title: "Token Pembayaran Tidak Valid",
        description: data.message || "Tidak dapat memulai pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
    }

  } catch (error) {
    console.error('Payment error:', error);
    toast({
      title: "Terjadi Kesalahan",
      description: error instanceof Error ? error.message : "Gagal memproses pembayaran. Silakan coba lagi.",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <main className="py-12 bg-gradient-to-b from-background to-card min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16 px-4">
            <div className="inline-block px-4 py-2 mb-6 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <span className="text-primary font-medium">Booking Sekarang</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Lengkapi Data
              <span className="text-primary"> Pemesanan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
              Isi formulir di bawah untuk melanjutkan pemesanan petualangan Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-10">
              <Card className="shadow-lg border-0 bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-primary/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-forest-light rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Informasi Pribadi</h3>
                      <CardDescription className="text-gray-600">
                        Data diri untuk pemesanan dan komunikasi
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        placeholder="Masukkan nama lengkap"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Nomor WhatsApp *</Label>
                      <Input
                        id="phone"
                        placeholder="08xx xxxx xxxx"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                      <p className="text-xs text-gray-500">Email diperlukan untuk invoice</p>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="emergencyContact" className="text-gray-700 font-medium">Kontak Darurat *</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="08xx xxxx xxxx"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="address" className="text-gray-700 font-medium">Alamat Lengkap</Label>
                    <Textarea
                      id="address"
                      placeholder="Masukkan alamat lengkap"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-primary/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-blue to-mountain-peak rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Detail Perjalanan</h3>
                      <CardDescription className="text-gray-600">
                        Pilih layanan dan preferensi perjalanan
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="serviceType" className="text-gray-700 font-medium">Jenis Layanan *</Label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                        <SelectTrigger className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                          <SelectValue placeholder="Pilih jenis layanan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open-trip">Open Trip</SelectItem>
                          <SelectItem value="private-trip">Private Trip</SelectItem>
                          <SelectItem value="guide-only">Guide Saja</SelectItem>
                          <SelectItem value="porter-only">Porter Saja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="destination" className="text-gray-700 font-medium">Destinasi *</Label>
                      <Select value={formData.destination} onValueChange={(value) => handleInputChange('destination', value)}>
                        <SelectTrigger className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                          <SelectValue placeholder="Pilih gunung" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bawakaraeng">Gunung Bawakaraeng</SelectItem>
                          <SelectItem value="lompobattang">Gunung Lompobattang</SelectItem>
                          <SelectItem value="sinjai">Gunung Sinjai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-gray-700 font-medium">Tanggal Mulai *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="duration" className="text-gray-700 font-medium">Durasi</Label>
                      <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                        <SelectTrigger className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                          <SelectValue placeholder="Pilih durasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1d">1 Hari</SelectItem>
                          <SelectItem value="2d1n">2D1N</SelectItem>
                          <SelectItem value="3d2n">3D2N</SelectItem>
                          <SelectItem value="4d3n">4D3N</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="participants" className="text-gray-700 font-medium">Jumlah Peserta *</Label>
                      <Input
                        id="participants"
                        type="number"
                        placeholder="2"
                        min="1"
                        value={formData.participants}
                        onChange={(e) => handleInputChange('participants', parseInt(e.target.value) || 1)}
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <Label className="text-gray-700 font-medium">Layanan Tambahan</Label>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="additionalPorter" className="text-sm">Porter Tambahan</Label>
                        <Select
                          value={selectedAdditionalPorter?.id || ""}
                          onValueChange={(value) => {
                            const porter = availablePorters.find(p => p.id === value);
                            setSelectedAdditionalPorter(porter || null);
                          }}
                        >
                          <SelectTrigger className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                            <SelectValue placeholder="Pilih porter tambahan..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePorters.map((porter) => (
                              <SelectItem key={porter.id} value={porter.id}>
                                {porter.name} (Rp {porter.price_per_day?.toLocaleString()}/hari)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedAdditionalPorter && (
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedAdditionalPorter.experience_years} tahun pengalaman,
                            kapasitas: {selectedAdditionalPorter.max_capacity_kg}kg
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <Checkbox
                          id="documentation"
                          checked={formData.documentation}
                          onCheckedChange={(checked) => handleInputChange('documentation', checked)}
                        />
                        <Label htmlFor="documentation" className="text-sm text-gray-700">Dokumentasi Foto (+Rp 150.000)</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <Checkbox
                          id="equipment"
                          checked={formData.equipment}
                          onCheckedChange={(checked) => handleInputChange('equipment', checked)}
                        />
                        <Label htmlFor="equipment" className="text-sm text-gray-700">Sewa Peralatan (+Rp 75.000/item)</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <Checkbox
                          id="transport"
                          checked={formData.transport}
                          onCheckedChange={(checked) => handleInputChange('transport', checked)}
                        />
                        <Label htmlFor="transport" className="text-sm text-gray-700">Transportasi Tambahan (Harga Menyesuaikan)</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-primary/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-light to-primary rounded-xl flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Permintaan Khusus</h3>
                      <CardDescription className="text-gray-600">
                        Informasi tambahan atau kebutuhan khusus
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="dietary" className="text-gray-700 font-medium">Dietary Requirements</Label>
                    <Input
                      id="dietary"
                      placeholder="Vegetarian, Halal, Alergi makanan, dll"
                      value={formData.dietary}
                      onChange={(e) => handleInputChange('dietary', e.target.value)}
                      className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="medical" className="text-gray-700 font-medium">Kondisi Medis</Label>
                    <Input
                      id="medical"
                      placeholder="Asma, diabetes, cedera, dll"
                      value={formData.medical}
                      onChange={(e) => handleInputChange('medical', e.target.value)}
                      className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="specialRequests" className="text-gray-700 font-medium">Permintaan Lainnya</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Permintaan khusus, preferensi guide, atau informasi lain yang perlu kami ketahui"
                      rows={4}
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </CardContent>
              </Card>


            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="shadow-xl border-0 bg-gradient-to-b from-white to-gray-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <CardHeader className="pb-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-forest-light rounded-2xl mx-auto flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Ringkasan Pemesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-7">
                    {/* Selected Guide/Porter Information */}
                    {(selectedGuide || selectedPorter) && (
                      <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary/5 to-forest-light/5 rounded-xl border border-primary/10">
                        <div className="relative flex-shrink-0">
                          {selectedGuide ? (
                            selectedGuide.photo_url ? (
                              <img
                                src={selectedGuide.photo_url}
                                alt={selectedGuide.name}
                                className="w-16 h-16 object-cover rounded-full border-2 border-primary"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-forest-light flex items-center justify-center text-white font-bold text-lg">
                                {selectedGuide.name.charAt(0)}
                              </div>
                            )
                          ) : selectedPorter ? (
                            selectedPorter.photo_url ? (
                              <img
                                src={selectedPorter.photo_url}
                                alt={selectedPorter.name}
                                className="w-16 h-16 object-cover rounded-full border-2 border-primary"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-forest-light flex items-center justify-center text-white font-bold text-lg">
                                {selectedPorter.name.charAt(0)}
                              </div>
                            )
                          ) : null}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-lg text-gray-800 truncate">{selectedGuide?.name || selectedPorter?.name}</h5>
                          <p className="text-sm text-gray-600 truncate">
                            {selectedGuide ? selectedGuide.title || "Guide Profesional" : "Porter Profesional"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedGuide
                              ? `${selectedGuide.experience_years} Tahun Pengalaman`
                              : `${selectedPorter?.experience_years || 0} Tahun Pengalaman`}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 p-5 bg-gray-50 rounded-xl">
                      <h4 className="font-bold text-lg text-gray-800">{bookingSummary.service}</h4>
                      <div className="flex justify-between text-gray-700">
                        <span>Tanggal:</span>
                        <span className="font-medium">{bookingSummary.dates}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Peserta:</span>
                        <span className="font-medium">{bookingSummary.participants} orang</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-5 border-t border-gray-200">
                      <div className="flex justify-between text-gray-700">
                        <span>Harga dasar ({bookingSummary.participants} orang)</span>
                        <span>Rp {(bookingSummary.basePrice * bookingSummary.participants).toLocaleString()}</span>
                      </div>

                      {bookingSummary.additionalServices.map((service, index) => (
                        <div key={index} className="flex justify-between text-gray-600">
                          <span>{service.name}</span>
                          <span>Rp {service.price.toLocaleString()}</span>
                        </div>
                      ))}

                      <div className="flex justify-between text-gray-600">
                        <span>Asuransi ({bookingSummary.participants} orang)</span>
                        <span>Rp {(bookingSummary.insurance * bookingSummary.participants).toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-gray-600">
                        <span>Biaya Admin</span>
                        <span>Rp {bookingSummary.adminFee.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-gray-800">Total Pembayaran</span>
                        <span className="text-3xl font-bold text-primary">
                          Rp {totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/5 to-forest-light/5 p-5 rounded-xl border border-primary/10">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-gray-600">
                          <p className="font-bold mb-1">Pembayaran Aman</p>
                          <p className="text-sm">Transaksi dilindungi dengan enkripsi SSL. Berbagai metode pembayaran tersedia.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button
                        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-forest-light hover:from-primary/90 hover:to-forest-light/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                            Memproses...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            Bayar Sekarang
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </div>
                        )}
                      </Button>
                      <Button asChild variant="outline" className="w-full py-3 font-medium border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 shadow-md" size="default">
                        <Link to="/open-trip" className="flex items-center justify-center">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Kembali ke Paket
                        </Link>
                      </Button>
                    </div>

                    <div className="pt-5 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Butuh bantuan? Hubungi kami:
                      </p>
                      <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>+62 831-1357-5577</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>muhammadrifki1803@gmail.com</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Booking;