'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { LoaderCircle, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccess(message)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle error khusus untuk kredensial yang salah
      if (error.message.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan cek kembali kredensial Anda.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Silakan cek email Anda dan klik link konfirmasi.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    const user = loginData.user
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).single()
      if (!profile) {
        const name = user.email ? user.email.split('@')[0] : ''
        await supabase.from('profiles').insert([
          {
            id: user.id,
            name,
            email: user.email,
            role: 'user'
          },
        ])
        // Redirect ke halaman utama untuk user baru
        router.push('/')
        return
      }
      
      // Redirect berdasarkan role
      if (profile.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Selamat Datang Kembali
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">Silakan masuk untuk melanjutkan</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-xl ring-1 ring-slate-900/10 sm:rounded-2xl sm:px-12">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                Alamat Email
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Icon gembok bisa ditambahkan di sini jika mau, tapi kita fokus ke ikon mata */}
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  // Padding kiri untuk ikon gembok (jika ada), padding kanan untuk ikon mata
                  className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#1A5F4D] sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2 text-right">
                <a
                  href="https://wa.me/6285768959398?text=Halo, saya lupa password akun saya. Mohon bantuannya untuk reset password."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1A5F4D] hover:text-[#113e34] hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-[#1A5F4D] px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#113e34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A5F4D] disabled:opacity-75"
              >
                {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : 'Masuk'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold leading-6 text-[#1A5F4D] hover:text-[#113e34]">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}