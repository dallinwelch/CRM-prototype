import React, { useState } from 'react';
import { 
  Plus,
  Play,
  Pause,
  Copy,
  Edit,
  Trash2,
  Zap,
  Mail,
  MessageSquare,
  CheckSquare,
  UserPlus,
  Bell,
  Settings,
  AlertCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react';
import { mockAutomations, currentUser } from '../mockData';
import VisualWorkflowBuilder from './VisualWorkflowBuilder';

const AutomationsManager = () => {
  const [automations, setAutomations] = useState(mockAutomations);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, inactive, templates

  const canEdit = currentUser.permissions.createEditAutomations;

  const getFilteredAutomations = () => {
    let filtered = automations;

    switch (filter) {
      case 'active':
        filtered = automations.filter(a => a.isActive);
        break;
      case 'inactive':
        filtered = automations.filter(a => !a.isActive);
        break;
      case 'templates':
        filtered = automations.filter(a => a.isTemplate);
        break;
      default:
        filtered = automations.filter(a => !a.isTemplate);
    }

    return filtered;
  };

  const filteredAutomations = getFilteredAutomations();

  const toggleAutomation = (automationId) => {
    if (!canEdit) return;
    
    setAutomations(automations.map(a => 
      a.id === automationId ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const duplicateAutomation = (automation) => {
    if (!canEdit) return;

    const newAutomation = {
      ...automation,
      id: `auto-${Date.now()}`,
      name: `${automation.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAutomations([...automations, newAutomation]);
  };

  const deleteAutomation = (automationId) => {
    if (!canEdit) return;
    
    if (window.confirm('Are you sure you want to delete this automation?')) {
      setAutomations(automations.filter(a => a.id !== automationId));
    }
  };

  const getTriggerLabel = (trigger) => {
    const labels = {
      'lead_created': 'New Lead Created',
      'lead_approved': 'Lead Approved',
      'lead_created_partial': 'Partial Lead Created',
      'onboarding_started': 'Onboarding Started',
      'onboarding_completed': 'Onboarding Completed',
      'property_added': 'Property Added'
    };
    return labels[trigger] || trigger;
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'send_email': return <Mail size={16} />;
      case 'send_sms': return <MessageSquare size={16} />;
      case 'create_task': return <CheckSquare size={16} />;
      case 'assign': return <UserPlus size={16} />;
      case 'send_notification': return <Bell size={16} />;
      default: return <Zap size={16} />;
    }
  };

  const getActionLabel = (action) => {
    switch (action.type) {
      case 'send_email':
        return `Send email: ${action.template}`;
      case 'send_sms':
        return `Send SMS: ${action.template}`;
      case 'create_task':
        return `Create task: ${action.taskType} (due in ${action.dueInDays}d)`;
      case 'create_task_sequence':
        return `Create task sequence: ${action.cadence} cadence`;
      case 'assign':
        return `Assign to: ${action.target}`;
      case 'send_notification':
        return `Send notification to: ${action.recipients}`;
      default:
        return action.type;
    }
  };

  const AutomationCard = ({ automation }) => (
    <div className="automation-card">
      <div className="automation-card-header">
        <div className="automation-card-title-row">
          <div className="automation-icon">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="automation-title">{automation.name}</h3>
            <p className="automation-description">{automation.description}</p>
          </div>
        </div>
        <div className="automation-card-actions">
          <button
            className={`toggle-btn ${automation.isActive ? 'active' : ''}`}
            onClick={() => toggleAutomation(automation.id)}
            disabled={!canEdit}
            title={automation.isActive ? 'Deactivate' : 'Activate'}
          >
            {automation.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </button>
        </div>
      </div>

      <div className="automation-card-content">
        <div className="automation-trigger">
          <div className="automation-label">
            <Settings size={14} />
            <span>Trigger</span>
          </div>
          <div className="trigger-badge">{getTriggerLabel(automation.trigger)}</div>
        </div>

        <div className="automation-actions-list">
          <div className="automation-label">
            <Zap size={14} />
            <span>Actions ({automation.actions.length})</span>
          </div>
          <div className="actions-flow">
            {automation.actions.map((action, index) => (
              <div key={index} className="action-item">
                <div className="action-icon">
                  {getActionIcon(action.type)}
                </div>
                <div className="action-label">
                  {getActionLabel(action)}
                </div>
                {index < automation.actions.length - 1 && (
                  <ChevronRight size={16} className="action-arrow" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="automation-card-footer">
        <div className="automation-status">
          <span className={`status-dot ${automation.isActive ? 'active' : 'inactive'}`} />
          {automation.isActive ? 'Active' : 'Inactive'}
        </div>
        {canEdit && (
          <div className="automation-card-buttons">
            <button
              className="btn-icon"
              onClick={() => duplicateAutomation(automation)}
              title="Duplicate"
            >
              <Copy size={16} />
            </button>
            <button
              className="btn-icon"
              onClick={() => {
                setSelectedAutomation(automation);
                setShowEditor(true);
              }}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              className="btn-icon"
              onClick={() => deleteAutomation(automation.id)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="automations-manager">
      <div className="automations-header">
        <div>
          <h1 className="automations-title">Automations</h1>
          <p className="automations-subtitle">
            Automate your owner lead workflow with triggers and actions
          </p>
        </div>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setShowEditor(true)}>
            <Plus size={18} />
            New Automation
          </button>
        )}
      </div>

      {!canEdit && (
        <div className="permissions-notice">
          <AlertCircle size={18} />
          <span>You don't have permission to create or edit automations. Contact your admin for access.</span>
        </div>
      )}

      <div className="automations-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Automations
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </button>
          <button
            className={`filter-tab ${filter === 'templates' ? 'active' : ''}`}
            onClick={() => setFilter('templates')}
          >
            Templates
          </button>
        </div>
      </div>

      <div className="automations-grid">
        {filteredAutomations.length === 0 ? (
          <div className="empty-state">
            <Zap size={64} style={{ opacity: 0.2 }} />
            <h3>No automations found</h3>
            <p>
              {filter === 'templates' 
                ? 'No automation templates available'
                : 'Get started by creating your first automation'
              }
            </p>
            {canEdit && filter !== 'templates' && (
              <button className="btn btn-primary" onClick={() => setShowEditor(true)}>
                <Plus size={18} />
                Create Automation
              </button>
            )}
          </div>
        ) : (
          filteredAutomations.map(automation => (
            <AutomationCard key={automation.id} automation={automation} />
          ))
        )}
      </div>

      {/* Automation Templates Section */}
      {filter === 'all' && (
        <div className="templates-section">
          <h2 className="section-title">Automation Templates</h2>
          <p className="section-subtitle">
            Pre-built automation templates you can duplicate and customize
          </p>
          <div className="templates-grid">
            <div className="template-card">
              <Zap size={24} className="template-icon" />
              <h3>Welcome Series</h3>
              <p>Automated welcome sequence for new approved leads</p>
              {canEdit && (
                <button className="btn btn-sm btn-secondary">
                  <Copy size={14} />
                  Use Template
                </button>
              )}
            </div>
            <div className="template-card">
              <Zap size={24} className="template-icon" />
              <h3>Follow-up Cadence</h3>
              <p>Fibonacci follow-up sequence for partial leads</p>
              {canEdit && (
                <button className="btn btn-sm btn-secondary">
                  <Copy size={14} />
                  Use Template
                </button>
              )}
            </div>
            <div className="template-card">
              <Zap size={24} className="template-icon" />
              <h3>Onboarding Reminders</h3>
              <p>Remind owners to complete their onboarding</p>
              {canEdit && (
                <button className="btn btn-sm btn-secondary">
                  <Copy size={14} />
                  Use Template
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visual Workflow Builder Modal */}
      {showEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1rem 2rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc'
          }}>
            <h2 style={{ margin: 0, color: '#1e293b' }}>
              {selectedAutomation ? 'Edit Automation' : 'Create New Automation'}
            </h2>
            <button
              onClick={() => {
                setShowEditor(false);
                setSelectedAutomation(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                color: '#64748b'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <VisualWorkflowBuilder 
              editingWorkflowId={selectedAutomation?.id}
              selectedFolder="system"
              onClose={() => {
                setShowEditor(false);
                setSelectedAutomation(null);
              }}
              onSave={(workflow) => {
                if (selectedAutomation) {
                  // Update existing automation
                  setAutomations(automations.map(a => 
                    a.id === selectedAutomation.id ? { ...a, ...workflow } : a
                  ));
                } else {
                  // Add new automation
                  setAutomations([...automations, workflow]);
                }
                setShowEditor(false);
                setSelectedAutomation(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationsManager;

