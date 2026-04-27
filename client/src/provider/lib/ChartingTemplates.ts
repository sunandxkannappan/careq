export const PRE_CHARTING_TEMPLATE = {
  template_name: "provider-pre-charting",
  title: "Provider Pre-Charting Form",
  timing: "Completed by the care team (nurse and/or physician) prior to the appointment, based on chart review",
  sections: [
    {
      id: "part1",
      title: "Part 1 — Patient Summary (Nurse)",
      fields: [
        { id: "patientName", label: "Patient name", type: "text" },
        { id: "phn", label: "PHN", type: "text" },
        { id: "apptDate", label: "Appointment date", type: "date" },
        { id: "apptType", label: "Appointment type", type: "radio", options: ["Virtual", "In-person"] },
        { id: "jointUnderReview", label: "Joint under review", type: "radio", options: ["Left Hip", "Right Hip", "Left Knee", "Right Knee"] },
        { id: "apptNumber", label: "Appointment number in CareQ pathway", type: "radio", options: ["Initial", "3-month", "6-month", "9-month", "12-month", "Pre-surgical", "Other"], subFields: { Other: [{id: "otherApptNumber", label: "Specify", type: "text"}] } },
        { id: "interpreter", label: "Interpreter required?", type: "radio", options: ["No", "Yes"], subFields: { Yes: [{id: "language", label: "Language", type: "text"}] } },
        { id: "supportPerson", label: "Support person attending?", type: "radio", options: ["No", "Yes"] }
      ]
    },
    {
      id: "part2",
      title: "Part 2 — Vital Signs & Anthropometrics (Nurse)",
      fields: [
        { id: "height", label: "Height (cm)", type: "text" },
        { id: "weight", label: "Weight (kg)", type: "text" },
        { id: "bmi", label: "BMI", type: "text" },
        { id: "bp", label: "Blood Pressure (mmHg)", type: "text" },
        { id: "hr", label: "Heart Rate (bpm)", type: "text" },
        { id: "temp", label: "Temperature (°C)", type: "text" },
        { id: "o2", label: "Oxygen Saturation (%)", type: "text" },
        { id: "painRest", label: "Pain score at rest (0-10)", type: "scale", min: 0, max: 10 },
        { id: "painMove", label: "Pain score with movement (0-10)", type: "scale", min: 0, max: 10 },
        { id: "mobilityAid", label: "Mobility aid observed", type: "radio", options: ["None", "Single cane", "Bilateral canes", "Crutch(es)", "Walker", "Wheelchair"] }
      ]
    },
    {
      id: "part3",
      title: "Part 3 — Medication Reconciliation (Nurse)",
      fields: [
        { id: "medsReviewed", label: "Medications reviewed against last visit record?", type: "radio", options: ["Yes", "No"] },
        { id: "medChanges", label: "Any changes since last visit?", type: "radio", options: ["No changes", "Yes - document below"] },
        { id: "opioid", label: "Is patient currently on opioid analgesia?", type: "radio", options: ["No", "Yes"], subFields: { Yes: [{id: "painControl", label: "If yes, is pain adequately controlled?", type: "radio", options: ["Yes", "Partial", "No - flag for physician"]}] } },
        { id: "allergyStatus", label: "Allergy status confirmed?", type: "radio", options: ["Confirmed unchanged", "Updated - new allergy"], subFields: { "Updated - new allergy": [{id: "newAllergy", label: "New allergy", type: "text"}] } }
      ]
    },
    {
      id: "part4",
      title: "Part 4 — Pre-Appointment Check-In Review (Nurse)",
      fields: [
        { id: "patientCompleted", label: "Patient completed pre-appointment check-in?", type: "radio", options: ["Yes", "No - nurse to complete verbally"] },
        { id: "symptomChange", label: "Symptom change since last visit (from check-in form)", type: "radio", options: ["Improved", "Stable", "Worsened", "Significantly worsened - flag for physician"] },
        { id: "redFlags", label: "Red flag symptoms reported by patient?", type: "radio", options: ["None", "Yes"], subFields: { Yes: [{id: "redFlagDetails", label: "Specify", type: "text"}] } },
        { id: "falls", label: "Fall in past month?", type: "radio", options: ["No", "Yes"], subFields: { Yes: [{id: "fallCount", label: "Number", type: "text"}] } },
        { id: "agenda", label: "Patient's stated agenda for today's appointment", type: "textarea" }
      ]
    },
    {
      id: "part5",
      title: "Part 5 — Chart Review Summary (Nurse / Physician)",
      fields: [
        { id: "imagingList", label: "Most recent imaging on file", type: "textarea" },
        { id: "triageScore", label: "Most recent triage score", type: "text" },
        { id: "waitlistStatus", label: "Current waitlist status", type: "radio", options: ["Not yet listed", "Waitlisted", "Booked", "Other"], subFields: { Other: [{id: "otherWaitlist", label: "Specify", type: "text"}] } },
        { id: "outstandingInvest", label: "Outstanding investigations or referrals", type: "textarea" },
        { id: "outstandingActions", label: "Outstanding actions from last visit", type: "textarea" }
      ]
    },
    {
      id: "part6",
      title: "Part 6 — Physician Pre-Chart Notes",
      fields: [
        { id: "physicianKeyIssues", label: "Key issues to address today", type: "textarea" },
        { id: "plannedDecisions", label: "Planned clinical decisions for this visit", type: "checkbox", options: ["Continue current management plan", "Adjust medications", "Order new investigations", "Refer to additional services", "Re-triage / reassess waitlist status", "Discuss surgical readiness", "Other"] },
        { id: "escalationConcerns", label: "Any escalation concerns prior to appointment?", type: "radio", options: ["None", "Yes"], subFields: { Yes: [{id: "escalationSpecify", label: "Specify", type: "text"}] } }
      ]
    }
  ]
};

