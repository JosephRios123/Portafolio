import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminIndex = lazy(() => import("./pages/admin/AdminIndex"));
const ProjectsAdmin = lazy(() => import("./pages/admin/ProjectsAdmin"));
const ExperienceAdmin = lazy(() => import("./pages/admin/ExperienceAdmin"));
const MindsetAdmin = lazy(() => import("./pages/admin/MindsetAdmin"));
const FormationsAdmin = lazy(() => import("./pages/admin/FormationsAdmin"));

const queryClient = new QueryClient();

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="animate-spin text-accent" size={28} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLogin />
                </Suspense>
              }
            />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminLayout />
                  </Suspense>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <AdminIndex />
                    </Suspense>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <ProjectsAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="experience"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <ExperienceAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="mindset"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <MindsetAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="formations"
                  element={
                    <Suspense fallback={<AdminFallback />}>
                      <FormationsAdmin />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
