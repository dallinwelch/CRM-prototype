# RentVine Owner CRM - Prototype

> **🎯 NEW:** This project has been rebuilt to focus on the **RentVine Owner CRM** system according to the Product Requirements Document (PRD).

> **📱 MOBILE UPDATE:** Full mobile responsiveness added! The CRM now works perfectly on all devices, plus a dedicated mobile owner questionnaire at `/apply`

## 📖 Documentation

**For complete documentation, features, and usage guide, see:**
👉 **[CRM_README.md](./CRM_README.md)**  
👉 **[MOBILE_README.md](./MOBILE_README.md)** - Mobile features & owner questionnaire

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Access Points
- **CRM Dashboard**: `http://localhost:3000/` - Main CRM interface (works on mobile & desktop)
- **Mobile Questionnaire**: `http://localhost:3000/apply` - Standalone owner application form
- **Example Site**: `http://localhost:3000/example-site` - Property management website

## ✨ What's New

This is a complete **Owner CRM** prototype featuring:

### Core Features
- ✅ **Owner Lead Management** - Capture, qualify, and approve owner leads
- ✅ **Lead-to-Onboarding Pipeline** - Complete flow from lead → approval → onboarding
- ✅ **Multi-Property Support** - Owners can manage multiple properties
- ✅ **Task System** - Fibonacci cadence follow-ups (1, 2, 3, 5, 8, 13 days)
- ✅ **Automations** - Templates for notifications, task creation, and communications
- ✅ **Permissions System** - Role-based access control (Manager, PM Staff, Leasing Staff)
- ✅ **Forms Builder** - Visual builder for lead questionnaires and onboarding applications
- ✅ **Templates** - Email and SMS communication templates
- ✅ **Timeline Tracking** - Complete activity history for every lead

### 📱 Mobile Features (NEW!)
- ✅ **Fully Responsive CRM** - Works perfectly on phones, tablets, and desktop
- ✅ **Mobile Navigation** - Collapsible sidebar with hamburger menu
- ✅ **Touch-Optimized** - Large buttons and tap targets for easy use
- ✅ **Mobile Owner Questionnaire** - Standalone form for owners at `/apply`
- ✅ **Progressive Disclosure** - One section at a time for better mobile UX
- ✅ **Auto-Save Progress** - Mobile-friendly form with validation

### Navigation
- **Portfolio** → Dashboard (Lead stages and stats)
- **Portfolio** → Owner Leads (Full list with bulk actions)
- **Automations** (Manage automation workflows)
- **Settings** (Permissions, Templates, Forms)

### Demo Data
All data is **hard-coded** for demonstration purposes:
- 5 Owner Leads (various statuses)
- 5 Tasks with Fibonacci cadence
- 3 Pre-configured Automations
- 3 Users with different roles/permissions
- Email/SMS Templates
- Complete onboarding form structure

## 🎯 Key Highlights

### 1. Dashboard with Lead Stages
View leads by status: Partial, Qualified, Approved, In Onboarding

### 2. Tasks Widget with Filters
Filter by: All Tasks, My Tasks, Me + Unassigned, AI Agent

### 3. Lead Detail Pages
Full lead information with tabs:
- Overview (contact, properties, notes)
- Properties (multi-property management)
- Timeline (activity history)
- Onboarding (progress tracking)

### 4. Approval Workflows
- Approve leads → sends onboarding invite
- Deny leads → choose reason (not moving forward vs requires fixes)
- Send back for revisions

### 5. Owner Onboarding
Multi-step application:
- Step 1: Owner Information
- Step 2: Property Information (repeatable)
- Step 3: Documents & Signatures

### 6. Automations
Pre-built automations:
- New lead auto-assignment
- Approved lead onboarding invite
- Partial lead follow-up sequence

### 7. Permissions Management
Toggle permissions for users:
- Approve owner leads
- Approve owner onboarding
- Create/edit automations
- Create/edit templates
- Assign leads

## 🎨 Design

- Modern, clean interface
- Card-based layouts
- Status badges and progress bars
- Responsive design
- Smooth interactions and animations
- Consistent color system (Blue, Green, Orange, Red, Purple)

## 🛠 Technology

- **React** 18.2.0
- **Lucide React** (Icons)
- **CSS** (Custom design system, no framework)
- **No Backend** (Prototype with mock data)

## 📱 How to Use

1. **Start at Dashboard** - See lead overview and stats
2. **Click any lead** - View detailed information
3. **Use filters** - Find specific leads or tasks
4. **Approve/Deny leads** - Test approval workflows
5. **Check Tasks Widget** - See Fibonacci follow-up cadence
6. **Explore Automations** - Toggle and view automation flows
7. **Go to Settings** - Manage permissions and templates

## 👥 Current User

You're logged in as:
- **Sarah Johnson** (Manager)
- Full permissions enabled
- Can approve leads and onboarding
- Can create automations and templates

## 📋 PRD Compliance

This prototype implements all V1 features from the Product Requirements Document:
- ✅ Lead capture and qualification
- ✅ Approval workflows
- ✅ Owner onboarding application
- ✅ Multi-property support
- ✅ Task system with Fibonacci cadence
- ✅ Automations with templates
- ✅ Role-based permissions
- ✅ Communication templates
- ✅ Timeline/activity logging
- ✅ Widget-based task visibility

## 🔗 Related Documentation

- **[CRM_README.md](./CRM_README.md)** - Complete feature documentation
- **[MOBILE_README.md](./MOBILE_README.md)** - Mobile features & owner questionnaire guide
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Original project instructions
- **[PRD.md](./PRD.md)** - Product Requirements Document

## 📝 Notes

- All data is **mock/hard-coded** (no database)
- Changes are **in-memory only** (refresh resets data)
- Perfect for **demos and user testing**
- Ready for **backend integration**

## 🎉 Success!

This prototype demonstrates a complete, production-ready UI for the RentVine Owner CRM V1 feature set. All core flows are functional and ready for user feedback and testing.

---

**For detailed features, user guides, and complete documentation:**  
👉 **[See CRM_README.md](./CRM_README.md)**
