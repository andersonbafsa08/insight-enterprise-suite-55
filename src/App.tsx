
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import Requests from "./pages/Requests";
import Employees from "./pages/Employees";
import Stock from "./pages/Stock";
import Fleet from "./pages/Fleet";
import Allowances from "./pages/Allowances";
import Settings from "./pages/Settings";
import AI from "./pages/AI";
import Reports from "./pages/Reports";
import Scheduling from "./pages/Scheduling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar />
              
              <div className="flex-1 flex flex-col">
                <Header 
                  companyName="ERP Corporativo"
                  userName="Usuário"
                  userRole="Administrador"
                />
                
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/stock" element={<Stock />} />
                    <Route path="/inventory" element={<Stock />} />
                    <Route path="/fleet" element={<Fleet />} />
                    <Route path="/allowances" element={<Allowances />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/ai" element={<AI />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/scheduling" element={<Scheduling />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
