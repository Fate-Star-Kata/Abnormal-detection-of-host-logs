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
            <el-select v-model="searchForm.eventType" placeholder="选择事件类型" clearable style="width: 180px;">
              <el-option label="全部" value="" />
              <el-option label="异常登录" value="login" />
              <el-option label="权限提升" value="privilege" />
              <el-option label="文件操作" value="file" />
              <el-option label="网络访问" value="network" />
              <el-option label="系统调用" value="system" />
            </el-select>
          </el-form-item>
          <el-form-item label="风险等级">
            <el-select v-model="searchForm.riskLevel" placeholder="选择风险等级" clearable style="width: 180px;">
              <el-option label="全部" value="" />
              <el-option label="高危" value="high" />
              <el-option label="中危" value="medium" />
              <el-option label="低危" value="low" />
            </el-select>
          </el-form-item>
          <el-form-item label="源IP">
            <el-input v-model="searchForm.sourceIp" placeholder="输入源IP地址" clearable />
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
        <el-table-column prop="id" label="记录ID" sortable="custom" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="risk_level" label="风险等级">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelColor(row.risk_level)" size="small">
              {{ getRiskLevelName(row.risk_level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip_address" label="源IP" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="risk_score" label="风险评分" />
        <el-table-column prop="is_malicious" label="是否恶意">
          <template #default="{ row }">
            <el-tag :type="row.is_malicious ? 'danger' : 'success'" size="small">
              {{ row.is_malicious ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="login_time" label="登录时间" sortable="custom" />
        <el-table-column prop="status" label="处理状态">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <p class="text-sm text-gray-900">{{ currentRecord.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
            <el-tag :type="getRiskLevelColor(currentRecord.risk_level)">
              {{ getRiskLevelName(currentRecord.risk_level) }}
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
            <p class="text-sm text-gray-900">{{ currentRecord.ip_address }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">位置</label>
            <p class="text-sm text-gray-900">{{ currentRecord.location || '未知' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">风险评分</label>
            <p class="text-sm text-gray-900">{{ currentRecord.risk_score }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">登录时间</label>
            <p class="text-sm text-gray-900">{{ currentRecord.login_time }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">是否恶意</label>
            <el-tag :type="currentRecord.is_malicious ? 'danger' : 'success'">
              {{ currentRecord.is_malicious ? '是' : '否' }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
            <p class="text-sm text-gray-900">{{ currentRecord.created_at }}</p>
          </div>
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
import { ref, onMounted, reactive, computed } from 'vue'
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
import {
  getAdminDetectionRecords,
  deleteAdminDetectionRecord
} from '@/api/adminApis'
import { updateDetectionRecordStatus } from '@/api/admin/common'
import type { DetectionRecord, GetDetectionRecordsBody } from '@/types/apis/admin/common'

// 响应式数据
const loading = ref(false)
const detailVisible = ref(false)
const selectedRecords = ref<DetectionRecord[]>([])
const currentRecord = ref<DetectionRecord | null>(null)
const recordList = ref<DetectionRecord[]>([])
const totalRecords = ref(0)

// 统计数据计算属性
const statistics = computed(() => {
  const total = totalRecords.value
  const records = recordList.value || []
  const high = records.filter(record => record.risk_level === 'high').length
  const medium = records.filter(record => record.risk_level === 'medium').length
  const today = records.filter(record => {
    const today = new Date().toDateString()
    return new Date(record.created_at).toDateString() === today
  }).length

  return { total, high, medium, today }
})

// 搜索表单
const searchForm = reactive({
  dateRange: [] as string[],
  eventType: '',
  riskLevel: '' as '' | 'high' | 'medium' | 'low',
  sourceIp: '',
  keyword: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 加载检测记录数据
const loadDetectionRecords = async () => {
  try {
    loading.value = true
    const params: GetDetectionRecordsBody = {
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }

    // 添加搜索条件
    if (searchForm.riskLevel) {
      params.risk_level = searchForm.riskLevel
    }
    if (searchForm.sourceIp) {
      params.ip_address = searchForm.sourceIp
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.start_time = searchForm.dateRange[0]
      params.end_time = searchForm.dateRange[1]
    }

    const response = await getAdminDetectionRecords(params)
    if (response.code === 200) {
      recordList.value = response.data
      totalRecords.value = response.data.length
      pagination.total = response.data.length
    } else {
      ElMessage.error(response.msg || '获取检测记录失败')
    }
  } catch (error) {
    console.error('获取检测记录失败:', error)
    ElMessage.error('获取检测记录失败')
  } finally {
    loading.value = false
  }
}

// 工具函数

// 定义风险等级类型
type RiskLevel = 'high' | 'medium' | 'low'

const getRiskLevelName = (level: RiskLevel | string): string => {
  const names: Record<RiskLevel, string> = {
    high: '高危',
    medium: '中危',
    low: '低危'
  }
  return names[level as RiskLevel] || level
}

const getRiskLevelColor = (level: RiskLevel | string): string => {
  const colors: Record<RiskLevel, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return colors[level as RiskLevel] || 'info'
}

const getStatusName = (status: string) => {
  const names: Record<string, string> = {
    pending: '待处理',
    investigating: '调查中',
    resolved: '已解决',
    false_positive: '误报'
  }
  return names[status as keyof typeof names] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'warning',
    investigating: 'info',
    resolved: 'success',
    false_positive: 'info'
  }
  return colors[status as keyof typeof colors] || 'info'
}

// 事件处理函数
const refreshData = async () => {
  await loadDetectionRecords()
  ElMessage.success('数据刷新成功')
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadDetectionRecords()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    dateRange: [],
    eventType: '',
    riskLevel: '' as '' | 'high' | 'medium' | 'low',
    sourceIp: '',
    keyword: ''
  })
  handleSearch()
}



const handleSortChange = ({ column, prop, order }: { column: any; prop: string; order: string }) => {
  // 处理排序逻辑
  console.log('排序:', prop, order)
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadDetectionRecords()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadDetectionRecords()
}

const viewDetail = (record: DetectionRecord) => {
  currentRecord.value = record
  detailVisible.value = true
}



// 其他事件处理函数
const handleSelectionChange = (selection: DetectionRecord[]) => {
  selectedRecords.value = selection
}

const markAsProcessed = async (record: DetectionRecord) => {
  await handleStatusChange(record, 'resolved')
}

const handleStatusChange = async (record: DetectionRecord, status: string) => {
  try {
    const response = await updateDetectionRecordStatus(record.id, {
      status: status as "pending" | "investigating" | "resolved" | "false_positive"
    })
    if (response.code === 200) {
      record.status = status as "pending" | "investigating" | "resolved" | "false_positive" | "ignored"
      ElMessage.success('状态更新成功')
      // 重新加载数据以确保状态同步
      loadDetectionRecords()
    } else {
      ElMessage.error(response.msg || '状态更新失败')
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

const deleteRecord = async (record: DetectionRecord) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '确认删除', {
      type: 'warning'
    })

    const response = await deleteAdminDetectionRecord(record.id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadDetectionRecords()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除记录失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const batchDelete = async () => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning('请先选择要删除的记录')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRecords.value.length} 条记录吗？`, '确认批量删除', {
      type: 'warning'
    })

    // 批量删除逻辑
    for (const record of selectedRecords.value) {
      await deleteAdminDetectionRecord(record.id)
    }

    ElMessage.success('批量删除成功')
    selectedRecords.value = []
    loadDetectionRecords()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

const exportRecords = () => {
  ElMessage.info('导出功能待实现')
}

const exportSingleRecord = () => {
  ElMessage.info('单条记录导出功能待实现')
}

// 组件挂载时加载数据
onMounted(() => {
  loadDetectionRecords()
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