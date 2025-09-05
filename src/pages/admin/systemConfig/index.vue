<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Setting,
  Message,
  Monitor,
  Bell,
  Lock,
  Key,
  Clock,
  Notification
} from '@element-plus/icons-vue'

// 响应式数据
const activeTab = ref('detection')
const loading = ref(false)

// 检测配置
const detectionConfig = reactive({
  enabled: true,
  scanInterval: 60,
  maxConcurrent: 10,
  timeout: 30,
  retryCount: 3,
  logLevel: 'info',
  enableRealtime: true,
  enableBatch: false,
  batchSize: 1000,
  enableCache: true,
  cacheExpire: 300
})

// 通知配置
const notificationConfig = reactive({
  email: {
    enabled: true,
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    username: 'admin@example.com',
    password: '',
    ssl: true,
    fromName: '异常检测系统',
    recipients: ['admin@example.com']
  },
  webhook: {
    enabled: false,
    url: '',
    method: 'POST',
    headers: {},
    timeout: 10
  },
  sms: {
    enabled: false,
    provider: 'aliyun',
    accessKey: '',
    secretKey: '',
    signName: '异常检测',
    templateCode: 'SMS_123456789',
    phones: []
  }
})

// 安全配置
const securityConfig = reactive({
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expireDays: 90
  },
  sessionConfig: {
    timeout: 30,
    maxSessions: 5,
    enableRememberMe: true,
    rememberMeDays: 7
  },
  ipWhitelist: {
    enabled: false,
    ips: []
  },
  accessControl: {
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableCaptcha: true
  }
})

// 系统配置
const systemConfig = reactive({
  general: {
    systemName: '异常检测系统',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss'
  },
  performance: {
    maxMemoryUsage: 80,
    maxCpuUsage: 90,
    maxDiskUsage: 85,
    enableMonitoring: true,
    monitorInterval: 60
  },
  storage: {
    dataRetentionDays: 90,
    logRetentionDays: 30,
    enableCompression: true,
    enableEncryption: false
  }
})

// 标签页配置
const tabList = [
  {
    key: 'detection',
    label: '检测配置',
    icon: 'Monitor'
  },
  {
    key: 'notification',
    label: '通知配置',
    icon: 'Bell'
  },
  {
    key: 'security',
    label: '安全配置',
    icon: 'Shield'
  },
  {
    key: 'system',
    label: '系统配置',
    icon: 'Setting'
  }
]

// 事件处理函数
const handleTabChange = (tabKey: string) => {
  activeTab.value = tabKey
}

const saveDetectionConfig = async () => {
  loading.value = true
  try {
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('检测配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const saveNotificationConfig = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('通知配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const saveSecurityConfig = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('安全配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const saveSystemConfig = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('系统配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const testEmailConfig = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('邮件测试发送成功')
  } catch (error) {
    ElMessage.error('邮件测试失败')
  } finally {
    loading.value = false
  }
}

const testWebhook = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    ElMessage.success('Webhook测试成功')
  } catch (error) {
    ElMessage.error('Webhook测试失败')
  } finally {
    loading.value = false
  }
}

const addRecipient = () => {
  notificationConfig.email.recipients.push('')
}

const removeRecipient = (index: number) => {
  notificationConfig.email.recipients.splice(index, 1)
}

const addWhitelistIp = () => {
  securityConfig.ipWhitelist.ips.push('')
}

const removeWhitelistIp = (index: number) => {
  securityConfig.ipWhitelist.ips.splice(index, 1)
}

const resetToDefault = async () => {
  try {
    await ElMessageBox.confirm('确认重置所有配置为默认值？此操作不可撤销。', '确认重置', {
      type: 'warning'
    })
    // 重置逻辑
    ElMessage.success('配置已重置为默认值')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  // 初始化配置数据
})
</script>

