import { Link } from "wouter";
import { User, Stethoscope } from "lucide-react";

export default function PortalSelect() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-enter">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg shadow-primary/20">
            Q
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight mt-3">
            CareQ
          </h1>
          <p className="text-muted-foreground text-sm font-light mt-1">
            Select your portal to continue
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Patient Portal */}
          <Link
            href="/patient/login"
            className="group block rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/10 transition-colors">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display font-semibold text-xl tracking-tight mb-2">
              Patient Portal
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Access your health records, appointments, waitlist status, and care
              plan.
            </p>
            <span className="inline-block mt-5 text-sm font-medium text-primary group-hover:underline">
              Continue &rarr;
            </span>
          </Link>

          {/* Provider Portal */}
          <Link
            href="/provider/"
            className="group block rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/10 transition-colors">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display font-semibold text-xl tracking-tight mb-2">
              Provider Portal
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage patient appointments, charting, reviews, and clinical
              workflows.
            </p>
            <span className="inline-block mt-5 text-sm font-medium text-primary group-hover:underline">
              Continue &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
