# AI Contract Generation - User Testing Guide

## 🎯 Purpose
This guide provides a comprehensive walkthrough of the AI contract template matching and generation interface designed for user experience testing with procurement professionals.

---

## 📊 Test Scenario: Sourcing Events with Mixed Template Availability

### **Scenario Overview**
The interface demonstrates how the system handles:
1. Events WITH existing templates (immediate match)
2. Events WITHOUT templates (AI generation required)

---

## 🔍 **Sample Sourcing Events for Testing**

### **Events WITH Templates (Shows Green Success)**

#### 1. **Solar Farm - 100 MW Installation**
```
Event ID: SE-2025-001
Category: Renewable Energy
Value: Rp 1.25 Trillion
Status: In Progress

AI Check Result: ✓ Template Available
Template Match: "Solar Power Purchase Agreement - 100MW Installation"
Confidence: 92%
Action: "View & Use Template" button
```

#### 2. **Wind Turbine Procurement**
```
Event ID: SE-2025-002
Category: Renewable Energy
Value: Rp 890 Billion
Status: In Progress

AI Check Result: ✓ Template Available
Template Match: "Wind Energy EPC Contract - Onshore Wind Farm"
Confidence: 88%
Action: "View & Use Template" button
```

#### 3. **Battery Energy Storage**
```
Event ID: SE-2025-003
Category: Energy Storage
Value: Rp 450 Billion
Status: Published

AI Check Result: ✓ Template Available
Template Match: "Battery Energy Storage System Agreement"
Confidence: 91%
Action: "View & Use Template" button
```

#### 4. **Hydroelectric Modernization**
```
Event ID: SE-2025-004
Category: Hydro Power
Value: Rp 320 Billion
Status: Draft

AI Check Result: ✓ Template Available
Template Match: "Hydroelectric Facility Upgrade Contract"
Confidence: 86%
Action: "View & Use Template" button
```

---

### **Events WITHOUT Templates (Shows Orange Alert + AI Generation)**

#### 5. **Corporate Office Furniture Procurement** ⭐ PRIMARY TEST EVENT
```
Event ID: SE-2025-009
Category: Office Supplies
Value: Rp 850 Million
Status: Draft
Deadline: June 15, 2025

Description:
Bulk procurement of ergonomic office chairs, height-adjustable desks,
computer workstations, filing cabinets, and meeting room furniture for
500-person capacity new headquarters building.

Key Requirements:
• Ergonomic office chairs with lumbar support (500 units)
• Height-adjustable standing desks (500 units)
• Computer workstations with cable management (500 units)
• Mobile filing cabinets with locks (300 units)
• Meeting room furniture for 10 conference rooms
• Installation and assembly services included
• 2-year warranty on all furniture items

Timeline: Delivery and installation within 60 days of contract signing

Shortlisted Vendors:
• PT Kawan Lama
• PT Informa Innovative Furnishing
• PT IKEA Indonesia

AI Check Result: ⚠️ No Suitable Template Found
Confidence: 95%
Reasoning: "No suitable existing template found. AI can generate a
customized contract template based on project requirements and industry standards."

USER ACTION AVAILABLE:
┌────────────────────────────────────────────┐
│  ✨ AI Generate New Template               │
│  (Orange-Red Gradient Button)              │
└────────────────────────────────────────────┘
```

#### 6. **Enterprise IT Infrastructure Upgrade** ⭐ SECONDARY TEST EVENT
```
Event ID: SE-2025-010
Category: Information Technology
Value: Rp 4.5 Billion
Status: Draft
Deadline: August 30, 2025

Description:
Comprehensive IT infrastructure modernization including server upgrades,
network infrastructure, cybersecurity systems, cloud migration services,
and enterprise software licensing for 2000+ users across multiple locations.

Key Requirements:
• Enterprise-grade servers (50 units) with redundancy
• Network switches and routers (100 units)
• Firewall and cybersecurity appliances
• Cloud migration and hybrid cloud setup
• Enterprise software licenses (2000+ users)
• Data backup and disaster recovery system
• 24/7 technical support for 3 years
• Training for IT staff (50 personnel)
• System integration and migration services
• SOC 2 Type II compliance certification

Timeline: Phased implementation over 6 months with zero downtime

Shortlisted Vendors:
• PT IBM Indonesia
• PT Microsoft Indonesia
• PT Oracle Indonesia
• PT Amazon Web Services Indonesia

AI Check Result: ⚠️ No Suitable Template Found
Confidence: 93%

USER ACTION AVAILABLE:
┌────────────────────────────────────────────┐
│  ✨ AI Generate New Template               │
│  (Orange-Red Gradient Button)              │
└────────────────────────────────────────────┘
```

