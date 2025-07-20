// footer.tsx (Versi Profesional dengan Layout Penuh)

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Youtube } from 'lucide-react'

// Data untuk link footer agar mudah dikelola
const quickLinks = [
  { href: "/blog", label: "Blog & Berita" },
  { href: "/galeri", label: "Galeri Kegiatan" },
  { href: "/anggota", label: "Tim Kami" },
  { href: "/program", label: "Program Kerja" },
];

const resourcesLinks = [
  { href: "/profil-desa", label: "Profil Desa" },
  { href: "/kontak", label: "Hubungi Kami" },
  { href: "/faq", label: "Tanya Jawab (FAQ)" },
];

const socialLinks = [
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
];


export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A5F4D] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {/* MENGUBAH STRUKTUR GRID DI SINI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Bagian Logo dan Deskripsi (Mengambil 2 kolom di layar besar) */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-md">
                   <Image src="/logo.png" alt="Logo KKN 06" width={32} height={32} />
                </div>
                <span className="font-bold text-xl">KKN 06 DESA TAMAN HARJO</span>
              </Link>
              <p className="text-gray-300 text-base max-w-md">
                Mengabdi untuk negeri, membangun Desa Taman Harjo menuju kemandirian dan kesejahteraan masyarakat.
              </p>
              <div className="flex space-x-6 pt-2">
                {socialLinks.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <span className="sr-only">{social.label}</span>
                    <social.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tautan Cepat */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Tautan Cepat</h3>
            <ul className="mt-4 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sumber Daya */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Sumber Daya</h3>
            <ul className="mt-4 space-y-4">
              {resourcesLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-base text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bagian Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {currentYear} KKN 06 Desa Taman Harjo. Semua Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}