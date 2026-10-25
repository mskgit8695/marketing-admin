import { useState } from "react";
import {
  Server,
  Webhook,
  Activity,
  Plus,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import type { Gateway, WebhookDeliveryLog } from "@/types/integrations";
import { Button } from "@/components/ui";
import {
  useGateways,
  useGatewayTelemetry,
  useTestGatewayPing,
  useConnectGateway,
  useDisconnectGateway,
  useWebhookEndpoints,
  useCreateWebhookEndpoint,
  useToggleWebhookStatus,
  useDeleteWebhookEndpoint,
  useWebhookLogs,
  useRetryWebhookDelivery,
} from "../hooks/useIntegrations";
import { GatewayTelemetryStrip } from "../components/GatewayTelemetryStrip";
import { GatewaysDirectory } from "../components/GatewaysDirectory";
import { ConnectGatewayModal } from "../components/ConnectGatewayModal";
import { WebhookEndpointsTable } from "../components/WebhookEndpointsTable";
import { CreateWebhookModal } from "../components/CreateWebhookModal";
import { WebhookDeliveryLogsCard } from "../components/WebhookDeliveryLogsCard";
import { PayloadInspectorModal } from "../components/PayloadInspectorModal";

type ActiveTab = "gateways" | "webhooks" | "logs";

export function IntegrationsView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gateways");
  const [selectedGatewayForConfig, setSelectedGatewayForConfig] = useState<Gateway | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);
  const [selectedLogForInspection, setSelectedLogForInspection] = useState<WebhookDeliveryLog | null>(null);
  const [filterWebhookId, setFilterWebhookId] = useState<string | null>(null);

  // Queries
  const { data: gateways = [], isLoading: isGatewaysLoading, refetch: refetchGateways } = useGateways();
  const { data: telemetry, isLoading: isTelemetryLoading, refetch: refetchTelemetry } = useGatewayTelemetry();
  const { data: webhooks = [], isLoading: isWebhooksLoading, refetch: refetchWebhooks } = useWebhookEndpoints();
  const { data: logs = [], isLoading: isLogsLoading, refetch: refetchLogs } = useWebhookLogs();

  // Mutations
  const testPingMutation = useTestGatewayPing();
  const connectMutation = useConnectGateway();
  const disconnectMutation = useDisconnectGateway();
  const createWebhookMutation = useCreateWebhookEndpoint();
  const toggleWebhookMutation = useToggleWebhookStatus();
  const deleteWebhookMutation = useDeleteWebhookEndpoint();
  const retryLogMutation = useRetryWebhookDelivery();

  const handleRefreshAll = () => {
    refetchGateways();
    refetchTelemetry();
    refetchWebhooks();
    refetchLogs();
  };

  const handleConfigureGateway = (gw: Gateway) => {
    setSelectedGatewayForConfig(gw);
    setIsConnectModalOpen(true);
  };

  const handleTestPing = async (id: string) => {
    return testPingMutation.mutateAsync(id);
  };

  const handleSaveCredentials = async (id: string, credentials: Record<string, string>) => {
    return connectMutation.mutateAsync({ id, credentials });
  };

  const handleDisconnectGateway = async (id: string) => {
    return disconnectMutation.mutateAsync(id);
  };

  const handleSelectWebhookLogs = (webhookId: string) => {
    setFilterWebhookId(webhookId);
    setActiveTab("logs");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Server className="w-6 h-6 text-indigo-600" />
            Integrations & Delivery Gateways
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise transport gateways (Email, WhatsApp, SMS, CRM) & secure outbound webhooks dispatcher.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            className="text-xs"
            title="Refresh All Gateway & Dispatch Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Refresh
          </Button>

          <a
            href="https://docs.omniflow.io/integrations"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            API Docs
          </a>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateWebhookOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Webhook
          </Button>
        </div>
      </div>

      {/* Telemetry Strip */}
      <GatewayTelemetryStrip telemetry={telemetry} isLoading={isTelemetryLoading} />

      {/* Main Tabbed Cockpit */}
      <div className="space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("gateways")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "gateways"
                ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Delivery Gateways</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "gateways"
                  ? "bg-indigo-200/60 text-indigo-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {gateways.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("webhooks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "webhooks"
                ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
          >
            <Webhook className="w-4 h-4" />
            <span>Outbound Webhooks</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "webhooks"
                  ? "bg-indigo-200/60 text-indigo-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {webhooks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "logs"
                ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-200/80"
                : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Delivery Logs & Inspector</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "logs"
                  ? "bg-indigo-200/60 text-indigo-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {logs.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Gateways Directory */}
        {activeTab === "gateways" && (
          <GatewaysDirectory
            gateways={gateways}
            isLoading={isGatewaysLoading}
            onConfigure={handleConfigureGateway}
            onTestPing={handleTestPing}
          />
        )}

        {/* Tab 2: Outbound Webhooks */}
        {activeTab === "webhooks" && (
          <WebhookEndpointsTable
            endpoints={webhooks}
            isLoading={isWebhooksLoading}
            onOpenCreate={() => setIsCreateWebhookOpen(true)}
            onToggleStatus={(id, active) => toggleWebhookMutation.mutate({ id, active })}
            onDelete={(id) => deleteWebhookMutation.mutate(id)}
            onSelectWebhookLogs={handleSelectWebhookLogs}
          />
        )}

        {/* Tab 3: Delivery Logs */}
        {activeTab === "logs" && (
          <WebhookDeliveryLogsCard
            logs={logs}
            isLoading={isLogsLoading}
            selectedWebhookId={filterWebhookId}
            onClearWebhookFilter={() => setFilterWebhookId(null)}
            onInspectLog={(log) => setSelectedLogForInspection(log)}
            onRetryLog={(logId) => retryLogMutation.mutateAsync(logId)}
          />
        )}
      </div>

      {/* Modals */}
      <ConnectGatewayModal
        gateway={selectedGatewayForConfig}
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          setSelectedGatewayForConfig(null);
        }}
        onSave={handleSaveCredentials}
        onDisconnect={handleDisconnectGateway}
        onTestPing={handleTestPing}
      />

      <CreateWebhookModal
        isOpen={isCreateWebhookOpen}
        onClose={() => setIsCreateWebhookOpen(false)}
        onSubmit={async (payload) => createWebhookMutation.mutateAsync(payload)}
      />

      <PayloadInspectorModal
        log={selectedLogForInspection}
        isOpen={!!selectedLogForInspection}
        onClose={() => setSelectedLogForInspection(null)}
        onRetry={async (logId) => retryLogMutation.mutateAsync(logId)}
      />
    </div>
  );
}
