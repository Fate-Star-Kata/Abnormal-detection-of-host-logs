import serviceAxios from '@/http'
import type {
  DashboardStatsResponse,
  DetectionResponse,
  PostDetectionBody,
  PostDetectionResponse,
  DetectionAnalysisResponse,
  GetDetectionAnalysisBody,
  ModelInfoResponse,
  PostModelPredictionBody,
  ModelPredictionResponse,
  DetectionRecordsResponse,
  GetDetectionRecordsBody,
  UpdateDetectionRecordBody,
  UpdateDetectionRecordResponse,
  NotificationConfigResponse,
  CreateNotificationConfigBody,
  CreateNotificationConfigResponse,
  TestNotificationBody,
  TestNotificationResponse
} from '@/types/apis/user/common'
import type {
  AdminDashboardResponse,
  DetectionRecordsResponse as AdminDetectionRecordsResponse,
  GetDetectionRecordsBody as AdminGetDetectionRecordsBody,
  CreateDetectionRecordBody,
  DetectionRecordResponse,
  UpdateDetectionRecordBody as AdminUpdateDetectionRecordBody,
  UsersResponse,
  GetUsersBody,
  CreateUserBody,
  UpdateUserBody,
  UserResponse,
  DetectionConfigsResponse,
  GetDetectionConfigsBody,
  CreateDetectionConfigBody,
  UpdateDetectionConfigBody,
  DetectionConfigResponse,
  NotificationConfigsResponse,
  GetNotificationConfigsBody,
  CreateNotificationConfigBody as AdminCreateNotificationConfigBody,
  UpdateNotificationConfigBody,
  NotificationConfigResponse as AdminNotificationConfigResponse,
  TestNotificationBody as AdminTestNotificationBody,
  TestNotificationResponse as AdminTestNotificationResponse,
  BlacklistResponse,
  GetBlacklistBody,
  AddBlacklistBody,
  BatchAddBlacklistBody,
  BlacklistEntryResponse,
  SystemStatsResponse,
  GetSystemStatsBody,
  GenerateDailyStatsResponse,
  BackupsResponse,
  GetBackupsBody,
  CreateBackupBody,
  RestoreBackupBody,
  BackupOperationResponse,
  SystemMonitoringResponse,
  SystemLogsResponse,
  GetSystemLogsBody,
  SystemMaintenanceBody,
  SystemMaintenanceResponse
} from '@/types/apis/admin/common'

// 用户端仪表板相关API
export function getDashboard(): Promise<DashboardStatsResponse> {
  return serviceAxios({
    url: '/malicious/dashboard/',
    method: 'get'
  })
}

// 管理员仪表板相关API
export function getAdminDashboard(): Promise<AdminDashboardResponse> {
  return serviceAxios({
    url: '/malicious/admin/dashboard/',
    method: 'get'
  })
}

// 实时检测相关API
export function getRealtimeDetection(): Promise<DetectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'get'
  })
}

export function executeSingleDetection(data: PostDetectionBody): Promise<PostDetectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'post',
    data
  })
}

// 数据分析相关API
export function getDetectionAnalysis(params?: GetDetectionAnalysisBody): Promise<DetectionAnalysisResponse> {
  return serviceAxios({
    url: '/malicious/detection-analysis/',
    method: 'get',
    params
  })
}

// 机器学习模型相关API
export function getMLModelInfo(): Promise<ModelInfoResponse> {
  return serviceAxios({
    url: '/malicious/ml-model/',
    method: 'get'
  })
}

export function executeMLPrediction(data: PostModelPredictionBody): Promise<ModelPredictionResponse> {
  return serviceAxios({
    url: '/malicious/ml-model/',
    method: 'post',
    data
  })
}

// 用户端检测记录相关API
export function getDetectionRecords(params?: GetDetectionRecordsBody): Promise<DetectionRecordsResponse> {
  return serviceAxios({
    url: '/malicious/detectionRecords/',
    method: 'get',
    params
  })
}

