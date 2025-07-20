'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function ProgramsAdminPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('planned')
  const [programs, setPrograms] = useState<any[]>([])
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function fetchPrograms() {
      const { data, error } = await supabase
        .from('programs')
        .select('id, title, description, start_date, end_date, status')
        .order('start_date', { ascending: true })

      if (error) {
        setError(error.message)
        return
      }
      setPrograms(data || [])
    }
    fetchPrograms()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('programs').insert({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      status,
      responsible_person: user.id
    })

    if (error) {
      setError(error.message)
      return
    }

    setTitle('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setStatus('planned')
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus program kerja ini?')) return;
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setPrograms(programs.filter(program => program.id !== id))
  }

  if (!user || user.role !== 'admin') {
    return <div>Akses ditolak</div>
  }

  return (
    <div>
      <h1>Kelola Program Kerja</h1>
      {error && <p>{error}</p>}
      <Link href="/admin/programs/new"><button>Tambah Program</button></Link>
      <h2>Daftar Program</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Judul</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Deskripsi</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tanggal Mulai</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tanggal Selesai</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{program.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{program.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{program.status === 'planned' ? 'Direncanakan' : program.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{program.start_date}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{program.end_date}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <Link href={`/admin/programs/${program.id}/edit`}><button>Edit</button></Link>
                <button onClick={() => handleDelete(program.id)} style={{ marginLeft: 8 }}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
