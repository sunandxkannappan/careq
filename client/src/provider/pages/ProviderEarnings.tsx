import { useState } from "react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { MOCK_BILLING, MOCK_EARNINGS, type BillingActivity } from "@/provider/lib/mockData";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  FileText,
  Download,
  Filter,
} from "lucide-react";

// ─── Status styles ──────────────────────────────────────────

const BILLING_STATUS_STYLES: Record<BillingActivity["status"], { bg: string; text: string; dot: string }> = {
  Submitted:     { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"    },
  Pending:       { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  Paid:          { bg: "bg-green-50",   text: "text-green-700",   dot: "bg-green-500"   },
  Rejected:      { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
  "Requires info": { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
};

type ViewTab = "activity" | "earnings" | "remittance";

export default function ProviderEarnings() {
  const [tab, setTab] = useState<ViewTab>("activity");
  const [statusFilter, setStatusFilter] = useState<BillingActivity["status"] | "all">("all");

  const filteredBilling = MOCK_BILLING.filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter
  );

  // Computed stats
  const totalPaid = MOCK_BILLING.filter((b) => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);
  const totalPending = MOCK_BILLING.filter((b) => b.status === "Pending" || b.status === "Submitted").reduce((sum, b) => sum + b.amount, 0);
  const totalRequiresAction = MOCK_BILLING.filter((b) => b.status === "Requires info" || b.status === "Rejected").length;
  const thisMonth = MOCK_EARNINGS.reduce((sum, e) => sum + e.total, 0);

  return (
    <ProviderLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Earnings
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          Billing activities, earnings history, and remittance tracking.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          label="This Month"
          value={`$${thisMonth.toFixed(2)}`}
          sublabel="Total billed"
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="Paid"
          value={`$${totalPaid.toFixed(2)}`}
          sublabel="Confirmed earnings"
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={`$${totalPending.toFixed(2)}`}
          sublabel="Awaiting payment"
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          icon={AlertCircle}
          label="Action Needed"
          value={`${totalRequiresAction}`}
          sublabel="Items require info"
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit mb-6">
        {([
          { key: "activity" as const, label: "Billing Activity" },
          { key: "earnings" as const, label: "Earnings History" },
          { key: "remittance" as const, label: "Remittance" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
              tab === t.key
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Billing activity tab */}
      {tab === "activity" && (
        <>
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg w-fit mb-6 flex-wrap">
            {(["all", "Pending", "Submitted", "Paid", "Rejected", "Requires info"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150",
                  statusFilter === s
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          {/* Billing table */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Service</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBilling.map((item) => {
                    const statusStyle = BILLING_STATUS_STYLES[item.status];
                    return (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{item.patientName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.serviceType}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono bg-muted/50 px-1.5 py-0.5 rounded">{item.billingCode}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">${item.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                            statusStyle.bg, statusStyle.text
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {item.timeTaken && <span>{item.timeTaken}min</span>}
                            {item.complexity && <span className="capitalize">{item.complexity}</span>}
                            {item.familyPresent && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">Family</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredBilling.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm font-medium text-foreground">No billing activities</p>
                <p className="text-xs text-muted-foreground mt-1">No records match the current filter.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Earnings history tab */}
      {tab === "earnings" && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Period</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total Billed</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Submitted</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Paid</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EARNINGS.map((e, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{e.period}</td>
                      <td className="px-4 py-3 text-right font-semibold">${e.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-blue-600">${e.submitted.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-green-600">${e.paid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-amber-600">${e.pending.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-foreground">Total</td>
                    <td className="px-4 py-3 text-right font-bold">
                      ${MOCK_EARNINGS.reduce((s, e) => s + e.total, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      ${MOCK_EARNINGS.reduce((s, e) => s + e.submitted, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      ${MOCK_EARNINGS.reduce((s, e) => s + e.paid, 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600">
                      ${MOCK_EARNINGS.reduce((s, e) => s + e.pending, 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Visual earnings bars */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Earnings</h3>
            <div className="space-y-3">
              {MOCK_EARNINGS.map((e, i) => {
                const maxTotal = Math.max(...MOCK_EARNINGS.map((x) => x.total));
                const pct = (e.total / maxTotal) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{e.period}</span>
                    <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-20 text-right">${e.total.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Remittance tab */}
      {tab === "remittance" && (
        <div className="space-y-6">
          {/* Outstanding items */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Outstanding Billing Information Required</h3>
            {MOCK_BILLING.filter((b) => b.status === "Requires info" || b.status === "Rejected").length > 0 ? (
              <div className="space-y-3">
                {MOCK_BILLING.filter((b) => b.status === "Requires info" || b.status === "Rejected").map((item) => (
                  <div key={item.id} className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-4">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      item.status === "Rejected" ? "bg-red-50" : "bg-amber-50"
                    )}>
                      <AlertCircle className={cn(
                        "w-4 h-4",
                        item.status === "Rejected" ? "text-red-600" : "text-amber-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.patientName} — {item.serviceType}</p>
                      <p className="text-xs text-muted-foreground">{item.date} · {item.billingCode} · ${item.amount.toFixed(2)}</p>
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
                      BILLING_STATUS_STYLES[item.status].bg,
                      BILLING_STATUS_STYLES[item.status].text
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", BILLING_STATUS_STYLES[item.status].dot)} />
                      {item.status}
                    </span>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                      Update
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">All billing information is up to date</p>
              </div>
            )}
          </div>

          {/* Remittance status */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Remittance Status</h3>
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold font-display text-green-600">
                    ${MOCK_BILLING.filter((b) => b.status === "Paid").reduce((s, b) => s + b.amount, 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Received</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-display text-blue-600">
                    ${MOCK_BILLING.filter((b) => b.status === "Submitted").reduce((s, b) => s + b.amount, 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Processing</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-display text-amber-600">
                    ${MOCK_BILLING.filter((b) => b.status === "Pending").reduce((s, b) => s + b.amount, 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pending Submission</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-display text-red-600">
                    {MOCK_BILLING.filter((b) => b.status === "Rejected").length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Rejected Claims</p>
                </div>
              </div>

              <div className="h-3 bg-muted/30 rounded-full overflow-hidden flex">
                {(() => {
                  const total = MOCK_BILLING.reduce((s, b) => s + b.amount, 0);
                  const paid = MOCK_BILLING.filter((b) => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
                  const submitted = MOCK_BILLING.filter((b) => b.status === "Submitted").reduce((s, b) => s + b.amount, 0);
                  const pending = MOCK_BILLING.filter((b) => b.status === "Pending").reduce((s, b) => s + b.amount, 0);
                  return (
                    <>
                      <div className="h-full bg-green-500 transition-all" style={{ width: `${(paid / total) * 100}%` }} />
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${(submitted / total) * 100}%` }} />
                      <div className="h-full bg-amber-500 transition-all" style={{ width: `${(pending / total) * 100}%` }} />
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Paid</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Processing</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />Pending</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProviderLayout>
  );
}

// ─── Stat card ──────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  iconColor,
  iconBg,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  sublabel: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
    </div>
  );
}
