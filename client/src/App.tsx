import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import OnboardingForms from "@/pages/OnboardingForms";
import ConsentForm from "@/pages/ConsentForm";
import PreAppointmentForm from "@/pages/PreAppointmentForm";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Consent from "@/pages/Consent";
import Intake from "@/pages/Intake";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

function Router() {
  return (
    <Switch>
      {/* Auth / onboarding (temporarily optional) */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/consent" component={Consent} />
      <Route path="/intake" component={Intake} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/onboarding/forms" component={OnboardingForms} />

      {/* Portal */}
      <Route path="/" component={Login} />
      <Route path="/referral" component={Dashboard} />
      <Route path="/status" component={Waitlist} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/forms/health-history" component={HealthHistoryForm} />
      <Route path="/forms/consent" component={ConsentForm} />
      <Route path="/forms/pre-appointment" component={PreAppointmentForm} />
      <Route path="/forms/pre-visit" component={PreAppointmentForm} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route path="/results" component={MyResults} />
      <Route path="/resources" component={Resources} />
      <Route path="/account" component={Profile} />

      <Route component={NotFound} />
    </Switch>
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
