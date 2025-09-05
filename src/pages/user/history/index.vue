<template>
    <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
        <!-- 页面标题 -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-base-content mb-2">历史记录查询</h1>
            <p class="text-base-content/70">查询和分析历史安全事件，追踪威胁演进过程</p>
        </div>

        <!-- 高级搜索面板 -->
        <div class="card bg-base-100 shadow-xl mb-6">
            <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="card-title text-xl flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="w-6 h-6 mr-2 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        高级搜索
                    </h2>
                    <div class="flex gap-2">
                        <button class="btn btn-outline btn-sm" @click="resetSearch">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="w-4 h-4 mr-1 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                                </path>
                            </svg>
                            重置
                        </button>
                        <button class="btn btn-primary btn-sm" @click="performSearch" :disabled="searching">
                            <span v-if="searching" class="loading loading-spinner loading-sm mr-1"></span>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="w-4 h-4 mr-1 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            {{ searching ? '搜索中...' : '搜索' }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- 时间范围 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">时间范围</span>
                        </label>
                        <select v-model="searchFilters.timeRange" class="select select-bordered select-sm">
                            <option value="1h">最近1小时</option>
                            <option value="24h">最近24小时</option>
                            <option value="7d">最近7天</option>
                            <option value="30d">最近30天</option>
                            <option value="custom">自定义时间</option>
                        </select>
                    </div>

                    <!-- 事件类型 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">事件类型</span>
                        </label>
                        <select v-model="searchFilters.eventType" class="select select-bordered select-sm">
                            <option value="">全部类型</option>
                            <option value="brute_force">暴力破解</option>
                            <option value="abnormal_time">异常时间登录</option>
                            <option value="new_ip">新IP登录</option>
                            <option value="geo_anomaly">地理位置异常</option>
                            <option value="failed_login">登录失败</option>
                        </select>
                    </div>

                    <!-- 风险等级 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">风险等级</span>
                        </label>
                        <select v-model="searchFilters.riskLevel" class="select select-bordered select-sm">
                            <option value="">全部等级</option>
                            <option value="high">高危</option>
                            <option value="medium">中危</option>
                            <option value="low">低危</option>
                        </select>
                    </div>

                    <!-- IP地址 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">源IP地址</span>
                        </label>
                        <input type="text" v-model="searchFilters.sourceIP" class="input input-bordered input-sm"
                            placeholder="输入IP地址或IP段" />
                    </div>

                    <!-- 用户名 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">用户名</span>
                        </label>
                        <input type="text" v-model="searchFilters.username" class="input input-bordered input-sm"
                            placeholder="输入用户名" />
                    </div>

                    <!-- 处理状态 -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">处理状态</span>
                        </label>
                        <select v-model="searchFilters.status" class="select select-bordered select-sm">
                            <option value="">全部状态</option>
                            <option value="pending">待处理</option>
                            <option value="processing">处理中</option>
                            <option value="resolved">已解决</option>
                            <option value="ignored">已忽略</option>
                        </select>
                    </div>
                </div>

                <!-- 自定义时间范围 -->
                <div v-if="searchFilters.timeRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">开始时间</span>
                        </label>
                        <input type="datetime-local" v-model="searchFilters.startTime"
                            class="input input-bordered input-sm" />
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">结束时间</span>
                        </label>
                        <input type="datetime-local" v-model="searchFilters.endTime"
                            class="input input-bordered input-sm" />
                    </div>
                </div>

                <!-- 关键词搜索 -->
                <div class="form-control mt-4">
                    <label class="label">
                        <span class="label-text font-medium">关键词搜索</span>
                        <span class="label-text-alt">支持多个关键词，用空格分隔</span>
                    </label>
                    <div class="join">
                        <input type="text" v-model="searchFilters.keywords"
                            class="input input-bordered join-item flex-1" placeholder="输入关键词进行全文搜索"
                            @keyup.enter="performSearch" />
                        <button class="btn btn-primary join-item" @click="performSearch" :disabled="searching">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="w-4 h-4 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 搜索结果统计 -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
                <div class="text-sm text-base-content/70">
                    共找到 <span class="font-bold text-primary">{{ totalResults }}</span> 条记录
                    <span v-if="searchTime">(耗时 {{ searchTime }}ms)</span>
                </div>
                <div class="flex gap-2">
                    <div class="badge badge-outline badge-sm" v-if="searchFilters.eventType">
                        {{ getEventTypeName(searchFilters.eventType) }}
                    </div>
                    <div class="badge badge-outline badge-sm" v-if="searchFilters.riskLevel">
                        {{ getRiskLevelName(searchFilters.riskLevel) }}
                    </div>
                    <div class="badge badge-outline badge-sm" v-if="searchFilters.sourceIP">
                        IP: {{ searchFilters.sourceIP }}
                    </div>
                </div>
            </div>

            <div class="flex gap-2">
                <!-- 排序选项 -->
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-outline btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="w-4 h-4 mr-1 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                        </svg>
                        排序
                    </div>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a @click="setSortBy('timestamp', 'desc')">时间 (最新)</a></li>
                        <li><a @click="setSortBy('timestamp', 'asc')">时间 (最早)</a></li>
                        <li><a @click="setSortBy('risk_level', 'desc')">风险等级 (高到低)</a></li>
                        <li><a @click="setSortBy('risk_level', 'asc')">风险等级 (低到高)</a></li>
                    </ul>
                </div>

                <!-- 导出数据 -->
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-primary btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="w-4 h-4 mr-1 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                        </svg>
                        导出
                    </div>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                        <li><a @click="exportData('csv')">CSV格式</a></li>
                        <li><a @click="exportData('excel')">Excel格式</a></li>
                        <li><a @click="exportData('json')">JSON格式</a></li>
                        <li><a @click="exportData('pdf')">PDF报告</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 搜索结果列表 -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-0">
                <div class="overflow-x-auto">
                    <table class="table table-zebra">
                        <thead class="bg-base-200">
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" class="checkbox checkbox-sm" v-model="selectAll"
                                            @change="toggleSelectAll" />
                                    </label>
                                </th>
                                <th class="cursor-pointer hover:bg-base-300" @click="setSortBy('timestamp')">
                                    <div class="flex items-center gap-1">
                                        时间
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            class="w-3 h-3 stroke-current">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                                        </svg>
                                    </div>
                                </th>
                                <th>事件类型</th>
                                <th>风险等级</th>
                                <th>源IP</th>
                                <th>用户名</th>
                                <th>地理位置</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="searching" class="h-32">
                                <td colspan="9" class="text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <span class="loading loading-spinner loading-md"></span>
                                        <span>搜索中...</span>
                                    </div>
                                </td>
                            </tr>

                            <tr v-else-if="searchResults.length === 0" class="h-32">
                                <td colspan="9" class="text-center">
                                    <div class="text-center py-8">
                                        <div class="text-4xl opacity-20 mb-2">🔍</div>
                                        <p class="text-base-content/60">未找到匹配的记录</p>
                                        <p class="text-sm text-base-content/40 mt-1">请尝试调整搜索条件</p>
                                    </div>
                                </td>
                            </tr>

                            <tr v-for="record in paginatedResults" :key="record.id"
                                class="hover:bg-base-200 cursor-pointer" @click="viewDetails(record)">
                                <td @click.stop>
                                    <label>
                                        <input type="checkbox" class="checkbox checkbox-sm" v-model="selectedRecords"
                                            :value="record.id" />
                                    </label>
                                </td>
                                <td>
                                    <div class="text-sm font-medium">{{ formatDate(record.created_at) }}</div>
                                    <div class="text-xs opacity-70">{{ formatTimeAgo(record.created_at) }}</div>
                                </td>
                                <td>
                                    <div class="badge badge-outline badge-sm"
                                        :class="getEventTypeClass(record.anomaly_type || 'unknown')">
                                        {{ getEventTypeName(record.anomaly_type || 'unknown') }}
                                    </div>
                                </td>
                                <td>
                                    <div class="badge badge-sm" :class="getRiskLevelClass(record.risk_level)">
                                        {{ getRiskLevelName(record.risk_level) }}
                                    </div>
                                </td>
                                <td>
                                    <div class="font-mono text-sm">{{ record.ip_address }}</div>
                                </td>
                                <td>
                                    <div class="font-medium">{{ record.username || '-' }}</div>
                                </td>
                                <td>
                                    <div class="text-sm">{{ record.location || '-' }}</div>
                                </td>
                                <td>
                                    <div class="badge badge-sm" :class="getStatusClass(record.status)">
                                        {{ getStatusName(record.status) }}
                                    </div>
                                </td>
                                <td @click.stop>
                                    <div class="flex gap-1">
                                        <button class="btn btn-ghost btn-xs" @click="viewDetails(record)" title="查看详情">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                class="w-3 h-3 stroke-current">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                                </path>
                                            </svg>
                                        </button>
                                        <button class="btn btn-ghost btn-xs" @click="markAsProcessed(record.id)"
                                            v-if="record.status === 'pending'" title="标记为已处理">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                class="w-3 h-3 stroke-current">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 分页控件 -->
                <div class="flex items-center justify-between p-4 border-t">
                    <div class="text-sm text-base-content/70">
                        显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalResults)
                        }} 条，
                        共 {{ totalResults }} 条记录
                    </div>

                    <div class="join">
                        <button class="join-item btn btn-sm" :disabled="currentPage === 1" @click="currentPage = 1">
                            首页
                        </button>
                        <button class="join-item btn btn-sm" :disabled="currentPage === 1" @click="currentPage--">
                            上一页
                        </button>

                        <button v-for="page in visiblePages" :key="page" class="join-item btn btn-sm"
                            :class="{ 'btn-active': page === currentPage }" @click="typeof page === 'number' ? currentPage = page : null">
                            {{ page }}
                        </button>

                        <button class="join-item btn btn-sm" :disabled="currentPage === totalPages"
                            @click="currentPage++">
                            下一页
                        </button>
                        <button class="join-item btn btn-sm" :disabled="currentPage === totalPages"
                            @click="currentPage = totalPages">
                            末页
                        </button>
                    </div>

                    <div class="form-control">
                        <select v-model="pageSize" class="select select-bordered select-sm" @change="currentPage = 1">
                            <option :value="10">10条/页</option>
                            <option :value="25">25条/页</option>
                            <option :value="50">50条/页</option>
                            <option :value="100">100条/页</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- 详情模态框 -->
        <dialog ref="detailModal" class="modal">
            <div class="modal-box max-w-4xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg">事件详情</h3>
                    <button class="btn btn-sm btn-circle btn-ghost" @click="closeDetails">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="w-4 h-4 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div v-if="selectedRecord" class="space-y-6">
                    <!-- 基本信息 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="card bg-base-200">
                            <div class="card-body p-4">
                                <h4 class="font-medium mb-3">基本信息</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="opacity-70">事件ID:</span>
                                        <span class="font-mono">{{ selectedRecord.id }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="opacity-70">发生时间:</span>
                                        <span>{{ formatDate(selectedRecord.created_at) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="opacity-70">事件类型:</span>
                                        <div class="badge badge-outline badge-sm"
                                            :class="getEventTypeClass(selectedRecord.anomaly_type || 'unknown')">
                                            {{ getEventTypeName(selectedRecord.anomaly_type || 'unknown') }}
                                        </div>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="opacity-70">风险等级:</span>
                                        <div class="badge badge-sm"
                                            :class="getRiskLevelClass(selectedRecord.risk_level)">
                                            {{ getRiskLevelName(selectedRecord.risk_level) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card bg-base-200">
                            <div class="card-body p-4">
                                <h4 class="font-medium mb-3">网络信息</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="opacity-70">源IP地址:</span>
                                        <span class="font-mono">{{ selectedRecord.ip_address }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="opacity-70">用户代理:</span>
                                        <span>{{ selectedRecord.user_agent || '-' }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="opacity-70">地理位置:</span>
                                        <span>{{ selectedRecord.location || '-' }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="opacity-70">风险评分:</span>
                                        <span>{{ selectedRecord.risk_score || '-' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 详细描述 -->
                    <div class="card bg-base-200">
                        <div class="card-body p-4">
                            <h4 class="font-medium mb-3">备注信息</h4>
                            <p class="text-sm leading-relaxed">{{ selectedRecord.notes || '暂无备注信息' }}</p>
                        </div>
                    </div>

                    <!-- 检测特征 -->
                    <div class="card bg-base-200" v-if="selectedRecord.detection_features">
                        <div class="card-body p-4">
                            <h4 class="font-medium mb-3">检测特征</h4>
                            <div class="mockup-code text-xs">
                                <pre><code>{{ JSON.stringify(selectedRecord.detection_features, null, 2) }}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-action">
                    <button class="btn btn-outline" @click="closeDetails">关闭</button>
                    <button class="btn btn-primary" @click="exportRecord(selectedRecord)">
                        导出记录
                    </button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button @click="closeDetails">close</button>
            </form>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { getDetectionRecords, updateDetectionRecordStatus } from '@/api/PagesApis'
import type { DetectionRecordsResponse, DetectionRecord, UpdateDetectionRecordStatusRequest, DetectionRecordResponse } from '@/types/apis/PagesApis_T'
import { ElMessage } from 'element-plus'

// 搜索条件
const searchFilters = reactive({
    timeRange: '24h',
    eventType: '',
    riskLevel: '',
    sourceIP: '',
    username: '',
    status: '',
    startTime: '',
    endTime: '',
    keywords: ''
})

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const formatDateForAPI = (date: Date) => {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

// 状态管理
const searching = ref(false)
const searchTime = ref(0)
const totalResults = ref(0)
const currentPage = ref(1)
const pageSize = ref(25)
const selectAll = ref(false)
const selectedRecords = ref<number[]>([])
const sortBy = ref('timestamp')
const sortOrder = ref('desc')

// 搜索结果
const searchResults = ref<DetectionRecord[]>([])
const selectedRecord = ref<DetectionRecord | null>(null)
const detailModal = ref<HTMLDialogElement>()

// 获取检测记录数据
const fetchDetectionRecords = async () => {
  try {
    searching.value = true
    const startTime = Date.now()
    
    // 构建API请求参数
    const params: any = {
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    // 添加筛选条件
    if (searchFilters.riskLevel) {
      params.risk_level = searchFilters.riskLevel
    }
    if (searchFilters.sourceIP) {
      params.ip_address = searchFilters.sourceIP
    }
    if (searchFilters.username) {
      params.username = searchFilters.username
    }
    if (searchFilters.status) {
      params.status = searchFilters.status
    }
    
    // 处理时间范围
    if (searchFilters.timeRange === 'custom' && searchFilters.startTime && searchFilters.endTime) {
      params.start_time = formatDateForAPI(new Date(searchFilters.startTime))
      params.end_time = formatDateForAPI(new Date(searchFilters.endTime))
    } else if (searchFilters.timeRange !== 'custom') {
      const now = new Date()
      let startTime: Date
      
      switch (searchFilters.timeRange) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '24h':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      }
      
      params.start_time = formatDateForAPI(startTime)
      params.end_time = formatDateForAPI(now)
    }
    
    const response: DetectionRecordsResponse = await getDetectionRecords(params)
    
    if (response.code === 200 && response.data) {
      let results = response.data
      
      // 如果有关键词搜索，进行客户端过滤
      if (searchFilters.keywords) {
        const keywords = searchFilters.keywords.toLowerCase().split(' ')
        results = results.filter(record =>
          keywords.some(keyword =>
            record.ip_address.includes(keyword) ||
            record.username?.toLowerCase().includes(keyword) ||
            record.notes?.toLowerCase().includes(keyword)
          )
        )
      }
      
      // 应用排序
      results.sort((a, b) => {
        let aVal = a[sortBy.value as keyof DetectionRecord]
        let bVal = b[sortBy.value as keyof DetectionRecord]
        
        if (sortBy.value === 'created_at') {
          aVal = new Date(aVal as string).getTime()
          bVal = new Date(bVal as string).getTime()
        }
        
        // 处理可能为undefined的值
        if (aVal === undefined || bVal === undefined) {
          if (aVal === undefined && bVal === undefined) return 0
          if (aVal === undefined) return 1
          if (bVal === undefined) return -1
        }
        
        if (sortOrder.value === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
      
      searchResults.value = results
      totalResults.value = results.length
      searchTime.value = Date.now() - startTime
    } else {
      ElMessage.error(response.msg || '获取检测记录失败')
      searchResults.value = []
      totalResults.value = 0
    }
  } catch (error) {
    ElMessage.error('获取检测记录失败')
    console.error('获取检测记录失败:', error)
    searchResults.value = []
    totalResults.value = 0
  } finally {
    searching.value = false
  }
}

// 计算属性
const totalPages = computed(() => Math.ceil(totalResults.value / pageSize.value))

const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return searchResults.value.slice(start, end)
})

const visiblePages = computed(() => {
    const pages: (number | string)[] = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        if (current <= 4) {
            for (let i = 1; i <= 5; i++) {
                pages.push(i)
            }
            pages.push('...', total)
        } else if (current >= total - 3) {
            pages.push(1, '...')
            for (let i = total - 4; i <= total; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total)
        }
    }

    return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

// 方法
const resetSearch = () => {
    Object.assign(searchFilters, {
        timeRange: '24h',
        eventType: '',
        riskLevel: '',
        sourceIP: '',
        username: '',
        status: '',
        startTime: '',
        endTime: '',
        keywords: ''
    })
    performSearch()
}

const performSearch = async () => {
    currentPage.value = 1
    await fetchDetectionRecords()
}

const setSortBy = (field: string, order?: string) => {
    if (sortBy.value === field && !order) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = field
        sortOrder.value = order || 'desc'
    }

    // 重新获取数据以应用排序
    fetchDetectionRecords()
}

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedRecords.value = paginatedResults.value.map(r => r.id)
    } else {
        selectedRecords.value = []
    }
}

const viewDetails = (record: any) => {
    selectedRecord.value = record
    detailModal.value?.showModal()
}

const closeDetails = () => {
    detailModal.value?.close()
    selectedRecord.value = null
}

const markAsProcessed = async (id: number) => {
    try {
        const data: UpdateDetectionRecordStatusRequest = {
            status: 'resolved',
            notes: '已手动标记为已处理'
        }
        
        const response: DetectionRecordResponse = await updateDetectionRecordStatus(id, data)
        
        if (response.code === 200) {
            // 更新本地记录状态
            const record = searchResults.value.find(r => r.id === id)
            if (record) {
                record.status = 'resolved'
                record.notes = data.notes
            }
            ElMessage.success('记录状态已更新')
        } else {
            ElMessage.error(response.msg || '更新状态失败')
        }
    } catch (error) {
        ElMessage.error('更新状态失败')
        console.error('更新状态失败:', error)
    }
}

const exportData = (format: string) => {
    console.log(`导出数据为${format}格式`)
    // 实现数据导出逻辑
}

const exportRecord = (record: any) => {
    console.log('导出单条记录', record)
    // 实现单条记录导出逻辑
}

// 辅助方法
const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN')
}

const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime()
    const time = new Date(timestamp).getTime()
    const diff = now - time

    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return `${Math.floor(diff / 86400000)}天前`
}

const getEventTypeName = (type: string) => {
    const names: Record<string, string> = {
        brute_force: '暴力破解',
        abnormal_time: '异常时间',
        new_ip: '新IP登录',
        geo_anomaly: '地理异常',
        failed_login: '登录失败',
        suspicious_login: '可疑登录',
        unknown: '未知类型'
    }
    return names[type] || type
}

const getEventTypeClass = (type: string) => {
    const classes: Record<string, string> = {
        brute_force: 'badge-error',
        abnormal_time: 'badge-warning',
        new_ip: 'badge-info',
        geo_anomaly: 'badge-primary',
        failed_login: 'badge-secondary',
        suspicious_login: 'badge-warning',
        unknown: 'badge-ghost'
    }
    return classes[type] || 'badge-ghost'
}

const getRiskLevelName = (level: string) => {
    const names: Record<string, string> = {
        high: '高危',
        medium: '中危',
        low: '低危'
    }
    return names[level] || level
}

const getRiskLevelClass = (level: string) => {
    const classes: Record<string, string> = {
        high: 'badge-error',
        medium: 'badge-warning',
        low: 'badge-success'
    }
    return classes[level] || 'badge-ghost'
}

const getStatusName = (status: string) => {
    const names: Record<string, string> = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已解决',
        ignored: '已忽略'
    }
    return names[status] || status
}

const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
        pending: 'badge-warning',
        processing: 'badge-info',
        resolved: 'badge-success',
        ignored: 'badge-ghost'
    }
    return classes[status] || 'badge-ghost'
}

// 初始化
onMounted(() => {
    fetchDetectionRecords()
})
</script>

<style scoped>
.card {
    @apply rounded-2xl;
}

.table {
    @apply rounded-lg;
}

.modal-box {
    @apply rounded-2xl;
}

.dropdown-content {
    @apply rounded-xl;
}

.mockup-code {
    @apply rounded-lg;
}
</style>
