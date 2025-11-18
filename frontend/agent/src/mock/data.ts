// Agent项目的Mock数据

export const mockCustomers = [
  {
    id: 1,
    name: '北京科技有限公司',
    email: 'contact@beijing-tech.com',
    phone: '13800138001',
    status: 'active',
    subscriptionPlan: '企业版',
    monthlyRevenue: 599,
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '上海创新科技',
    email: 'info@shanghai-innovation.com',
    phone: '13800138002',
    status: 'active',
    subscriptionPlan: '专业版',
    monthlyRevenue: 299,
    createdAt: '2024-02-20 14:20:00'
  },
  {
    id: 3,
    name: '广州数字营销',
    email: 'sales@gz-digital.com',
    phone: '13800138003',
    status: 'suspended',
    subscriptionPlan: '基础版',
    monthlyRevenue: 99,
    createdAt: '2024-03-05 09:15:00'
  },
  {
    id: 4,
    name: '深圳智能系统',
    email: 'admin@sz-smart.com',
    phone: '13800138004',
    status: 'active',
    subscriptionPlan: '专业版',
    monthlyRevenue: 299,
    createdAt: '2024-03-18 16:45:00'
  },
  {
    id: 5,
    name: '杭州电商平台',
    email: 'service@hz-ecommerce.com',
    phone: '13800138005',
    status: 'expired',
    subscriptionPlan: '企业版',
    monthlyRevenue: 0,
    createdAt: '2024-01-08 11:00:00'
  }
]

export const mockCommissionStats = {
  totalCommission: 15680,
  monthlyCommission: 3580,
  withdrawn: 12000,
  available: 3680
}

export const mockCommissions = [
  {
    id: 1,
    type: 'commission',
    customerName: '北京科技有限公司',
    orderAmount: 5990,
    rate: 10,
    amount: 599,
    status: 'settled',
    createdAt: '2024-11-10 14:30:00'
  },
  {
    id: 2,
    type: 'commission',
    customerName: '上海创新科技',
    orderAmount: 2990,
    rate: 10,
    amount: 299,
    status: 'settled',
    createdAt: '2024-11-08 10:20:00'
  },
  {
    id: 3,
    type: 'withdrawal',
    customerName: '-',
    orderAmount: null,
    rate: null,
    amount: 1000,
    status: 'approved',
    createdAt: '2024-11-05 09:00:00'
  },
  {
    id: 4,
    type: 'commission',
    customerName: '深圳智能系统',
    orderAmount: 2990,
    rate: 10,
    amount: 299,
    status: 'pending',
    createdAt: '2024-11-12 16:40:00'
  }
]

export const mockPerformanceStats = {
  newCustomers: 12,
  commissionIncome: 3580,
  renewalRate: 85.5,
  teamSize: 8
}

export const mockRankings = [
  { name: '张三', newCustomers: 5, revenue: 1500, level: '金牌' },
  { name: '李四', newCustomers: 4, revenue: 1200, level: '金牌' },
  { name: '王五', newCustomers: 3, revenue: 900, level: '银牌' },
  { name: '赵六', newCustomers: 2, revenue: 600, level: '铜牌' },
  { name: '钱七', newCustomers: 1, revenue: 300, level: '铜牌' }
]

export const mockTeamMembers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    role: 'leader',
    customers: 15,
    monthlyRevenue: 4500,
    status: 'active',
    joinedAt: '2024-01-10 09:00:00'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    role: 'member',
    customers: 10,
    monthlyRevenue: 3000,
    status: 'active',
    joinedAt: '2024-02-15 10:30:00'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    role: 'member',
    customers: 8,
    monthlyRevenue: 2400,
    status: 'active',
    joinedAt: '2024-03-20 14:00:00'
  }
]
