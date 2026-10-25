import { lazy, Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";

export function ModuleLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] gap-3">
      <Spinner size="lg" variant="primary" />
      <span className="text-xs font-medium text-slate-400 animate-pulse">Loading module...</span>
    </div>
  );
}

// ==========================================
// Standalone & Foundation Pages
// ==========================================
const FoundationView = lazy(() =>
  import("@/app/router/RootPage").then((m) => ({ default: m.FoundationPage }))
);
export function FoundationPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <FoundationView />
    </Suspense>
  );
}

const DesignSystemView = lazy(() =>
  import("./DesignSystemShowcase").then((m) => ({ default: m.DesignSystemShowcase }))
);
export function DesignSystemShowcasePage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <DesignSystemView />
    </Suspense>
  );
}

// ==========================================
// Guest Auth Pages
// ==========================================
const LoginView = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
export function LoginPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <LoginView />
    </Suspense>
  );
}

const RegisterView = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
export function RegisterPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <RegisterView />
    </Suspense>
  );
}

const ForgotPasswordView = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage }))
);
export function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ForgotPasswordView />
    </Suspense>
  );
}

const ResetPasswordView = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage }))
);
export function ResetPasswordPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ResetPasswordView />
    </Suspense>
  );
}

// ==========================================
// Dashboard
// ==========================================
const DashboardView = lazy(() =>
  import("./DashboardView").then((m) => ({ default: m.DashboardView }))
);
export function DashboardPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <DashboardView />
    </Suspense>
  );
}

// ==========================================
// CRM Pages
// ==========================================
const ContactsListView = lazy(() =>
  import("@/features/contacts").then((m) => ({ default: m.ContactsListView }))
);
export function ContactsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ContactsListView />
    </Suspense>
  );
}

const LeadsPipelineView = lazy(() =>
  import("@/features/leads").then((m) => ({ default: m.LeadsPipelineView }))
);
export function LeadsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <LeadsPipelineView />
    </Suspense>
  );
}

const ActivityTimelineView = lazy(() =>
  import("@/features/activities").then((m) => ({ default: m.ActivityTimelineView }))
);
export function ActivitiesPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ActivityTimelineView />
    </Suspense>
  );
}

const TasksListView = lazy(() =>
  import("@/features/tasks").then((m) => ({ default: m.TasksListView }))
);
export function TasksPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <TasksListView />
    </Suspense>
  );
}

// ==========================================
// Audience Pages
// ==========================================
const ListsListView = lazy(() =>
  import("@/features/audience").then((m) => ({ default: m.ListsListView }))
);
export function ListsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ListsListView />
    </Suspense>
  );
}

const SegmentsListView = lazy(() =>
  import("@/features/audience").then((m) => ({ default: m.SegmentsListView }))
);
export function SegmentsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SegmentsListView />
    </Suspense>
  );
}

const TagsManagementView = lazy(() =>
  import("@/features/audience").then((m) => ({ default: m.TagsManagementView }))
);
export function TagsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <TagsManagementView />
    </Suspense>
  );
}

// ==========================================
// Marketing Pages
// ==========================================
const CampaignsListView = lazy(() =>
  import("@/features/campaigns").then((m) => ({ default: m.CampaignsListView }))
);
export function CampaignsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <CampaignsListView />
    </Suspense>
  );
}

const TemplatesListView = lazy(() =>
  import("@/features/templates").then((m) => ({ default: m.TemplatesListView }))
);
export function TemplatesPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <TemplatesListView />
    </Suspense>
  );
}

const EmailStudioView = lazy(() =>
  import("@/features/email-studio").then((m) => ({ default: m.EmailStudioView }))
);
export function EmailChannelPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <EmailStudioView />
    </Suspense>
  );
}

const WhatsAppStudioView = lazy(() =>
  import("@/features/whatsapp-studio").then((m) => ({ default: m.WhatsAppStudioView }))
);
export function WhatsAppChannelPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <WhatsAppStudioView />
    </Suspense>
  );
}

const SmsStudioView = lazy(() =>
  import("@/features/sms-studio").then((m) => ({ default: m.SmsStudioView }))
);
export function SMSChannelPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SmsStudioView />
    </Suspense>
  );
}

// ==========================================
// Automation & AI
// ==========================================
const AutomationWorkflowsView = lazy(() =>
  import("@/features/automation").then((m) => ({ default: m.AutomationWorkflowsView }))
);
export function AutomationWorkflowsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <AutomationWorkflowsView />
    </Suspense>
  );
}

