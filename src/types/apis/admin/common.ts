import { type Response } from "../../factory";

// ---  仪表盘接口 Get ---- \\

export interface GetDashboard {
  today_detections: number;
  today_malicious: number;
  today_threat_ips: number;
  system_status: string;
  uptime_days: number;
  detection_trend: number;
  malicious_trend: number;
  threat_trend: number;
}

export interface dashboardResponse extends Response<GetDashboard> {
  code: number
  msg: string
  data: GetDashboard
}

// ---  检测历史记录接口 Get ---- \\

export interface GetDetectionHistoryBody {
  page: number;
  page_size: number;
  ip_address?: string;
  username?: string;
  risk_level?: "high" | "medium" | "low";
  status?: "pending" | "investigating" | "resolved" | "false_positive";
  start_time?: string | Date;
  end_time?: string | Date;
}

export interface GetDetectionHistoryResponse extends Response<DetectionHistory[]> {
  code: number
  msg: string
  data: DetectionHistory[]
}

export interface DetectionHistory {
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
  created_at: Date;
}
