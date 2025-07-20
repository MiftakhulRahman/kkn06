import Link from 'next/link'
import { Post } from '@/lib/types' // Pastikan tipe Post sudah didefinisikan dengan benar
import { CalendarDays, Tag } from 'lucide-react'

// Helper untuk format tanggal (opsional, namun direkomendasikan)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function PostCard({ post }: { post: any }) { // Ganti 'any' dengan tipe Post yang lebih spesifik
  return (
    <article className="flex flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="w-full">
        {/* Gambar Unggulan */}
        {post.featured_image && (
          <div className="relative w-full mb-6">
            <img
              src={post.featured_image}
              alt={post.title}
              className="aspect-[16/9] w-full rounded-xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
          </div>
        )}

        {/* Info Meta: Kategori dan Tanggal */}
        <div className="flex items-center gap-x-4 text-xs mb-4">
          <time dateTime={post.created_at} className="text-slate-500 flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {formatDate(post.created_at)}
          </time>
          {post.categories?.name && (
            <span className="relative z-10 rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {post.categories.name}
            </span>
          )}
        </div>

        {/* Judul dan Ringkasan */}
        <div className="group relative">
          <h3 className="text-lg font-semibold leading-6 text-slate-900 group-hover:text-slate-600">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        </div>
      </div>
    </article>
  )
}