import request from './request'

// 上传图片
export function uploadImage(file: File, useType?: string) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/upload/image',
    method: 'post',
    data: formData,
    params: { useType },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 上传文件
export function uploadFile(file: File, useType?: string) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/upload/file',
    method: 'post',
    data: formData,
    params: { useType },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取文件列表
export function getFiles(useType?: string) {
  return request({
    url: '/upload',
    method: 'get',
    params: { useType },
  })
}

// 删除文件
export function deleteFile(id: number) {
  return request({
    url: `/upload/${id}`,
    method: 'delete',
  })
}