export const DURING_APPT_TEMPLATE = {
  template_name: "provider-during-appt",
  title: "Provider During-Appointment Form",
  timing: "Completed by nurse and physician during the appointment",
  sections: [
    {
      id: "part1",
      title: "Part 1 — Appointment Opening (Nurse)",
      fields: [
        { id: "patientAttended", label: "Patient attended?", type: "radio", options: ["Yes", "No - did not attend (DNA)", "Late"] },
        { id: "supportPresent", label: "Support person present?", type: "radio", options: ["No", "Yes"] },
        { id: "interpreterUsed", label: "Interpreter used?", type: "radio", options: ["No", "Yes"] },
        { id: "consentConfirmed", label: "Patient consent confirmed for this visit?", type: "radio", options: ["Yes", "No"] }
      ]
    },
    {
      id: "part2a",
      title: "Part 2A — Triage: Pain & Symptoms (30 pts)",
      fields: [
        { id: "triageA1", label: "Usual pain severity", type: "radio", options: ["None", "Very mild", "Mild", "Moderate", "Severe", "Extreme"] },
        { id: "triageA2", label: "Pain on walking / weight-bearing", type: "radio", options: ["None", "Very mild", "Mild", "Moderate", "Severe", "Extreme"] },
        { id: "triageA3", label: "Pain at rest (sitting/lying)", type: "radio", options: ["None", "Very mild", "Mild", "Moderate", "Severe", "Extreme"] },
        { id: "triageA4", label: "Night pain frequency", type: "radio", options: ["Never", "1–2 nights/month", "Some nights", "Most nights", "Every night", "Every night + wakes"] },
        { id: "triageA5", label: "Sudden/sharp pain episodes", type: "radio", options: ["Never", "1–2x/month", "1–2x/week", "Most days", "Daily", "Constant"] },
        { id: "triageA6", label: "Morning stiffness severity", type: "radio", options: ["None", "Very mild", "Mild", "Moderate", "Severe", "Extreme"] }
      ]
    },
    {
      id: "part2b",
      title: "Part 2B — Triage: Functional Impact (30 pts)",
      fields: [
        { id: "triageB1", label: "Walking capacity before severe pain", type: "radio", options: ["Unlimited", ">30 min", "16–30 min", "6–15 min", "<5 min", "Housebound"] },
        { id: "triageB2", label: "Stair climbing", type: "radio", options: ["No difficulty", "Very slight", "Slight", "Moderate", "Severe", "Unable"] },
        { id: "triageB3", label: "Rising from seated position", type: "radio", options: ["No difficulty", "Very slight", "Slight", "Moderate", "Severe", "Unable"] },
        { id: "triageB4", label: "Personal care (washing/dressing)", type: "radio", options: ["No difficulty", "Very slight", "Slight", "Moderate", "Severe", "Unable"] },
        { id: "triageB5", label: "Shopping / community activities", type: "radio", options: ["No difficulty", "Very slight", "Slight", "Moderate", "Severe", "Unable"] },
        { id: "triageB6", label: "Work / role impact", type: "radio", options: ["Not at all", "Very slight", "Slight", "Moderate", "Greatly", "Totally"] }
      ]
    },
    {
      id: "part2c",
      title: "Part 2C — Triage: Quality of Life (15 pts)",
      fields: [
        { id: "triageC1", label: "Overall health rating today", type: "radio", options: ["Excellent", "Very good", "Good", "Fair", "Poor", "Very poor"] },
        { id: "triageC2", label: "Emotional impact / anxiety related to joint", type: "radio", options: ["None", "Very slight", "Slight", "Moderate", "Severe", "Overwhelming"] },
        { id: "triageC3", label: "Degree of lifestyle modification due to joint", type: "radio", options: ["None", "Very slight", "Slight", "Moderate", "Major", "Complete"] }
      ]
    },
    {
      id: "part2d",
      title: "Part 2D — Triage: Attempted Management (15 pts)",
      fields: [
        { id: "triageD1", label: "Conservative treatments tried (physio, NSAIDs, injections, weight loss)", type: "radio", options: ["None tried", "1 Tried", "2 Tried", "3+ Tried"] },
        { id: "triageD2", label: "Duration of conservative management", type: "radio", options: ["None", "<3 months", "3–6 months", "6–12 months", ">12 months"] },
        { id: "triageD3", label: "Response to conservative management", type: "radio", options: ["Good relief", "Some relief", "Minimal relief", "No relief"] }
      ]
    },
    {
      id: "part2e",
      title: "Part 2E — Triage: Patient Readiness (10 pts)",
      fields: [
        { id: "triageE1", label: "Interest in surgical treatment", type: "radio", options: ["Not interested", "Uncertain", "Somewhat", "Strongly"] },
        { id: "triageE2", label: "Logistical readiness", type: "radio", options: ["No barriers", "Minor barriers", "Significant barriers"] }
      ]
    },
    {
      id: "part3",
      title: "Part 3 — Nurse Assessment",
      fields: [
        { id: "painRestToday", label: "Current pain score at rest (0-10)", type: "scale", min: 0, max: 10 },
        { id: "painMoveToday", label: "Current pain score with movement (0-10)", type: "scale", min: 0, max: 10 },
        { id: "observedGait", label: "Observed gait on arrival", type: "radio", options: ["Normal", "Antalgic", "Severely impaired", "Non-weight-bearing", "Not observed (virtual)"] },
        { id: "mobilityAidToday", label: "Mobility aid in use today", type: "radio", options: ["None", "Cane", "Crutch(es)", "Walker", "Wheelchair"] },
        { id: "patientAffect", label: "Patient affect and engagement", type: "radio", options: ["Engaged and cooperative", "Anxious or distressed", "Confused or disoriented", "Other"] },
        { id: "safetyConcerns", label: "Any immediate safety concerns?", type: "radio", options: ["None", "Yes - describe and escalate"], subFields: { "Yes - describe and escalate": [{id: "safetyDescribe", label: "Describe", type: "text"}] } },
        { id: "nurseNotes", label: "Nurse notes", type: "textarea" }
      ]
    },
    {
      id: "part4",
      title: "Part 4 — Interval History (Physician)",
      fields: [
        { id: "intervalMonths", label: "Interval since last visit (months)", type: "text" },
        { id: "overallTrajectory", label: "Overall symptom trajectory since last visit", type: "radio", options: ["Significantly improved", "Slightly improved", "Stable", "Slightly worsened", "Significantly worsened"] },
        { id: "primaryComplaint", label: "Patient's primary complaint today", type: "textarea" },
        { id: "newSympPhysician", label: "New symptoms since last visit?", type: "radio", options: ["None", "Yes - describe"], subFields: { "Yes - describe": [{id: "newSympDescribe", label: "Describe", type: "text"}] } },
        { id: "painCharacteristics", label: "Pain characteristics (location, quality, radiation, factors)", type: "textarea" },
        { id: "functionalNarrative", label: "Functional status narrative", type: "textarea" }
      ]
    },
    {
      id: "part5",
      title: "Part 5 — Physical Examination (Physician)",
      fields: [
        { id: "examPerformed", label: "Examination performed", type: "radio", options: ["Full in-person", "Partial remote (video)", "Not assessed"] },
        { id: "gaitExam", label: "Gait assessment", type: "radio", options: ["Normal", "Antalgic", "Trendelenburg (hip)", "Severely impaired", "Not assessed"] },
        { id: "romFlexion", label: "Flexion (°)", type: "text" },
        { id: "romExtension", label: "Extension (°)", type: "text" },
        { id: "jointStability", label: "Joint stability", type: "textarea" },
        { id: "specialTests", label: "Special tests performed", type: "checkbox", options: ["FABER", "FADIR", "McMurray", "Lachman", "Other"] },
        { id: "examNotes", label: "Examination notes", type: "textarea" }
      ]
    },
    {
      id: "part6",
      title: "Part 6 — Imaging & Investigation Review (Physician)",
      fields: [
        { id: "imagingReviewed", label: "Imaging reviewed this visit?", type: "radio", options: ["Yes", "No", "Not available"] },
        { id: "imagingType", label: "Imaging type reviewed", type: "checkbox", options: ["X-ray", "MRI", "CT", "Ultrasound"] },
        { id: "oaGrade", label: "Kellgren-Lawrence / OA grade", type: "radio", options: ["Grade 0 - Normal", "Grade 1 - Doubtful", "Grade 2 - Mild", "Grade 3 - Moderate", "Grade 4 - Severe"] },
        { id: "imagingFindings", label: "Key imaging findings", type: "textarea" },
        { id: "newImaging", label: "New imaging ordered?", type: "radio", options: ["No", "Yes"] }
      ]
    },
    {
      id: "part7",
      title: "Part 7 — Triage & Waitlist Decision (Physician)",
      fields: [
        { id: "triageUpdated", label: "Triage score updated this visit?", type: "radio", options: ["Yes", "No"] },
        { id: "updatedTriageScore", label: "Updated triage score (/100)", type: "text" },
        { id: "triageBand", label: "Triage Band", type: "radio", options: ["High", "Medium", "Low"] },
        { id: "waitlistStatusDir", label: "Waitlist status change?", type: "radio", options: ["No change", "Added to waitlist", "Moved up", "Moved down", "Removed"] },
        { id: "surgReadiness", label: "Patient's current surgical interest", type: "radio", options: ["Strongly interested", "Somewhat interested", "Uncertain", "Not interested"] }
      ]
    },
    {
      id: "part8",
      title: "Part 8 — Assessment & Plan (Physician)",
      fields: [
        { id: "assessment", label: "Clinical Assessment / Diagnosis", type: "textarea", placeholder: "Describe the patient's condition and diagnosis...", required: true },
        { id: "clinicalPlan", label: "Plan", type: "textarea", placeholder: "Plan...", required: true }
      ]
    },
    {
      id: "part8b",
      title: "Care Plan",
      fields: [
        { id: "planMedications", label: "Medications", type: "text", placeholder: "Medications plan..." },
        { id: "planPhysio", label: "Physiotherapy", type: "text", placeholder: "Physiotherapy plan..." },
        { id: "planImaging", label: "Imaging", type: "text", placeholder: "Imaging plan..." },
        { id: "planLabs", label: "Labs", type: "text", placeholder: "Labs plan..." },
        { id: "planFollowup", label: "Follow-up", type: "text", placeholder: "Follow-up plan..." },
        { id: "planReferrals", label: "Referrals", type: "text", placeholder: "Referrals plan..." }
      ]
    },
    {
      id: "part9",
      title: "Part 9 — Follow-Up & Closing",
      fields: [
        { id: "nextAppt", label: "Next appointment scheduled?", type: "radio", options: ["Yes", "No"] },
        { id: "visitSummaryShared", label: "Visit summary to be sent to patient?", type: "radio", options: ["Yes", "No"] },
        { id: "reqComm", label: "Communication to referring / family physician required?", type: "radio", options: ["No", "Yes"] }
      ]
    }
  ]
};

