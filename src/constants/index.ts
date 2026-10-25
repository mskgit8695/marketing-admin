/**
 * Application Constants
 */

export const APP_CONFIG = {
  name: "OmniFlow AI",
  fullName: "OmniFlow AI Marketing & CRM SaaS",
  version: "1.0.0",
  apiBaseUrl: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  useMock: import.meta.env.VITE_USE_MOCK === "true",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "omniflow_auth_token",
  REFRESH_TOKEN: "omniflow_refresh_token",
  AUTH_USER: "omniflow_auth_user",
  ACTIVE_WORKSPACE: "omniflow_active_workspace",
  THEME_MODE: "omniflow_theme_mode",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  // App
  DASHBOARD: "/dashboard",
  
  // CRM
  CRM_CONTACTS: "/crm/contacts",
  CRM_LEADS: "/crm/leads",
  CRM_ACTIVITIES: "/crm/activities",
  CRM_TASKS: "/crm/tasks",

  // Audience
  AUDIENCE_LISTS: "/audience/lists",
  AUDIENCE_SEGMENTS: "/audience/segments",
  AUDIENCE_TAGS: "/audience/tags",

  // Marketing
  MARKETING_CAMPAIGNS: "/marketing/campaigns",
  MARKETING_TEMPLATES: "/marketing/templates",
  MARKETING_EMAIL: "/marketing/email",
  MARKETING_WHATSAPP: "/marketing/whatsapp",
  MARKETING_SMS: "/marketing/sms",

  // Automation & AI
  AUTOMATION_WORKFLOWS: "/automation/workflows",
  AI_ASSISTANT: "/ai-assistant",

  // Operations
  ANALYTICS: "/analytics",
  INTEGRATIONS: "/integrations",
  BILLING: "/billing",

  // Settings
  SETTINGS_WORKSPACE: "/settings/workspace",
  SETTINGS_TEAM: "/settings/team",
  SETTINGS_ROLES: "/settings/roles",
  SETTINGS_SENDERS: "/settings/senders",
  SETTINGS_DOMAINS: "/settings/domains",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_API_KEYS: "/settings/api-keys",
  SETTINGS_AUDIT_LOGS: "/settings/audit-logs",
  SETTINGS_COMPLIANCE: "/settings/compliance",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",

  // Super Admin
  SUPER_ADMIN_DASHBOARD: "/admin/dashboard",
  SUPER_ADMIN_WORKSPACES: "/admin/workspaces",
  SUPER_ADMIN_USERS: "/admin/users",
  SUPER_ADMIN_SUBSCRIPTIONS: "/admin/subscriptions",
  SUPER_ADMIN_PROVIDERS: "/admin/providers",
  SUPER_ADMIN_USAGE: "/admin/usage",
  SUPER_ADMIN_FAILED_JOBS: "/admin/failed-jobs",
  SUPER_ADMIN_AUDIT_LOGS: "/admin/audit-logs",
} as const;
