<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">邮件通知配置</h1>
      <p class="text-base-content/70">配置SMTP服务器和通知规则，及时接收安全警报</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- SMTP服务器配置 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-xl mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            SMTP服务器配置
          </h2>
          
          <form @submit.prevent="saveSMTPConfig" class="space-y-4">
            <!-- 服务器地址 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">SMTP服务器地址</span>
                <span class="label-text-alt text-error" v-if="!smtpConfig.host">*必填</span>
              </label>
              <input type="text" v-model="smtpConfig.host" 
                     class="input input-bordered w-full" 
                     placeholder="smtp.gmail.com" 
                     :class="{ 'input-error': !smtpConfig.host && showValidation }" />
            </div>

            <!-- 端口号 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">端口号</span>
                <span class="label-text-alt">常用: 587(TLS), 465(SSL), 25</span>
              </label>
              <input type="number" v-model="smtpConfig.port" 
                     class="input input-bordered w-full" 
                     placeholder="587" />
            </div>

            <!-- 安全连接 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">安全连接</span>
              </label>
              <div class="join w-full">
                <input class="join-item btn" type="radio" name="security" 
                       aria-label="无" v-model="smtpConfig.security" value="none" />
                <input class="join-item btn" type="radio" name="security" 
                       aria-label="TLS" v-model="smtpConfig.security" value="tls" />
                <input class="join-item btn" type="radio" name="security" 
                       aria-label="SSL" v-model="smtpConfig.security" value="ssl" />
              </div>
            </div>

            <!-- 用户名 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">用户名</span>
                <span class="label-text-alt text-error" v-if="!smtpConfig.username">*必填</span>
              </label>
              <input type="text" v-model="smtpConfig.username" 
                     class="input input-bordered w-full" 
                     placeholder="your-email@gmail.com" 
                     :class="{ 'input-error': !smtpConfig.username && showValidation }" />
            </div>

            <!-- 密码 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">密码/应用专用密码</span>
                <span class="label-text-alt text-error" v-if="!smtpConfig.password">*必填</span>
              </label>
              <div class="join w-full">
                <input :type="showPassword ? 'text' : 'password'" 
                       v-model="smtpConfig.password" 
                       class="input input-bordered join-item flex-1" 
                       placeholder="输入密码或应用专用密码" 
                       :class="{ 'input-error': !smtpConfig.password && showValidation }" />
                <button type="button" class="btn btn-outline join-item" 
                        @click="showPassword = !showPassword">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          :d="showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 发件人信息 -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">发件人名称</span>
              </label>
              <input type="text" v-model="smtpConfig.fromName" 
                     class="input input-bordered w-full" 
                     placeholder="安全监控系统" />
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3 pt-4">
              <button type="button" class="btn btn-outline flex-1" 
                      @click="testConnection" :disabled="testingConnection">
                <span v-if="testingConnection" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ testingConnection ? '测试中...' : '测试连接' }}
              </button>
              
              <button type="submit" class="btn btn-primary flex-1" :disabled="savingConfig">
                <span v-if="savingConfig" class="loading loading-spinner loading-sm mr-2"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                {{ savingConfig ? '保存中...' : '保存配置' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 收件人管理 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between items-center mb-6">
            <h2 class="card-title text-xl flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              收件人管理
            </h2>
            <button class="btn btn-primary btn-sm" @click="showAddRecipient = true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              添加收件人
            </button>
          </div>

          <!-- 添加收件人表单 -->
          <div v-if="showAddRecipient" class="card bg-base-200 mb-4">
            <div class="card-body p-4">
              <h3 class="font-medium mb-3">添加新收件人</h3>
              <form @submit.prevent="addRecipient" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" v-model="newRecipient.name" 
                         class="input input-bordered input-sm" 
                         placeholder="姓名" required />
                  <input type="email" v-model="newRecipient.email" 
                         class="input input-bordered input-sm" 
                         placeholder="邮箱地址" required />
                </div>
                <div class="flex gap-2">
                  <button type="submit" class="btn btn-primary btn-sm">添加</button>
                  <button type="button" class="btn btn-ghost btn-sm" 
                          @click="showAddRecipient = false">取消</button>
                </div>
              </form>
            </div>
          </div>

          <!-- 收件人列表 -->
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-if="recipients.length === 0" class="text-center py-8">
              <div class="text-4xl opacity-20 mb-2">📧</div>
              <p class="text-base-content/60">暂无收件人</p>
              <p class="text-sm text-base-content/40 mt-1">点击上方按钮添加收件人</p>
            </div>
            
            <div v-for="recipient in recipients" :key="recipient.id" 
                 class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
              <div class="flex items-center gap-3">
                <div class="avatar placeholder">
                  <div class="w-10 h-10 rounded-full bg-primary text-primary-content text-sm">
                    {{ recipient.name.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <div>
                  <div class="font-medium">{{ recipient.name }}</div>
                  <div class="text-sm opacity-70">{{ recipient.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <input type="checkbox" v-model="recipient.enabled" 
                           class="toggle toggle-primary toggle-sm" />
                  </label>
                </div>
                <button class="btn btn-ghost btn-sm text-error" 
                        @click="removeRecipient(recipient.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知规则配置 -->
    <div class="card bg-base-100 shadow-xl mt-6">
      <div class="card-body">
        <h2 class="card-title text-xl mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 1h5v5H4V1zm0 7h5v5H4V8zm7-7h5v5h-5V1zm0 7h5v5h-5V8z"></path>
          </svg>
          通知规则配置
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 风险等级通知 -->
          <div>
            <h3 class="font-medium mb-4">按风险等级通知</h3>
            <div class="space-y-3">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text flex items-center">
                    <div class="w-3 h-3 bg-error rounded-full mr-2"></div>
                    高危事件
                  </span>
                  <input type="checkbox" v-model="notificationRules.highRisk" 
                         class="toggle toggle-error" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text flex items-center">
                    <div class="w-3 h-3 bg-warning rounded-full mr-2"></div>
                    中危事件
                  </span>
                  <input type="checkbox" v-model="notificationRules.mediumRisk" 
                         class="toggle toggle-warning" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text flex items-center">
                    <div class="w-3 h-3 bg-info rounded-full mr-2"></div>
                    低危事件
                  </span>
                  <input type="checkbox" v-model="notificationRules.lowRisk" 
                         class="toggle toggle-info" />
                </label>
              </div>
            </div>
          </div>

          <!-- 通知频率 -->
          <div>
            <h3 class="font-medium mb-4">通知频率</h3>
            <div class="space-y-3">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">即时通知</span>
                  <input type="radio" name="frequency" value="immediate" 
                         v-model="notificationRules.frequency" 
                         class="radio radio-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">每小时汇总</span>
                  <input type="radio" name="frequency" value="hourly" 
                         v-model="notificationRules.frequency" 
                         class="radio radio-primary" />
                </label>
              </div>
              
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text">每日汇总</span>
                  <input type="radio" name="frequency" value="daily" 
                         v-model="notificationRules.frequency" 
                         class="radio radio-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 邮件模板预览 -->
        <div class="mt-6">
          <h3 class="font-medium mb-4">邮件模板预览</h3>
          <div class="mockup-window border bg-base-300">
            <div class="flex justify-center px-4 py-16 bg-base-200">
              <div class="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
                <div class="border-b pb-4 mb-4">
                  <h2 class="text-lg font-bold text-gray-800">🚨 安全警报通知</h2>
                  <p class="text-sm text-gray-600">{{ new Date().toLocaleString('zh-CN') }}</p>
                </div>
                <div class="space-y-3">
                  <div class="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <h3 class="font-medium text-red-800">暴力破解检测</h3>
                    <p class="text-sm text-red-700">IP 192.168.1.100 在5分钟内尝试登录失败15次</p>
                    <p class="text-xs text-red-600 mt-1">风险等级: 高危</p>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t text-xs text-gray-500">
                  <p>此邮件由恶意登录异常检测系统自动发送</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <button class="btn btn-outline" @click="sendTestEmail" :disabled="sendingTest">
            <span v-if="sendingTest" class="loading loading-spinner loading-sm mr-2"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {{ sendingTest ? '发送中...' : '发送测试邮件' }}
          </button>
          
          <button class="btn btn-primary" @click="saveNotificationRules" :disabled="savingRules">
            <span v-if="savingRules" class="loading loading-spinner loading-sm mr-2"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            {{ savingRules ? '保存中...' : '保存规则' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 通知历史记录 -->
    <div class="card bg-base-100 shadow-xl mt-6">
      <div class="card-body">
        <div class="flex justify-between items-center mb-6">
          <h2 class="card-title text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            通知历史记录
          </h2>
          <button class="btn btn-ghost btn-sm" @click="refreshHistory">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            刷新
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>发送时间</th>
                <th>收件人</th>
                <th>主题</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in notificationHistory" :key="record.id">
                <td>{{ record.sentAt }}</td>
                <td>{{ record.recipient }}</td>
                <td>{{ record.subject }}</td>
                <td>
                  <div class="badge badge-sm"
                       :class="{
                         'badge-success': record.status === 'sent',
                         'badge-error': record.status === 'failed',
                         'badge-warning': record.status === 'pending'
                       }">
                    {{ record.status === 'sent' ? '已发送' : record.status === 'failed' ? '发送失败' : '发送中' }}
                  </div>
                </td>
                <td>
                  <button v-if="record.status === 'failed'" 
                          class="btn btn-ghost btn-xs text-primary"
                          @click="resendEmail(record.id)">
                    重发
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// SMTP配置
const smtpConfig = reactive({
  host: '',
  port: 587,
  security: 'tls',
  username: '',
  password: '',
  fromName: '安全监控系统'
})

// 状态管理
const showPassword = ref(false)
const showValidation = ref(false)
const testingConnection = ref(false)
const savingConfig = ref(false)
const sendingTest = ref(false)
const savingRules = ref(false)

// 收件人管理
const showAddRecipient = ref(false)
const newRecipient = reactive({
  name: '',
  email: ''
})

const recipients = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', enabled: true },
  { id: 2, name: '李四', email: 'lisi@example.com', enabled: true },
  { id: 3, name: '王五', email: 'wangwu@example.com', enabled: false }
])

// 通知规则
const notificationRules = reactive({
  highRisk: true,
  mediumRisk: true,
  lowRisk: false,
  frequency: 'immediate'
})

// 通知历史
const notificationHistory = ref([
  {
    id: 1,
    sentAt: '2024-01-15 14:30:25',
    recipient: 'zhangsan@example.com',
    subject: '🚨 高危安全警报',
    status: 'sent'
  },
  {
    id: 2,
    sentAt: '2024-01-15 13:45:12',
    recipient: 'lisi@example.com',
    subject: '⚠️ 中危安全警报',
    status: 'sent'
  },
  {
    id: 3,
    sentAt: '2024-01-15 12:20:08',
    recipient: 'wangwu@example.com',
    subject: '🚨 高危安全警报',
    status: 'failed'
  }
])

// 方法
const testConnection = async () => {
  testingConnection.value = true
  // 模拟测试连接
  await new Promise(resolve => setTimeout(resolve, 2000))
  testingConnection.value = false
  // 这里应该显示测试结果
  alert('连接测试成功！')
}

const saveSMTPConfig = async () => {
  showValidation.value = true
  if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password) {
    return
  }
  
  savingConfig.value = true
  // 模拟保存配置
  await new Promise(resolve => setTimeout(resolve, 1000))
  savingConfig.value = false
  alert('SMTP配置已保存！')
}

const addRecipient = () => {
  if (newRecipient.name && newRecipient.email) {
    recipients.value.push({
      id: Date.now(),
      name: newRecipient.name,
      email: newRecipient.email,
      enabled: true
    })
    newRecipient.name = ''
    newRecipient.email = ''
    showAddRecipient.value = false
  }
}

const removeRecipient = (id: number) => {
  recipients.value = recipients.value.filter(r => r.id !== id)
}

const sendTestEmail = async () => {
  sendingTest.value = true
  // 模拟发送测试邮件
  await new Promise(resolve => setTimeout(resolve, 2000))
  sendingTest.value = false
  alert('测试邮件已发送！')
}

const saveNotificationRules = async () => {
  savingRules.value = true
  // 模拟保存规则
  await new Promise(resolve => setTimeout(resolve, 1000))
  savingRules.value = false
  alert('通知规则已保存！')
}

const refreshHistory = () => {
  // 刷新历史记录
  console.log('刷新通知历史记录')
}

const resendEmail = async (id: number) => {
  // 重发邮件
  const record = notificationHistory.value.find(r => r.id === id)
  if (record) {
    record.status = 'pending'
    // 模拟重发
    await new Promise(resolve => setTimeout(resolve, 1000))
    record.status = 'sent'
  }
}
</script>

<style scoped>
.card {
  @apply rounded-2xl;
}

.mockup-window {
  @apply rounded-2xl;
}

.table {
  @apply rounded-lg;
}

.toggle {
  @apply scale-75;
}
</style>