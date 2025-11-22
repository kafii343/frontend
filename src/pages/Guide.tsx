"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users, Clock, CheckCircle } from "lucide-react";
import api from "@/lib/api";

const Guide = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await api.get("api/guides");
        setGuides(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data guide:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Memuat data guide...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Daftar Guide Kami
      </h1>
      <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
        Pilih guide terbaik untuk menemani perjalanan wisata Anda. Klik tombol
        di bawah untuk langsung melakukan booking!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide) => (
          <Card
            key={guide.id}
            className="text-center hover:shadow-mountain transition-smooth border border-gray-200"
          >
            <CardHeader className="pb-4">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {guide.photo_url ? (
                  <img
                    src={guide.photo_url}
                    alt={guide.name}
                    className="w-full h-full object-cover rounded-full border-4 border-primary"
                  />
                ) : (
                  <div className="w-full h-full bg-mountain-peak rounded-full" />
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              <CardTitle>{guide.name}</CardTitle>
              <CardDescription>
                {guide.title || "Guide Profesional"}
              </CardDescription>
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4" /> {guide.experience_years} Tahun
                Pengalaman
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {guide.description ||
                  "Guide berpengalaman dan ramah siap menemani wisata Anda."}
              </p>
              <div className="text-center py-3 bg-accent/50 rounded-lg">
                <span className="text-lg font-bold text-primary">
                  Rp {guide.price_per_day?.toLocaleString("id-ID")}
                </span>
                <p className="text-xs text-muted-foreground">per hari</p>
              </div>

              {/* Tombol Booking */}
              <Button asChild className="w-full" variant="outline">
                <Link to={`/booking?guideId=${guide.id}`}>
                  Pesan Guide Ini
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild variant="mountain" size="lg">
          <Link to="/booking">
            Booking Guide Sekarang
            <Users className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Guide;
