// page.tsx (Versi Final - Semua Section dengan Tombol "Lihat Semua")

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React from 'react'

// Import hooks
import { usePosts } from '@/hooks/use-posts'
import { usePrograms } from '@/hooks/use-programs'
import { useMedia } from '@/hooks/use-media'
import { useStats } from '@/hooks/use-stats'

// Import Ikon
import { ArrowRight, Flower, Beef, Store, Sparkles, Image as ImageIcon, BookMarked, Building2 } from 'lucide-react'

// =================================================================================
// Definisi Komponen In-line
// =================================================================================
interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}
const Section = ({ children, className = '', id }: SectionProps) => (
    <motion.section
      id={id}
      className={`w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28 ${className}`}
      style={{ willChange: 'opacity, transform' }}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 tracking-tight">
    {children}
  </h2>
)

const SectionSubtitle = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 text-center text-lg text-gray-600 max-w-3xl mx-auto">
    {children}
  </p>
)

const FeatureItem = ({icon: Icon, title, description} : {icon: React.ElementType, title: string, description: string}) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6"/>
        </div>
        <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
)


// =================================================================================
// Komponen Utama Halaman Beranda
// =================================================================================
export default function Home() {
  const { posts } = usePosts()
  const { programs } = usePrograms()
  const { media } = useMedia()
  const { stats } = useStats()

  // Helper & Data
  const isValidImageUrl = (url?: string) => {
    if (!url || url === '#' || url === '') return false
    try { new URL(url); return true } catch { return false }
  }
  const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ongoing: 'bg-amber-50 text-amber-700 border-amber-200',
    planned: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  const anggotaData = [
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
  ]
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="w-full bg-slate-50 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative min-h-screen flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                {/* Kolom Teks */}
                <motion.div
                    className="z-10 text-center lg:text-left"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
                    }}
                >
                    <motion.div variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0, transition:{duration: 0.5, ease: "easeOut"}}}} className="inline-flex items-center gap-2 bg-[#74BC10] bg-opacity-20 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                        <Sparkles className="w-4 h-4" />
                        Universitas Merdeka Madiun
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900"
                        variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0, transition:{duration: 0.5, ease: "easeOut"}}}}
                    >
                        KKN 06 <br className="hidden lg:block" /> Desa <span className="text-[#1A5F4D]">Taman Harjo</span>
                    </motion.h1>

                    <motion.p
                        className="mt-6 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 text-gray-600"
                        variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0, transition:{duration: 0.5, ease: "easeOut"}}}}
                    >
                        Sebuah dedikasi untuk negeri melalui program kerja nyata demi mewujudkan kemandirian dan kesejahteraan masyarakat desa.
                    </motion.p>

                    <motion.div
                        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        variants={{hidden: {opacity: 0, y: 20}, visible: {opacity: 1, y: 0, transition:{duration: 0.5, ease: "easeOut"}}}}
                    >
                        <Link href="/program" className="inline-flex items-center justify-center bg-[#1A5F4D] text-white px-7 py-3 rounded-full font-semibold text-base transition hover:bg-opacity-90 shadow-lg hover:shadow-emerald-200">
                            Jelajahi Program
                        </Link>
                        <Link href="/kontak" className="inline-flex items-center justify-center bg-white text-gray-700 px-7 py-3 rounded-full font-semibold text-base transition ring-1 ring-inset ring-slate-300 hover:bg-slate-100 shadow-sm">
                            Hubungi Kami <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Kolom Gambar */}
                <div className="hidden lg:block relative w-full h-full flex items-center">
                    <motion.div
                        className="relative w-[500px] h-[500px] mx-auto"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                         <Image
                            src="/logo.png"
                            alt="Foto kegiatan KKN 06 di Desa Taman Harjo"
                            width={500}
                            height={500}
                            priority
                            className="rounded-full object-cover shadow-2xl"
                         />
                    </motion.div>
                     <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                        animate={{ opacity: 1, scale: 1, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 1 }}
                        className="absolute top-[10%] right-[80%] w-24 h-24 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center"
                    >
                        <Flower className="w-12 h-12 text-[#FFCC00]" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: 30 }}
                        animate={{ opacity: 1, scale: 1, rotate: -15 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 1.2 }}
                        className="absolute bottom-[15%] right-[10%] w-24 h-24 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center"
                    >
                        <Beef className="w-12 h-12 text-[#1A5F4D]" />
                    </motion.div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Section */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-center">
            <div className="py-4 md:py-0">
                <p className="text-5xl font-bold tracking-tighter text-[#1A5F4D]">{stats?.totalMembers || 0}</p>
                <p className="text-base text-gray-600 mt-1">Anggota KKN</p>
            </div>
            <div className="py-4 md:py-0">
                <p className="text-5xl font-bold tracking-tighter text-[#1A5F4D]">{stats?.totalPrograms || 0}</p>
                <p className="text-base text-gray-600 mt-1">Program Kerja</p>
            </div>
            <div className="py-4 md:py-0">
                <p className="text-5xl font-bold tracking-tighter text-[#1A5F4D]">{stats?.totalDays || 0}</p>
                <p className="text-base text-gray-600 mt-1">Hari Pelaksanaan</p>
            </div>
        </div>
      </Section>

      {/* Program Kerja Unggulan */}
      <Section className="bg-slate-50">
        <SectionTitle>Program Kerja Unggulan</SectionTitle>
        <SectionSubtitle>Inisiatif utama kami yang dirancang untuk memberikan dampak positif dan berkelanjutan bagi masyarakat desa.</SectionSubtitle>
        <div className="mt-12">
          {programs && programs.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {programs.slice(0, 3).map((program: any) => (
                <motion.div
                  key={program.id}
                  variants={itemVariants}
                  style={{ willChange: 'opacity, transform' }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full transition-all duration-300 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow">{program.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[program.status as keyof typeof statusStyles] || statusStyles.planned}`}>
                      {program.status === 'completed' ? 'Selesai' : program.status === 'ongoing' ? 'Berlangsung' : 'Rencana'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(program.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-gray-500">Data program kerja belum tersedia.</div>
          )}
        </div>
        {programs && programs.length > 3 && (
           <div className="mt-12 text-center">
                <Link href="/program" className="inline-flex items-center justify-center bg-white text-gray-700 px-7 py-3 rounded-full font-semibold text-base transition ring-1 ring-inset ring-slate-300 hover:bg-slate-100 shadow-sm">
                    Lihat Semua Program Kerja <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
           </div>
        )}
      </Section>

      {/* Berita Terbaru */}
      <Section>
        <SectionTitle>Berita & Kegiatan Terbaru</SectionTitle>
        <SectionSubtitle>Ikuti perkembangan dan momen penting dari setiap kegiatan yang kami laksanakan di lapangan.</SectionSubtitle>
        <div className="mt-12">
          {posts && posts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {posts.slice(0, 3).map((post: any) => (
                <motion.div
                    key={post.id}
                    variants={itemVariants}
                    style={{ willChange: 'opacity, transform' }}
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full transition-all duration-300 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-sm">
                      <div className="relative aspect-video bg-slate-100">
                        {isValidImageUrl(post.featured_image) ? (
                          <Image
                            src={post.featured_image!}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <Sparkles className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <h3 className="font-semibold text-gray-900 mb-3">{post.title}</h3>
                        <div className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                          Baca Selengkapnya
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
             <div className="text-center py-10 text-gray-500">Belum ada berita untuk ditampilkan.</div>
          )}
        </div>
        {posts && posts.length > 3 && (
           <div className="mt-12 text-center">
                <Link href="/blog" className="inline-flex items-center justify-center bg-[#1A5F4D] text-white px-7 py-3 rounded-full font-semibold text-base transition hover:bg-opacity-90 shadow-sm">
                    Kunjungi Blog <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
           </div>
        )}
      </Section>

      {/* Dokumentasi Kegiatan */}
      <Section className="bg-slate-50">
        <SectionTitle>Dokumentasi Kegiatan</SectionTitle>
        <SectionSubtitle>Momen-momen yang terekam selama kegiatan Kuliah Kerja Nyata berlangsung di Desa Taman Harjo.</SectionSubtitle>
        <div className="mt-12">
            {media && media.length > 0 ? (
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {media.slice(0, 8).map((item: any, i: number) => (
                        <motion.div
                            key={item.id}
                            className={`relative h-full rounded-xl overflow-hidden group border border-slate-200 ${i === 0 || i === 5 ? 'md:col-span-2' : ''} ${i === 2 ? 'md:row-span-2' : ''}`}
                            variants={itemVariants}
                            style={{ willChange: 'opacity, transform' }}
                        >
                            {isValidImageUrl(item.url) ? (
                                <Image src={item.url} alt={item.alt_text || item.filename} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400"><ImageIcon className="w-10 h-10" /></div>
                            )}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white font-medium text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">{item.alt_text || 'Dokumentasi KKN 06'}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-10 text-gray-500">Galeri masih kosong.</div>
            )}
        </div>
        {media && media.length > 8 && (
           <div className="mt-12 text-center">
                <Link href="/galeri" className="inline-flex items-center justify-center bg-white text-gray-700 px-7 py-3 rounded-full font-semibold text-base transition ring-1 ring-inset ring-slate-300 hover:bg-slate-100 shadow-sm">
                    Buka Galeri Lengkap <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
           </div>
        )}
      </Section>

      {/* ====================================================================== */}
      {/* Tim KKN 06 - UPDATED SECTION                                           */}
      {/* ====================================================================== */}
      <Section>
        <SectionTitle>Tim KKN 06</SectionTitle>
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
        >
          {anggotaData.slice(0, 3).map((member) => (
            <motion.div
                key={member.nama}
                variants={itemVariants}
                style={{ willChange: 'opacity, transform' }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200"
            >
              {/* Bagian Gambar */}
              <div className="relative aspect-h-1 aspect-w-1">
                  <Image src={member.foto} alt={member.nama} fill className="object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Badge Posisi */}
              <div className="absolute top-4 right-4 z-10">
                  <span className="inline-block rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 backdrop-blur-sm">
                      {member.posisi}
                  </span>
              </div>

              {/* Bagian Konten Teks */}
              <div className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900">{member.nama}</h2>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <p className="flex items-center gap-2">
                              <BookMarked className="h-5 w-5 flex-shrink-0 text-[#1A5F4D]" />
                              <span>{member.prodi}</span>
                          </p>
                          <p className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 flex-shrink-0 text-[#1A5F4D]" />
                              <span>{member.fakultas}</span>
                          </p>
                      </div>
                  </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {anggotaData && anggotaData.length > 3 && (
           <div className="mt-16 text-center">
                <Link href="/anggota" className="inline-flex items-center justify-center bg-[#1A5F4D] text-white px-7 py-3 rounded-full font-semibold text-base transition hover:bg-opacity-90 shadow-lg hover:shadow-emerald-200">
                    Lihat Seluruh Tim <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
           </div>
        )}
      </Section>

      {/* Mengenal Desa Taman Harjo */}
      <Section className="bg-slate-50">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
                <SectionTitle>Mengenal Desa Taman Harjo</SectionTitle>
                <p className="mt-6 text-gray-600 !text-left">Terletak di Kecamatan Taman, Kabupaten Madiun, Desa Taman Harjo menyimpan potensi luar biasa di bidang pertanian, peternakan, dan UMKM yang menjadi fokus pengembangan kami.</p>
                <div className="mt-8 space-y-6">
                    <FeatureItem icon={Flower} title="Pertanian Modern" description="Peningkatan hasil panen melalui metode yang lebih efisien."/>
                    <FeatureItem icon={Beef} title="Peternakan Berkelanjutan" description="Pengembangan peternakan yang terintegrasi dan ramah lingkungan."/>
                    <FeatureItem icon={Store} title="UMKM Kreatif" description="Pemberdayaan pengrajin lokal dan produsen makanan tradisional."/>
                </div>
            </div>
            <div className="aspect-square bg-slate-100 rounded-2xl relative overflow-hidden">
                <Image src="th.png" alt="Pemandangan Desa" fill className="object-cover"/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        Desa Taman Harjo
                    </h3>
                </div>
            </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <SectionTitle>Mari Berkolaborasi</SectionTitle>
          <SectionSubtitle>Dukungan Anda sangat berarti bagi kemajuan Desa Taman Harjo. Jelajahi lebih dalam atau hubungi kami untuk memulai.</SectionSubtitle>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/program" className="inline-block bg-[#1A5F4D] text-white px-6 py-3 rounded-full font-semibold text-base transition hover:bg-opacity-90 shadow-sm">
                Jelajahi Program
            </Link>
            <Link href="/kontak" className="inline-block bg-white text-gray-700 px-6 py-3 rounded-full font-semibold text-base transition ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                Hubungi Kami
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}