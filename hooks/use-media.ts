'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Media } from '@/lib/types'

export function useMedia() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true)
      console.log('Fetching media...')
      
      const { data, error } = await supabase
        .from('media')
        .select('id, filename, url, alt_text, created_at')
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        console.error('Error fetching media:', error)
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('Media fetched:', data)
      
      // Decode URL jika diperlukan
      const processedMedia = data?.map(item => ({
        ...item,
        url: item.url ? decodeURIComponent(item.url) : item.url
      })) || []

      setMedia(processedMedia)
      setLoading(false)
    }
    fetchMedia()
  }, [])

  return { media, loading, error }
} 