# RentVine Owner CRM - Prototype

## Overview
This is a fully functional front-end prototype of the RentVine Owner CRM system, built according to the Product Requirements Document (PRD). All data is hard-coded for demonstration purposes with no backend or database required.

## ✅ Implemented Features

### 1. Navigation & Structure
- **Portfolio Tab** with expandable sub-navigation
  - Dashboard view with lead stages
  - Owner Leads list view
- Integrated with existing RentVine navigation (Properties, Tenants, Leases, etc.)
- User profile in sidebar (Sarah Johnson - Manager)

### 2. Owner Leads Dashboard
**Location:** Portfolio → Dashboard

#### Stats Cards
- Total Active Leads
- Partial Leads (0-99% complete)
- Qualified Leads (100% complete)
- In Onboarding

#### Lead Stages
- **Partial Leads:** Incomplete qualifying questionnaire
- **Qualified Leads:** 100% questionnaire complete, awaiting approval
- **In Onboarding:** Approved leads completing onboarding application

#### Features
- Stage-based lead views
- Lead cards with completion progress
- Quick navigation to lead detail
- Tasks Widget integrated in sidebar

### 3. Owner Leads List View
**Location:** Portfolio → Owner Leads

#### Features
- Search functionality
- Status filters (All Active, Partial, Qualified, Approved, Archived)
- Bulk actions (Approve, Deny, Archive) - permission-based
- Sortable table with:
  - Name with avatar
  - Contact info (email, phone)
  - Status badges
  - Property count
  - Assignment
  - Created/Updated dates
- Row selection with checkboxes
- Duplicate lead detection (tag displayed)

### 4. Lead Detail Page
**Accessible:** Click any lead from Dashboard or List

#### Tabs
1. **Overview**
   - Contact information
   - Properties list
   - Lead notes
   
2. **Properties**
   - Multi-property support
   - Add/Edit properties
   - Property details (bedrooms, bathrooms, pets, rent)
   
3. **Timeline**
   - Activity history
   - Event logging (lead created, approved, forms completed, etc.)
   - Add notes functionality
   
4. **Onboarding** (when applicable)
   - Progress tracking
   - Section completion status
   - Approval/revision actions

#### Actions
- **Approve Lead** (with permission)
  - Sends onboarding invitation
  - Creates follow-up task
  - Modal confirmation
  
- **Deny Lead** (with permission)
  - Choose denial reason:
    - Not moving forward → courtesy decline + archive
    - Requires fixes → send fixes email + resume follow-ups
  
- Edit lead information
- Archive lead

### 5. Tasks Widget
**Location:** Right sidebar in Dashboard

#### Features
- Widget-based visibility system
- Filter options:
  - All Tasks
  - My Tasks
  - Me + Unassigned
  - Unassigned Only
  - AI Agent (for future AI tasks)
  
#### Task Display
- Task title and description
- Priority badges (Urgent, High, Medium, Low)
- Due dates with relative formatting
- Lead association
- Assignee
- Fibonacci cadence day indicator
- Complete task action

#### Fibonacci Cadence
- Follow-up tasks: 1, 2, 3, 5, 8, 13 days (~34 days total)
- Auto-archive after sequence complete
- Stop conditions: archived, qualified, approved, or user contact

### 6. Owner Onboarding Application
**Accessible:** After lead approval (simulated in prototype)

#### Structure
- **Step 1: Owner Information**
  - Legal entity name
  - Tax ID / EIN
  - Mailing address
  - Emergency contact
  
- **Step 2: Property Information** (Repeatable)
  - Property address
  - Bedrooms/Bathrooms
  - Pets allowed
  - Minimum rent price
  - Garage code (optional)
  - Add/Remove multiple properties
  - Property summary view
  
- **Step 3: Documents & Signatures**
  - Property Management Agreement
  - W9 Tax Form
  - Document upload interface

#### Features
- Progress indicator (percentage)
- Step navigation with visual status
- Required field validation
- Multi-property tabs
- Property-by-property editing
- Overall properties summary
- Form versioning support (mentioned in data structure)

### 7. Automations Manager
**Location:** Automations nav item

