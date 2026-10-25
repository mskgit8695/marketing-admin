import { Outlet } from "react-router-dom";
import { useShell } from "@/app/providers/ShellContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Drawer } from "@/components/ui";

export function AppShell() {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useShell();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 text-slate-900 flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Off-Canvas Navigation Drawer */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        side="left"
        size="sm"
        title="Navigation Menu"
      >
        <div className="-mx-6 -my-6">
          <Sidebar className="w-full h-auto border-r-0" />
        </div>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
