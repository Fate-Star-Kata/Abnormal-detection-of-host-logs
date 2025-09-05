import { type Response } from "../../factory";

// ===== 管理员仪表盘接口 =====

export interface GetAdminDashboard {
  today_detections: number;
  today_malicious: number;
  today_threat_ips: number;
  system_status: string;
  uptime_days: number;
  detection_trend: number;
  malicious_trend: number;
  threat_trend: number;
  total_users: number;
  active_rules: number;
  pending_alerts: number;
  system_load: SystemLoad;
}

export interface SystemLoad {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: number;
}

export interface AdminDashboardResponse extends Response<GetAdminDashboard> {
  code: number;
  msg: string;
  data: GetAdminDashboard;
}

// ===== 检测记录管理接口 =====

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

export interface DetectionRecord {
  id: number;
  ip_address: string;
  username: string;
  login_time: Date;
  risk_score: number;
  risk_level: "high" | "medium" | "low";
  risk_level_display: "高" | "中" | "低";
  is_malicious: boolean;
  location: string;
  status: "pending" | "investigating" | "resolved" | "false_positive";
  status_display: "待处理" | "调查中" | "已解决" | "误报";
  notes: string;
  created_at: Date;
  updated_at: Date;
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

export interface CreateDetectionRecordBody {
  ip_address: string;
  username: string;
  login_time: string;
  risk_score: number;
  risk_level: "high" | "medium" | "low";
  is_malicious: boolean;
  location: string;
  notes?: string;
}

export interface UpdateDetectionRecordBody {
  status?: "pending" | "investigating" | "resolved" | "false_positive";
  notes?: string;
}

export interface DetectionRecordResponse extends Response<DetectionRecord> {
  code: number;
  msg: string;
  data: DetectionRecord;
}

// ===== 用户权限管理接口 =====

export interface GetUsersBody {
  page?: number;
  page_size?: number;
  username?: string;
  email?: string;
  role?: "admin" | "user" | "viewer";
  status?: "active" | "inactive" | "locked";
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user" | "viewer";
  status: "active" | "inactive" | "locked";
  last_login: string | null;
  created_at: string;
  updated_at: string;
  permissions: string[];
}

export interface UsersList {
  total: number;
  page: number;
  page_size: number;
  users: User[];
}

export interface UsersResponse extends Response<UsersList> {
  code: number;
  msg: string;
  data: UsersList;
}

export interface CreateUserBody {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user" | "viewer";
  permissions?: string[];
}

export interface UpdateUserBody {
  email?: string;
  role?: "admin" | "user" | "viewer";
  status?: "active" | "inactive" | "locked";
  permissions?: string[];
}

export interface UserResponse extends Response<User> {
  code: number;
  msg: string;
  data: User;
}

// ===== 检测规则配置接口 =====

export interface GetDetectionRulesBody {
  page?: number;
  page_size?: number;
  name?: string;
  type?: string;
  status?: "active" | "inactive";
}

export interface DetectionRule {
  id: number;
  name: string;
  description: string;
  type: "brute_force" | "suspicious_location" | "time_anomaly" | "custom";
  config: RuleConfig;
  enabled: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface RuleConfig {
  threshold?: number;
  time_window?: number;
  conditions?: Record<string, any>;
  actions?: string[];
}

export interface DetectionRulesList {
  total: number;
  page: number;
  page_size: number;
  rules: DetectionRule[];
}

export interface DetectionRulesResponse extends Response<DetectionRulesList> {
  code: number;
  msg: string;
  data: DetectionRulesList;
}

export interface CreateDetectionRuleBody {
  name: string;
  description: string;
  type: "brute_force" | "suspicious_location" | "time_anomaly" | "custom";
  config: RuleConfig;
  priority?: number;
}

export interface UpdateDetectionRuleBody {
  name?: string;
  description?: string;
  config?: RuleConfig;
  enabled?: boolean;
  priority?: number;
}

export interface DetectionRuleResponse extends Response<DetectionRule> {
  code: number;
  msg: string;
  data: DetectionRule;
}

// ===== 通知配置管理接口 =====

export interface GetNotificationConfigsBody {
  page?: number;
  page_size?: number;
  name?: string;
  type?: "email" | "webhook" | "sms";
  enabled?: boolean;
}

export interface NotificationConfig {
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

export interface NotificationConfigsList {
  total: number;
  page: number;
  page_size: number;
  configs: NotificationConfig[];
}

export interface NotificationConfigsResponse extends Response<NotificationConfigsList> {
  code: number;
  msg: string;
  data: NotificationConfigsList;
}

export interface CreateNotificationConfigBody {
  name: string;
  type: "email" | "webhook" | "sms";
  config: EmailConfig | WebhookConfig | SmsConfig;
  enabled?: boolean;
}

export interface UpdateNotificationConfigBody {
  name?: string;
  config?: EmailConfig | WebhookConfig | SmsConfig;
  enabled?: boolean;
}

export interface NotificationConfigResponse extends Response<NotificationConfig> {
  code: number;
  msg: string;
  data: NotificationConfig;
}

export interface TestNotificationBody {
  config_id: number;
  test_message?: string;
}

export interface TestNotificationResponse extends Response<{ success: boolean; message: string }> {
  code: number;
  msg: string;
  data: { success: boolean; message: string };
}

// ===== IP黑名单管理接口 =====

export interface GetBlacklistBody {
  page?: number;
  page_size?: number;
  ip_address?: string;
  reason?: string;
}

export interface BlacklistEntry {
  id: number;
  ip_address: string;
  reason: string;
  added_by: string;
  created_at: string;
  expires_at: string | null;
}

export interface BlacklistList {
  total: number;
  page: number;
  page_size: number;
  entries: BlacklistEntry[];
}

export interface BlacklistResponse extends Response<BlacklistList> {
  code: number;
  msg: string;
  data: BlacklistList;
}

export interface AddBlacklistBody {
  ip_address: string;
  reason: string;
  expires_at?: string;
}

export interface BatchAddBlacklistBody {
  entries: AddBlacklistBody[];
}

export interface BlacklistEntryResponse extends Response<BlacklistEntry> {
  code: number;
  msg: string;
  data: BlacklistEntry;
}

// ===== 系统统计接口 =====

export interface GetSystemStatsBody {
  start_date?: string;
  end_date?: string;
  granularity?: "hour" | "day" | "week" | "month";
}

export interface SystemStats {
  period: string;
  total_detections: number;
  malicious_detections: number;
  unique_ips: number;
  top_attack_types: AttackTypeStat[];
  hourly_distribution: HourlyDistribution[];
  geographic_stats: GeographicStat[];
  user_activity: UserActivityStat[];
}

interface AttackTypeStat {
  type: string;
  count: number;
  percentage: number;
}

interface HourlyDistribution {
  hour: number;
  count: number;
}

interface GeographicStat {
  country: string;
  count: number;
  malicious_count: number;
}

interface UserActivityStat {
  username: string;
  login_count: number;
  malicious_count: number;
}

export interface SystemStatsResponse extends Response<SystemStats> {
  code: number;
  msg: string;
  data: SystemStats;
}

export interface GenerateDailyStatsResponse extends Response<{ success: boolean; message: string }> {
  code: number;
  msg: string;
  data: { success: boolean; message: string };
}

// ===== 数据备份与恢复接口 =====

export interface GetBackupsBody {
  page?: number;
  page_size?: number;
  type?: "full" | "incremental";
}

export interface BackupRecord {
  id: number;
  filename: string;
  type: "full" | "incremental";
  size: number;
  status: "completed" | "failed" | "in_progress";
  created_at: string;
  description?: string;
}

export interface BackupsList {
  total: number;
  page: number;
  page_size: number;
  backups: BackupRecord[];
}

export interface BackupsResponse extends Response<BackupsList> {
  code: number;
  msg: string;
  data: BackupsList;
}

export interface CreateBackupBody {
  type: "full" | "incremental";
  description?: string;
}

export interface RestoreBackupBody {
  backup_id: number;
  confirm: boolean;
}

export interface BackupOperationResponse extends Response<{ success: boolean; message: string; task_id?: string }> {
  code: number;
  msg: string;
  data: { success: boolean; message: string; task_id?: string };
}

// ===== 系统监控接口 =====

export interface GetSystemMonitoringData {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: NetworkIO;
  active_connections: number;
  system_load: number[];
  uptime: number;
  services_status: ServiceStatus[];
}

interface NetworkIO {
  bytes_sent: number;
  bytes_recv: number;
  packets_sent: number;
  packets_recv: number;
}

interface ServiceStatus {
  name: string;
  status: "running" | "stopped" | "error";
  pid?: number;
  memory_usage?: number;
  cpu_usage?: number;
}

export interface SystemMonitoringResponse extends Response<GetSystemMonitoringData> {
  code: number;
  msg: string;
  data: GetSystemMonitoringData;
}

export interface GetSystemLogsBody {
  page?: number;
  page_size?: number;
  level?: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  start_time?: string;
  end_time?: string;
  keyword?: string;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  module: string;
  message: string;
  details?: Record<string, any>;
}

export interface SystemLogsList {
  total: number;
  page: number;
  page_size: number;
  logs: SystemLog[];
}

export interface SystemLogsResponse extends Response<SystemLogsList> {
  code: number;
  msg: string;
  data: SystemLogsList;
}

export interface SystemMaintenanceBody {
  action: "restart" | "stop" | "start" | "cleanup" | "optimize";
  service_name?: string;
  confirm: boolean;
}

export interface SystemMaintenanceResponse extends Response<{ success: boolean; message: string }> {
  code: number;
  msg: string;
  data: { success: boolean; message: string };
}
