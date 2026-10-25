export type CheckStatus = "pending" | "success" | "warning" | "failed";

export interface PreFlightCheck {
  id: string;
  name: string;
  category: "Environment" | "Network" | "Security" | "Storage";
  description: string;
  status: CheckStatus;
  message?: string;
}

export interface EnvVariableSpec {
  key: string;
  scope: "client" | "server";
  required: boolean;
  defaultValue?: string;
  description: string;
  currentValue?: string;
}
