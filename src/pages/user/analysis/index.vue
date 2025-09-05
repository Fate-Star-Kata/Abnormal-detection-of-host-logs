<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">数据分析</h1>
      <p class="text-base-content/70">深入分析安全事件数据，洞察威胁趋势和模式</p>
    </div>

    <!-- 数据筛选面板 -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            数据筛选
          </h2>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" @click="resetFilters">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              重置
            </button>
            <button class="btn btn-primary btn-sm" @click="applyFilters" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-sm mr-1"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {{ loading ? '分析中...' : '应用筛选' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 时间范围 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">时间范围</span>
            </label>
            <select v-model="filters.timeRange" class="select select-bordered select-sm">
              <option value="1h">最近1小时</option>
              <option value="24h">最近24小时</option>
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          <!-- 事件类型 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">事件类型</span>
            </label>
            <select v-model="filters.eventType" class="select select-bordered select-sm">
              <option value="all">全部类型</option>
              <option value="brute_force">暴力破解</option>
              <option value="abnormal_time">异常时间</option>
              <option value="new_ip">新IP登录</option>
              <option value="geo_anomaly">地理位置异常</option>
            </select>
          </div>

          <!-- 风险等级 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">风险等级</span>
            </label>
            <select v-model="filters.riskLevel" class="select select-bordered select-sm">
              <option value="all">全部等级</option>
              <option value="high">高危</option>
              <option value="medium">中危</option>
              <option value="low">低危</option>
            </select>
          </div>

          <!-- IP地址 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">IP地址</span>
            </label>
            <input type="text" v-model="filters.ipAddress" 
                   class="input input-bordered input-sm" 
                   placeholder="输入IP地址" />
          </div>
        </div>

        <!-- 自定义时间范围 -->
        <div v-if="filters.timeRange === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">开始时间</span>
            </label>
            <input type="datetime-local" v-model="filters.startTime" 
                   class="input input-bordered input-sm" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">结束时间</span>
            </label>
            <input type="datetime-local" v-model="filters.endTime" 
                   class="input input-bordered input-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="stats shadow-xl bg-gradient-to-r from-primary to-primary-focus text-primary-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-primary-content/80">总事件数</div>
          <div class="stat-value">{{ statistics.totalEvents }}</div>
          <div class="stat-desc text-primary-content/60">较昨日 +12%</div>
        </div>
      </div>

      <div class="stats shadow-xl bg-gradient-to-r from-error to-error-focus text-error-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="stat-title text-error-content/80">高危事件</div>
          <div class="stat-value">{{ statistics.highRiskEvents }}</div>
          <div class="stat-desc text-error-content/60">较昨日 +8%</div>
        </div>
      </div>

      <div class="stats shadow-xl bg-gradient-to-r from-warning to-warning-focus text-warning-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-warning-content/80">受影响IP</div>
          <div class="stat-value">{{ statistics.affectedIPs }}</div>
          <div class="stat-desc text-warning-content/60">较昨日 +5%</div>
        </div>
      </div>

      <div class="stats shadow-xl bg-gradient-to-r from-success to-success-focus text-success-content">
        <div class="stat">
          <div class="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-success-content/80">处理率</div>
          <div class="stat-value">{{ statistics.processedRate }}%</div>
          <div class="stat-desc text-success-content/60">较昨日 +2%</div>
        </div>
      </div>
    </div>

    <!-- 图表展示区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 事件趋势图 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h2 class="card-title text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              事件趋势分析
            </h2>
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a @click="exportChart('trend')">导出图表</a></li>
                <li><a @click="refreshChart('trend')">刷新数据</a></li>
              </ul>
            </div>
          </div>
          
          <!-- 模拟图表区域 -->
          <div class="h-64 bg-base-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 p-4">
              <!-- 模拟折线图 -->
              <svg viewBox="0 0 400 200" class="w-full h-full">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
                  </linearGradient>
                </defs>
                <!-- 网格线 -->
                <g stroke="#e5e7eb" stroke-width="1" opacity="0.3">
                  <line x1="0" y1="40" x2="400" y2="40"/>
                  <line x1="0" y1="80" x2="400" y2="80"/>
                  <line x1="0" y1="120" x2="400" y2="120"/>
                  <line x1="0" y1="160" x2="400" y2="160"/>
                  <line x1="80" y1="0" x2="80" y2="200"/>
                  <line x1="160" y1="0" x2="160" y2="200"/>
                  <line x1="240" y1="0" x2="240" y2="200"/>
                  <line x1="320" y1="0" x2="320" y2="200"/>
                </g>
                <!-- 趋势线 -->
                <polyline fill="url(#trendGradient)" stroke="#3b82f6" stroke-width="3" 
                         points="0,160 80,140 160,120 240,100 320,80 400,60"/>
                <!-- 数据点 -->
                <circle cx="80" cy="140" r="4" fill="#3b82f6"/>
                <circle cx="160" cy="120" r="4" fill="#3b82f6"/>
                <circle cx="240" cy="100" r="4" fill="#3b82f6"/>
                <circle cx="320" cy="80" r="4" fill="#3b82f6"/>
              </svg>
            </div>
            <div class="absolute bottom-2 left-4 text-xs text-base-content/60">
              过去7天事件数量趋势
            </div>
          </div>
        </div>
      </div>

      <!-- 事件类型分布 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h2 class="card-title text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
              事件类型分布
            </h2>
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a @click="exportChart('distribution')">导出图表</a></li>
                <li><a @click="refreshChart('distribution')">刷新数据</a></li>
              </ul>
            </div>
          </div>
          
          <!-- 模拟饼图 -->
          <div class="h-64 bg-base-200 rounded-lg flex items-center justify-center relative">
            <div class="w-48 h-48 relative">
              <svg viewBox="0 0 200 200" class="w-full h-full transform -rotate-90">
                <!-- 暴力破解 45% -->
                <circle cx="100" cy="100" r="80" fill="none" stroke="#ef4444" stroke-width="20" 
                       stroke-dasharray="226 504" stroke-dashoffset="0"/>
                <!-- 异常时间 25% -->
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" stroke-width="20" 
                       stroke-dasharray="126 504" stroke-dashoffset="-226"/>
                <!-- 新IP 20% -->
                <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" stroke-width="20" 
                       stroke-dasharray="101 504" stroke-dashoffset="-352"/>
                <!-- 地理位置异常 10% -->
                <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="20" 
                       stroke-dasharray="50 504" stroke-dashoffset="-453"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold">{{ statistics.totalEvents }}</div>
                  <div class="text-sm opacity-70">总事件</div>
                </div>
              </div>
            </div>
            
            <!-- 图例 -->
            <div class="absolute right-4 top-4 space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <div class="w-3 h-3 bg-error rounded"></div>
                <span>暴力破解 (45%)</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-3 h-3 bg-warning rounded"></div>
                <span>异常时间 (25%)</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-3 h-3 bg-primary rounded"></div>
                <span>新IP (20%)</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-3 h-3 bg-success rounded"></div>
                <span>地理异常 (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热力图和地理分布 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 时间热力图 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            24小时活动热力图
          </h2>
          
          <div class="h-64 bg-base-200 rounded-lg p-4">
            <!-- 模拟热力图 -->
            <div class="grid grid-cols-24 gap-1 h-full">
              <div v-for="hour in 24" :key="hour" 
                   class="rounded flex items-end justify-center text-xs font-medium"
                   :class="getHeatmapColor(getHourActivity(hour))">
                <span class="transform rotate-90 origin-center text-[10px] mb-1">{{ hour - 1 }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center mt-2 text-xs text-base-content/60">
              <span>低活跃</span>
              <div class="flex gap-1">
                <div class="w-3 h-3 bg-success/20 rounded"></div>
                <div class="w-3 h-3 bg-warning/40 rounded"></div>
                <div class="w-3 h-3 bg-warning/60 rounded"></div>
                <div class="w-3 h-3 bg-error/80 rounded"></div>
                <div class="w-3 h-3 bg-error rounded"></div>
              </div>
              <span>高活跃</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 地理分布 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            地理位置分布
          </h2>
          
          <div class="h-64 bg-base-200 rounded-lg p-4 relative">
            <!-- 模拟世界地图 -->
            <div class="absolute inset-4 bg-base-300 rounded opacity-20"></div>
            
            <!-- 热点标记 -->
            <div class="absolute top-8 left-12">
              <div class="w-4 h-4 bg-error rounded-full animate-pulse"></div>
              <div class="text-xs mt-1">北京 (156)</div>
            </div>
            
            <div class="absolute top-16 left-20">
              <div class="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
              <div class="text-xs mt-1">上海 (89)</div>
            </div>
            
            <div class="absolute top-12 right-16">
              <div class="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div class="text-xs mt-1">广州 (67)</div>
            </div>
            
            <div class="absolute bottom-16 left-16">
              <div class="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <div class="text-xs mt-1">深圳 (34)</div>
            </div>
            
            <!-- 图例 -->
            <div class="absolute bottom-4 right-4 space-y-1">
              <div class="flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-error rounded-full"></div>
                <span>高风险区域</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-warning rounded-full"></div>
                <span>中风险区域</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-success rounded-full"></div>
                <span>低风险区域</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 报表生成 -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex items-center justify-between mb-6">
          <h2 class="card-title text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            报表生成
          </h2>
          <button class="btn btn-primary" @click="generateReport" :disabled="generatingReport">
            <span v-if="generatingReport" class="loading loading-spinner loading-sm mr-2"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ generatingReport ? '生成中...' : '生成报表' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <!-- 报表类型 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">报表类型</span>
            </label>
            <select v-model="reportConfig.type" class="select select-bordered">
              <option value="summary">安全事件汇总报表</option>
              <option value="trend">趋势分析报表</option>
              <option value="risk">风险评估报表</option>
              <option value="detailed">详细事件报表</option>
            </select>
          </div>

          <!-- 报表格式 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">导出格式</span>
            </label>
            <select v-model="reportConfig.format" class="select select-bordered">
              <option value="pdf">PDF格式</option>
              <option value="excel">Excel格式</option>
              <option value="csv">CSV格式</option>
              <option value="html">HTML格式</option>
            </select>
          </div>

          <!-- 时间范围 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">报表周期</span>
            </label>
            <select v-model="reportConfig.period" class="select select-bordered">
              <option value="daily">日报</option>
              <option value="weekly">周报</option>
              <option value="monthly">月报</option>
              <option value="quarterly">季报</option>
            </select>
          </div>
        </div>

        <!-- 报表模板预览 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="template in reportTemplates" :key="template.id" 
               class="card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors"
               :class="{ 'ring-2 ring-primary': reportConfig.template === template.id }"
               @click="reportConfig.template = template.id">
            <div class="card-body p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-sm">{{ template.name }}</h3>
                <div class="w-3 h-3 rounded-full"
                     :class="reportConfig.template === template.id ? 'bg-primary' : 'bg-base-content/20'"></div>
              </div>
              <p class="text-xs text-base-content/70 mb-3">{{ template.description }}</p>
              
              <!-- 模板预览 -->
              <div class="bg-white rounded border p-2 text-[8px] leading-tight">
                <div class="font-bold mb-1">{{ template.name }}</div>
                <div class="space-y-1">
                  <div class="h-1 bg-gray-300 rounded w-full"></div>
                  <div class="h-1 bg-gray-300 rounded w-3/4"></div>
                  <div class="h-1 bg-gray-300 rounded w-1/2"></div>
                  <div class="grid grid-cols-2 gap-1 mt-2">
                    <div class="h-6 bg-gray-200 rounded"></div>
                    <div class="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史报表 -->
        <div class="mt-8">
          <h3 class="font-medium mb-4">历史报表</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>报表名称</th>
                  <th>生成时间</th>
                  <th>类型</th>
                  <th>格式</th>
                  <th>大小</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in historicalReports" :key="report.id">
                  <td>{{ report.name }}</td>
                  <td>{{ report.createdAt }}</td>
                  <td>
                    <div class="badge badge-outline badge-sm">{{ report.type }}</div>
                  </td>
                  <td>
                    <div class="badge badge-primary badge-sm">{{ report.format.toUpperCase() }}</div>
                  </td>
                  <td>{{ report.size }}</td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-ghost btn-xs" @click="downloadReport(report.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-3 h-3 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                      <button class="btn btn-ghost btn-xs text-error" @click="deleteReport(report.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-3 h-3 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 筛选条件
const filters = reactive({
  timeRange: '24h',
  eventType: 'all',
  riskLevel: 'all',
  ipAddress: '',
  startTime: '',
  endTime: ''
})

// 统计数据
const statistics = reactive({
  totalEvents: 1247,
  highRiskEvents: 89,
  affectedIPs: 156,
  processedRate: 87
})

// 状态管理
const loading = ref(false)
const generatingReport = ref(false)

// 报表配置
const reportConfig = reactive({
  type: 'summary',
  format: 'pdf',
  period: 'daily',
  template: 'template1'
})

// 报表模板
const reportTemplates = ref([
  {
    id: 'template1',
    name: '标准安全报表',
    description: '包含基础统计和趋势分析'
  },
  {
    id: 'template2',
    name: '详细分析报表',
    description: '深入分析各类安全事件'
  },
  {
    id: 'template3',
    name: '高管摘要报表',
    description: '简洁的高层决策参考'
  }
])

// 历史报表
const historicalReports = ref([
  {
    id: 1,
    name: '2024年1月安全事件汇总报表',
    createdAt: '2024-01-15 10:30:00',
    type: '汇总报表',
    format: 'pdf',
    size: '2.3MB'
  },
  {
    id: 2,
    name: '2024年1月趋势分析报表',
    createdAt: '2024-01-14 16:45:00',
    type: '趋势分析',
    format: 'excel',
    size: '1.8MB'
  },
  {
    id: 3,
    name: '2024年1月风险评估报表',
    createdAt: '2024-01-13 09:15:00',
    type: '风险评估',
    format: 'html',
    size: '956KB'
  }
])

// 方法
const resetFilters = () => {
  Object.assign(filters, {
    timeRange: '24h',
    eventType: 'all',
    riskLevel: 'all',
    ipAddress: '',
    startTime: '',
    endTime: ''
  })
}

const applyFilters = async () => {
  loading.value = true
  // 模拟数据加载
  await new Promise(resolve => setTimeout(resolve, 1500))
  loading.value = false
  // 这里应该根据筛选条件更新图表数据
}

const getHeatmapColor = (activity: number) => {
  if (activity < 20) return 'bg-success/20'
  if (activity < 40) return 'bg-warning/40'
  if (activity < 60) return 'bg-warning/60'
  if (activity < 80) return 'bg-error/80'
  return 'bg-error'
}

const getHourActivity = (hour: number) => {
  // 模拟不同时间段的活动强度
  const activities = [10, 5, 3, 2, 5, 15, 25, 45, 60, 70, 65, 55, 50, 45, 40, 35, 30, 40, 50, 60, 45, 30, 20, 15]
  return activities[hour - 1] || 0
}

const exportChart = (type: string) => {
  console.log(`导出${type}图表`)
  // 实现图表导出逻辑
}

const refreshChart = (type: string) => {
  console.log(`刷新${type}图表`)
  // 实现图表刷新逻辑
}

const generateReport = async () => {
  generatingReport.value = true
  // 模拟报表生成
  await new Promise(resolve => setTimeout(resolve, 3000))
  generatingReport.value = false
  alert('报表生成完成！')
}

const downloadReport = (id: number) => {
  console.log(`下载报表 ${id}`)
  // 实现报表下载逻辑
}

const deleteReport = (id: number) => {
  if (confirm('确定要删除这个报表吗？')) {
    historicalReports.value = historicalReports.value.filter(r => r.id !== id)
  }
}
</script>

<style scoped>
.card {
  @apply rounded-2xl;
}

.stats {
  @apply rounded-2xl;
}

.table {
  @apply rounded-lg;
}

.dropdown-content {
  @apply rounded-xl;
}
</style>