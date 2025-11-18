// Developer项目的Mock数据

export const mockTemplates = [
  {
    id: 1,
    name: '企业官网模板',
    category: '企业',
    version: '1.2.0',
    downloads: 156,
    rating: 4.5,
    revenue: 4680,
    status: 'published',
    createdAt: '2024-01-10 10:00:00'
  },
  {
    id: 2,
    name: '电商商城模板',
    category: '电商',
    version: '2.0.1',
    downloads: 89,
    rating: 4.8,
    revenue: 2670,
    status: 'published',
    createdAt: '2024-03-15 14:30:00'
  },
  {
    id: 3,
    name: '博客系统模板',
    category: '内容',
    version: '1.0.0',
    downloads: 45,
    rating: 4.2,
    revenue: 1350,
    status: 'published',
    createdAt: '2024-05-20 09:00:00'
  },
  {
    id: 4,
    name: '在线教育模板',
    category: '教育',
    version: '0.9.0',
    downloads: 0,
    rating: 0,
    revenue: 0,
    status: 'pending',
    createdAt: '2024-11-10 16:00:00'
  }
]

export const mockRevenueStats = {
  totalRevenue: 8700,
  monthlyRevenue: 1280,
  withdrawn: 7000,
  pending: 1700
}

export const mockRevenueList = [
  {
    id: 1,
    templateName: '企业官网模板',
    type: 'download',
    quantity: 5,
    price: 99,
    amount: 495,
    status: 'settled',
    createdAt: '2024-11-10 14:20:00'
  },
  {
    id: 2,
    templateName: '电商商城模板',
    type: 'download',
    quantity: 3,
    price: 149,
    amount: 447,
    status: 'settled',
    createdAt: '2024-11-08 10:15:00'
  },
  {
    id: 3,
    templateName: '企业官网模板',
    type: 'subscription',
    quantity: 2,
    price: 29,
    amount: 58,
    status: 'pending',
    createdAt: '2024-11-12 09:30:00'
  }
]

export const mockReviews = [
  {
    id: 1,
    userName: '张先生',
    userAvatar: '',
    rating: 5,
    templateName: '企业官网模板',
    comment: '非常好用的模板，设计精美，功能完善，技术支持也很到位！',
    reply: '感谢您的支持！我们会继续努力提供更好的模板和服务。',
    createdAt: '2024-11-10 15:30:00'
  },
  {
    id: 2,
    userName: '李女士',
    userAvatar: '',
    rating: 4,
    templateName: '企业官网模板',
    comment: '整体不错，希望能增加更多自定义选项，比如颜色主题切换。',
    reply: null,
    createdAt: '2024-11-08 10:20:00'
  },
  {
    id: 3,
    userName: '王总',
    userAvatar: '',
    rating: 5,
    templateName: '电商商城模板',
    comment: '功能非常强大，集成了支付、物流等模块，省了很多开发时间。',
    reply: '感谢您的认可！如有任何问题欢迎随时联系我们。',
    createdAt: '2024-11-06 14:10:00'
  },
  {
    id: 4,
    userName: '赵经理',
    userAvatar: '',
    rating: 3,
    templateName: '博客系统模板',
    comment: '基础功能可以，但文档不够详细，上手有点困难。',
    reply: null,
    createdAt: '2024-11-04 09:45:00'
  }
]
