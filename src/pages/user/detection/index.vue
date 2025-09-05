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
          <div class="card-body ">
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
                    <div v-if="realtimeDetectionData" class="text-xs opacity-70 mt-1">
                      {{ realtimeDetectionData.detection_rate }} 次/分钟
                    </div>
                    <div v-if="realtimeDetectionData && realtimeDetectionData.active_threats > 0" 
                      class="text-xs mt-1" :class="realtimeDetectionData.active_threats > 0 ? 'text-error' : 'text-success'">
                      {{ realtimeDetectionData.active_threats }} 个活跃威胁
                    </div>
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

            <!-- 当前配置信息 -->
            <div v-if="realtimeDetectionData && realtimeDetectionData.current_config" class="alert alert-info mb-4">
              <div>
                <h3 class="font-bold">当前活动配置</h3>
                <div class="text-sm">
                  <p>{{ realtimeDetectionData.current_config.name }}</p>
                  <p>检测间隔: {{ realtimeDetectionData.current_config.detection_interval }}秒</p>
                  <p>敏感度: {{ realtimeDetectionData.current_config.sensitivity }}</p>
                </div>
              </div>
            </div>

            <!-- 可用配置列表 -->
            <div v-if="detectionConfigs.length > 0" class="mb-4">
              <h3 class="font-medium text-base mb-2">可用配置</h3>
              <div class="space-y-2 max-h-32 overflow-y-auto">
                <div v-for="config in detectionConfigs" :key="config.id" 
                     class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                  <div class="flex-1">
                    <p class="font-medium text-sm">{{ config.name }}</p>
                    <p class="text-xs opacity-70">
                      间隔: {{ config.detection_interval }}s | 敏感度: {{ config.sensitivity }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div v-if="config.is_active" class="badge badge-success badge-sm">活动</div>
                    <button v-else @click="activateConfig(config.id)" 
                            class="btn btn-xs btn-primary">激活</button>
                  </div>
                </div>
              </div>
            </div>

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
          <div class="card-body ">
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
            <div class="space-y-4 max-h-[1050px] overflow-y-auto">
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
import { 
  getRealtimeDetection, 
  executeSingleDetection,
  getDetectionConfigs,
  createDetectionConfig,
  activateDetectionConfig
} from '@/api/PagesApis'
import type { 
  RealtimeDetectionResponse, 
  DetectionConfig,
  DetectionConfigsResponse,
  CreateDetectionConfigRequest,
  DetectionConfigResponse,
  ActivateDetectionConfigResponse,
  SingleDetectionRequest
} from '@/types/apis/PagesApis_T'
import { ElMessage } from 'element-plus'

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

// 实时检测数据
const realtimeDetectionData = ref<any>(null)

// 检测配置列表
const detectionConfigs = ref<DetectionConfig[]>([])

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

// 获取实时检测状态
const fetchRealtimeDetection = async () => {
  try {
    const response: RealtimeDetectionResponse = await getRealtimeDetection()
    
    if (response.code === 200) {
      realtimeDetectionData.value = response.data
      detectionStatus.value = response.data.status === 'running' ? 'running' : 'stopped'
      
      // 更新检测结果列表，使用真实的API数据
      detectionResults.value = response.data.recent_detections.map(detection => {
        // 根据风险等级确定建议
        let suggestion = ''
        if (detection.risk_level === 'high') {
          suggestion = '高风险登录尝试，建议立即调查并考虑阻止该IP地址'
        } else if (detection.risk_level === 'medium') {
          suggestion = '中等风险活动，建议监控该用户的后续行为'
        } else {
          suggestion = '低风险活动，继续观察'
        }
        
        return {
          id: detection.id,
          type: detection.risk_level_display,
          description: `来自IP ${detection.ip_address} 的登录尝试`,
          sourceIP: detection.ip_address,
          username: detection.username,
          location: detection.location,
          riskLevel: detection.risk_level === 'high' ? 'high' : detection.risk_level === 'medium' ? 'medium' : 'low',
          timestamp: new Date(detection.created_at).toLocaleString('zh-CN'),
          suggestion: suggestion
        }
      })
      
      // 如果有当前配置，更新配置参数
      if (response.data.current_config) {
        detectionInterval.value = response.data.current_config.detection_interval
        sensitivity.value = response.data.current_config.sensitivity
      }
    } else {
      ElMessage.error(response.msg || '获取实时检测状态失败')
    }
  } catch (error) {
    ElMessage.error('获取实时检测状态失败')
    console.error('获取实时检测状态失败:', error)
  }
}

// 控制方法
const startDetection = async () => {
  try {
    // 这里应该调用API来启动检测，但我们暂时使用模拟方式
    detectionStatus.value = 'running'
    detectionProgress.value = 0
    
    // 获取最新的检测状态
    await fetchRealtimeDetection()
    
    ElMessage.success('检测已启动')
  } catch (error) {
    ElMessage.error('启动检测失败')
    console.error('启动检测失败:', error)
  }
}

const pauseDetection = async () => {
  try {
    detectionStatus.value = 'paused'
    
    // 获取最新的检测状态
    await fetchRealtimeDetection()
    
    ElMessage.info('检测已暂停')
  } catch (error) {
    ElMessage.error('暂停检测失败')
    console.error('暂停检测失败:', error)
  }
}

const stopDetection = async () => {
  try {
    detectionStatus.value = 'stopped'
    detectionProgress.value = 0
    
    // 获取最新的检测状态
    await fetchRealtimeDetection()
    
    ElMessage.info('检测已停止')
  } catch (error) {
    ElMessage.error('停止检测失败')
    console.error('停止检测失败:', error)
  }
}

// 获取检测配置列表
const fetchDetectionConfigs = async () => {
  try {
    const response: DetectionConfigsResponse = await getDetectionConfigs()
    
    if (response.code === 200) {
      detectionConfigs.value = response.data
    } else {
      ElMessage.error(response.msg || '获取检测配置列表失败')
    }
  } catch (error) {
    ElMessage.error('获取检测配置列表失败')
    console.error('获取检测配置列表失败:', error)
  }
}

// 激活指定配置
const activateConfig = async (configId: number) => {
  try {
    const response: ActivateDetectionConfigResponse = await activateDetectionConfig(configId)
    
    if (response.code === 200) {
      ElMessage.success(`配置已激活: ${response.data.name}`)
      // 重新获取实时检测状态以更新当前配置信息
      await fetchRealtimeDetection()
      // 重新获取配置列表
      await fetchDetectionConfigs()
    } else {
      ElMessage.error(response.msg || '激活配置失败')
    }
  } catch (error) {
    ElMessage.error('激活配置失败')
    console.error('激活配置失败:', error)
  }
}

const saveConfig = async () => {
  try {
    // 创建新的检测配置
    const configData: CreateDetectionConfigRequest = {
      name: `检测配置_${new Date().toLocaleString('zh-CN')}`,
      description: '用户自定义检测配置',
      detection_interval: detectionInterval.value,
      sensitivity: sensitivity.value,
      high_risk_threshold: 0.8,
      medium_risk_threshold: 0.5
    }
    
    const response: DetectionConfigResponse = await createDetectionConfig(configData)
    
    // 创建配置的响应直接返回DetectionConfig对象，没有code字段
    if (response.id) {
      ElMessage.success('配置已保存')
      
      // 激活新创建的配置
      const activateResponse: ActivateDetectionConfigResponse = await activateDetectionConfig(response.id)
      
      if (activateResponse.code === 200) {
        ElMessage.success('配置已激活')
        // 重新获取实时检测状态以更新当前配置信息
        await fetchRealtimeDetection()
        // 重新获取配置列表
        await fetchDetectionConfigs()
      } else {
        ElMessage.warning('配置已保存但激活失败')
      }
    } else {
      ElMessage.error('保存配置失败')
    }
  } catch (error) {
    ElMessage.error('保存配置失败')
    console.error('保存配置失败:', error)
  }
}

const clearResults = () => {
  detectionResults.value = []
  ElMessage.info('检测结果已清空')
}

// 定时器
let fetchTimer: number

onMounted(() => {
  // 初始获取实时检测状态
  fetchRealtimeDetection()
  
  // 获取检测配置列表
  fetchDetectionConfigs()
  
  // 定时获取最新检测状态（每30秒）
  fetchTimer = setInterval(fetchRealtimeDetection, 30000)
})

onUnmounted(() => {
  if (fetchTimer) {
    clearInterval(fetchTimer)
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
