import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import VolunteerTest from "./pages/VolunteerTest";
import SupabaseTest from "./pages/SupabaseTest";
import VolunteerSubmissionTest from "./pages/VolunteerSubmissionTest";
import TestProjectsPage from "./pages/TestProjectsPage";
import SupabaseProjectDebug from "./pages/SupabaseProjectDebug";
import SupabaseDebug from './pages/SupabaseDebug';
import BlogTestPage from './pages/BlogTestPage';
import TestImagePage from './pages/TestImagePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import BlogManagementPage from "./pages/admin/BlogManagementPage";
import ProjectManagementPage from "./pages/admin/ProjectManagementPage";
import VolunteerListPage from "./pages/admin/VolunteerListPage";
import TeamManagementPage from "./pages/admin/TeamManagementPage";
import TestUploadPage from "./pages/admin/TestUploadPage";

// Contexts
import { AdminProvider } from "./contexts/AdminContext";
import { PublicProvider } from "./contexts/PublicContext";
import { TeamProvider } from "./contexts/TeamContext";
import { AuthProvider } from "./contexts/AuthContext";

// Animations
import { MouseTrail, CustomLoader } from "./components/animations";

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or actual resource loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <CustomLoader 
          animationPath="/animations/Animation - 1743225546141.json"
          animationType="json"
          width={400}
          height={400}
        />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TeamProvider>
              <AdminProvider>
                <PublicProvider>
                  <MouseTrail color="rgba(72, 187, 120, 0.4)" size={8} trailLength={12} />
                  
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<HomePage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="projects" element={<ProjectsPage />} />
                      <Route path="projects/:id" element={<ProjectDetailPage />} />
                      <Route path="get-involved" element={<GetInvolvedPage />} />
                      <Route path="blog" element={<BlogPage />} />
                      <Route path="blog/:id" element={<BlogPostPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="test" element={<TestPage />} />
                      <Route path="volunteer-test" element={<VolunteerTest />} />
                      <Route path="supabase-test" element={<SupabaseTest />} />
                      <Route path="volunteer-submission-test" element={<VolunteerSubmissionTest />} />
                      <Route path="test-projects" element={<TestProjectsPage />} />
                      <Route path="supabase-project-debug" element={<SupabaseProjectDebug />} />
                      <Route path="supabase-debug" element={<SupabaseDebug />} />
                      <Route path="blog-test" element={<BlogTestPage />} />
                      <Route path="test-images" element={<TestImagePage />} />
                      <Route path="login" element={<LoginPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                    
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                      <ProtectedRoute>
                        <Routes>
                          <Route path="/" element={<AdminDashboardPage />} />
                          <Route path="/blogs" element={<BlogManagementPage />} />
                          <Route path="/projects" element={<ProjectManagementPage />} />
                          <Route path="/volunteer-list" element={<VolunteerListPage />} />
                          <Route path="/team" element={<TeamManagementPage />} />
                          <Route path="/test-upload" element={<TestUploadPage />} />
                        </Routes>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </PublicProvider>
              </AdminProvider>
            </TeamProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
