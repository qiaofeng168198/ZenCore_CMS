export interface Tenant {
  id: number
  name: string
  slug: string
  domain: string | null
  status: 'active' | 'suspended' | 'expired'
  logo: string | null
  description: string | null
  contactName: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  updatedAt: string
}

export interface CreateTenantDto {
  name: string
  slug: string
  domain?: string
  contactName: string
  contactEmail: string
  contactPhone: string
  description?: string
}

export interface UpdateTenantDto extends Partial<CreateTenantDto> {
  status?: 'active' | 'suspended' | 'expired'
}

export interface TenantQuota {
  id: number
  tenantId: number
  maxUsers: number
  maxStorage: number
  maxBandwidth: number
  usedUsers: number
  usedStorage: number
  usedBandwidth: number
}
