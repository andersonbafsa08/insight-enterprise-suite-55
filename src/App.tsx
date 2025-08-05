
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthRoute } from "@/components/auth/AuthRoute";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Clients = lazy(() => import("./pages/Clients"));
const Requests = lazy(() => import("./pages/Requests"));
const Employees = lazy(() => import("./pages/Employees"));
const Stock = lazy(() => import("./pages/Stock"));
const Fleet = lazy(() => import("./pages/Fleet"));
const Allowances = lazy(() => import("./pages/Allowances"));
const Settings = lazy(() => import("./pages/Settings"));
const AI = lazy(() => import("./pages/AI"));
const Reports = lazy(() => import("./pages/Reports"));
const Scheduling = lazy(() => import("./pages/Scheduling"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for page transitions
const PageLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Route */}
            <Route 
              path="/auth" 
              element={
                <AuthRoute>
                  <Auth />
                </AuthRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full bg-background">
                      <AppSidebar />
                      
                      <div className="flex-1 flex flex-col">
                        <Header />
                        
                        <main className="flex-1 p-6">
                          <Suspense fallback={<PageLoadingSkeleton />}>
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
                          </Suspense>
                        </main>
                      </div>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
