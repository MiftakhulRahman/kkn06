'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth() as { user: any };

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError("");
      // Ambil daftar media dari tabel media
      const { data, error } = await supabase
        .from("media")
        .select("id, filename, url, alt_text, category_id, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setMedia(data || []);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  const handleDelete = async (id: string, filename: string) => {
    setError("");
    setSuccess("");
    // Hapus dari storage
    const { error: storageError } = await supabase.storage.from("media").remove([`media/${filename}`]);
    if (storageError) {
      setError(storageError.message);
      return;
    }
    // Hapus dari tabel media
    const { error: dbError } = await supabase.from("media").delete().eq("id", id);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setSuccess("Media berhasil dihapus");
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  if (!user || user.role !== 'admin') {
    return <div>Akses ditolak</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Daftar Media</h1>
      <Link href="/admin/media/new">
        <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">Tambah Media</button>
      </Link>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.length === 0 && <div className="col-span-full text-center">Tidak ada media.</div>}
          {media.map((item) => (
            <div
              key={item.id}
              className="border rounded p-2 flex flex-col items-center bg-gray-50 hover:shadow-lg transition"
            >
              <img
                src={item.url}
                alt={item.alt_text || item.filename}
                className="w-32 h-32 object-cover mb-2 rounded"
              />
              <div className="text-xs mb-1 break-all font-semibold">{item.filename}</div>
              {item.alt_text && <div className="text-xs text-gray-500 mb-1 italic">Alt: {item.alt_text}</div>}
              <div className="text-xs text-gray-400 mb-2">{new Date(item.created_at).toLocaleDateString()}</div>
              <button
                onClick={() => handleDelete(item.id, item.filename)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
