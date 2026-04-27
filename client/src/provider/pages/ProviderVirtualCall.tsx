import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MOCK_PATIENTS, type Patient } from "@/provider/lib/mockData";
import { MOCK_APPOINTMENTS } from "./ProviderAppointments";
import { PreChartPanel, ChartingPanel, EAdvicePanel, PatientFormPanel } from "../components/ClinicalPanels";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Maximize2,
  Minimize2,
  User,
  Pill,
  Shield,
  Activity,
  Clock,
  ClipboardCheck,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────

type CallTab = "form" | "pre-chart" | "charting" | "e-advice" | "chat" | "summary";
type CallMode = "zoom" | "voip";

const CALL_TABS: { key: CallTab; label: string }[] = [
  { key: "form",      label: "Form" },
  { key: "pre-chart", label: "Pre-ch" },
  { key: "charting",  label: "Chrt" },
  { key: "e-advice",  label: "E-ad" },
  { key: "chat",      label: "Chat" },
  { key: "summary",   label: "Summary" },
];

// ─── Live camera feed ─────────────────────────────────────────

function useCamera() {
  const streamRef = useRef<MediaStream | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(true);
  const [streamReady, setStreamReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setStreamReady(true);
      // Attach to video element if already mounted
      if (videoElRef.current) {
        videoElRef.current.srcObject = stream;
      }
    } catch {
      // Camera unavailable — fallback to placeholder
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreamReady(false);
  }, []);

  const toggleCamera = useCallback(() => {
    if (active) {
      streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = false; });
    } else {
      streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = true; });
    }
    setActive(!active);
  }, [active]);

  // Callback ref that attaches the stream whenever the video element (re-)mounts
  const attachStream = useCallback((el: HTMLVideoElement | null) => {
    videoElRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
    }
  }, [streamReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  return { attachStream, active, toggleCamera, stopCamera };
}

function CameraFeed({
  attachStream,
  cameraActive,
  label,
  small = false,
}: {
  attachStream: (el: HTMLVideoElement | null) => void;
  cameraActive: boolean;
  label: string;
  small?: boolean;
}) {
  return (
    <div className={cn(
      "bg-slate-800 rounded-lg relative overflow-hidden",
      small ? "w-44 h-32" : "w-full h-full min-h-[400px]"
    )}>
      {/* Main view — the patient (simulated avatar) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className={cn("rounded-full bg-slate-600 flex items-center justify-center", small ? "w-10 h-10" : "w-20 h-20")}>
          <User className={cn("text-slate-400", small ? "w-5 h-5" : "w-10 h-10")} />
        </div>
        <p className={cn("font-medium text-slate-300", small ? "text-xs" : "text-sm")}>{label}</p>
      </div>
      {/* Self-view inset — your real camera (only on the full-size view, not PIP) */}
      {!small && (
        <div className="absolute top-3 right-3 w-32 h-24 rounded-lg bg-slate-700 border border-slate-600 overflow-hidden shadow-lg">
          <video
            ref={attachStream}
            autoPlay
            playsInline
            muted
            className={cn(
              "absolute inset-0 w-full h-full object-cover scale-x-[-1]",
              !cameraActive && "hidden"
            )}
          />
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <div className="w-7 h-7 rounded-full bg-slate-500 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <p className="text-[10px] text-slate-400">You</p>
            </div>
          )}
          {cameraActive && (
            <p className="absolute bottom-1 left-1.5 text-[10px] text-white/70 font-medium drop-shadow">You</p>
          )}
        </div>
      )}
      {/* Connected indicator */}
      {!small && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-slate-400">Connected</span>
        </div>
      )}
    </div>
  );
}

// ─── Call controls bar ────────────────────────────────────────

function CallControls({
  onEnd,
  muted,
  onToggleMute,
  cameraActive,
  onToggleCamera,
  compact = false,
}: {
  onEnd: () => void;
  muted: boolean;
  onToggleMute: () => void;
  cameraActive: boolean;
  onToggleCamera: () => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center justify-center gap-3 bg-slate-900 rounded-lg",
      compact ? "py-1.5" : "py-3"
    )}>
      <button
        onClick={onToggleMute}
        className={cn(
          "rounded-full flex items-center justify-center transition-colors",
          compact ? "w-8 h-8" : "w-10 h-10",
          muted ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
        )}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <MicOff className={cn(compact ? "w-3.5 h-3.5" : "w-4 h-4")} /> : <Mic className={cn(compact ? "w-3.5 h-3.5" : "w-4 h-4")} />}
      </button>
      <button
        onClick={onToggleCamera}
        className={cn(
          "rounded-full flex items-center justify-center transition-colors",
          compact ? "w-8 h-8" : "w-10 h-10",
          !cameraActive ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
        )}
        aria-label={cameraActive ? "Turn camera off" : "Turn camera on"}
      >
        {!cameraActive ? <VideoOff className={cn(compact ? "w-3.5 h-3.5" : "w-4 h-4")} /> : <Video className={cn(compact ? "w-3.5 h-3.5" : "w-4 h-4")} />}
      </button>
      {!compact && (
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          aria-label="Share screen"
        >
          <Monitor className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={onEnd}
        className={cn(
          "rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-colors",
          compact ? "w-8 h-8" : "w-10 h-10"
        )}
        aria-label="End call"
      >
        <PhoneOff className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
      </button>
    </div>
  );
}

