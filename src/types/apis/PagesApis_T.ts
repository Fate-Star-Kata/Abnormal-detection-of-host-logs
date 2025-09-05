// 仪表板相关类型
export interface DashboardResponse {
  code: number
  msg: string
  data: {
    today_detections: number
    today_malicious: number
    today_threat_ips: number
    system_status: string
    uptime_days: number
    detection_trend: number
    malicious_trend: number
    threat_trend: number
  }
}

// 实时检测相关类型
export interface RealtimeDetectionResponse {
  status: string
  current_config: {
    id: number
    name: string
    description: string
    sensitivity: number
    high_risk_threshold: number
    medium_risk_threshold: number
    detection_interval: number
    is_active: boolean
    created_at: string
  } | null
  recent_detections: DetectionRecord[]
  active_threats: number
  detection_rate: number
}

export interface DetectionRecord {
  id: number
  ip_address: string
  username: string
  login_time: string
  risk_score: number
  risk_level: string
  risk_level_display: string
  is_malicious: boolean
  status: string
  status_display: string
  user_agent?: string
  location?: string
  anomaly_type?: string
  notes?: string
  created_at: string
  updated_at?: string
}

export interface SingleDetectionRequest {
  ip_address: string
  username: string
  login_time: string
  user_agent?: string
  location?: string
}

export interface SingleDetectionResponse {
  success: boolean
  detection_record: DetectionRecord
  prediction: {
    risk_score: number
    risk_level: string
    is_malicious: boolean
    confidence: number
    method: string
    features?: object
  }
}

// 数据分析相关类型
export interface DetectionAnalysisParams {
  time_range?: string
  risk_level?: string
}

export interface DetectionAnalysisResponse {
  time_range: string
  total_detections: number
  malicious_count: number
  risk_distribution: {
    high?: number
    medium?: number
    low?: number
  }
  hourly_stats: Array<{
    hour: number
    count: number
  }>
  top_threat_ips: Array<{
    ip_address: string
    count: number
    avg_risk_score: number
  }>
  geographic_distribution: Array<{
    country: string
    count: number
  }>
}

// 机器学习模型相关类型
export interface MLModelInfoResponse {
  status: string
  method: string
  model_path: string
  preprocessor_path: string
  model_type: string
  model_name?: string
  version?: string
  accuracy?: number
  f1_score?: number
  is_available?: boolean
  last_trained?: string
  features_count?: number
}

export interface MLPredictionRequest {
  ip_address: string
  username: string
  login_time: string
  user_agent?: string
  location?: string
}

export interface MLPredictionResponse {
  is_malicious: boolean
  risk_score: number
  risk_level: string
  confidence: number
  method: string
  features?: object
}

// 检测记录相关类型
export interface DetectionRecordsParams {
  page?: number
  page_size?: number
  risk_level?: string
  is_malicious?: boolean
  start_date?: string
  end_date?: string
  ip_address?: string
  username?: string
}

export interface DetectionRecordsResponse {
  code: number
  msg: string
  data: {
    count: number
    next: string | null
    previous: string | null
    results: DetectionRecord[]
  }
}

export interface CreateDetectionRecordRequest {
  ip_address: string
  username: string
  login_time: string
  user_agent?: string
  location?: string
  notes?: string
}

export interface DetectionRecordResponse {
  code: number
  msg: string
  data: DetectionRecord
}

export interface UpdateDetectionRecordRequest {
  status?: string
  notes?: string
  is_malicious?: boolean
}

export interface UpdateDetectionRecordStatusRequest {
  status: string
  notes?: string
}

// 检测配置相关类型
export interface DetectionConfigsParams {
  page?: number
  page_size?: number
  is_active?: boolean
}

export interface DetectionConfigsResponse {
  code: number
  msg: string
  data: {
    count: number
    next: string | null
    previous: string | null
    results: DetectionConfig[]
  }
}

export interface DetectionConfig {
  id: number
  name: string
  description: string
  sensitivity: number
  high_risk_threshold: number
  medium_risk_threshold: number
  detection_interval: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface CreateDetectionConfigRequest {
  name: string
  description?: string
  sensitivity: number
  high_risk_threshold: number
  medium_risk_threshold: number
  detection_interval: number
}

export interface DetectionConfigResponse {
  code: number
  msg: string
  data: DetectionConfig
}

// 通知配置相关类型
export interface NotificationConfigsParams {
  page?: number
  page_size?: number
  type?: string
  is_active?: boolean
}

export interface NotificationConfigsResponse {
  code: number
  msg: string
  data: {
    count: number
    next: string | null
    previous: string | null
    results: NotificationConfig[]
  }
}

export interface NotificationConfig {
  id: number
  name: string
  type: string
  config: object
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface CreateNotificationConfigRequest {
  name: string
  type: string
  config: object
  is_active?: boolean
}

export interface NotificationConfigResponse {
  code: number
  msg: string
  data: NotificationConfig
}

// 注意：根据API文档，通知配置模块只有3个接口，因此删除了UpdateNotificationConfigRequest类型

export interface TestNotificationResponse {
  code: number
  msg: string
  data: {
    success: boolean
    message: string
  }
}

// IP黑名单相关类型
export interface IpBlacklistParams {
  page?: number
  page_size?: number
  ip_address?: string
}

export interface IpBlacklistResponse {
  code: number
  msg: string
  data: {
    count: number
    next: string | null
    previous: string | null
    results: IpBlacklistItem[]
  }
}

export interface IpBlacklistItem {
  id: number
  ip_address: string
  reason: string
  created_at: string
  updated_at?: string
}

export interface AddIpToBlacklistRequest {
  ip_address: string
  reason?: string
}

export interface IpBlacklistItemResponse {
  code: number
  msg: string
  data: IpBlacklistItem
}

export interface BatchAddIpToBlacklistRequest {
  ip_addresses: string[]
  reason?: string
}

export interface BatchAddIpToBlacklistResponse {
  code: number
  msg: string
  data: {
    success_count: number
    failed_count: number
    failed_ips?: string[]
  }
}

// 系统统计相关类型
export interface SystemStatsParams {
  start_date?: string
  end_date?: string
  granularity?: string
}

export interface SystemStatsResponse {
  code: number
  msg: string
  data: {
    total_detections: number
    total_malicious: number
    total_threat_ips: number
    detection_rate: number
    accuracy_rate: number
    daily_stats: Array<{
      date: string
      detections: number
      malicious: number
      threat_ips: number
    }>
  }
}

export interface GenerateDailyStatsResponse {
  code: number
  msg: string
  data: {
    date: string
    total_detections: number
    malicious_count: number
    threat_ips_count: number
    generated_at: string
  }
}

// 通用响应类型
export interface BaseResponse {
  code: number
  msg: string
}

export interface ErrorResponse {
  success: boolean
  error: string
  error_code: string
  details: object
}