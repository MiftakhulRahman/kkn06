// components/admin/post-form.tsx (Buat file dan folder baru ini)
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { ImageUpload } from '@/components/common/image-upload'
import { LoaderCircle } from 'lucide-react'

type PostFormProps = {
  postId?: string // Jika ada postId, berarti ini mode edit
}

export function PostForm({ postId }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState('published') // Default status
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Auto-generate slug dari judul
  useEffect(() => {
    if (!postId) { // Hanya auto-generate slug jika ini adalah post baru
      setSlug(
        title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
      )
    }
  }, [title, postId])
  
  // Fetch data untuk mode edit
  useEffect(() => {
    if (!postId) return
    setLoading(true)
    async function fetchPost() {
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

  // Fetch kategori
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name', { ascending: true })
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!categoryId) {
      setError('Pilih kategori terlebih dahulu.')
      setLoading(false)
      return
    }

    const postData = {
      title, content, excerpt, slug, category_id: categoryId, featured_image: featuredImage, status,
      author_id: user?.id,
      updated_at: new Date().toISOString(),
    }

    let result
    if (postId) {
      result = await supabase.from('posts').update(postData).eq('id', postId)
    } else {
      result = await supabase.from('posts').insert(postData)
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/admin/posts')
    }
    setLoading(false)
  }

  if (loading && postId) {
     return <div className="flex justify-center items-center h-64"><LoaderCircle className="h-12 w-12 animate-spin text-[#1A5F4D]" /></div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">{postId ? 'Edit Post' : 'Buat Post Baru'}</h3>
            <p className="mt-1 text-sm text-gray-500">Isi detail artikel berita di bawah ini.</p>
          </div>
          
          {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Judul</label>
              <div className="mt-2">
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"/>
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">Slug (URL)</label>
              <div className="mt-2">
                <input type="text" name="slug" id="slug" value={slug} readOnly className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50 sm:text-sm sm:leading-6"/>
              </div>
            </div>

            <div className="sm:col-span-full">
              <label htmlFor="excerpt" className="block text-sm font-medium leading-6 text-gray-900">Ringkasan (Excerpt)</label>
              <div className="mt-2">
                <textarea id="excerpt" name="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Ringkasan singkat yang akan tampil di daftar berita.</p>
            </div>
            
            <div className="sm:col-span-full">
                <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">Konten</label>
                <div className="mt-2">
                    <textarea id="content" name="content" rows={15} value={content} onChange={(e) => setContent(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6" />
                </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Kategori</label>
              <div className="mt-2">
                <select id="category" name="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:max-w-xs sm:text-sm sm:leading-6">
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
              <div className="mt-2">
                <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:max-w-xs sm:text-sm sm:leading-6">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-full">
                <label htmlFor="featured-image" className="block text-sm font-medium leading-6 text-gray-900">Gambar Unggulan</label>
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
        <div className="flex justify-end">
          <button type="button" onClick={() => router.back()} className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center rounded-md bg-[#1A5F4D] py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-[#113e34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A5F4D] disabled:opacity-50">
            {loading ? <LoaderCircle className="animate-spin h-5 w-5"/> : (postId ? 'Simpan Perubahan' : 'Publikasikan')}
          </button>
        </div>
      </div>
    </form>
  )
}