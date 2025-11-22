import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mountain, 
  Users, 
  Award, 
  Shield,
  ArrowRight,
  Star,
  Target,
  Heart,
  Compass
} from "lucide-react";

const About = () => {
  const stats = [
    {
      number: "500+",
      label: "Trip Sukses",
      icon: Mountain
    },
    {
      number: "1000+", 
      label: "Petualang Bahagia",
      icon: Users
    },
    {
      number: "5+",
      label: "Tahun Pengalaman", 
      icon: Award
    },
    {
      number: "0",
      label: "Kecelakaan Serius",
      icon: Shield
    }
  ];

  const team = [
    {
      name: "Andi Mappaseng",
      role: "Founder & Head Guide",
      experience: "10+ Tahun",
      description: "Pendiri Carten'z dengan passion mendalam untuk gunung Sulawesi Selatan",
      avatar: "/placeholder.svg"
    },
    {
      name: "Siti Nurhaliza", 
      role: "Operations Manager",
      experience: "7+ Tahun",
      description: "Memastikan setiap trip berjalan lancar dan sesuai standar keselamatan",
      avatar: "/placeholder.svg"
    },
    {
      name: "Muhammad Fadli",
      role: "Lead Porter Coordinator", 
      experience: "8+ Tahun",
      description: "Koordinator porter dengan jaringan luas di seluruh Sulawesi Selatan",
      avatar: "/placeholder.svg"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Keselamatan Utama",
      description: "Keselamatan adalah prioritas nomor satu dalam setiap perjalanan yang kami adakan"
    },
    {
      icon: Heart,
      title: "Layanan Penuh Semangat", 
      description: "Kami melayani dengan hati dan passion untuk memberikan pengalaman terbaik"
    },
    {
      icon: Target,
      title: "Standar Profesional",
      description: "Standar profesional tinggi dalam setiap aspek layanan dan operasional"
    },
    {
      icon: Compass,
      title: "Keahlian Lokal",
      description: "Pengetahuan mendalam tentang kondisi lokal dan budaya Sulawesi Selatan"
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Berdirinya Carten'z", 
      description: "dari passion untuk memperkenalkan keindahan gunung Sulawesi Selatan"
    },
    {
      year: "2020",
      title: "Sertifikasi Tim",
      description: "Semua guide mendapat sertifikasi resmi dan pelatihan keselamatan"
    },
    {
      year: "2021", 
      title: "Ekspansi Layanan",
      description: "Menambah layanan porter profesional dan paket dokumentasi"
    },
    {
      year: "2022",
      title: "Platform Digital",
      description: "Meluncurkan platform booking online untuk kemudahan pelanggan"
    },
    {
      year: "2023",
      title: "Award Recognition",
      description: "Mendapat penghargaan Best Adventure Tourism Operator Sulsel"
    },
    {
      year: "2024",
      title: "500+ Trip Milestone", 
      description: "Mencapai 500+ trip sukses dengan tingkat kepuasan 98%"
    }
  ];

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="py-28 bg-gradient-to-br from-primary/5 to-forest-light/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center max-w-4xl mx-auto px-4">
              <div className="inline-block px-4 py-2 mb-6 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary font-medium">Tentang Carten'z</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-8 leading-tight">
                Passion Untuk 
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-forest-light">Petualangan</span>
              </h1>
              <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Carten'z adalah platform adventure tourism terpercaya yang berfokus pada 
                gunung-gunung indah Sulawesi Selatan. Kami berkomitmen memberikan pengalaman 
                petualangan yang aman, berkesan, dan berkelanjutan.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
                <Button asChild variant="adventure" size="xl" className="bg-gradient-to-r from-primary to-forest-light hover:from-primary/90 hover:to-forest-light/90 text-white shadow-xl hover:shadow-2xl px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                  <Link to="/open-trip" className="flex items-center">
                    Mulai Petualangan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center">
                  <Link to="/guide" className="flex items-center">
                    Tim Kami
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-primary/20">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-forest-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-6 mx-auto">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-3 text-gray-800">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto px-4">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-20">
                <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                  <span className="text-primary font-medium">Cerita Kami</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  Cerita 
                  <span className="text-primary"> Kami</span>
                </h2>
                <p className="text-xl text-gray-600 text-center leading-relaxed">
                  Perjalanan kami dimulai dari kecintaan terhadap alam Sulawesi Selatan
                </p>
              </div>

              <div className="space-y-10 px-4">
                <Card className="shadow-xl border-0 bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-primary/20">
                  <CardContent className="p-0">
                    <div className="prose max-w-none text-gray-700">
                      <p className="text-lg leading-relaxed mb-6 text-gray-700 text-base">
                        Carten'z lahir dari passion mendalam terhadap keindahan gunung-gunung Sulawesi Selatan. 
                        Kami percaya bahwa setiap orang berhak merasakan kedamaian dan keajaiban alam yang 
                        ditawarkan oleh pegunungan yang menakjubkan ini.
                      </p>
                      
                      <p className="leading-relaxed mb-6 text-gray-700 text-base">
                        Dimulai pada tahun 2019 oleh sekelompok pendaki lokal yang berpengalaman, Carten'z 
                        berevolusi menjadi platform adventure tourism yang komprehensif. Kami menggabungkan 
                        pengetahuan lokal yang mendalam dengan standar keselamatan internasional untuk 
                        memberikan pengalaman petualangan yang tak terlupakan.
                      </p>
                      
                      <p className="leading-relaxed text-gray-700 text-base">
                        Hari ini, Carten'z telah melayani ribuan petualang dari berbagai kalangan, mulai dari 
                        pemula hingga pendaki berpengalaman. Kami bangga menjadi jembatan antara keindahan 
                        alam Sulawesi Selatan dengan para pencinta petualangan, sambil tetap menjaga 
                        kelestarian lingkungan dan memberdayakan masyarakat lokal.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto px-4">
            <div className="text-center mb-20 px-4">
              <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary font-medium">Nilai-Nilai Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Nilai-Nilai 
                <span className="text-primary"> Kami</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                Prinsip-prinsip yang mendasari setiap tindakan dan keputusan kami
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 px-4">
              {values.map((value, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20">
                  <CardHeader className="p-0 pb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-forest-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors text-gray-800 text-left">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-2 text-gray-700 leading-relaxed text-base">
                    <p>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-gradient-to-b from-background to-card px-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto px-4">
            <div className="text-center mb-20 px-4">
              <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary font-medium">Perjalanan Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Perjalanan 
                <span className="text-primary"> Kami</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                Milestone penting dalam perjalanan Carten'z selama bertahun-tahun
              </p>
            </div>

            <div className="max-w-4xl mx-auto px-4">
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-8 group px-4">
                    <div className="flex flex-col items-center flex-shrink-0 md:mt-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-forest-light rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:bg-forest-light transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110 transform">
                        {item.year.slice(-2)}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-forest-light mt-4" />
                      )}
                    </div>
                    <div className="flex-1 pb-12 pl-4 pt-2 border-l-2 border-gray-200 group-hover:border-primary/50 transition-colors duration-300 ml-3">
                      <div className="flex items-center gap-4 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-primary border-primary/30 px-4 py-2 text-base font-medium rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors duration-200">
                          {item.year}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300 leading-tight text-lg">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-gradient-to-b from-card to-background px-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto px-4">
            <div className="text-center mb-20 px-4">
              <div className="inline-block px-4 py-2 mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                <span className="text-primary font-medium">Tim Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Tim 
                <span className="text-primary"> Kami</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                Orang-orang berpengalaman di balik kesuksesan setiap perjalanan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto px-4">
              {team.map((member, index) => (
                <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:bg-gradient-to-b from-white to-primary/5">
                  <CardHeader className="pb-6 px-0 pt-0 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-forest-light to-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg overflow-hidden">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-28 h-28" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors text-gray-800 mb-3 text-center">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2 mb-3 text-center text-gray-600 text-base">
                      <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-sm font-medium">
                        {member.role}
                      </Badge>
                    </CardDescription>
                    <div className="text-base text-gray-600 font-medium text-center">
                      {member.experience}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-2 text-gray-600 leading-relaxed text-base text-center">
                    <p>
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 bg-gradient-to-br from-primary to-forest-light relative overflow-hidden px-4">
          <div className="absolute inset-0 bg-[url('/mountain-pattern.svg')] opacity-10 mix-blur-soft-light"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-5xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Siap Bergabung Dengan Kami?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed px-4 text-lg">
              Mari ciptakan kenangan tak terlupakan di gunung-gunung indah Sulawesi Selatan. 
              Petualangan menanti Anda!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-4">
              <Button asChild variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-xl group flex items-center justify-center" >
                <Link to="/open-trip" className="flex items-center justify-center" >
                  Lihat Open Trip
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="xl" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-xl border border-white/20 flex items-center justify-center text-primary hover:text-primary" >
                <Link to="/booking" className="flex items-center justify-center" >
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;