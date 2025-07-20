'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Camera, LoaderCircle, ImageOff } from 'lucide-react'

export default function GaleriPage() {
  const [media, setMedia] = useState<any[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function untuk validasi URL
  const isValidImageUrl = (url: string) => {
    if (!url || url === '#' || url === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true)
      let query = supabase
        .from('media')
        .select('id, url, alt_text, category_id, categories(name)')
        .order('created_at', { ascending: false })

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
      if (error) {
        console.error('Error fetching media:', error)
      } else {
        const processedMedia =
          data?.map((item) => ({
            ...item,
            url: item.url ? decodeURIComponent(item.url) : item.url,
          })) || []
        setMedia(processedMedia)
      }
      setLoading(false)
    }
    fetchMedia()
  }, [categoryId])

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Halaman */}
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Dokumentasi Kegiatan</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Jelajahi momen-momen yang telah kami abadikan. Galeri ini berisi kumpulan foto dari berbagai program kerja dan aktivitas kami di desa.</p>
        </div>

        {/* Filter Kategori */}
        <div className="mt-16 max-w-sm">
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-slate-900">
            Filter berdasarkan kategori
          </label>
          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Konten Galeri */}
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoaderCircle className="h-10 w-10 animate-spin text-[#1A5F4D]" />
            </div>
          ) : media.length > 0 ? (
            // --- Diubah menjadi 4 kolom tetap ---
            <div className="grid grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group overflow-hidden rounded-lg border border-slate-200">
                  <div className="relative h-40 w-full">
                    {isValidImageUrl(item.url) ? (
                      <Image
                        src={item.url}
                        alt={item.alt_text || 'Gambar Galeri'}
                        fill
                        sizes="(max-width: 640px) 25vw, 25vw"
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-200">
                        <ImageOff className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                     <p className="text-sm font-medium text-slate-800 truncate">{item.alt_text || 'Dokumentasi'}</p>
                     {item.categories?.name && <p className="text-xs text-slate-500 truncate">{item.categories.name}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-slate-200">
              <Camera className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-xl font-semibold text-slate-800">Galeri Kosong</h3>
              <p className="mt-1 text-base text-slate-500">Belum ada foto yang cocok dengan filter ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}