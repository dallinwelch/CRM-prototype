Rentvine Owner CRM – Product Spec 
Last updated: Oct 23, 2025
0) Executive Summary
Build a focused, scalable Owner Lead → Onboarding → Approval CRM that PMs love, while laying the foundation for future CRM team products (Tenant Lead CRM, drip campaigns, AI agents, bulk messaging, comms). V1 is PMW websites and on growth plan + Rentvine for lead intake and targets teams from solo PMs to 40+ staff. Because there is so much to do, our V1 will even be in stages.
1) Scope & Goals
In scope (V1 foundation):
* Owner lead capture (website forms) → qualification → approval → owner onboarding → property onboarding → final PM approval.
* Task system with Fibonacci follow-up cadence and timeline.
* Automations (templates + per‑company configuration; pods optional) for notifications, task creation, assignments, and comms.
* Roles/permissions (CRM toggles) and communication templates (per company).
* Archival/unarchival flows; analytics excludes archived leads.
Out of scope / future: Dashboards owned by other teams, automation history UI, assign to groups, global templates, RV AI Agent,  non‑Rentvine websites (for V1), mass/bulk messaging & drip campaigns/AI.
Permissions (CRM toggles added to existing screen)OUT OF SCOPE:
* Approve owner leads, approve tenant leads, approve owner onboarding.
* Create/edit automations, templates, forms.
* Assign leads/tasks (to users only).
OUT OF SCOPE
review before adding it in. Nice to have.
Duplicate detection: if Email or Phone matches an existing non‑archived lead → tag as Duplicate on the newer record (or all but the active one). Resolve when a duplicate record is archived; only the non‑archived record remains untagged.
Success metrics (V1):
1. Owners onboard themselves (self‑serve completion rate).
2. Reduce time from Owner Lead Generated → Owner Approved.
3. Increase rate of Qualified Leads (partial → qualified conversion).
2) Users & Roles
* Owner Lead / Owner: submits lead; completes onboarding/app + properties; signs docs.
* PM / Leasing Staff: work tasks, qualify/approve, communicate with owners, manage automations/templates.
* Manager: final approval rights; can reassign work; sees dashboards.
* Admin: manages CRM permissions, pods, templates, automations.
3) End‑to‑End Flow (Owner)
1. Lead Created
    * Intake via RV Website: required immutable fields: First Name, Last Name, Email and/or Phone (≥1 required).
    * Optional qualifying questionnaire (customizable by PM; maps to onboarding where applicable).
    * Lead states:
        * Partial Lead: completion 0–99% of qualifying form.
        * Qualified Lead: 100% of qualifying form completed.
    * 
2. Lead Management
    * PM dashboard lists leads by stage (Lead Created, Qualified, Approved, Denied/Archived).
    * Manual lead creation allowed (min fields: first name, last name, email/phone).
    * Multi‑property support from the start: lead can add any number of properties.
    * If a lead provides more info later (prior to account creation): system overwrites the lead’s fields (latest wins) and logs changes on the timeline.
3. Approval
    * A user with approval permission moves a lead to Approved Owner (no required fields block approval).
    * On approval: send onboarding invite via email/SMS; create follow‑up task for next day.
    * Bulk approve/deny/archive supported.
4. Owner Account & Onboarding
    * Owner creates account from invite.
    * Onboarding structure:
        * Owner section (entity/legal/W9, etc.).
        * Property section (repeatable): address, pets allowed, min rent price, etc.; per‑property page flow; add/edit/delete; summary view shows property count.
        * Documents (RentSign): management agreement per owner (and property‑specific docs if needed).
    * Required questions enforced at completion; show summary of missing required fields.
    * PM can Send Back for Revisions unlimited times; every action logged to timeline.
    * Versioned forms: editing the onboarding/lead questionnaire updates future sessions; existing in‑progress and historical submissions keep their schema.
    * Final step: PM Approval (managerial permission). If Denied, choose reason:
        * Not moving forward → send courtesy decline + archive.
        * Requires fixes → send fixes email; resume follow‑ups next day via tasks.
5. Completion
    * On PM approval: owner and properties are added under management; Welcome email sent and  follow‑up tasks tied to prior stages automatically stop.
6. New Property Creation (Owner Portal)
    * Owners can add new properties from their portal (web view).
    * These require verification and PM approval before activation.
    * PMs manually adding a property inside Rentvine bypass verification.
4) Task System (Widget‑Based)
Purpose: Operationalize work with visibility and cadence.
Widget model:
* Tasks live within **Portfolio tab → Dashboard → Tasks widget.
* users can be assigned tasks. (if assigned will stay assigned for follow-up tasks)
* Widgets control visibility — if a user/team has the widget, they see its tasks.
* Default widget shows all tasks; filters can narrow to:
    * Me
    * Me + others
    * Multiple specific people
    * AI agent (view what it’s doing)
Behavior:
* Tasks can be marked complete directly in widget.
* Follow‑ups: Fibonacci cadence (1d, 2d, 3d, 5d, 8d, 13d; total ~34d) → auto‑archive if no response/changes by the user and if user makes successful contact restart sequence.
* Stop conditions: archived, fully onboarded, next stage reached.
* Snooze defers a task; snoozed items bypass auto‑archive.
* Timeline logs all actions.
* Notifications: any user with the widget sees related notifications.
Navigation:
* All lives under Portfolio primary nav tab.
* Sub‑nav added for Owner to see Dashboard and potential owners list view
5) Automations & Workflows
* Allows assignments to users but default unassigned.
* Widgets dictate notification scope — if user has widget, they’re notified if they have filter of unassigned show unassigned updates as well, but if they filter to show only themsleves only give updates/notifications on their updates.
* Automations still per‑company (and optional pods) with premade templates users can duplicate and revert.
Triggers examples:
* New lead created → assign to user (previously assigned or default).
* Lead approved → send onboarding invite + create next‑day follow‑up.
* Onboarding denied → send appropriate email + archive or restart.
6) Forms & Templates
* Owner Lead Questionnaire and Owner Onboarding Application are required builds for V1.
* Mapping: qualifying fields map to onboarding and onbaording should allow mapping to properties in the system already when relevant. Example if a company wants the garage code we can ask it in onboarding and then when added we save it to the added property in the system
* Multi‑property onboarding supports add/edit/delete.
* Templates remain per‑company; permissions required to create/edit.
7) Notifications
* Notification rule: if a user has the widget that includes the relevant filters, they receive notifications.
* Notification types: new lead, task assignment, approval, send‑back, snooze ending.
8) Navigation & UI Placement
* Portfolio tab gains sub‑nav of Dashboard for the Owner leads
* Tasks widget inside Portfolio tab shows task list, filters, and completion actions.
* Other widgets planned later for leads, onboarding, automations.
9) Updated Architecture / Simplifications
* Visibility: widget‑based.
* Notifications: widget presence controls delivery.
* Task list: simplified, faster to ship for V1.
* Owner‑added properties: verification + PM approval required.
10) V1 Roadmap Adjustments
* Phase 1: Lead capture, dashboards, and questionnaire builder.
* Phase 2: Tasks widget (Portfolio tab), Fibonacci cadence, notifications.
* Phase 3: Owner onboarding application + property verification flow.
* Phase 4: Automations and templates.
* Phase 5: Analytics and polish.
* 


