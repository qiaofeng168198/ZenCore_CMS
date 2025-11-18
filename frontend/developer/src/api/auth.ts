import request from './request'
import type { LoginParams, LoginResponse } from '@/types/user'

/**
 * 用户登录
 */
export function login(data: LoginParams) {
  return request<LoginResponse>({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 */
export function register(data: any) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 刷新Token
 */
export function refreshToken(refreshToken: string) {
  return request({
    url: '/auth/refresh',
    method: 'post',
    data: { refreshToken }
  })
}
