'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function ImageUpload({
  onUpload,
}: {
  onUpload: (url: string, filename: string) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) {
      setError('Pilih file terlebih dahulu')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file)

    if (uploadError) {
      setError(uploadError.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)

    onUpload(publicUrl, fileName)
    setFile(null)
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="button" onClick={handleUpload}>Upload</button>
      {error && <p>{error}</p>}
    </div>
  )
}
