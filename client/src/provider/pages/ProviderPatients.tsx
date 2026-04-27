import { useState } from "react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import { MOCK_PATIENTS, type Patient } from "@/provider/lib/mockData";
import {
  Search,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  User,
  Pill,
  Shield,
  Activity,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  FileText,
  ExternalLink,
} from "lucide-react";

// ─── Status styles ──────────────────────────────────────────

const PATIENT_STATUS_STYLES: Record<Patient["status"], { bg: string; text: string; dot: string }> = {
  Active:       { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"    },
  "Pre-surgery": { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  "Post-surgery": { bg: "bg-green-50",   text: "text-green-700",   dot: "bg-green-500"   },
  Discharged:   { bg: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
};

type SortField = "name" | "triageScore" | "waitTime" | "referralDate";
type SortDir = "asc" | "desc";

export default function ProviderPatients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<Patient["status"] | "all">("all");

  // Filter
  const filtered = MOCK_PATIENTS.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phn.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
      p.condition.toLowerCase().includes(q) ||
      p.surgeon.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "triageScore":
        cmp = a.triageScore - b.triageScore;
        break;
      case "waitTime":
        cmp = a.waitTime.localeCompare(b.waitTime);
        break;
      case "referralDate":
        cmp = a.referralDate.localeCompare(b.referralDate);
        break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const selectedPatient = MOCK_PATIENTS.find((p) => p.id === selectedPatientId);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3" />;
  }

  return (
    <ProviderLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Patients
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          View and manage all patients in the CareQ system.
        </p>
      </div>

      {/* Audit disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Patient data access notice</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Only search for patients you are directly providing care for. All patient record access is audit-logged and subject to privacy review.
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, PHN, condition, or surgeon..."
            className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
          {(["all", "Active", "Pre-surgery", "Post-surgery", "Discharged"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
                statusFilter === s
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing <span className="font-semibold text-foreground">{sorted.length}</span> of{" "}
        <span className="font-semibold text-foreground">{MOCK_PATIENTS.length}</span> patients
      </p>

      {/* Patient table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <button onClick={() => handleSort("name")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    Patient <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Condition</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <button onClick={() => handleSort("triageScore")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    Triage <SortIcon field="triageScore" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <button onClick={() => handleSort("waitTime")} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    Wait Time <SortIcon field="waitTime" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Surgeon</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pre-visit</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Next Appt</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((patient) => {
                const statusStyle = PATIENT_STATUS_STYLES[patient.status];
                return (
                  <tr
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={cn(
                      "border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/30",
                      selectedPatientId === patient.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {patient.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.phn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{patient.condition}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                        statusStyle.bg, statusStyle.text
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        patient.triageScore >= 70 ? "bg-red-50 text-red-600" :
                        patient.triageScore >= 45 ? "bg-amber-50 text-amber-700" :
                        "bg-green-50 text-green-700"
                      )}>
                        {patient.triageScore}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {patient.waitTime || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{patient.surgeon}</td>
                    <td className="px-4 py-3">
                      <FormStatusPill status={patient.preVisitFormStatus} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {patient.nextAppointment || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">No patients found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Patient profile panel */}
      {selectedPatient && (
        <PatientProfile
          patient={selectedPatient}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </ProviderLayout>
  );
}

// ─── Patient profile panel ──────────────────────────────────

function PatientProfile({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white border-l border-border shadow-lg z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-lg font-semibold font-display tracking-tight">Patient Profile</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
            {patient.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold font-display tracking-tight">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">{patient.condition}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                PATIENT_STATUS_STYLES[patient.status].bg,
                PATIENT_STATUS_STYLES[patient.status].text,
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", PATIENT_STATUS_STYLES[patient.status].dot)} />
                {patient.status}
              </span>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                patient.triageScore >= 4 ? "bg-red-50 text-red-600" :
                patient.triageScore >= 3 ? "bg-amber-50 text-amber-700" :
                "bg-green-50 text-green-700"
              )}>
                Triage: {patient.triageScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Contact & demographics */}
        <div className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Demographics</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Date of Birth</span>
              <span className="font-medium">{patient.dob}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">PHN</span>
              <span className="font-medium">{patient.phn}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-xs">{patient.email}</span>
            </div>
          </div>
        </div>

        {/* Waitlist info */}
        <div className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Waitlist Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Wait Time</span>
              <span className="font-medium">{patient.waitTime || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Surgeon</span>
              <span className="font-medium">{patient.surgeon}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Referral Date</span>
              <span className="font-medium">{patient.referralDate}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Triage Score</span>
              <span className="font-medium">{patient.triageScore}/100</span>
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Appointment Readiness</h4>
          <div className="space-y-2">
            <ReadinessRow label="Pre-visit form" status={patient.preVisitFormStatus} />
            <ReadinessRow label="Patient confirmed" status={patient.patientConfirmed ? "Complete" : "Not started"} />
            <ReadinessRow label="Pre-charting" status={patient.preChartStatus} />
            <ReadinessRow label="Chart review" status={patient.chartReviewStatus === "Approved" ? "Complete" : patient.chartReviewStatus} />
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Pill className="w-4 h-4 text-muted-foreground" />
            Medications
          </h4>
          {patient.medications.length > 0 ? (
            <ul className="space-y-1">
              {patient.medications.map((med, i) => (
                <li key={i} className="text-sm text-muted-foreground pl-6">• {med}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic pl-6">None listed</p>
          )}
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Allergies
          </h4>
          <div className="flex flex-wrap gap-1.5 pl-6">
            {patient.allergies.length > 0 ? patient.allergies.map((a, i) => (
              <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">{a}</span>
            )) : (
              <span className="text-sm text-muted-foreground italic">No known drug allergies (NKDA)</span>
            )}
          </div>
        </div>

        {/* Medical history */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            Medical History
          </h4>
          <ul className="space-y-1">
            {patient.medicalHistory.map((h, i) => (
              <li key={i} className="text-sm text-muted-foreground pl-6">• {h}</li>
            ))}
          </ul>
        </div>

        {/* Appointment history */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Appointments
          </h4>
          <div className="text-sm space-y-1 pl-6">
            {patient.lastAppointment && (
              <p className="text-muted-foreground">Last: <span className="font-medium text-foreground">{patient.lastAppointment}</span></p>
            )}
            {patient.nextAppointment && (
              <p className="text-muted-foreground">Next: <span className="font-medium text-foreground">{patient.nextAppointment}</span></p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          <button className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            <FileText className="w-4 h-4" />
            Open Chart
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted/50 transition-colors">
            <Phone className="w-4 h-4" />
            Call Patient
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted/50 transition-colors">
            <Mail className="w-4 h-4" />
            Email Patient
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 border border-border text-sm font-medium rounded-md hover:bg-muted/50 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Alberta Netcare
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────

function FormStatusPill({ status }: { status: Patient["preVisitFormStatus"] }) {
  const styles = {
    Complete:     { bg: "bg-green-50", text: "text-green-700" },
    Partial:      { bg: "bg-amber-50", text: "text-amber-700" },
    "Not started": { bg: "bg-slate-100", text: "text-slate-500" },
  };
  const s = styles[status];
  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", s.bg, s.text)}>
      {status}
    </span>
  );
}

function ReadinessRow({ label, status }: { label: string; status: string }) {
  const isComplete = status === "Complete" || status === "Approved";
  const isInProgress = status === "In progress" || status === "Partial" || status === "Pending";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        isComplete ? "bg-green-50 text-green-700" : isInProgress ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
      )}>
        {status}
      </span>
    </div>
  );
}
