import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import Header from "~/components/app-header";
import { AppSidebar } from "~/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
