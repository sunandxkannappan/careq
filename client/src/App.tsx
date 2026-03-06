import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/Dashboard";
import Waitlist from "@/pages/Waitlist";
import Appointments from "@/pages/Appointments";
import Tasks from "@/pages/Tasks";
import MyResults from "@/pages/MyResults";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import HealthHistoryForm from "@/pages/HealthHistoryForm";
import BookAppointment from "@/pages/BookAppointment";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Consent from "@/pages/Consent";
import Intake from "@/pages/Intake";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/consent", "/intake", "/privacy-policy"];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();

  useEffect(() => {
    const isAuth = localStorage.getItem("careq_auth") === "true";
    const onboarding = localStorage.getItem("careq_onboarding");
    const isPublic = PUBLIC_ROUTES.some((r) => location.startsWith(r));

    if (!isAuth && !isPublic) {
      // Not logged in and trying to access a protected route
      navigate("/login");
      return;
    }

    if (isAuth && !isPublic) {
      // Logged in but onboarding not complete — redirect to the right step
      if (!onboarding || onboarding === "consent") {
        navigate("/consent");
        return;
      }
      if (onboarding === "intake") {
        navigate("/intake");
        return;
      }
    }

    if (isAuth && location === "/login") {
      // Already logged in — skip to portal or onboarding
      if (!onboarding || onboarding === "consent") {
        navigate("/consent");
      } else if (onboarding === "intake") {
        navigate("/intake");
      } else {
        navigate("/referral");
      }
    }
  }, [location, navigate]);

  return <>{children}</>;
}

function Router() {
  return (
    <AuthGuard>
      <Switch>
        {/* Auth / onboarding */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/consent" component={Consent} />
        <Route path="/intake" component={Intake} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />

        {/* Portal (protected) */}
        <Route path="/" component={Dashboard} />
        <Route path="/referral" component={Dashboard} />
        <Route path="/status" component={Waitlist} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/forms/health-history" component={HealthHistoryForm} />
        <Route path="/book-appointment" component={BookAppointment} />
        <Route path="/my-results" component={MyResults} />
        <Route path="/resources" component={Resources} />
        <Route path="/profile" component={Profile} />

        <Route component={NotFound} />
      </Switch>
    </AuthGuard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