<template>
  <div class="system-config-container p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">系统配置管理</h1>
      <p class="text-gray-600">管理系统检测配置、通知配置、安全配置等</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- 标签页 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="p-6">
        <el-tab-pane v-for="tab in tabList" :key="tab.key" :label="tab.label" :name="tab.key">
          <template #label>
            <div class="flex items-center gap-2">
              <el-icon>
                <component :is="tab.icon" />
              </el-icon>
              <span>{{ tab.label }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 检测配置 -->
      <div v-if="activeTab === 'detection'" class="p-6 pt-0">
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }">
          <el-form :model="detectionConfig" label-width="150px">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">基础配置</h3>

                <el-form-item label="启用检测">
                  <el-switch v-model="detectionConfig.enabled" />
                </el-form-item>

                <el-form-item label="扫描间隔(秒)">
                  <el-input-number v-model="detectionConfig.scanInterval" :min="10" :max="3600" class="w-full" />
                </el-form-item>

                <el-form-item label="最大并发数">
                  <el-input-number v-model="detectionConfig.maxConcurrent" :min="1" :max="100" class="w-full" />
                </el-form-item>

                <el-form-item label="超时时间(秒)">
                  <el-input-number v-model="detectionConfig.timeout" :min="5" :max="300" class="w-full" />
                </el-form-item>

                <el-form-item label="重试次数">
                  <el-input-number v-model="detectionConfig.retryCount" :min="0" :max="10" class="w-full" />
                </el-form-item>

                <el-form-item label="日志级别">
                  <el-select v-model="detectionConfig.logLevel" class="w-full">
                    <el-option label="调试" value="debug" />
                    <el-option label="信息" value="info" />
                    <el-option label="警告" value="warn" />
                    <el-option label="错误" value="error" />
                  </el-select>
                </el-form-item>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">高级配置</h3>

                <el-form-item label="实时检测">
                  <el-switch v-model="detectionConfig.enableRealtime" />
                </el-form-item>

                <el-form-item label="批量处理">
                  <el-switch v-model="detectionConfig.enableBatch" />
                </el-form-item>

                <el-form-item label="批量大小" v-if="detectionConfig.enableBatch">
                  <el-input-number v-model="detectionConfig.batchSize" :min="100" :max="10000" class="w-full" />
                </el-form-item>

                <el-form-item label="启用缓存">
                  <el-switch v-model="detectionConfig.enableCache" />
                </el-form-item>

                <el-form-item label="缓存过期(秒)" v-if="detectionConfig.enableCache">
                  <el-input-number v-model="detectionConfig.cacheExpire" :min="60" :max="3600" class="w-full" />
                </el-form-item>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <el-button type="primary" @click="saveDetectionConfig" :loading="loading">
                <el-icon>
                  <Setting />
                </el-icon>
                保存配置
              </el-button>
            </div>
          </el-form>
        </Motion>
      </div>

      <!-- 通知配置 -->
      <div v-if="activeTab === 'notification'" class="p-6 pt-0">
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }">
          <el-tabs type="card">
            <!-- 邮件配置 -->
            <el-tab-pane label="邮件通知" name="email">
              <el-form :model="notificationConfig.email" label-width="120px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="启用邮件">
                      <el-switch v-model="notificationConfig.email.enabled" />
                    </el-form-item>

                    <el-form-item label="SMTP服务器">
                      <el-input v-model="notificationConfig.email.smtpHost" placeholder="smtp.example.com" />
                    </el-form-item>

                    <el-form-item label="SMTP端口">
                      <el-input-number v-model="notificationConfig.email.smtpPort" :min="1" :max="65535"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="用户名">
                      <el-input v-model="notificationConfig.email.username" placeholder="admin@example.com" />
                    </el-form-item>

                    <el-form-item label="密码">
                      <el-input v-model="notificationConfig.email.password" type="password" show-password />
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="启用SSL">
                      <el-switch v-model="notificationConfig.email.ssl" />
                    </el-form-item>

                    <el-form-item label="发件人名称">
                      <el-input v-model="notificationConfig.email.fromName" />
                    </el-form-item>

                    <el-form-item label="收件人列表">
                      <div class="space-y-2">
                        <div v-for="(recipient, index) in notificationConfig.email.recipients" :key="index"
                          class="flex gap-2">
                          <el-input v-model="notificationConfig.email.recipients[index]"
                            placeholder="email@example.com" />
                          <el-button type="danger" @click="removeRecipient(index)"
                            :disabled="notificationConfig.email.recipients.length <= 1">
                            删除
                          </el-button>
                        </div>
                        <el-button @click="addRecipient" type="primary" plain>
                          <el-icon>
                            <Plus />
                          </el-icon>
                          添加收件人
                        </el-button>
                      </div>
                    </el-form-item>
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-2">
                  <el-button @click="testEmailConfig" :loading="loading">
                    <el-icon>
                      <Message />
                    </el-icon>
                    测试邮件
                  </el-button>
                  <el-button type="primary" @click="saveNotificationConfig" :loading="loading">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    保存配置
                  </el-button>
                </div>
              </el-form>
            </el-tab-pane>

            <!-- Webhook配置 -->
            <el-tab-pane label="Webhook" name="webhook">
              <el-form :model="notificationConfig.webhook" label-width="120px">
                <el-form-item label="启用Webhook">
                  <el-switch v-model="notificationConfig.webhook.enabled" />
                </el-form-item>

                <el-form-item label="Webhook URL">
                  <el-input v-model="notificationConfig.webhook.url" placeholder="https://example.com/webhook" />
                </el-form-item>

                <el-form-item label="请求方法">
                  <el-select v-model="notificationConfig.webhook.method" class="w-32">
                    <el-option label="POST" value="POST" />
                    <el-option label="PUT" value="PUT" />
                  </el-select>
                </el-form-item>

                <el-form-item label="超时时间(秒)">
                  <el-input-number v-model="notificationConfig.webhook.timeout" :min="1" :max="60" class="w-full" />
                </el-form-item>

                <div class="mt-6 flex justify-end gap-2">
                  <el-button @click="testWebhook" :loading="loading">
                    <el-icon>
                      <Globe />
                    </el-icon>
                    测试Webhook
                  </el-button>
                  <el-button type="primary" @click="saveNotificationConfig" :loading="loading">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    保存配置
                  </el-button>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </Motion>
      </div>

      <!-- 安全配置 -->
      <div v-if="activeTab === 'security'" class="p-6 pt-0">
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }">
          <el-tabs type="card">
            <!-- 密码策略 -->
            <el-tab-pane label="密码策略" name="password">
              <el-form :model="securityConfig.passwordPolicy" label-width="150px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="最小长度">
                      <el-input-number v-model="securityConfig.passwordPolicy.minLength" :min="6" :max="32"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="必须包含大写字母">
                      <el-switch v-model="securityConfig.passwordPolicy.requireUppercase" />
                    </el-form-item>

                    <el-form-item label="必须包含小写字母">
                      <el-switch v-model="securityConfig.passwordPolicy.requireLowercase" />
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="必须包含数字">
                      <el-switch v-model="securityConfig.passwordPolicy.requireNumbers" />
                    </el-form-item>

                    <el-form-item label="必须包含特殊字符">
                      <el-switch v-model="securityConfig.passwordPolicy.requireSpecialChars" />
                    </el-form-item>

                    <el-form-item label="密码过期天数">
                      <el-input-number v-model="securityConfig.passwordPolicy.expireDays" :min="30" :max="365"
                        class="w-full" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>

            <!-- 会话配置 -->
            <el-tab-pane label="会话配置" name="session">
              <el-form :model="securityConfig.sessionConfig" label-width="150px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="会话超时(分钟)">
                      <el-input-number v-model="securityConfig.sessionConfig.timeout" :min="5" :max="480"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="最大会话数">
                      <el-input-number v-model="securityConfig.sessionConfig.maxSessions" :min="1" :max="10"
                        class="w-full" />
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="启用记住我">
                      <el-switch v-model="securityConfig.sessionConfig.enableRememberMe" />
                    </el-form-item>

                    <el-form-item label="记住我天数" v-if="securityConfig.sessionConfig.enableRememberMe">
                      <el-input-number v-model="securityConfig.sessionConfig.rememberMeDays" :min="1" :max="30"
                        class="w-full" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>

            <!-- 访问控制 -->
            <el-tab-pane label="访问控制" name="access">
              <el-form :model="securityConfig.accessControl" label-width="150px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="启用双因子认证">
                      <el-switch v-model="securityConfig.accessControl.enableTwoFactor" />
                    </el-form-item>

                    <el-form-item label="最大登录尝试次数">
                      <el-input-number v-model="securityConfig.accessControl.maxLoginAttempts" :min="3" :max="10"
                        class="w-full" />
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="锁定时长(分钟)">
                      <el-input-number v-model="securityConfig.accessControl.lockoutDuration" :min="5" :max="60"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="启用验证码">
                      <el-switch v-model="securityConfig.accessControl.enableCaptcha" />
                    </el-form-item>
                  </div>
                </div>

                <!-- IP白名单 -->
                <el-divider content-position="left">IP白名单</el-divider>
                <el-form-item label="启用IP白名单">
                  <el-switch v-model="securityConfig.ipWhitelist.enabled" />
                </el-form-item>

                <el-form-item label="白名单IP" v-if="securityConfig.ipWhitelist.enabled">
                  <div class="space-y-2">
                    <div v-for="(ip, index) in securityConfig.ipWhitelist.ips" :key="index" class="flex gap-2">
                      <el-input v-model="securityConfig.ipWhitelist.ips[index]" placeholder="192.168.1.1" />
                      <el-button type="danger" @click="removeWhitelistIp(index)">
                        删除
                      </el-button>
                    </div>
                    <el-button @click="addWhitelistIp" type="primary" plain>
                      <el-icon>
                        <Plus />
                      </el-icon>
                      添加IP
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          <div class="mt-6 flex justify-end">
            <el-button type="primary" @click="saveSecurityConfig" :loading="loading">
              <el-icon>
                <Shield />
              </el-icon>
              保存安全配置
            </el-button>
          </div>
        </Motion>
      </div>

      <!-- 系统配置 -->
      <div v-if="activeTab === 'system'" class="p-6 pt-0">
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }">
          <el-tabs type="card">
            <!-- 基础配置 -->
            <el-tab-pane label="基础配置" name="general">
              <el-form :model="systemConfig.general" label-width="120px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="系统名称">
                      <el-input v-model="systemConfig.general.systemName" />
                    </el-form-item>

                    <el-form-item label="时区">
                      <el-select v-model="systemConfig.general.timezone" class="w-full">
                        <el-option label="Asia/Shanghai" value="Asia/Shanghai" />
                        <el-option label="UTC" value="UTC" />
                        <el-option label="America/New_York" value="America/New_York" />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="语言">
                      <el-select v-model="systemConfig.general.language" class="w-full">
                        <el-option label="中文" value="zh-CN" />
                        <el-option label="English" value="en-US" />
                      </el-select>
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="日期格式">
                      <el-select v-model="systemConfig.general.dateFormat" class="w-full">
                        <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                        <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
                        <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="时间格式">
                      <el-select v-model="systemConfig.general.timeFormat" class="w-full">
                        <el-option label="24小时制" value="HH:mm:ss" />
                        <el-option label="12小时制" value="hh:mm:ss A" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>

            <!-- 性能配置 -->
            <el-tab-pane label="性能配置" name="performance">
              <el-form :model="systemConfig.performance" label-width="150px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="最大内存使用率(%)">
                      <el-input-number v-model="systemConfig.performance.maxMemoryUsage" :min="50" :max="95"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="最大CPU使用率(%)">
                      <el-input-number v-model="systemConfig.performance.maxCpuUsage" :min="50" :max="95"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="最大磁盘使用率(%)">
                      <el-input-number v-model="systemConfig.performance.maxDiskUsage" :min="50" :max="95"
                        class="w-full" />
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="启用性能监控">
                      <el-switch v-model="systemConfig.performance.enableMonitoring" />
                    </el-form-item>

                    <el-form-item label="监控间隔(秒)" v-if="systemConfig.performance.enableMonitoring">
                      <el-input-number v-model="systemConfig.performance.monitorInterval" :min="30" :max="300"
                        class="w-full" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>

            <!-- 存储配置 -->
            <el-tab-pane label="存储配置" name="storage">
              <el-form :model="systemConfig.storage" label-width="150px">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <el-form-item label="数据保留天数">
                      <el-input-number v-model="systemConfig.storage.dataRetentionDays" :min="30" :max="365"
                        class="w-full" />
                    </el-form-item>

                    <el-form-item label="日志保留天数">
                      <el-input-number v-model="systemConfig.storage.logRetentionDays" :min="7" :max="90"
                        class="w-full" />
                    </el-form-item>
                  </div>

                  <div class="space-y-4">
                    <el-form-item label="启用压缩">
                      <el-switch v-model="systemConfig.storage.enableCompression" />
                    </el-form-item>

                    <el-form-item label="启用加密">
                      <el-switch v-model="systemConfig.storage.enableEncryption" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          <div class="mt-6 flex justify-between">
            <el-button @click="resetToDefault" type="warning">
              <el-icon>
                <Refresh />
              </el-icon>
              重置为默认
            </el-button>
            <el-button type="primary" @click="saveSystemConfig" :loading="loading">
              <el-icon>
                <Setting />
              </el-icon>
              保存系统配置
            </el-button>
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-config {
  .el-card {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .config-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 24px;
      border-bottom: 2px solid #f0f2f5;
    }

    :deep(.el-tabs__nav-wrap) {
      &::after {
        display: none;
      }
    }

    :deep(.el-tabs__item) {
      font-size: 16px;
      font-weight: 500;
      padding: 0 24px;
      height: 48px;
      line-height: 48px;
      transition: all 0.3s ease;

      &:hover {
        color: var(--el-color-primary);
        transform: translateY(-2px);
      }

      &.is-active {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }

    :deep(.el-tabs__active-bar) {
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
    }
  }

  .config-content {
    min-height: 400px;
  }
}
</style>