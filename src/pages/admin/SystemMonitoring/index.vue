<template>
  <div class="system-monitor-container p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">系统监控与维护</h1>
      <p class="text-gray-600">实时监控系统状态，管理日志和执行维护操作</p>
    </div>

    <!-- 标签页导航 -->
    <el-tabs v-model="activeTab" class="custom-tabs">
      <!-- 性能监控标签页 -->
      <el-tab-pane label="性能监控" name="monitor">
        <template #label>
          <span class="flex items-center">
            <el-icon class="mr-2"><Monitor /></el-icon>
            性能监控
          </span>
        </template>
        
        <!-- 监控信息网格布局 -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <!-- CPU监控组件 -->
          <CpuMonitor :cpu-info="cpuInfo" :loading="loading" />

          <!-- 内存监控组件 -->
          <MemoryMonitor :memory-info="memoryInfo" :loading="loading" />

          <!-- 磁盘监控组件 -->
          <DiskMonitor :disk-info="diskInfo" :loading="loading" />

          <!-- 系统状态组件 -->
          <SystemStatus :system-overview="systemOverview" :loading="loading" />
        </div>

        <!-- 进程监控组件 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <ProcessMonitor :process-info="processInfo" :process-sort-by="processSortBy" :process-limit="processLimit"
            :loading="loading" @update-sort="updateProcessSort" @update-limit="updateProcessLimit" />
        </div>

        <!-- 告警规则管理 -->
        <div class="bg-white rounded-lg shadow-sm p-4 mt-4">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <el-icon class="mr-2"><Warning /></el-icon>
            告警规则管理
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="rule in alertRules" :key="rule.id" class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium">{{ rule.name }}</h4>
                <el-switch v-model="rule.enabled" @change="toggleAlertRule(rule)" />
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ rule.condition }}</p>
              <el-tag :type="rule.level === 'critical' ? 'danger' : 'warning'" size="small">
                {{ rule.level === 'critical' ? '严重' : '警告' }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 控制栏 -->
        <div class="flex justify-between items-center bg-white rounded-lg shadow-sm px-4 py-3 mt-4">
          <div class="text-sm text-gray-600">
            最后更新: {{ lastUpdateTime || 'N/A' }}
          </div>
          <div class="flex space-x-3 items-center">
            <el-button @click="refreshAllData" :loading="loading" type="primary" size="small">
              <el-icon class="mr-1"><Refresh /></el-icon>
              {{ loading ? '刷新中...' : '刷新数据' }}
            </el-button>
            <el-checkbox v-model="autoRefresh" @change="toggleAutoRefresh">
              自动刷新 ({{ refreshInterval / 1000 }}s)
            </el-checkbox>
          </div>
        </div>
      </el-tab-pane>

      <!-- 日志管理标签页 -->
      <el-tab-pane label="日志管理" name="logs">
        <template #label>
          <span class="flex items-center">
            <el-icon class="mr-2"><DocumentCopy /></el-icon>
            日志管理
          </span>
        </template>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <!-- 搜索和筛选 -->
          <div class="flex flex-wrap gap-4 mb-6">
            <el-input
              v-model="logSearchKeyword"
              placeholder="搜索日志内容"
              style="width: 300px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select v-model="logLevel" placeholder="选择日志级别" style="width: 150px" clearable>
              <el-option label="INFO" value="INFO" />
              <el-option label="WARNING" value="WARNING" />
              <el-option label="ERROR" value="ERROR" />
              <el-option label="DEBUG" value="DEBUG" />
            </el-select>
            
            <el-date-picker
              v-model="logDateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            
            <el-button type="primary" @click="searchLogs" :loading="logLoading">
              <el-icon class="mr-1"><Search /></el-icon>
              搜索
            </el-button>
            
            <el-button @click="exportLogs">
              <el-icon class="mr-1"><Download /></el-icon>
              导出
            </el-button>
            
            <el-button type="danger" @click="clearLogs">
              <el-icon class="mr-1"><Delete /></el-icon>
              清空日志
            </el-button>
          </div>

          <!-- 日志列表 -->
          <el-table :data="logList" v-loading="logLoading" stripe>
            <el-table-column prop="timestamp" label="时间" width="180" />
            <el-table-column prop="level" label="级别" width="100">
              <template #default="{ row }">
                <el-tag :class="getLevelColor(row.level)" size="small">
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="module" label="模块" width="120" />
            <el-table-column prop="message" label="消息" min-width="200" />
            <el-table-column prop="details" label="详情" width="200" show-overflow-tooltip />
          </el-table>

          <!-- 分页 -->
          <div class="flex justify-center mt-6">
            <el-pagination
              v-model:current-page="logPagination.current"
              v-model:page-size="logPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="logPagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="searchLogs"
              @current-change="searchLogs"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- 维护操作标签页 -->
      <el-tab-pane label="维护操作" name="maintenance">
        <template #label>
          <span class="flex items-center">
            <el-icon class="mr-2"><Tools /></el-icon>
            维护操作
          </span>
        </template>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 服务管理 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <el-icon class="mr-2"><Setting /></el-icon>
              服务管理
            </h3>
            
            <div class="space-y-4">
              <div v-for="service in systemServices" :key="service.name" 
                   class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 class="font-medium">{{ service.name }}</h4>
                  <p class="text-sm text-gray-600">{{ service.description }}</p>
                  <el-tag :class="getServiceStatusColor(service.status)" size="small" class="mt-1">
                    {{ service.status === 'running' ? '运行中' : '已停止' }}
                  </el-tag>
                </div>
                <div class="flex space-x-2">
                  <el-button v-if="service.status === 'stopped'" 
                           @click="startService(service.name)" 
                           :loading="maintenanceLoading" 
                           type="success" size="small">
                    <el-icon class="mr-1"><CircleCheck /></el-icon>
                    启动
                  </el-button>
                  <el-button v-if="service.status === 'running'" 
                           @click="stopService(service.name)" 
                           :loading="maintenanceLoading" 
                           type="warning" size="small">
                    停止
                  </el-button>
                  <el-button @click="restartService(service.name)" 
                           :loading="maintenanceLoading" 
                           type="primary" size="small">
                    <el-icon class="mr-1"><Refresh /></el-icon>
                    重启
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统维护 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <el-icon class="mr-2"><Tools /></el-icon>
              系统维护
            </h3>
            
            <div class="space-y-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">系统清理</h4>
                <p class="text-sm text-gray-600 mb-3">清理临时文件、日志文件和缓存数据</p>
                <el-button @click="cleanupSystem" :loading="maintenanceLoading" type="primary">
                  <el-icon class="mr-1"><Delete /></el-icon>
                  执行清理
                </el-button>
              </div>
              
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">数据库优化</h4>
                <p class="text-sm text-gray-600 mb-3">优化数据库表结构和索引，提升查询性能</p>
                <el-button @click="optimizeDatabase" :loading="maintenanceLoading" type="primary">
                  <el-icon class="mr-1"><Setting /></el-icon>
                  优化数据库
                </el-button>
              </div>
              
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">系统重启</h4>
                <p class="text-sm text-gray-600 mb-3">重启整个系统服务（谨慎操作）</p>
                <el-button type="danger" disabled>
                  <el-icon class="mr-1"><Refresh /></el-icon>
                  系统重启
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Monitor, 
  DocumentCopy, 
  Tools, 
  Refresh, 
  Download, 
  Delete, 
  Search,
  Setting,
  Warning,
  CircleCheck
} from '@element-plus/icons-vue'
import { monitorApi } from '@/api/system_file'

