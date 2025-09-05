<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">系统概览</h1>
      <p class="text-base-content/70">恶意登录异常检测系统实时监控面板</p>
    </div>

    <!-- 实时统计面板 -->
    <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- 今日检测次数 -->
      <div class="stats shadow-lg bg-primary text-primary-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-primary-content/80">今日检测次数</div>
          <div class="stat-value">{{ todayDetections }}</div>
          <div class="stat-desc text-primary-content/60">比昨日 {{ detectionTrend >= 0 ? '+' : '' }}{{ detectionTrend }}%</div>
        </div>
      </div>

      <!-- 异常登录数 -->
      <div class="stats shadow-lg bg-error text-error-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
          <div class="stat-title text-error-content/80">异常登录数</div>
          <div class="stat-value">{{ abnormalLogins }}</div>
          <div class="stat-desc text-error-content/60">比昨日 {{ maliciousTrend >= 0 ? '+' : '' }}{{ maliciousTrend }}%</div>
        </div>
      </div>

      <!-- 威胁IP数量 -->
      <div class="stats shadow-lg bg-warning text-warning-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-warning-content/80">威胁IP数量</div>
          <div class="stat-value">{{ threatIPs }}</div>
          <div class="stat-desc text-warning-content/60">比昨日 {{ threatTrend >= 0 ? '+' : '' }}{{ threatTrend }}%</div>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="stats shadow-lg bg-success text-success-content">
        <div class="stat">
          <div class="stat-figure">
            <div class="avatar online">
              <div class="w-16 rounded-full">
                <div class="w-full h-full bg-success-content/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="w-8 h-8 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="stat-title text-success-content/80">系统状态</div>
          <div class="stat-value text-lg">运行中</div>
          <div class="stat-desc text-success-content/60">运行时间: {{ uptime }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 系统概览 -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title text-xl">系统概览</h2>
              <div class="badge badge-info">实时数据</div>
            </div>

            <div class="space-y-4">
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">今日检测趋势</div>
                  <div class="stat-value text-lg">{{ detectionTrend }}%</div>
                  <div class="stat-desc" :class="detectionTrend >= 0 ? 'text-success' : 'text-error'">
                    <span v-if="detectionTrend >= 0">↗</span>
                    <span v-else>↘</span>
                    相比昨日
                  </div>
                </div>
              </div>
              
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">恶意登录趋势</div>
                  <div class="stat-value text-lg">{{ maliciousTrend }}%</div>
                  <div class="stat-desc" :class="maliciousTrend >= 0 ? 'text-success' : 'text-error'">
                    <span v-if="maliciousTrend >= 0">↗</span>
                    <span v-else>↘</span>
                    相比昨日
                  </div>
                </div>
              </div>
              
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">威胁趋势</div>
                  <div class="stat-value text-lg">{{ threatTrend }}%</div>
                  <div class="stat-desc" :class="threatTrend >= 0 ? 'text-success' : 'text-error'">
                    <span v-if="threatTrend >= 0">↗</span>
                    <span v-else>↘</span>
                    相比昨日
                  </div>
                </div>
              </div>
            </div>

            <div class="card-actions justify-end mt-4">
              <button class="btn btn-outline btn-sm">查看更多统计</button>
            </div>
          </div>
        </div>

        <!-- 最近检测历史 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title text-xl">最近检测历史</h2>
              <div class="badge badge-primary">{{ (recentDetections && recentDetections.length) || 0 }} 条记录</div>
            </div>

            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="detection in recentDetections" :key="detection.id" 
                class="alert shadow-sm hover:shadow-md transition-shadow" 
                :class="{
                  'alert-error': detection.is_malicious,
                  'alert-warning': !detection.is_malicious && detection.risk_level === 'high',
                  'alert-info': !detection.is_malicious && detection.risk_level === 'medium',
                  'alert-success': !detection.is_malicious && detection.risk_level === 'low'
                }">
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold">{{ detection.ip_address }}</h3>
                      <p class="text-sm opacity-80">用户: {{ detection.username }}</p>
                      <p class="text-xs opacity-60 mt-1">{{ detection.location || '未知位置' }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-xs opacity-60">{{ formatTime(detection.created_at) }}</div>
                      <div class="badge badge-sm mt-1" :class="{
                        'badge-error': detection.is_malicious,
                        'badge-warning': !detection.is_malicious && detection.risk_level === 'high',
                        'badge-info': !detection.is_malicious && detection.risk_level === 'medium',
                        'badge-success': !detection.is_malicious && detection.risk_level === 'low'
                      }">
                        {{ detection.is_malicious ? '恶意登录' : detection.risk_level_display }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!recentDetections || recentDetections.length === 0" class="text-center py-8 text-gray-500">
                暂无检测记录
              </div>
            </div>

            <div class="card-actions justify-end mt-4">
              <button class="btn btn-outline btn-sm">查看全部记录</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作入口 -->
      <div class="space-y-6">
        <!-- 检测控制 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">检测控制</h2>
            <div class="space-y-3">
              <button class="btn btn-primary w-full" :class="{ 'btn-success': isDetecting }" @click="toggleDetection">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="w-5 h-5 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="isDetecting ? 'M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z' : 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'">
                  </path>
                </svg>
                {{ isDetecting ? '停止检测' : '开始检测' }}
              </button>

              <div class="divider my-2"></div>

              <div class="text-sm space-y-2">
                <div class="flex justify-between">
                  <span class="opacity-70">检测间隔:</span>
                  <span class="font-medium">{{ detectionInterval }}秒</span>
                </div>
                <div class="flex justify-between">
                  <span class="opacity-70">敏感度:</span>
                  <span class="font-medium">{{ sensitivity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">快速操作</h2>
            <div class="space-y-2">
              <button class="btn btn-outline w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="w-5 h-5 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                  </path>
                </svg>
                查看分析报告
              </button>

              <button class="btn btn-outline w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="w-5 h-5 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-5 5v-5zM4 1h5v5H4V1zm0 7h5v5H4V8zm7-7h5v5h-5V1zm0 7h5v5h-5V8z"></path>
                </svg>
                配置通知设置
              </button>

              <button class="btn btn-outline w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="w-5 h-5 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                历史记录查询
              </button>
            </div>
          </div>
        </div>

        <!-- 系统信息 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">系统信息</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="opacity-70">版本:</span>
                <span class="font-medium">v2.1.0</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">最后更新:</span>
                <span class="font-medium">{{ lastUpdate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">数据库状态:</span>
                <span class="text-success font-medium">正常</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getDashboard, getDetectionRecords } from '@/api/PagesApis'
import type { DashboardResponse, DetectionRecordsResponse, DetectionRecord } from '@/types/apis/PagesApis_T'
import { ElMessage } from 'element-plus'

// 响应式数据
const todayDetections = ref(0)
const abnormalLogins = ref(0)
const threatIPs = ref(0)
const uptime = ref('')
const isDetecting = ref(true)
const detectionInterval = ref(30)
const sensitivity = ref('中')
const lastUpdate = ref('')
const detectionTrend = ref(0)
const maliciousTrend = ref(0)
const threatTrend = ref(0)
const loading = ref(false)
const recentDetections = ref<DetectionRecord[]>([])

// 切换检测状态
const toggleDetection = () => {
  isDetecting.value = !isDetecting.value
}

// 获取仪表板数据
const fetchDashboardData = async () => {
  const response: DashboardResponse = await getDashboard()
  
  console.log('获取仪表板数据响应:', response) // 添加调试日志
  
  if (response.code === 200 && response.data) {
    todayDetections.value = response.data.today_detections
    abnormalLogins.value = response.data.today_malicious
    threatIPs.value = response.data.today_threat_ips
    uptime.value = `${response.data.uptime_days}天`
    detectionTrend.value = response.data.detection_trend
    maliciousTrend.value = response.data.malicious_trend
    threatTrend.value = response.data.threat_trend
    lastUpdate.value = new Date().toLocaleDateString()
    console.log('仪表板数据:', response.data) // 添加调试日志
  } else {
    ElMessage.error(response.msg || '获取数据失败')
  }
  return response
}

// 获取最近检测记录
const fetchRecentDetections = async () => {
  try {
    const response: DetectionRecordsResponse = await getDetectionRecords({
      page: 1,
      page_size: 5
    })
    
    console.log('获取检测记录响应:', response) // 添加调试日志
    
    if (response.code === 200 && response.data) {
      // 由于API返回的记录按创建时间倒序排列，我们直接使用结果
      recentDetections.value = response.data
      console.log('检测记录数据:', response.data) // 添加调试日志
    } else {
      ElMessage.error(response.msg || '获取检测记录失败')
      // 确保recentDetections是一个空数组而不是undefined
      recentDetections.value = []
    }
  } catch (error) {
    ElMessage.error('获取检测记录失败')
    console.error('获取检测记录失败:', error)
    // 确保recentDetections是一个空数组而不是undefined
    recentDetections.value = []
  }
}

// 格式化时间显示
const formatTime = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now.getTime() - time.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
}

// 获取所有数据
const fetchAllData = async () => {
  try {
    loading.value = true
    await Promise.all([
      fetchDashboardData(),
      fetchRecentDetections()
    ])
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 定时更新数据
let updateInterval: number

onMounted(() => {
  // 初始加载数据
  fetchAllData()
  
  // 每30秒更新一次数据
  updateInterval = setInterval(() => {
    fetchAllData()
  }, 30000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.alert {
  @apply border-l-4;
}

.alert-error {
  @apply border-l-error bg-error/10;
}

.alert-warning {
  @apply border-l-warning bg-warning/10;
}

.alert-info {
  @apply border-l-info bg-info/10;
}

.stats {
  @apply rounded-2xl;
}

.card {
  @apply rounded-2xl;
}
</style>