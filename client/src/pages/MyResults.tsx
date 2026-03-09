import { Layout } from "@/components/Layout";
import { useMyResults } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlaskConical, ScanLine, Clock, CheckCircle2, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categoryIcons = {
  Labs: FlaskConical,
  Imaging: ScanLine,
  Requisition: ClipboardList,
};

const statusConfig = {
  Normal: { label: "Normal", className: "bg-emerald-100 text-emerald-800" },
  Abnormal: { label: "Abnormal", className: "bg-red-100 text-red-800" },
  Pending: { label: "Pending", className: "bg-slate-700 text-white" },
};

const requisitions = [
  {
    id: "req-imaging-efw",
    title: "EFW Radiology Knee Imaging Requisition",
    category: "Imaging",
    formName: "EFW Radiology General Requisition",
    date: "2026-03-01",
    status: "Pending" as const,
    type: "Requisition" as const,
  },
  {
    id: "req-imaging-ahs",
    title: "AHS Diagnostic Imaging Requisition",
    category: "Imaging",
    formName: "AHS Diagnostic Imaging Requisition",
    date: "2026-02-20",
    status: "Pending" as const,
    type: "Requisition" as const,
  },
  {
    id: "req-lab-apl",
    title: "Alberta Precision Labs Bloodwork Requisition",
    category: "Labs",
    formName: "Alberta Precision Labs General Requisition",
    date: "2026-01-30",
    status: "Pending" as const,
    type: "Requisition" as const,
  },
];

