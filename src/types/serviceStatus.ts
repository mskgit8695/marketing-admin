export type ServiceHealth = "operational" | "degraded" | "down" | "maintenance";
export type IncidentSeverity = "critical" | "major" | "minor" | "info";

export interface ServiceNode {
  id: string;
  name: string;
  description: string;
  category: "Core API" | "Database" | "Messaging Queue" | "Workers";
  health: ServiceHealth;
  uptimePercentage: number;
  latencyMs: number;
  lastHeartbeat: string;
  version: string;
}

export interface IncidentEvent {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: "Investigating" | "Identified" | "Monitoring" | "Resolved";
  affectedServices: string[];
  timestamp: string;
  description: string;
}

export interface SystemMetrics {
  overallHealth: ServiceHealth;
  averageLatencyMs: number;
  uptime90Days: number;
  activeIncidentsCount: number;
}