export const PRE_VISIT_TEMPLATE = {
  template_name: "pre-appointment-check-in",
  title: "Instrument 2: Pre-Appointment Check-In Form",
  timing: "Completed by patient 24-48 hours before each scheduled appointment.",
  sections: [
    {
      id: "part1",
      title: "Part 1 — Appointment Confirmation",
      fields: [
        { id: "appointmentDate", label: "Upcoming appointment date", type: "date", required: true },
        { id: "appointmentType", label: "Appointment type", type: "radio", options: ["Virtual", "In-person"], required: true },
        { id: "confirmAttendance", label: "Do you confirm you are able to attend this appointment?", type: "radio", options: ["Yes", "No — I need to reschedule"], required: true },
        { id: "interpreterRequired", label: "Do you require an interpreter for this appointment?", type: "radio", options: ["No", "Yes"], subFields: { Yes: [{ id: "language", label: "language", type: "text" }] } },
        { id: "caregiverJoining", label: "Will a caregiver or support person be joining you?", type: "radio", options: ["No", "Yes"], required: true }
      ]
    },
    {
      id: "part2",
      title: "Part 2 — Symptom Update Since Last Visit",
      fields: [
        { id: "jointAssessed", label: "Joint being assessed today", type: "radio", options: ["Left Hip", "Right Hip", "Left Knee", "Right Knee"], required: true },
        { id: "symptomChange", label: "Since your last appointment, how have your symptoms changed overall?", type: "radio", options: ["Significantly improved", "Slightly improved", "No change", "Slightly worse", "Significantly worse"], required: true },
        { id: "painRest", label: "Current pain level at rest (0-10)", type: "scale", min: 0, max: 10 },
        { id: "painActivity", label: "Current pain level with activity (0-10)", type: "scale", min: 0, max: 10 },
        { id: "newSymptoms", label: "Have you had any of the following since your last appointment? (tick all that apply)", type: "checkbox", options: [
          "Sudden significant increase in pain", "New swelling or redness in the joint", "Joint giving way or locking", 
          "Fall related to the joint", "New difficulty walking or bearing weight", 
          "New neurological symptoms (numbness, tingling, weakness)", "Fever or chills", "None of the above"
        ]},
        { id: "symptomDescription", label: "If you ticked any of the above, please describe briefly", type: "textarea" }
      ]
    },
    {
      id: "part3",
      title: "Part 3 — Medication & Treatment Changes",
      fields: [
        { id: "painMedication", label: "Are you currently taking pain medication for this joint?", type: "radio", options: ["No", "Over-the-counter", "Prescription (non-opioid)", "Prescription opioid"], required: true },
        { id: "medEffectiveness", label: "If taking medication, is it providing adequate pain control?", type: "radio", options: ["Yes", "Partial relief", "No — inadequate despite current dose"] },
        { id: "newTreatments", label: "Have you started any new treatments since your last visit?", type: "radio", options: ["No", "Yes"], subFields: { Yes: [{ id: "treatmentDescription", label: "Please describe", type: "textarea" }] } }
      ]
    },
    {
      id: "part4",
      title: "Part 4 — Functional Status Update",
      fields: [
        { id: "dailyActivityAbility", label: "Compared to your last appointment, your ability to perform daily activities is:", type: "radio", options: ["Better", "About the same", "Worse"], required: true },
        { id: "walkingAbility", label: "Are you currently able to walk outside your home?", type: "radio", options: ["Yes, without difficulty", "Yes, with difficulty", "No, housebound"], required: true }
      ]
    },
    {
      id: "part5",
      title: "Part 5 — Questions & Agenda for Today’s Appointment",
      fields: [
        { id: "mainConcern", label: "What is the main thing you would like to address in today’s appointment?", type: "textarea" },
        { id: "specificQuestions", label: "Do you have any specific questions for your care team today?", type: "textarea" },
        { id: "additionalInfo", label: "Is there anything else you would like your care team to know before the appointment?", type: "textarea" }
      ]
    },
    {
      id: "part6",
      title: "Part 6 — Technical Check-In (Virtual Appointments Only)",
      fields: [
        { id: "techTesting", label: "Have you tested your device, camera, and microphone for this appointment?", type: "radio", options: ["Yes, everything is working", "No, I need help", "Not applicable (in-person)"], required: true },
        { id: "deviceType", label: "What device will you be using?", type: "radio", options: ["Smartphone", "Tablet", "Laptop / Computer", "Other"], subFields: { Other: [{ id: "otherDevice", label: "Other device", type: "text" }] } },
        { id: "privacy", label: "Do you have a private, quiet space available for this appointment?", type: "radio", options: ["Yes", "No — I may have limited privacy"] }
      ]
    }
  ]
};
