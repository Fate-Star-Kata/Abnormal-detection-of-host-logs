<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-base-content mb-2">系统设置</h1>
      <p class="text-base-content/70">个性化配置系统参数，优化使用体验</p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 设置导航 -->
      <div class="xl:col-span-1">
        <div class="card bg-base-100 shadow-xl sticky top-6">
          <div class="card-body p-4">
            <h2 class="card-title text-lg mb-4">设置分类</h2>
            <ul class="menu menu-sm w-full">
              <li>
                <a :class="{ 'active': activeTab === 'profile' }" 
                   @click="activeTab = 'profile'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  个人资料
                </a>
              </li>
              <li>
                <a :class="{ 'active': activeTab === 'display' }" 
                   @click="activeTab = 'display'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  显示设置
                </a>
              </li>
              <li>
                <a :class="{ 'active': activeTab === 'notifications' }" 
                   @click="activeTab = 'notifications'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  通知偏好
                </a>
              </li>
              <li>
                <a :class="{ 'active': activeTab === 'security' }" 
                   @click="activeTab = 'security'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  安全设置
                </a>
              </li>
              <li>
                <a :class="{ 'active': activeTab === 'system' }" 
                   @click="activeTab = 'system'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  系统维护
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 设置内容 -->
      <div class="xl:col-span-3">
        <!-- 个人资料设置 -->
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-xl mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                个人资料
              </h3>
              
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- 头像上传 -->
                <div class="flex flex-col items-center">
                  <div class="avatar mb-4">
                    <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img :src="profileSettings.avatar" alt="用户头像" />
                    </div>
                  </div>
                  <button class="btn btn-outline btn-sm" @click="uploadAvatar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    更换头像
                  </button>
                </div>
                
                <!-- 基本信息 -->
                <div class="lg:col-span-2 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">用户名</span>
                      </label>
                      <input type="text" v-model="profileSettings.username" 
                             class="input input-bordered" placeholder="输入用户名" />
                    </div>
                    
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">显示名称</span>
                      </label>
                      <input type="text" v-model="profileSettings.displayName" 
                             class="input input-bordered" placeholder="输入显示名称" />
                    </div>
                  </div>
                  
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">邮箱地址</span>
                    </label>
                    <input type="email" v-model="profileSettings.email" 
                           class="input input-bordered" placeholder="输入邮箱地址" />
                  </div>
                  
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">手机号码</span>
                    </label>
                    <input type="tel" v-model="profileSettings.phone" 
                           class="input input-bordered" placeholder="输入手机号码" />
                  </div>
                  
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">个人简介</span>
                    </label>
                    <textarea v-model="profileSettings.bio" 
                              class="textarea textarea-bordered h-24" 
                              placeholder="简单介绍一下自己..."></textarea>
                  </div>
                </div>
              </div>
              
              <div class="card-actions justify-end mt-6">
                <button class="btn btn-outline" @click="resetProfile">重置</button>
                <button class="btn btn-primary" @click="saveProfile" :disabled="saving">
                  <span v-if="saving" class="loading loading-spinner loading-sm mr-1"></span>
                  {{ saving ? '保存中...' : '保存更改' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 显示设置 -->
        <div v-if="activeTab === 'display'" class="space-y-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-xl mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                显示设置
              </h3>
              
              <div class="space-y-6">
                <!-- 主题设置 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">主题模式</span>
                    <span class="label-text-alt">选择您喜欢的界面主题</span>
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">浅色主题</span>
                        <input type="radio" name="theme" value="light" 
                               v-model="displaySettings.theme" class="radio radio-primary" />
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">深色主题</span>
                        <input type="radio" name="theme" value="dark" 
                               v-model="displaySettings.theme" class="radio radio-primary" />
                      </label>
                    </div>
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">跟随系统</span>
                        <input type="radio" name="theme" value="auto" 
                               v-model="displaySettings.theme" class="radio radio-primary" />
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- 语言设置 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">界面语言</span>
                  </label>
                  <select v-model="displaySettings.language" class="select select-bordered max-w-xs">
                    <option value="zh-CN">简体中文</option>
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                    <option value="ja-JP">日本語</option>
                  </select>
                </div>
                
                <!-- 时区设置 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">时区</span>
                  </label>
                  <select v-model="displaySettings.timezone" class="select select-bordered max-w-xs">
                    <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                    <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
                    <option value="America/New_York">纽约时间 (UTC-5)</option>
                    <option value="Europe/London">伦敦时间 (UTC+0)</option>
                  </select>
                </div>
                
                <!-- 数据刷新频率 -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">数据刷新频率</span>
                    <span class="label-text-alt">{{ displaySettings.refreshInterval }}秒</span>
                  </label>
                  <input type="range" min="5" max="300" step="5" 
                         v-model="displaySettings.refreshInterval" 
                         class="range range-primary" />
                  <div class="w-full flex justify-between text-xs px-2 mt-1">
                    <span>5秒</span>
                    <span>1分钟</span>
                    <span>5分钟</span>
                  </div>
                </div>
                
                <!-- 显示选项 -->
                <div class="space-y-4">
                  <h4 class="font-medium">显示选项</h4>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <span class="label-text">显示动画效果</span>
                      <input type="checkbox" v-model="displaySettings.animations" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <span class="label-text">显示侧边栏</span>
                      <input type="checkbox" v-model="displaySettings.sidebar" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <span class="label-text">紧凑模式</span>
                      <input type="checkbox" v-model="displaySettings.compact" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <span class="label-text">显示网格线</span>
                      <input type="checkbox" v-model="displaySettings.gridLines" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="card-actions justify-end mt-6">
                <button class="btn btn-outline" @click="resetDisplay">重置</button>
                <button class="btn btn-primary" @click="saveDisplay" :disabled="saving">
                  <span v-if="saving" class="loading loading-spinner loading-sm mr-1"></span>
                  {{ saving ? '保存中...' : '保存更改' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知偏好 -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-xl mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                通知偏好
              </h3>
              
              <div class="space-y-6">
                <!-- 通知方式 -->
                <div class="space-y-4">
                  <h4 class="font-medium">通知方式</h4>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span class="label-text">浏览器通知</span>
                      </div>
                      <input type="checkbox" v-model="notificationSettings.browser" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span class="label-text">邮件通知</span>
                      </div>
                      <input type="checkbox" v-model="notificationSettings.email" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <span class="label-text">短信通知</span>
                      </div>
                      <input type="checkbox" v-model="notificationSettings.sms" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                </div>
                
                <!-- 通知类型 -->
                <div class="space-y-4">
                  <h4 class="font-medium">通知类型</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">安全警报</span>
                        <input type="checkbox" v-model="notificationSettings.security" 
                               class="toggle toggle-error" />
                      </label>
                    </div>
                    
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">系统更新</span>
                        <input type="checkbox" v-model="notificationSettings.updates" 
                               class="toggle toggle-info" />
                      </label>
                    </div>
                    
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">报告生成</span>
                        <input type="checkbox" v-model="notificationSettings.reports" 
                               class="toggle toggle-success" />
                      </label>
                    </div>
                    
                    <div class="form-control">
                      <label class="label cursor-pointer">
                        <span class="label-text">维护通知</span>
                        <input type="checkbox" v-model="notificationSettings.maintenance" 
                               class="toggle toggle-warning" />
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- 免打扰时间 -->
                <div class="space-y-4">
                  <h4 class="font-medium">免打扰时间</h4>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <span class="label-text">启用免打扰模式</span>
                      <input type="checkbox" v-model="notificationSettings.doNotDisturb" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div v-if="notificationSettings.doNotDisturb" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">开始时间</span>
                      </label>
                      <input type="time" v-model="notificationSettings.quietStart" 
                             class="input input-bordered" />
                    </div>
                    
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">结束时间</span>
                      </label>
                      <input type="time" v-model="notificationSettings.quietEnd" 
                             class="input input-bordered" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-actions justify-end mt-6">
                <button class="btn btn-outline" @click="resetNotifications">重置</button>
                <button class="btn btn-primary" @click="saveNotifications" :disabled="saving">
                  <span v-if="saving" class="loading loading-spinner loading-sm mr-1"></span>
                  {{ saving ? '保存中...' : '保存更改' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="space-y-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-xl mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                安全设置
              </h3>
              
              <div class="space-y-6">
                <!-- 密码修改 -->
                <div class="space-y-4">
                  <h4 class="font-medium">修改密码</h4>
                  
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">当前密码</span>
                    </label>
                    <input type="password" v-model="securitySettings.currentPassword" 
                           class="input input-bordered" placeholder="输入当前密码" />
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">新密码</span>
                      </label>
                      <input type="password" v-model="securitySettings.newPassword" 
                             class="input input-bordered" placeholder="输入新密码" />
                    </div>
                    
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">确认新密码</span>
                      </label>
                      <input type="password" v-model="securitySettings.confirmPassword" 
                             class="input input-bordered" placeholder="再次输入新密码" />
                    </div>
                  </div>
                  
                  <button class="btn btn-primary btn-sm" @click="changePassword">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    更新密码
                  </button>
                </div>
                
                <!-- 两步验证 -->
                <div class="space-y-4">
                  <h4 class="font-medium">两步验证</h4>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-2 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        <span class="label-text">启用两步验证</span>
                      </div>
                      <input type="checkbox" v-model="securitySettings.twoFactor" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div v-if="securitySettings.twoFactor" class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>两步验证将为您的账户提供额外的安全保护。</span>
                  </div>
                </div>
                
                <!-- 登录会话 -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium">活跃会话</h4>
                    <button class="btn btn-outline btn-sm" @click="refreshSessions">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      刷新
                    </button>
                  </div>
                  
                  <div class="space-y-2">
                    <div v-for="session in activeSessions" :key="session.id" 
                         class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                      <div class="flex items-center gap-3">
                        <div class="avatar placeholder">
                          <div class="bg-neutral-focus text-neutral-content rounded-full w-8">
                            <span class="text-xs">{{ session.device.charAt(0) }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="font-medium text-sm">{{ session.device }}</div>
                          <div class="text-xs opacity-70">{{ session.location }} • {{ session.lastActive }}</div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-2">
                        <div v-if="session.current" class="badge badge-success badge-sm">当前</div>
                        <button v-else class="btn btn-ghost btn-xs text-error" 
                                @click="terminateSession(session.id)">
                          终止
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button class="btn btn-error btn-sm" @click="terminateAllSessions">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-1 stroke-current">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    终止所有其他会话
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统维护 -->
        <div v-if="activeTab === 'system'" class="space-y-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-xl mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mr-2 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                系统维护
              </h3>
              
              <div class="space-y-6">
                <!-- 系统信息 -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="stat bg-base-200 rounded-lg">
                    <div class="stat-title">系统版本</div>
                    <div class="stat-value text-lg">v2.1.0</div>
                    <div class="stat-desc">最新版本</div>
                  </div>
                  
                  <div class="stat bg-base-200 rounded-lg">
                    <div class="stat-title">运行时间</div>
                    <div class="stat-value text-lg">15天</div>
                    <div class="stat-desc">稳定运行</div>
                  </div>
                  
                  <div class="stat bg-base-200 rounded-lg">
                    <div class="stat-title">内存使用</div>
                    <div class="stat-value text-lg">68%</div>
                    <div class="stat-desc text-success">正常</div>
                  </div>
                  
                  <div class="stat bg-base-200 rounded-lg">
                    <div class="stat-title">磁盘空间</div>
                    <div class="stat-value text-lg">45%</div>
                    <div class="stat-desc text-success">充足</div>
                  </div>
                </div>
                
                <!-- 维护操作 -->
                <div class="space-y-4">
                  <h4 class="font-medium">维护操作</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button class="btn btn-outline" @click="clearCache">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      清理缓存
                    </button>
                    
                    <button class="btn btn-outline" @click="optimizeDatabase">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
                      </svg>
                      优化数据库
                    </button>
                    
                    <button class="btn btn-outline" @click="exportLogs">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      导出日志
                    </button>
                    
                    <button class="btn btn-outline" @click="checkUpdates">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      检查更新
                    </button>
                  </div>
                </div>
                
                <!-- 数据备份 -->
                <div class="space-y-4">
                  <h4 class="font-medium">数据备份</h4>
                  
                  <div class="form-control">
                    <label class="label cursor-pointer">
                      <span class="label-text">自动备份</span>
                      <input type="checkbox" v-model="systemSettings.autoBackup" 
                             class="toggle toggle-primary" />
                    </label>
                  </div>
                  
                  <div v-if="systemSettings.autoBackup" class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">备份频率</span>
                    </label>
                    <select v-model="systemSettings.backupFrequency" class="select select-bordered max-w-xs">
                      <option value="daily">每日备份</option>
                      <option value="weekly">每周备份</option>
                      <option value="monthly">每月备份</option>
                    </select>
                  </div>
                  
                  <div class="flex gap-2">
                    <button class="btn btn-primary" @click="createBackup">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                      </svg>
                      立即备份
                    </button>
                    
                    <button class="btn btn-outline" @click="restoreBackup">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 mr-2 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      恢复备份
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 当前激活的标签页
const activeTab = ref('profile')

// 保存状态
const saving = ref(false)

// 个人资料设置
const profileSettings = reactive({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  username: 'admin',
  displayName: '系统管理员',
  email: 'admin@example.com',
  phone: '+86 138 0013 8000',
  bio: '负责系统安全监控和异常检测管理'
})

// 显示设置
const displaySettings = reactive({
  theme: 'auto',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  refreshInterval: 30,
  animations: true,
  sidebar: true,
  compact: false,
  gridLines: true
})

// 通知设置
const notificationSettings = reactive({
  browser: true,
  email: true,
  sms: false,
  security: true,
  updates: true,
  reports: false,
  maintenance: true,
  doNotDisturb: false,
  quietStart: '22:00',
  quietEnd: '08:00'
})

// 安全设置
const securitySettings = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactor: false
})

// 系统设置
const systemSettings = reactive({
  autoBackup: true,
  backupFrequency: 'weekly'
})

// 活跃会话
const activeSessions = ref([
  {
    id: 1,
    device: 'Chrome on Windows',
    location: '北京市',
    lastActive: '2分钟前',
    current: true
  },
  {
    id: 2,
    device: 'Safari on iPhone',
    location: '上海市',
    lastActive: '1小时前',
    current: false
  },
  {
    id: 3,
    device: 'Firefox on Linux',
    location: '广州市',
    lastActive: '3天前',
    current: false
  }
])

// 方法
const uploadAvatar = () => {
  console.log('上传头像')
  // 实现头像上传逻辑
}

const saveProfile = async () => {
  saving.value = true
  // 模拟保存延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('保存个人资料', profileSettings)
  saving.value = false
}

const resetProfile = () => {
  Object.assign(profileSettings, {
    username: 'admin',
    displayName: '系统管理员',
    email: 'admin@example.com',
    phone: '+86 138 0013 8000',
    bio: '负责系统安全监控和异常检测管理'
  })
}

const saveDisplay = async () => {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('保存显示设置', displaySettings)
  saving.value = false
}

const resetDisplay = () => {
  Object.assign(displaySettings, {
    theme: 'auto',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    refreshInterval: 30,
    animations: true,
    sidebar: true,
    compact: false,
    gridLines: true
  })
}

const saveNotifications = async () => {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('保存通知设置', notificationSettings)
  saving.value = false
}

const resetNotifications = () => {
  Object.assign(notificationSettings, {
    browser: true,
    email: true,
    sms: false,
    security: true,
    updates: true,
    reports: false,
    maintenance: true,
    doNotDisturb: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  })
}

const changePassword = () => {
  if (securitySettings.newPassword !== securitySettings.confirmPassword) {
    alert('新密码和确认密码不匹配')
    return
  }
  console.log('修改密码')
  // 实现密码修改逻辑
}

const refreshSessions = () => {
  console.log('刷新会话列表')
  // 实现会话刷新逻辑
}

const terminateSession = (sessionId: number) => {
  const index = activeSessions.value.findIndex(s => s.id === sessionId)
  if (index > -1) {
    activeSessions.value.splice(index, 1)
  }
}

const terminateAllSessions = () => {
  activeSessions.value = activeSessions.value.filter(s => s.current)
}

const clearCache = () => {
  console.log('清理缓存')
  // 实现缓存清理逻辑
}

const optimizeDatabase = () => {
  console.log('优化数据库')
  // 实现数据库优化逻辑
}

const exportLogs = () => {
  console.log('导出日志')
  // 实现日志导出逻辑
}

const checkUpdates = () => {
  console.log('检查更新')
  // 实现更新检查逻辑
}

const createBackup = () => {
  console.log('创建备份')
  // 实现备份创建逻辑
}

const restoreBackup = () => {
  console.log('恢复备份')
  // 实现备份恢复逻辑
}

// 初始化
onMounted(() => {
  console.log('系统设置页面已加载')
})
</script>

<style scoped>
.card {
  @apply rounded-2xl;
}

.menu li > a.active {
  @apply bg-primary text-primary-content;
}

.stat {
  @apply rounded-xl;
}

.alert {
  @apply rounded-xl;
}
</style>