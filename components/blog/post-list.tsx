'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PostCard } from './post-card'
import { Search, LoaderCircle } from 'lucide-react'

export function PostList() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select('id, title, excerpt, slug, created_at, featured_image, category_id, categories(name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
      if (data) {
        setPosts(data)
      }
      setLoading(false)
    }
    fetchPosts()
  }, [search, categoryId])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true })
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  return (
    <div className="space-y-16">
      {/* Filter dan Pencarian */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Kolom Pencarian */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium leading-6 text-slate-900">
            Cari Artikel
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"
              placeholder="Judul artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Kolom Filter Kategori */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-slate-900">
            Filter Kategori
          </label>
          <div className="mt-2">
            <select
              id="category"
              name="category"
              className="block w-full rounded-md border-0 py-2.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Daftar Postingan */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#1A5F4D]" />
        </div>
      ) : posts.length > 0 ? (
        <div className="mx-auto grid max-w-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-slate-800">Tidak Ada Artikel Ditemukan</h3>
          <p className="text-slate-500 mt-2">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      )}
    </div>
  )
}