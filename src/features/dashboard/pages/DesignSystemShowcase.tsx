import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Badge,
  Avatar,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Modal,
  Drawer,
  Dropdown,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Breadcrumb,
  Alert,
  toast,
  EmptyState,
  Skeleton,
  Spinner,
  ConfirmDialog,
  DatePicker,
  SearchInput,
  FilterPanel,
} from "@/components/ui";
import {
  Sparkles,
  Send,
  Trash2,
  Mail,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Plus,
} from "lucide-react";

export function DesignSystemShowcase() {
  // Modal & Drawer & Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Form states
  const [searchVal, setSearchVal] = useState("Campaign Alpha");
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState("standard");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeFilterCount, setActiveFilterCount] = useState(2);

  const triggerConfirmAction = () => {
    setIsConfirmLoading(true);
    setTimeout(() => {
      setIsConfirmLoading(false);
      setIsConfirmOpen(false);
      toast.success("Item Deleted Successfully", {
        description: "The campaign was permanently removed.",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                OmniFlow UI Design System
                <Badge variant="primary" size="sm">27 Primitives</Badge>
              </h1>
              <p className="text-xs text-slate-500">Live Component Gallery & Visual Testing Environment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Design Tokens Active", { description: "Verified Slate, Indigo & Emerald tokens." })}
            >
              Test Toast
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Open Test Modal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        {/* Breadcrumb Preview */}
        <div>
          <Breadcrumb
            items={[
              { label: "SaaS Foundation", href: "/" },
              { label: "Design System", href: "/design-system" },
              { label: "Component Catalog" },
            ]}
          />
        </div>

        {/* 1. Buttons & Triggers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Buttons & Actions</h2>
              <p className="text-xs text-slate-500">Primary, secondary, outline, ghost, destructive, and sizes</p>
            </div>
            <Badge variant="outline">Button.tsx</Badge>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive" leftIcon={<Trash2 className="h-3.5 w-3.5" />}>
                Destructive
              </Button>
              <Button variant="link">Inline Link</Button>
              <Button variant="primary" isLoading>
                Loading...
              </Button>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap">
              <span className="text-xs text-slate-400 font-mono mr-2">Sizes:</span>
              <Button size="xs" variant="outline">XS Button</Button>
              <Button size="sm" variant="primary">SM Button</Button>
              <Button size="md" variant="primary">MD Button</Button>
              <Button size="lg" variant="primary" rightIcon={<Send className="h-4 w-4" />}>
                LG Button
              </Button>
            </div>
          </div>
        </section>

        {/* 2. Form Inputs & Controls */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Form Controls & Inputs</h2>
              <p className="text-xs text-slate-500">Inputs, textareas, selects, search, checkboxes, radios, switches, datepickers</p>
            </div>
            <Badge variant="outline">Form Controls</Badge>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input standard & with icons */}
            <div className="space-y-4">
              <Input
                label="Campaign Name"
                placeholder="e.g. Q4 Black Friday Blast"
                helperText="Internal identifier for marketing team"
                required
              />
              <Input
                label="Sender Email Address"
                placeholder="marketing@company.com"
                leftIcon={<Mail className="h-4 w-4" />}
                defaultValue="hello@omniflow.io"
              />
              <Input
                label="Input With Error"
                error="Please enter a valid format"
                defaultValue="invalid-format@@"
              />
            </div>

            {/* Select & DatePicker & Search */}
            <div className="space-y-4">
              <Select
                label="Delivery Channel"
                options={[
                  { label: "Email (Resend / SendGrid)", value: "email" },
                  { label: "WhatsApp (Cloud API)", value: "whatsapp" },
                  { label: "SMS (Twilio Broadcast)", value: "sms" },
                ]}
              />
              <DatePicker
                label="Scheduled Launch Date"
                defaultValue="2026-10-01"
                helperText="Target campaign activation schedule"
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Search Input</label>
                <SearchInput
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onClear={() => setSearchVal("")}
                  placeholder="Search contacts, segments..."
                />
              </div>
            </div>

            {/* Textarea, Switches, Checkboxes, Radios */}
            <div className="space-y-4">
              <Textarea
                label="Message Content"
                placeholder="Type personalized message..."
                showCount
                maxLength={160}
                defaultValue="Hello {{firstName}}, special VIP offers unlocked!"
              />
              <div className="pt-2 space-y-3">
                <Switch
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                  label="Track Email Link Clicks"
                  description="Inject UTM tracking automatically"
                />
                <Checkbox
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  label="GDPR / CAN-SPAM Opt-In Confirmed"
                  description="Contacts gave explicit marketing consent"
                />
                <div className="flex gap-4 pt-1">
                  <Radio
                    name="delivery-mode"
                    checked={radioSelected === "standard"}
                    onChange={() => setRadioSelected("standard")}
                    label="Instant Blast"
                  />
                  <Radio
                    name="delivery-mode"
                    checked={radioSelected === "batched"}
                    onChange={() => setRadioSelected("batched")}
                    label="Batched Staggered"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Badges, Avatars, Cards & Display */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Data Display & Status</h2>
              <p className="text-xs text-slate-500">Badges, avatars, tooltips, cards, and spinners</p>
            </div>
            <Badge variant="outline">Display & Feedback</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges & Avatars */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & Avatars</CardTitle>
                <CardDescription>Status indicators, avatar initials, and presence dots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Semantic Badges:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">Draft</Badge>
                    <Badge variant="primary" dot>Scheduled</Badge>
                    <Badge variant="success" dot>Delivered</Badge>
                    <Badge variant="warning" dot>Processing</Badge>
                    <Badge variant="destructive" dot>Failed</Badge>
                    <Badge variant="info">WhatsApp</Badge>
                    <Badge variant="outline">Audience Tag</Badge>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Avatars & Status Indicators:</span>
                  <div className="flex items-center gap-4">
                    <Tooltip content="Sarah Connor (Online)">
                      <Avatar name="Sarah Connor" size="xl" status="online" />
                    </Tooltip>
                    <Tooltip content="Alex Murphy (Away)">
                      <Avatar name="Alex Murphy" size="lg" status="away" />
                    </Tooltip>
                    <Avatar name="Elena Fisher" size="md" status="busy" />
                    <Avatar name="John Doe" size="sm" status="offline" />
                    <Avatar size="xs" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skeletons & Spinners */}
            <Card>
              <CardHeader>
                <CardTitle>Loading States & Skeletons</CardTitle>
                <CardDescription>Shimmer placeholders and customizable spinners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="h-10 w-10" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="text" className="w-3/4" />
                    <Skeleton variant="text" className="w-1/2" />
                  </div>
                </div>
                <Skeleton variant="rounded" className="h-16 w-full" />
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Spinners:</span>
                  <Spinner size="sm" variant="primary" />
                  <Spinner size="md" variant="primary" />
                  <Spinner size="lg" variant="muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. Alerts & Empty States */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Alerts & Empty States</h2>
              <p className="text-xs text-slate-500">Notice banners and standard empty view fallback</p>
            </div>
            <Badge variant="outline">Alerts & Empty</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Alert
                variant="info"
                title="WhatsApp Cloud API Connected"
                description="Your webhook endpoint has verified with Meta servers."
                dismissible
              />
              <Alert
                variant="success"
                title="Campaign Sent Successfully"
                description="14,250 recipients received the email broadcast."
              />
              <Alert
                variant="warning"
                title="Subscription Limit Warning"
                description="You have used 85% of your monthly WhatsApp message quota."
              />
              <Alert
                variant="destructive"
                title="Bounce Rate Spike Detected"
                description="Delivery paused automatically due to 7.8% bounce rate."
              />
            </div>

            <div>
              <EmptyState
                title="No Contacts Found"
                description="Your audience list currently has no matching leads. Import a CSV or create your first contact."
                primaryAction={
                  <Button size="xs" leftIcon={<Plus className="h-3 w-3" />}>
                    Add Contact
                  </Button>
                }
                secondaryAction={
                  <Button variant="outline" size="xs">
                    Import CSV
                  </Button>
                }
              />
            </div>
          </div>
        </section>

        {/* 5. Navigation, Tabs & Tables */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">5. Navigation, Tabs, Tables & Filters</h2>
              <p className="text-xs text-slate-500">Compound tab views, table layouts, filters and pagination</p>
            </div>
            <Badge variant="outline">Navigation & Tables</Badge>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Filter Panel & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-72">
                  <SearchInput placeholder="Filter table records..." />
                </div>
                <div className="flex items-center gap-2 self-end">
                  <FilterPanel
                    activeCount={activeFilterCount}
                    onReset={() => setActiveFilterCount(0)}
                    onApply={() => toast.success("Filters applied")}
                  >
                    <Select
                      label="Channel Status"
                      options={[
                        { label: "All Channels", value: "all" },
                        { label: "Email Campaigns", value: "email" },
                        { label: "WhatsApp Broadcasts", value: "whatsapp" },
                      ]}
                    />
                    <Select
                      label="Status"
                      options={[
                        { label: "All Statuses", value: "all" },
                        { label: "Sent", value: "sent" },
                        { label: "Scheduled", value: "scheduled" },
                      ]}
                    />
                  </FilterPanel>

                  <Dropdown
                    trigger={
                      <Button variant="outline" size="sm" rightIcon={<ChevronDown className="h-3.5 w-3.5" />}>
                        Actions
                      </Button>
                    }
                    items={[
                      { id: "export", label: "Export CSV", icon: <ExternalLink className="h-3.5 w-3.5" /> },
                      { id: "bulk-tag", label: "Apply Tag to All", icon: <UserCheck className="h-3.5 w-3.5" /> },
                      "divider",
                      { id: "delete-all", label: "Delete Selected", destructive: true, icon: <Trash2 className="h-3.5 w-3.5" /> },
                    ]}
                  />
                </div>
              </div>

              {/* Tabs with Table Content */}
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all" badge={<Badge size="sm">4</Badge>}>
                    All Campaigns
                  </TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Recipients</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          Winter Warm-up VIP Promotion
                        </TableCell>
                        <TableCell>
                          <Badge variant="primary">Email</Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">Active Buyers (&gt;90d)</TableCell>
                        <TableCell>
                          <Badge variant="success" dot>Delivered</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">12,450</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="xs">Edit</Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          Abandoned Cart Reminder #1
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">WhatsApp</Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">Cart Abandoners</TableCell>
                        <TableCell>
                          <Badge variant="warning" dot>Processing</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">850</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="xs">View</Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          OTP & Verification Broadcast
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">SMS</Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">Realtime Triggers</TableCell>
                        <TableCell>
                          <Badge variant="success" dot>Active</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">45,120</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="xs">Logs</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={5}
                    totalItems={48}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </TabsContent>

                <TabsContent value="email">
                  <div className="p-8 text-center text-xs text-slate-500">
                    Filtered view for Email campaigns only.
                  </div>
                </TabsContent>
                <TabsContent value="whatsapp">
                  <div className="p-8 text-center text-xs text-slate-500">
                    Filtered view for WhatsApp campaigns only.
                  </div>
                </TabsContent>
                <TabsContent value="sms">
                  <div className="p-8 text-center text-xs text-slate-500">
                    Filtered view for SMS campaigns only.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* 6. Overlays & Interactive Dialogs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">6. Overlays, Modals, Drawers & Dialogs</h2>
              <p className="text-xs text-slate-500">Accessible popups, slide-over panels, and destructive confirm dialogs</p>
            </div>
            <Badge variant="outline">Overlays</Badge>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Launch Standard Modal
            </Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
              Open Slide-Over Drawer
            </Button>
            <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
              Test Destructive Confirm Dialog
            </Button>
          </div>
        </section>
      </main>

      {/* Modal Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Marketing Campaign"
        description="Configure target audience and delivery channel settings"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast.success("Campaign Draft Created");
              }}
            >
              Continue to Audience
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input label="Campaign Name" placeholder="e.g. Q1 Product Announcements" />
          <Select
            label="Target Audience Segment"
            options={[
              { label: "High Value VIP Customers", value: "vip" },
              { label: "Inactive Leads (>60 days)", value: "inactive" },
              { label: "Newsletter Subscribers", value: "newsletter" },
            ]}
          />
          <Switch
            checked={true}
            onCheckedChange={() => {}}
            label="Enable Smart Delivery Time Optimization"
            description="Send when recipient is historically most active"
          />
        </div>
      </Modal>

      {/* Drawer Instance */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Contact Quick Details"
        description="Live slide-over drawer inspector"
        footer={
          <Button size="sm" variant="outline" onClick={() => setIsDrawerOpen(false)}>
            Close Panel
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Avatar name="Sarah Connor" size="lg" status="online" />
            <div>
              <h4 className="font-bold text-sm text-slate-900">Sarah Connor</h4>
              <p className="text-xs text-slate-500">sarah@skynet-defense.com</p>
              <Badge variant="success" size="sm" className="mt-1">Active Contact</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase">Recent Activity</h5>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-700">Opened Email: Black Friday Launch</span>
                <span className="text-slate-400 text-[11px]">2 hours ago</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-700">Replied to WhatsApp Confirmation</span>
                <span className="text-slate-400 text-[11px]">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Confirm Dialog Instance */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={triggerConfirmAction}
        title="Delete Campaign Broadcast?"
        description="Are you sure you want to permanently delete this campaign? All scheduled messages and live tracking links will be immediately cancelled. This action cannot be undone."
        confirmText="Delete Campaign"
        variant="destructive"
        isLoading={isConfirmLoading}
      />
    </div>
  );
}
