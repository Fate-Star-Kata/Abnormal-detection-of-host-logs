<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">异常检测</h1>
      <p class="text-base-content/70">实时监控登录异常行为，保护系统安全</p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 检测控制面板 -->
      <div class="xl:col-span-1 space-y-6">
        <!-- 检测状态卡片 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">检测控制</h2>

            <!-- 状态指示器 -->
            <div class="flex items-center justify-center mb-6">
              <div class="relative">
                <div class="w-32 h-32 rounded-full border-8 flex items-center justify-center" :class="{
                  'border-success bg-success/10': detectionStatus === 'running',
                  'border-error bg-error/10': detectionStatus === 'stopped',
                  'border-warning bg-warning/10': detectionStatus === 'paused'
                }">
                  <div class="text-center">
                    <div class="text-2xl font-bold" :class="{
                      'text-success': detectionStatus === 'running',
                      'text-error': detectionStatus === 'stopped',
                      'text-warning': detectionStatus === 'paused'
                    }">
                      {{ statusText }}
                    </div>
                    <div class="text-sm opacity-70">{{ statusDescription }}</div>
                  </div>
                </div>
                <!-- 运行中的动画效果 -->
                <div v-if="detectionStatus === 'running'"
                  class="absolute inset-0 rounded-full border-4 border-success animate-ping opacity-20"></div>
              </div>
            </div>

            <!-- 控制按钮 -->
            <div class="space-y-3">
              <button class="btn btn-success w-full" :disabled="detectionStatus === 'running'" @click="startDetection">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="w-5 h-5 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                  </path>
                </svg>
                开始检测
              </button>

              <div class="flex gap-2">
                <button class="btn btn-warning flex-1" :disabled="detectionStatus !== 'running'"
                  @click="pauseDetection">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="w-4 h-4 mr-1 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path>
                  </svg>
                  暂停
                </button>

                <button class="btn btn-error flex-1" :disabled="detectionStatus === 'stopped'" @click="stopDetection">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="w-4 h-4 mr-1 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  停止
                </button>
              </div>
            </div>

            <!-- 检测进度 -->
            <div class="mt-6">
              <div class="flex justify-between text-sm mb-2">
                <span>检测进度</span>
                <span>{{ detectionProgress }}%</span>
              </div>
              <progress class="progress progress-primary w-full" :value="detectionProgress" max="100"></progress>
            </div>
          </div>
        </div>

        <!-- 检测配置 -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">检测配置</h2>

            <!-- 检测间隔 -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">检测间隔 (秒)</span>
                <span class="label-text-alt">{{ detectionInterval }}s</span>
              </label>
              <input type="range" min="10" max="300" v-model="detectionInterval" class="range range-primary"
                step="10" />
              <div class="w-full flex justify-between text-xs px-2 mt-1">
                <span>10s</span>
                <span>150s</span>
                <span>300s</span>
              </div>
            </div>

            <!-- 敏感度级别 -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">敏感度级别</span>
              </label>
              <div class="join w-full">
                <input class="join-item btn" type="radio" name="sensitivity" aria-label="低" v-model="sensitivity"
                  value="low" />
                <input class="join-item btn" type="radio" name="sensitivity" aria-label="中" v-model="sensitivity"
                  value="medium" />
                <input class="join-item btn" type="radio" name="sensitivity" aria-label="高" v-model="sensitivity"
                  value="high" />
              </div>
            </div>

            <!-- 日志文件路径 -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text font-medium">日志文件路径</span>
              </label>
              <div class="join w-full">
                <input type="text" v-model="logFilePath" class="input input-bordered join-item flex-1"
                  placeholder="/var/log/auth.log" />
                <button class="btn btn-outline join-item">浏览</button>
              </div>
            </div>

            <!-- 检测规则开关 -->
            <div class="space-y-3">
              <h3 class="font-medium text-base">检测规则</h3>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">暴力破解检测</span>
                  <input type="checkbox" v-model="rules.bruteForce" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">异常时间检测</span>
                  <input type="checkbox" v-model="rules.abnormalTime" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">新IP检测</span>
                  <input type="checkbox" v-model="rules.newIP" class="toggle toggle-primary" />
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">地理位置异常</span>
                  <input type="checkbox" v-model="rules.geoAnomaly" class="toggle toggle-primary" />
                </label>
              </div>
            </div>

            <div class="card-actions justify-end mt-6">
              <button class="btn btn-primary" @click="saveConfig">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="w-4 h-4 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12">
                  </path>
                </svg>
                保存配置
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时检测结果 -->
      <div class="xl:col-span-2">
        <div class="card bg-base-100 shadow-xl h-full">
          <div class="card-body">
            <div class="flex justify-between items-center mb-6">
              <h2 class="card-title text-xl">实时检测结果</h2>
              <div class="flex items-center gap-4">
                <div class="badge badge-primary">实时更新</div>
                <button class="btn btn-ghost btn-sm" @click="clearResults">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="w-4 h-4 mr-1 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                  </svg>
                  清空
                </button>
              </div>
            </div>

            <!-- 检测结果列表 -->
            <div class="space-y-4 max-h-[600px] overflow-y-auto">
              <div v-if="detectionResults.length === 0" class="text-center py-12">
                <div class="text-6xl opacity-20 mb-4">🔍</div>
                <p class="text-base-content/60">暂无检测结果</p>
                <p class="text-sm text-base-content/40 mt-2">启动检测后，异常事件将在此显示</p>
              </div>

              <div v-for="result in detectionResults" :key="result.id"
                class="card bg-base-200 shadow-sm hover:shadow-md transition-all duration-200" :class="{
                  'border-l-4 border-l-error': result.riskLevel === 'high',
                  'border-l-4 border-l-warning': result.riskLevel === 'medium',
                  'border-l-4 border-l-info': result.riskLevel === 'low'
                }">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                        <div class="w-10 h-10 rounded-full text-xs" :class="{
                          'bg-error text-error-content': result.riskLevel === 'high',
                          'bg-warning text-warning-content': result.riskLevel === 'medium',
                          'bg-info text-info-content': result.riskLevel === 'low'
                        }">
                          {{ result.type.charAt(0) }}
                        </div>
                      </div>
                      <div>
                        <h3 class="font-semibold text-base">{{ result.type }}</h3>
                        <p class="text-sm opacity-70">{{ result.timestamp }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="badge badge-sm" :class="{
                        'badge-error': result.riskLevel === 'high',
                        'badge-warning': result.riskLevel === 'medium',
                        'badge-info': result.riskLevel === 'low'
                      }">
                        {{ result.riskLevel === 'high' ? '高危' : result.riskLevel === 'medium' ? '中危' : '低危' }}
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2 text-sm">
                    <p><strong>描述:</strong> {{ result.description }}</p>
                    <p><strong>来源IP:</strong> <code class="bg-base-300 px-2 py-1 rounded">{{ result.sourceIP }}</code>
                    </p>
                    <p v-if="result.username"><strong>用户名:</strong> {{ result.username }}</p>
                    <p v-if="result.location"><strong>地理位置:</strong> {{ result.location }}</p>
                  </div>

                  <!-- 处理建议 -->
                  <div v-if="result.suggestion" class="mt-3 p-3 bg-base-100 rounded-lg">
                    <h4 class="font-medium text-sm mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="w-4 h-4 mr-1 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                        </path>
                      </svg>
                      处理建议
                    </h4>
                    <p class="text-sm opacity-80">{{ result.suggestion }}</p>
                  </div>

                  <div class="card-actions justify-end mt-4">
                    <button class="btn btn-ghost btn-xs">查看详情</button>
                    <button class="btn btn-primary btn-xs">标记已处理</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 检测状态
