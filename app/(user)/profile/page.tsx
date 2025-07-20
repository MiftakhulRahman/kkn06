"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      // Hapus URL lama yang menggunakan path avatars/
      const currentAvatarUrl = user.avatar_url || "";
      if (currentAvatarUrl.includes('/avatars/')) {
        setAvatarUrl("");
      } else {
        setAvatarUrl(currentAvatarUrl);
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    let uploadedUrl = avatarUrl;
    
    try {
      // Upload file jika ada
      if (file) {
        console.log("Uploading file:", file.name);
        const fileExt = file.name.split(".").pop();
        const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
        
        console.log("Attempting to upload to:", fileName);
        
        const { data, error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file);
          
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Upload gagal: ${uploadError.message}`);
        }
        
        console.log("Upload successful, data:", data);
        
        const { data: publicUrl } = supabase.storage
          .from("media")
          .getPublicUrl(fileName);
        uploadedUrl = publicUrl.publicUrl;
        console.log("Public URL generated:", uploadedUrl);
        
        // Test apakah URL bisa diakses
        try {
          const response = await fetch(uploadedUrl, { method: 'HEAD' });
          console.log("File accessibility test response:", response.status, response.statusText);
          if (!response.ok) {
            console.warn("Warning: Uploaded file might not be accessible:", uploadedUrl);
          }
        } catch (err) {
          console.warn("Warning: Could not verify file accessibility:", err);
        }
      }
      
      // Update profile data
      console.log("Updating profile with:", { name, bio, avatar_url: uploadedUrl });
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({ 
          name: name.trim(), 
          bio: bio.trim(), 
          avatar_url: uploadedUrl 
        })
        .eq("id", user.id)
        .select();
        
      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error(`Update gagal: ${updateError.message}`);
      }
      
      console.log("Profile updated successfully:", data);
      setSuccess("Profil berhasil diperbarui.");
      setAvatarUrl(uploadedUrl);
      setFile(null);
      
    } catch (err) {
      console.error("Error in handleSave:", err);
      setError((err as Error).message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Memuat...</div>;
  if (!user) return <div>Anda belum login.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ccc' }}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error("Image failed to load:", avatarUrl);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: avatarUrl ? 'none' : 'block' }}>
              {/* Fallback untuk user tanpa avatar */}
            </div>
          </div>
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
        <div>
          <label className="block font-medium">Nama</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="border rounded px-3 py-2 w-full bg-gray-100"
            value={user.email}
            disabled
          />
        </div>
        <div>
          <label className="block font-medium">Role</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full bg-gray-100"
            value={user.role}
            disabled
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
} 