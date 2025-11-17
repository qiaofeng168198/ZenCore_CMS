export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  email: string
  nickname?: string
  avatar?: string
  userType: string
  tenantId?: number
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserInfo
}
