import serviceAxios from '@/http'

import { type dashboardResponse } from '@/types/apis/admin/common'

export function getDashboard() {
  return serviceAxios<dashboardResponse>({
    url: '/admin/dashboard/',
    method: 'get',
  })
}