<script setup lang="ts">
import { Motion } from 'motion-v'
import { Refresh, Warning, User, Setting, Monitor } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'

const loading = ref(false)
const systemStats = ref({
  totalUsers: 1234,
  activeRules: 45,
  pendingAlerts: 23,
  systemLoad: 68
})

const recentAlerts = ref([
  { id: 1, type: '高危登录', source: '192.168.1.100', time: '2024-01-15 14:30:25', level: 'high' },
  { id: 2, type: '异常访问', source: '10.0.0.50', time: '2024-01-15 14:25:10', level: 'medium' },
  { id: 3, type: '权限提升', source: '172.16.0.25', time: '2024-01-15 14:20:45', level: 'high' },
  { id: 4, type: '文件异常', source: '192.168.1.200', time: '2024-01-15 14:15:30', level: 'low' },
  { id: 5, type: '网络扫描', source: '203.0.113.10', time: '2024-01-15 14:10:15', level: 'medium' }
])

const systemPerformance = ref({
  cpu: 45,
  memory: 68,
  disk: 32,
  network: 78
})

const refreshData = async () => {
  loading.value = true
  // 模拟数据刷新
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-red-600'
    case 'medium': return 'text-yellow-600'
    case 'low': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

const getLevelBg = (level: string) => {
  switch (level) {
    case 'high': return 'bg-red-100'
    case 'medium': return 'bg-yellow-100'
    case 'low': return 'bg-blue-100'
    default: return 'bg-gray-100'
  }
}

onMounted(() => {
  refreshData()
})

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.4, ease: ['easeOut'] }
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] }
  },
  transition: { duration: 0.5, ease: ['easeOut'] }
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.6, delay: 0.3, ease: ['easeOut'] }
}
</script>

<template>
  <div class="dashboard">
    <!-- 仪表板页面 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">管理员控制台</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" :icon="Refresh" :loading="loading" circle @click="refreshData" />
            </Motion>
          </div>
        </template>

        <!-- 系统统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">系统用户数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-blue-900">{{ systemStats.totalUsers }}</p>
                </Motion>
                <p class="text-xs text-blue-500 mt-1">+12 今日新增</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-blue-500">
                <el-icon size="32">
                  <User />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">活跃检测规则</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-green-900">{{ systemStats.activeRules }}</p>
                </Motion>
                <p class="text-xs text-green-500 mt-1">运行正常</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-green-500">
                <el-icon size="32">
                  <Setting />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">待处理告警</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-2xl font-bold text-red-900">{{ systemStats.pendingAlerts }}</p>
                </Motion>
                <p class="text-xs text-red-500 mt-1">需要关注</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-red-500">
                <el-icon size="32">
                  <Warning />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 text-sm font-medium">系统负载</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }">
                  <p class="text-2xl font-bold text-purple-900">{{ systemStats.systemLoad }}%</p>
                </Motion>
                <p class="text-xs text-purple-500 mt-1">运行良好</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any" class="text-purple-500">
                <el-icon size="32">
                  <Monitor />
                </el-icon>
              </Motion>
            </div>
          </Motion>

        </div>
      </el-card>
    </Motion>

    <!-- 最近告警和系统性能 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近告警 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.8 } as any">
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">最近告警</span>
              <el-button type="text" size="small">查看全部</el-button>
            </div>
          </template>
          <div class="space-y-3">
            <Motion v-for="(alert, index) in recentAlerts" :key="alert.id"
              :initial="{ opacity: 0, x: -20 }" :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.3, delay: 1.0 + index * 0.1 }"
              class="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-3">
                <div :class="[getLevelBg(alert.level), 'w-3 h-3 rounded-full']">
                  <div :class="[getLevelColor(alert.level).replace('text-', 'bg-'), 'w-full h-full rounded-full opacity-60']"></div>
                </div>
                <div>
                  <p class="font-medium text-sm">{{ alert.type }}</p>
                  <p class="text-xs text-gray-500">{{ alert.source }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">{{ alert.time }}</p>
                <span :class="[getLevelColor(alert.level), 'text-xs font-medium']">{{ alert.level.toUpperCase() }}</span>
              </div>
            </Motion>
          </div>
        </el-card>
      </Motion>

      <!-- 系统性能监控 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.9 } as any">
        <el-card>
          <template #header>
            <span class="font-medium">系统性能监控</span>
          </template>
          <div class="space-y-4">
            <Motion v-for="(item, index) in Object.entries(systemPerformance)" :key="item[0]"
              :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.4, delay: 1.1 + index * 0.1 }">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium capitalize">{{ item[0] === 'cpu' ? 'CPU' : item[0] === 'memory' ? '内存' : item[0] === 'disk' ? '磁盘' : '网络' }}</span>
                <span class="text-sm text-gray-600">{{ item[1] }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <Motion :initial="{ width: 0 }" :animate="{ width: `${item[1]}%` }"
                  :transition="{ duration: 0.8, delay: 1.3 + index * 0.1 }"
                  :class="[
                    'h-2 rounded-full transition-all duration-300',
                    item[1] > 80 ? 'bg-red-500' : item[1] > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  ]">
                </Motion>
              </div>
            </Motion>
          </div>
        </el-card>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  .cursor-pointer {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>