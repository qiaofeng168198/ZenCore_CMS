import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin } from '@/api/auth'
import type { LoginParams, UserInfo } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const userType = ref<string>('agent')

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    userType.value = info.userType
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  async function login(params: LoginParams) {
    const res = await apiLogin(params)
    setToken(res.accessToken)
    setUserInfo(res.user)
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    userType.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    userType,
    setToken,
    setUserInfo,
    login,
    logout
  }
})