#### 7. **Professional Consulting Services** ⭐ TERTIARY TEST EVENT
```
Event ID: SE-2025-011
Category: Professional Services
Value: Rp 2.8 Billion
Status: Draft
Deadline: December 31, 2025

Description:
Comprehensive business process review and optimization consulting
engagement to improve operational efficiency, reduce costs, and
enhance procurement workflows across all business units.

Key Requirements:
• Senior consultant team (5-8 consultants)
• Business process mapping and analysis
• Gap analysis and recommendations
• Implementation roadmap development
• Change management support
• Training and knowledge transfer
• Monthly progress reports and presentations
• Quarterly executive briefings
• Technology recommendations and vendor selection support
• Minimum 20% efficiency improvement target

Timeline: 12-month engagement with quarterly milestones and deliverables

Shortlisted Vendors:
• McKinsey & Company
• Boston Consulting Group
• Accenture Indonesia
• Deloitte Consulting

AI Check Result: ⚠️ No Suitable Template Found
Confidence: 97%

USER ACTION AVAILABLE:
┌────────────────────────────────────────────┐
│  ✨ AI Generate New Template               │
│  (Orange-Red Gradient Button)              │
└────────────────────────────────────────────┘
```

---

## 🎨 **Visual Interface Layout**

### **Event Card with NO Template (Office Furniture Example)**

```
╔═══════════════════════════════════════════════════════════════╗
║  SE-2025-009                              [Draft]             ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Corporate Office Furniture & Equipment Procurement          ║
║  Office Supplies                                             ║
║                                                               ║
║  Bulk procurement of ergonomic office chairs, height-        ║
║  adjustable desks, computer workstations, filing cabinets... ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────┐    ║
║  │ 💰 Value                  📅 Deadline                │    ║
║  │ Rp 850 Million            June 15, 2025             │    ║
║  │                                                      │    ║
║  │ 👥 Vendors                📍 Location               │    ║
║  │ 3 shortlisted             Jakarta CBD               │    ║
║  └─────────────────────────────────────────────────────┘    ║
║                                                               ║
║  🌀 AI Analysis in Progress...                               ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║                                                               ║
║  ┌────────────────────────────────────────────────────┐     ║
║  │  ⚠️  No Suitable Template Found            95%     │     ║
║  │                                                     │     ║
║  │  No suitable existing template found. AI can       │     ║
║  │  generate a customized contract template based     │     ║
║  │  on project requirements and industry standards.   │     ║
║  │                                                     │     ║
║  │  ┌──────────────────────────────────────────────┐ │     ║
║  │  │  ✨ AI Generate New Template                │ │     ║
║  │  │  (Large Button - Orange to Red Gradient)    │ │     ║
║  │  └──────────────────────────────────────────────┘ │     ║
║  └────────────────────────────────────────────────────┘     ║
║                                                               ║
║  ┌────────────────────────────────────────────────────┐     ║
║  │  ✏️ Manually Assign Different Template             │     ║
║  │  (Secondary Option - Gray Button)                  │     ║
║  └────────────────────────────────────────────────────┘     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🚀 **User Testing Flow**

### **Phase 1: Template Check (Automatic)**
```
User Action: Opens Contract Templating page
System Action:
  1. Displays all sourcing events
  2. Automatically runs AI check on each event (1.5-2.5 seconds)
  3. Shows loading state: "AI Analysis in Progress..."
  4. Displays results with visual indicators
```

### **Phase 2: No Template Detection**
```
Visual Indicators:
✓ Template Found:
  - Green background alert
  - Check circle icon
  - "Template Available" heading
  - Match confidence percentage
  - Recommended template name
  - Two action buttons:
    • "View & Use Template" (green)
    • "Edit Template" (blue)

⚠️ No Template Found:
  - Orange background alert
  - Warning triangle icon
  - "No Suitable Template Found" heading
  - Confidence percentage
  - Clear explanation text
  - ONE PRIMARY ACTION:
    • "AI Generate New Template" (orange-red gradient, large)
  - ONE SECONDARY OPTION:
    • "Manually Assign Different Template" (gray, smaller)
```

### **Phase 3: AI Generation Initiation**
```
User Action: Clicks "AI Generate New Template"

System Response:
  1. Opens modal dialog
  2. Shows generation preview
  3. Displays what will be created:
     ✓ Complete contract template with all standard sections
     ✓ Auto-populated terms from sourcing event
     ✓ Standard legal clauses and performance terms
     ✓ Editable template ready for customization

  4. Shows sourcing event details:
     - Event ID
     - Title
     - Category
     - Estimated Value
     - Deadline

  5. Prominent CTA:
     "Generate Contract Template" button (blue, large)
