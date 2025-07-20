'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { ImageUpload } from '@/components/common/image-upload'
import Image from 'next/image'
import { LoaderCircle } from 'lucide-react'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState('published')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [postId, setPostId] = useState('')
  const router = useRouter()
  const { user } = useAuth()
  
  // Menggunakan 'use' untuk mendapatkan params di Server Component
  const resolvedParams = use(params)
  
  useEffect(() => {
    setPostId(resolvedParams.id)
  }, [resolvedParams])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name', { ascending: true })
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!postId) return
    async function fetchPost() {
      setLoading(true)
      const { data } = await supabase.from('posts').select('*').eq('id', postId).single()
      if (data) {
        setTitle(data.title)
        setContent(data.content || '')
        setExcerpt(data.excerpt || '')
        setSlug(data.slug)
        setCategoryId(data.category_id || '')
        setFeaturedImage(data.featured_image || '')
        setStatus(data.status || 'published')
      }
      setLoading(false)
    }
    fetchPost()
  }, [postId])
  
  if (!user || user.role !== 'admin') {
    return <div>Akses ditolak</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!categoryId) {
      setError('Pilih kategori terlebih dahulu.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('posts').update({
      title, content, excerpt, slug, category_id: categoryId, featured_image: featuredImage, status,
      updated_at: new Date().toISOString()
    }).eq('id', postId)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/posts')
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoaderCircle className="h-12 w-12 animate-spin text-[#1A5F4D]" /></div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Post</h1>
            <p className="mt-1 text-slate-600">Perbarui detail artikel berita di bawah ini.</p>
          </div>

          {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Judul</label>
              <div className="mt-2">
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">Slug (URL)</label>
              <div className="mt-2">
                {/* Di halaman edit, slug sebaiknya tidak diubah otomatis */}
                <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div className="sm:col-span-full">
              <label htmlFor="excerpt" className="block text-sm font-medium leading-6 text-gray-900">Ringkasan (Excerpt)</label>
              <div className="mt-2">
                <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Ringkasan singkat yang akan tampil di daftar berita.</p>
            </div>

            <div className="sm:col-span-full">
              <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">Konten</label>
              <div className="mt-2">
                <textarea id="content" rows={15} value={content} onChange={(e) => setContent(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Kategori</label>
              <div className="mt-2">
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:max-w-xs sm:text-sm sm:leading-6">
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
              <div className="mt-2">
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:max-w-xs sm:text-sm sm:leading-6">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-full">
              <label className="block text-sm font-medium leading-6 text-gray-900">Gambar Unggulan</label>
              <div className="mt-2">
                <ImageUpload onUpload={(url) => setFeaturedImage(url)} />
                {featuredImage && (
                  <div className="mt-4">
                    <Image src={featuredImage} alt="Featured" width={200} height={200} className="rounded-lg object-cover" />
                  </div>
                )}
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
            {loading ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </form>
  )
}