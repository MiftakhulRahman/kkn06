'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Program } from '@/lib/types'

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true)
      const { data, error } = await supabase
        .from('programs')
        .select('id, title, description, start_date, end_date, status, responsible_person, created_at')
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setPrograms(data || [])
      setLoading(false)
    }
    fetchPrograms()
  }, [])

  return { programs, loading, error }
} 