// 导入子组件
import CpuMonitor from '@/components/pages/admin/SystemMonitoring/CpuMonitor.vue'
import MemoryMonitor from '@/components/pages/admin/SystemMonitoring/MemoryMonitor.vue'
import DiskMonitor from '@/components/pages/admin/SystemMonitoring/DiskMonitor.vue'
import SystemStatus from '@/components/pages/admin/SystemMonitoring/SystemStatus.vue'
import ProcessMonitor from '@/components/pages/admin/SystemMonitoring/ProcessMonitor.vue'

// 响应式数据
const loading = ref(false)
const lastUpdateTime = ref('')
const autoRefresh = ref(true)
const refreshInterval = ref(30000) // 30秒刷新间隔
let refreshTimer = null

// 标签页控制
const activeTab = ref('monitor')

// 日志管理相关
const logSearchKeyword = ref('')
const logLevel = ref('')
const logDateRange = ref([])
const logList = ref([])
const logLoading = ref(false)
const logPagination = ref({
  current: 1,
  pageSize: 20,
  total: 0
})

// 维护操作相关
const maintenanceLoading = ref(false)
const systemServices = ref([
  { name: '异常检测服务', status: 'running', description: '主要检测服务' },
  { name: '数据库服务', status: 'running', description: 'MySQL数据库' },
  { name: '缓存服务', status: 'running', description: 'Redis缓存' },
  { name: '消息队列', status: 'stopped', description: 'RabbitMQ消息队列' }
])

// 性能监控历史数据
const performanceHistory = ref({
  cpu: [],
  memory: [],
  disk: [],
  network: []
})

