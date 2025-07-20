'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

export default function UsersPage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, bio, avatar_url')
        .order('name', { ascending: true })

      if (error) {
        setError(error.message)
        return
      }
      setProfiles(data || [])
    }
    fetchProfiles()
  }, [])

  const handleUpdateRole = async (id: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setProfiles(profiles.map(p => p.id === id ? { ...p, role: newRole } : p))
  }

  if (!user || user.role !== 'admin') {
    return <div>Akses ditolak</div>
  }

  return (
    <div>
      <h1>Kelola Pengguna</h1>
      {error && <p>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nama</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Bio</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Avatar</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.role}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profile.bio || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                {profile.avatar_url && (
                  <img src={profile.avatar_url} alt="Avatar" style={{ maxWidth: 40, maxHeight: 40, borderRadius: '50%' }} />
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <select
                  value={profile.role}
                  onChange={(e) => handleUpdateRole(profile.id, e.target.value)}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 
