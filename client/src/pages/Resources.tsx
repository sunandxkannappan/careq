import { Layout } from "@/components/Layout";
import { useFaqs } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquareText, FileText, Phone, HelpCircle, Download, AlertTriangle } from "lucide-react";

const eAdviceItems = [
  {
    id: "eadvice-1",
    title: "Initial Appointment",
    date: "Jan 18, 2026",
    summary: "Overview of your diagnosis, immediate symptom-management guidance, and first-step care recommendations.",
  },
  {
    id: "eadvice-2",
    title: "3 Month Appointment",
    date: "Dec 02, 2025",
    summary: "Follow-up progress review, response to current treatment, and updated plan before your next milestone.",
  },
];

const generalDocs = [
  {
    id: "general-1",
    title: "AHKC Welcome Package",
    subtitle: "What to expect at joint assessment and surgical consult, including preparation and next steps.",
    type: "PDF",
  },
  {
    id: "general-2",
    title: "CareQ Welcome Package",
    subtitle: "How to use the portal to follow waitlist progress, appointments, updates, and care resources.",
    type: "PDF",
  },
];

export default function Resources() {
  const { data: faqs, isLoading: faqsLoading } = useFaqs();

  if (faqsLoading) {
    return (
      <Layout>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-page-title">Resources</h1>
            </div>
            <p className="text-muted-foreground">Access education, e-advice, clinic contacts, and common questions</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: 03/08/2026
          </div>
        </header>

        <Tabs defaultValue="eadvice" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="eadvice" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">E-Advice</TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">General</TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Contacts</TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="eadvice" className="space-y-2">
            {eAdviceItems.map((advice) => (
              <Card key={advice.id} className="border rounded-lg bg-white shadow-sm border-border/60">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <MessageSquareText className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{advice.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{advice.date}</p>
                      <p className="text-sm text-foreground mt-2 max-w-3xl">{advice.summary}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2 whitespace-nowrap"><Download className="w-4 h-4" />Download PDF</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="general" className="space-y-2">
            {generalDocs.map((doc) => (
              <Card key={doc.id} className="border rounded-lg bg-white shadow-sm border-border/60">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <FileText className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{doc.title}</p>
                      <p className="text-sm text-foreground mt-2 max-w-3xl">{doc.subtitle}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Download PDF</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card className="border rounded-lg bg-white shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Phone className="w-5 h-5 text-primary" />CareQ Contact</CardTitle>
                <CardDescription>For waitlist questions and portal support.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><span className="font-semibold">Phone:</span> (403) XXX-XXXX</p>
                <p><span className="font-semibold">Hours:</span> Monday-Friday, 8:00 AM-4:30 PM</p>
                <p><span className="font-semibold">Email:</span> support@careq.ca</p>
              </CardContent>
            </Card>
            <Card className="border rounded-lg bg-white shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Phone className="w-5 h-5 text-primary" />Alberta Hip and Knee Clinic Contact</CardTitle>
                <CardDescription>For Joint Assessment Clinic or Surgical Consult questions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><span className="font-semibold">Phone:</span> (403) XXX-XXXX</p>
                <p><span className="font-semibold">Hours:</span> Monday-Friday, 8:00 AM-4:30 PM</p>
                <p><span className="font-semibold">Address:</span> Alberta Hip and Knee Clinic, Calgary, AB</p>
                <p><span className="font-semibold">Email:</span> intake@ahkc.ca</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-2">
            <Card className="border rounded-lg bg-white shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-primary" />Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs?.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                      <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-muted/30 border border-border rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-foreground">
                If this is an emergency, call 911 immediately. For urgent hip or knee concerns-such as sudden inability to bear weight, severe new swelling, signs of infection (fever, redness, warmth), chest pain, or shortness of breath-go to the nearest emergency department or urgent care.
              </p>
              <p className="text-sm mt-2 text-foreground">
                For non-emergency appointment support, contact the clinic at <span className="font-semibold">(403) XXX-XXXX</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
