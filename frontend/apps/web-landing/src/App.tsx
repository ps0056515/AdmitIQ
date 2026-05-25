import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import {
  Navbar,
  Hero,
  FunnelLeakage,
  OrchestrationWorkflow,
  LiveAIDemo,
  DashboardShowcase,
  BentoFeatureGrid,
  MultilingualShowcase,
  Footer,
} from './components/landing';
import { AuthLayout } from './pages/auth/AuthLayout';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ProtectedRoute } from './pages/app/ProtectedRoute';
import { Dashboard } from './pages/app/Dashboard';

/* ─── Landing Page ─── */
function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — The hook */}
        <Hero />

        {/* 2. Problem/Solution — Why this matters */}
        <FunnelLeakage />

        {/* 3. How It Works — The orchestration story */}
        <OrchestrationWorkflow />

        {/* 4. Live Demo — See it in action */}
        <LiveAIDemo />

        {/* 5. Dashboard — Operational intelligence */}
        <DashboardShowcase />

        {/* 6. Bento Grid — Platform depth */}
        <BentoFeatureGrid />

        {/* 7. Multilingual — Key differentiator */}
        <MultilingualShowcase />
      </main>

      {/* 8. Premium Footer — Trust + Navigation + Infrastructure */}
      <Footer />
    </>
  );
}

/* ─── App Root ─── */
export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth Routes wrapped in AuthLayout */}
            <Route 
              path="/login" 
              element={
                <AuthLayout>
                  <SignIn />
                </AuthLayout>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              } 
            />

            {/* Protected App Routes */}
            <Route path="/app" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              {/* Placeholders for other routes */}
              <Route path="*" element={<div className="p-8 text-muted-foreground flex items-center justify-center h-full">This page is under construction.</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

