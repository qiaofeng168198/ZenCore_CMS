// Tenant项目的Mock数据

export const mockTenantInfo = {
  name: '示例租户公司',
  domain: 'example-tenant.com',
  contactName: '张经理',
  contactEmail: 'contact@example-tenant.com',
  contactPhone: '13800138000'
}

export const mockQuotaInfo = {
  currentUsers: 8,
  maxUsers: 20,
  currentStorage: 2147483648, // 2GB
  maxStorage: 10737418240, // 10GB
  currentBandwidth: 5368709120, // 5GB
  maxBandwidth: 107374182400, // 100GB
  currentContents: 156,
  maxContents: 1000
}

export const mockSecuritySettings = {
  twoFactorEnabled: false,
  loginNotification: true
}

export const mockContents = [
  {
    id: 1,
    title: '公司简介',
    type: 'page',
    status: 'published',
    author: '张经理',
    views: 1250,
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-03-15 14:30:00'
  },
  {
    id: 2,
    title: '产品介绍',
    type: 'page',
    status: 'published',
    author: '李助理',
    views: 890,
    createdAt: '2024-02-05 09:15:00',
    updatedAt: '2024-04-20 11:20:00'
  },
  {
    id: 3,
    title: '新闻动态：公司获得融资',
    type: 'article',
    status: 'draft',
    author: '王编辑',
    views: 0,
    createdAt: '2024-11-10 16:00:00',
    updatedAt: '2024-11-10 16:00:00'
  },
  {
    id: 4,
    title: '联系我们',
    type: 'page',
    status: 'published',
    author: '张经理',
    views: 456,
    createdAt: '2024-01-12 11:30:00',
    updatedAt: '2024-05-08 09:00:00'
  }
]

export const mockTemplates = [
  {
    id: 1,
    name: '企业官网模板',
    category: '企业',
    version: '1.2.0',
    isInstalled: true,
    price: 99,
    rating: 4.5,
    downloads: 1560
  },
  {
    id: 2,
    name: '电商商城模板',
    category: '电商',
    version: '2.0.1',
    isInstalled: false,
    price: 149,
    rating: 4.8,
    downloads: 890
  },
  {
    id: 3,
    name: '博客系统模板',
    category: '内容',
    version: '1.0.0',
    isInstalled: false,
    price: 0,
    rating: 4.2,
    downloads: 2340
  }
]

export const mockSubscription = {
  id: 1,
  planName: '专业版',
  status: 'active',
  price: 299,
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  autoRenew: true,
  features: [
    '最多20个用户',
    '10GB存储空间',
    '100GB流量/月',
    '1000个内容',
    '优先技术支持'
  ]
}

export const mockPlans = [
  {
    id: 1,
    name: '基础版',
    price: 99,
    period: 'monthly',
    features: [
      '最多5个用户',
      '2GB存储空间',
      '20GB流量/月',
      '200个内容',
      '邮件支持'
    ],
    recommended: false
  },
  {
    id: 2,
    name: '专业版',
    price: 299,
    period: 'monthly',
    features: [
      '最多20个用户',
      '10GB存储空间',
      '100GB流量/月',
      '1000个内容',
      '优先技术支持'
    ],
    recommended: true
  },
  {
    id: 3,
    name: '企业版',
    price: 599,
    period: 'monthly',
    features: [
      '无限用户',
      '100GB存储空间',
      '无限流量',
      '无限内容',
      '专属客户经理',
      'SLA保障'
    ],
    recommended: false
  }
]
