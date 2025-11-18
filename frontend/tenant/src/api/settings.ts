import request from './request'

// 获取租户基本信息
export function getTenantInfo() {
  return request({
    url: '/tenant/settings/info',
    method: 'get'
  })
}

// 更新租户基本信息
export function updateTenantInfo(data: any) {
  return request({
    url: '/tenant/settings/info',
    method: 'put',
    data
  })
}

// 获取配额信息
export function getQuotaInfo() {
  return request({
    url: '/tenant/settings/quota',
    method: 'get'
  })
}

// 修改密码
export function changePassword(data: any) {
  return request({
    url: '/tenant/settings/password',
    method: 'post',
    data
  })
}

// 获取安全设置
export function getSecuritySettings() {
  return request({
    url: '/tenant/settings/security',
    method: 'get'
  })
}

// 更新安全设置
export function updateSecuritySettings(data: any) {
  return request({
    url: '/tenant/settings/security',
    method: 'put',
    data
  })
}

// 切换双因素认证
export function toggle2FA(enabled: boolean) {
  return request({
    url: '/tenant/settings/2fa',
    method: 'post',
    data: { enabled }
  })
}

// 切换登录通知
export function toggleLoginNotification(enabled: boolean) {
  return request({
    url: '/tenant/settings/login-notification',
    method: 'post',
    data: { enabled }
  })
}
