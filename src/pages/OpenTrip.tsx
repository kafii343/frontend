"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Clock, Users, Calendar, Star, ArrowRight,
  Mountain, Camera, Tent, DollarSign, UserPlus
} from "lucide-react";
import api from "@/lib/api";

const OpenTrip = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("api/open-trips");
        console.log("TRIPS API:", response.data.data);

        if (response.data?.data?.length > 0) {
          setTrips(response.data.data);
        } else {
          setTrips([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
    const interval = setInterval(fetchTrips, 4000);
    return () => clearInterval(interval);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah": return "bg-green-100 text-green-700 border-green-200";
      case "Menengah": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Sulit": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper function to get the correct image URL based on the backend response
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "https://via.placeholder.com/500x300?text=Mountain";

    // Check if it's already an absolute URL or starts with http
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it starts with /uploads, prepend the base URL
    if (imageUrl.startsWith('/uploads')) {
      return `${api.defaults.baseURL}${imageUrl}`;
    }

    // Otherwise, prepend /uploads
    return `${api.defaults.baseURL}/uploads${imageUrl}`;
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-forest-light/10">
        <div className="container mx-auto px-4 text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 mb-6 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
            <span className="text-primary font-medium">Open Trip Terpercaya</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 mt-4">
            Bergabung Dengan<br /><span className="text-primary">Petualang Lainnya</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Temukan teman baru & pengalaman seru di gunung-gunung indah Sulawesi Selatan.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild variant="adventure" size="xl" className="bg-gradient-to-r from-primary to-forest-light hover:from-primary/90 hover:to-forest-light/90 text-white shadow-xl hover:shadow-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1">
              <Link to="/booking" className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" /> Daftar Sekarang
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
              <Link to="/guide" className="flex items-center">
                <Mountain className="mr-2 h-5 w-5" /> Tanya Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trip List */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <span className="text-primary font-medium">Paket Tersedia</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Paket Open Trip <span className="text-primary">Tersedia</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Pilih dari berbagai pilihan trip yang sesuai dengan kemampuan Anda
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-t-2 border-primary border-solid rounded-full animate-spin"></div>
              <span className="ml-4 text-muted-foreground">Memuat trip...</span>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Mountain className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada trip tersedia</h3>
              <p className="text-muted-foreground">Silakan cek kembali nanti untuk trip terbaru</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {trips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full border-0 bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 ease-in-out">

                  {/* Image Container - Fixed Aspect Ratio */}
                  <div className="aspect-video bg-gray-200 relative overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(trip.image_url)}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Difficulty Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getDifficultyColor(trip.difficulty || "")} text-xs md:text-sm px-3 py-1 rounded-full`}>
                        {trip.difficulty || "N/A"}
                      </Badge>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-gray-800 text-xs md:text-sm flex items-center gap-1 shadow-md">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{trip.rating || 4.8}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="pb-4 flex-grow p-6">
                    <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors font-bold text-gray-800">
                      {trip.title}
                    </CardTitle>

                    <CardDescription className="flex items-center gap-2 text-gray-600 mt-3">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="line-clamp-1">{trip.mountain_name || "Sulawesi Selatan"}</span>
                    </CardDescription>

                    <div className="flex gap-4 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{trip.duration_days}D{trip.duration_nights}N</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{(trip.max_participants - trip.quota_remaining) || 0}/{trip.max_participants}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 p-6 flex-grow flex flex-col">

                    {/* Price - Prominent */}
                    <div className="py-3 px-4 bg-gradient-to-r from-primary/5 to-forest-light/5 rounded-xl border border-primary/10">
                      <p className="text-xs text-gray-600 mb-1">Harga Mulai Dari</p>
                      <p className="text-2xl font-bold text-primary">
                        Rp {trip.base_price?.toLocaleString("id-ID") || "0"}
                      </p>
                      {trip.original_price && trip.original_price > trip.base_price && (
                        <p className="text-sm text-gray-500 line-through">
                          Rp {trip.original_price?.toLocaleString("id-ID")}
                        </p>
                      )}
                    </div>

                    {/* Schedule */}
                    <div>
                      <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" /> Jadwal Tersedia:
                      </h4>

                      {Array.isArray(trip.available_dates) && trip.available_dates.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {trip.available_dates.slice(0, 3).map((date: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {date}
                            </span>
                          ))}
                          {trip.available_dates.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              +{trip.available_dates.length - 3} lagi
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">Jadwal segera tersedia</p>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3 mt-auto pt-4">
                      <Button
                        asChild
                        variant={trip.is_closed || trip.quota_remaining <= 0 ? "outline" : "adventure"}
                        size="sm"
                        className={`flex-1 text-sm font-medium rounded-lg transition-all duration-300 ${
                          trip.is_closed || trip.quota_remaining <= 0
                            ? "text-gray-500 border-gray-300"
                            : "shadow-md"
                        }`}
                        disabled={trip.is_closed || trip.quota_remaining <= 0}
                      >
                        <Link
                          to={trip.is_closed || trip.quota_remaining <= 0 ? "#" : `/booking?trip=${trip.id}`}
                          onClick={(e) => {
                            if (trip.is_closed || trip.quota_remaining <= 0) {
                              e.preventDefault();
                              alert("Trip ini telah ditutup untuk pemesanan karena kuota telah penuh atau trip ditutup.");
                            }
                          }}
                        >
                          {trip.is_closed || trip.quota_remaining <= 0 ? "Penuh" : "Daftar"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="text-sm font-medium rounded-lg border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 shadow-md">
                        <Link to={`/trip-detail/${trip.id}`}>Detail</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <span className="text-primary font-medium">Kenapa Open Trip?</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Kenapa Pilih <span className="text-primary">Open Trip?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Teman Baru", desc: "Bertemu petualang lainnya", color: "bg-gradient-to-br from-primary to-forest-light" },
              { icon: DollarSign, title: "Harga Terjangkau", desc: "Biaya lebih hemat", color: "bg-gradient-to-br from-forest-light to-primary" },
              { icon: Camera, title: "Dokumentasi", desc: "Foto & video perjalanan", color: "bg-gradient-to-br from-primary/70 to-forest-light" },
              { icon: Tent, title: "Pengalaman Seru", desc: "Camping & aktivitas group", color: "bg-gradient-to-br from-forest-light to-primary/80" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-primary/20">
                <div className={`${item.color} w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default OpenTrip;