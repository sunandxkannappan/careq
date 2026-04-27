import { useState, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { ProviderLayout } from "@/provider/components/ProviderLayout";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  isSameDay,
  isToday,
  getDay,
} from "date-fns";

// ─── Types ───────────────────────────────────────────────────

interface AvailabilitySlot {
  id: string;
  type: "one-time" | "weekly";
  /** ISO date string for one-time, or 0-6 (Sun-Sat) for weekly */
  dayKey: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
  /** Only for one-time — the specific date */
  date?: string;
  /** Only for weekly — day of week 0-6 */
  dayOfWeek?: number;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatHour(hour: number) {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

function formatTimeShort(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// ─── Time options for selects ────────────────────────────────

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

// ─── Default mock slots ─────────────────────────────────────

const DEFAULT_SLOTS: AvailabilitySlot[] = [];

// ─── Component ──────────────────────────────────────────────

export default function ProviderAvailability() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [slots, setSlots] = useState<AvailabilitySlot[]>(DEFAULT_SLOTS);
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Add form state
  const [addType, setAddType] = useState<"one-time" | "weekly">("one-time");
  const [addDate, setAddDate] = useState("");
  const [addDayOfWeek, setAddDayOfWeek] = useState(1);
  const [addStart, setAddStart] = useState("09:00");
  const [addEnd, setAddEnd] = useState("17:00");

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Dragging state for creating new slots by dragging on the grid
  const [dragging, setDragging] = useState(false);
  const [dragDayIdx, setDragDayIdx] = useState<number | null>(null);
  const [dragStartHour, setDragStartHour] = useState<number | null>(null);
  const [dragEndHour, setDragEndHour] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Preview selection — persists after drag ends while add panel is open
  const [previewDayIdx, setPreviewDayIdx] = useState<number | null>(null);
  const [previewStartHour, setPreviewStartHour] = useState<number | null>(null);
  const [previewEndHour, setPreviewEndHour] = useState<number | null>(null);

  const isThisWeek = isSameDay(weekStart, startOfWeek(new Date(), { weekStartsOn: 0 }));

  // Get slots that apply to a specific day
  function getSlotsForDay(day: Date): AvailabilitySlot[] {
    const dateStr = format(day, "yyyy-MM-dd");
    const dow = getDay(day);
    return slots.filter((s) => {
      if (s.type === "one-time") return s.date === dateStr;
      if (s.type === "weekly") return s.dayOfWeek === dow;
      return false;
    });
  }

  function openAdd(presetDate?: Date) {
    setAddType("one-time");
    setAddDate(presetDate ? format(presetDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
    setAddDayOfWeek(presetDate ? getDay(presetDate) : 1);
    setAddStart("09:00");
    setAddEnd("17:00");
    setShowAddPanel(true);
  }

  function handleAddSubmit() {
    const newSlot: AvailabilitySlot = {
      id: generateId(),
      type: addType,
      dayKey: addType === "one-time" ? `d-${addDate}` : `w-${addDayOfWeek}`,
      start: addStart,
      end: addEnd,
      ...(addType === "one-time" ? { date: addDate } : { dayOfWeek: addDayOfWeek }),
    };
    setSlots((prev) => [...prev, newSlot]);
    setShowAddPanel(false);
    clearPreview();
  }

  function clearPreview() {
    setPreviewDayIdx(null);
    setPreviewStartHour(null);
    setPreviewEndHour(null);
  }

  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  // ── Grid drag to create ──

  function handleCellMouseDown(dayIdx: number, hour: number) {
    setDragging(true);
    setDragDayIdx(dayIdx);
    setDragStartHour(hour);
    setDragEndHour(hour + 1);
  }

  function handleCellMouseEnter(dayIdx: number, hour: number) {
    if (!dragging || dayIdx !== dragDayIdx) return;
    if (dragStartHour === null) return;
    setDragEndHour(Math.max(hour + 1, dragStartHour + 1));
  }

  const handleMouseUp = useCallback(() => {
    if (dragging && dragDayIdx !== null && dragStartHour !== null && dragEndHour !== null) {
      const day = weekDays[dragDayIdx];
      const startStr = `${String(dragStartHour).padStart(2, "0")}:00`;
      const endStr = `${String(dragEndHour).padStart(2, "0")}:00`;

      // Save selection as preview so it stays visible
      setPreviewDayIdx(dragDayIdx);
      setPreviewStartHour(dragStartHour);
      setPreviewEndHour(dragEndHour);

      // Pre-fill the add panel
      setAddType("one-time");
      setAddDate(format(day, "yyyy-MM-dd"));
      setAddDayOfWeek(getDay(day));
      setAddStart(startStr);
      setAddEnd(endStr);
      setShowAddPanel(true);
    }
    setDragging(false);
    setDragDayIdx(null);
    setDragStartHour(null);
    setDragEndHour(null);
  }, [dragging, dragDayIdx, dragStartHour, dragEndHour, weekDays]);

  // Format the week range header
  const weekRangeStr = (() => {
    const s = weekStart;
    const e = weekEnd;
    if (s.getMonth() === e.getMonth()) {
      return `${format(s, "MMMM d")} – ${format(e, "d yyyy")}`;
    }
    return `${format(s, "MMM d")} – ${format(e, "MMM d yyyy")}`;
  })();

  return (
    <ProviderLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
          Availability
        </h1>
        <p className="text-base text-muted-foreground mt-1.5 font-light">
          Manage your available time slots. Drag on the calendar or use the Add button.
        </p>
      </div>

      {/* Week nav bar */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setWeekStart(subWeeks(weekStart, 1))}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold font-display tracking-tight min-w-0">
          {weekRangeStr}
        </h2>
        <button
          onClick={() => setWeekStart(addWeeks(weekStart, 1))}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {!isThisWeek && (
          <button
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-1"
          >
            This week
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={() => openAdd()} className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Calendar + Add panel wrapper */}
      <div className="flex gap-4 items-start">
        {/* ── Weekly calendar grid ── */}
        <div
          className={cn(
            "bg-card rounded-xl border border-border shadow-sm overflow-hidden flex-1 min-w-0",
            showAddPanel && "max-w-[calc(100%-380px)]"
          )}
        >
          <div
            ref={gridRef}
            className="overflow-x-auto"
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (dragging) handleMouseUp();
            }}
          >
            <table className="w-full border-collapse" style={{ minWidth: 700 }}>
              {/* Column headers */}
              <thead className="sticky top-0 z-10 bg-card">
                <tr>
                  <th className="w-[72px] min-w-[72px] border-b border-r border-border" />
                  {weekDays.map((day, i) => {
                    const today = isToday(day);
                    return (
                      <th
                        key={i}
                        className={cn(
                          "border-b border-border text-center py-2.5 px-1 text-sm font-medium",
                          today ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        <span className={cn(today && "font-semibold")}>
                          {DAY_NAMES[getDay(day)]} {format(day, "M/d")}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour) => (
                  <tr key={hour}>
                    {/* Time label */}
                    <td className="border-r border-border text-right pr-3 py-0 align-top w-[72px] min-w-[72px]">
                      <span className="text-xs text-muted-foreground font-medium leading-none relative -top-2">
                        {formatHour(hour)}
                      </span>
                    </td>
                    {/* Day cells */}
                    {weekDays.map((day, dayIdx) => {
                      const daySlots = getSlotsForDay(day);
                      // Active drag overlay — show from the start cell
                      const isDragStart =
                        dragging &&
                        dragDayIdx === dayIdx &&
                        dragStartHour !== null &&
                        dragEndHour !== null &&
                        hour === dragStartHour;

                      // Preview overlay — persists while add panel is open (only when not actively dragging)
                      const isPreviewStart =
                        !dragging &&
                        previewDayIdx === dayIdx &&
                        previewStartHour !== null &&
                        previewEndHour !== null &&
                        hour === previewStartHour;

                      // Which overlay to show on this cell?
                      const overlayStart = isDragStart ? dragStartHour : isPreviewStart ? previewStartHour : null;
                      const overlayEnd = isDragStart ? dragEndHour : isPreviewStart ? previewEndHour : null;

                      // Find slots that start at this hour
                      const slotsHere = daySlots.filter((s) => {
                        const startH = timeToMinutes(s.start) / 60;
                        return Math.floor(startH) === hour;
                      });

                      return (
                        <td
                          key={dayIdx}
                          className={cn(
                            "border-b border-r border-border relative h-[34px] cursor-crosshair select-none",
                            dayIdx === 6 && "border-r-0",
                          )}
                          onMouseDown={() => handleCellMouseDown(dayIdx, hour)}
                          onMouseEnter={() => handleCellMouseEnter(dayIdx, hour)}
                        >
                          {/* Selection overlay — active drag or persistent preview */}
                          {overlayStart !== null && overlayEnd !== null && (
                            <div
                              className="absolute left-0.5 right-0.5 rounded-md bg-primary/15 border-2 border-primary/40 z-[3] pointer-events-none flex items-start px-1.5 pt-1"
                              style={{ top: 0, height: `${(overlayEnd - overlayStart) * 34}px` }}
                            >
                              <span className="text-[11px] font-semibold text-primary">
                                {formatTimeShort(`${String(overlayStart).padStart(2, "0")}:00`)} – {formatTimeShort(`${String(overlayEnd).padStart(2, "0")}:00`)}
                              </span>
                            </div>
                          )}
                          {/* Render availability blocks that start at this hour */}
                          {slotsHere.map((slot) => {
                            const startMin = timeToMinutes(slot.start);
                            const endMin = timeToMinutes(slot.end);
                            const durationHours = (endMin - startMin) / 60;
                            const offsetMin = startMin - hour * 60;
                            const topPct = (offsetMin / 60) * 100;

                            return (
                              <div
                                key={slot.id}
                                className={cn(
                                  "absolute left-0.5 right-0.5 rounded-md px-1.5 py-1 text-[11px] font-medium overflow-hidden z-[2] cursor-pointer group",
                                  slot.type === "weekly"
                                    ? "bg-blue-100 border border-blue-200 text-blue-700"
                                    : "bg-green-100 border border-green-200 text-green-700"
                                )}
                                style={{
                                  top: `${topPct}%`,
                                  height: `${durationHours * 34}px`,
                                  minHeight: 20,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <div className="min-w-0 truncate">
                                    <span>{formatTimeShort(slot.start)} – {formatTimeShort(slot.end)}</span>
                                    {slot.type === "weekly" && (
                                      <Repeat className="w-2.5 h-2.5 inline ml-1 opacity-60" />
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeSlot(slot.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 rounded hover:bg-black/10 transition-opacity"
                                    aria-label="Remove slot"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Add availability panel ── */}
        {showAddPanel && (
          <div className="w-[360px] shrink-0 bg-card rounded-xl border border-border shadow-sm p-6 lg:sticky lg:top-[72px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold font-display tracking-tight">Add availability</h3>
              <button
                onClick={() => { setShowAddPanel(false); clearPreview(); }}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Frequency */}
              <div>
                <label className="text-sm font-medium block mb-2">Frequency</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="freq"
                      checked={addType === "one-time"}
                      onChange={() => setAddType("one-time")}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">One-time availability</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="freq"
                      checked={addType === "weekly"}
                      onChange={() => setAddType("weekly")}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Weekly availability</span>
                  </label>
                </div>
              </div>

              {/* Date / Day of week */}
              {addType === "one-time" ? (
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Date <span className="text-destructive">*</span>
                  </label>
                  <DatePicker value={addDate} onChange={setAddDate} placeholder="Select date" className="h-9 text-sm" />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Day of week <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={addDayOfWeek}
                    onChange={(e) => setAddDayOfWeek(Number(e.target.value))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {DAY_NAMES.map((name, i) => (
                      <option key={i} value={i}>{name === "Sun" ? "Sunday" : name === "Mon" ? "Monday" : name === "Tue" ? "Tuesday" : name === "Wed" ? "Wednesday" : name === "Thu" ? "Thursday" : name === "Fri" ? "Friday" : "Saturday"}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Start / End time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Start time</label>
                  <select
                    value={addStart}
                    onChange={(e) => setAddStart(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{formatTimeShort(t)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">End time</label>
                  <select
                    value={addEnd}
                    onChange={(e) => setAddEnd(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {TIME_OPTIONS.filter((t) => t > addStart).map((t) => (
                      <option key={t} value={t}>{formatTimeShort(t)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleAddSubmit}
                className="w-full gap-2"
                disabled={addType === "one-time" && !addDate}
              >
                Add {addType === "one-time" ? "one-time" : "weekly"} availability
              </Button>
            </div>

            {/* Existing slots legend */}
            <div className="mt-6 pt-5 border-t border-border space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legend</p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" />
                <span className="text-xs text-muted-foreground">One-time Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200" />
                <span className="text-xs text-muted-foreground">Recurring Availability</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
}