export function updateDetectionRecord(id: number, data: UpdateDetectionRecordBody): Promise<UpdateDetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'put',
    data
  })
}

// 管理员检测记录相关API
export function getAdminDetectionRecords(params?: AdminGetDetectionRecordsBody): Promise<AdminDetectionRecordsResponse> {
  return serviceAxios({
    url: '/malicious/detectionRecords/',
    method: 'get',
    params
  })
}

export function createDetectionRecord(data: CreateDetectionRecordBody): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: '/malicious/admin/detectionRecords/',
    method: 'post',
    data
  })
}

export function getDetectionRecord(id: number): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/admin/detectionRecords/${id}/`,
    method: 'get'
  })
}

export function updateAdminDetectionRecord(id: number, data: AdminUpdateDetectionRecordBody): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/admin/detectionRecords/${id}/`,
    method: 'put',
    data
  })
}

export function deleteDetectionRecord(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/admin/detectionRecords/${id}/`,
    method: 'delete'
  })
}

export function deleteAdminDetectionRecord(id: number): Promise<{ code: number, msg: string }> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'delete'
  })
}

// 用户管理相关API
export function getUsers(params?: GetUsersBody): Promise<UsersResponse> {
  return serviceAxios({
    url: '/malicious/admin/users/',
    method: 'get',
    params
  })
}

export function createUser(data: CreateUserBody): Promise<UserResponse> {
  return serviceAxios({
    url: '/malicious/admin/users/',
    method: 'post',
    data
  })
}

export function getUser(id: number): Promise<UserResponse> {
  return serviceAxios({
    url: `/malicious/admin/users/${id}/`,
    method: 'get'
  })
}

export function updateUser(id: number, data: UpdateUserBody): Promise<UserResponse> {
  return serviceAxios({
    url: `/malicious/admin/users/${id}/`,
    method: 'put',
    data
  })
}

export function deleteUser(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/admin/users/${id}/`,
    method: 'delete'
  })
}

// 检测配置相关API
export function getDetectionConfigs(params?: GetDetectionConfigsBody): Promise<DetectionConfigsResponse> {
  return serviceAxios({
    url: '/malicious/detection-configs/',
    method: 'get',
    params
  })
}

export function createDetectionConfig(data: CreateDetectionConfigBody): Promise<DetectionConfigResponse> {
  return serviceAxios({
    url: '/malicious/detection-configs/',
    method: 'post',
    data
  })
}

export function getDetectionConfig(id: number): Promise<DetectionConfigResponse> {
  return serviceAxios({
    url: `/malicious/detection-configs/${id}/`,
    method: 'get'
  })
}

export function updateDetectionConfig(id: number, data: UpdateDetectionConfigBody): Promise<DetectionConfigResponse> {
  return serviceAxios({
    url: `/malicious/detection-configs/${id}/`,
    method: 'put',
    data
  })
}

export function deleteDetectionConfig(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/detection-configs/${id}/`,
    method: 'delete',
  })
}

// 激活检测配置
export function activateDetectionConfig(id: number): Promise<{ code: number, msg: string }> {
  return serviceAxios({
    url: `/malicious/detection-configs/${id}/activate/`,
    method: 'post',
  })
}

// 禁用检测配置
export function deactivateDetectionConfig(id: number): Promise<{ code: number, msg: string }> {
  return serviceAxios({
    url: `/malicious/detection-configs/${id}/deactivate/`,
    method: 'post',
  })
}

// 用户端通知配置相关API
export function getNotificationConfigs(): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'get'
  })
}

export function createNotificationConfig(data: CreateNotificationConfigBody): Promise<CreateNotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'post',
    data
  })
}

export function testNotificationConfig(data: TestNotificationBody): Promise<TestNotificationResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/test/',
    method: 'post',
    data
  })
}

// 管理员通知配置相关API
export function getAdminNotificationConfigs(params?: GetNotificationConfigsBody): Promise<NotificationConfigsResponse> {
  return serviceAxios({
    url: '/malicious/admin/notification-configs/',
    method: 'get',
    params
  })
}

export function createAdminNotificationConfig(data: AdminCreateNotificationConfigBody): Promise<AdminNotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/admin/notification-configs/',
    method: 'post',
    data
  })
}

export function getAdminNotificationConfig(id: number): Promise<AdminNotificationConfigResponse> {
  return serviceAxios({
    url: `/malicious/admin/notification-configs/${id}/`,
    method: 'get'
  })
}

export function updateAdminNotificationConfig(id: number, data: UpdateNotificationConfigBody): Promise<AdminNotificationConfigResponse> {
  return serviceAxios({
    url: `/malicious/admin/notification-configs/${id}/`,
    method: 'put',
    data
  })
}

export function deleteAdminNotificationConfig(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/admin/notification-configs/${id}/`,
    method: 'delete'
  })
}

