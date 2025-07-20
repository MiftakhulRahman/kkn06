'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, CheckCircle, Hourglass, ListTodo, LoaderCircle } from 'lucide-react'

// Fungsi untuk format tanggal
function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Fungsi untuk mendapatkan detail status
function getStatusDetails(status: string) {
  switch (status) {
    case 'ongoing':
      return {
        text: 'Berlangsung',
        icon: <Hourglass className="h-4 w-4" />,
        className: 'bg-amber-100 text-amber-800',
      }
    case 'completed':
      return {
        text: 'Selesai',
        icon: <CheckCircle className="h-4 w-4" />,
        className: 'bg-emerald-100 text-emerald-800',
      }
    case 'planned':
    default:
      return {
        text: 'Direncanakan',
        icon: <ListTodo className="h-4 w-4" />,
        className: 'bg-slate-200 text-slate-800',
      }
  }
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true)
      const { data } = await supabase
        .from('programs')
        .select('id, title, description, start_date, end_date, status, profiles(name)')
        .order('start_date', { ascending: true })
      setPrograms(data || [])
      setLoading(false)
    }
    fetchPrograms()
  }, [])

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Halaman */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Program Kerja</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Berikut adalah daftar lengkap program kerja yang telah kami rencanakan dan laksanakan. Setiap program dirancang untuk memberikan dampak positif bagi masyarakat Desa Taman Harjo.
          </p>
        </div>

        {/* Daftar Program Kerja */}
        <div className="mt-16">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoaderCircle className="h-10 w-10 animate-spin text-[#1A5F4D]" />
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-slate-200">
              <ListTodo className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-xl font-semibold text-slate-800">Belum Ada Program Kerja</h3>
              <p className="mt-1 text-base text-slate-500">Saat ini belum ada program kerja yang ditambahkan.</p>
            </div>
          ) : (
            // --- INI BAGIAN YANG DIUBAH MENJADI GRID 4 KOLOM ---
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((program) => {
                const statusDetails = getStatusDetails(program.status)
                return (
                  // Kartu Program yang Lebih Kecil
                  <div
                    key={program.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex-1 p-6">
                      {/* Badge Status di atas */}
                      <span
                        className={`mb-4 inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusDetails.className}`}
                      >
                        {statusDetails.icon}
                        {statusDetails.text}
                      </span>
                      {/* Judul dan Deskripsi */}
                      <h3 className="text-xl font-bold text-slate-900">{program.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{program.description}</p>
                    </div>
                    {/* Meta Info Tanggal di bawah */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 flex-shrink-0 text-slate-500" />
                        <div className="text-xs text-slate-600">
                          <p>
                            <span className="font-semibold">Mulai:</span> {formatDate(program.start_date)}
                          </p>
                          <p>
                            <span className="font-semibold">Selesai:</span> {formatDate(program.end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}