import { Layout } from "@/components/Layout";
import { useMyResults } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FlaskConical, ScanLine, Clock, CheckCircle2, Eye, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const categoryIcons = {
  Labs: FlaskConical,
  Imaging: ScanLine,
};

const statusConfig = {
  Available: { icon: Eye, label: "Available", className: "bg-primary/10 text-primary border-primary/20" },
  Pending: { icon: Clock, label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  Reviewed: { icon: CheckCircle2, label: "Reviewed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function ResultCard({ result }: { result: any }) {
  const status = statusConfig[result.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;
  const CategoryIcon = categoryIcons[result.category as keyof typeof categoryIcons];

  return (
    <AccordionItem
      value={`result-${result.id}`}
      className="border rounded-lg bg-white px-4 shadow-sm border-border/60 data-[state=open]:border-primary/30 transition-all"
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
          {result.status === "Pending" && (
            <Badge variant="outline" className={cn("shrink-0", statusConfig.Pending.className)} data-testid={`badge-result-status-${result.id}`}>
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-1">
        <div className="border-t border-border/40 pt-3 mt-1 space-y-3 pl-13">
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
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ResultsList({ results, emptyMessage }: { results: any[]; emptyMessage: string }) {
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
        <ResultCard key={result.id} result={result} />
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

  const labs = results?.filter((r) => r.category === "Labs") || [];
  const imaging = results?.filter((r) => r.category === "Imaging") || [];
  const pendingCount = results?.filter((r) => r.status === "Pending").length || 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-page-title">Results</h1>
          </div>
          <p className="text-muted-foreground">Access your lab results and imaging reports</p>
        </header>

        {pendingCount > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200" data-testid="badge-pending-count">
              <Clock className="w-3 h-3 mr-1" />
              {pendingCount} Pending
            </Badge>
          </div>
        )}

        <Tabs defaultValue="labs" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1 rounded-lg" data-testid="tabs-results">
            <TabsTrigger
              value="labs"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all gap-2"
              data-testid="tab-labs"
            >
              <FlaskConical className="w-4 h-4" />
              Labs ({labs.length})
            </TabsTrigger>
            <TabsTrigger
              value="imaging"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all gap-2"
              data-testid="tab-imaging"
            >
              <ScanLine className="w-4 h-4" />
              Imaging ({imaging.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="labs" className="space-y-2 animate-in fade-in-50 duration-300" data-testid="content-labs">
            <ResultsList results={labs} emptyMessage="No lab results available yet." />
          </TabsContent>

          <TabsContent value="imaging" className="space-y-2 animate-in fade-in-50 duration-300" data-testid="content-imaging">
            <ResultsList results={imaging} emptyMessage="No imaging results available yet." />
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-foreground">
            Don't have a MyHealth account yet? <span className="font-semibold text-primary">Sign up at myhealth.gov.bc.ca</span> to access additional documents and health information.
          </p>
        </div>
      </div>
    </Layout>
  );
}