// 告警规则
const alertRules = ref([
  { id: 1, name: 'CPU使用率过高', condition: 'CPU > 80%', enabled: true, level: 'warning' },
  { id: 2, name: '内存使用率过高', condition: '内存 > 90%', enabled: true, level: 'critical' },
  { id: 3, name: '磁盘空间不足', condition: '磁盘 > 95%', enabled: true, level: 'critical' },
  { id: 4, name: '网络异常', condition: '网络延迟 > 1000ms', enabled: false, level: 'warning' }
])

// 监控数据
const systemOverview = ref({})
const cpuInfo = ref({})
const memoryInfo = ref({})
const diskInfo = ref({ disk_info: [] })
const networkInfo = ref({ network_info: {} })
const processInfo = ref({ processes: [], total_processes: 0 })
const gpuInfo = ref({ gpu_available: false, gpu_info: [], message: '' })

// 进程监控参数
const processSortBy = ref('cpu_percent')
const processLimit = ref('10')

// API调用函数
const fetchSystemOverview = async () => {
  try {
    const response = await monitorApi.getSystemOverview()
    console.log('系统概览API响应:', response)
    if (response.code === 200 && response.data) {
      systemOverview.value = response.data
      console.log('系统概览数据:', systemOverview.value)
    }
  } catch (error) {
    console.error('获取系统概览失败:', error)
  }
}

const fetchCpuInfo = async () => {
  try {
    const response = await monitorApi.getCpuMonitor()
    console.log('CPU监控API响应:', response)
    if (response.code === 200 && response.data) {
      cpuInfo.value = response.data
      console.log('CPU数据:', cpuInfo.value)
    }
  } catch (error) {
    console.error('获取CPU信息失败:', error)
  }
}

const fetchMemoryInfo = async () => {
  try {
    const response = await monitorApi.getMemoryMonitor()
    console.log('内存监控API响应:', response)
    if (response.code === 200 && response.data) {
      memoryInfo.value = response.data
      console.log('内存数据:', memoryInfo.value)
    }
  } catch (error) {
    console.error('获取内存信息失败:', error)
  }
}

const fetchDiskInfo = async () => {
  try {
    const response = await monitorApi.getDiskMonitor()
    if (response.code === 200 && response.data) {
      diskInfo.value = response.data
    }
  } catch (error) {
    console.error('获取磁盘信息失败:', error)
  }
}

const fetchNetworkInfo = async () => {
  try {
    const response = await monitorApi.getNetworkMonitor()
    if (response.code === 200 && response.data) {
      networkInfo.value = response.data
    }
  } catch (error) {
    console.error('获取网络信息失败:', error)
  }
}

const fetchProcessInfo = async () => {
  try {
    const response = await monitorApi.getProcessMonitor({
      limit: parseInt(processLimit.value),
      sort_by: processSortBy.value
    })
    if (response.code === 200 && response.data) {
      processInfo.value = response.data
    }
  } catch (error) {
    console.error('获取进程信息失败:', error)
  }
}

const fetchGpuInfo = async () => {
  try {
    const response = await monitorApi.getGpuMonitor()
    if (response.code === 200 && response.data) {
      gpuInfo.value = response.data
    }
  } catch (error) {
    console.error('获取GPU信息失败:', error)
  }
}

// 刷新所有数据
const refreshAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchSystemOverview(),
      fetchCpuInfo(),
      fetchMemoryInfo(),
      fetchDiskInfo(),
      fetchNetworkInfo(),
      fetchProcessInfo(),
      fetchGpuInfo()
    ])
    lastUpdateTime.value = new Date().toLocaleString()
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 自动刷新控制
const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const startAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  refreshTimer = setInterval(() => {
    refreshAllData()
  }, refreshInterval.value)
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 进程监控事件处理
const updateProcessSort = (sortBy) => {
  processSortBy.value = sortBy
  fetchProcessInfo()
}

const updateProcessLimit = (limit) => {
  processLimit.value = limit
  fetchProcessInfo()
}

// 日志管理功能
const searchLogs = async () => {
  logLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockLogs = [
      { id: 1, timestamp: '2024-01-15 10:30:25', level: 'INFO', module: '检测引擎', message: '异常检测任务开始执行', details: '检测规则ID: 001' },
      { id: 2, timestamp: '2024-01-15 10:28:15', level: 'WARNING', module: '系统监控', message: 'CPU使用率达到85%', details: '当前CPU使用率: 85.2%' },
      { id: 3, timestamp: '2024-01-15 10:25:10', level: 'ERROR', module: '数据库', message: '数据库连接超时', details: '连接超时时间: 30秒' },
      { id: 4, timestamp: '2024-01-15 10:20:05', level: 'INFO', module: '用户管理', message: '用户登录成功', details: '用户ID: admin' },
      { id: 5, timestamp: '2024-01-15 10:15:30', level: 'DEBUG', module: '检测引擎', message: '规则配置更新', details: '更新规则数量: 3' }
    ]
    
    logList.value = mockLogs.filter(log => {
      const matchKeyword = !logSearchKeyword.value || log.message.includes(logSearchKeyword.value)
      const matchLevel = !logLevel.value || log.level === logLevel.value
      return matchKeyword && matchLevel
    })
    
    logPagination.value.total = logList.value.length
  } catch (error) {
    ElMessage.error('获取日志失败')
  } finally {
    logLoading.value = false
  }
}

