export interface Template {
  id: number
  name: string
  slug: string
  version: string
  description: string | null
  author: string
  previewUrl: string | null
  thumbnailUrl: string | null
  price: number
  status: 'active' | 'inactive' | 'pending'
  downloads: number
  rating: number
  createdAt: string
  updatedAt: string
  installed?: boolean
}

export interface TemplateRating {
  id: number
  templateId: number
  userId: number
  rating: number
  comment: string | null
  createdAt: string
}
