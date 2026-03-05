import { Layout } from "@/components/Layout";
import { useDocuments } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Beaker, FileImage, ShieldCheck, File, Calendar, AlertCircle, Eye, FileSignature } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Document } from "@shared/schema";

export default function Results() {
  const { data: documents, isLoading } = useDocuments();
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  const selectedDoc = documents?.find(d => d.id === selectedDocId) || (documents && documents.length > 0 ? documents[0] : null);

  // Filter categories
  const visitSummaries = documents?.filter(d => d.category === 'Visit Summary') || [];
  const results = documents?.filter(d => d.category === 'Result') || [];
  const consents = documents?.filter(d => d.category === 'Consent') || [];
  const otherDocs = documents?.filter(d => d.category === 'Other') || [];

  const getIcon = (category: string) => {
    switch (category) {
      case 'Imaging': 
      case 'Result': return <Beaker className="w-5 h-5 text-sky-500" />;
      case 'Visit Summary': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Consent': return <FileSignature className="w-5 h-5 text-purple-600" />;
      default: return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Released': return "bg-sky-50 text-sky-700 border-sky-200";
      case 'Pending release': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'Not available': return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const DocList = ({ docs }: { docs: Document[] }) => (
    <div className="space-y-2">
      {docs.length > 0 ? docs.map((doc) => (
        <div 
          key={doc.id} 
          onClick={() => setSelectedDocId(doc.id)}
          className={cn(
            "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm",
            selectedDoc?.id === doc.id 
              ? "bg-primary/5 border-primary/40 shadow-sm" 
              : "bg-white border-border/60 hover:border-primary/20"
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-md bg-white border border-border/50", selectedDoc?.id === doc.id && "bg-primary/10 border-primary/20")}>
                {getIcon(doc.category)}
              </div>
              <div>
                <h3 className={cn("font-semibold text-sm md:text-base", selectedDoc?.id === doc.id ? "text-primary" : "text-foreground")}>
                  {doc.title}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(doc.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <Badge variant="outline" className={cn("text-[10px] font-medium border", getStatusColor(doc.status))}>
              {doc.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{doc.author}</span>
          </div>
        </div>
      )) : (
        <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/60">
          No documents found in this category.
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        <header className="mb-6 flex-shrink-0">
          <h1 className="font-display text-3xl font-bold mb-2">Documents & Results</h1>
          <p className="text-muted-foreground">Access your medical records, test results, and visit summaries</p>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: List with Tabs */}
          <div className="lg:col-span-1 flex flex-col min-h-0 bg-white/50 rounded-xl border border-border/60 shadow-sm overflow-hidden">
            <Tabs defaultValue="all" className="flex flex-col h-full">
              <div className="p-4 border-b border-border/40 bg-white/80 backdrop-blur-sm">
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                   <TabsList className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-auto">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="summaries" className="text-xs">Summaries</TabsTrigger>
                    <TabsTrigger value="results" className="text-xs">Results</TabsTrigger>
                    <TabsTrigger value="consents" className="text-xs">Consents</TabsTrigger>
                    <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
                  </TabsList>
                </ScrollArea>
              </div>

              <ScrollArea className="flex-1 p-4">
                <TabsContent value="all" className="mt-0">
                  <DocList docs={documents || []} />
                </TabsContent>
                <TabsContent value="summaries" className="mt-0">
                  <DocList docs={visitSummaries} />
                </TabsContent>
                <TabsContent value="results" className="mt-0">
                  <DocList docs={results} />
                </TabsContent>
                <TabsContent value="consents" className="mt-0">
                  <DocList docs={consents} />
                </TabsContent>
                <TabsContent value="other" className="mt-0">
                  <DocList docs={otherDocs} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Right Column: Preview Panel */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            {selectedDoc ? (
              <Card className="h-full flex flex-col border-border/60 shadow-md animate-in fade-in-50 duration-300">
                <div className="p-6 border-b border-border/40 bg-muted/10 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Badge variant="outline" className={cn("text-xs font-medium border px-2 py-0.5", getStatusColor(selectedDoc.status))}>
                        {selectedDoc.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded border border-border">
                        {selectedDoc.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold font-display text-foreground">{selectedDoc.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Authored by <span className="font-medium text-foreground">{selectedDoc.author}</span> • {format(new Date(selectedDoc.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-border shadow-sm">
                    {getIcon(selectedDoc.category)}
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto bg-white/50">
                  {selectedDoc.status === 'Released' || selectedDoc.status === 'Pending release' ? (
                     <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-border shadow-sm min-h-[400px] relative">
                        {selectedDoc.status === 'Pending release' && (
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-6 text-center">
                             <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                               <Clock className="w-6 h-6" />
                             </div>
                             <h3 className="font-bold text-lg text-foreground mb-1">Document Pending Release</h3>
                             <p className="text-muted-foreground max-w-sm">
                               {selectedDoc.reasonForUnavailability || "This document is currently being reviewed and will be available shortly."}
                             </p>
                          </div>
                        )}
                        
                        <div className="prose prose-sm max-w-none">
                           <h3 className="text-lg font-bold border-b pb-2 mb-4 uppercase tracking-wide text-muted-foreground">Preview</h3>
                           <div className="space-y-4 text-foreground/80 leading-relaxed">
                             {selectedDoc.previewText ? (
                               selectedDoc.previewText.split('\n').map((para, i) => <p key={i}>{para}</p>)
                             ) : (
                               <p className="italic text-muted-foreground">No preview text available for this document.</p>
                             )}
                             <div className="h-32 bg-muted/10 w-full rounded animate-pulse"></div>
                             <div className="h-32 bg-muted/10 w-full rounded animate-pulse"></div>
                           </div>
                        </div>
                     </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Document Not Available</h3>
                      <p className="text-muted-foreground max-w-md mx-auto bg-slate-50 p-4 rounded-lg border border-slate-100">
                        Reason: {selectedDoc.reasonForUnavailability || "This document is restricted."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-border/40 bg-white/80 backdrop-blur-sm flex justify-between items-center">
                   <p className="text-xs text-muted-foreground">
                      CareQ Secure Document Viewer v1.2
                   </p>
                   {selectedDoc.status === 'Released' ? (
                     <Button className="gap-2 shadow-md">
                       <Download className="w-4 h-4" /> Download PDF
                     </Button>
                   ) : (
                     <Button disabled variant="outline" className="gap-2 opacity-50 cursor-not-allowed">
                       <Download className="w-4 h-4" /> Download Unavailable
                     </Button>
                   )}
                </div>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/10 rounded-xl border border-dashed border-border/60">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <FileText className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Select a document</h3>
                <p className="text-muted-foreground max-w-xs">
                  Choose a document from the list on the left to view its details and download options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
