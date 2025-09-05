import { type Response } from "../../factory";

// ===== 仪表板接口 =====

export interface GetDashboardStats {
  today_detections: number;
  anomaly_logins: number;
  threat_ips: number;
  system_status: string;
  uptime: string;
  recent_alerts: RecentAlert[];
}

export interface RecentAlert {
  id: number;
  type: string;
  level: "high" | "medium" | "low";
  message: string;
  timestamp: string;
  ip_address: string;
}

export interface DashboardStatsResponse extends Response<GetDashboardStats> {
  code: number;
  msg: string;
  data: GetDashboardStats;
}

// ===== 实时检测接口 =====

export interface GetDetection {
  status: string;
  current_config: DetectionConfig | null;
  recent_detections: RecentDetection[];
  active_threats: number;
  detection_rate: number;
}

export interface DetectionConfig {
  interval: number;
  sensitivity: "low" | "medium" | "high";
  log_path: string;
  enabled_rules: string[];
}

export interface RecentDetection {
  id: number;
  ip_address: string;
  username: string;
  login_time: Date;
  risk_score: number;
  risk_level: string;
  risk_level_display: string;
  is_malicious: boolean;
  location: string;
  status: string;
  status_display: string;
  created_at: Date;
}

export interface DetectionResponse extends Response<GetDetection> {
  code: number;
  msg: string;
  data: GetDetection;
}

export interface PostDetectionBody {
  ip_address: string;
  username: string;
  login_time: string;
  user_agent: string;
  location: string;
}

export interface PostDetection {
  success: boolean;
  detection_record: DetectionRecord;
  prediction: Prediction;
}

export interface DetectionRecord {
  id: number;
  risk_level_display: string;
  status_display: string;
  ip_address: string;
  username: string;
  login_time: Date;
  risk_score: number;
  risk_level: string;
  is_malicious: boolean;
  detection_features: DetectionFeatures;
  user_agent: string;
  location: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

interface DetectionFeatures {
  method: string;
  confidence: number;
}

interface Prediction {
  is_malicious: boolean;
  risk_score: number;
  risk_level: string;
  confidence: number;
  method: string;
}

export interface PostDetectionResponse extends Response<PostDetection> {
  code: number;
  msg: string;
  data: PostDetection;
}

// ===== 数据分析接口 =====

export interface GetDetectionAnalysisBody {
  time_range: "today" | "week" | "month";
  risk_level?: "all" | "high" | "medium" | "low";
  anomaly_type?: "all" | "brute_force" | "suspicious_location";
}

export interface DetectionAnalysis {
  time_range: string;
  total_detections: number;
  malicious_count: number;
  risk_distribution: RiskDistribution;
  hourly_stats: HourlyStat[];
  top_threat_ips: ThreatIP[];
  geographic_distribution: GeographicDistribution[];
  trend_analysis: TrendAnalysis;
}

interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

interface HourlyStat {
  hour: number;
  count: number;
  malicious_count: number;
}

interface ThreatIP {
  ip_address: string;
  count: number;
  risk_score: number;
  location: string;
}

interface GeographicDistribution {
  country: string;
  count: number;
  malicious_count: number;
}

interface TrendAnalysis {
  detection_trend: number;
  malicious_trend: number;
  threat_trend: number;
}

export interface DetectionAnalysisResponse extends Response<DetectionAnalysis> {
  code: number;
  msg: string;
  data: DetectionAnalysis;
}

// ===== 机器学习模型接口 =====

export interface GetModelInfo {
  model_name: string;
  version: string;
  accuracy: number;
  last_trained: string;
  status: "active" | "training" | "inactive";
  features: string[];
}

export interface ModelInfoResponse extends Response<GetModelInfo> {
  code: number;
  msg: string;
  data: GetModelInfo;
}

export interface PostModelPredictionBody {
  features: Record<string, any>;
}

export interface ModelPrediction {
  is_malicious: boolean;
  confidence: number;
  risk_score: number;
  explanation: string[];
}

export interface ModelPredictionResponse extends Response<ModelPrediction> {
  code: number;
  msg: string;
  data: ModelPrediction;
}

// ===== 检测记录接口 =====

export interface GetDetectionRecordsBody {
  page?: number;
  page_size?: number;
  ip_address?: string;
  username?: string;
  risk_level?: "high" | "medium" | "low";
  status?: "pending" | "investigating" | "resolved" | "false_positive";
  start_time?: string;
  end_time?: string;
}

export interface DetectionRecordsList {
  total: number;
  page: number;
  page_size: number;
  records: DetectionRecord[];
}

export interface DetectionRecordsResponse extends Response<DetectionRecordsList> {
  code: number;
  msg: string;
  data: DetectionRecordsList;
}

export interface UpdateDetectionRecordBody {
  status?: "pending" | "investigating" | "resolved" | "false_positive";
  notes?: string;
}

export interface UpdateDetectionRecordResponse extends Response<DetectionRecord> {
  code: number;
  msg: string;
  data: DetectionRecord;
}

// ===== 通知配置接口 =====

export interface GetNotificationConfig {
  id: number;
  name: string;
  type: "email" | "webhook" | "sms";
  config: EmailConfig | WebhookConfig | SmsConfig;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailConfig {
  smtp_server: string;
  smtp_port: number;
  username: string;
  password: string;
  use_tls: boolean;
  recipients: string[];
}

interface WebhookConfig {
  url: string;
  method: "POST" | "PUT";
  headers: Record<string, string>;
  timeout: number;
}

interface SmsConfig {
  provider: string;
  api_key: string;
  phone_numbers: string[];
}

export interface NotificationConfigResponse extends Response<GetNotificationConfig[]> {
  code: number;
  msg: string;
  data: GetNotificationConfig[];
}

export interface CreateNotificationConfigBody {
  name: string;
  type: "email" | "webhook" | "sms";
  config: EmailConfig | WebhookConfig | SmsConfig;
  enabled?: boolean;
}

export interface CreateNotificationConfigResponse extends Response<GetNotificationConfig> {
  code: number;
  msg: string;
  data: GetNotificationConfig;
}

// 测试通知配置请求 - 已移除，改为通过ID测试
// export interface TestNotificationBody {
//   type: 'email' | 'sms' | 'webhook'
//   config: {
//     email?: string
//     phone?: string
//     webhook_url?: string
//   }
//   message: string
// }

export interface TestNotificationBody {
  config_id: number;
  test_message?: string;
}

export interface TestNotificationResponse extends Response<{ success: boolean; message: string }> {
  code: number;
  msg: string;
  data: { success: boolean; message: string };
}

