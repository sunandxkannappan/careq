import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: `We collect personal information necessary to manage your surgical waitlist placement and coordinate your care. This includes your name, date of birth, Alberta Personal Health Number (PHN), contact information, medical history, and appointment details. We collect this information directly from you, your referring physician, or Alberta Health Services.`,
  },
  {
    heading: "2. How We Use Your Information",
    body: `Your information is used solely to provide and improve your care through the CareQ patient portal. Specifically, we use it to manage your position on the surgical waitlist, schedule and confirm appointments, send you reminders and care-related communications, and share relevant health information with your care team (surgeon, nurses, administrative staff).`,
  },
  {
    heading: "3. Disclosure to Third Parties",
    body: `We do not sell, trade, or otherwise transfer your personal health information to third parties. We may share your information with your treating healthcare providers, Alberta Health Services, or other parties as required to coordinate your care or as required by law. All third-party service providers who handle your data are bound by confidentiality agreements.`,
  },
  {
    heading: "4. Data Security",
    body: `We take the security of your personal health information seriously. All data is encrypted in transit (TLS) and at rest. Access to patient records is restricted to authorized personnel only. We conduct regular security assessments and maintain access logs.`,
  },
  {
    heading: "5. Retention",
    body: `Your personal health information is retained in accordance with Alberta's Health Information Act (HIA). Generally, medical records are retained for a minimum of 10 years from the last patient encounter, or until the patient turns 25 years of age (whichever is later), as required by law.`,
  },
  {
    heading: "6. Your Rights",
    body: `Under the Health Information Act (HIA) and the Personal Information Protection Act (PIPA) of Alberta, you have the right to access your personal health information held by us, request corrections to inaccurate information, and withdraw consent to certain uses of your information (except where required by law). To exercise these rights, contact your clinic's privacy officer.`,
  },
  {
    heading: "7. Cookies and Portal Data",
    body: `The CareQ portal stores limited data in your browser's local storage (such as session state and notification preferences) to improve your experience. This data does not include sensitive health information and is cleared when you log out. We do not use tracking cookies or third-party analytics.`,
  },
  {
    heading: "8. Contact Us",
    body: `If you have questions or concerns about how your personal health information is handled, please contact us at privacy@careq.ca or speak with your clinic's patient services team.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto p-4 md:p-8 lg:p-12 animate-enter">

        {/* Back link */}
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to registration
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold font-display text-lg shadow-lg shadow-primary/30 shrink-0">
              Q
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">CareQ</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Effective date: January 1, 2025 &nbsp;·&nbsp; Last updated: March 2025
          </p>
        </div>

        {/* Intro */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 mb-8">
          <p className="text-sm text-blue-700 leading-relaxed">
            CareQ is committed to protecting the privacy of your personal health information. This policy describes how we collect, use, and disclose your information in accordance with Alberta's{" "}
            <strong>Health Information Act (HIA)</strong> and the{" "}
            <strong>Personal Information Protection Act (PIPA)</strong>.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <section key={section.heading} className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-display font-semibold text-base text-foreground tracking-tight mb-2">
                {section.heading}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CareQ Patient Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
