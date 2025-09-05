import serviceAxios from '@/http'
import type {
  DashboardResponse,
  RealtimeDetectionResponse,
  SingleDetectionRequest,
  SingleDetectionResponse,
  DetectionAnalysisParams,
  DetectionAnalysisResponse,
  MLModelInfoResponse,
  MLPredictionRequest,
  MLPredictionResponse,
  DetectionRecordsParams,
  DetectionRecordsResponse,
  CreateDetectionRecordRequest,
  DetectionRecordResponse,
  UpdateDetectionRecordRequest,
  UpdateDetectionRecordStatusRequest,
  DetectionConfigsParams,
  DetectionConfigsResponse,
  CreateDetectionConfigRequest,
  DetectionConfigResponse,
  NotificationConfigsParams,
  NotificationConfigsResponse,
  CreateNotificationConfigRequest,
  NotificationConfigResponse,
  UpdateNotificationConfigRequest,
  TestNotificationResponse,
  IpBlacklistParams,
  IpBlacklistResponse,
  AddIpToBlacklistRequest,
  IpBlacklistItemResponse,
  BatchAddIpToBlacklistRequest,
  BatchAddIpToBlacklistResponse,
  SystemStatsParams,
  SystemStatsResponse,
  GenerateDailyStatsResponse
} from '@/types/apis/PagesApis_T'

// 仪表板相关API
export function getDashboard(): Promise<DashboardResponse> {
  return serviceAxios({
    url: '/malicious/dashboard/',
    method: 'get'
  })
}

// 实时检测相关API
export function getRealtimeDetection(): Promise<RealtimeDetectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'get'
  })
}

export function executeSingleDetection(data: SingleDetectionRequest): Promise<SingleDetectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'post',
    data
  })
}

// 数据分析相关API
export function getDetectionAnalysis(params?: DetectionAnalysisParams): Promise<DetectionAnalysisResponse> {
  return serviceAxios({
    url: '/malicious/detection-analysis/',
    method: 'get',
    params
  })
}

// 机器学习模型相关API
export function getMLModelInfo(): Promise<MLModelInfoResponse> {
  return serviceAxios({
    url: '/malicious/ml-model/',
    method: 'get'
  })
}

export function executeMLPrediction(data: MLPredictionRequest): Promise<MLPredictionResponse> {
  return serviceAxios({
    url: '/malicious/ml-model/',
    method: 'post',
    data
  })
}

// 检测记录相关API
export function getDetectionRecords(params?: DetectionRecordsParams): Promise<DetectionRecordsResponse> {
  return serviceAxios({
    url: '/malicious/detectionRecords/',
    method: 'get',
    params
  })
}

export function createDetectionRecord(data: CreateDetectionRecordRequest): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: '/malicious/detectionRecords/',
    method: 'post',
    data
  })
}

export function getDetectionRecord(id: number): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'get'
  })
}

export function updateDetectionRecord(id: number, data: UpdateDetectionRecordRequest): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'put',
    data
  })
}

export function deleteDetectionRecord(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'delete'
  })
}

export function updateDetectionRecordStatus(id: number, data: UpdateDetectionRecordStatusRequest): Promise<DetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/update_status/`,
    method: 'post',
    data
  })
}

// 检测配置相关API
export function getDetectionConfigs(params?: DetectionConfigsParams): Promise<DetectionConfigsResponse> {
  return serviceAxios({
    url: '/malicious/detection-configs/',
    method: 'get',
    params
  })
}

export function createDetectionConfig(data: CreateDetectionConfigRequest): Promise<DetectionConfigResponse> {
  return serviceAxios({
    url: '/malicious/detection-configs/',
    method: 'post',
    data
  })
}

export function activateDetectionConfig(id: number): Promise<DetectionConfigResponse> {
  return serviceAxios({
    url: `/malicious/detection-configs/${id}/activate/`,
    method: 'post'
  })
}

// 通知配置相关API
export function getNotificationConfigs(params?: NotificationConfigsParams): Promise<NotificationConfigsResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'get',
    params
  })
}

export function createNotificationConfig(data: CreateNotificationConfigRequest): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'post',
    data
  })
}

export function getNotificationConfig(id: number): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/`,
    method: 'get'
  })
}

export function updateNotificationConfig(id: number, data: UpdateNotificationConfigRequest): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/`,
    method: 'put',
    data
  })
}

export function deleteNotificationConfig(id: number): Promise<void> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/`,
    method: 'delete'
  })
}

export function testNotificationConfig(id: number): Promise<TestNotificationResponse> {
  return serviceAxios({
    url: `/malicious/notification-configs/${id}/test_notification/`,
    method: 'post'
  })
}

// IP黑名单相关API
export function getIpBlacklist(params?: IpBlacklistParams): Promise<IpBlacklistResponse> {
  return serviceAxios({
    url: '/malicious/blacklist-ips/',
    method: 'get',
    params
  })
}

export function addIpToBlacklist(data: AddIpToBlacklistRequest): Promise<IpBlacklistItemResponse> {
  return serviceAxios({
    url: '/malicious/blacklist-ips/',
    method: 'post',
    data
  })
}

export function batchAddIpToBlacklist(data: BatchAddIpToBlacklistRequest): Promise<BatchAddIpToBlacklistResponse> {
  return serviceAxios({
    url: '/malicious/blacklist-ips/batch_add/',
    method: 'post',
    data
  })
}

// 系统统计相关API
export function getSystemStats(params?: SystemStatsParams): Promise<SystemStatsResponse> {
  return serviceAxios({
    url: '/malicious/system-stats/',
    method: 'get',
    params
  })
}

export function generateDailyStats(data: { date: string }): Promise<GenerateDailyStatsResponse> {
  return serviceAxios({
    url: '/malicious/system-stats/generate_daily_stats/',
    method: 'post',
    data
  })
}