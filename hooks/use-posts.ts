'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/lib/types'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      console.log('Fetching posts...')
      
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, content, slug, created_at, status, featured_image')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('Posts fetched:', data)
      
      // Decode URL jika diperlukan
      const processedPosts = data?.map(post => ({
        ...post,
        featured_image: post.featured_image ? decodeURIComponent(post.featured_image) : post.featured_image
      })) || []

      setPosts(processedPosts)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return { posts, loading, error }
}