#### Features
- List view of all automations
- Filter tabs:
  - All Automations
  - Active
  - Inactive
  - Templates
  
#### Automation Cards Display
- Name and description
- Trigger type (e.g., "New Lead Created")
- Actions flow visualization
- Active/Inactive toggle (permission-based)
- Status indicator

#### Pre-built Automations (Hard-coded)
1. **New Lead - Auto Assignment**
   - Trigger: Lead Created
   - Actions: Assign round-robin, send notification, create task
   
2. **Lead Approved - Send Onboarding Invite**
   - Trigger: Lead Approved
   - Actions: Send email, send SMS, create follow-up task
   
3. **Partial Lead - Follow Up Sequence**
   - Trigger: Partial Lead Created
   - Actions: Create Fibonacci task sequence

#### Actions Available
- Toggle active/inactive
- Duplicate automation
- Edit automation
- Delete automation
- Permission-based visibility

#### Templates Section
- Pre-built templates to duplicate:
  - Welcome Series
  - Follow-up Cadence
  - Onboarding Reminders

### 8. CRM Settings
**Location:** Settings nav item

#### Three Main Sections

##### A. Permissions
- User list with roles (Manager, PM Staff, Leasing Staff)
- Toggle permissions:
  - Approve Owner Leads
  - Approve Owner Onboarding
  - Create/Edit Automations
  - Create/Edit Templates
  - Assign Leads
- Permission descriptions
- Role-based access control

##### B. Templates
**Email Templates:**
- Onboarding Invite
- Approval Notification
- Variable support ({{firstName}}, {{propertyAddress}}, etc.)

**SMS Templates:**
- Onboarding Invite SMS
- Variable support

Template features:
- View template content
- Edit/Delete actions
- Variable tags display
- Per-company customization

##### C. Forms
- Owner Lead Questionnaire
  - 12 questions, 8 required
  - Version 2.1
  
- Owner Onboarding Application
  - 3 sections, 18 questions
  - Version 1.5

Form stats:
- Question count
- Required field count
- Version tracking
- Edit form access (permission-based)

### 9. Forms Builder
**Accessible:** From Settings → Forms → Edit Form

#### Features
- Visual form builder interface
- Three-panel layout:
  - **Left:** Sections list
  - **Center:** Field editor
  - **Right:** Field type palette
  
#### Section Management
- Create/delete sections
- Switch between sections
- Section title editing

#### Field Types Available
- Text
- Text Area
- Number
- Email
- Phone
- Dropdown
- Checkbox
- Date

#### Field Editor
- Drag and drop (visual handle)
- Field label editing
- Field type selection
- Options for dropdown/checkbox
- Help text
- Required toggle
- Expand/collapse field details

#### Preview Mode
- Toggle between edit and preview
- See form as owner would see it
- All sections and fields displayed
- Disabled inputs for demonstration

### 10. Mock Data Structure
**File:** `src/mockData.js`

#### Included Data
- **5 Owner Leads** with various statuses
  - John Smith (Qualified)
  - Emily Johnson (Partial)
  - Michael Chen (Approved, In Onboarding)
  - Sarah Williams (Qualified, Unassigned)
  - David Martinez (Denied/Archived)
  
- **5 Tasks** with Fibonacci cadence
  - Various priorities
  - Assigned and unassigned
  - Different task types (follow-up, onboarding review, approval)
  
- **3 Automations** (active)
  - Lead assignment
  - Onboarding invites
  - Follow-up sequences
  
- **3 Users** with different roles
  - Sarah Johnson (Manager) - full permissions
  - Mike Davis (PM Staff) - limited permissions
  - Jessica Martinez (Leasing Staff) - tenant-focused
  
- **Email/SMS Templates**
- **Onboarding Form Structure**
- **Fibonacci Cadence Array**: [1, 2, 3, 5, 8, 13] days

## 🎨 Design & UI

