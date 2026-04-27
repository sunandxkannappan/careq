import { Switch, Route, Router, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Landing page
import PortalSelect from "@/pages/PortalSelect";
import NotFound from "@/pages/not-found";

// Patient pages
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

// Provider pages
import ProviderDashboard from "@/provider/pages/ProviderDashboard";
import ProviderAppointments from "@/provider/pages/ProviderAppointments";
import ProviderAvailability from "@/provider/pages/ProviderAvailability";
import ProviderTasks from "@/provider/pages/ProviderTasks";
import ProviderCharting from "@/provider/pages/ProviderCharting";
import ProviderReviews from "@/provider/pages/ProviderReviews";
import ProviderPatients from "@/provider/pages/ProviderPatients";
import ProviderEarnings from "@/provider/pages/ProviderEarnings";
import ProviderAccount from "@/provider/pages/ProviderAccount";
import ProviderVirtualCall from "@/provider/pages/ProviderVirtualCall";
import FormsHub from "@/provider/pages/FormsHub";
import EConsultDashboard from "@/provider/pages/EConsultDashboard";
import { RoleProvider } from "@/provider/lib/RoleContext";

function VirtualCallRoute({ params }: { params: { mode: string; id: string } }) {
  return <ProviderVirtualCall apptId={params.id} mode={params.mode as "zoom" | "voip"} />;
}

function EConsultRoute({ params }: { params: { patientId: string } }) {
  return <EConsultDashboard patientId={params.patientId} />;
}

function PatientRoutes() {
  return (
    <Router base="/patient">
      <Switch>
        {/* Auth / onboarding */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/consent" component={Consent} />
        <Route path="/intake" component={Intake} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/onboarding/forms" component={OnboardingForms} />

        {/* Portal */}
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
    </Router>
  );
}

function ProviderRoutes() {
  return (
    <Router base="/provider">
      <RoleProvider>
        <Switch>
          <Route path="/" component={ProviderDashboard} />
          <Route path="/appointments" component={ProviderAppointments} />
          <Route path="/call/:mode/:id" component={VirtualCallRoute} />
          <Route path="/charting" component={ProviderCharting} />
          <Route path="/reviews" component={ProviderReviews} />
          <Route path="/schedule" component={ProviderAvailability} />
          <Route path="/patients" component={ProviderPatients} />
          <Route path="/tasks" component={ProviderTasks} />
          <Route path="/earnings" component={ProviderEarnings} />
          <Route path="/account" component={ProviderAccount} />
          <Route path="/forms" component={FormsHub} />
          <Route path="/econsult/:patientId" component={EConsultRoute} />
          <Route component={NotFound} />
        </Switch>
      </RoleProvider>
    </Router>
  );
}

function AppRouter() {
  const [location] = useLocation();

  if (location === "/") return <PortalSelect />;
  if (location.startsWith("/patient")) return <PatientRoutes />;
  if (location.startsWith("/provider")) return <ProviderRoutes />;
  return <NotFound />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
