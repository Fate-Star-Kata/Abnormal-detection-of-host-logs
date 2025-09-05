<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { getDetectionConfigs, createDetectionConfig, updateDetectionConfig, deleteDetectionConfig, activateDetectionConfig, deactivateDetectionConfig } from '@/api/adminApis'
import type { DetectionConfig, GetDetectionConfigsBody, CreateDetectionConfigBody, UpdateDetectionConfigBody } from '@/types/apis/admin/common'
import {
  Plus,
  Edit,
  Delete,
  Search,
  Refresh,
  Setting,
  View,
  Switch,
  Warning,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const ruleList = ref<DetectionConfig[]>([])
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentRule = ref<DetectionConfig>()
const activeTab = ref('rules')

// 规则统计数据
const ruleStats = ref({
  total: 24,
  active: 18,
  inactive: 6,
  critical: 8
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 24
})

// 规则表单
const ruleForm = reactive({
  name: '',
  description: '',
  type: 'login_anomaly',
  level: 'medium',
  status: 'active',
  conditions: {
    timeWindow: 300,
    threshold: 5,
    field: 'source_ip',
    operator: 'gt',
    value: ''
  },
  actions: {
    alert: true,
    email: false,
    block: false
  }
})

// 规则类型选项
const ruleTypes = [
  { label: '登录异常', value: 'login_anomaly' },
  { label: '暴力破解', value: 'brute_force' },
  { label: '异常访问', value: 'abnormal_access' },
  { label: '权限提升', value: 'privilege_escalation' },
  { label: '数据泄露', value: 'data_leak' },
  { label: '恶意文件', value: 'malicious_file' },
  { label: '网络扫描', value: 'network_scan' },
  { label: '异常流量', value: 'abnormal_traffic' }
]

// 风险等级选项
const riskLevels = [
  { label: '低风险', value: 'low', color: 'success' },
  { label: '中风险', value: 'medium', color: 'warning' },
  { label: '高风险', value: 'high', color: 'danger' },
  { label: '严重', value: 'critical', color: 'danger' }
]

// 操作符选项
const operators = [
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'contains' },
  { label: '正则匹配', value: 'regex' }
]

// 从后端获取规则数据
const fetchRuleList = async () => {
  try {
    loading.value = true
    const params: GetDetectionConfigsBody = {
      page: pagination.currentPage,
      page_size: pagination.pageSize,

    }

    const response = await getDetectionConfigs(params)
    if (response.code === 200 && response.data) {
      // API返回的数据结构是 {code, msg, data: [...]}
      // data 直接就是规则数组
      const rules = Array.isArray(response.data) ? response.data : []
      ruleList.value = rules
      pagination.total = rules.length
      updateStats()
    } else {
      ruleList.value = []
      pagination.total = 0
      updateStats()
      ElMessage.error(response.msg || '获取检测配置失败')
    }
  } catch (error) {
    console.error('获取检测配置失败:', error)
    ruleList.value = []
    pagination.total = 0
    updateStats()
    ElMessage.error('获取检测配置失败')
  } finally {
    loading.value = false
  }
}

