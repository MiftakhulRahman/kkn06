"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export default function NewProgramPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("planned");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { error } = await supabase.from("programs").insert({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      status,
      responsible_person: user!.id,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess("Program kerja berhasil ditambahkan!");
    setTimeout(() => router.push("/admin/programs"), 1200);
  };

  if (!user || user.role !== "admin") {
    return <div>Akses ditolak</div>;
  }

  return (
    <div>
      <h1>Tambah Program Kerja</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Judul</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Deskripsi</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Tanggal Mulai</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>Tanggal Selesai</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="planned">Direncanakan</option>
            <option value="ongoing">Berlangsung</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
        <button type="submit">Tambah Program</button>
      </form>
    </div>
  );
} 