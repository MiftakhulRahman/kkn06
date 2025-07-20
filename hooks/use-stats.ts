'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useStats() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalDays: 0,
    totalMembers: 10, // Fixed value as requested
    totalPosts: 0,
    totalMedia: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      
      try {
        // Get total programs
        const { count: programsCount } = await supabase
          .from('programs')
          .select('*', { count: 'exact', head: true })

        // Get total posts
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')

        // Get total media
        const { count: mediaCount } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })

        // Calculate days since July 21, 2025
        const startDate = new Date('2025-07-21')
        const today = new Date()
        const daysSinceStart = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

        setStats({
          totalPrograms: programsCount || 0,
          totalDays: daysSinceStart,
          totalMembers: 10, // Fixed value
          totalPosts: postsCount || 0,
          totalMedia: mediaCount || 0
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching stats')
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return { stats, loading, error }
} 