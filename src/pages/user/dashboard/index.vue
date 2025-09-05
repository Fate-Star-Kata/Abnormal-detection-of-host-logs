<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">系统概览</h1>
      <p class="text-base-content/70">恶意登录异常检测系统实时监控面板</p>
    </div>

    <!-- 实时统计面板 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div class="stat-desc text-primary-content/60">比昨日 +12%</div>
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
          <div class="stat-desc text-error-content/60">需要关注</div>
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
          <div class="stat-desc text-warning-content/60">已拦截</div>
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
      <!-- 最近警报列表 -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title text-xl">最近警报</h2>
              <div class="badge badge-error">{{ recentAlerts.length }} 条未处理</div>
            </div>

            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="alert in recentAlerts" :key="alert.id"
                class="alert shadow-sm hover:shadow-md transition-shadow cursor-pointer" :class="{
                  'alert-error': alert.level === 'high',
                  'alert-warning': alert.level === 'medium',
                  'alert-info': alert.level === 'low'
                }">
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold">{{ alert.type }}</h3>
                      <p class="text-sm opacity-80">{{ alert.description }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-xs opacity-60">{{ alert.time }}</div>
                      <div class="badge badge-sm mt-1" :class="{
                        'badge-error': alert.level === 'high',
                        'badge-warning': alert.level === 'medium',
                        'badge-info': alert.level === 'low'
                      }">
                        {{ alert.level === 'high' ? '高危' : alert.level === 'medium' ? '中危' : '低危' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-actions justify-end mt-4">
              <button class="btn btn-outline btn-sm">查看全部</button>
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

// 响应式数据
const todayDetections = ref(1247)
const abnormalLogins = ref(23)
const threatIPs = ref(156)
const uptime = ref('7天 12小时')
const isDetecting = ref(true)
const detectionInterval = ref(30)
const sensitivity = ref('中')
const lastUpdate = ref('2024-01-15')

// 最近警报数据
const recentAlerts = ref([
  {
    id: 1,
    type: '暴力破解检测',
    description: 'IP 192.168.1.100 在5分钟内尝试登录失败15次',
    time: '2分钟前',
    level: 'high'
  },
  {
    id: 2,
    type: '异常时间登录',
    description: '用户admin在凌晨3:24登录系统',
    time: '15分钟前',
    level: 'medium'
  },
  {
    id: 3,
    type: '新IP检测',
    description: '检测到来自新IP地址的登录尝试',
    time: '32分钟前',
    level: 'low'
  },
  {
    id: 4,
    type: '地理位置异常',
    description: '用户从异常地理位置登录',
    time: '1小时前',
    level: 'medium'
  },
  {
    id: 5,
    type: '暴力破解检测',
    description: 'IP 10.0.0.50 疑似进行密码暴力破解',
    time: '2小时前',
    level: 'high'
  }
])

// 切换检测状态
const toggleDetection = () => {
  isDetecting.value = !isDetecting.value
}

// 定时更新数据
let updateInterval: number

onMounted(() => {
  // 每30秒更新一次数据
  updateInterval = setInterval(() => {
    // 模拟数据更新
    todayDetections.value += Math.floor(Math.random() * 3)
    if (Math.random() > 0.8) {
      abnormalLogins.value += 1
    }
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