const exportLogs = () => {
  ElMessage.success('日志导出功能开发中')
}

const clearLogs = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有日志吗？此操作不可恢复。', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    logList.value = []
    ElMessage.success('日志已清空')
  } catch {
    // 用户取消操作
  }
}

// 维护操作功能
const restartService = async (serviceName) => {
  try {
    await ElMessageBox.confirm(`确定要重启 ${serviceName} 吗？`, '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    maintenanceLoading.value = true
    // 模拟重启操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const service = systemServices.value.find(s => s.name === serviceName)
    if (service) {
      service.status = 'running'
    }
    
    ElMessage.success(`${serviceName} 重启成功`)
  } catch {
    // 用户取消操作
  } finally {
    maintenanceLoading.value = false
  }
}

const stopService = async (serviceName) => {
  try {
    await ElMessageBox.confirm(`确定要停止 ${serviceName} 吗？`, '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    maintenanceLoading.value = true
    // 模拟停止操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const service = systemServices.value.find(s => s.name === serviceName)
    if (service) {
      service.status = 'stopped'
    }
    
    ElMessage.success(`${serviceName} 已停止`)
  } catch {
    // 用户取消操作
  } finally {
    maintenanceLoading.value = false
  }
}

const startService = async (serviceName) => {
  try {
    maintenanceLoading.value = true
    // 模拟启动操作
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const service = systemServices.value.find(s => s.name === serviceName)
    if (service) {
      service.status = 'running'
    }
    
    ElMessage.success(`${serviceName} 启动成功`)
  } catch (error) {
    ElMessage.error(`${serviceName} 启动失败`)
  } finally {
    maintenanceLoading.value = false
  }
}

const cleanupSystem = async () => {
  try {
    await ElMessageBox.confirm('确定要执行系统清理吗？这将清理临时文件和缓存。', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    maintenanceLoading.value = true
    // 模拟清理操作
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    ElMessage.success('系统清理完成，释放空间 1.2GB')
  } catch {
    // 用户取消操作
  } finally {
    maintenanceLoading.value = false
  }
}

const optimizeDatabase = async () => {
  try {
    await ElMessageBox.confirm('确定要优化数据库吗？此操作可能需要几分钟时间。', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    maintenanceLoading.value = true
    // 模拟数据库优化
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    ElMessage.success('数据库优化完成，查询性能提升 15%')
  } catch {
    // 用户取消操作
  } finally {
    maintenanceLoading.value = false
  }
}

// 告警规则管理
const toggleAlertRule = (rule) => {
  rule.enabled = !rule.enabled
  ElMessage.success(`告警规则 "${rule.name}" 已${rule.enabled ? '启用' : '禁用'}`)
}

const getLevelColor = (level) => {
  const colors = {
    'INFO': 'text-blue-600',
    'WARNING': 'text-yellow-600',
    'ERROR': 'text-red-600',
    'DEBUG': 'text-gray-600',
    'warning': 'text-yellow-600',
    'critical': 'text-red-600'
  }
  return colors[level] || 'text-gray-600'
}

const getLevelBg = (level) => {
  const colors = {
    'INFO': 'bg-blue-100',
    'WARNING': 'bg-yellow-100',
    'ERROR': 'bg-red-100',
    'DEBUG': 'bg-gray-100',
    'warning': 'bg-yellow-100',
    'critical': 'bg-red-100'
  }
  return colors[level] || 'bg-gray-100'
}

const getServiceStatusColor = (status) => {
  return status === 'running' ? 'text-green-600' : 'text-red-600'
}

const getServiceStatusBg = (status) => {
  return status === 'running' ? 'bg-green-100' : 'bg-red-100'
}

// 生命周期
onMounted(() => {
  refreshAllData()
  searchLogs() // 初始化日志数据
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.system-monitor-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.custom-tabs {
  --el-tabs-header-height: 50px;
}

.custom-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.custom-tabs :deep(.el-tabs__nav-wrap) {
  padding: 10px 0;
}

.custom-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #6b7280;
  border: none;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #3b82f6;
  background: #eff6ff;
  border-radius: 6px;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>