const detectionStatus = ref<'running' | 'stopped' | 'paused'>('stopped')
const detectionProgress = ref(0)

// 配置参数
const detectionInterval = ref(30)
const sensitivity = ref('medium')
const logFilePath = ref('/var/log/auth.log')

// 检测规则
const rules = ref({
  bruteForce: true,
  abnormalTime: true,
  newIP: true,
  geoAnomaly: false
})

// 检测结果
const detectionResults = ref<Array<{
  id: number
  type: string
  description: string
  sourceIP: string
  username?: string
  location?: string
  riskLevel: 'high' | 'medium' | 'low'
  timestamp: string
  suggestion?: string
}>>([])

// 计算属性
const statusText = computed(() => {
  switch (detectionStatus.value) {
    case 'running': return '运行中'
    case 'paused': return '已暂停'
    case 'stopped': return '已停止'
    default: return '未知'
  }
})

const statusDescription = computed(() => {
  switch (detectionStatus.value) {
    case 'running': return '正在监控'
    case 'paused': return '检测暂停'
    case 'stopped': return '检测停止'
    default: return ''
  }
})

// 控制方法
const startDetection = () => {
  detectionStatus.value = 'running'
  detectionProgress.value = 0
  // 模拟检测进度
  const progressInterval = setInterval(() => {
    if (detectionProgress.value < 100 && detectionStatus.value === 'running') {
      detectionProgress.value += Math.random() * 10
    } else {
      clearInterval(progressInterval)
      if (detectionStatus.value === 'running') {
        detectionProgress.value = 100
      }
    }
  }, 1000)
}

