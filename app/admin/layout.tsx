import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Panel - KKN 06 Desa Taman Harjo',
  description: 'Admin Panel untuk mengelola konten website KKN 06 Desa Taman Harjo',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">KKN 06 Desa Taman Harjo</span>
              <Link 
                href="/" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Lihat Website
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            <Link 
              href="/admin" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/posts" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Posts
            </Link>
            <Link 
              href="/admin/categories" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/admin/programs" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Programs
            </Link>
            <Link 
              href="/admin/media" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Media
            </Link>
            <Link 
              href="/admin/users" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Users
            </Link>
            <Link 
              href="/admin/comments" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Comments
            </Link>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © 2024 Admin Panel - KKN 06 Desa Taman Harjo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}