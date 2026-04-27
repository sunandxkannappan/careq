import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  Stethoscope,
  Activity,
  User,
  Pill,
  Shield,
  X,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import { ChartingPanel, PreChartPanel, EAdvicePanel } from '@/provider/components/ClinicalPanels';
import { 
  MOCK_CHARTING, 
  MOCK_PATIENTS, 
  type ChartingActivity 
} from "@/provider/lib/mockData";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export default function ProviderCharting() {
  const [activeTopTab, setActiveTopTab] = useState('chart-review'); // 'chart-review', 'charting', 'e-advice'
  const [activeSubTab, setActiveSubTab] = useState('pending'); // 'pending', 'completed'
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<{ type: string, meetingId: string, patientName: string, patientId: string, phn: string, dob: string, readOnly?: boolean } | null>(null);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);

  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulate fetching data and map MOCK_CHARTING to the careQ-UI format
  useEffect(() => {
    setLoading(true);
    // Convert MOCK_CHARTING items into the format ChartingInbox.jsx expects
    setTimeout(() => {
      const processedTasks = MOCK_CHARTING.map(m => {
        const patient = MOCK_PATIENTS.find(p => p.id === m.patientId) || MOCK_PATIENTS[0];
        
        let taskType = m.type;
        // Map careq mock types to careQ-UI top tab assumptions if needed
        // careQ-UI activeTopTab values: 'chart-review', 'charting', 'e-advice'
        
        return {
          id: m.id,
          meetingId: m.id,
          patientId: m.patientId,
          patientName: m.patientName,
          // We preserve the original type to route to the correct tab
          originalType: m.type, 
          condition: m.condition || "General Encounter",
          status: m.status === 'Complete' ? 'COMPLETED' : m.status,
          dueDate: m.dueDate,
          summary: {
            dob: patient.dob,
            phn: patient.phn,
            surgeon: patient.surgeon,
            triageScore: patient.triageScore,
            triageBand: patient.triageScore > 75 ? 'High' : patient.triageScore > 40 ? 'Medium' : 'Low',
            preVisit: patient.preVisitFormStatus,
            patientConfirmed: patient.patientConfirmed ? 'Completed' : 'Pending',
            preCharting: patient.preChartStatus,
            chartReview: patient.chartReviewStatus
          },
          medications: patient.medications.length ? patient.medications : ["No medications"],
          allergies: patient.allergies.length ? patient.allergies : ["No Known Allergies"],
          history: patient.medicalHistory.length ? patient.medicalHistory : ["No pertinent medical history"],
          eAdviceStatus: m.status === 'Complete' ? 'SUBMITTED' : 'PENDING'
        };
      });
      setAllTasks(processedTasks);
      setLoading(false);
    }, 400); // simulate network delay
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when tabs change
    setExpandedCard(null); // Reset expansion when tabs change
  }, [activeTopTab, activeSubTab]);

  const handleApproveChart = async (meetingId: string) => {
    try {
      // Optmistic update
      setAllTasks(prev => prev.map(t => t.meetingId === meetingId ? { ...t, status: 'COMPLETED' } : t));
    } catch (error) {
      console.error("Failed to approve chart:", error);
    }
  };

  const isTaskCompleted = (task: any) => {
    if (activeTopTab === 'e-advice') {
      return task.eAdviceStatus === 'SUBMITTED' || task.status === 'COMPLETED';
    }
    return task.status === 'COMPLETED';
  };

  const filteredByPerspective = allTasks.filter(task => {
    if (activeTopTab === 'chart-review') {
      return task.originalType === 'Chart review' || task.originalType === 'Pre-chart';
    } else if (activeTopTab === 'charting') {
      return task.originalType === 'Appointment charting';
    } else if (activeTopTab === 'e-advice') {
      return task.originalType === 'E-advice';
    }
    return true; 
  });

  const pendingTasks = filteredByPerspective.filter(t => !isTaskCompleted(t));
  const completedTasks = filteredByPerspective.filter(t => isTaskCompleted(t));
  const currentTasks = activeSubTab === 'pending' ? pendingTasks : completedTasks;

  const totalPages = Math.ceil(currentTasks.length / itemsPerPage);
  const paginatedTasks = currentTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const renderSummaryStatus = (status: string) => {
    const isComplete = status === 'Completed' || status === 'Complete' || status === 'COMPLETED';
    const isInProgress = status === 'In progress';
    
    return (
      <span className={cn(
        "text-right font-medium flex items-center justify-end gap-1",
        isComplete ? "text-green-600" : isInProgress ? "text-blue-500" : "text-amber-500"
      )}>
        {isComplete ? <CheckCircle2 size={14}/> : isInProgress ? <Loader2 size={14} className="animate-spin"/> : <Clock size={14}/>}
        {status}
      </span>
    );
  };

  return (
    <ProviderLayout>
      <div className="p-0 sm:p-6 max-w-5xl mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-0.5">Charting</h1>
          <p className="text-xs text-slate-500 italic">Pre-charting, chart reviews, appointment documentation, and e-advice.</p>
        </div>

        {/* Top Tabs */}
        <div className="flex gap-2 mb-8">
          {['Chart Review', 'Charting', 'E-Advice'].map((tab) => {
            const tabKey = tab.toLowerCase().replace(' ', '-');
            const isActive = activeTopTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTopTab(tabKey)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  isActive ? 'bg-white shadow-sm border border-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div>
          {/* Sub Tabs Container */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-1 border border-slate-200 rounded-xl p-1 bg-white shadow-sm">
              {['Pending', 'Completed'].map((tab) => {
                const tabKey = tab.toLowerCase();
                const isActive = activeSubTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveSubTab(tabKey)}
                    className={`px-4 py-1 rounded-lg text-[12px] font-semibold transition-all ${
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 text-[13px] font-semibold text-slate-500">
              <span><strong className="text-slate-900">
                {pendingTasks.length}
              </strong> pending</span>
              <span><strong className="text-slate-900">
                {completedTasks.length}
              </strong> completed</span>
            </div>
          </div>

          {/* Task List */}
          {loading ? (
             <div className="flex justify-center items-center py-20 text-slate-400">
                <Loader2 className="animate-spin w-8 h-8"/> 
             </div>
          ) : (
          <div className="space-y-4">
            {paginatedTasks.length === 0 && (
               <div className="text-center p-12 bg-white border border-slate-200 rounded-xl text-slate-500">
                  No {activeSubTab} charting tasks found.
               </div>
            )}
            {paginatedTasks.map((task) => {
              const isExpanded = expandedCard === task.id;
              return (
                <div key={task.id} className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  {/* Card Header (Always Visible) */}
                  <div 
                    className="py-3 px-5 flex justify-between items-center cursor-pointer hover:bg-slate-50/50"
                    onClick={() => toggleExpand(task.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activeTopTab === 'chart-review' ? 'bg-[#eff6ff] border border-[#bfdbfe]' : 'bg-[#ecfdf5] border border-[#a7f3d0]'
                      }`}>
                        {activeTopTab === 'chart-review' ? (
                          <Eye className="text-[#1e40af] w-4 h-4" />
                        ) : (
                          <FileText className="text-[#059669] w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[14px] text-slate-900">{task.patientName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                            activeTopTab === 'chart-review' ? 'text-[#1e40af] bg-[#eff6ff]' : 
                            activeTopTab === 'e-advice' ? 'text-amber-700 bg-amber-50' : 'text-[#059669] bg-[#ecfdf5]'
                          }`}>
                            {activeTopTab === 'chart-review' ? 'Chart review' : 
                             activeTopTab === 'e-advice' ? 'E-advice' : 'Appointment Charting'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5 italic">{task.condition}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {activeSubTab === 'completed' && task.summary.triageScore !== "N/A" && task.summary.triageScore > 0 && (
                        <div className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm",
                          task.summary.triageBand === 'High' ? "bg-red-50 text-red-700 border-red-200" :
                          task.summary.triageBand === 'Medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-green-50 text-green-700 border-green-200"
                        )}>
                          <Activity size={12} className={cn(
                            task.summary.triageBand === 'High' ? "text-red-500" :
                            task.summary.triageBand === 'Medium' ? "text-amber-500" :
                            "text-green-500"
                          )} />
                          <span className="text-[11px] font-black uppercase tracking-tight">
                            {task.summary.triageScore} / {task.summary.triageBand}
                          </span>
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                        task.status === 'Outstanding' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        task.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          task.status === 'Outstanding' ? 'bg-amber-500' :
                          task.status === 'In progress' ? 'bg-blue-500' :
                          task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-slate-400'
                        }`}></div>
                        <span className="text-[10px] font-semibold">{task.status === 'COMPLETED' ? 'Completed' : task.status}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">Due {task.dueDate}</span>
                      <button className="text-slate-300 hover:text-slate-500 transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Card Body (Expanded) */}
                  {isExpanded && (
                    <div className={`p-6 border-t border-slate-100 bg-[#f8fafc] grid grid-cols-1 ${
                      activeSubTab === 'completed' && activeTopTab === 'e-advice' ? 'lg:grid-cols-[1fr_1fr_160px]' : 
                      activeSubTab === 'completed' ? 'lg:grid-cols-[1fr_1fr]' : 'lg:grid-cols-[1.5fr_1fr_250px]'
                    } gap-8`}>
                      
                      {/* Col 1: Patient Summary */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                          <User size={14} className="text-slate-500" /> Patient Summary
                        </h4>
                        <div className="grid grid-cols-[140px_1fr] gap-y-2 gap-x-4 text-xs font-medium">
                          <span className="text-slate-500">DOB</span>
                          <span className="font-medium text-slate-900 text-right">{task.summary.dob}</span>
                          
                          <span className="text-slate-500">PHN</span>
                          <span className="font-medium text-slate-900 text-right">{task.summary.phn}</span>
                          
                          <span className="text-slate-500">Condition</span>
                          <span className="font-medium text-slate-900 text-right">{task.condition}</span>
                          
                          <span className="text-slate-500">Surgeon</span>
                          <span className="font-medium text-slate-900 text-right">{task.summary.surgeon}</span>
                          
                          {activeSubTab === 'completed' && (
                            <>
                              <span className="text-slate-500">Triage Score</span>
                              <div className="flex items-center justify-end gap-2">
                                 {task.summary.triageScore !== "N/A" && task.summary.triageScore > 0 && (
                                   <span className={cn(
                                     "text-[10px] font-black px-1.5 py-0.5 rounded",
                                     task.summary.triageBand === 'High' ? "bg-red-100 text-red-700" :
                                     task.summary.triageBand === 'Medium' ? "bg-amber-100 text-amber-700" :
                                     "bg-green-100 text-green-700"
                                   )}>
                                     {task.summary.triageBand} 
                                   </span>
                                 )}
                                 <span className="font-bold text-slate-900">{task.summary.triageScore}</span>
                              </div>
                            </>
                          )}
                          
                          <div className="col-span-2 h-px bg-slate-200 my-2"></div>

                          <span className="text-slate-500">Pre-visit form</span>
                          {renderSummaryStatus(task.summary.preVisit)}
                          
                          <span className="text-slate-500">Patient confirmed</span>
                          {renderSummaryStatus(task.summary.patientConfirmed)}
                          
                          <span className="text-slate-500">Pre-charting</span>
                          {renderSummaryStatus(task.summary.preCharting)}
                          
                          <span className="text-slate-500">Chart review</span>
                          {renderSummaryStatus(task.summary.chartReview)}
                        </div>
                      </div>

                      {/* Col 2: Meds & History */}
                      <div className="space-y-6 lg:pl-6 lg:border-l border-slate-200 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 mt-6 lg:mt-0">
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Pill size={16} className="text-slate-500" /> Medications
                          </h4>
                          <ul className="text-[13px] text-slate-600 space-y-1">
                            {task.medications.map((m: string, i: number) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Shield size={16} className="text-slate-500" /> Allergies
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            {task.allergies.map((a: string, i: number) => (
                              <span key={i} className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Activity size={16} className="text-slate-500" /> Medical History
                          </h4>
                          <ul className="text-[13px] text-slate-600 space-y-1">
                            {task.history.map((h: string, i: number) => <li key={i}>{h}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Col 3: Actions (Hidden for Completed tab EXCEPT E-Advice) */}
                      {(activeSubTab !== 'completed' || activeTopTab === 'e-advice') && (
                        <div className="space-y-2 lg:pl-6 lg:border-l border-slate-200 flex flex-col items-stretch pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 mt-6 lg:mt-0">
                          {activeSubTab === 'completed' && activeTopTab === 'e-advice' ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <button 
                                onClick={() => setActiveForm({ type: 'e-advice', meetingId: task.meetingId, patientId: task.patientId, patientName: task.patientName, phn: task.summary.phn, dob: task.summary.dob, readOnly: true })}
                                className="flex items-center gap-2 py-1.5 px-3 bg-white border border-amber-200 text-amber-700 rounded-lg text-[11px] font-bold shadow-sm hover:bg-amber-50 transition-all group animate-in zoom-in-95 duration-200"
                              >
                                 <FileText size={14} className="text-amber-500" />
                                 View Advice
                              </button>
                            </div>
                          ) : activeTopTab === 'chart-review' ? (
                            <>
                              <button 
                                onClick={() => handleApproveChart(task.meetingId)}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1f64ad] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
                                <CheckCircle2 size={16} /> Approve Chart
                              </button>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                                <Shield size={16} className="text-slate-400" /> Flag for Review
                              </button>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                                <FileText size={16} className="text-slate-400" /> Download PDF
                              </button>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                                <ExternalLink size={16} className="text-slate-400" /> Launch Alberta Netcare
                              </button>
                            </>
                          ) : activeTopTab === 'e-advice' ? (
                            <>
                              <button
                                onClick={() => setActiveForm({ type: 'e-advice', meetingId: task.meetingId, patientId: task.patientId, patientName: task.patientName, phn: task.summary.phn, dob: task.summary.dob })}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#059669] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
                                <FileText size={16} /> Launch E-Advice
                              </button>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                                <ExternalLink size={16} className="text-slate-400" /> Launch Alberta Netcare
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => setActiveForm({ type: 'pre-chart', meetingId: task.meetingId, patientId: task.patientId, patientName: task.patientName, phn: task.summary.phn, dob: task.summary.dob })}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-[#1f64ad] rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-all">
                                <Activity size={16} /> Pre-Chart Review
                              </button>

                              <button 
                                onClick={() => setActiveForm({ type: 'charting', meetingId: task.meetingId, patientId: task.patientId, patientName: task.patientName, phn: task.summary.phn, dob: task.summary.dob })}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1f64ad] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
                                <FileText size={16} /> Open Charting
                              </button>
                            </>
                          )}
                          
                          {activeSubTab !== 'completed' && activeTopTab !== 'e-advice' && (
                            <>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                                <Stethoscope size={16} className="text-slate-400" /> Launch E-Consult
                              </button>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
                                <FileText size={16} className="text-slate-400" /> Launch Escalation
                              </button>
                              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all mt-auto border-t-2">
                                <Eye size={16} className="text-slate-400" /> Full Profile
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
              <div className="text-[11.5px] text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, currentTasks.length)}</span> of <span className="font-bold text-slate-900">{currentTasks.length}</span> results
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors h-8"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${
                      currentPage === page ? 'bg-[#1f64ad] text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors h-8"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Slide-over Form Drawer */}
        {activeForm && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end transition-opacity backdrop-blur-[2px]">
            <div className={`bg-[#f8fafc]/95 backdrop-blur-md w-full max-w-5xl h-full shadow-[0_0_120px_rgba(31,100,173,0.15)] flex flex-col border-l border-white/50 transition-all duration-700 ${
              isDrawerClosing 
                ? 'animate-out fade-out zoom-out-95 slide-out-to-right-40 duration-500 ease-in' 
                : 'animate-in fade-in zoom-in-95 slide-in-from-right-40 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
            }`}>
              <div className="py-3 px-6 bg-white/80 backdrop-blur-sm border-b border-slate-100 flex justify-between items-center shrink-0 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1f64ad]/20 to-transparent"></div>
                <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center border border-slate-100 shadow-sm transition-transform hover:rotate-3">
                    {activeForm.type === 'charting' ? (
                       <FileText className="text-[#1f64ad] w-6 h-6"/>
                    ) : activeForm.type === 'e-advice' ? (
                       <Activity className="text-amber-500 w-6 h-6"/>
                    ) : (
                       <Activity className="text-[#1f64ad] w-6 h-6"/>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="leading-none">
                      {activeForm.type === 'charting' ? "Clinical Charting" : 
                       activeForm.type === 'e-advice' ? "E-Advice Summary" : "Medical Review"}
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-80">Patient: {activeForm.patientName}</span>
                  </div>
                </h3>
                <button 
                  onClick={() => {
                    setIsDrawerClosing(true);
                    setTimeout(() => {
                      setActiveForm(null);
                      setIsDrawerClosing(false);
                    }, 500);
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                  title="Close"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
              
              {/* Form Content Area */}
              <div className="flex-1 overflow-y-auto w-full relative">
                {activeForm.type === 'charting' ? (
                    <ChartingPanel 
                       meetingId={activeForm.meetingId} 
                       patientId={activeForm.patientId}
                       patient={{name: activeForm.patientName, phn: activeForm.phn, dob: activeForm.dob}} 
                       readOnly={activeForm.readOnly}
                    />
                 ) : activeForm.type === 'e-advice' ? (
                    <EAdvicePanel 
                       meetingId={activeForm.meetingId} 
                       patientId={activeForm.patientId}
                       patient={{name: activeForm.patientName, phn: activeForm.phn, dob: activeForm.dob}} 
                       readOnly={activeForm.readOnly}
                    />
                 ) : (
                    <PreChartPanel 
                      meetingId={activeForm.meetingId} 
                      patientId={activeForm.patientId}
                      patient={{name: activeForm.patientName, phn: activeForm.phn, dob: activeForm.dob}} 
                      readOnly={activeForm.readOnly}
                    />
                 )}
              </div>
            </div>
          </div>
        )}
        
      </div>
    </ProviderLayout>
  );
}
