"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("programs").select("*" ).eq("id", id).single();
      if (!error) setForm(data);
      setLoading(false);
    };
    if (id) fetchProgram();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase.from("programs").update({
      title: form.title,
      description: form.description,
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status,
    }).eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess("Program kerja berhasil diupdate!");
    setTimeout(() => router.push("/admin/programs"), 1200);
  };

  if (!user || user.role !== "admin") {
    return <div>Akses ditolak</div>;
  }
  if (loading || !form) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Program Kerja</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Judul</label>
          <input name="title" type="text" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Deskripsi</label>
          <textarea name="description" value={form.description || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Tanggal Mulai</label>
          <input name="start_date" type="date" value={form.start_date || ""} onChange={handleChange} required />
        </div>
        <div>
          <label>Tanggal Selesai</label>
          <input name="end_date" type="date" value={form.end_date || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit">Update Program</button>
      </form>
    </div>
  );
} 