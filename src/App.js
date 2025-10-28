import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OwnerLeadsDashboard from './components/OwnerLeadsDashboard';
import OwnerLeadsList from './components/OwnerLeadsList';
import LeadDetail from './components/LeadDetail';
import OwnerOnboarding from './components/OwnerOnboarding';
import AutomationsManager from './components/AutomationsManager';
import CRMSettings from './components/CRMSettings';
import FormsBuilder from './components/FormsBuilder';
import PropertyManagementSite from './components/PropertyManagementSite';
import MobileOwnerQuestionnaire from './components/MobileOwnerQuestionnaire';
import NewLeadModal from './components/NewLeadModal';
import { mockLeads } from './mockData';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, list, detail, onboarding, form-builder
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [editingFormType, setEditingFormType] = useState(null); // 'lead-questionnaire' or 'onboarding-application'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [leads, setLeads] = useState(() => {
    // Detect duplicates on initial load
    return detectAndMarkDuplicates(mockLeads);
  });

  // Duplicate detection helper
  function detectAndMarkDuplicates(leadsArray) {
    const emailMap = {};
    const phoneMap = {};
    const updatedLeads = leadsArray.map(lead => ({ ...lead, isDuplicate: false, duplicateOf: null }));

    // First pass: find duplicates
    updatedLeads.forEach((lead, index) => {
      if (lead.status === 'archived') return; // Skip archived leads

      // Check email duplicates
      if (lead.email) {
        const email = lead.email.toLowerCase();
        if (emailMap[email] !== undefined) {
          // This is a duplicate
          updatedLeads[index].isDuplicate = true;
          updatedLeads[index].duplicateOf = emailMap[email];
        } else {
          emailMap[email] = lead.id;
        }
      }

      // Check phone duplicates
      if (lead.phone) {
        const phone = lead.phone.replace(/\D/g, ''); // Remove non-digits
        if (phoneMap[phone] !== undefined) {
          // This is a duplicate
          if (!updatedLeads[index].isDuplicate) {
            updatedLeads[index].isDuplicate = true;
            updatedLeads[index].duplicateOf = phoneMap[phone];
          }
        } else {
          phoneMap[phone] = lead.id;
        }
      }
    });

    return updatedLeads;
  }

  // Check if we're on the example site route
  const isExampleSite = currentPath === '/example-site';
  
  // Check if we're on the mobile questionnaire route
  const isMobileQuestionnaire = currentPath === '/mobile-apply' || currentPath === '/apply';
  
  if (isExampleSite) {
    return <PropertyManagementSite />;
  }

  if (isMobileQuestionnaire) {
    return <MobileOwnerQuestionnaire onComplete={(data) => {
      console.log('Application completed:', data);
      // Could redirect to success page or back to home
    }} />;
  }

  const handleNavigateToList = (filterStatus = null) => {
    setCurrentView('list');
  };

  const handleNavigateToLead = (leadId) => {
    setSelectedLeadId(leadId);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedLeadId(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedLeadId(null);
  };

  const handleCreateLead = () => {
    setShowNewLeadModal(true);
  };

  const handleSaveNewLead = (newLead) => {
    setLeads(prevLeads => {
      const updatedLeads = [newLead, ...prevLeads];
      return detectAndMarkDuplicates(updatedLeads);
    });
    setShowNewLeadModal(false);
    // Show success message or navigate to the new lead
    console.log('New lead created:', newLead);
  };

  const handleArchiveLead = (leadId) => {
    setLeads(prevLeads => {
      const updatedLeads = prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: 'archived' } : lead
      );
      // Re-detect duplicates after archiving
      return detectAndMarkDuplicates(updatedLeads);
    });
  };

  // Automatic status progression - when onboarding is completed and approved
  const handleCompleteOnboarding = (leadId) => {
    setLeads(prevLeads => {
      return prevLeads.map(lead => {
        if (lead.id === leadId) {
          // When onboarding is complete and approved, the lead becomes an active owner
          // In real app, this would create the owner record and remove from leads
          return {
            ...lead,
            status: 'completed', // Special status for display purposes
            onboardingStatus: 'completed',
            onboardingCompletion: 100
          };
        }
        return lead;
      });
    });
  };

  // Check for stale leads and suggest archiving
  const getStaleLead = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return leads.find(lead => {
      if (lead.status === 'archived' || lead.status === 'completed') return false;
      const lastUpdate = new Date(lead.updatedAt);
      return lastUpdate < thirtyDaysAgo && lead.status === 'partial';
    });
  };

  const handleEditForm = (formType) => {
    setEditingFormType(formType);
    setCurrentView('form-builder');
  };

  const handleBackFromFormBuilder = () => {
    setEditingFormType(null);
    setCurrentView('settings');
  };

  const renderPortfolioContent = () => {
    if (activeSubTab === 'dashboard') {
      if (currentView === 'list') {
        return (
          <OwnerLeadsList
            leads={leads}
            onNavigateToLead={handleNavigateToLead}
            onCreateLead={handleCreateLead}
          />
        );
      } else if (currentView === 'detail' && selectedLeadId) {
        return (
          <LeadDetail
            leadId={selectedLeadId}
            leads={leads}
            onBack={handleBackToList}
          />
        );
      } else {
        return (
          <OwnerLeadsDashboard
            leads={leads}
            onNavigateToList={handleNavigateToList}
            onNavigateToLead={handleNavigateToLead}
            onCreateLead={handleCreateLead}
          />
        );
      }
    } else if (activeSubTab === 'owner-leads') {
      if (currentView === 'detail' && selectedLeadId) {
        return (
          <LeadDetail
            leadId={selectedLeadId}
            leads={leads}
            onBack={handleBackToList}
          />
        );
      }
      return (
        <OwnerLeadsList
          leads={leads}
          onNavigateToLead={handleNavigateToLead}
          onCreateLead={handleCreateLead}
        />
      );
    }
  };

  const renderActiveTab = () => {
    // If we're in form builder view, show it regardless of active tab
    if (currentView === 'form-builder' && editingFormType) {
      return (
        <FormsBuilder 
          formType={editingFormType} 
          onBack={handleBackFromFormBuilder}
        />
      );
    }

    switch (activeTab) {
      case 'portfolio':
        return renderPortfolioContent();
      
      case 'automations':
        return <AutomationsManager />;
      
      case 'settings':
        return <CRMSettings onEditForm={handleEditForm} />;
      
      case 'properties':
      case 'tenants':
      case 'leases':
      case 'accounting':
      case 'reports':
        return (
          <div className="placeholder-view">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>This section is part of the existing Rentvine system</p>
          </div>
        );
      
      default:
        return renderPortfolioContent();
    }
  };

  return (
    <div className="app">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentView('dashboard');
          setSidebarOpen(false); // Close sidebar on mobile after selection
        }}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="main-content-wrapper">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          {renderActiveTab()}
        </main>
      </div>

      <NewLeadModal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        onSave={handleSaveNewLead}
      />
    </div>
  );
}

export default App;
