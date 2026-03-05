import { Layout } from "@/components/Layout";
import { useResources, useFaqs } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Clock, AlertTriangle, FileText, PlayCircle, Download, ExternalLink, HelpCircle, Dumbbell, BookOpen, Contact, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Resource } from "@shared/schema";

export default function Resources() {
  const { data: resources, isLoading: resourcesLoading } = useResources();
  const { data: faqs, isLoading: faqsLoading } = useFaqs();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  if (resourcesLoading || faqsLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  const getIcon = (type: string, category: string) => {
    if (category === 'Contact') return <Contact className="w-5 h-5 text-indigo-500" />;
    if (category === 'FAQ') return <HelpCircle className="w-5 h-5 text-amber-500" />;
    if (category === 'Exercise') return <Dumbbell className="w-5 h-5 text-sky-500" />;
    
    switch (type) {
      case 'Video': return <PlayCircle className="w-5 h-5 text-red-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <BookOpen className="w-5 h-5 text-primary" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'Education', label: 'Education' },
    { id: 'Exercise', label: 'Exercise' },
    { id: 'Contact', label: 'Contacts' },
    { id: 'FAQ', label: 'FAQ' },
  ];

  const handleDownload = (resource: Resource) => {
    // Simulate download
    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(`This is a placeholder for ${resource.title}`);
    link.download = `${resource.title.toLowerCase().replace(/\s+/g, '-')}.${resource.type === 'PDF' ? 'pdf' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <Card className="flex flex-col h-full hover:shadow-md transition-all duration-200 border-border/60 overflow-hidden group">
      <div className="relative h-32 bg-muted overflow-hidden">
        {resource.thumbnailUrl ? (
          <img 
            src={resource.thumbnailUrl} 
            alt={resource.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            {getIcon(resource.type, resource.category)}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-bold text-primary shadow-sm hover:bg-white">
            {resource.type}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
           <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground border-border">
             {resource.category}
           </Badge>
        </div>
        <CardTitle className="text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {resource.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        <CardDescription className="line-clamp-2 text-sm">
          {resource.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 text-xs" onClick={() => setSelectedResource(resource)}>
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {getIcon(resource.type, resource.category)}
                {resource.title}
              </DialogTitle>
              <DialogDescription>
                {resource.category} • {resource.type}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                {resource.thumbnailUrl && (
                  <img src={resource.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                )}
                <div className="relative z-10 bg-white/90 p-4 rounded-full shadow-lg">
                   {getIcon(resource.type, resource.category)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {resource.description}. This is a placeholder for the full content of the resource. In a real application, this would contain the complete article text, the video player, or a PDF viewer.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <div className="text-xs text-muted-foreground flex items-center self-center">
                 Access Count: 124 views
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" onClick={() => handleDownload(resource)}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button type="submit">Close</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => handleDownload(resource)}>
          <Download className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Contact Strip */}
        <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Need to speak with someone?</h2>
              <p className="text-muted-foreground text-sm mb-2">Our care team is available to help with your questions.</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> (555) 123-4567
                </span>
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Mon-Fri, 8am - 6pm PST
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-3 max-w-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <span className="font-bold block mb-0.5">For Emergencies</span>
              If you are experiencing a medical emergency, chest pain, or severe shortness of breath, please dial 911 immediately.
            </div>
          </div>
        </div>

        <div>
          <header className="mb-6">
            <h1 className="font-display text-3xl font-bold mb-2">Resources & Help</h1>
            <p className="text-muted-foreground">Educational materials and guides for your journey</p>
          </header>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 rounded-lg w-full sm:w-auto sm:inline-flex mb-8">
              {categories.map(cat => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="flex-1 sm:flex-none data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0">
                {cat.id === 'FAQ' ? (
                  <div className="max-w-3xl mx-auto py-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="w-6 h-6 text-amber-500" />
                          Frequently Asked Questions
                        </CardTitle>
                        <CardDescription>
                          Common questions about your surgery, recovery, and care plan.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {faqs?.map((faq) => (
                            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                              <AccordionTrigger className="text-left font-medium">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                    
                     <div className="mt-8">
                       <h3 className="text-lg font-bold mb-4 px-1">Related Resources</h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {resources?.filter(r => r.category === 'FAQ').map(resource => (
                             <ResourceCard key={resource.id} resource={resource} />
                          ))}
                       </div>
                    </div>
                  </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {resources
                    ?.filter(r => {
                      if (cat.id === 'all') return true;
                      if (cat.id === 'Education') return r.category === 'Education' || r.category === 'Medication';
                      return r.category === cat.id;
                    })
                    .map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                  
                  {resources && resources.filter(r => {
                      if (cat.id === 'all') return true;
                      if (cat.id === 'Education') return r.category === 'Education' || r.category === 'Medication';
                      return r.category === cat.id;
                    }).length === 0 && (
                    <div className="col-span-full py-12 text-center bg-muted/20 rounded-xl border border-dashed border-border/60">
                      <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No resources found in this category.</p>
                    </div>
                  )}
                </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
