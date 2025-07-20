'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<any[]>([])
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('id, post_id, author_name, content, status, created_at, posts(title)')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }
      setComments(data || [])
    }
    fetchComments()
  }, [])

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .update({ status: 'approved' })
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c))
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setComments(comments.filter(c => c.id !== id))
  }

  if (!user || (user as any).role !== 'admin') {
    return <div>Akses ditolak</div>
  }

  return (
    <div>
      <h1>Kelola Komentar</h1>
      {error && <p>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Post</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Penulis</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Komentar</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tanggal</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{comment.posts?.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{comment.author_name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{comment.content}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{comment.status}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{new Date(comment.created_at).toLocaleString()}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {comment.status === 'pending' && (
                  <button onClick={() => handleApprove(comment.id)}>Setujui</button>
                )}
                <button onClick={() => handleDelete(comment.id)} style={{ marginLeft: 8 }}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