```

### **Phase 4: Generation Process**
```
User Action: Clicks "Generate Contract Template"

System Response:
  1. Shows loading animation (2 seconds)
  2. Progress indicators:
     ✓ Analyzing sourcing event data (completed)
     ⟳ Extracting key contract terms (in progress)
     ○ Generating contract sections (pending)
     ○ Applying legal templates (pending)

  3. Closes modal automatically
  4. Opens results page
```

### **Phase 5: Results Display**
```
Display:
  1. Green success banner at top:
     "Contract Generated Successfully!"
     "Your AI-generated contract is ready for review, editing, and download"

  2. Coral/Red header:
     - "Standard RFP Contract Template" (large, bold)
     - Contract ID: ACN-[unique-id]-9836
     - Creation date
     - Version badge
     - "Created by AI Contract Generator" badge

  3. Four action buttons:
     [Download PDF]  [Edit Contract]  [Save Draft]  [Generate New]

  4. Contract sections (scrollable):
     - Contract Header
     - Contracting Parties
     - Scope of Work
     - Pricing Terms
     - Payment Terms
     - Delivery Schedule
     - Performance Guarantee
     - Termination Clauses
     - Legal Terms
     - Special Conditions
```

---

## 📝 **User Testing Questions**

### **Discovery Phase**
1. How quickly did you notice which events have templates vs. which don't?
2. Was the orange alert badge clear and attention-grabbing?
3. Did you understand what "No Suitable Template Found" means?
4. Was the confidence percentage helpful or confusing?

### **Decision Phase**
5. Was the "AI Generate New Template" button easy to find?
6. Did the button text clearly communicate what would happen?
7. Would you have preferred a different button label?
8. Was the secondary option ("Manually Assign") clearly secondary?

### **Generation Phase**
9. Did the modal provide enough information before generation?
10. Were the progress indicators helpful or unnecessary?
11. Was the 2-second wait time acceptable?
12. Did you feel confident about what was being created?

### **Results Phase**
13. Was the success message clear and reassuring?
14. Did the "Standard RFP Contract Template" name make sense?
15. Were the four action buttons clear in their purpose?
16. Could you easily find the contract sections you needed?

### **Overall Experience**
17. On a scale of 1-10, how intuitive was the entire flow?
18. What was the most confusing part of the experience?
19. What worked really well?
20. Would you trust AI to generate contracts for your organization?

---

## 🎯 **How to Access the Testing Interface**

### **URL:**
```
http://localhost:5173/procurements/contract-lifecycle
```

### **Navigation:**
1. Login to the system
2. Go to: **Procurements** → **Contract Lifecycle**
3. Click the **"Contract Templating"** tab
4. You'll see all sourcing events with their AI check results

### **Finding Test Events:**
- **Scroll down** to see all 8 events
- **Office Furniture (SE-2025-009)** - First "No Template" event
- **IT Infrastructure (SE-2025-010)** - Second "No Template" event
- **Consulting Services (SE-2025-011)** - Third "No Template" event

---

## ✅ **Success Criteria for User Testing**

### **Task Completion**
- [ ] User successfully identified event without template
- [ ] User clicked AI generation button without hesitation
- [ ] User understood what was being generated
- [ ] User successfully reviewed generated contract
- [ ] User found and used action buttons correctly

### **Time Metrics**
- Time to identify "No Template" event: Target < 10 seconds
- Time to find AI generation button: Target < 5 seconds
- Time to complete full flow: Target < 60 seconds

### **Confidence Metrics**
- User confidence in AI-generated content: Target > 7/10
- Willingness to use in production: Target > 70%
- Understanding of process: Target > 80% correct explanation

---

## 📊 **Test Data Summary**

### **Events Breakdown**
```
Total Events: 8
- WITH Templates: 5 events (Solar, Wind, Battery, Hydro, Rooftop Solar)
- WITHOUT Templates: 3 events (Office, IT, Consulting) ⭐

Categories Represented:
- Renewable Energy: 4 events (all have templates)
- Energy Storage: 1 event (has template)
- Hydro Power: 1 event (has template)
- Office Supplies: 1 event (NO template) ⭐
- Information Technology: 1 event (NO template) ⭐
- Professional Services: 1 event (NO template) ⭐
```

---

**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Test Environment**: Contract Lifecycle Management → Contract Templating
**Primary Test Events**: SE-2025-009, SE-2025-010, SE-2025-011
**Expected Duration**: 5-10 minutes per user test
**Recommended Sample Size**: 5-8 users minimum

---

**This interface is production-ready and suitable for authentic user testing with procurement professionals.**
