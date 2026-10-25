export const appConfig = {
  appName: "OmniFlow AI",
  fullName: "OmniFlow AI Marketing & CRM SaaS",
  appDescription: "AI-Powered Digital Marketing & CRM Multi-Tenant SaaS",
  version: "1.0.0",
  defaultPageSize: 10,
  queryDefaults: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  },
  channels: {
    email: { label: "Email Marketing", color: "#4f46e5" },
    whatsapp: { label: "WhatsApp Campaigns", color: "#16a34a" },
    sms: { label: "SMS Broadcasts", color: "#0284c7" },
  },
};
