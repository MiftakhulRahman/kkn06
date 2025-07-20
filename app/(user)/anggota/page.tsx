'use client'

import Image from 'next/image'
import { BookMarked, Building2 } from 'lucide-react'

const anggota = [
  {
    nama: 'Dani Afriyanto',
    posisi: 'Ketua',
    prodi: 'Pendidikan Guru Madrasah Ibtidaiyah',
    fakultas: 'FAI',
    foto: 'https://via.placeholder.com/400x400?text=Dani',
  },
  {
    nama: 'Bayu Krisnadi',
    posisi: 'Wakil',
    prodi: 'Pendidikan Teknologi Informasi',
    fakultas: 'FIP',
    foto: 'https://via.placeholder.com/400x400?text=Bayu',
  },
  {
    nama: 'Khafidho Turrofi’ah',
    posisi: 'Sekretaris I',
    prodi: 'Pendidikan Agama Islam',
    fakultas: 'FAI',
    foto: 'https://via.placeholder.com/400x400?text=Khafidho',
  },
  {
    nama: 'Cindi Febiola',
    posisi: 'Sekretaris II',
    prodi: 'Pendidikan Guru Madrasah Ibtidaiyah',
    fakultas: 'FAI',
    foto: 'https://via.placeholder.com/400x400?text=Cindi',
  },
  {
    nama: 'Anik Apriliani',
    posisi: 'Bendahara I',
    prodi: 'Pendidikan Bahasa Inggris',
    fakultas: 'FIP',
    foto: 'https://via.placeholder.com/400x400?text=Anik',
  },
  {
    nama: 'Siti Anisa Lilumah',
    posisi: 'Bendahara II',
    prodi: 'Pendidikan Ekonomi',
    fakultas: 'FIP',
    foto: 'https://via.placeholder.com/400x400?text=Siti',
  },
  {
    nama: 'Nur Muhammad Kholis',
    posisi: 'Humas I',
    prodi: 'Pendidikan Agama Islam',
    fakultas: 'FAI',
    foto: 'https://via.placeholder.com/400x400?text=Nur',
  },
  {
    nama: 'Ardian Ade Kusuma',
    posisi: 'Humas II',
    prodi: 'Pendidikan Bahasa dan Sastra Indonesia',
    fakultas: 'FIP',
    foto: 'https://via.placeholder.com/400x400?text=Ardian',
  },
  {
    nama: 'Miftakhul Rahman',
    posisi: 'PDD I',
    prodi: 'Informatika',
    fakultas: 'SAINTEK',
    foto: 'https://via.placeholder.com/400x400?text=Miftakhul',
  },
  {
    nama: 'Julia Safitri',
    posisi: 'PDD II',
    prodi: 'Informatika',
    fakultas: 'SAINTEK',
    foto: 'https://via.placeholder.com/400x400?text=Julia',
  },
]

export default function MembersPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Halaman */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Tim KKN 06</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Perkenalkan tim solid di balik program kerja KKN 06 Desa Taman Harjo. Kolaborasi dari berbagai fakultas untuk memberikan yang terbaik bagi masyarakat.
          </p>
        </div>

        {/* Grid Anggota */}
        <div className="mx-auto mt-20 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {anggota.map((a) => (
            // Kartu Anggota (sekarang semua sama)
            <div
              key={a.nama}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200"
            >
              {/* Bagian Gambar */}
              <div className="relative aspect-h-1 aspect-w-1">
                <Image src={a.foto} alt={a.nama} fill className="object-cover object-center" />
                {/* Overlay Gelap di Bawah Gambar */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Badge Posisi di atas gambar */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-block rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 backdrop-blur-sm">
                  {a.posisi}
                </span>
              </div>

              {/* Bagian Konten Teks */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{a.nama}</h2>
                  <div className="mt-4 space-y-2 text-base text-slate-600">
                    <p className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5 flex-shrink-0 text-[#1A5F4D]" />
                      <span>{a.prodi}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 flex-shrink-0 text-[#1A5F4D]" />
                      <span>{a.fakultas}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}