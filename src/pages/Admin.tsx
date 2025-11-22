// Admin.tsx - Updated
import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import UserManagement from "@/components/Admin/UserManagement";

type Guide = any;
type Porter = any;
type Mountain = any;
type OpenTrip = any;
type Booking = any;

const API_BASE = "http://localhost:5000/api";

export default function Admin() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const [stats, setStats] = useState({
    confirmed_bookings: 0,
    paid_bookings: 0,
    total_revenue: 0,
    available_guides: 0,
    available_porters: 0,
    active_trips: 0,
  });

  const [guides, setGuides] = useState<Guide[]>([]);
  const [porters, setPorters] = useState<Porter[]>([]);
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [openTrips, setOpenTrips] = useState<OpenTrip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showPorterForm, setShowPorterForm] = useState(false);
  const [showMountainForm, setShowMountainForm] = useState(false);
  const [showOpenTripForm, setShowOpenTripForm] = useState(false);

  const [editing, setEditing] = useState<{ type: "guide" | "porter" | "mountain" | "open-trip"; data: any } | null>(null);



  const fetchAll = async () => {
    try {
      const [statsRes, guidesRes, portersRes, mountainsRes, bookingsRes, tripsRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard/stats`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/guides`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/porters`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/mountains`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/bookings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/open-trips`).then(r => r.json()).catch(() => null),
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (guidesRes?.success) setGuides(guidesRes.data);
      if (portersRes?.success) setPorters(portersRes.data);
      if (mountainsRes?.success) setMountains(mountainsRes.data);
      if (bookingsRes?.success) setBookings(bookingsRes.data);
      if (tripsRes?.success) setOpenTrips(tripsRes.data);
    } catch (err) {
      console.error("fetchAll error", err);
    }
  };

  // Auto-refresh bookings every 30 seconds
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAll();
      const interval = setInterval(fetchAll, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isAdmin]);

  const confirmAndDelete = async (type: "guide" | "porter" | "mountain" | "open-trip", id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const endpoint = type === "mountain" ? "mountains" : type === "open-trip" ? "open-trips" : type + "s";
      await fetch(`${API_BASE}/${endpoint}/${id}`, { method: "DELETE" });
      await fetchAll();
      alert("Dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  // --- GuideForm
  function GuideForm({ initial = null, onClose }: { initial?: Guide | null; onClose: () => void; }) {
    const [form, setForm] = useState({
      name: initial?.name ?? "",
      title: initial?.title ?? "Mountain Guide",
      experience_years: initial?.experience_years ?? "",
      languages: initial?.languages ? (Array.isArray(initial.languages) ? initial.languages.join(", ") : initial.languages) : "",
      specialties: initial?.specialties ? (Array.isArray(initial.specialties) ? initial.specialties.join(", ") : initial.specialties) : "",
      price_per_day: initial?.price_per_day ?? "",
      description: initial?.description ?? "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.photo ? `${API_BASE.replace("/api","")}${initial.photo}` : null);
    const isEdit = !!initial?.id;

    const handleFile = (f?: File) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };

    const submit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      try {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("title", form.title);
        fd.append("experience_years", String(form.experience_years));
        fd.append("languages", form.languages);
        fd.append("specialties", form.specialties);
        fd.append("price_per_day", String(form.price_per_day));
        fd.append("description", form.description);
        if (file) fd.append("photo", file);

        const url = isEdit ? `${API_BASE}/guides/${initial.id}` : `${API_BASE}/guides`;
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, { method, body: fd });
        const data = await res.json();
        if (data.success) { alert(isEdit ? "Guide terupdate" : "Guide berhasil dibuat"); onClose(); fetchAll(); }
        else { console.error("Guide save failed", data); alert("Gagal menyimpan guide"); }
      } catch (err) { console.error(err); alert("Gagal menyimpan guide"); }
    };

    return (
      <Card className="mt-4">
        <CardHeader><CardTitle>{isEdit ? "Edit Guide" : "Tambah Guide"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Nama</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Pengalaman (tahun)</Label><Input type="number" value={String(form.experience_years)} onChange={e => setForm({ ...form, experience_years: Number(e.target.value) })} /></div>
              <div><Label>Harga per hari</Label><Input type="number" value={String(form.price_per_day)} onChange={e => setForm({ ...form, price_per_day: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Bahasa (pisah koma)</Label><Input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} /></div>
            <div><Label>Spesialisasi (pisah koma)</Label><Input value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} /></div>
            <div><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Foto</Label><Input type="file" accept="image/*" onChange={(e: any) => handleFile(e.target.files?.[0])} />{preview && <img src={preview} alt="preview" className="w-40 h-24 object-contain rounded mt-2" />}</div>
            <div className="flex gap-2"><Button type="submit">{isEdit ? "Update" : "Simpan"}</Button><Button type="button" variant="outline" onClick={onClose}>Batal</Button></div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // --- PorterForm
  function PorterForm({ initial = null, onClose }: { initial?: Porter | null; onClose: () => void; }) {
    const [form, setForm] = useState({
      name: initial?.name ?? "",
      experience_years: initial?.experience_years ?? "",
      max_capacity_kg: initial?.max_capacity_kg ?? "",
      specialties: initial?.specialties ? (Array.isArray(initial.specialties) ? initial.specialties.join(", ") : initial.specialties) : "",
      price_per_day: initial?.price_per_day ?? "",
      description: initial?.description ?? "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.photo ? `${API_BASE.replace("/api","")}${initial.photo}` : null);
    const isEdit = !!initial?.id;

    const handleFile = (f?: File) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };

    const submit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      try {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("experience_years", String(form.experience_years));
        fd.append("max_capacity_kg", String(form.max_capacity_kg));
        fd.append("specialties", form.specialties);
        fd.append("price_per_day", String(form.price_per_day));
        fd.append("description", form.description);
        if (file) fd.append("photo", file);

        const url = isEdit ? `${API_BASE}/porters/${initial.id}` : `${API_BASE}/porters`;
        const method = isEdit ? "PUT" : "POST";
        const res = await fetch(url, { method, body: fd });
        const data = await res.json();
        if (data.success) { alert(isEdit ? "Porter terupdate" : "Porter berhasil dibuat"); onClose(); fetchAll(); }
        else { console.error("Porter save failed", data); alert("Gagal menyimpan porter"); }
      } catch (err) { console.error(err); alert("Gagal menyimpan porter"); }
    };

    return (
      <Card className="mt-4">
        <CardHeader><CardTitle>{isEdit ? "Edit Porter" : "Tambah Porter"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Nama</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required/></div>
              <div><Label>Pengalaman (tahun)</Label><Input type="number" value={String(form.experience_years)} onChange={e => setForm({ ...form, experience_years: Number(e.target.value) })} /></div>
              <div><Label>Max Kapasitas (kg)</Label><Input type="number" value={String(form.max_capacity_kg)} onChange={e => setForm({ ...form, max_capacity_kg: Number(e.target.value) })} /></div>
              <div><Label>Harga per hari</Label><Input type="number" value={String(form.price_per_day)} onChange={e => setForm({ ...form, price_per_day: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Spesialisasi (pisah koma)</Label><Input value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })}/></div>
            <div><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/></div>
            <div><Label>Foto</Label><Input type="file" accept="image/*" onChange={(e:any) => handleFile(e.target.files?.[0])} />{preview && <img src={preview} alt="preview" className="w-24 h-24 object-contain rounded mt-2" />}</div>
            <div className="flex gap-2"><Button type="submit">{isEdit ? "Update" : "Simpan"}</Button><Button type="button" variant="outline" onClick={onClose}>Batal</Button></div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // --- MountainForm
  function MountainForm({ initial = null, onClose }: { initial?: Mountain | null; onClose: () => void; }) {
    const [form, setForm] = useState({
      name: initial?.name ?? "",
      location: initial?.location ?? "",
      altitude: initial?.altitude ?? "",
      difficulty: initial?.difficulty ?? "Menengah",
      description: initial?.description ?? "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.image_url ? `${API_BASE.replace("/api","")}${initial.image_url}` : null);
    const isEdit = !!initial?.id;

    const handleFile = (f?: File) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };

    const submit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      try {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("location", form.location);
        fd.append("altitude", String(form.altitude));
        fd.append("difficulty", form.difficulty);
        fd.append("description", form.description);
        if (file) fd.append("image_url", file);

        const url = isEdit ? `${API_BASE}/mountains/${initial.id}` : `${API_BASE}/mountains`;
        const method = isEdit ? "PUT" : "POST";
        const res = await fetch(url, { method, body: fd });
        const data = await res.json();
        if (data.success) { alert(isEdit ? "Mountain terupdate" : "Mountain berhasil dibuat"); onClose(); fetchAll(); }
        else { console.error("Mountain save failed", data); alert("Gagal menyimpan mountain"); }
      } catch (err) { console.error(err); alert("Gagal menyimpan mountain"); }
    };

    return (
      <Card className="mt-4">
        <CardHeader><CardTitle>{isEdit ? "Edit Mountain" : "Tambah Mountain"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Nama</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></div>
              <div><Label>Lokasi</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}/></div>
              <div><Label>Altitude (mdpl)</Label><Input type="number" value={String(form.altitude)} onChange={e => setForm({ ...form, altitude: Number(e.target.value) })}/></div>
              <div><Label>Difficulty</Label><Input value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}/></div>
            </div>
            <div><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/></div>
            <div><Label>Gambar</Label><Input type="file" accept="image/*" onChange={(e:any) => handleFile(e.target.files?.[0])} />{preview && <img src={preview} alt="preview" className="w-24 h-24 object-contain rounded mt-2" />}</div>
            <div className="flex gap-2"><Button type="submit">{isEdit ? "Update" : "Simpan"}</Button><Button type="button" variant="outline" onClick={onClose}>Batal</Button></div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // --- OpenTripForm
  function OpenTripForm({ initial = null, onClose }: { initial?: OpenTrip | null; onClose: () => void; }) {
    const [mountainList, setMountainList] = useState<Mountain[]>([]);
    const [form, setForm] = useState({
      title: initial?.title ?? "",
      mountain_id: initial?.mountain_id ?? "",
      duration_days: initial?.duration_days ?? "",
      duration_nights: initial?.duration_nights ?? "",
      difficulty: initial?.difficulty ?? "",
      base_price: initial?.base_price ?? "",
      original_price: initial?.original_price ?? "",
      min_participants: initial?.min_participants ?? "",
      max_participants: initial?.max_participants ?? "",
      description: initial?.description ?? "",
      includes: initial?.includes ? (Array.isArray(initial.includes) ? initial.includes.join(", ") : initial.includes) : "",
      highlights: initial?.highlights ? (Array.isArray(initial.highlights) ? initial.highlights.join(", ") : initial.highlights) : "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initial?.image_url ? `${API_BASE.replace("/api","")}${initial.image_url}` : null);
    const isEdit = !!initial?.id;

    useEffect(() => {
      const fetchMountains = async () => {
        try {
          const res = await fetch(`${API_BASE}/mountains`);
          const data = await res.json();
          if (data.success) setMountainList(data.data);
        } catch (err) {
          console.error("Fetch mountains error:", err);
        }
      };
      fetchMountains();
    }, []);

    const handleFile = (f?: File) => { if (!f) return; setFile(f); setPreview(URL.createObjectURL(f)); };

    const submit = async (e?: React.FormEvent) => {
      e?.preventDefault();
      try {
        const fd = new FormData();
        fd.append("title", form.title);
        if (form.mountain_id) fd.append("mountain_id", String(form.mountain_id));
        if (form.duration_days) fd.append("duration_days", String(form.duration_days));
        if (form.duration_nights) fd.append("duration_nights", String(form.duration_nights));
        if (form.difficulty) fd.append("difficulty", form.difficulty);
        if (form.base_price) fd.append("base_price", String(form.base_price));
        if (form.original_price) fd.append("original_price", String(form.original_price));
        if (form.min_participants) fd.append("min_participants", String(form.min_participants));
        if (form.max_participants) fd.append("max_participants", String(form.max_participants));
        if (form.description) fd.append("description", form.description);
        if (form.includes) fd.append("includes", form.includes);
        if (form.highlights) fd.append("highlights", form.highlights);
        if (file) fd.append("image_url", file);

        const url = isEdit ? `${API_BASE}/open-trips/${initial.id}` : `${API_BASE}/open-trips`;
        const method = isEdit ? "PUT" : "POST";
        const res = await fetch(url, { method, body: fd });
        const data = await res.json();
        if (data.success) { alert(isEdit ? "Trip terupdate" : "Trip berhasil dibuat"); onClose(); fetchAll(); }
        else { console.error("Trip save failed", data); alert("Gagal menyimpan trip: " + data.message); }
      } catch (err) { console.error("Submit error:", err); alert("Gagal menyimpan trip: " + err.message); }
    };

    return (
      <Card className="mt-4">
        <CardHeader><CardTitle>{isEdit ? "Edit Open Trip" : "Tambah Open Trip"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required/>
              <select value={form.mountain_id} onChange={e => setForm({ ...form, mountain_id: e.target.value })} className="border rounded px-2 py-1" required>
                <option value="">Pilih Gunung</option>
                {mountainList.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <Input type="number" placeholder="Hari" value={form.duration_days} onChange={e => setForm({ ...form, duration_days: e.target.value })}/>
              <Input type="number" placeholder="Malam" value={form.duration_nights} onChange={e => setForm({ ...form, duration_nights: e.target.value })}/>
              <Input placeholder="Difficulty" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}/>
              <Input type="number" placeholder="Base Price" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })}/>
              <Input type="number" placeholder="Original Price" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })}/>
              <Input type="number" placeholder="Min Participants" value={form.min_participants} onChange={e => setForm({ ...form, min_participants: e.target.value })}/>
              <Input type="number" placeholder="Max Participants" value={form.max_participants} onChange={e => setForm({ ...form, max_participants: e.target.value })}/>
            </div>
            <div><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/></div>
            <div><Label>Includes (pisah koma)</Label><Input value={form.includes} onChange={e => setForm({ ...form, includes: e.target.value })}/></div>
            <div><Label>Highlights (pisah koma)</Label><Input value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })}/></div>
            <div><Label>Gambar</Label><Input type="file" accept="image/*" onChange={(e:any) => handleFile(e.target.files?.[0])} />{preview && <img src={preview} alt="preview" className="w-40 h-24 object-contain rounded mt-2" />}</div>
            <div className="flex gap-2"><Button type="submit">{isEdit ? "Update" : "Simpan"}</Button><Button type="button" variant="outline" onClick={onClose}>Batal</Button></div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Determine default tab based on current URL
  const location = useLocation();
  const getDefaultTab = () => {
    if (location.pathname.includes('/admin/mountains')) return 'mountains';
    if (location.pathname.includes('/admin/users')) return 'users';
    if (location.pathname.includes('/admin/guides')) return 'guides';
    if (location.pathname.includes('/admin/porters')) return 'porters';
    if (location.pathname.includes('/admin/open-trips')) return 'open-trips';
    if (location.pathname.includes('/admin/bookings')) return 'bookings';
    return 'users'; // default
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Booking Konfirmasi</CardTitle></CardHeader><CardContent>{stats.confirmed_bookings}</CardContent></Card>
        <Card><CardHeader><CardTitle>Booking Lunas</CardTitle></CardHeader><CardContent>{stats.paid_bookings}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent>Rp {Number(stats.total_revenue).toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>Guide Tersedia</CardTitle></CardHeader><CardContent>{stats.available_guides}</CardContent></Card>
        <Card><CardHeader><CardTitle>Porter Tersedia</CardTitle></CardHeader><CardContent>{stats.available_porters}</CardContent></Card>
        <Card><CardHeader><CardTitle>Open Trip Aktif</CardTitle></CardHeader><CardContent>{stats.active_trips}</CardContent></Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={getDefaultTab()} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="porters">Porters</TabsTrigger>
            <TabsTrigger value="mountains">Mountains</TabsTrigger>
            <TabsTrigger value="open-trips">Open Trips</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          <Button onClick={logout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Guides */}
        <TabsContent value="guides">
          <Card className="mb-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Guides</CardTitle>
              <Button onClick={() => { setShowGuideForm(s => !s); setShowPorterForm(false); setShowMountainForm(false); setShowOpenTripForm(false); setEditing(null); }}>
                <Plus className="h-4 w-4 mr-2"/>Tambah Guide
              </Button>
            </CardHeader>
            <CardContent>
              {showGuideForm && <GuideForm initial={editing?.type === "guide" ? editing.data : null} onClose={() => { setShowGuideForm(false); setEditing(null); }}/>}
              <div className="space-y-3 mt-4">
                {guides.length === 0 ? <p className="text-muted-foreground">Belum ada guide</p> :
                  guides.map(g => (
                    <div key={g.id} className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-4">
                        {g.photo && <img src={`${API_BASE.replace("/api","")}${g.photo}`} alt={g.name} className="w-24 h-24 object-contain rounded"/>}
                        <div><div className="font-semibold">{g.name}</div><div className="text-sm text-muted-foreground">{g.title}</div><div className="text-sm">Rp {Number(g.price_per_day).toLocaleString()}</div></div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => { setEditing({ type: "guide", data: g }); setShowGuideForm(true); }}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="destructive" onClick={() => confirmAndDelete("guide", g.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Porters */}
        <TabsContent value="porters">
          <Card className="mb-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Porters</CardTitle>
              <Button onClick={() => { setShowPorterForm(s => !s); setShowGuideForm(false); setShowMountainForm(false); setShowOpenTripForm(false); setEditing(null); }}>
                <Plus className="h-4 w-4 mr-2"/>Tambah Porter
              </Button>
            </CardHeader>
            <CardContent>
              {showPorterForm && <PorterForm initial={editing?.type === "porter" ? editing.data : null} onClose={() => { setShowPorterForm(false); setEditing(null); }}/>}
              <div className="space-y-3 mt-4">
                {porters.length === 0 ? <p className="text-muted-foreground">Belum ada porter</p> :
                  porters.map(p => (
                    <div key={p.id} className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-4">
                        {p.photo && <img src={`${API_BASE.replace("/api","")}${p.photo}`} alt={p.name} className="w-24 h-24 object-contain rounded"/>}
                        <div><div className="font-semibold">{p.name}</div><div className="text-sm text-muted-foreground">{p.specialties}</div><div className="text-sm">Rp {Number(p.price_per_day).toLocaleString()}</div></div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => { setEditing({ type: "porter", data: p }); setShowPorterForm(true); }}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="destructive" onClick={() => confirmAndDelete("porter", p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mountains */}
        <TabsContent value="mountains">
          <Card className="mb-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Mountains</CardTitle>
              <Button onClick={() => { setShowMountainForm(s => !s); setShowGuideForm(false); setShowPorterForm(false); setShowOpenTripForm(false); setEditing(null); }}>
                <Plus className="h-4 w-4 mr-2"/>Tambah Mountain
              </Button>
            </CardHeader>
            <CardContent>
              {showMountainForm && <MountainForm initial={editing?.type === "mountain" ? editing.data : null} onClose={() => { setShowMountainForm(false); setEditing(null); }}/>}
              <div className="space-y-3 mt-4">
                {mountains.length === 0 ? <p className="text-muted-foreground">Belum ada mountain</p> :
                  mountains.map(m => (
                    <div key={m.id} className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-4">
                        {m.image_url && <img src={`${API_BASE.replace("/api","")}${m.image_url}`} alt={m.name} className="w-24 h-24 object-contain rounded"/>}
                        <div>
                          <div className="font-semibold">{m.name}</div>
                          <div className="text-sm text-muted-foreground">{m.location}</div>
                          <div className="text-sm text-muted-foreground">{m.altitude} mdpl</div>
                          <Badge variant={m.difficulty === "Mudah" ? "default" : m.difficulty === "Menengah" ? "secondary" : "destructive"}>
                            {m.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => { setEditing({ type: "mountain", data: m }); setShowMountainForm(true); }}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="destructive" onClick={() => confirmAndDelete("mountain", m.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Open Trips */}
        <TabsContent value="open-trips">
          <Card className="mb-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Open Trips</CardTitle>
              <Button onClick={() => { setShowOpenTripForm(s => !s); setShowGuideForm(false); setShowPorterForm(false); setShowMountainForm(false); setEditing(null); }}>
                <Plus className="h-4 w-4 mr-2"/>Tambah Trip
              </Button>
            </CardHeader>
            <CardContent>
              {showOpenTripForm && <OpenTripForm initial={editing?.type === "open-trip" ? editing.data : null} onClose={() => { setShowOpenTripForm(false); setEditing(null); }}/>}
              <div className="space-y-3 mt-4">
                {openTrips.length === 0 ? <p className="text-muted-foreground">Belum ada trip</p> :
                  openTrips.map(t => (
                    <div key={t.id} className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-4">
                        {t.image_url && <img src={`${API_BASE.replace("/api","")}${t.image_url}`} alt={t.title} className="w-40 h-24 object-contain rounded"/>}
                        <div>
                          <div className="font-semibold">{t.title}</div>
                          <div className="text-sm text-muted-foreground">{t.duration_days}D{t.duration_nights}N • {t.min_participants}-{t.max_participants} orang</div>
                          <div className="text-sm font-semibold">Rp {Number(t.base_price).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => { setEditing({ type: "open-trip", data: t }); setShowOpenTripForm(true); }}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="destructive" onClick={() => confirmAndDelete("open-trip", t.id)}><Trash2 className="h-4 w-4" /></Button>
                        <Badge>{t.difficulty}</Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        {/* Bookings */}
        <TabsContent value="bookings">
          <Card className="mb-4">
            <CardHeader><CardTitle>Bookings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.length === 0 ? <p className="text-muted-foreground">Belum ada booking</p> :
                  bookings.map(b => (
                    <div key={b.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 border rounded p-3">
                      <div>
                        <div className="font-semibold">{b.customer_name}</div>
                        <div className="text-sm text-muted-foreground">Kode: {b.booking_code}</div>
                      </div>
                      <div>
                        <div className="text-sm">{b.open_trip_title || b.trip_title}</div>
                        <div className="text-sm text-muted-foreground">{b.total_participants} peserta</div>
                      </div>
                      <div>
                        <div className="text-sm">Rp {Number(b.total_price || b.base_price || 0).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{b.payment_status || b.status}</div>
                      </div>
                      <div className="flex justify-end items-center">
                        <Badge variant={b.payment_status === "paid" ? "default" : "outline"}>
                          {b.payment_status || b.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}