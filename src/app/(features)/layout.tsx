import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import Header from "~/components/app-header";
import { AppSidebar } from "~/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="rounded-lg bg-sidebar h-screen my-2 border border-[hsl(var(--sidebar-border))] mr-2 overflow-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
