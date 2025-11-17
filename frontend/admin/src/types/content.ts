export interface Content {
  id: number
  tenantId: number
  title: string
  slug: string
  contentType: 'article' | 'page' | 'product'
  status: 'draft' | 'published' | 'archived'
  content: string
  excerpt: string | null
  featuredImage: string | null
  author: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateContentDto {
  title: string
  slug: string
  contentType: 'article' | 'page' | 'product'
  content: string
  excerpt?: string
  featuredImage?: string
}

export interface UpdateContentDto extends Partial<CreateContentDto> {
  status?: 'draft' | 'published' | 'archived'
}

export interface ContentVersion {
  id: number
  contentId: number
  version: number
  title: string
  content: string
  createdBy: number
  createdAt: string
}
