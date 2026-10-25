import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell, SuperAdminShell } from "@/components/layout";
import {
  FoundationPage,
  DesignSystemShowcasePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  DashboardPage,
  ContactsPage,
  LeadsPage,
  ActivitiesPage,
  TasksPage,
  ListsPage,
  SegmentsPage,
  TagsPage,
  CampaignsPage,
  TemplatesPage,
  EmailChannelPage,
  WhatsAppChannelPage,
  SMSChannelPage,
  AutomationWorkflowsPage,
  AIAssistantPage,
  AnalyticsPage,
  IntegrationsPage,
  BillingPage,
  WorkspaceSettingsPage,
  TeamSettingsPage,
  RolesSettingsPage,
  SendersSettingsPage,
  DomainsSettingsPage,
  SecuritySettingsPage,
  ApiKeysSettingsPage,
  AuditLogsSettingsPage,
  ComplianceSettingsPage,
  NotificationsSettingsPage,
  SuperAdminDashboardPage,
  SuperAdminWorkspacesPage,
  SuperAdminUsersPage,
  SuperAdminSubscriptionsPage,
  SuperAdminProvidersPage,
  SuperAdminUsagePage,
  SuperAdminFailedJobsPage,
  SuperAdminAuditLogsPage,
} from "@/features/dashboard/pages/ModuleRoutes";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { ROUTES } from "@/constants";

export const router = createBrowserRouter([
  // Standalone Verification & Foundation Routes
  {
    path: ROUTES.HOME,
    element: <FoundationPage />,
  },
  {
    path: "/design-system",
    element: <DesignSystemShowcasePage />,
  },

  // Public / Guest Auth Routes
  {
    path: ROUTES.LOGIN,
    element: (
      <AuthGuard requireGuest>
        <LoginPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <AuthGuard requireGuest>
        <RegisterPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <AuthGuard requireGuest>
        <ForgotPasswordPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <AuthGuard requireGuest>
        <ResetPasswordPage />
      </AuthGuard>
    ),
  },

  // Main Tenant SaaS Experience wrapped in AppShell & AuthGuard
  {
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },

      // CRM
      { path: ROUTES.CRM_CONTACTS, element: <ContactsPage /> },
      { path: ROUTES.CRM_LEADS, element: <LeadsPage /> },
      { path: ROUTES.CRM_ACTIVITIES, element: <ActivitiesPage /> },
      { path: ROUTES.CRM_TASKS, element: <TasksPage /> },

      // Audience
      { path: ROUTES.AUDIENCE_LISTS, element: <ListsPage /> },
      { path: ROUTES.AUDIENCE_SEGMENTS, element: <SegmentsPage /> },
      { path: ROUTES.AUDIENCE_TAGS, element: <TagsPage /> },

      // Marketing
      { path: ROUTES.MARKETING_CAMPAIGNS, element: <CampaignsPage /> },
      { path: ROUTES.MARKETING_TEMPLATES, element: <TemplatesPage /> },
      { path: ROUTES.MARKETING_EMAIL, element: <EmailChannelPage /> },
      { path: ROUTES.MARKETING_WHATSAPP, element: <WhatsAppChannelPage /> },
      { path: ROUTES.MARKETING_SMS, element: <SMSChannelPage /> },

      // Automation & AI
      { path: ROUTES.AUTOMATION_WORKFLOWS, element: <AutomationWorkflowsPage /> },
      { path: ROUTES.AI_ASSISTANT, element: <AIAssistantPage /> },

      // Analytics, Integrations, Billing
      { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
      { path: ROUTES.INTEGRATIONS, element: <IntegrationsPage /> },
      { path: ROUTES.BILLING, element: <BillingPage /> },

      // Settings
      { path: ROUTES.SETTINGS_WORKSPACE, element: <WorkspaceSettingsPage /> },
      { path: ROUTES.SETTINGS_TEAM, element: <TeamSettingsPage /> },
      { path: ROUTES.SETTINGS_ROLES, element: <RolesSettingsPage /> },
      { path: ROUTES.SETTINGS_SENDERS, element: <SendersSettingsPage /> },
      { path: ROUTES.SETTINGS_DOMAINS, element: <DomainsSettingsPage /> },
      { path: ROUTES.SETTINGS_SECURITY, element: <SecuritySettingsPage /> },
      { path: ROUTES.SETTINGS_API_KEYS, element: <ApiKeysSettingsPage /> },
      { path: ROUTES.SETTINGS_AUDIT_LOGS, element: <AuditLogsSettingsPage /> },
      { path: ROUTES.SETTINGS_COMPLIANCE, element: <ComplianceSettingsPage /> },
      { path: ROUTES.SETTINGS_NOTIFICATIONS, element: <NotificationsSettingsPage /> },
    ],
  },

  // Super Admin Experience wrapped in SuperAdminShell & AuthGuard
  {
    element: (
      <AuthGuard requireSuperAdmin>
        <SuperAdminShell />
      </AuthGuard>
    ),
    children: [
      { path: ROUTES.SUPER_ADMIN_DASHBOARD, element: <SuperAdminDashboardPage /> },
      { path: ROUTES.SUPER_ADMIN_WORKSPACES, element: <SuperAdminWorkspacesPage /> },
      { path: ROUTES.SUPER_ADMIN_USERS, element: <SuperAdminUsersPage /> },
      { path: ROUTES.SUPER_ADMIN_SUBSCRIPTIONS, element: <SuperAdminSubscriptionsPage /> },
      { path: ROUTES.SUPER_ADMIN_PROVIDERS, element: <SuperAdminProvidersPage /> },
      { path: ROUTES.SUPER_ADMIN_USAGE, element: <SuperAdminUsagePage /> },
      { path: ROUTES.SUPER_ADMIN_FAILED_JOBS, element: <SuperAdminFailedJobsPage /> },
      { path: ROUTES.SUPER_ADMIN_AUDIT_LOGS, element: <SuperAdminAuditLogsPage /> },
    ],
  },

  // Fallback Catch-All
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
