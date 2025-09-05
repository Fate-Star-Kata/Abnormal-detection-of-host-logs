<template>
  <div class="detection-records">
    <!-- 页面标题和操作栏 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-800">检测记录管理</h1>
        <div class="flex items-center space-x-3">
          <el-button type="primary" :icon="Download" @click="exportRecords">导出记录</el-button>
          <el-button type="danger" :icon="Delete" @click="batchDelete"
            :disabled="selectedRecords.length === 0">批量删除</el-button>
          <el-button :icon="Refresh" @click="refreshData" :loading="loading">刷新</el-button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">总记录数</p>
              <p class="text-2xl font-bold text-blue-900">{{ statistics.total }}</p>
            </div>
            <el-icon class="text-blue-500" size="24">
              <Document />
            </el-icon>
          </div>
        </div>
        <div class="bg-red-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-600 text-sm font-medium">高危记录</p>
              <p class="text-2xl font-bold text-red-900">{{ statistics.high }}</p>
            </div>
            <el-icon class="text-red-500" size="24">
              <Warning />
            </el-icon>
          </div>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-600 text-sm font-medium">中危记录</p>
              <p class="text-2xl font-bold text-yellow-900">{{ statistics.medium }}</p>
            </div>
            <el-icon class="text-yellow-500" size="24">
              <InfoFilled />
            </el-icon>
          </div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">今日新增</p>
              <p class="text-2xl font-bold text-green-900">{{ statistics.today }}</p>
            </div>
            <el-icon class="text-green-500" size="24">
              <Plus />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <el-form :model="searchForm" :inline="true" class="mb-4">
          <el-form-item label="时间范围">
            <el-date-picker v-model="searchForm.dateRange" type="datetimerange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="事件类型">
            <el-select v-model="searchForm.eventType" placeholder="选择事件类型" clearable>
              <el-option label="全部" value="" />
              <el-option label="异常登录" value="login" />
              <el-option label="权限提升" value="privilege" />
              <el-option label="文件操作" value="file" />
              <el-option label="网络访问" value="network" />
              <el-option label="系统调用" value="system" />
            </el-select>
          </el-form-item>
          <el-form-item label="风险等级">
            <el-select v-model="searchForm.riskLevel" placeholder="选择风险等级" clearable>
              <el-option label="全部" value="" />
              <el-option label="高危" value="high" />
              <el-option label="中危" value="medium" />
              <el-option label="低危" value="low" />
            </el-select>
          </el-form-item>
          <el-form-item label="源IP">
            <el-input v-model="searchForm.sourceIp" placeholder="输入源IP地址" clearable />
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="输入关键词搜索" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 检测记录表格 -->
    <div class="bg-white rounded-lg shadow-sm">
      <el-table :data="recordList" v-loading="loading" @selection-change="handleSelectionChange"
        @sort-change="handleSortChange" stripe border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="记录ID" width="100" sortable="custom" />
        <el-table-column prop="eventType" label="事件类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getEventTypeColor(row.eventType)">{{ getEventTypeName(row.eventType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelColor(row.riskLevel)" size="small">
              {{ getRiskLevelName(row.riskLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sourceIp" label="源IP" width="140" />
        <el-table-column prop="targetHost" label="目标主机" width="140" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="description" label="事件描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="detectionTime" label="检测时间" width="180" sortable="custom" />
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)" size="small">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button type="warning" size="small" @click="markAsProcessed(row)"
              v-if="row.status === 'pending'">标记处理</el-button>
            <el-button type="danger" size="small" @click="deleteRecord(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-between items-center p-4">
        <span class="text-sm text-gray-500">
          共 {{ pagination.total }} 条记录，已选择 {{ selectedRecords.length }} 条
        </span>
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="检测记录详情" width="800px">
      <div v-if="currentRecord" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">记录ID</label>
            <p class="text-sm text-gray-900">{{ currentRecord.id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">事件类型</label>
            <el-tag :type="getEventTypeColor(currentRecord.eventType)">
              {{ getEventTypeName(currentRecord.eventType) }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
            <el-tag :type="getRiskLevelColor(currentRecord.riskLevel)">
              {{ getRiskLevelName(currentRecord.riskLevel) }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">处理状态</label>
            <el-tag :type="getStatusColor(currentRecord.status)">
              {{ getStatusName(currentRecord.status) }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">源IP地址</label>
            <p class="text-sm text-gray-900">{{ currentRecord.sourceIp }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">目标主机</label>
            <p class="text-sm text-gray-900">{{ currentRecord.targetHost }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <p class="text-sm text-gray-900">{{ currentRecord.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">检测时间</label>
            <p class="text-sm text-gray-900">{{ currentRecord.detectionTime }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">事件描述</label>
          <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded">{{ currentRecord.description }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">详细日志</label>
          <pre class="text-xs text-gray-700 bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-60">{{
            currentRecord.rawLog }}</pre>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportSingleRecord" v-if="currentRecord">导出此记录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Delete,
  Refresh,
  Search,
  Document,
  Warning,
  InfoFilled,
  Plus
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const selectedRecords = ref([])
const currentRecord = ref(null)

// 统计数据
const statistics = ref({
  total: 1256,
  high: 89,
  medium: 234,
  today: 45
})

// 搜索表单
const searchForm = reactive({
  dateRange: [],
  eventType: '',
  riskLevel: '',
  sourceIp: '',
  keyword: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 1256
})

// 记录列表
const recordList = ref([
  {
    id: 'REC001',
    eventType: 'login',
    riskLevel: 'high',
    sourceIp: '192.168.1.100',
    targetHost: 'web-server-01',
    username: 'admin',
    description: '检测到异常登录行为，多次失败后成功登录',
    detectionTime: '2024-01-15 14:30:25',
    status: 'pending',
    rawLog: '2024-01-15 14:30:25 [WARNING] Failed login attempt from 192.168.1.100 for user admin\n2024-01-15 14:30:26 [WARNING] Failed login attempt from 192.168.1.100 for user admin\n2024-01-15 14:30:27 [INFO] Successful login from 192.168.1.100 for user admin'
  },
  {
    id: 'REC002',
    eventType: 'privilege',
    riskLevel: 'high',
    sourceIp: '10.0.0.50',
    targetHost: 'db-server-01',
    username: 'user01',
    description: '检测到权限提升行为，普通用户获得管理员权限',
    detectionTime: '2024-01-15 14:25:10',
    status: 'processed',
    rawLog: '2024-01-15 14:25:10 [ALERT] User user01 elevated privileges to administrator'
  },
  {
    id: 'REC003',
    eventType: 'file',
    riskLevel: 'medium',
    sourceIp: '172.16.0.25',
    targetHost: 'file-server-01',
    username: 'user02',
    description: '检测到敏感文件访问，访问了系统配置文件',
    detectionTime: '2024-01-15 14:20:45',
    status: 'pending',
    rawLog: '2024-01-15 14:20:45 [WARNING] Sensitive file access: /etc/passwd by user02'
  },
  {
    id: 'REC004',
    eventType: 'network',
    riskLevel: 'low',
    sourceIp: '192.168.1.200',
    targetHost: 'app-server-01',
    username: 'service',
    description: '检测到异常网络连接，连接到未知外部服务器',
    detectionTime: '2024-01-15 14:15:30',
    status: 'ignored',
    rawLog: '2024-01-15 14:15:30 [INFO] Outbound connection to 203.0.113.50:8080'
  },
  {
    id: 'REC005',
    eventType: 'system',
    riskLevel: 'medium',
    sourceIp: '203.0.113.10',
    targetHost: 'web-server-02',
    username: 'www-data',
    description: '检测到异常系统调用，可能存在代码注入',
    detectionTime: '2024-01-15 14:10:15',
    status: 'pending',
    rawLog: '2024-01-15 14:10:15 [ALERT] Suspicious system call detected: execve()'
  }
])

// 工具函数
const getEventTypeName = (type: string) => {
  const names = {
    login: '异常登录',
    privilege: '权限提升',
    file: '文件操作',
    network: '网络访问',
    system: '系统调用'
  }
  return names[type] || type
}

const getEventTypeColor = (type: string) => {
  const colors = {
    login: 'danger',
    privilege: 'danger',
    file: 'warning',
    network: 'info',
    system: 'warning'
  }
  return colors[type] || 'info'
}

const getRiskLevelName = (level: string) => {
  const names = {
    high: '高危',
    medium: '中危',
    low: '低危'
  }
  return names[level] || level
}

const getRiskLevelColor = (level: string) => {
  const colors = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return colors[level] || 'info'
}

const getStatusName = (status: string) => {
  const names = {
    pending: '待处理',
    processed: '已处理',
    ignored: '已忽略'
  }
  return names[status] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    processed: 'success',
    ignored: 'info'
  }
  return colors[status] || 'info'
}

// 事件处理函数
const refreshData = async () => {
  loading.value = true
  // 模拟数据刷新
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleSearch = () => {
  pagination.currentPage = 1
  // 执行搜索逻辑
  ElMessage.info('搜索功能待实现')
}

const resetSearch = () => {
  Object.assign(searchForm, {
    dateRange: [],
    eventType: '',
    riskLevel: '',
    sourceIp: '',
    keyword: ''
  })
  handleSearch()
}

const handleSelectionChange = (selection: any[]) => {
  selectedRecords.value = selection
}

const handleSortChange = ({ column, prop, order }) => {
  // 处理排序逻辑
  console.log('排序:', prop, order)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  // 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  // 重新加载数据
}

const viewDetail = (record: any) => {
  currentRecord.value = record
  detailVisible.value = true
}

const markAsProcessed = async (record: any) => {
  try {
    await ElMessageBox.confirm('确认将此记录标记为已处理？', '确认操作', {
      type: 'warning'
    })
    record.status = 'processed'
    ElMessage.success('标记成功')
  } catch {
    // 用户取消
  }
}

const deleteRecord = async (record: any) => {
  try {
    await ElMessageBox.confirm('确认删除此检测记录？删除后无法恢复。', '确认删除', {
      type: 'warning'
    })
    const index = recordList.value.findIndex(item => item.id === record.id)
    if (index > -1) {
      recordList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消
  }
}

const batchDelete = async () => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning('请先选择要删除的记录')
    return
  }

  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedRecords.value.length} 条记录？删除后无法恢复。`, '批量删除', {
      type: 'warning'
    })
    // 执行批量删除逻辑
    ElMessage.success(`成功删除 ${selectedRecords.value.length} 条记录`)
    selectedRecords.value = []
  } catch {
    // 用户取消
  }
}

const exportRecords = () => {
  ElMessage.info('导出功能待实现')
}

const exportSingleRecord = () => {
  ElMessage.info('单条记录导出功能待实现')
  detailVisible.value = false
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.detection-records {
  padding: 20px;
}

.el-table {
  font-size: 14px;
}

.el-tag {
  font-weight: 500;
}

pre {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>