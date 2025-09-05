import { type Response } from "../../factory";

// ---  实时检测接口 Get ---- \\

export interface GetDetection {
  status: string;
  current_config: null;
  recent_detections: RecentDetection[];
  active_threats: number;
  detection_rate: number;
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

export interface detectionResponse extends Response<GetDetection> {
  code: number
  msg: string
  data: GetDetection
}

// --- 实时检测 Post --- \\

export interface PostDetectionBody {
  "ip_address": string,
  "username": string,
  "login_time": string,
  "user_agent": string,
  "location": string
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


// --- 检测分析 Get --- \\

export interface GetDetectionAnalysisBody {
  time_range: "today" | "week" | "month"
  risk_level: "all" | "high" | "medium" | "low"
  anomaly_type: "all" | "brute_force" | "suspicious_location"
}

export interface GetDetectionAnalysisResponse extends Response<DetectionAnalysis> {
  code: number
  msg: string
  data: DetectionAnalysis
}

export interface DetectionAnalysis {
  time_range: string;
  total_detections: number;
  malicious_count: number;
  risk_distribution: RiskDistribution;
  hourly_stats: HourlyStat[];
  top_threat_ips: any[];
  geographic_distribution: GeographicDistribution[];
}

interface GeographicDistribution {
  country: string;
  count: number;
}

interface HourlyStat {
  hour: number;
  count: number;
}

interface RiskDistribution {
  low: number;
  minimal: number;
}