### Design System
- Clean, modern interface
- Consistent color palette:
  - Primary: Blue (#3b82f6)
  - Success: Green (#10b981)
  - Warning: Orange (#f59e0b)
  - Danger: Red (#ef4444)
  - Purple: For onboarding (#8b5cf6)
  
### Components
- Responsive grid layouts
- Card-based design
- Status badges with icons
- Progress bars
- Avatar placeholders
- Icon integration (Lucide React)
- Modal dialogs
- Dropdown menus
- Data tables
- Timeline views
- Form inputs with validation states

### Interactions
- Hover effects
- Smooth transitions
- Click animations
- Loading states
- Empty states
- Tooltips via title attributes

## 📋 PRD Compliance Checklist

### ✅ In Scope (V1 Foundation)
- [x] Owner lead capture → qualification → approval → onboarding
- [x] Task system with Fibonacci follow-up cadence
- [x] Automations (templates + per-company configuration)
- [x] Roles/permissions (CRM toggles)
- [x] Communication templates (per company)
- [x] Archival/unarchival flows
- [x] Multi-property support
- [x] Timeline/activity logging
- [x] Widget-based task visibility
- [x] Approval workflows
- [x] Send back for revisions
- [x] Forms builder

### ✅ User Roles Implemented
- [x] Owner Lead (data structure)
- [x] PM / Leasing Staff (task work, qualify/approve, communicate)
- [x] Manager (approval rights, reassign, dashboards)
- [x] Admin (permissions, templates, automations)

### ✅ End-to-End Flow
1. [x] Lead Created (partial vs qualified)
2. [x] Lead Management (dashboard, list, detail)
3. [x] Approval (approve/deny with reasons)
4. [x] Owner Account & Onboarding (multi-section, multi-property)
5. [x] Completion (approval + welcome)
6. [x] New Property Creation (add properties in onboarding)

### ✅ Task System
- [x] Widget-based visibility
- [x] Filter options (Me, Me+Others, Unassigned, AI)
- [x] Fibonacci cadence (1, 2, 3, 5, 8, 13)
- [x] Task completion
- [x] Stop conditions
- [x] Timeline logging

### ✅ Automations
- [x] Per-company configuration
- [x] Templates available
- [x] Trigger types
- [x] Action types (email, SMS, task, assign, notify)
- [x] Active/inactive toggle
- [x] Duplicate and revert

### ✅ Permissions
- [x] Approve owner leads
- [x] Approve owner onboarding
- [x] Create/edit automations
- [x] Create/edit templates
- [x] Assign leads

### ✅ Navigation
- [x] Portfolio tab with sub-nav
- [x] Dashboard view
- [x] Owner Leads list view
- [x] Tasks widget in Portfolio tab

### 🔄 Out of Scope (Future)
- [ ] Assign to groups (V1 only assigns to users)
- [ ] Global templates (V1 is per-company)
- [ ] RV AI Agent tasks (UI ready, no functionality)
- [ ] Mass/bulk messaging
- [ ] Drip campaigns
- [ ] Automation history UI
- [ ] Analytics/reporting
- [ ] Tenant Lead CRM

## 🚀 How to Run

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 📱 Navigation Guide

### Getting Started
1. App opens to **Portfolio → Dashboard**
2. See lead stages and stats
3. Tasks widget on the right shows active tasks

### View All Leads
1. Click **Owner Leads** in Portfolio sub-nav
2. Use filters to narrow down
3. Select leads for bulk actions
4. Click any lead to view details

### Lead Detail Actions
1. Click a lead card or table row
2. Use tabs to navigate (Overview, Properties, Timeline, Onboarding)
3. Click **Approve** or **Deny** (if you have permissions)
4. Add notes in Timeline tab
5. View onboarding progress

### Manage Automations
1. Click **Automations** in main nav
2. Toggle automations on/off
3. Duplicate templates
4. View automation flows

### Configure Settings
1. Click **Settings** in main nav
2. Go to **Permissions** tab to manage user access
3. Go to **Templates** tab to view email/SMS templates
4. Go to **Forms** tab to see form configurations

### Filter Tasks
1. In Dashboard, find Tasks widget on right
2. Click filter dropdown
3. Select view (All, Me, Me+Unassigned, etc.)

## 👥 Mock Users

### Sarah Johnson (Current User)
- **Role:** Manager
- **Email:** sarah.johnson@company.com
- **Permissions:** All permissions enabled
- Can approve leads and onboarding
- Can create automations and templates

### Mike Davis
- **Role:** PM Staff
- **Email:** mike.davis@company.com
- **Permissions:** Limited (can assign leads only)

### Jessica Martinez
- **Role:** Leasing Staff
- **Email:** jessica.m@company.com
- **Permissions:** Tenant-focused

## 🎯 Key Interactions to Test

1. **Dashboard Flow**
   - View different lead stages
   - Click "View All" on any stage
   - Click individual lead cards

2. **Bulk Actions**
   - Go to Owner Leads list
   - Select multiple leads
   - Try Approve/Deny/Archive buttons

3. **Lead Approval**
   - Open lead detail (e.g., Sarah Williams)
   - Click "Approve" button
   - Read modal and confirm

4. **Task Filtering**
   - In Tasks widget, change filters
   - See how task list updates
   - Note Fibonacci cadence indicators

5. **Onboarding Flow**
   - Open Michael Chen (in onboarding)
   - Go to Onboarding tab
   - See progress and sections

6. **Permissions**
   - Go to Settings → Permissions
   - Toggle different permissions
   - See visual feedback

7. **Automation Toggle**
   - Go to Automations
   - Click toggle switch on automation card
   - See status change

## 🛠 Technology Stack

- **React** 18.2.0
- **Lucide React** (icons)
- **CSS** (custom design system, no framework)
- **Mock Data** (hard-coded, no backend)

## 📝 Notes

### Data Persistence
- **None** - All changes are in-memory only
- Refresh resets to initial mock data
- Perfect for demonstration and prototyping

### Responsive Design
- Optimized for desktop (1400px+)
- Tablet-friendly (768px+)
- Mobile considerations in place

### Performance
- No API calls
- Instant interactions
- Smooth animations
- Lightweight bundle

### Future Enhancements (Post-V1)
- Backend integration
- Real authentication
- Database persistence
- Advanced analytics
- AI agent integration
- Bulk messaging
- Drip campaigns
- Webhook automations
- Report generation

## 📚 File Structure

```
src/
├── App.js                              # Main app router
├── index.js                            # Entry point
├── index.css                           # Global styles (comprehensive)
├── mockData.js                         # All hard-coded data
└── components/
    ├── Header.js                       # Top navigation bar
    ├── Sidebar.js                      # Left sidebar with nav
    ├── OwnerLeadsDashboard.js         # Portfolio dashboard
    ├── OwnerLeadsList.js              # Leads table view
    ├── LeadDetail.js                  # Individual lead detail
    ├── TasksWidget.js                 # Tasks sidebar widget
    ├── OwnerOnboarding.js             # Multi-step onboarding form
    ├── AutomationsManager.js          # Automations list & config
    ├── CRMSettings.js                 # Settings (permissions, templates, forms)
    ├── FormsBuilder.js                # Visual form builder
    └── PropertyManagementSite.js      # Website form (existing)
```

## ✨ Highlights

### Multi-Property Support
- Owner can have multiple properties
- Add/edit/delete in onboarding
- Property summary view
- Individual property cards

### Permission-Based UI
- Buttons/actions hide or disable based on permissions
- Current user (Sarah Johnson) has full access
- Switch users in code to test different permission levels

### Timeline/Activity Logging
- Every action logged
- User attribution
- Timestamp tracking
- System vs user events

### Widget-Based System
- Tasks visible based on widget presence
- Filter determines notification scope
- Scalable for future widgets

### Form Versioning
- Editing forms creates new version
- Existing submissions keep original schema
- Historical data preserved
- Mentioned in data structure (not fully implemented UI)

## 🎉 Success!

This prototype demonstrates all core V1 features from the PRD:
- ✅ Complete owner lead → onboarding flow
- ✅ Task management with Fibonacci cadence
- ✅ Automation configuration
- ✅ Role-based permissions
- ✅ Communication templates
- ✅ Multi-property support
- ✅ Timeline tracking
- ✅ Widget-based visibility

**Ready for user testing and feedback!**