// ─── Tab content panels ───────────────────────────────────────

function TabContent({ tab, patient, apptId = "" }: { tab: CallTab; patient: Patient; apptId?: string }) {
  switch (tab) {
    case "form":      return <PatientFormPanel patient={patient} meetingId={apptId} patientId={patient.id} />;
    case "pre-chart": return <PreChartPanel patient={patient} meetingId={apptId} patientId={patient.id} />;
    case "charting":  return <ChartingPanel patient={patient} meetingId={apptId} patientId={patient.id} />;
    case "e-advice":  return <EAdvicePanel patient={patient} meetingId={apptId} patientId={patient.id} />;
    case "chat":      return <ChatPanel patient={patient} />;
    case "summary":   return <SummaryPanel patient={patient} />;
  }
}


interface ChatMessage {
  id: number;
  sender: "provider" | "patient";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "patient", text: "Hi Dr. Reynolds, I'm ready for the appointment.", time: "Just now" },
  { id: 2, sender: "provider", text: "Hello! Thanks for joining. I'll be reviewing your chart shortly.", time: "Just now" },
];

function ChatPanel({ patient }: { patient: Patient }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "provider",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate patient reply after a short delay
    setTimeout(() => {
      const replies = [
        "Thank you, doctor.",
        "I understand, I'll follow up on that.",
        "That makes sense. Any other instructions?",
        "Okay, I appreciate the update.",
        "Got it, thank you for explaining.",
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "patient",
          text: replies[Math.floor(Math.random() * replies.length)],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500 + Math.random() * 1500);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold font-display tracking-tight">Chat with {patient.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Messages are visible to the patient in real time.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.sender === "provider" ? "justify-end" : "justify-start")}
          >
            <div className={cn(
              "max-w-[75%] rounded-xl px-3.5 py-2.5",
              msg.sender === "provider"
                ? "bg-primary text-white rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            )}>
              <p className="text-sm">{msg.text}</p>
              <p className={cn(
                "text-[10px] mt-1",
                msg.sender === "provider" ? "text-white/60" : "text-muted-foreground"
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-md bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryPanel({ patient }: { patient: Patient }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-5 p-5 overflow-y-auto h-full">
      <h3 className="text-base font-semibold font-display tracking-tight">Visit Summary</h3>
      <div className="bg-muted/30 rounded-xl border border-border/50 p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{patient.name}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Condition</span><span className="font-medium">{patient.condition}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date().toLocaleDateString("en-CA")}</span></div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Visit Summary</label>
        <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" placeholder="Brief summary of the virtual visit..." />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Outcome / Next Steps</label>
        <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none" placeholder="Outcomes and next steps..." />
      </div>
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
            saved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" />Saved</> : "Save & Complete"}
        </button>
      </div>
    </div>
  );
}

// ─── VOIP call screen (simple phone call) ────────────────────

function VoipCallScreen({ apptId }: { apptId: string }) {
  const [, setLocation] = useLocation();
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [rightTab, setRightTab] = useState<CallTab>("form");
  const [leftTab, setLeftTab] = useState<CallTab | null>(null); // null = call panel on left
  const [leftDropHover, setLeftDropHover] = useState(false);

  const appt = MOCK_APPOINTMENTS.find(a => a.id === apptId);
  const patient = MOCK_PATIENTS.find(p => p.name === appt?.patientName) ?? MOCK_PATIENTS[0];

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  function handleEnd() {
    setLocation("/appointments");
  }

  // Drag handlers for tabs
  function handleDragStart(e: React.DragEvent, tab: CallTab) {
    e.dataTransfer.setData("text/plain", tab);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleLeftDrop(e: React.DragEvent) {
    e.preventDefault();
    setLeftDropHover(false);
    const tab = e.dataTransfer.getData("text/plain") as CallTab;
    if (tab && CALL_TABS.some(t => t.key === tab)) {
      setLeftTab(tab);
    }
  }

  function handleLeftDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setLeftDropHover(true);
  }

  function handleLeftDragLeave() {
    setLeftDropHover(false);
  }

  function restoreCallPanel() {
    setLeftTab(null);
  }

  const hasSplitContent = leftTab !== null;

  return (
    <div className="h-dvh flex flex-col bg-slate-950 text-foreground">
      {/* Top bar — patient info + tabs */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-2 min-w-0 flex-shrink">
          <span className="text-sm font-semibold text-white truncate">
            {appt?.patientName ?? "Patient"}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-sm text-slate-300 truncate">
            {appt?.reason ?? patient.condition}
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          {CALL_TABS.map((t) => (
            <button
              key={t.key}
              draggable
              onDragStart={(e) => handleDragStart(e, t.key)}
              onClick={() => setRightTab(t.key)}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-grab active:cursor-grabbing select-none",
                rightTab === t.key
                  ? "bg-primary text-white"
                  : leftTab === t.key
                    ? "bg-blue-800/40 text-blue-300 ring-1 ring-blue-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-600/20 text-emerald-400">
            VOIP
          </span>
          {hasSplitContent && (
            <button
              onClick={restoreCallPanel}
              className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Restore call panel"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left panel ── */}
        <div
          className={cn(
            "w-1/2 flex flex-col overflow-hidden relative transition-colors duration-150",
            !hasSplitContent && "bg-slate-900",
            leftDropHover && !hasSplitContent && "ring-2 ring-inset ring-primary/50 bg-slate-900/50 rounded-lg m-1"
          )}
          onDrop={handleLeftDrop}
          onDragOver={handleLeftDragOver}
          onDragLeave={handleLeftDragLeave}
        >
          {!hasSplitContent ? (
            <>
              {/* VOIP call panel on left */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-white font-display tracking-tight">
                    {appt?.patientName ?? "Patient"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{appt?.reason ?? "VOIP Call"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-slate-300">Connected</span>
                  <span className="text-slate-600 mx-1">·</span>
                  <span className="text-xs text-slate-400 font-mono">{timeStr}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 px-4 pb-6">
                <button
                  onClick={() => setMuted(!muted)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    muted ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  )}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleEnd}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
                  aria-label="End call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
              {/* Drop hint overlay */}
              {leftDropHover && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-lg z-10 pointer-events-none">
                  <div className="bg-slate-800 border border-primary/40 rounded-xl px-6 py-4 text-center shadow-lg">
                    <Minimize2 className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Drop to open here</p>
                    <p className="text-xs text-slate-400 mt-0.5">Call moves to compact bar</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 overflow-y-auto bg-background">
              <TabContent tab={leftTab} patient={patient} apptId={apptId} />
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="w-0.5 shrink-0 bg-black" />

        {/* ── Right panel ── */}
        <div className="w-1/2 flex flex-col bg-background overflow-hidden relative">
          <div className="flex-1 overflow-y-auto">
            <TabContent tab={rightTab} patient={patient} apptId={apptId} />
          </div>

          {/* Compact VOIP bar — only when split */}
          {hasSplitContent && (
            <div className="absolute bottom-4 right-4 z-10 rounded-xl overflow-hidden shadow-xl shadow-black/30 border border-slate-600 bg-slate-900">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{appt?.patientName ?? "Patient"}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-mono">{timeStr}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 px-4 pb-2.5">
                <button
                  onClick={() => setMuted(!muted)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    muted ? "bg-red-500/20 text-red-400" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  )}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleEnd}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-colors"
                  aria-label="End call"
                >
                  <PhoneOff className="w-3 h-3" />
                </button>
                <button
                  onClick={restoreCallPanel}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                  aria-label="Restore call panel"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main virtual call page ───────────────────────────────────

export default function ProviderVirtualCall({ apptId, mode }: { apptId: string; mode: CallMode }) {
  // VOIP = simple phone call
  if (mode === "voip") {
    return <VoipCallScreen apptId={apptId} />;
  }

  // Zoom = full video + charting split view
  return <ZoomCallScreen apptId={apptId} />;
}

function ZoomCallScreen({ apptId }: { apptId: string }) {
  const [, setLocation] = useLocation();
  const [rightTab, setRightTab] = useState<CallTab>("form");
  const [leftTab, setLeftTab] = useState<CallTab | null>(null); // null = camera on left
  const [muted, setMuted] = useState(false);
  const [leftDropHover, setLeftDropHover] = useState(false);
  const { attachStream, active: cameraActive, toggleCamera, stopCamera } = useCamera();

  const appt = MOCK_APPOINTMENTS.find(a => a.id === apptId);
  const patient = MOCK_PATIENTS.find(p => p.name === appt?.patientName) ?? MOCK_PATIENTS[0];

  function handleEndCall() {
    stopCamera();
    setLocation("/appointments");
  }

  // Drag handlers for tabs
  function handleDragStart(e: React.DragEvent, tab: CallTab) {
    e.dataTransfer.setData("text/plain", tab);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleLeftDrop(e: React.DragEvent) {
    e.preventDefault();
    setLeftDropHover(false);
    const tab = e.dataTransfer.getData("text/plain") as CallTab;
    if (tab && CALL_TABS.some(t => t.key === tab)) {
      setLeftTab(tab);
    }
  }

  function handleLeftDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setLeftDropHover(true);
  }

  function handleLeftDragLeave() {
    setLeftDropHover(false);
  }

  function restoreCamera() {
    setLeftTab(null);
  }

  const hasSplitContent = leftTab !== null;

  return (
    <div className="h-dvh flex flex-col bg-slate-950 text-foreground">
      {/* Top bar — patient info + tabs */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-2 min-w-0 flex-shrink">
          <span className="text-sm font-semibold text-white truncate">
            {appt?.patientName ?? "Patient"}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-sm text-slate-300 truncate">
            {appt?.reason ?? patient.condition}
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          {CALL_TABS.map((t) => (
            <button
              key={t.key}
              draggable
              onDragStart={(e) => handleDragStart(e, t.key)}
              onClick={() => setRightTab(t.key)}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-grab active:cursor-grabbing select-none",
                rightTab === t.key
                  ? "bg-primary text-white"
                  : leftTab === t.key
                    ? "bg-blue-800/40 text-blue-300 ring-1 ring-blue-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-400">
            Zoom
          </span>
          {hasSplitContent && (
            <button
              onClick={restoreCamera}
              className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Restore camera to full view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left panel ── */}
        <div
          className={cn(
            "w-1/2 flex flex-col overflow-hidden relative transition-colors duration-150",
            !hasSplitContent && "p-3 gap-3",
            leftDropHover && !hasSplitContent && "ring-2 ring-inset ring-primary/50 bg-slate-900/50 rounded-lg m-1"
          )}
          onDrop={handleLeftDrop}
          onDragOver={handleLeftDragOver}
          onDragLeave={handleLeftDragLeave}
        >
          {!hasSplitContent ? (
            <>
              {/* Camera on left */}
              <CameraFeed
                attachStream={attachStream}
                cameraActive={cameraActive}
                label={appt?.patientName ?? "Patient"}
              />
              <CallControls
                onEnd={handleEndCall}
                muted={muted}
                onToggleMute={() => setMuted(!muted)}
                cameraActive={cameraActive}
                onToggleCamera={toggleCamera}
              />
              {/* Drop hint overlay */}
              {leftDropHover && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-lg z-10 pointer-events-none">
                  <div className="bg-slate-800 border border-primary/40 rounded-xl px-6 py-4 text-center shadow-lg">
                    <Minimize2 className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Drop to open here</p>
                    <p className="text-xs text-slate-400 mt-0.5">Camera moves to PIP</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 overflow-y-auto bg-background">
              <TabContent tab={leftTab} patient={patient} apptId={apptId} />
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="w-0.5 shrink-0 bg-black" />

        {/* ── Right panel ── */}
        <div className="w-1/2 flex flex-col bg-background overflow-hidden relative">
          <div className="flex-1 overflow-y-auto">
            <TabContent tab={rightTab} patient={patient} apptId={apptId} />
          </div>

          {/* PIP camera — only when content is on left */}
          {hasSplitContent && (
            <div className="absolute bottom-4 right-4 z-10 rounded-xl overflow-hidden shadow-xl shadow-black/30 border border-slate-600 bg-slate-900">
              <div className="relative">
                <CameraFeed
                  attachStream={attachStream}
                  cameraActive={cameraActive}
                  label={appt?.patientName ?? "Patient"}
                  small
                />
                {/* Expand button overlay */}
                <button
                  onClick={restoreCamera}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                  aria-label="Restore camera"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
              <CallControls
                onEnd={handleEndCall}
                muted={muted}
                onToggleMute={() => setMuted(!muted)}
                cameraActive={cameraActive}
                onToggleCamera={toggleCamera}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