const AiAssistantView = lazy(() =>
  import("@/features/ai-assistant").then((m) => ({ default: m.AiAssistantView }))
);
export function AIAssistantPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <AiAssistantView />
    </Suspense>
  );
}

// ==========================================
// Analytics, Integrations, Billing
// ==========================================
const AnalyticsView = lazy(() =>
  import("@/features/analytics").then((m) => ({ default: m.AnalyticsView }))
);
export function AnalyticsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <AnalyticsView />
    </Suspense>
  );
}

const IntegrationsView = lazy(() =>
  import("@/features/integrations").then((m) => ({ default: m.IntegrationsView }))
);
export function IntegrationsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <IntegrationsView />
    </Suspense>
  );
}

const BillingView = lazy(() =>
  import("@/features/billing").then((m) => ({ default: m.BillingView }))
);
export function BillingPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <BillingView />
    </Suspense>
  );
}

// ==========================================
// Settings Subpages
// ==========================================
const WorkspaceSettingsView = lazy(() =>
  import("@/features/settings").then((m) => ({ default: m.WorkspaceSettingsView }))
);
export function WorkspaceSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <WorkspaceSettingsView />
    </Suspense>
  );
}

const TeamSettingsView = lazy(() =>
  import("@/features/settings").then((m) => ({ default: m.TeamSettingsView }))
);
export function TeamSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <TeamSettingsView />
    </Suspense>
  );
}

const RolesSettingsView = lazy(() =>
  import("@/features/settings").then((m) => ({ default: m.RolesSettingsView }))
);
export function RolesSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <RolesSettingsView />
    </Suspense>
  );
}

const SenderSettingsView = lazy(() =>
  import("@/features/settings").then((m) => ({ default: m.SenderSettingsView }))
);
export function SendersSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SenderSettingsView />
    </Suspense>
  );
}

const DomainsSettingsView = lazy(() =>
  import("@/features/settings").then((m) => ({ default: m.DomainsSettingsView }))
);
export function DomainsSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <DomainsSettingsView />
    </Suspense>
  );
}

const NotificationsSettingsView = lazy(() =>
  import("@/features/settings").then((m) => ({ default: m.NotificationsSettingsView }))
);
export function NotificationsSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <NotificationsSettingsView />
    </Suspense>
  );
}

const SecuritySettingsView = lazy(() =>
  import("@/features/security").then((m) => ({ default: m.SecuritySettingsView }))
);
export function SecuritySettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SecuritySettingsView />
    </Suspense>
  );
}

const ApiKeysView = lazy(() =>
  import("@/features/security").then((m) => ({ default: m.ApiKeysView }))
);
export function ApiKeysSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ApiKeysView />
    </Suspense>
  );
}

const AuditLogsView = lazy(() =>
  import("@/features/security").then((m) => ({ default: m.AuditLogsView }))
);
export function AuditLogsSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <AuditLogsView />
    </Suspense>
  );
}

const ComplianceSettingsView = lazy(() =>
  import("@/features/security").then((m) => ({ default: m.ComplianceSettingsView }))
);
export function ComplianceSettingsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <ComplianceSettingsView />
    </Suspense>
  );
}

// ==========================================
// Super Admin Pages
// ==========================================
const SuperAdminOverviewView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminOverviewView }))
);
export function SuperAdminDashboardPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminOverviewView />
    </Suspense>
  );
}

const SuperAdminWorkspacesView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminWorkspacesView }))
);
export function SuperAdminWorkspacesPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminWorkspacesView />
    </Suspense>
  );
}

const SuperAdminUsersView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminUsersView }))
);
export function SuperAdminUsersPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminUsersView />
    </Suspense>
  );
}

const SuperAdminSubscriptionsView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminSubscriptionsView }))
);
export function SuperAdminSubscriptionsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminSubscriptionsView />
    </Suspense>
  );
}

const SuperAdminProvidersView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminProvidersView }))
);
export function SuperAdminProvidersPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminProvidersView />
    </Suspense>
  );
}

const SuperAdminUsageView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminUsageView }))
);
export function SuperAdminUsagePage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminUsageView />
    </Suspense>
  );
}

const SuperAdminFailedJobsView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminFailedJobsView }))
);
export function SuperAdminFailedJobsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminFailedJobsView />
    </Suspense>
  );
}

const SuperAdminAuditLogsView = lazy(() =>
  import("@/features/super-admin/pages").then((m) => ({ default: m.SuperAdminAuditLogsView }))
);
export function SuperAdminAuditLogsPage() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <SuperAdminAuditLogsView />
    </Suspense>
  );
}