const pauseDetection = () => {
  detectionStatus.value = 'paused'
}

const stopDetection = () => {
  detectionStatus.value = 'stopped'
  detectionProgress.value = 0
}

const saveConfig = () => {
  // 保存配置逻辑
  console.log('配置已保存', {
    detectionInterval: detectionInterval.value,
    sensitivity: sensitivity.value,
    logFilePath: logFilePath.value,
    rules: rules.value
  })
}

const clearResults = () => {
  detectionResults.value = []
}

// 模拟检测结果
const simulateDetection = () => {
  if (detectionStatus.value !== 'running') return

  const mockResults = [
    {
      type: '暴力破解检测',
      description: 'IP地址在短时间内多次登录失败',
      sourceIP: '192.168.1.100',
      username: 'admin',
      riskLevel: 'high' as const,
      suggestion: '建议立即封禁该IP地址，并检查系统日志'
    },
    {
      type: '异常时间登录',
      description: '在非工作时间检测到登录行为',
      sourceIP: '10.0.0.50',
      username: 'user123',
      location: '北京市',
      riskLevel: 'medium' as const,
      suggestion: '验证用户身份，确认是否为正常登录'
    },
    {
      type: '新IP检测',
      description: '检测到来自新IP地址的登录尝试',
      sourceIP: '203.0.113.45',
      location: '上海市',
      riskLevel: 'low' as const,
      suggestion: '监控该IP的后续行为'
    }
  ]

  if (Math.random() > 0.7) {
    const mockResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    const newResult = {
      id: Date.now(),
      ...mockResult,
      timestamp: new Date().toLocaleString('zh-CN')
    }
    detectionResults.value.unshift(newResult)

    // 限制结果数量
    if (detectionResults.value.length > 20) {
      detectionResults.value = detectionResults.value.slice(0, 20)
    }
  }
}

// 定时器
let detectionTimer: number

onMounted(() => {
  // 模拟检测过程
  detectionTimer = setInterval(simulateDetection, 5000)
})

onUnmounted(() => {
  if (detectionTimer) {
    clearInterval(detectionTimer)
  }
})
</script>

<style scoped>
.card {
  @apply rounded-2xl;
}

.progress {
  @apply h-2;
}

.range {
  @apply h-2;
}

.toggle {
  @apply scale-75;
}

@keyframes pulse-border {

  0%,
  100% {
    border-color: theme('colors.success.DEFAULT');
  }

  50% {
    border-color: theme('colors.success.DEFAULT / 0.5');
  }
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}
</style>