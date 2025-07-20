'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export default function MediaAddPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { user } = useAuth() as { user: any };
  const [altText, setAltText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name", { ascending: true });
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Pilih file terlebih dahulu.");
      return;
    }
    if (!user) {
      setError("User tidak ditemukan.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const { data: uploadData, error: uploadError } = await supabase.storage.from("media").upload(`media/${file.name}`, file);
    if (uploadError) {
      setLoading(false);
      setError(uploadError.message);
      return;
    }
    // Dapatkan public URL
    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(`media/${file.name}`);
    const publicUrl = publicUrlData?.publicUrl;
    // Insert ke tabel media
    const { error: dbError } = await supabase.from("media").insert({
      filename: file.name,
      url: publicUrl,
      alt_text: altText,
      uploaded_by: user.id,
      category_id: categoryId || null,
    });
    setLoading(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setSuccess("Upload berhasil!");
    setTimeout(() => {
      router.push("/admin/media");
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Tambah Media</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
        <input type="text" placeholder="Alt text (opsional)" value={altText} onChange={e => setAltText(e.target.value)} className="mb-4 block w-full border px-2 py-1 rounded" />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mb-4 block w-full border px-2 py-1 rounded">
          <option value="">Pilih Kategori (opsional)</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
} 