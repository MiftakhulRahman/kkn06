"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [parentOptions, setParentOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
      if (!error) setForm(data);
      setLoading(false);
    };
    if (id) fetchCategory();
  }, [id]);

  useEffect(() => {
    const fetchParents = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name", { ascending: true });
      setParentOptions((data || []).filter((cat: any) => cat.id !== id));
    };
    if (id) fetchParents();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let newForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };
    if (name === "name") {
      newForm.slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    setForm(newForm);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("categories").update({ ...form, parent_id: form.parent_id || null }).eq("id", id);
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/admin/categories");
  };

  if (loading || !form) {
    return <div className="flex h-96 items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin text-[#1A5F4D]" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 max-w-4xl">
        <div className="space-y-8 divide-y divide-gray-200">
            <div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Kategori</h1>
                    <p className="mt-1 text-slate-600">Perbarui detail kategori di bawah ini.</p>
                </div>
                
                {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nama Kategori</label>
                        <div className="mt-2">
                            <input type="text" name="name" id="name" value={form.name} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                        <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">Slug (URL)</label>
                        <div className="mt-2">
                            <input type="text" name="slug" id="slug" value={form.slug} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div className="sm:col-span-full">
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Deskripsi (Opsional)</label>
                        <div className="mt-2">
                            <textarea id="description" name="description" rows={3} value={form.description || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="parent_id" className="block text-sm font-medium leading-6 text-gray-900">Parent Kategori</label>
                        <div className="mt-2">
                            <select id="parent_id" name="parent_id" value={form.parent_id || ""} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:max-w-xs sm:text-sm sm:leading-6">
                                <option value="">-- Tidak ada parent --</option>
                                {parentOptions.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">Warna</label>
                        <div className="mt-2">
                           <input id="color" name="color" type="color" value={form.color || "#3B82F6"} onChange={handleChange} className="block h-9 w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D]"/>
                        </div>
                    </div>

                    <div className="sm:col-span-full">
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-[#1A5F4D] focus:ring-[#1A5F4D]"/>
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="is_active" className="font-medium text-gray-900">Kategori Aktif</label>
                                <p className="text-gray-500">Tampilkan kategori ini di situs publik.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-5">
            <div className="flex justify-end gap-x-3">
                <button type="button" onClick={() => router.back()} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Batal
                </button>
                <button type="submit" disabled={loading} className="inline-flex justify-center rounded-md bg-[#1A5F4D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#113e34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A5F4D] disabled:opacity-50">
                    {loading ? <LoaderCircle className="animate-spin h-5 w-5"/> : 'Simpan Perubahan'}
                </button>
            </div>
        </div>
    </form>
  );
}