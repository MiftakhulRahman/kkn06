'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, signOut } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser()
        if (mounted) {
          setUser(currentUser)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        try {
          if (event === 'SIGNED_IN') {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
        }
      }
    )

    return () => {
      mounted = false
      authListener.subscription?.unsubscribe()
    }
  }, [])

  return { user, loading, signOut }
}
