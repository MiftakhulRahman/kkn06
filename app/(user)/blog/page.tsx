'use client'

import { PostList } from '@/components/blog/post-list'

export default function BlogPage() {
  return (
    // Menggunakan div sebagai pembungkus utama jika diperlukan section dengan background berbeda
    // Untuk saat ini, kita buat layout sederhana yang konsisten
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Halaman */}
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Berita Terbaru
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Ikuti terus perkembangan dan cerita terbaru dari kegiatan kami. Temukan wawasan, pembaruan program, dan kisah-kisah inspiratif dari lapangan.
          </p>
        </div>

        {/* Daftar Postingan Blog */}
        {/* Memberi margin atas untuk memisahkan header dengan konten list */}
        <div className="mt-16 sm:mt-20">
          <PostList />
        </div>
      </div>
    </div>
  )
}