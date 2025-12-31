# V1 EPIC Structure - CRM Property Management System

## Overview
This document outlines the EPICs and features for Version 1 of the Property Management CRM system. EPICs are organized to follow the natural workflow from lead capture through portfolio management.

---

## EPIC 1: Lead Capture & PMW Integration
**Goal**: Capture leads from marketing efforts and external forms

**Features**:
- PMW intake form API integration (receive leads from marketing site)
- "Buy Now" button integration on PMW site
- Lead object creation from external sources
- Lead source tracking (category, channel, referrer URL)
- Phone call metadata tracking (answered/unanswered)

---

## EPIC 2: Lead Management & CRM (PM Side)
**Goal**: Property managers can view, filter, manage, and progress leads through the pipeline

**Features**:
- Leads list view with filtering (status, assigned to, unassigned, source, date ranges)
- Leads list sorting (name, created, updated, last reached out)
- List columns (name, contact info, status, # properties, assigned to, created, updated, last reach out)
- Lead detail/profile view with tabs (overview, timeline)
- Lead information display and editing
- Property information display and editing
- Add notes and activity timeline
- Contact information with validation (email bounced, phone invalid)
- Archive/unarchive functionality
- Assignment to team members
- Status management (lead, application, sign docs, under review, onboarding, archived)

---

## EPIC 3: PM Analytics & Reporting Dashboard
**Goal**: Provide property managers with insights into lead sources, pipeline performance, and marketing ROI

**Features**:
- Pipeline trends over time graph (grouped by hour/day/week/month/year)
- Time period selector (day, week, month, year, all)
- Owners vs Properties toggle
- Filter by assigned person(s)
- Lead source performance (organic vs paid breakdown by channel)
- Landing page performance tracking
- Phone call tracking (volume, answered, answer rate) - STRETCH
- Key performance metric cards
- Collapsible section management
- Combined channel filtering with sub-channel breakdown

---

## EPIC 4: Owner Account Creation & Authentication
**Goal**: Owners can create accounts and log in to manage their application

**Features**:
- Account auto-creation from PMW form submission (email as username)
- Email/password authentication
- Login page
- Password reset flow
- Simplified UI for owner portal (no PM sidebar/navigation)
- Session management

---

## EPIC 5: Owner Application Process
**Goal**: Owners complete their property management application

**Features**:
- Owner application form with multi-section structure
- Owner Information section
- Management Preferences section
- Property-specific information (repeatable per property)
- Form progress tracking (percentage complete)
- Save and continue later functionality
- Form validation (required fields)
- Application submission
- Application status management (in progress, pending review, changes requested, approved)
- Re-send application capability (PM side)

---

## EPIC 6: Owner Portal & Dashboard
**Goal**: Owners have a dedicated portal to track their application and onboarding progress

**Features**:
- Owner dashboard with status overview
- Application progress display
- Onboarding stage indicators (Lead → Application → Signed Agreements → Under Review → Property Setup → Onboarded)
- Document signing section (RentSign integration)
- Files/documents repository
- Status-based messaging and next steps
- Completion celebration/welcome modal
- Recent activity feed

---

## EPIC 7: Document Signing (RentSign Integration)
**Goal**: Owners can electronically sign required documents

**Features**:
- Document list display (pending/signed status)
- Document signing workflow
- Document status tracking
- Automatic progression to "under review" after all docs signed
- Document display in PM lead profile view
- Document metadata (upload date, signed date, size, type)

---

## EPIC 8: Application Review & Approval (PM Side)
**Goal**: Property managers review and approve/deny applications

**Features**:
- Application section in lead profile showing completion status
- View completed application sections
- View signed documents with status
- Approve application action (moves to onboarding)
- Request changes action (with message to owner, moves back to application)
- Deny application action (with reason, archives lead)
- Email notifications for each action
- Application and document viewing in read-only mode

---

## EPIC 9: Onboarding & Property Setup
**Goal**: Approved owners complete detailed property onboarding

**Features**:
- Onboarding section display in lead profile
- Property-specific data collection (per property)
- Non-repeatable owner information sections
- Progress tracking per property
- Section completion validation
- Edit capability for each section (PM and owner side)
- Onboarding status tracking

---

## EPIC 10: Portfolio Conversion
**Goal**: Convert fully onboarded owners into active portfolio

**Features**:
- "Add to Portfolio" action (PM side)
- Validation of completion (all sections + documents)
- Portfolio conversion process
- Status change to "completed"
- Success/celebration modal
- Welcome email to owner
- Portal access updates

---

## EPIC 11: Form Builder & Configuration
**Goal**: Property managers can customize application and onboarding forms

**Features**:
- View all forms (application, onboarding)
- Form editor interface
- Add/edit/remove form sections
- Add/edit/remove form fields
- Field types (text, number, email, phone, select, textarea, checkbox, date)
- Required vs optional field configuration
- Field ordering
- Conditional/nested questions (if yes show X, if no hide X)
- Form preview mode
- Pull field mappings from property details
- Section ordering and grouping
- Help text and placeholder configuration
- Save form configurations

---

## EPIC 12: Property Details Integration
**Goal**: Ensure form data maps to actual property records

**Features**:
- Property object field mapping
- Max 100 questions constraint (maps to property fields)
- Application data maps to property details
- Onboarding data maps to property details
- Required fields based on property requirements
- Data validation based on property field types

---

## EPIC Dependencies

### Core Flow Dependencies:
1. **Lead Capture** (EPIC 1) → **Lead Management** (EPIC 2) → **Analytics** (EPIC 3)
2. **Account Creation** (EPIC 4) → **Application Process** (EPIC 5) → **Owner Portal** (EPIC 6)
3. **Document Signing** (EPIC 7) - Can be developed in parallel
4. **Application Review** (EPIC 8) → **Onboarding** (EPIC 9) → **Portfolio Conversion** (EPIC 10)
5. **Form Builder** (EPIC 11) ↔ **Property Integration** (EPIC 12) - Bidirectional dependency

### Parallel Development Opportunities:
- EPIC 3 (Analytics) can be built incrementally as data becomes available
- EPIC 7 (RentSign) can be developed independently
- EPIC 11 & 12 (Forms) can be developed alongside core flow

---

## Notes for Development

### Removed Duplicates from Original Structure:
- Combined two "Owner Dashboard" sections into EPIC 6
- Merged "Lead profile" items into EPIC 2 and EPIC 8
- Consolidated form-related items into EPIC 11
- Unified "Create owner object" stages into the flow across multiple epics

### Sizing Guidelines:
- Each EPIC is sized for meaningful development work (typically 1-3 sprints)
- Features under each EPIC should be broken down further by dev team into user stories
- Estimate 8-12 months for full V1 completion with a team of 3-4 developers

### Future Considerations (Post-V1):
- Automation workflows (email sequences, task creation, follow-ups)
- Bulk operations for leads
- Advanced reporting and custom dashboards
- Mobile application
- Integration with accounting systems
- Multi-language support

---

## Status Workflow

### Lead Statuses:
1. **lead** - Initial contact, no application started
2. **application** - Application in progress or submitted
3. **sign docs** - Application complete, documents ready to sign
4. **under review** - Documents signed, awaiting PM approval
5. **onboarding** - Approved, completing property details
6. **archived** - Denied, not moving forward, or completed
7. **completed** - Successfully added to portfolio

### Status Transitions:
```
lead → application → sign docs → under review → onboarding → completed
   ↓         ↓                         ↓             ↓
archived  archived              archived      archived
```

---

*Last Updated: November 2024*
*Version: 1.0*

