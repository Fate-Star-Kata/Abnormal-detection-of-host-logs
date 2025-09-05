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
  GetDetectionRecordsBody,
  DetectionRecordsResponse,
  UpdateDetectionRecordBody,
  UpdateDetectionRecordResponse,
  NotificationConfigResponse,
  CreateNotificationConfigBody,
  CreateNotificationConfigResponse,
  TestNotificationBody,
  TestNotificationResponse
} from '@/types/apis/user/common'

// ===== 仪表板接口 =====

/**
 * 获取用户端仪表板统计数据
 */
export function getDashboardStats(): Promise<DashboardStatsResponse> {
  return serviceAxios({
    url: '/dashboard/stats/',
    method: 'get',
  })
}

// ===== 实时检测接口 =====

/**
 * 获取实时检测状态
 */
export function getDetection(): Promise<DetectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'get',
  })
}

/**
 * 执行单次检测
 */
export function postDetection(data: PostDetectionBody): Promise<PostDetectionResponse> {
  return serviceAxios({
    url: '/malicious/realtime-detection/',
    method: 'post',
    data,
  })
}

// ===== 数据分析接口 =====

/**
 * 获取检测分析数据
 */
export function getDetectionAnalysis(params: GetDetectionAnalysisBody): Promise<DetectionAnalysisResponse> {
  return serviceAxios({
    url: '/analysis/detection-data/',
    method: 'get',
    params,
  })
}

// ===== 机器学习模型接口 =====

/**
 * 获取模型信息
 */
export function getModelInfo(): Promise<ModelInfoResponse> {
  return serviceAxios({
    url: '/ml/model-info/',
    method: 'get',
  })
}

/**
 * 执行模型预测
 */
export function postModelPrediction(data: PostModelPredictionBody): Promise<ModelPredictionResponse> {
  return serviceAxios({
    url: '/ml/predict/',
    method: 'post',
    data,
  })
}

// ===== 检测记录接口 =====

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
 * 获取检测记录详情
 */
export function getDetectionRecord(id: number): Promise<UpdateDetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'get',
  })
}

/**
 * 更新检测记录
 */
export function updateDetectionRecord(id: number, data: UpdateDetectionRecordBody): Promise<UpdateDetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/`,
    method: 'put',
    data,
  })
}

/**
 * 更新检测记录状态
 */
export function updateDetectionRecordStatus(id: number, data: UpdateDetectionRecordBody): Promise<UpdateDetectionRecordResponse> {
  return serviceAxios({
    url: `/malicious/detectionRecords/${id}/update_status/`,
    method: 'post',
    data,
  })
}

// ===== 通知配置接口 =====

/**
 * 获取通知配置列表
 */
export function getNotificationConfigs(): Promise<NotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'get',
  })
}

/**
 * 创建通知配置
 */
export function createNotificationConfig(data: CreateNotificationConfigBody): Promise<CreateNotificationConfigResponse> {
  return serviceAxios({
    url: '/malicious/notification-configs/',
    method: 'post',
    data,
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