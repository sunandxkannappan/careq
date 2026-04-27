import { useState } from "react";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Link2,
  FileText,
  Trash2,
  Eye,
  ChevronRight,
  Check,
  CheckCircle2,
  Smartphone,
  Mail,
  Globe,
  Calendar,
  Accessibility,
  AlertTriangle,
} from "lucide-react";

type AccountTab = "profile" | "preferences" | "security" | "remittance" | "integrations" | "compliance";

const TABS: { key: AccountTab; label: string; icon: typeof User }[] = [
  { key: "profile",       label: "Profile",        icon: User },
  { key: "preferences",   label: "Preferences",    icon: Bell },
  { key: "security",      label: "Security",       icon: Shield },
  { key: "remittance",    label: "Remittance",     icon: CreditCard },
  { key: "integrations",  label: "Integrations",   icon: Link2 },
  { key: "compliance",    label: "Compliance",     icon: FileText },
];

export default function ProviderAccount() {
  const [tab, setTab] = useState<AccountTab>("profile");
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <ProviderLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
          Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          Manage your profile, preferences, and account settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Side nav */}
        <nav className="md:w-56 shrink-0">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  tab === t.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile */}
          {tab === "profile" && (
            <div className="space-y-6">
              <SectionCard title="Personal Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="First Name" defaultValue="Sarah" />
                  <FormField label="Last Name" defaultValue="Reynolds" />
                  <FormField label="Email" defaultValue="dr.reynolds@careq.ca" type="email" />
                  <FormField label="Phone" defaultValue="(403) 555-0100" type="tel" />
                  <FormField label="Medical License #" defaultValue="AB-12345" readOnly />
                  <FormField label="Specialty" defaultValue="Orthopedic Surgery" />
                </div>
              </SectionCard>

              <SectionCard title="Clinic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Primary Clinic" defaultValue="Alberta Hip & Knee Clinic" readOnly />
                  <FormField label="Role" defaultValue="Virtual Physician" readOnly />
                  <FormField label="Location" defaultValue="Calgary, AB" />
                  <FormField label="Start Date" defaultValue="2025-06-15" readOnly />
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    saved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Preferences */}
          {tab === "preferences" && (
            <div className="space-y-6">
              <SectionCard title="Communication Preferences">
                <div className="space-y-4">
                  <ToggleRow
                    icon={Mail}
                    label="Email notifications"
                    description="Receive email alerts for new appointments, tasks, and e-consults"
                    defaultChecked
                  />
                  <ToggleRow
                    icon={Smartphone}
                    label="SMS notifications"
                    description="Receive text message reminders for upcoming appointments"
                    defaultChecked
                  />
                  <ToggleRow
                    icon={Bell}
                    label="Push notifications"
                    description="Browser push notifications for urgent items"
                    defaultChecked={false}
                  />
                  <ToggleRow
                    icon={Calendar}
                    label="Daily schedule digest"
                    description="Receive a summary of your daily schedule each morning at 7:00 AM"
                    defaultChecked
                  />
                </div>
              </SectionCard>

              <SectionCard title="Reminder Settings">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Appointment reminder lead time</label>
                    <select className="w-full max-w-xs h-9 rounded-md border border-input bg-background px-3 text-sm">
                      <option>5 minutes before</option>
                      <option>10 minutes before</option>
                      <option>15 minutes before</option>
                      <option>30 minutes before</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Task reminder frequency</label>
                    <select className="w-full max-w-xs h-9 rounded-md border border-input bg-background px-3 text-sm">
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Hourly for overdue</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Accessibility">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Font size</label>
                    <select className="w-full max-w-xs h-9 rounded-md border border-input bg-background px-3 text-sm">
                      <option>Default</option>
                      <option>Large</option>
                      <option>Extra Large</option>
                    </select>
                  </div>
                  <ToggleRow
                    icon={Accessibility}
                    label="High contrast mode"
                    description="Increase contrast for better readability"
                    defaultChecked={false}
                  />
                  <ToggleRow
                    icon={Eye}
                    label="Reduce motion"
                    description="Minimize animations throughout the interface"
                    defaultChecked={false}
                  />
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    saved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {tab === "security" && (
            <div className="space-y-6">
              <SectionCard title="Password">
                <div className="space-y-4 max-w-md">
                  <FormField label="Current Password" type="password" placeholder="Enter current password" />
                  <FormField label="New Password" type="password" placeholder="Enter new password" />
                  <FormField label="Confirm Password" type="password" placeholder="Confirm new password" />
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                    Update Password
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Multi-Factor Authentication">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">MFA is enabled</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Using authenticator app. Last verified: March 1, 2026
                    </p>
                  </div>
                  <button className="px-3 py-1.5 border border-border text-sm font-medium rounded-md hover:bg-muted/50 transition-colors">
                    Reconfigure
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Active Sessions">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Chrome · macOS</p>
                        <p className="text-xs text-muted-foreground">Calgary, AB · Current session</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Danger Zone">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Permanently delete your CareQ provider account. This action cannot be undone.
                    </p>
                  </div>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 border border-border text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* Remittance */}
          {tab === "remittance" && (
            <div className="space-y-6">
              <SectionCard title="Remittance Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Payee Name" defaultValue="Dr. Sarah Reynolds" />
                  <FormField label="Billing Number" defaultValue="AB-BILL-12345" readOnly />
                  <FormField label="Institution Number" defaultValue="004" />
                  <FormField label="Transit Number" defaultValue="12345" />
                  <div className="md:col-span-2">
                    <FormField label="Account Number" defaultValue="••••••7890" type="password" />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Tax Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Business Number" defaultValue="123456789 RT0001" />
                  <FormField label="Tax Year" defaultValue="2026" readOnly />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  T4A slips are issued annually and available for download in January.
                </p>
              </SectionCard>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                    saved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  {saved ? "Saved" : "Save Remittance Info"}
                </button>
              </div>
            </div>
          )}

          {/* Integrations */}
          {tab === "integrations" && (
            <div className="space-y-6">
              <SectionCard title="External Accounts">
                <div className="space-y-4">
                  <IntegrationRow
                    name="Outlook Calendar"
                    description="Sync your CareQ schedule with Microsoft Outlook"
                    connected={false}
                  />
                  <IntegrationRow
                    name="Google Calendar"
                    description="Sync your CareQ schedule with Google Calendar"
                    connected={false}
                  />
                  <IntegrationRow
                    name="Alberta Netcare"
                    description="Quick access to patient records on Alberta Netcare"
                    connected
                  />
                </div>
              </SectionCard>
            </div>
          )}

          {/* Compliance */}
          {tab === "compliance" && (
            <div className="space-y-6">
              <SectionCard title="Terms of Use & Compliance">
                <div className="space-y-4">
                  <ComplianceRow
                    title="Terms of Service"
                    description="CareQ provider terms of service"
                    accepted="Accepted on June 15, 2025"
                  />
                  <ComplianceRow
                    title="Privacy Policy"
                    description="How CareQ handles provider and patient data"
                    accepted="Accepted on June 15, 2025"
                  />
                  <ComplianceRow
                    title="HIPAA / HIA Compliance Agreement"
                    description="Health information privacy compliance"
                    accepted="Accepted on June 15, 2025"
                  />
                  <ComplianceRow
                    title="Data Processing Agreement"
                    description="Agreement for clinical data processing"
                    accepted="Accepted on June 15, 2025"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Consent Records">
                <p className="text-sm text-muted-foreground">
                  All consent records are maintained and available for audit. Contact{" "}
                  <span className="font-medium text-primary">compliance@careq.ca</span> for compliance inquiries.
                </p>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}

// ─── Helper components ──────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <h3 className="text-base font-semibold font-display tracking-tight mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FormField({
  label,
  defaultValue,
  type = "text",
  placeholder,
  readOnly,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(
          "w-full h-9 rounded-md border border-input px-3 text-sm",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          readOnly ? "bg-muted/30 text-muted-foreground cursor-not-allowed" : "bg-background"
        )}
      />
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  defaultChecked,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors shrink-0",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-4"
          )}
        />
      </button>
    </div>
  );
}

function IntegrationRow({
  name,
  description,
  connected,
}: {
  name: string;
  description: string;
  connected: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border">
      <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
        <Link2 className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {connected ? (
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Connected</span>
      ) : (
        <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">
          Connect
        </button>
      )}
    </div>
  );
}

function ComplianceRow({
  title,
  description,
  accepted,
}: {
  title: string;
  description: string;
  accepted: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border">
      <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground">{accepted}</p>
        <button className="text-xs text-primary font-medium hover:underline">View</button>
      </div>
    </div>
  );
}