export function testAdminNotificationConfig(data: AdminTestNotificationBody): Promise<AdminTestNotificationResponse> {
  return serviceAxios({
    url: '/malicious/admin/notification-configs/test/',
    method: 'post',
    data
  })
}

// IP黑名单相关API
export function getIpBlacklist(params?: GetBlacklistBody): Promise<BlacklistResponse> {
  return serviceAxios({
    url: '/malicious/admin/blacklist-ips/',
    method: 'get',
    params
  })
}

export function addIpToBlacklist(data: AddBlacklistBody): Promise<BlacklistEntryResponse> {
  return serviceAxios({
    url: '/malicious/admin/blacklist-ips/',
    method: 'post',
    data
  })
}

export function batchAddIpToBlacklist(data: BatchAddBlacklistBody): Promise<BlacklistEntryResponse> {
  return serviceAxios({
    url: '/malicious/admin/blacklist-ips/batch_add/',
    method: 'post',
    data
  })
}

export function deleteIpFromBlacklist(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/admin/blacklist-ips/${id}/`,
    method: 'delete'
  })
}

// 系统统计相关API
export function getSystemStats(params?: GetSystemStatsBody): Promise<SystemStatsResponse> {
  return serviceAxios({
    url: '/malicious/admin/system-stats/',
    method: 'get',
    params
  })
}

export function generateDailyStats(data: { date: string }): Promise<GenerateDailyStatsResponse> {
  return serviceAxios({
    url: '/malicious/admin/system-stats/generate_daily_stats/',
    method: 'post',
    data
  })
}

// 数据备份与恢复相关API
export function getBackups(params?: GetBackupsBody): Promise<BackupsResponse> {
  return serviceAxios({
    url: '/malicious/admin/backups/',
    method: 'get',
    params
  })
}

export function createBackup(data: CreateBackupBody): Promise<BackupOperationResponse> {
  return serviceAxios({
    url: '/malicious/admin/backups/',
    method: 'post',
    data
  })
}

export function restoreBackup(data: RestoreBackupBody): Promise<BackupOperationResponse> {
  return serviceAxios({
    url: '/malicious/admin/backups/restore/',
    method: 'post',
    data
  })
}

export function deleteBackup(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/admin/backups/${id}/`,
    method: 'delete'
  })
}

// 系统监控相关API
export function getSystemMonitoring(): Promise<SystemMonitoringResponse> {
  return serviceAxios({
    url: '/malicious/admin/system-monitoring/',
    method: 'get'
  })
}

export function getSystemLogs(params?: GetSystemLogsBody): Promise<SystemLogsResponse> {
  return serviceAxios({
    url: '/malicious/admin/system-logs/',
    method: 'get',
    params
  })
}

export function systemMaintenance(data: SystemMaintenanceBody): Promise<SystemMaintenanceResponse> {
  return serviceAxios({
    url: '/malicious/admin/system-maintenance/',
    method: 'post',
    data
  })
}