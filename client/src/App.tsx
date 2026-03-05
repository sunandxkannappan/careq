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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/referral" component={Dashboard} />
      <Route path="/waitlist" component={Waitlist} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/forms/health-history" component={HealthHistoryForm} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route path="/my-results" component={MyResults} />
      <Route path="/resources" component={Resources} />
      <Route path="/profile" component={Profile} />
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
