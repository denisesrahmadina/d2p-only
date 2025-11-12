# Template Library System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Change 1: E-Procurement Submission
**What Changed:** Contract submission now goes directly to E-Procurement System

**Before:** "Submit for Manager Approval"
**After:** "Submit to E-Procurement System"

**Location:** Contract results page after generating a contract

---

### Change 2: Standalone Template Library
**What's New:** 5 professional contract templates available without database

---

## 📋 Available Templates

### 1. RFP Template
**Use for:** Complex projects, renewable energy, infrastructure, IT services
**Best for:** Projects requiring detailed vendor proposals

### 2. RFQ Template
**Use for:** Equipment, materials, spare parts, supplies
**Best for:** Straightforward purchases with clear specifications

### 3. Services Template
**Use for:** Consulting, maintenance, managed services, technical support
**Best for:** Ongoing professional services with SLAs

### 4. Construction Template
**Use for:** Solar/wind installation, building construction, EPC projects
**Best for:** Large infrastructure and installation projects

### 5. Maintenance Template
**Use for:** Equipment maintenance, facility management, support
**Best for:** Annual maintenance contracts with 24/7 support

---

## 🎯 How to Use

### Option 1: Browse Templates

1. Go to **Contract Lifecycle Management**
2. Click **Contract Templating**
3. Select **"Sourcing Event Templates"** tab
4. Browse, search, or filter templates
5. Click **Preview** to see template details
6. Click **Download** to export as text file

### Option 2: Assign to Sourcing Event

1. Go to **Contract Templating** → **"Create Templates"** tab
2. Find your sourcing event in the list
3. Click **"Manually Assign Different Template"**
4. Select appropriate template from the list
5. Click **"Assign Template"**
6. Click **"Generate Contract"** to create the contract

### Option 3: Generate Contract

1. After assigning template (Option 2)
2. Click **"Generate Contract"** button
3. Wait 2 seconds for generation
4. Review contract with all sections populated
5. Click any field to edit inline
6. Click **"Download PDF"** or **"Submit to E-Procurement System"**

---

## 🎨 Template Features

### Each Template Includes:
- ✅ **10 Major Sections**: Header, Parties, Scope, Pricing, Payment, Delivery, Performance, Termination, Legal, Special Conditions
- ✅ **Indonesian Compliance**: TKDN, K3L, AMDAL, VAT, PPh requirements
- ✅ **Placeholder Fields**: `[BRACKETS]` show where to add your data
- ✅ **Required Annexures**: List of supporting documents needed
- ✅ **Professional Legal Clauses**: Confidentiality, IP, liability, dispute resolution
- ✅ **Ready to Customize**: Edit all fields directly in the interface

---

## 📊 Template Selection Guide

| Procurement Type | Recommended Template | Why |
|-----------------|---------------------|-----|
| Solar Farm Installation | Construction Template | EPC structure, milestones, K3L compliance |
| IT Consulting Project | Services Template | SLA-based, monthly retainer, deliverables |
| Equipment Purchase | RFQ Template | Simple purchase terms, delivery focus |
| Complex System Implementation | RFP Template | Comprehensive, detailed requirements |
| Annual Generator Maintenance | Maintenance Template | Preventive maintenance, 24/7 support |

---

## 🔍 Search & Filter

### Search by:
- Template name
- Category
- Description
- Applicable procurement types

### Filter by Category:
- Request for Proposal
- Request for Quotation
- Services Agreement
- Construction Agreement
- Maintenance Agreement

### View Modes:
- **Grid View**: Card-based layout (default)
- **List View**: Detailed row-based layout

---

## ⚡ Quick Actions

### In Template Browser:
- 👁️ **Preview**: View template details in modal
- ✅ **Select/Use**: Apply template to sourcing event
- 📥 **Download**: Export as text file

### In Contract Results:
- 📄 **Download PDF**: Generate printable contract
- ✏️ **Edit Contract**: Enable inline editing mode
- 💾 **Save Draft**: Save your changes
- 📤 **Submit to E-Proc**: Send to E-Procurement System