// 更新统计数据
const updateStats = () => {
  if (!ruleList.value || !Array.isArray(ruleList.value)) {
    ruleStats.value.total = 0
    ruleStats.value.active = 0
    ruleStats.value.inactive = 0
    ruleStats.value.critical = 0
    return
  }

  ruleStats.value.total = ruleList.value.length
  ruleStats.value.active = ruleList.value.filter(rule => rule.is_active).length
  ruleStats.value.inactive = ruleList.value.filter(rule => !rule.is_active).length
  ruleStats.value.critical = ruleList.value.filter(rule => rule.sensitivity === 'high').length
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 工具函数
const getRuleTypeName = (type: string) => {
  const typeMap = ruleTypes.find(item => item.value === type)
  return typeMap ? typeMap.label : type
}

const getRiskLevelInfo = (level: string) => {
  return riskLevels.find(item => item.value === level) || { label: level, color: 'info' }
}

const getStatusColor = (status: string) => {
  return status === 'active' ? 'success' : 'danger'
}

// 数据加载
const loadData = () => {
  fetchRuleList()
}

// 事件处理函数


const addRule = () => {
  currentRule.value = {
    id: '',
    name: '',
    description: '',
    type: '',
    enabled: true,
    is_active: true,
    sensitivity: 'low',
    detection_interval: 300,
    threshold_high: 0,
    threshold_medium: 0,
    created_at: '',
    updated_at: ''
  } as unknown as DetectionConfig
  Object.assign(ruleForm, {
    name: '',
    description: '',
    type: 'login_anomaly',
    level: 'medium',
    status: 'active',
    conditions: {
      timeWindow: 300,
      threshold: 5,
      field: 'source_ip',
      operator: 'gt',
      value: ''
    },
    actions: {
      alert: true,
      email: false,
      block: false
    }
  })
  addDialogVisible.value = true
}

const editRule = (rule: DetectionConfig) => {
  currentRule.value = cloneDeep(rule)
  Object.assign(ruleForm, {
    name: rule.name,
    description: rule.description,
    type: rule.type,
    level: rule.priority === 1 ? 'critical' : rule.priority === 2 ? 'high' : rule.priority === 3 ? 'medium' : 'low',
    status: rule.enabled ? 'active' : 'inactive',
    conditions: {
      timeWindow: rule.config.time_window || 300,
      threshold: rule.config.threshold || 5,
      field: rule.config.conditions?.field || '',
      operator: rule.config.conditions?.operator || 'gt',
      value: rule.config.conditions?.value || ''
    },
    actions: {
      alert: rule.config.actions?.includes('send_alert') || false,
      email: rule.config.actions?.includes('send_email') || false,
      block: rule.config.actions?.includes('block_ip') || false
    }
  })
  editDialogVisible.value = true
}

const viewRule = (rule: DetectionConfig) => {
  // 转换API数据结构为前端期望的格式
  currentRule.value = {
    ...rule,
    sensitivity: rule.sensitivity || 'low',
    // @ts-ignore
    createTime: formatDateTime(rule.created_at),
    updateTime: formatDateTime(rule.updated_at),
    conditions: {
      field: 'source_ip', // API中没有这个字段，设置默认值
      operator: 'gt', // API中没有这个字段，设置默认值
      value: '' // API中没有这个字段，设置默认值
    },
    actions: {
      alert: true, // API中没有这个字段，设置默认值
      email: false, // API中没有这个字段，设置默认值
      block: false // API中没有这个字段，设置默认值
    }
  }
  viewDialogVisible.value = true
}

const deleteRule = async (rule: DetectionConfig) => {
  try {
    await ElMessageBox.confirm(`确认删除规则 "${rule.name}"？`, '确认删除', {
      type: 'warning'
    })
    // @ts-ignore
    const response = await deleteDetectionConfig({ id: rule.id })
    // @ts-ignore
    if (response.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      // @ts-ignore
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除规则失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const toggleRuleStatus = async (rule: DetectionConfig) => {
  const action = rule.is_active ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}规则 "${rule.name}"？`, `确认${action}`, {
      type: 'warning'
    })

    let response
    if (rule.is_active) {
      // 当前是启用状态，要禁用
      response = await deactivateDetectionConfig(rule.id)
    } else {
      // 当前是禁用状态，要启用
      response = await activateDetectionConfig(rule.id)
    }

    if (response.code === 200) {
      ElMessage.success(`${action}成功`)
      loadData()
    } else {
      ElMessage.error(response.msg || `${action}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}规则失败:`, error)
      ElMessage.error(`${action}失败`)
    }
  }
}

const saveRule = async () => {
  try {
    const actions = []
    if (ruleForm.actions.alert) actions.push('send_alert')
    if (ruleForm.actions.email) actions.push('send_email')
    if (ruleForm.actions.block) actions.push('block_ip')

    if (currentRule.value) {
      // 编辑模式
      const params: UpdateDetectionConfigBody = {
        name: ruleForm.name,
        description: ruleForm.description,
        enabled: ruleForm.status === 'active',
        priority: ruleForm.level === 'critical' ? 1 : ruleForm.level === 'high' ? 2 : ruleForm.level === 'medium' ? 3 : 4,
        config: {
          threshold: ruleForm.conditions.threshold,
          time_window: ruleForm.conditions.timeWindow,
          conditions: {
            field: ruleForm.conditions.field,
            operator: ruleForm.conditions.operator,
            value: ruleForm.conditions.value
          },
          actions: actions
        }
      }
      const response = await updateDetectionConfig(currentRule.value.id, params)
      if (response.code === 200) {
        ElMessage.success('规则更新成功')
        editDialogVisible.value = false
        loadData()
      } else {
        ElMessage.error(response.msg || '规则更新失败')
      }
    } else {
      // 新增模式
      const params: CreateDetectionConfigBody = {
        name: ruleForm.name,
        description: ruleForm.description,
        // @ts-ignore
        type: ruleForm.type,
        enabled: ruleForm.status === 'active',
        priority: ruleForm.level === 'critical' ? 1 : ruleForm.level === 'high' ? 2 : ruleForm.level === 'medium' ? 3 : 4,
        config: {
          threshold: ruleForm.conditions.threshold,
          time_window: ruleForm.conditions.timeWindow,
          conditions: {
            field: ruleForm.conditions.field,
            operator: ruleForm.conditions.operator,
            value: ruleForm.conditions.value
          },
          actions: actions
        }
      }
      const response = await createDetectionConfig(params)
      if (response.code === 200) {
        ElMessage.success('规则创建成功')
        addDialogVisible.value = false
        loadData()
      } else {
        ElMessage.error(response.msg || '规则创建失败')
      }
    }
  } catch (error) {
    console.error('保存规则失败:', error)
    ElMessage.error('保存规则失败')
  }
}

const testRule = () => {
  ElMessage.info('测试规则功能待实现')
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchRuleList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchRuleList()
}

const refreshData = () => {
  loadData()
  ElMessage.success('数据刷新成功')
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="rule-config-container p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">检测规则配置</h1>
      <p class="text-gray-600">管理异常检测规则，配置检测参数和响应动作</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.1 }">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">总规则数</p>
              <p class="text-2xl font-bold text-gray-900">{{ ruleStats.total }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <el-icon class="text-blue-600" size="24">
                <Setting />
              </el-icon>
            </div>
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.2 }">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">活跃规则</p>
              <p class="text-2xl font-bold text-green-600">{{ ruleStats.active }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <el-icon class="text-green-600" size="24">
                <CircleCheck />
              </el-icon>
            </div>
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.3 }">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">禁用规则</p>
              <p class="text-2xl font-bold text-red-600">{{ ruleStats.inactive }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <el-icon class="text-red-600" size="24">
                <CircleClose />
              </el-icon>
            </div>
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.4 }">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">严重规则</p>
              <p class="text-2xl font-bold text-purple-600">{{ ruleStats.critical }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <el-icon class="text-purple-600" size="24">
                <Warning />
              </el-icon>
            </div>
          </div>
        </div>
      </Motion>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- 搜索和操作栏 -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">

          </div>

          <div class="flex gap-2">
            <!-- <el-button @click="addRule" type="success">
              <el-icon>
                <Plus />
              </el-icon>
              添加规则
            </el-button> -->
            <el-button @click="refreshData">
              <el-icon>
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </div>

      <!-- 规则列表 -->
      <div class="p-6">
        <el-table :data="ruleList" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="name" label="配置名称" width="200" />
          <el-table-column prop="detection_interval" label="检测间隔">
            <template #default="{ row }">
              {{ row.detection_interval }}秒
            </template>
          </el-table-column>
          <el-table-column prop="sensitivity" label="敏感度">
            <template #default="{ row }">
              <el-tag
                :type="row.sensitivity === 'high' ? 'danger' : row.sensitivity === 'medium' ? 'warning' : 'success'"
                size="small">
                {{ row.sensitivity === 'high' ? '高' : row.sensitivity === 'medium' ? '中' : '低' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="阈值设置">
            <template #default="{ row }">
              <div class="text-xs">
                <div>高: {{ row.threshold_high }}</div>
                <div>中: {{ row.threshold_medium }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="is_active" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.is_active ? 'success' : 'danger'" size="small">
                {{ row.is_active ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" label="更新时间">
            <template #default="{ row }">
              {{ formatDateTime(row.updated_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="viewRule(row)">
                <el-icon>
                  <View />
                </el-icon>
                查看
              </el-button>
              <el-button size="small" :type="row.is_active ? 'warning' : 'success'" @click="toggleRuleStatus(row)">
                <el-icon>
                  <Switch />
                </el-icon>
                {{ row.is_active ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-6 flex justify-center">
          <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <!-- 添加规则对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加检测规则" width="800px">
      <el-form :model="ruleForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称">
              <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则类型">
              <el-select v-model="ruleForm.type" placeholder="请选择规则类型" class="w-full">
                <el-option v-for="type in ruleTypes" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="规则描述">
          <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入规则描述" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="风险等级">
              <el-select v-model="ruleForm.level" placeholder="请选择风险等级" class="w-full">
                <el-option v-for="level in riskLevels" :key="level.value" :label="level.label" :value="level.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则状态">
              <el-radio-group v-model="ruleForm.status">
                <el-radio label="active">启用</el-radio>
                <el-radio label="inactive">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">检测条件</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="时间窗口(秒)">
              <el-input-number v-model="ruleForm.conditions.timeWindow" :min="60" :max="3600" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="阈值">
              <el-input-number v-model="ruleForm.conditions.threshold" :min="1" :max="1000" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测字段">
              <el-input v-model="ruleForm.conditions.field" placeholder="如: source_ip" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作符">
              <el-select v-model="ruleForm.conditions.operator" placeholder="请选择操作符" class="w-full">
                <el-option v-for="op in operators" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="比较值">
              <el-input v-model="ruleForm.conditions.value" placeholder="请输入比较值" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">响应动作</el-divider>

        <el-form-item label="触发动作">
          <el-checkbox-group v-model="ruleForm.actions">
            <el-checkbox :true-label="true" :false-label="false" v-model="ruleForm.actions.alert">生成告警</el-checkbox>
            <el-checkbox :true-label="true" :false-label="false" v-model="ruleForm.actions.email">发送邮件</el-checkbox>
            <el-checkbox :true-label="true" :false-label="false" v-model="ruleForm.actions.block">阻断访问</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button @click="testRule">测试规则</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>

    <!-- 编辑规则对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑检测规则" width="800px">
      <el-form :model="ruleForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称">
              <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则类型">
              <el-select v-model="ruleForm.type" placeholder="请选择规则类型" class="w-full">
                <el-option v-for="type in ruleTypes" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="规则描述">
          <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入规则描述" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="风险等级">
              <el-select v-model="ruleForm.level" placeholder="请选择风险等级" class="w-full">
                <el-option v-for="level in riskLevels" :key="level.value" :label="level.label" :value="level.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则状态">
              <el-radio-group v-model="ruleForm.status">
                <el-radio label="active">启用</el-radio>
                <el-radio label="inactive">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">检测条件</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="时间窗口(秒)">
              <el-input-number v-model="ruleForm.conditions.timeWindow" :min="60" :max="3600" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="阈值">
              <el-input-number v-model="ruleForm.conditions.threshold" :min="1" :max="1000" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测字段">
              <el-input v-model="ruleForm.conditions.field" placeholder="如: source_ip" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作符">
              <el-select v-model="ruleForm.conditions.operator" placeholder="请选择操作符" class="w-full">
                <el-option v-for="op in operators" :key="op.value" :label="op.label" :value="op.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="比较值">
              <el-input v-model="ruleForm.conditions.value" placeholder="请输入比较值" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">响应动作</el-divider>

        <el-form-item label="触发动作">
          <el-checkbox-group v-model="ruleForm.actions">
            <el-checkbox :true-label="true" :false-label="false" v-model="ruleForm.actions.alert">生成告警</el-checkbox>
            <el-checkbox :true-label="true" :false-label="false" v-model="ruleForm.actions.email">发送邮件</el-checkbox>
            <el-checkbox :true-label="true" :false-label="false" v-model="ruleForm.actions.block">阻断访问</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button @click="testRule">测试规则</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>

    <!-- 查看规则对话框 -->
    <el-dialog v-model="viewDialogVisible" title="规则详情" width="700px">
      <div v-if="currentRule">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="规则名称">{{ currentRule.name }}</el-descriptions-item>
          <el-descriptions-item label="规则类型">{{ getRuleTypeName(currentRule.type) }}</el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <!-- @vue-ignore -->
            <el-tag :type="getRiskLevelInfo(currentRule.level).color" size="small">
              <!-- @vue-ignore -->
              {{ getRiskLevelInfo(currentRule.level).label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <!-- @vue-ignore -->
            <el-tag :type="getStatusColor(currentRule.status)" size="small">
              <!-- @vue-ignore -->
              {{ currentRule.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="触发次数">{{ currentRule.triggerCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentRule.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ currentRule.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="规则描述" :span="2">{{ currentRule.description }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">检测条件</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="时间窗口">{{ currentRule.conditions.timeWindow }}秒</el-descriptions-item>
          <el-descriptions-item label="阈值">{{ currentRule.conditions.threshold }}</el-descriptions-item>
          <el-descriptions-item label="检测字段">{{ currentRule.conditions.field }}</el-descriptions-item>
          <!-- @vue-ignore -->
          <el-descriptions-item label="操作符">
            <!-- @vue-ignore -->
            {{operators.find(op => op.value === currentRule.conditions.operator)?.label
            }}</el-descriptions-item>
          <el-descriptions-item label="比较值" :span="2">{{ currentRule.conditions.value }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">响应动作</el-divider>
        <div class="flex gap-4">
          <el-tag v-if="currentRule.actions.alert" type="success">生成告警</el-tag>
          <el-tag v-if="currentRule.actions.email" type="warning">发送邮件</el-tag>
          <el-tag v-if="currentRule.actions.block" type="danger">阻断访问</el-tag>
        </div>
      </div>

      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
        <!-- @vue-ignore -->
        <el-button type="primary" @click="editRule(currentRule)">编辑规则</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.rule-config-container {
  min-height: 100vh;
}
</style>