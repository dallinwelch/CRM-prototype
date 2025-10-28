import React, { useState } from 'react';
import { Play, Pause, Edit, Trash2, ExternalLink, Zap, Clock, CheckCircle, AlertCircle, Folder, FolderOpen, Plus, ChevronRight, ChevronDown, MoreVertical, FolderPlus, FolderEdit, FolderX, X, Database } from 'lucide-react';
import VisualWorkflowBuilder from './VisualWorkflowBuilder';

const AutomationsTab = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['system', 'lead-management', 'customer-service']));
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [editingWorkflowId, setEditingWorkflowId] = useState(null);
  const [selectedFolderForNew, setSelectedFolderForNew] = useState(null);

  // Folder and automation data structure
  const [folders, setFolders] = useState([
    {
      id: 'system',
      name: 'System',
      type: 'system',
      parentId: null,
      children: ['lead-management', 'customer-service', 'data-sync'],
      workflows: [1, 2, 3]
    },
    {
      id: 'lead-management',
      name: 'Lead Management',
      type: 'custom',
      parentId: 'system',
      children: ['lead-nurturing'],
      workflows: [4, 5, 6]
    },
    {
      id: 'lead-nurturing',
      name: 'Lead Nurturing',
      type: 'custom',
      parentId: 'lead-management',
      children: [],
      workflows: [7, 8, 9]
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      type: 'custom',
      parentId: 'system',
      children: [],
      workflows: [10, 11, 12]
    },
    {
      id: 'data-sync',
      name: 'Data Synchronization',
      type: 'custom',
      parentId: 'system',
      children: ['backup-systems', 'integration-tools'],
      workflows: [13, 14, 15]
    },
    {
      id: 'backup-systems',
      name: 'Backup Systems',
      type: 'custom',
      parentId: 'data-sync',
      children: [],
      workflows: []
    },
    {
      id: 'integration-tools',
      name: 'Integration Tools',
      type: 'custom',
      parentId: 'data-sync',
      children: [],
      workflows: []
    },
    {
      id: 'marketing-automation',
      name: 'Marketing Automation',
      type: 'custom',
      parentId: null,
      children: ['email-campaigns', 'social-media'],
      workflows: []
    },
    {
      id: 'email-campaigns',
      name: 'Email Campaigns',
      type: 'custom',
      parentId: 'marketing-automation',
      children: [],
      workflows: []
    },
    {
      id: 'social-media',
      name: 'Social Media',
      type: 'custom',
      parentId: 'marketing-automation',
      children: [],
      workflows: []
    }
  ]);

  const [automations, setAutomations] = useState([
    // System Folder Workflows
    {
      id: 1,
      name: 'New Lead Follow-up',
      description: 'Automatically sends welcome email and creates follow-up task when a new lead is added',
      status: 'active',
      lastRun: '2024-01-14T10:30:00Z',
      nextRun: '2024-01-15T09:00:00Z',
      runs: 24,
      successRate: 95.8,
      triggers: ['New Lead Created', 'Email Sent'],
      actions: ['Send Welcome Email', 'Create Follow-up Task', 'Update Lead Status'],
      folderId: 'system'
    },
    {
      id: 2,
      name: 'Task Deadline Reminder',
      description: 'Sends reminder notifications 24 hours before task deadline and escalates overdue tasks',
      status: 'active',
      lastRun: '2024-01-14T14:15:00Z',
      nextRun: '2024-01-15T08:00:00Z',
      runs: 156,
      successRate: 98.7,
      triggers: ['Task Deadline Approaching', 'Task Overdue'],
      actions: ['Send Email Reminder', 'Notify Manager', 'Update Task Priority'],
      folderId: 'system'
    },
    {
      id: 3,
      name: 'System Health Check',
      description: 'Monitors system performance and sends alerts for critical issues',
      status: 'active',
      lastRun: '2024-01-14T23:59:00Z',
      nextRun: '2024-01-15T00:00:00Z',
      runs: 365,
      successRate: 99.8,
      triggers: ['Hourly Schedule', 'System Alert'],
      actions: ['Check System Status', 'Send Alert Email', 'Log Performance Data'],
      folderId: 'system'
    },

    // Lead Management Folder Workflows
    {
      id: 4,
      name: 'Lead Qualification',
      description: 'Automatically qualifies leads based on predefined criteria',
      status: 'active',
      lastRun: '2024-01-13T16:45:00Z',
      nextRun: '2024-01-16T10:00:00Z',
      runs: 89,
      successRate: 92.1,
      triggers: ['Lead Created', 'Lead Updated'],
      actions: ['Score Lead', 'Update Lead Status', 'Assign to Sales Rep'],
      folderId: 'lead-management'
    },
    {
      id: 5,
      name: 'Lead Assignment',
      description: 'Automatically assigns new leads to available sales representatives',
      status: 'active',
      lastRun: '2024-01-14T09:30:00Z',
      nextRun: '2024-01-15T09:00:00Z',
      runs: 67,
      successRate: 96.3,
      triggers: ['New Lead Created', 'Lead Status Changed'],
      actions: ['Check Sales Rep Availability', 'Assign Lead', 'Send Notification'],
      folderId: 'lead-management'
    },
    {
      id: 6,
      name: 'Lead Scoring Update',
      description: 'Updates lead scores based on engagement and behavior',
      status: 'active',
      lastRun: '2024-01-14T12:00:00Z',
      nextRun: '2024-01-15T12:00:00Z',
      runs: 234,
      successRate: 94.7,
      triggers: ['Lead Interaction', 'Email Opened', 'Website Visit'],
      actions: ['Calculate New Score', 'Update Lead Record', 'Trigger Follow-up'],
      folderId: 'lead-management'
    },

    // Lead Nurturing Folder Workflows
    {
      id: 7,
      name: 'Email Nurture Sequence',
      description: 'Sends automated email sequence to nurture leads',
      status: 'active',
      lastRun: '2024-01-13T16:45:00Z',
      nextRun: '2024-01-16T10:00:00Z',
      runs: 45,
      successRate: 94.2,
      triggers: ['Lead Added to Nurture List'],
      actions: ['Send Welcome Email', 'Send Follow-up Emails', 'Track Engagement'],
      folderId: 'lead-nurturing'
    },
    {
      id: 8,
      name: 'Drip Campaign Manager',
      description: 'Manages multi-step email campaigns based on lead behavior',
      status: 'active',
      lastRun: '2024-01-14T08:00:00Z',
      nextRun: '2024-01-15T08:00:00Z',
      runs: 123,
      successRate: 91.5,
      triggers: ['Email Opened', 'Link Clicked', 'Time Delay'],
      actions: ['Send Next Email', 'Update Campaign Status', 'Track Progress'],
      folderId: 'lead-nurturing'
    },
    {
      id: 9,
      name: 'Re-engagement Campaign',
      description: 'Re-engages dormant leads with targeted content',
      status: 'inactive',
      lastRun: '2024-01-10T14:30:00Z',
      nextRun: '2024-01-20T14:30:00Z',
      runs: 12,
      successRate: 88.9,
      triggers: ['Lead Inactive 30 Days', 'No Engagement'],
      actions: ['Send Re-engagement Email', 'Offer Special Content', 'Update Lead Status'],
      folderId: 'lead-nurturing'
    },

    // Customer Service Folder Workflows
    {
      id: 10,
      name: 'Customer Satisfaction Survey',
      description: 'Sends satisfaction survey 7 days after task completion and processes responses',
      status: 'active',
      lastRun: '2024-01-13T16:45:00Z',
      nextRun: '2024-01-16T10:00:00Z',
      runs: 89,
      successRate: 92.1,
      triggers: ['Task Completed', 'Survey Response Received'],
      actions: ['Send Survey Email', 'Process Response', 'Update Customer Record'],
      folderId: 'customer-service'
    },
    {
      id: 11,
      name: 'Support Ticket Escalation',
      description: 'Automatically escalates support tickets based on priority and response time',
      status: 'active',
      lastRun: '2024-01-14T15:30:00Z',
      nextRun: '2024-01-15T15:30:00Z',
      runs: 34,
      successRate: 97.1,
      triggers: ['Ticket Created', 'Response Time Exceeded', 'Priority High'],
      actions: ['Escalate to Manager', 'Send Notification', 'Update Ticket Status'],
      folderId: 'customer-service'
    },
    {
      id: 12,
      name: 'Customer Onboarding',
      description: 'Automated onboarding sequence for new customers',
      status: 'active',
      lastRun: '2024-01-14T11:20:00Z',
      nextRun: '2024-01-15T11:20:00Z',
      runs: 56,
      successRate: 96.4,
      triggers: ['Customer Signed Up', 'Payment Processed'],
      actions: ['Send Welcome Package', 'Schedule Onboarding Call', 'Create Account'],
      folderId: 'customer-service'
    },

    // Data Synchronization Folder Workflows
    {
      id: 13,
      name: 'Data Synchronization',
      description: 'Syncs customer data with external systems and updates CRM records',
      status: 'active',
      lastRun: '2024-01-14T23:59:00Z',
      nextRun: '2024-01-15T00:00:00Z',
      runs: 365,
      successRate: 99.2,
      triggers: ['Daily Schedule', 'Data Change Detected'],
      actions: ['Export Data', 'Import Updates', 'Validate Records'],
      folderId: 'data-sync'
    },
    {
      id: 14,
      name: 'Backup Automation',
      description: 'Automatically backs up critical data to secure cloud storage',
      status: 'active',
      lastRun: '2024-01-14T02:00:00Z',
      nextRun: '2024-01-15T02:00:00Z',
      runs: 365,
      successRate: 99.9,
      triggers: ['Daily Schedule', 'Data Change Threshold'],
      actions: ['Create Backup', 'Upload to Cloud', 'Verify Integrity'],
      folderId: 'data-sync'
    },
    {
      id: 15,
      name: 'Data Quality Check',
      description: 'Validates data integrity and cleans up duplicate records',
      status: 'active',
      lastRun: '2024-01-14T03:00:00Z',
      nextRun: '2024-01-15T03:00:00Z',
      runs: 365,
      successRate: 98.7,
      triggers: ['Weekly Schedule', 'Data Import'],
      actions: ['Validate Data', 'Remove Duplicates', 'Update Records'],
      folderId: 'data-sync'
    }
  ]);

  const n8nWorkflows = [
    {
      id: 'wf-001',
      name: 'Lead Processing Pipeline',
      status: 'active',
      lastModified: '2024-01-12T14:30:00Z',
      nodes: 8,
      executions: 45
    },
    {
      id: 'wf-002',
      name: 'Email Automation Suite',
      status: 'active',
      lastModified: '2024-01-10T09:15:00Z',
      nodes: 12,
      executions: 128
    },
    {
      id: 'wf-003',
      name: 'Data Integration Hub',
      status: 'inactive',
      lastModified: '2024-01-08T16:45:00Z',
      nodes: 15,
      executions: 23
    }
  ];

  // Folder management functions
  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        type: 'custom',
        parentId: newFolderParent,
        children: [],
        workflows: []
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setNewFolderParent(null);
      setShowCreateFolder(false);
    }
  };

  const updateFolder = (folderId, newName) => {
    if (newName.trim()) {
      setFolders(folders.map(folder => 
        folder.id === folderId ? { ...folder, name: newName.trim() } : folder
      ));
      setEditingFolder(null);
      setEditingFolderName('');
    }
  };

  const deleteFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder && folder.type === 'custom') {
      // Move workflows to parent folder or root
      const workflowsToMove = automations.filter(a => a.folderId === folderId);
      setAutomations(automations.map(automation => 
        automation.folderId === folderId 
          ? { ...automation, folderId: folder.parentId || 'system' }
          : automation
      ));
      
      // Remove folder and update parent's children
      setFolders(folders.filter(f => f.id !== folderId).map(f => 
        f.children.includes(folderId) 
          ? { ...f, children: f.children.filter(id => id !== folderId) }
          : f
      ));
    }
  };

  const getFolderById = (folderId) => folders.find(f => f.id === folderId);
  const getRootFolders = () => folders.filter(f => f.parentId === null);
  const getChildFolders = (parentId) => folders.filter(f => f.parentId === parentId);
  const getFolderWorkflows = (folderId) => automations.filter(a => a.folderId === folderId);

  // Workflow management functions
  const toggleWorkflowStatus = (workflowId) => {
    setAutomations(automations.map(automation => 
      automation.id === workflowId 
        ? { ...automation, status: automation.status === 'active' ? 'inactive' : 'active' }
        : automation
    ));
  };

  const editWorkflow = (workflowId) => {
    const workflow = automations.find(a => a.id === workflowId);
    if (workflow) {
      setEditingWorkflow(workflow);
      setShowEditModal(true);
    }
  };

  const deleteWorkflow = (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      setAutomations(automations.filter(automation => automation.id !== workflowId));
    }
  };

  const saveWorkflowEdit = (updatedWorkflow) => {
    setAutomations(automations.map(automation => 
      automation.id === updatedWorkflow.id ? updatedWorkflow : automation
    ));
    setShowEditModal(false);
    setEditingWorkflow(null);
  };

  const createNewWorkflow = (folderId) => {
    setSelectedFolderForNew(folderId);
    setEditingWorkflowId(null);
    setShowWorkflowBuilder(true);
  };

  const editWorkflowInBuilder = (workflowId) => {
    setEditingWorkflowId(workflowId);
    setShowWorkflowBuilder(true);
  };

  const closeWorkflowBuilder = () => {
    setShowWorkflowBuilder(false);
    setEditingWorkflowId(null);
    setSelectedFolderForNew(null);
  };

  const filteredAutomations = activeFilter === 'all' 
    ? automations 
    : automations.filter(automation => automation.status === activeFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color="#16a34a" />;
      case 'inactive': return <Pause size={16} color="#64748b" />;
      case 'error': return <AlertCircle size={16} color="#dc2626" />;
      default: return <Clock size={16} color="#64748b" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'error': return 'status-error';
      default: return 'status-inactive';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return '#16a34a';
    if (rate >= 85) return '#d97706';
    return '#dc2626';
  };

  // Toggle slider component
  const ToggleSlider = ({ isActive, onToggle, workflowId }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
      <button
        onClick={() => onToggle(workflowId)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: isActive ? '#10b981' : '#d1d5db',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            position: 'absolute',
            top: '2px',
            left: isActive ? '22px' : '2px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </button>
    </div>
  );

  // Render folder tree component
  const renderFolderTree = (folderId, level = 0) => {
    const folder = getFolderById(folderId);
    if (!folder) return null;

    const isExpanded = expandedFolders.has(folderId);
    const childFolders = getChildFolders(folderId);
    const workflows = getFolderWorkflows(folderId);
    const isSystemFolder = folder.type === 'system';

    return (
      <div key={folderId} style={{ marginLeft: `${level * 20}px` }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem',
          borderRadius: '4px',
          backgroundColor: isSystemFolder ? '#f8fafc' : 'transparent',
          border: isSystemFolder ? '1px solid #e2e8f0' : 'none',
          marginBottom: '0.25rem'
        }}>
          <button
            onClick={() => toggleFolder(folderId)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              marginRight: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {childFolders.length > 0 ? (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            ) : (
              <div style={{ width: '16px' }} />
            )}
          </button>
          
          {isExpanded ? <FolderOpen size={16} color={isSystemFolder ? '#3b82f6' : '#64748b'} /> : <Folder size={16} color={isSystemFolder ? '#3b82f6' : '#64748b'} />}
          
          <div style={{ 
            marginLeft: '0.5rem', 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {editingFolder === folderId ? (
              <input
                type="text"
                value={editingFolderName}
                onChange={(e) => setEditingFolderName(e.target.value)}
                onBlur={() => updateFolder(folderId, editingFolderName)}
                onKeyPress={(e) => e.key === 'Enter' && updateFolder(folderId, editingFolderName)}
                style={{
                  padding: '0.25rem 0.5rem',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  width: '150px'
                }}
                autoFocus
              />
            ) : (
              <span style={{ 
                fontWeight: isSystemFolder ? '600' : '500',
                color: isSystemFolder ? '#1e293b' : '#374151'
              }}>
                {folder.name}
              </span>
            )}
            
            <span style={{ 
              fontSize: '0.75rem', 
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '0.125rem 0.375rem',
              borderRadius: '12px'
            }}>
              {workflows.length}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => createNewWorkflow(folderId)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                color: '#10b981'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Create Workflow"
            >
              <Plus size={14} />
            </button>
            {!isSystemFolder && (
              <>
                <button
                  onClick={() => {
                    setEditingFolder(folderId);
                    setEditingFolderName(folder.name);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    color: '#64748b'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Edit Folder"
                >
                  <FolderEdit size={14} />
                </button>
                <button
                  onClick={() => deleteFolder(folderId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    color: '#dc2626'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title="Delete Folder"
                >
                  <FolderX size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {isExpanded && (
          <div>
            {/* Render workflows in this folder */}
            {workflows.map(automation => (
              <div key={automation.id} style={{
                marginLeft: '2rem',
                padding: '0.5rem',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                marginBottom: '0.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={14} color="#3b82f6" />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{automation.name}</span>
                    <span className={`automation-status ${getStatusColor(automation.status)}`} style={{ fontSize: '0.75rem' }}>
                      {automation.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {automation.description}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    onClick={() => editWorkflowInBuilder(automation.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      color: '#3b82f6'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Edit Workflow"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => deleteWorkflow(automation.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      color: '#dc2626'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Delete Workflow"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Render child folders */}
            {childFolders.map(childFolderId => renderFolderTree(childFolderId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header Section with Create Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#1e293b' 
          }}>
            Workflow Automations
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: '#64748b',
            fontSize: '1rem'
          }}>
            Create and manage automated workflows for your business processes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowCreateFolder(true)}
          >
            <FolderPlus size={16} style={{ marginRight: '6px' }} />
            Create Folder
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => createNewWorkflow('system')}
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            Create Workflow
          </button>
        </div>
      </div>



          {/* Folder Tree */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '6px', 
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>Workflow Folders</h3>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {automations.length} total workflows
              </span>
            </div>
            
            {getRootFolders().length > 0 ? (
              getRootFolders().map(folder => renderFolderTree(folder.id))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#64748b' 
              }}>
                <Folder size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No folders found. Create your first folder to organize workflows.</p>
              </div>
            )}
          </div>


          {/* Create Folder Modal */}
          {showCreateFolder && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                minWidth: '400px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Create New Folder</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Folder Name</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    className="form-input"
                    autoFocus
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Parent Folder (Optional)</label>
                  <select
                    value={newFolderParent || ''}
                    onChange={(e) => setNewFolderParent(e.target.value || null)}
                    className="form-input"
                  >
                    <option value="">Root Level</option>
                    {folders.filter(f => f.type === 'custom').map(folder => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateFolder(false);
                      setNewFolderName('');
                      setNewFolderParent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={createFolder}
                    disabled={!newFolderName.trim()}
                  >
                    Create Folder
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Automation Cards */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
              All Workflows ({filteredAutomations.length})
            </h3>
            <div className="automation-grid">
              {filteredAutomations.map(automation => (
                <div key={automation.id} className="automation-card">
                  <div className="automation-header">
                    <div>
                      <h3 className="automation-title">{automation.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {getStatusIcon(automation.status)}
                        <span className={`automation-status ${getStatusColor(automation.status)}`}>
                          {automation.status}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '12px'
                        }}>
                          {getFolderById(automation.folderId)?.name || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="automation-description">{automation.description}</p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Success Rate:</span>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        color: getSuccessRateColor(automation.successRate)
                      }}>
                        {automation.successRate}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total Runs:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{automation.runs}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Last Run:</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                        {formatDate(automation.lastRun)}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Triggers:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {automation.triggers.map((trigger, index) => (
                        <span key={index} style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Actions:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {automation.actions.map((action, index) => (
                        <span key={index} style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#dbeafe',
                          color: '#2563eb',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="automation-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => editWorkflowInBuilder(automation.id)}
                    >
                      <Edit size={14} style={{ marginRight: '4px' }} />
                      Edit
                    </button>
                    <ToggleSlider 
                      isActive={automation.status === 'active'} 
                      onToggle={toggleWorkflowStatus}
                      workflowId={automation.id}
                    />
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => deleteWorkflow(automation.id)}
                      style={{ color: '#dc2626' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredAutomations.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: '#64748b' 
              }}>
                <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No automations found for the selected filter.</p>
              </div>
            )}
          </div>
        
      

      {/* n8n Workflows Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">n8n Workflows Overview</h3>
          <p className="card-subtitle">Quick overview of your n8n workflow instances</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {n8nWorkflows.map(workflow => (
              <div key={workflow.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: '#f8fafc'
              }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{workflow.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    ID: {workflow.id} • {workflow.nodes} nodes • {workflow.executions} executions
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Last modified: {formatDate(workflow.lastModified)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(workflow.status)}
                    <span className={`automation-status ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  <button className="btn btn-secondary btn-sm">
                    <ExternalLink size={14} style={{ marginRight: '4px' }} />
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen Workflow Builder */}
      {showWorkflowBuilder && (
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
              {editingWorkflowId ? 'Edit Workflow' : 'Create New Workflow'}
            </h2>
            <button
              onClick={closeWorkflowBuilder}
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
              editingWorkflowId={editingWorkflowId}
              selectedFolder={selectedFolderForNew}
              onClose={closeWorkflowBuilder}
              onSave={(workflow) => {
                if (editingWorkflowId) {
                  // Update existing workflow
                  setAutomations(automations.map(a => a.id === editingWorkflowId ? workflow : a));
                } else {
                  // Add new workflow
                  setAutomations([...automations, workflow]);
                }
                closeWorkflowBuilder();
              }}
            />
          </div>
        </div>
        )}
    </div>
  );
};

export default AutomationsTab;
