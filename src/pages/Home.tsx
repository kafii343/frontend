import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-sulawesi-mountains.jpg";
import {
  Users,
  MapPin,
  Star,
  ArrowRight,
  Compass,
  Backpack,
  UserCheck,
  Clock,
  Shield,
  Award
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

// Define Mountain type
interface Mountain {
  id: string;
  name: string;
  location: string;
  altitude: number;
  difficulty: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Home = () => {
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await api.get("/mountains");
        if (response.data.success) {
          const result = response.data;

          // Filter mountains to only include specific ones: Bawakaraeng, Lembah Lohe, and Bulu Baria
          // Exclude Lompobattang as requested
          const filteredMountains = result.data.filter((mountain: Mountain) =>
            mountain.name === "Gunung Bawakaraeng" ||
            mountain.name === "Lembah Lohe" ||
            mountain.name === "Gunung Bulu Baria"
          );

          setMountains(filteredMountains);
        } else {
          console.error("Failed to fetch mountains:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching mountains:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
  }, []);

  const services = [
    {
      title: "Open Trip",
      description: "Bergabung dengan group petualang lainnya dalam perjalanan yang tak terlupakan",
      icon: Users,
      href: "/open-trip",
      color: "bg-gradient-to-br from-primary to-forest-light text-white",
    },
    {
      title: "Jasa Guide",
      description: "Guide berpengalaman untuk memandu perjalanan Anda dengan aman dan menyenangkan",
      icon: Compass,
      href: "/guide",
      color: "bg-gradient-to-br from-forest-light to-forest-deep text-white",
    },
    {
      title: "Jasa Porter",
      description: "Porter profesional untuk membantu membawa perlengkapan selama pendakian",
      icon: Backpack,
      href: "/porter",
      color: "bg-gradient-to-br from-forest-deep to-forest-light text-white",
    },
  ];

  const features = [
    {
      icon: UserCheck,
      title: "Guide Bersertifikat",
      description: "Semua guide memiliki sertifikat resmi dan pengalaman bertahun-tahun"
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Perlengkapan safety standar internasional dan asuransi perjalanan"
    },
    {
      icon: Clock,
      title: "Fleksibel",
      description: "Jadwal yang dapat disesuaikan dengan kebutuhan dan keinginan Anda"
    },
    {
      icon: Award,
      title: "Berpengalaman",
      description: "Lebih dari 5 tahun melayani petualang di Sulawesi Selatan"
    },
  ];

  // Helper function to get the correct image URL based on the backend response
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder-mountain.jpg";

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
    <>
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="inline-block px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white text-sm md:text-base font-medium">Platform Adventure Terpercaya Sulawesi Selatan</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Jelajahi Keindahan
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
                Gunung Sulsel
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Temukan petualangan tak terlupakan bersama Carten'z. Open trip, guide profesional,
              dan porter berpengalaman untuk eksplorasi gunung-gunung menakjubkan Sulawesi Selatan.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild variant="adventure" size="xl" className="group bg-gradient-to-r from-primary to-forest-light hover:from-primary/90 hover:to-forest-light/90 text-white shadow-xl hover:shadow-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1">
                <Link to="/open-trip">
                  Mulai Petualangan
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                <Link to="/about">
                  Pelajari Lebih Lanjut
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary text-sm font-medium">Layanan Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Petualangan Impian Anda
                <br />
                <span className="text-primary">Dimulai Disini</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Pilih layanan yang sesuai dengan kebutuhan petualangan Anda di Sulawesi Selatan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {services.map((service) => (
                <Card key={service.title} className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 hover:from-primary/5 hover:to-forest-light/5 shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
                  <CardHeader className="text-center pb-6 pt-8">
                    <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg ${service.color}`}>
                      <service.icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors font-bold text-gray-800">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-gray-600 px-4">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0 pb-6 px-6">
                    <Button asChild variant="outline" size="sm" className="group/btn border-primary/30 text-primary hover:bg-primary/10 font-medium px-6 py-2 rounded-full transition-all duration-300 hover:shadow-md">
                      <Link to={service.href}>
                        Lihat Detail
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations Section */}
        <section className="py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary text-sm font-medium">Destinasi Populer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Gunung Terbaik
                <span className="text-primary"> Sulawesi Selatan</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Jelajahi puncak-puncak tertinggi dan pemandangan terindah di Sulawesi Selatan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4">
              {loading ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-gray-600">Memuat destinasi menakjubkan...</p>
                </div>
              ) : mountains.length > 0 ? (
                mountains.slice(0, 3).map((mountain) => (
                  <Card key={mountain.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={getImageUrl(mountain.image_url)}
                        alt={mountain.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          // Fallback image if the main image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-mountain.jpg"; // You can replace this with a default image path
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <CardHeader className="pt-6 pb-4">
                      <CardTitle className="flex items-start justify-between text-gray-800 group-hover:text-primary transition-colors font-bold text-xl">
                        <span>{mountain.name}</span>
                        <Badge variant="outline" className={`text-xs px-3 py-1 ${
                          mountain.difficulty === "Mudah"
                            ? "text-green-600 border-green-300"
                            : mountain.difficulty === "Menengah"
                              ? "text-yellow-600 border-yellow-300"
                              : "text-red-600 border-red-300"
                        }`}>
                          {mountain.difficulty}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        {mountain.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-6 px-6">
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-muted-foreground text-gray-600">Ketinggian:</span>
                        <span className="font-medium text-gray-800">{mountain.altitude} mdpl</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-muted-foreground text-gray-600">Durasi:</span>
                        <span className="font-medium text-gray-800">3-4 Hari</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-muted-foreground text-gray-600">Kesulitan:</span>
                        <span className="font-medium text-gray-800">{mountain.difficulty}</span>
                      </div>
                      <Button asChild variant="outline" className="w-full group/btn border-primary/30 text-primary hover:bg-primary/10 font-medium rounded-lg transition-all duration-300 hover:shadow-md mt-4">
                        <Link to="/open-trip" className="py-2">
                          Lihat Paket Trip
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-gray-600">Tidak ada destinasi yang tersedia saat ini.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16 px-4">
              <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary text-sm font-medium">Mengapa Carten'z</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Dipercaya Ribuan
                <span className="text-primary"> Petualang</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-primary to-forest-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 text-gray-800 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary to-forest-light relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/mountain-pattern.svg')] opacity-10 mix-blur-soft-light"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Siap Untuk Petualangan
                <br />
                Yang Tak Terlupakan?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto px-4">
                Bergabunglah dengan ribuan petualang lainnya yang telah merasakan keindahan
                Sulawesi Selatan bersama Carten'z
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
                <Button asChild variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-xl group">
                  <Link to="/booking" className="flex items-center">
                    Pesan Trip Sekarang
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="xl" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-xl border border-white/20">
                  <Link to="/guide" className="flex items-center text-primary hover:text-primary">
                    Konsultasi Guide
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;