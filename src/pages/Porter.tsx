import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Porter = () => {
  const [porters, setPorters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data porter dari backend
  useEffect(() => {
    const fetchPorters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/porters");
        setPorters(response.data.data);
      } catch (error) {
        console.error("Gagal memuat data porter:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPorters();
  }, []);

  // Data statis untuk layanan porter
  const porterServices = [
    {
      title: "Bantuan Membawa Barang",
      description:
        "Porter profesional siap membantu membawa peralatan Anda, sehingga Anda dapat mendaki dengan lebih ringan.",
    },
    {
      title: "Persiapan & Pembersihan Camp",
      description:
        "Porter membantu menyiapkan tenda, memasak, dan memastikan area camp tetap bersih serta aman.",
    },
    {
      title: "Pendampingan Jalur Pendakian",
      description:
        "Porter berpengalaman dalam jalur pendakian lokal, memastikan Anda tetap berada di jalur aman dan efisien.",
    },
  ];

  // Alasan menggunakan porter
  const whyNeedPorter = [
    "Mengurangi beban fisik selama pendakian.",
    "Mendukung ekonomi lokal dengan menggunakan jasa porter gunung.",
    "Memberikan kenyamanan ekstra untuk fokus menikmati perjalanan.",
  ];

  // Etika penggunaan porter
  const porterEtiquette = [
    "Hargai dan perlakukan porter dengan sopan.",
    "Jangan memaksa porter membawa beban melebihi kapasitas.",
    "Berikan upah sesuai kesepakatan dan kinerja.",
    "Jaga komunikasi dan kerja sama selama pendakian.",
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* Section 1: Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-mountain-forest">Layanan Porter Gunung</h1>
        <p className="text-lg text-muted-foreground">
          Nikmati pendakian tanpa beban dengan bantuan porter profesional yang siap mendampingi
          Anda dari awal hingga puncak.
        </p>
        <Button asChild variant="adventure">
          <Link to="/booking">Pesan Porter Sekarang</Link>
        </Button>
      </section>

      {/* Section 2: Layanan Porter */}
      <section className="space-y-10">
        <h2 className="text-3xl font-semibold text-center text-mountain-forest">
          Layanan Porter Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {porterServices.map((service, index) => (
            <Card
              key={index}
              className="text-center group hover:shadow-mountain transition-smooth"
            >
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-mountain-peak rounded-full flex items-center justify-center text-white text-2xl">
                  {index + 1}
                </div>
                <CardTitle className="group-hover:text-primary transition-smooth">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: Data Porter dari Backend */}
      <section className="space-y-10">
        <h2 className="text-3xl font-semibold text-center text-mountain-forest">
          Pilihan Porter Profesional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center text-muted-foreground col-span-3">
              Memuat data porter...
            </p>
          ) : porters.length === 0 ? (
            <p className="text-center text-muted-foreground col-span-3">
              Belum ada data porter
            </p>
          ) : (
            porters.map((porter) => (
              <Card
                key={porter.id}
                className="text-center group hover:shadow-mountain transition-smooth"
              >
                <CardHeader className="pb-4">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {porter.photo_url ? (
                      <img
                        src={porter.photo_url}
                        alt={porter.name}
                        className="w-full h-full object-cover rounded-full border-4 border-primary"
                      />
                    ) : (
                      <div className="w-full h-full bg-mountain-peak rounded-full flex items-center justify-center text-white text-2xl">
                        {porter.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-smooth">
                    {porter.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {porter.experience_years} Tahun Pengalaman
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {porter.description || "Tidak ada deskripsi tersedia."}
                  </p>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kapasitas Maks:</span>
                    <span className="font-medium text-primary">
                      {porter.max_capacity_kg || 0} kg
                    </span>
                  </div>

                  <div className="text-center py-3 bg-accent/50 rounded-lg">
                    <span className="text-lg font-bold text-primary">
                      Rp {porter.price_per_day.toLocaleString("id-ID")}
                    </span>
                    <p className="text-xs text-muted-foreground">per hari</p>
                  </div>

                  <Button
                    asChild
                    variant="adventure"
                    size="sm"
                    className="w-full group/btn"
                  >
                    <Link to={`/booking?porter=${porter.id}`}>
                      Pilih Porter Ini
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Section 4: Kenapa Butuh Porter */}
      <section className="space-y-10">
        <h2 className="text-3xl font-semibold text-center text-mountain-forest">
          Kenapa Perlu Porter?
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {whyNeedPorter.map((reason, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle2 className="text-primary w-6 h-6" />
              <p className="text-muted-foreground">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Etika Porter */}
      <section className="space-y-10">
        <h2 className="text-3xl font-semibold text-center text-mountain-forest">
          Etika Menggunakan Jasa Porter
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {porterEtiquette.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Info className="text-mountain-peak w-5 h-5 mt-1" />
              <p className="text-muted-foreground">{rule}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Porter;
