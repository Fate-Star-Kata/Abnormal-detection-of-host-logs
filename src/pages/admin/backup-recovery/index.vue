<template>
  <div class="backup-recovery-container p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">数据备份与恢复</h1>
      <p class="text-gray-600">管理系统数据备份和恢复操作</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总备份数</p>
            <p class="text-2xl font-bold text-gray-900">{{ backupStats.totalBackups }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <el-icon class="text-blue-600 text-xl"><FolderOpened /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">备份大小</p>
            <p class="text-2xl font-bold text-gray-900">{{ backupStats.totalSize }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <el-icon class="text-green-600 text-xl"><DataBoard /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">最近备份</p>
            <p class="text-2xl font-bold text-gray-900">{{ backupStats.lastBackup }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <el-icon class="text-yellow-600 text-xl"><Clock /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">自动备份</p>
            <p class="text-2xl font-bold text-gray-900">{{ backupStats.autoBackupStatus }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <el-icon class="text-purple-600 text-xl"><Setting /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="p-6">
        <el-tab-pane label="备份管理" name="backup">
          <template #label>
            <div class="flex items-center gap-2">
              <el-icon><Upload /></el-icon>
              <span>备份管理</span>
            </div>
          </template>
        </el-tab-pane>
        
        <el-tab-pane label="恢复管理" name="recovery">
          <template #label>
            <div class="flex items-center gap-2">
              <el-icon><Download /></el-icon>
              <span>恢复管理</span>
            </div>
          </template>
        </el-tab-pane>
        
        <el-tab-pane label="自动备份" name="auto">
          <template #label>
            <div class="flex items-center gap-2">
              <el-icon><Timer /></el-icon>
              <span>自动备份</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 备份管理 -->
      <div v-if="activeTab === 'backup'" class="p-6 pt-0">
        <!-- 操作栏 -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex gap-3">
            <el-button type="primary" @click="createBackup" :loading="loading">
              <el-icon><Plus /></el-icon>
              创建备份
            </el-button>
            <el-button @click="createIncrementalBackup" :loading="loading">
              <el-icon><Refresh /></el-icon>
              增量备份
            </el-button>
            <el-button type="danger" @click="deleteSelectedBackups" :disabled="selectedBackups.length === 0">
              <el-icon><Delete /></el-icon>
              删除选中
            </el-button>
          </div>
          
          <div class="flex gap-3">
            <el-select v-model="backupFilter" placeholder="筛选类型" class="w-32">
              <el-option label="全部" value="all" />
              <el-option label="完整备份" value="full" />
              <el-option label="增量备份" value="incremental" />
            </el-select>
            <el-input v-model="searchKeyword" placeholder="搜索备份" class="w-64">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>

        <!-- 备份列表 -->
        <el-table :data="filteredBackups" @selection-change="handleSelectionChange" stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="备份名称" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-icon class="text-blue-500">
                  <component :is="getBackupIcon(row.type)" />
                </el-icon>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="备份类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getBackupTypeColor(row.type)">{{ getBackupTypeText(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusColor(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <div class="flex gap-2">
                <el-button size="small" @click="downloadBackup(row)">
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
                <el-button size="small" type="success" @click="restoreBackup(row)">
                  <el-icon><RefreshRight /></el-icon>
                  恢复
                </el-button>
                <el-button size="small" type="danger" @click="deleteBackup(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalBackups"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>

      <!-- 恢复管理 -->
      <div v-if="activeTab === 'recovery'" class="p-6 pt-0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 选择性恢复 -->
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">选择性恢复</h3>
            
            <el-form :model="recoveryForm" label-width="100px">
              <el-form-item label="选择备份">
                <el-select v-model="recoveryForm.backupId" placeholder="请选择备份" class="w-full">
                  <el-option
                    v-for="backup in backupList"
                    :key="backup.id"
                    :label="backup.name"
                    :value="backup.id"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="恢复类型">
                <el-radio-group v-model="recoveryForm.type">
                  <el-radio value="full">完整恢复</el-radio>
                  <el-radio value="selective">选择性恢复</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="数据表" v-if="recoveryForm.type === 'selective'">
                <el-checkbox-group v-model="recoveryForm.tables">
                  <el-checkbox v-for="table in availableTables" :key="table" :value="table">
                    {{ table }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="恢复选项">
                <el-checkbox-group v-model="recoveryForm.options">
                  <el-checkbox value="overwrite">覆盖现有数据</el-checkbox>
                  <el-checkbox value="backup_current">备份当前数据</el-checkbox>
                  <el-checkbox value="verify">验证数据完整性</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <div class="flex justify-end gap-2">
                <el-button @click="resetRecoveryForm">重置</el-button>
                <el-button type="primary" @click="startRecovery" :loading="loading">
                  <el-icon><RefreshRight /></el-icon>
                  开始恢复
                </el-button>
              </div>
            </el-form>
          </div>
          
          <!-- 恢复历史 -->
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">恢复历史</h3>
            
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div v-for="record in recoveryHistory" :key="record.id" class="border border-gray-100 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-medium text-gray-800">{{ record.backupName }}</p>
                    <p class="text-sm text-gray-600">{{ record.createTime }}</p>
                  </div>
                  <el-tag :type="getStatusColor(record.status)">{{ getStatusText(record.status) }}</el-tag>
                </div>
                <p class="text-sm text-gray-600">{{ record.description }}</p>
                <div class="flex justify-end mt-2">
                  <el-button size="small" @click="viewRecoveryDetails(record)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 自动备份 -->
      <div v-if="activeTab === 'auto'" class="p-6 pt-0">
        <el-form :model="autoBackupConfig" label-width="150px">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">基础配置</h3>
              
              <el-form-item label="启用自动备份">
                <el-switch v-model="autoBackupConfig.enabled" />
              </el-form-item>
              
              <el-form-item label="备份频率">
                <el-select v-model="autoBackupConfig.frequency" class="w-full">
                  <el-option label="每小时" value="hourly" />
                  <el-option label="每日" value="daily" />
                  <el-option label="每周" value="weekly" />
                  <el-option label="每月" value="monthly" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="备份时间" v-if="autoBackupConfig.frequency === 'daily'">
                <el-time-picker v-model="autoBackupConfig.time" format="HH:mm" class="w-full" />
              </el-form-item>
              
              <el-form-item label="保留数量">
                <el-input-number v-model="autoBackupConfig.retentionCount" :min="1" :max="100" class="w-full" />
              </el-form-item>
              
              <el-form-item label="保留天数">
                <el-input-number v-model="autoBackupConfig.retentionDays" :min="7" :max="365" class="w-full" />
              </el-form-item>
            </div>
            
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">高级配置</h3>
              
              <el-form-item label="备份类型">
                <el-radio-group v-model="autoBackupConfig.type">
                  <el-radio value="full">完整备份</el-radio>
                  <el-radio value="incremental">增量备份</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="压缩备份">
                <el-switch v-model="autoBackupConfig.compress" />
              </el-form-item>
              
              <el-form-item label="加密备份">
                <el-switch v-model="autoBackupConfig.encrypt" />
              </el-form-item>
              
              <el-form-item label="备份验证">
                <el-switch v-model="autoBackupConfig.verify" />
              </el-form-item>
              
              <el-form-item label="通知设置">
                <el-checkbox-group v-model="autoBackupConfig.notifications">
                  <el-checkbox value="success">成功通知</el-checkbox>
                  <el-checkbox value="failure">失败通知</el-checkbox>
                  <el-checkbox value="warning">警告通知</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-2">
            <el-button @click="testAutoBackup" :loading="loading">
              <el-icon><VideoPlay /></el-icon>
              测试备份
            </el-button>
            <el-button type="primary" @click="saveAutoBackupConfig" :loading="loading">
              <el-icon><Setting /></el-icon>
              保存配置
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 创建备份对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建备份" width="500px">
      <el-form :model="createBackupForm" label-width="100px">
        <el-form-item label="备份名称">
          <el-input v-model="createBackupForm.name" placeholder="请输入备份名称" />
        </el-form-item>
        
        <el-form-item label="备份类型">
          <el-radio-group v-model="createBackupForm.type">
            <el-radio value="full">完整备份</el-radio>
            <el-radio value="incremental">增量备份</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="备份描述">
          <el-input v-model="createBackupForm.description" type="textarea" rows="3" />
        </el-form-item>
        
        <el-form-item label="备份选项">
          <el-checkbox-group v-model="createBackupForm.options">
            <el-checkbox value="compress">压缩备份</el-checkbox>
            <el-checkbox value="encrypt">加密备份</el-checkbox>
            <el-checkbox value="verify">验证完整性</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmCreateBackup" :loading="loading">
            创建备份
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  FolderOpened, DataBoard, Clock, Setting, Upload, Download, Timer,
  Plus, Refresh, Delete, Search, RefreshRight, VideoPlay
} from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('backup')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalBackups = ref(0)
const selectedBackups = ref([])
const backupFilter = ref('all')
const searchKeyword = ref('')
const showCreateDialog = ref(false)

// 备份统计
const backupStats = reactive({
  totalBackups: 156,
  totalSize: '2.3 GB',
  lastBackup: '2小时前',
  autoBackupStatus: '已启用'
})

// 备份列表
const backupList = ref([
  {
    id: 1,
    name: 'backup_2024_01_15_full',
    type: 'full',
    size: '1.2 GB',
    createTime: '2024-01-15 02:00:00',
    status: 'completed'
  },
  {
    id: 2,
    name: 'backup_2024_01_15_inc_001',
    type: 'incremental',
    size: '156 MB',
    createTime: '2024-01-15 08:00:00',
    status: 'completed'
  },
  {
    id: 3,
    name: 'backup_2024_01_15_inc_002',
    type: 'incremental',
    size: '89 MB',
    createTime: '2024-01-15 14:00:00',
    status: 'running'
  }
])

// 恢复表单
const recoveryForm = reactive({
  backupId: '',
  type: 'full',
  tables: [],
  options: []
})

// 可用数据表
const availableTables = ref([
  'users', 'detection_logs', 'rules', 'alerts', 'system_config'
])

// 恢复历史
const recoveryHistory = ref([
  {
    id: 1,
    backupName: 'backup_2024_01_14_full',
    createTime: '2024-01-15 10:30:00',
    status: 'completed',
    description: '完整恢复，恢复所有数据表'
  },
  {
    id: 2,
    backupName: 'backup_2024_01_13_full',
    createTime: '2024-01-14 16:20:00',
    status: 'failed',
    description: '恢复失败，数据验证错误'
  }
])

// 自动备份配置
const autoBackupConfig = reactive({
  enabled: true,
  frequency: 'daily',
  time: new Date(),
  retentionCount: 30,
  retentionDays: 90,
  type: 'incremental',
  compress: true,
  encrypt: false,
  verify: true,
  notifications: ['failure']
})

// 创建备份表单
const createBackupForm = reactive({
  name: '',
  type: 'full',
  description: '',
  options: ['compress', 'verify']
})

// 计算属性
const filteredBackups = computed(() => {
  let filtered = backupList.value
  
  if (backupFilter.value !== 'all') {
    filtered = filtered.filter(backup => backup.type === backupFilter.value)
  }
  
  if (searchKeyword.value) {
    filtered = filtered.filter(backup => 
      backup.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  return filtered
})

// 方法
const getBackupIcon = (type) => {
  return type === 'full' ? 'FolderOpened' : 'Refresh'
}

const getBackupTypeColor = (type) => {
  return type === 'full' ? 'primary' : 'success'
}

const getBackupTypeText = (type) => {
  return type === 'full' ? '完整备份' : '增量备份'
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'success',
    running: 'warning',
    failed: 'danger',
    pending: 'info'
  }
  return colors[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    completed: '已完成',
    running: '进行中',
    failed: '失败',
    pending: '等待中'
  }
  return texts[status] || '未知'
}

const handleSelectionChange = (selection) => {
  selectedBackups.value = selection
}

const createBackup = () => {
  showCreateDialog.value = true
}

const createIncrementalBackup = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('增量备份创建成功')
    // 刷新备份列表
  } catch (error) {
    ElMessage.error('增量备份创建失败')
  } finally {
    loading.value = false
  }
}

const deleteSelectedBackups = async () => {
  try {
    await ElMessageBox.confirm('确定要删除选中的备份吗？', '确认删除', {
      type: 'warning'
    })
    
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('备份删除成功')
    selectedBackups.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('备份删除失败')
    }
  } finally {
    loading.value = false
  }
}

const downloadBackup = (backup) => {
  ElMessage.info(`开始下载备份: ${backup.name}`)
}

const restoreBackup = async (backup) => {
  try {
    await ElMessageBox.confirm(`确定要恢复备份 "${backup.name}" 吗？`, '确认恢复', {
      type: 'warning'
    })
    
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 3000))
    ElMessage.success('备份恢复成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('备份恢复失败')
    }
  } finally {
    loading.value = false
  }
}

const deleteBackup = async (backup) => {
  try {
    await ElMessageBox.confirm(`确定要删除备份 "${backup.name}" 吗？`, '确认删除', {
      type: 'warning'
    })
    
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('备份删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('备份删除失败')
    }
  } finally {
    loading.value = false
  }
}

const resetRecoveryForm = () => {
  Object.assign(recoveryForm, {
    backupId: '',
    type: 'full',
    tables: [],
    options: []
  })
}

const startRecovery = async () => {
  if (!recoveryForm.backupId) {
    ElMessage.warning('请选择要恢复的备份')
    return
  }
  
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 3000))
    ElMessage.success('数据恢复成功')
    resetRecoveryForm()
  } catch (error) {
    ElMessage.error('数据恢复失败')
  } finally {
    loading.value = false
  }
}

const viewRecoveryDetails = (record) => {
  ElMessage.info(`查看恢复详情: ${record.backupName}`)
}

const testAutoBackup = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('自动备份测试成功')
  } catch (error) {
    ElMessage.error('自动备份测试失败')
  } finally {
    loading.value = false
  }
}

const saveAutoBackupConfig = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('自动备份配置保存成功')
  } catch (error) {
    ElMessage.error('自动备份配置保存失败')
  } finally {
    loading.value = false
  }
}

const confirmCreateBackup = async () => {
  if (!createBackupForm.name) {
    ElMessage.warning('请输入备份名称')
    return
  }
  
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('备份创建成功')
    showCreateDialog.value = false
    // 重置表单
    Object.assign(createBackupForm, {
      name: '',
      type: 'full',
      description: '',
      options: ['compress', 'verify']
    })
  } catch (error) {
    ElMessage.error('备份创建失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  totalBackups.value = backupList.value.length
})
</script>

<style scoped>
.backup-recovery-container {
  min-height: 100vh;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-pagination {
  justify-content: center;
}
</style>