import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
} 