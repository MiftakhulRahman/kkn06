// app/admin/page.tsx

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Newspaper, FolderKanban, MessageSquare, Briefcase, Users, ArrowRight, LoaderCircle } from 'lucide-react'

const statsMenu = [
    { name: 'Total Posts', table: 'posts', icon: Newspaper, href: '/admin/posts', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { name: 'Total Kategori', table: 'categories', icon: FolderKanban, href: '/admin/categories', bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
    { name: 'Total Komentar', table: 'comments', icon: MessageSquare, href: '/admin/comments', bgColor: 'bg-sky-100', iconColor: 'text-sky-600' },
    { name: 'Total Program', table: 'programs', icon: Briefcase, href: '/admin/programs', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { name: 'Total Users', table: 'profiles', icon: Users, href: '/admin/users', bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
]

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Record<string, number | null>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const promises = statsMenu.map(item =>
                    supabase
                        .from(item.table)
                        .select('*', { count: 'exact', head: true })
                )
                const results = await Promise.all(promises)
                
                const newStats: Record<string, number | null> = {}
                results.forEach((res, index) => {
                    const tableName = statsMenu[index].table
                    newStats[tableName] = res.count
                })

                setStats(newStats)
            } catch (error) {
                console.error("Error fetching stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])


    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600">Selamat datang kembali! Berikut adalah ringkasan data dari situs Anda.</p>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoaderCircle className="h-12 w-12 animate-spin text-[#1A5F4D]" />
                </div>
            ) : (
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {statsMenu.map((item) => (
                        <div key={item.name} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div>
                                <div className="flex items-start justify-between">
                                    <p className="text-base font-medium text-slate-600">{item.name}</p>
                                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${item.bgColor}`}>
                                        <item.icon className={`h-6 w-6 ${item.iconColor}`} aria-hidden="true" />
                                    </div>
                                </div>
                                <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                                    {stats[item.table] !== null ? stats[item.table] : '-'}
                                </p>
                            </div>
                            <div className="mt-6">
                                <Link href={item.href} className="text-sm font-semibold text-[#1A5F4D] hover:text-[#113e34] flex items-center gap-1">
                                    Lihat Detail
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}