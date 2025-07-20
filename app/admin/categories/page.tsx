"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { PlusCircle, Edit, Trash2, Check, X, LoaderCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      setCategories(data || []);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setLoading(true);
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setLoading(false);
  };

  return (
    <div>
        <div className="sm:flex sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Kategori</h1>
                <p className="mt-1 text-slate-600">Atur semua kategori untuk postingan dan media di situs Anda.</p>
            </div>
            <div className="mt-4 sm:mt-0">
                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center gap-2 rounded-md bg-[#1A5F4D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#113e34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A5F4D]"
                >
                    <PlusCircle className="h-5 w-5" />
                    Tambah Kategori
                </Link>
            </div>
        </div>

        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <LoaderCircle className="h-12 w-12 animate-spin text-[#1A5F4D]" />
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-300">
                                <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Nama</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Slug</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Warna</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Aktif</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{cat.name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{cat.slug}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                                {cat.color}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                            {cat.is_active ? (
                                                <Check className="h-5 w-5 text-emerald-500" />
                                            ) : (
                                                <X className="h-5 w-5 text-red-500" />
                                            )}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex items-center justify-end gap-x-4">
                                                <Link href={`/admin/categories/${cat.id}/edit`} className="flex items-center gap-1 text-[#1A5F4D] hover:text-[#113e34]">
                                                    <Edit className="h-4 w-4" /> Edit
                                                </Link>
                                                <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1 text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-4 w-4" /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}