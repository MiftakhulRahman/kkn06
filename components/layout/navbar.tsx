// navbar.tsx (Revisi Efek Hover & Aktif)

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useRef, useState } from "react"
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Profile } from '@/lib/types'
import { Menu, X, LayoutDashboard, User, LogOut } from 'lucide-react'

// Data untuk link navigasi agar mudah dikelola
const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/blog", label: "Blog" },
  { href: "/galeri", label: "Galeri" },
  { href: "/anggota", label: "Anggota" },
  { href: "/program", label: "Program Kerja" },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Efek untuk menutup dropdown & menu saat diklik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efek untuk menutup menu mobile saat navigasi
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  }, [pathname, menuOpen]);
  
  const isAdmin = user && (user as Profile).role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Logo KKN 06" width={32} height={32} />
                <span className="font-bold text-lg text-[#1A5F4D]">KKN 06</span>
              </Link>
            </div>

            {/* =============================================================== */}
            {/* ============= PERUBAHAN UTAMA PADA NAVIGASI DESKTOP =========== */}
            {/* =============================================================== */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      isActive 
                        ? 'font-semibold bg-[#74BC10]/20 text-[#1A5F4D]' 
                        : 'font-medium text-gray-600 hover:text-[#1A5F4D] hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Kontrol Kanan: User atau Tombol Masuk */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                 {user ? (
                   <div className="relative" ref={dropdownRef}>
                     <button onClick={() => setDropdownOpen(v => !v)} className="flex items-center gap-2">
                       <UserAvatar profile={user as Profile} />
                       <span className="text-sm font-medium text-gray-700 hidden sm:inline">{(user as Profile).name?.split(' ')[0]}</span>
                     </button>
                     <AnimatePresence>
                       {dropdownOpen && <UserDropdown user={user as Profile} signOut={signOut} />}
                     </AnimatePresence>
                   </div>
                 ) : (
                   <Link href="/login" className="px-4 py-2 text-sm bg-[#1A5F4D] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                     Masuk
                   </Link>
                 )}
              </div>
              <div className="lg:hidden">
                <button onClick={() => setMenuOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                  <Menu size={24} />
                </button>
              </div>
            </div>

          </div>
        </nav>
      </header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuOpen && <MobileMenu setMenuOpen={setMenuOpen} user={user} isAdmin={isAdmin} signOut={signOut} />}
      </AnimatePresence>
    </>
  );
}

// --- Komponen Terpisah untuk Kebersihan Kode (TIDAK ADA PERUBAHAN DI BAWAH INI) ---

const UserAvatar = ({ profile }: { profile: Profile }) => {
  const [imgError, setImgError] = useState(false);
  const showFallback = !profile.avatar_url || profile.avatar_url.includes('/avatars/') || imgError;
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-sm overflow-hidden border">
      {showFallback ? (
        <span>{initial}</span>
      ) : (
        <Image 
          src={profile.avatar_url!}
          alt={profile.name || 'Avatar'}
          width={32}
          height={32}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  )
}

const UserDropdown = ({ user, signOut }: { user: Profile, signOut: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{ duration: 0.15, ease: "easeOut" }}
    className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 origin-top-right"
  >
    <div className="p-4 border-b">
      <div className="font-semibold text-gray-800">{user.name}</div>
      <div className="text-sm text-gray-500 truncate">{user.email}</div>
    </div>
    <div className="p-2">
      {user.role === 'admin' && (
        <Link href="/admin" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
          <LayoutDashboard size={16} /> Dashboard Admin
        </Link>
      )}
      <Link href="/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
        <User size={16} /> Profil Saya
      </Link>
    </div>
    <div className="border-t p-2">
      <button onClick={signOut} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
        <LogOut size={16} /> Keluar
      </button>
    </div>
  </motion.div>
);

const MobileMenu = ({ setMenuOpen, user, isAdmin, signOut }: { setMenuOpen: (v: boolean) => void, user: any, isAdmin: boolean, signOut: () => void }) => {
  const pathname = usePathname();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={() => setMenuOpen(false)}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-[#1A5F4D]">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`block px-4 py-3 rounded-md text-base font-medium ${pathname === link.href ? 'bg-[#1A5F4D] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="pt-4 mt-4 border-t border-gray-200">
            {user ? (
              <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <UserAvatar profile={user as Profile} />
                    <div>
                       <div className="font-semibold text-gray-800">{(user as Profile).name}</div>
                       <div className="text-sm text-gray-500 capitalize">{(user as Profile).role}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                        <LayoutDashboard size={20} /> Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                      <User size={20} /> Profil Saya
                    </Link>
                    <button onClick={signOut} className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">
                      <LogOut size={20} /> Keluar
                    </button>
                  </div>
              </div>
            ) : (
              <Link href="/login" className="block w-full text-center px-4 py-3 rounded-md text-base font-medium bg-[#1A5F4D] text-white hover:bg-opacity-90">
                Masuk
              </Link>
            )}
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}