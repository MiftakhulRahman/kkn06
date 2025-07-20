'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/types'

export function useMembers() {
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, bio, avatar_url, created_at')
        .eq('role', 'member')
        .order('created_at', { ascending: true })
        .limit(6)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setMembers(data || [])
      setLoading(false)
    }
    fetchMembers()
  }, [])

  return { members, loading, error }
} 