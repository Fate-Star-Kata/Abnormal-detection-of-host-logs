import serviceAxios from '@/http'
import type {
  AdminDashboardResponse,
  GetDetectionRecordsBody,
  DetectionRecordsResponse,
  CreateDetectionRecordBody,
  UpdateDetectionRecordBody,
  DetectionRecordResponse,
  GetUsersBody,
  UsersResponse,
  CreateUserBody,
  UpdateUserBody,
  UserResponse,
  GetDetectionRulesBody,
  DetectionRulesResponse,
  CreateDetectionRuleBody,
  UpdateDetectionRuleBody,
  DetectionRuleResponse,
  GetNotificationConfigsBody,
  NotificationConfigsResponse,
  CreateNotificationConfigBody,
  UpdateNotificationConfigBody,
  NotificationConfigResponse,
  TestNotificationBody,
  TestNotificationResponse,
  GetBlacklistBody,
  BlacklistResponse,
  AddBlacklistBody,
  BatchAddBlacklistBody,
  BlacklistEntryResponse,
  GetSystemStatsBody,
  SystemStatsResponse,
  GenerateDailyStatsResponse,
  GetBackupsBody,
  BackupsResponse,
  CreateBackupBody,
  RestoreBackupBody,
  BackupOperationResponse,
  SystemMonitoringResponse,
  GetSystemLogsBody,
  SystemLogsResponse,
  SystemMaintenanceBody,
  SystemMaintenanceResponse
} from '@/types/apis/admin/common'

// ===== 管理员仪表盘接口 =====

/**
 * 获取管理员仪表盘数据
 */
export function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return serviceAxios({
    url: '/admin/dashboard/',
    method: 'get',
  })
}

// ===== 检测记录管理接口 =====

/**
 * 获取检测记录列表
 */
export function getDetectionRecords(params: GetDetectionRecordsBody): Promise<DetectionRecordsResponse> {
  return serviceAxios({
    url: '/malicious/detectionRecords/',
    method: 'get',
    params,
  })
}

/**
 * 创建检测记录
 */
export function createDetectionRecord(data: CreateDetectionRecordBody): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: '/malicious/detectionRecords/',
    method: 'post',
    data,
  })
}

/**
 * 获取检测记录详情
 */
export function getDetectionRecord(id: number): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'get',
  })
}

/**
 * 更新检测记录
 */
export function updateDetectionRecord(id: number, data: UpdateDetectionRecordBody): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'put',
    data,
  })
}

/**
 * 删除检测记录
 */
export function deleteDetectionRecord(id: number): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'delete',
  })
}

/**
 * 更新检测记录状态
 */
export function updateDetectionRecordStatus(
  id: number,
  data: UpdateDetectionRecordBody
): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/update_status/`,
    method: "post",
    data,
  });
}

// ===== 用户权限管理接口 =====

/**
 * 获取用户列表
 */
export function getUsers(params: GetUsersBody): Promise<UsersResponse> {
  return serviceAxios({
    url: '/admin/users/',
    method: 'get',
    params,
  })
}

/**
 * 创建用户
 */
export function createUser(data: CreateUserBody): Promise<UserResponse> {
  return serviceAxios({
    url: '/admin/users/',
    method: 'post',
    data,
  })
}

/**
 * 获取用户详情
 */
export function getUser(id: number): Promise<UserResponse> {
  return serviceAxios({
    url: `/admin/users/${id}/`,
    method: 'get',
  })
}

/**
 * 更新用户信息
 */
export function updateUser(id: number, data: UpdateUserBody): Promise<UserResponse> {
  return serviceAxios({
    url: `/admin/users/${id}/`,
    method: 'put',
    data,
  })
}

/**
 * 删除用户
 */
export function deleteUser(id: number): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: `/admin/users/${id}/`,
    method: 'delete',
  })
}

// ===== 检测规则配置接口 =====

/**
 * 获取检测规则列表
 */
export function getDetectionRules(params: GetDetectionRulesBody): Promise<DetectionRulesResponse> {
  return serviceAxios({
    url: '/malicious/detection-rules/',
    method: 'get',
    params,
  })
}

/**
 * 创建检测规则
 */
export function createDetectionRule(data: CreateDetectionRuleBody): Promise<DetectionRuleResponse> {
  return serviceAxios({
    url: '/malicious/detection-rules/',
    method: 'post',
    data,
  })
}

/**
 * 获取检测规则详情
 */
export function getDetectionRule(id: number): Promise<DetectionRuleResponse> {
  return serviceAxios({
    url: `/malicious/detection-rules/${id}/`,
    method: 'get',
  })
}

/**
 * 更新检测规则
 */
export function updateDetectionRule(id: number, data: UpdateDetectionRuleBody): Promise<DetectionRuleResponse> {
  return serviceAxios({
    url: `/malicious/detection-rules/${id}/`,
    method: 'put',
    data,
  })
}

/**
 * 删除检测规则
 */
export function deleteDetectionRule(id: number): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: `/malicious/detection-rules/${id}/`,
    method: 'delete',
  })
}

/**
 * 激活检测规则
 */
export function activateDetectionRule(id: number): Promise<DetectionRuleResponse> {
  return serviceAxios({
    url: `/malicious/detection-rules/${id}/activate/`,
    method: 'post',
  })
}

// ===== 通知配置管理接口 =====

/**
 * 获取通知配置列表
 */
export function getNotificationConfigs(params: GetNotificationConfigsBody): Promise<NotificationConfigsResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'get',
    params,
  })
}

/**
 * 创建通知配置
 */
export function createNotificationConfig(data: CreateNotificationConfigBody): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'post',
    data,
  })
}

/**
 * 获取通知配置详情
 */
export function getNotificationConfig(id: number): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/`,
    method: 'get',
  })
}

