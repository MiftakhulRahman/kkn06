'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { CalendarDays, User, Tag, MessageSquare, Send, LoaderCircle } from 'lucide-react'

// Helper untuk format tanggal
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchPostAndComments() {
      setIsLoading(true)
      const { data: postData } = await supabase
        .from('posts')
        .select('id, title, content, created_at, author_id, featured_image, categories(name), profiles(name)')
        .eq('slug', resolvedParams.slug)
        .single()

      if (postData) {
        setPost(postData)
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postData.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: true })
        setComments(commentsData || [])
      }
      setIsLoading(false)
    }
    fetchPostAndComments()
  }, [resolvedParams.slug])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Anda harus login untuk dapat berkomentar.')
      return
    }
    if (!post || !newComment.trim()) return

    setIsSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('comments').insert({
      post_id: post.id,
      // Gunakan user.id dari sesi otentikasi jika ada
      author_id: user.id,
      author_name: user.user_metadata?.name || 'Anonim', // Fallback ke metadata
      content: newComment,
      // Status 'pending' adalah default di database, jadi ini bisa dihilangkan jika cocok
      status: 'pending' 
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setNewComment('')
      // Tampilkan pesan sukses atau pemberitahuan
      alert('Komentar Anda telah dikirim dan sedang menunggu persetujuan admin.')
    }
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoaderCircle className="h-12 w-12 animate-spin text-[#1A5F4D]" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-24 sm:py-32">
        <h2 className="text-2xl font-bold text-slate-800">Artikel Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2">Maaf, kami tidak dapat menemukan artikel yang Anda cari.</p>
      </div>
    )
  }

  return (
    <div className="bg-white py-8 sm:py-16"> {/* Ubah padding agar tidak terlalu jauh dari navbar */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-slate-500">
              <li>
                <a href="/" className="hover:underline">Beranda</a>
                <span className="mx-1">/</span>
              </li>
              <li>
                <a href="/blog" className="hover:underline">Blog</a>
                <span className="mx-1">/</span>
              </li>
              <li className="text-slate-700 font-semibold truncate max-w-[120px] sm:max-w-xs md:max-w-md lg:max-w-lg" title={post.title}>{post.title}</li>
            </ol>
          </nav>
          {/* Header Artikel */}
          <div className="mb-8">
            {post.categories?.name && (
              <span className="mb-4 inline-flex items-center gap-x-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800">
                <Tag className="h-4 w-4" />
                {post.categories.name}
              </span>
            )}
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-slate-600">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Oleh {post.profiles?.name || 'Tim KKN'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>
            </div>
          </div>

          {/* Gambar Unggulan */}
          {post.featured_image && (
            <div className="my-10">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full aspect-[16/9] rounded-2xl bg-slate-100 object-cover"
              />
            </div>
          )}

          {/* Konten Artikel */}
          <div
            className="prose prose-lg prose-slate max-w-none prose-a:text-[#1A5F4D] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Bagian Komentar */}
          <div className="border-t border-slate-200 mt-16 pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <MessageSquare className="h-7 w-7" />
              Komentar ({comments.length})
            </h2>

            {/* Form Komentar */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mt-8 space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  required
                  className="block w-full rounded-md border-0 p-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"
                  placeholder="Bagikan pendapat Anda..."
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-md bg-[#1A5F4D] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#113e34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A5F4D] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Kirim Komentar
                    </>
                  )}
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </form>
            ) : (
                <div className="mt-8 rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
                    <p className="text-slate-600">Anda harus <a href="/login" className="font-semibold text-[#1A5F4D] hover:underline">login</a> untuk dapat meninggalkan komentar.</p>
                </div>
            )}
            
            {/* Daftar Komentar */}
            <div className="mt-10 space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-500"/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{comment.author_name}</p>
                      <p className="text-sm text-slate-500">
                        <time dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>
                      </p>
                    </div>
                    <p className="mt-1 text-slate-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}