<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
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
const ruleList = ref([])
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentRule = ref(null)
const activeTab = ref('rules')

// 规则统计数据
const ruleStats = ref({
  total: 24,
  active: 18,
  inactive: 6,
  critical: 8
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  type: '',
  level: ''
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

// 初始化规则数据
const initRuleList = () => {
  ruleList.value = [
    {
      id: 1,
      name: '异常登录检测',
      description: '检测短时间内多次登录失败的异常行为',
      type: 'login_anomaly',
      level: 'high',
      status: 'active',
      createTime: '2024-01-10 10:30:00',
      updateTime: '2024-01-15 14:20:00',
      triggerCount: 156,
      conditions: {
        timeWindow: 300,
        threshold: 5,
        field: 'login_attempts',
        operator: 'gt',
        value: '5'
      },
      actions: {
        alert: true,
        email: true,
        block: false
      }
    },
    {
      id: 2,
      name: '暴力破解检测',
      description: '检测针对SSH服务的暴力破解攻击',
      type: 'brute_force',
      level: 'critical',
      status: 'active',
      createTime: '2024-01-08 09:15:00',
      updateTime: '2024-01-14 16:45:00',
      triggerCount: 89,
      conditions: {
        timeWindow: 600,
        threshold: 10,
        field: 'ssh_attempts',
        operator: 'gte',
        value: '10'
      },
      actions: {
        alert: true,
        email: true,
        block: true
      }
    },
    {
      id: 3,
      name: '异常访问检测',
      description: '检测非工作时间的系统访问行为',
      type: 'abnormal_access',
      level: 'medium',
      status: 'active',
      createTime: '2024-01-05 14:20:00',
      updateTime: '2024-01-12 11:30:00',
      triggerCount: 23,
      conditions: {
        timeWindow: 3600,
        threshold: 1,
        field: 'access_time',
        operator: 'regex',
        value: '^(0[0-6]|2[2-3]):[0-5][0-9]'
      },
      actions: {
        alert: true,
        email: false,
        block: false
      }
    },
    {
      id: 4,
      name: '权限提升检测',
      description: '检测用户权限异常提升行为',
      type: 'privilege_escalation',
      level: 'high',
      status: 'inactive',
      createTime: '2024-01-03 16:45:00',
      updateTime: '2024-01-10 09:20:00',
      triggerCount: 12,
      conditions: {
        timeWindow: 1800,
        threshold: 3,
        field: 'sudo_commands',
        operator: 'gt',
        value: '3'
      },
      actions: {
        alert: true,
        email: true,
        block: false
      }
    }
  ]
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
const loadData = async () => {
  loading.value = true
  setTimeout(() => {
    initRuleList()
    loading.value = false
  }, 1000)
}

// 事件处理函数
const handleSearch = () => {
  pagination.currentPage = 1
  ElMessage.info('搜索功能待实现')
}

const resetSearch = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    type: '',
    level: ''
  })
  handleSearch()
}

const addRule = () => {
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

const editRule = (rule: any) => {
  currentRule.value = cloneDeep(rule)
  Object.assign(ruleForm, currentRule.value)
  editDialogVisible.value = true
}

const viewRule = (rule: any) => {
  currentRule.value = cloneDeep(rule)
  viewDialogVisible.value = true
}

const deleteRule = async (rule: any) => {
  try {
    await ElMessageBox.confirm(`确认删除规则 "${rule.name}"？`, '确认删除', {
      type: 'warning'
    })
    const index = ruleList.value.findIndex(item => item.id === rule.id)
    if (index > -1) {
      ruleList.value.splice(index, 1)
      ruleStats.value.total--
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消
  }
}

const toggleRuleStatus = async (rule: any) => {
  const action = rule.status === 'active' ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}规则 "${rule.name}"？`, `确认${action}`, {
      type: 'warning'
    })
    rule.status = rule.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  } catch {
    // 用户取消
  }
}

const saveRule = () => {
  // 保存规则逻辑
  ElMessage.success('规则保存成功')
  addDialogVisible.value = false
  editDialogVisible.value = false
  loadData()
}

const testRule = () => {
  ElMessage.info('规则测试功能待实现')
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
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
              <el-icon class="text-blue-600" size="24"><Setting /></el-icon>
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
              <el-icon class="text-green-600" size="24"><CircleCheck /></el-icon>
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
              <el-icon class="text-red-600" size="24"><CircleClose /></el-icon>
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
              <el-icon class="text-purple-600" size="24"><Warning /></el-icon>
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
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索规则名称或描述"
              class="w-full sm:w-64"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select v-model="searchForm.status" placeholder="状态" class="w-full sm:w-32" clearable>
              <el-option label="活跃" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
            
            <el-select v-model="searchForm.type" placeholder="类型" class="w-full sm:w-40" clearable>
              <el-option v-for="type in ruleTypes" :key="type.value" :label="type.label" :value="type.value" />
            </el-select>
            
            <el-select v-model="searchForm.level" placeholder="风险等级" class="w-full sm:w-32" clearable>
              <el-option v-for="level in riskLevels" :key="level.value" :label="level.label" :value="level.value" />
            </el-select>
          </div>
          
          <div class="flex gap-2">
            <el-button @click="handleSearch" type="primary">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
            <el-button @click="addRule" type="success">
              <el-icon><Plus /></el-icon>
              添加规则
            </el-button>
            <el-button @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </div>

      <!-- 规则列表 -->
      <div class="p-6">
        <el-table :data="ruleList" v-loading="loading" stripe>
          <el-table-column prop="name" label="规则名称" width="200" />
          <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <el-tag size="small">
                {{ getRuleTypeName(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="风险等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getRiskLevelInfo(row.level).color" size="small">
                {{ getRiskLevelInfo(row.level).label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="getStatusColor(row.status)" size="small">
                {{ row.status === 'active' ? '活跃' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="triggerCount" label="触发次数" width="100" />
          <el-table-column prop="updateTime" label="更新时间" width="160" />
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="viewRule(row)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button size="small" @click="editRule(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" :type="row.status === 'active' ? 'warning' : 'success'" @click="toggleRuleStatus(row)">
                <el-icon><Switch /></el-icon>
                {{ row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
              <el-button size="small" type="danger" @click="deleteRule(row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-6 flex justify-center">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
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
            <el-tag :type="getRiskLevelInfo(currentRule.level).color" size="small">
              {{ getRiskLevelInfo(currentRule.level).label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusColor(currentRule.status)" size="small">
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
          <el-descriptions-item label="操作符">{{ operators.find(op => op.value === currentRule.conditions.operator)?.label }}</el-descriptions-item>
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