/**
 * 更新通知配置
 */
export function updateNotificationConfig(id: number, data: UpdateNotificationConfigBody): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/`,
    method: 'put',
    data,
  })
}

/**
 * 删除通知配置
 */
export function deleteNotificationConfig(id: number): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/`,
    method: 'delete',
  })
}

/**
 * 测试通知配置
 */
export function testNotificationConfig(id: number): Promise<TestNotificationResponse> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/test_notification/`,
    method: 'post',
  })
}

// ===== IP黑名单管理接口 =====

/**
 * 获取IP黑名单列表
 */
export function getBlacklist(params: GetBlacklistBody): Promise<BlacklistResponse> {
  return serviceAxios({
    url: '/malicious/ip-blacklist/',
    method: 'get',
    params,
  })
}

/**
 * 添加IP到黑名单
 */
export function addToBlacklist(data: AddBlacklistBody): Promise<BlacklistEntryResponse> {
  return serviceAxios({
    url: '/malicious/ip-blacklist/',
    method: 'post',
    data,
  })
}

/**
 * 批量添加IP到黑名单
 */
export function batchAddToBlacklist(data: BatchAddBlacklistBody): Promise<{ code: number; msg: string; data: { success_count: number; failed_count: number } }> {
  return serviceAxios({
    url: '/malicious/ip-blacklist/batch_add/',
    method: 'post',
    data,
  })
}

/**
 * 从黑名单删除IP
 */
export function removeFromBlacklist(id: number): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: `/malicious/ip-blacklist/${id}/`,
    method: 'delete',
  })
}

// ===== 系统统计接口 =====

/**
 * 获取系统统计数据
 */
export function getSystemStats(params: GetSystemStatsBody): Promise<SystemStatsResponse> {
  return serviceAxios({
    url: '/malicious/system-stats/',
    method: 'get',
    params,
  })
}

/**
 * 生成每日统计
 */
export function generateDailyStats(): Promise<GenerateDailyStatsResponse> {
  return serviceAxios({
    url: '/malicious/system-stats/generate_daily/',
    method: 'post',
  })
}

// ===== 数据备份与恢复接口 =====

/**
 * 获取备份列表
 */
export function getBackups(params: GetBackupsBody): Promise<BackupsResponse> {
  return serviceAxios({
    url: '/admin/backups/',
    method: 'get',
    params,
  })
}

/**
 * 创建备份
 */
export function createBackup(data: CreateBackupBody): Promise<BackupOperationResponse> {
  return serviceAxios({
    url: '/admin/backups/',
    method: 'post',
    data,
  })
}

/**
 * 恢复备份
 */
export function restoreBackup(data: RestoreBackupBody): Promise<BackupOperationResponse> {
  return serviceAxios({
    url: '/admin/backups/restore/',
    method: 'post',
    data,
  })
}

/**
 * 删除备份
 */
export function deleteBackup(id: number): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: `/admin/backups/${id}/`,
    method: 'delete',
  })
}

// ===== 系统监控接口 =====

/**
 * 获取系统监控数据
 */
export function getSystemMonitoring(): Promise<SystemMonitoringResponse> {
  return serviceAxios({
    url: '/admin/system-monitoring/',
    method: 'get',
  })
}

/**
 * 获取系统日志
 */
export function getSystemLogs(params: GetSystemLogsBody): Promise<SystemLogsResponse> {
  return serviceAxios({
    url: '/admin/system-logs/',
    method: 'get',
    params,
  })
}

/**
 * 导出系统日志
 */
export function exportSystemLogs(params: GetSystemLogsBody): Promise<Blob> {
  return serviceAxios({
    url: '/admin/system-logs/export/',
    method: 'get',
    params,
    responseType: 'blob',
  })
}

/**
 * 清空系统日志
 */
export function clearSystemLogs(): Promise<{ code: number; msg: string }> {
  return serviceAxios({
    url: '/admin/system-logs/clear/',
    method: 'post',
  })
}

/**
 * 系统维护操作
 */
export function performSystemMaintenance(data: SystemMaintenanceBody): Promise<SystemMaintenanceResponse> {
  return serviceAxios({
    url: '/admin/system-maintenance/',
    method: 'post',
    data,
  })
}
