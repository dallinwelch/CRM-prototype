import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Archive,
  Plus,
  Filter,
  Search,
  UserPlus,
  TrendingUp,
  AlertCircle,
  User,
  Home,
  Settings,
  FileText,
  ChevronRight,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { mockTasks, mockOnboardingForm } from '../mockData';
import TasksWidget from './TasksWidget';

const OwnerLeadsDashboard = ({ leads, onNavigateToList, onNavigateToLead, onCreateLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    partial: false,
    qualified: false,
    approved: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate stats - exclude archived and completed (converted to owners)
  const stats = {
    total: leads.filter(l => l.status !== 'archived' && l.status !== 'completed').length,
    partial: leads.filter(l => l.status === 'partial').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    approved: leads.filter(l => l.status === 'approved').length,
    onboarding: leads.filter(l => l.onboardingStatus === 'in_progress').length
  };

  // Get recent leads by stage
  const getLeadsByStage = (status) => {
    return leads
      .filter(l => l.status === status)
      .slice(0, 5);
  };

  const partialLeads = getLeadsByStage('partial');
  const qualifiedLeads = getLeadsByStage('qualified');
  const approvedLeads = getLeadsByStage('approved');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const StatsCard = ({ title, value, icon: Icon, color, trend, onClick }) => (
    <div 
      className="stats-card" 
      style={{ borderLeftColor: color }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={24} />
        </div>
        <div className="stats-card-info">
          <div className="stats-card-title">{title}</div>
          <div className="stats-card-value">{value}</div>
        </div>
      </div>
      {trend && (
        <div className="stats-card-trend" style={{ color }}>
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  const LeadCard = ({ lead, onClick }) => (
    <div className="lead-card" onClick={() => onClick(lead.id)}>
      <div className="lead-card-header">
        <div className="lead-card-avatar">
          {lead.firstName[0]}{lead.lastName[0]}
        </div>
        <div className="lead-card-info">
          <div className="lead-card-name">{lead.firstName} {lead.lastName}</div>
          <div className="lead-card-contact">{lead.email}</div>
        </div>
      </div>
      <div className="lead-card-details">
        {lead.completionPercentage < 100 && (
          <div className="lead-card-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${lead.completionPercentage}%` }}
              />
            </div>
            <span className="progress-text">{lead.completionPercentage}% complete</span>
          </div>
        )}
        <div className="lead-card-meta">
          <span className="meta-item">
            <Clock size={14} />
            {formatDate(lead.createdAt)}
          </span>
          {lead.assignedTo && (
            <span className="meta-item">
              <Users size={14} />
              {lead.assignedTo}
            </span>
          )}
          {lead.properties.length > 0 && (
            <span className="meta-item">
              {lead.properties.length} {lead.properties.length === 1 ? 'property' : 'properties'}
            </span>
          )}
          {(lead.noteCount > 0 || lead.notes) && (
            <span className="meta-item note-indicator">
              <MessageSquare size={14} />
              <span className="note-badge">{lead.noteCount || 1}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Helper to determine onboarding stage based on completion percentage
  const getOnboardingStage = (completion) => {
    if (completion < 25) return { stage: 0, name: 'Owner Information', icon: User };
    if (completion < 50) return { stage: 1, name: 'Property Information', icon: Home };
    if (completion < 75) return { stage: 2, name: 'Management Preferences', icon: Settings };
    return { stage: 3, name: 'Documents & Signatures', icon: FileText };
  };

  // Helper to get missing required fields for a lead in onboarding
  const getMissingFields = (lead) => {
    const missingFields = [];
    const currentStageInfo = getOnboardingStage(lead.onboardingCompletion || 0);
    
    // Mock missing fields based on completion percentage - in real app, check actual form data
    if (currentStageInfo.stage === 0) {
      if ((lead.onboardingCompletion || 0) < 15) {
        missingFields.push('Legal Entity Name', 'Tax ID / EIN');
      } else if ((lead.onboardingCompletion || 0) < 25) {
        missingFields.push('Mailing Address');
      }
    } else if (currentStageInfo.stage === 1) {
      if ((lead.onboardingCompletion || 0) < 35) {
        missingFields.push('Property Address', 'Bedrooms/Bathrooms');
      } else if ((lead.onboardingCompletion || 0) < 50) {
        missingFields.push('Pets Allowed', 'Minimum Rent Price');
      }
    } else if (currentStageInfo.stage === 2) {
      if ((lead.onboardingCompletion || 0) < 60) {
        missingFields.push('Preferred Lease Length');
      } else if ((lead.onboardingCompletion || 0) < 75) {
        missingFields.push('Maintenance Approval Limit');
      }
    } else if (currentStageInfo.stage === 3) {
      if ((lead.onboardingCompletion || 0) < 85) {
        missingFields.push('Property Management Agreement', 'W9 Tax Form');
      } else if ((lead.onboardingCompletion || 0) < 100) {
        missingFields.push('Electronic Signature');
      }
    }
    
    return missingFields;
  };

  const OnboardingStatusCard = ({ lead, onClick }) => {
    const stageInfo = getOnboardingStage(lead.onboardingCompletion || 0);
    const missingFields = getMissingFields(lead);
    const StageIcon = stageInfo.icon;
    
    return (
      <div className="onboarding-status-card" onClick={() => onClick(lead.id)}>
        <div className="onboarding-status-header">
          <div className="lead-card-avatar">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div className="onboarding-status-info">
            <div className="lead-card-name">{lead.firstName} {lead.lastName}</div>
            <div className="onboarding-progress-mini">
              <div className="progress-bar-sm">
                <div 
                  className="progress-fill" 
                  style={{ width: `${lead.onboardingCompletion || 0}%` }}
                />
              </div>
              <span className="progress-text-sm">{lead.onboardingCompletion || 0}% complete</span>
            </div>
          </div>
        </div>

        {/* Stage Progress Indicators */}
        <div className="onboarding-stages">
          {mockOnboardingForm.sections.map((section, index) => {
            const sectionIcon = index === 0 ? User : index === 1 ? Home : index === 2 ? Settings : FileText;
            const SectionIcon = sectionIcon;
            const isCompleted = stageInfo.stage > index;
            const isCurrent = stageInfo.stage === index;
            
            return (
              <div 
                key={section.id}
                className={`stage-indicator ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                title={section.title}
              >
                <div className="stage-indicator-icon">
                  {isCompleted ? (
                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                  ) : isCurrent ? (
                    <Clock size={16} style={{ color: '#f59e0b' }} />
                  ) : (
                    <SectionIcon size={16} style={{ color: '#cbd5e1' }} />
                  )}
                </div>
                <div className="stage-indicator-label">{section.title.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>

        {/* Current Stage & Missing Info */}
        <div className="onboarding-current-stage">
          <div className="current-stage-badge">
            <StageIcon size={14} />
            <span>Current: {stageInfo.name}</span>
          </div>
          {missingFields.length > 0 && (
            <div className="missing-fields-badge">
              <AlertCircle size={14} style={{ color: '#ef4444' }} />
              <span>{missingFields.length} field{missingFields.length !== 1 ? 's' : ''} needed</span>
            </div>
          )}
        </div>

        {/* Missing Fields List */}
        {missingFields.length > 0 && (
          <div className="missing-fields-list">
            <div className="missing-fields-title">
              <AlertCircle size={16} />
              Action Required: {missingFields.length} Missing Field{missingFields.length !== 1 ? 's' : ''}
            </div>
            <ul className="missing-fields-items">
              {missingFields.map((field, index) => (
                <li key={index}>
                  <AlertCircle size={12} />
                  {field}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--danger)', fontWeight: '500' }}>
              ⚠️ Owner must complete these fields before approval
            </div>
          </div>
        )}

        <div className="lead-card-meta" style={{ marginTop: '0.75rem' }}>
          <span className="meta-item">
            <Clock size={14} />
            {formatDate(lead.updatedAt)}
          </span>
          {lead.assignedTo && (
            <span className="meta-item">
              <Users size={14} />
              {lead.assignedTo}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="owner-leads-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Owner Leads</h1>
          <p className="dashboard-subtitle">Manage and track your owner lead pipeline</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary" onClick={onCreateLead}>
            <UserPlus size={18} />
            New Lead
          </button>
        </div>
      </div>

      {/* Stats Cards - Single Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
        <StatsCard
          title="Partial Leads"
          value={stats.partial}
          icon={AlertCircle}
          color="#f59e0b"
        />
        <StatsCard
          title="Qualified Leads"
          value={stats.qualified}
          icon={CheckCircle}
          color="#10b981"
        />
        <StatsCard
          title="In Onboarding"
          value={stats.onboarding}
          icon={Clock}
          color="#8b5cf6"
          onClick={() => onNavigateToList('onboarding')}
        />
      </div>

      {/* Tasks Section - Full Width */}
      <div style={{ marginBottom: '2rem' }}>
        <TasksWidget onNavigateToLead={onNavigateToLead} />
      </div>

      {/* Lead Stages - Partial and Qualified in One Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Partial Leads */}
        <div className="leads-section">
          <div className="section-header collapsible" onClick={() => toggleSection('partial')}>
            <h2 className="section-title">
              <span className="collapse-icon">
                {collapsedSections.partial ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
              <AlertCircle size={20} style={{ color: '#f59e0b' }} />
              Partial Leads ({partialLeads.length})
            </h2>
            <button 
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToList('partial');
              }}
            >
              View All
            </button>
          </div>
          {!collapsedSections.partial && (
            <div className="leads-list">
              {partialLeads.length > 0 ? (
                partialLeads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onClick={onNavigateToLead} />
                ))
              ) : (
                <div className="empty-state">No partial leads</div>
              )}
            </div>
          )}
        </div>

        {/* Qualified Leads */}
        <div className="leads-section">
          <div className="section-header collapsible" onClick={() => toggleSection('qualified')}>
            <h2 className="section-title">
              <span className="collapse-icon">
                {collapsedSections.qualified ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
              <CheckCircle size={20} style={{ color: '#10b981' }} />
              Qualified Leads ({qualifiedLeads.length})
            </h2>
            <button 
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToList('qualified');
              }}
            >
              View All
            </button>
          </div>
          {!collapsedSections.qualified && (
            <div className="leads-list">
              {qualifiedLeads.length > 0 ? (
                qualifiedLeads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onClick={onNavigateToLead} />
                ))
              ) : (
                <div className="empty-state">No qualified leads</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Section - Full Width Row */}
      <div>
        {/* Approved Leads / Onboarding */}
        <div className="leads-section">
            <div className="section-header collapsible" onClick={() => toggleSection('approved')}>
              <h2 className="section-title">
                <span className="collapse-icon">
                  {collapsedSections.approved ? (
                    <ChevronRight size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </span>
                <Clock size={20} style={{ color: '#8b5cf6' }} />
                In Onboarding ({leads.filter(l => l.onboardingStatus === 'in_progress').length})
              </h2>
              <button 
                className="btn-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToList('onboarding');
                }}
              >
                View All
              </button>
            </div>
            {!collapsedSections.approved && (
              <div className="leads-list">
                {leads.filter(l => l.onboardingStatus === 'in_progress').length > 0 ? (
                  leads.filter(l => l.onboardingStatus === 'in_progress').slice(0, 5).map(lead => (
                    <OnboardingStatusCard key={lead.id} lead={lead} onClick={onNavigateToLead} />
                  ))
                ) : (
                  <div className="empty-state">No leads in onboarding</div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OwnerLeadsDashboard;

