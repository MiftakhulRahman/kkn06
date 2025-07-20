'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { PlusCircle, Edit, Trash2, LoaderCircle } from 'lucide-react'

// Helper di dalam file ini untuk format tanggal
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Helper di dalam file ini untuk styling status
function StatusBadge({ status }: { status: string }) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'
  switch (status) {
    case 'published':
      return <span className={`${baseClasses} bg-emerald-100 text-emerald-800`}>Published</span>
    case 'draft':
      return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>Draft</span>
    default:
      return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>{status}</span>
  }
}

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      const { data } = await supabase
        .from('posts')
        .select('id, title, status, created_at, featured_image, categories(name)')
        .order('created_at', { ascending: false })
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus post ini? Tindakan ini tidak dapat dibatalkan.')) {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) {
        alert(error.message)
      } else {
        setPosts(posts.filter((post) => post.id !== id))
      }
    }
  }

  if (!user || user.role !== 'admin') {
    return <div>Akses ditolak</div>
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Post</h1>
          <p className="mt-1 text-slate-600">Buat, edit, dan hapus artikel berita dari situs Anda.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-md bg-[#1A5F4D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#113e34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A5F4D]"
          >
            <PlusCircle className="h-5 w-5" />
            Buat Post Baru
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
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Gambar</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Judul</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Tanggal</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Kategori</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                          {post.featured_image ? (
                            <Image src={post.featured_image} alt="Featured" width={80} height={80} className="h-14 w-14 rounded-md object-cover" />
                          ) : (
                            <div className="h-14 w-14 rounded-md bg-slate-100" />
                          )}
                        </td>
                        <td className="max-w-xs truncate px-3 py-4 text-sm font-medium text-slate-700">{post.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700"><StatusBadge status={post.status} /></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">{formatDate(post.created_at)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">{post.categories?.name || '-'}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end gap-x-4">
                            <Link href={`/admin/posts/${post.id}`} className="flex items-center gap-1 text-[#1A5F4D] hover:text-[#113e34]">
                              <Edit className="h-4 w-4" /> Edit
                            </Link>
                            <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1 text-red-600 hover:text-red-900">
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
  )
}