function ResultCard({
  result,
  showRequisitionControls,
}: {
  result: any;
  showRequisitionControls?: boolean;
}) {
  const status = statusConfig[result.status as keyof typeof statusConfig] ?? statusConfig.Pending;
  const CategoryIcon = categoryIcons[(result.type || result.category) as keyof typeof categoryIcons] || ClipboardList;
  const [email, setEmail] = useState("");
  const [selectedForm, setSelectedForm] = useState(
    result.category === "Imaging" ? "" : "APL General Requisition",
  );

  const downloadRequisition = () => {
    const lines = [
      "CareQ Requisition",
      `Type: ${result.category}`,
      `Form: ${selectedForm || result.formName || result.title}`,
      `Date: ${format(new Date(result.date), "MMMM d, yyyy")}`,
    ];
    const content = lines
      .map((line, i) => `BT /F1 12 Tf 50 ${760 - i * 22} Td (${line.replace(/[()\\]/g, "\\$&")}) Tj ET`)
      .join("\n");
    const objects = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
      "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
    ];
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [0];
    for (const obj of objects) {
      offsets.push(pdf.length);
      pdf += `${obj}\n`;
    }
    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i++) {
      pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careq-${result.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendToEmail = () => {
    if (!email) return;
    const subject = encodeURIComponent(`CareQ ${result.category} Requisition`);
    const body = encodeURIComponent(`Requisition form: ${selectedForm || result.formName || result.title}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <AccordionItem
      value={`result-${result.id}`}
      className={cn(
        "border rounded-lg px-4 shadow-sm border-border/60 data-[state=open]:border-primary/30 transition-all",
        result.type === "Requisition" ? "bg-muted/40" : "bg-white",
      )}
    >
      <AccordionTrigger className="hover:no-underline py-4" data-testid={`button-result-${result.id}`}>
        <div className="flex items-center gap-4 w-full pr-4">
          <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
            <CategoryIcon className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-foreground text-sm truncate" data-testid={`text-result-title-${result.id}`}>{result.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(result.date), "MMM d, yyyy")}
            </p>
          </div>
          <Badge className={cn("shrink-0 border-none", status.className)} data-testid={`badge-result-status-${result.id}`}>
            {status.label}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-1">
        <div className="border-t border-border/40 pt-3 mt-1 space-y-3 pl-13">
          {showRequisitionControls ? (
            <div className="grid w-full items-center gap-3 md:grid-cols-[auto_minmax(220px,1fr)_auto_minmax(220px,1fr)_auto]">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Form</p>
              {result.category === "Imaging" ? (
                <select
                  className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm"
                  value={selectedForm}
                  onChange={(e) => setSelectedForm(e.target.value)}
                >
                  <option value="">Select form</option>
                  <option value="EFW Radiology">EFW Radiology</option>
                  <option value="AHS Radiology">AHS Radiology</option>
                  <option value="CDC Radiology">CDC Radiology</option>
                  <option value="Mayfair Radiology">Mayfair Radiology</option>
                </select>
              ) : (
                <div className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm inline-flex items-center whitespace-nowrap">
                  APL General Requisition
                </div>
              )}
              <Button variant="outline" onClick={downloadRequisition} className="whitespace-nowrap">Download PDF</Button>
              <Input className="w-full" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button variant="outline" onClick={sendToEmail} className="whitespace-nowrap">Send to Email</Button>
            </div>
          ) : (
            <>
              {result.summary && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Impression</p>
                  <p className="text-sm text-foreground" data-testid={`text-result-summary-${result.id}`}>{result.summary}</p>
                </div>
              )}
              {result.details && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Details</p>
                  <p className="text-sm text-foreground leading-relaxed" data-testid={`text-result-details-${result.id}`}>{result.details}</p>
                </div>
              )}
              {result.status === "Pending" && (
                <p className="text-xs text-amber-600 italic">Results are not yet available. You will be notified when they are ready.</p>
              )}
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ResultsList({
  results,
  emptyMessage,
  showRequisitionControls = false,
}: {
  results: any[];
  emptyMessage: string;
  showRequisitionControls?: boolean;
}) {
  if (results.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {sorted.map((result) => (
        <ResultCard key={result.id} result={result} showRequisitionControls={showRequisitionControls && result.type === "Requisition"} />
      ))}
    </Accordion>
  );
}

export default function MyResults() {
  const { data: results, isLoading } = useMyResults();

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" />
      </Layout>
    );
  }

  const labNames = [
    "Complete Blood Count (CBC)",
    "Comprehensive Metabolic Panel",
    "Lipid Profile (Fasting)",
    "C-Reactive Protein (CRP)",
  ];
  const imagingNames = [
    "MRI Right Knee (Non-Contrast)",
    "Bilateral Knee X-Ray (Weight Bearing)",
    "Long-Leg Alignment Imaging",
    "Diagnostic Knee Ultrasound",
  ];
  const normalized = (results || []).map((r, idx) => ({
    ...r,
    title:
      r.category === "Labs" ? labNames[idx % labNames.length] :
      r.category === "Imaging" ? imagingNames[idx % imagingNames.length] :
      r.title,
    status: r.status === "Pending" ? "Pending" : r.status === "Available" ? "Normal" : "Abnormal",
    type: r.category,
  }));
  const labs = normalized.filter((r) => r.category === "Labs");
  const imaging = normalized.filter((r) => r.category === "Imaging");
  const allItems = [...requisitions, ...normalized].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastUpdated = allItems.length > 0 ? new Date(allItems[0].date) : new Date();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-8 h-8 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-page-title">Results</h1>
            </div>
            <p className="text-muted-foreground">Access your requisitions and results for imaging and labs</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleDateString()}
          </div>
        </header>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8 bg-muted/50 p-1 rounded-lg" data-testid="tabs-results">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all gap-2" data-testid="tab-all">All</TabsTrigger>
            <TabsTrigger value="requisitions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all gap-2" data-testid="tab-requisitions">Requisitions</TabsTrigger>
            <TabsTrigger value="imaging" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all gap-2" data-testid="tab-imaging">Imaging</TabsTrigger>
            <TabsTrigger value="labs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all gap-2" data-testid="tab-labs">Labs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 animate-in fade-in-50 duration-300" data-testid="content-all">
            <ResultsList results={allItems} emptyMessage="No results available yet." showRequisitionControls />
          </TabsContent>

          <TabsContent value="requisitions" className="space-y-2 animate-in fade-in-50 duration-300" data-testid="content-requisitions">
            <ResultsList results={requisitions} emptyMessage="No requisitions available." showRequisitionControls />
          </TabsContent>

          <TabsContent value="imaging" className="space-y-2 animate-in fade-in-50 duration-300" data-testid="content-imaging">
            <ResultsList results={imaging} emptyMessage="No imaging results available yet." />
          </TabsContent>

          <TabsContent value="labs" className="space-y-2 animate-in fade-in-50 duration-300" data-testid="content-labs">
            <ResultsList results={labs} emptyMessage="No lab results available yet." />
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-muted/30 border border-border rounded-xl">
          <p className="text-sm text-foreground">
            The information in this portal relates only to care provided by our clinic. For other health records-such as lab results, medications, immunizations, and diagnostic reports-please use the My Health Alberta app.
          </p>
          <p className="text-sm mt-2">
            Access My Health Alberta:{" "}
            <a className="text-primary font-semibold underline" href="https://myhealth.alberta.ca/myhealthrecords" target="_blank" rel="noreferrer">
              https://myhealth.alberta.ca/myhealthrecords
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