---

## 🎓 Pro Tips

### 1. Use the Right Template
Match your procurement type to the template category for best results

### 2. Preview Before Selecting
Always preview templates to ensure they fit your needs

### 3. Edit After Generation
All fields can be edited after contract generation - customize as needed

### 4. Check Annexures
Each template lists required supporting documents - prepare these in advance

### 5. Save Drafts Frequently
Click "Save Draft" periodically when making extensive edits

### 6. Download for Reference
Download templates as text files for offline reference or sharing

---

## 🆘 Troubleshooting

### "No templates available"
**Solution:** Refresh the page or navigate to "Sourcing Event Templates" tab to load templates

### "Template not applying to event"
**Solution:** Make sure you've clicked "Assign Template" button after selection

### "Fields showing [BRACKETS]"
**This is normal!** Brackets indicate placeholder fields - replace them with your actual data

### "Can't edit contract"
**Solution:** Click the "Edit Contract" button to enable inline editing mode

---

## 📚 Template Structure Example

```
CONTRACT HEADER
├── Contract ID: [AUTO-GENERATED]
├── Contract Type: [TYPE FROM TEMPLATE]
├── Effective Date: [DATE OF SIGNING]
├── Contract Duration: [SPECIFY DURATION]
└── Governing Law: Republic of Indonesia

CONTRACTING PARTIES
├── Party A (Buyer): PT Indonesia Power
├── Buyer Address: [FULL ADDRESS]
├── Buyer Representative: [OFFICER NAME]
├── Party B (Supplier): [VENDOR NAME]
├── Supplier Address: [VENDOR ADDRESS]
└── Supplier Representative: [VENDOR REP]

SCOPE OF WORK
├── Project Title: [FROM SOURCING EVENT]
├── Project Description: [DETAILED DESCRIPTION]
├── Deliverables: [LIST OF DELIVERABLES]
├── Location: [PROJECT LOCATION]
└── Implementation Timeline: [DURATION]

... and 7 more sections
```

---

## ✅ Success Indicators

You know it's working when:
- ✅ You can see 5 templates in the Sourcing Event Templates tab
- ✅ Template cards show name, category, and description
- ✅ Preview modal displays template sections
- ✅ Manual assignment shows standalone templates
- ✅ Generated contracts have all 10 sections populated
- ✅ Download PDF works with template data
- ✅ Submit button says "Submit to E-Procurement System"

---

## 🎯 Key Benefits

| Feature | Benefit |
|---------|---------|
| **No Database** | Instant loading, works offline |
| **5 Templates** | Coverage for all procurement types |
| **Professional Content** | Industry-standard legal clauses |
| **Indonesian Compliance** | Built-in TKDN, K3L, AMDAL requirements |
| **Easy Customization** | Inline editing, clear placeholders |
| **Download Option** | Export for offline use or sharing |
| **Search & Filter** | Find the right template quickly |
| **Preview Mode** | See before you select |

---

## 📞 Need Help?

### Common Questions

**Q: Can I create my own templates?**
A: Currently, templates are predefined. Contact the admin to add new templates to the JSON file.

**Q: Can I modify templates?**
A: Yes! After generating a contract, click "Edit Contract" to modify any field.

**Q: Where is the data stored?**
A: Templates are stored in `/src/data/contractTemplates.json` - no database required!

**Q: Can I use multiple templates?**
A: One template per sourcing event, but you can change assignment anytime.

**Q: What if I need a template that's not listed?**
A: You can still generate a custom contract or request a new template be added.

---

## 🎉 You're Ready!

That's it! You now know how to:
- ✅ Browse the template library
- ✅ Assign templates to sourcing events
- ✅ Generate professional contracts
- ✅ Submit to E-Procurement System

**Start using the Template Library now to save time and ensure contract quality!**

---

*Last updated: January 2025*
*Version: 1.0*
