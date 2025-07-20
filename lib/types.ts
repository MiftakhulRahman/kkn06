export interface Profile {
  id: string
  name: string
  email: string
  role: 'member' | 'admin'
  bio?: string
  avatar_url?: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  featured_image?: string
  category?: string
  status: 'draft' | 'published'
  author_id: string
  created_at: string
  updated_at: string
  profiles?: { name: string }
}

export interface Media {
  id: string
  filename: string
  url: string
  alt_text?: string
  category?: string
  uploaded_by: string
  created_at: string
}

export interface Program {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  status: 'planned' | 'ongoing' | 'completed'
  responsible_person: string
  created_at: string
  profiles?: { name: string }
}

export interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email?: string
  content: string
  status: 'pending' | 'approved'
  created_at: string
}
