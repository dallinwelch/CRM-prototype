import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Settings,
  Mail,
  MessageSquare,
  Users,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  FileText,
  Database,
  Zap
} from 'lucide-react';

const WorkflowBuilder = ({ editingWorkflowId, selectedFolder, onClose, onSave }) => {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'New Lead Welcome',
      status: 'active',
      description: 'Send welcome email when new lead is added',
      lastRun: '2024-01-14T10:30:00Z',
      runs: 24
    },
    {
      id: 2,
      name: 'Tour Reminder',
      status: 'active',
      description: 'Send text reminder 1 hour before scheduled tour',
      lastRun: '2024-01-14T14:15:00Z',
      runs: 8
    },
    {
      id: 3,
      name: 'Application Follow-up',
      status: 'inactive',
      description: 'Move lead to applicant stage after form submission',
      lastRun: '2024-01-13T16:45:00Z',
      runs: 12
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowFolder, setWorkflowFolder] = useState(selectedFolder || 'system');

  // Effect to handle editing existing workflows
  useEffect(() => {
    if (editingWorkflowId) {
      // In a real app, you would fetch the workflow data here
      // For now, we'll simulate loading the workflow
      const workflow = workflows.find(w => w.id === editingWorkflowId);
      if (workflow) {
        setWorkflowName(workflow.name);
        setWorkflowDescription(workflow.description);
        setWorkflowFolder(workflow.folderId || 'system');
        setWorkflowSteps(workflow.steps || []);
        setShowBuilder(true);
      }
    } else if (selectedFolder) {
      setWorkflowFolder(selectedFolder);
      setShowBuilder(true);
    }
  }, [editingWorkflowId, selectedFolder]);

  // Folder data structure
  const [folders, setFolders] = useState([
    {
      id: 'system',
      name: 'System',
      type: 'system',
      parentId: null,
      children: ['lead-management', 'customer-service', 'data-sync'],
      workflows: []
    },
    {
      id: 'lead-management',
      name: 'Lead Management',
      type: 'custom',
      parentId: 'system',
      children: ['lead-nurturing'],
      workflows: []
    },
    {
      id: 'lead-nurturing',
      name: 'Lead Nurturing',
      type: 'custom',
      parentId: 'lead-management',
      children: [],
      workflows: []
    },
    {
      id: 'customer-service',
      name: 'Customer Service',
      type: 'custom',
      parentId: 'system',
      children: [],
      workflows: []
    },
    {
      id: 'data-sync',
      name: 'Data Synchronization',
      type: 'custom',
      parentId: 'system',
      children: [],
      workflows: []
    }
  ]);

  // Available blocks/connectors
  const blockCategories = [
    {
      name: 'Triggers',
      color: '#3b82f6',
      blocks: [
        { id: 'new-lead', name: 'New Lead Added', icon: UserPlus, description: 'When someone fills out a lead form' },
        { id: 'lead-stage-change', name: 'Lead Stage Changed', icon: ArrowRight, description: 'When lead moves between stages' },
        { id: 'scheduled', name: 'Scheduled Time', icon: Clock, description: 'Run at specific times' },
        { id: 'form-submitted', name: 'Form Submitted', icon: FileText, description: 'When any form is completed' },
        { id: 'tour-scheduled', name: 'Tour Scheduled', icon: Calendar, description: 'When property tour is booked' }
      ]
    },
    {
      name: 'Actions',
      color: '#10b981',
      blocks: [
        { id: 'send-email', name: 'Send Email', icon: Mail, description: 'Send email to lead or team member' },
        { id: 'send-text', name: 'Send Text Message', icon: MessageSquare, description: 'Send SMS to lead' },
        { id: 'add-to-group', name: 'Add to Group', icon: Users, description: 'Add lead to a group or list' },
        { id: 'move-stage', name: 'Move to Stage', icon: ArrowRight, description: 'Move lead to different stage' },
        { id: 'create-task', name: 'Create Task', icon: CheckCircle, description: 'Create task for team member' },
        { id: 'make-call', name: 'Make Phone Call', icon: Phone, description: 'Call lead or team member' },
        { id: 'update-record', name: 'Update Record', icon: Database, description: 'Update lead information' }
      ]
    },
    {
      name: 'Conditions',
      color: '#f59e0b',
      blocks: [
        { id: 'if-email', name: 'If Email Contains', icon: Mail, description: 'Check if email contains specific text' },
        { id: 'if-stage', name: 'If Stage Is', icon: ArrowRight, description: 'Check current lead stage' },
        { id: 'if-group', name: 'If In Group', icon: Users, description: 'Check if lead is in specific group' },
        { id: 'if-time', name: 'If Time Is', icon: Clock, description: 'Check current time or date' }
      ]
    }
  ];

  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [configuringStep, setConfiguringStep] = useState(null);
  const [stepConfig, setStepConfig] = useState({});

  // Configuration data
  const [emailTemplates] = useState([
    { id: 'welcome', name: 'Welcome Email', subject: 'Welcome to Rentvine!', content: 'Thank you for your interest...' },
    { id: 'follow-up', name: 'Follow-up Email', subject: 'Following up on your inquiry', content: 'I wanted to follow up...' },
    { id: 'reminder', name: 'Reminder Email', subject: 'Don\'t forget about your appointment', content: 'This is a reminder...' },
    { id: 'custom', name: 'Custom Email', subject: '', content: '' }
  ]);

  const [groups] = useState([
    { id: 'hot-leads', name: 'Hot Leads', description: 'High priority leads' },
    { id: 'warm-leads', name: 'Warm Leads', description: 'Medium priority leads' },
    { id: 'cold-leads', name: 'Cold Leads', description: 'Low priority leads' },
    { id: 'vip-customers', name: 'VIP Customers', description: 'Premium customers' },
    { id: 'newsletter', name: 'Newsletter Subscribers', description: 'Marketing list' }
  ]);

  const [leadStages] = useState([
    'New Lead', 'Qualified', 'Contacted', 'Interested', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'
  ]);

  const handleDragStart = (e, block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedBlock) {
      const newStep = {
        id: Date.now(),
        type: draggedBlock.id,
        name: draggedBlock.name,
        icon: draggedBlock.icon,
        description: draggedBlock.description,
        category: blockCategories.find(cat => cat.blocks.some(b => b.id === draggedBlock.id))?.name || 'Actions'
      };
      setWorkflowSteps([...workflowSteps, newStep]);
      setDraggedBlock(null);
    }
  };

  const removeStep = (stepId) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const configureStep = (stepId) => {
    const step = workflowSteps.find(s => s.id === stepId);
    if (step) {
      setConfiguringStep(stepId);
      setStepConfig(step.config || {});
    }
  };

  const saveStepConfig = () => {
    if (configuringStep) {
      setWorkflowSteps(workflowSteps.map(step => 
        step.id === configuringStep 
          ? { ...step, config: stepConfig }
          : step
      ));
      setConfiguringStep(null);
      setStepConfig({});
    }
  };

  const cancelStepConfig = () => {
    setConfiguringStep(null);
    setStepConfig({});
  };

  const createWorkflow = () => {
    if (workflowName.trim() && workflowSteps.length > 0) {
      const newWorkflow = {
        id: editingWorkflowId || Date.now(),
        name: workflowName,
        status: 'inactive',
        description: workflowDescription,
        lastRun: null,
        runs: 0,
        steps: workflowSteps,
        folderId: workflowFolder
      };
      
      if (onSave) {
        onSave(newWorkflow);
      } else {
        setWorkflows([...workflows, newWorkflow]);
      }
      
      setWorkflowName('');
      setWorkflowDescription('');
      setWorkflowSteps([]);
      setWorkflowFolder('system');
      setShowBuilder(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color="#10b981" />;
      case 'inactive': return <Pause size={16} color="#64748b" />;
      default: return <Clock size={16} color="#64748b" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      default: return 'status-inactive';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Configuration modal component
  const renderConfigModal = () => {
    if (!configuringStep) return null;

    const step = workflowSteps.find(s => s.id === configuringStep);
    if (!step) return null;

    const renderConfigForm = () => {
      switch (step.type) {
        case 'scheduled':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Schedule Type</label>
                <select
                  value={stepConfig.scheduleType || 'daily'}
                  onChange={(e) => setStepConfig({...stepConfig, scheduleType: e.target.value})}
                  className="form-input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom Cron</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Time</label>
                <input
                  type="time"
                  value={stepConfig.time || '09:00'}
                  min="08:00"
                  max="22:00"
                  onChange={(e) => {
                    const time = e.target.value;
                    const [hours] = time.split(':').map(Number);
                    if (hours >= 8 && hours <= 22) {
                      setStepConfig({...stepConfig, time: time});
                    } else {
                      alert('Email sending is only allowed between 8:00 AM and 10:00 PM due to legal restrictions.');
                    }
                  }}
                  className="form-input"
                />
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  ⚠️ Email sending restricted to 8:00 AM - 10:00 PM
                </div>
              </div>
              {stepConfig.scheduleType === 'weekly' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Day of Week</label>
                  <select
                    value={stepConfig.dayOfWeek || 'monday'}
                    onChange={(e) => setStepConfig({...stepConfig, dayOfWeek: e.target.value})}
                    className="form-input"
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              )}
            </div>
          );

        case 'send-email':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Email Template</label>
                <select
                  value={stepConfig.template || 'welcome'}
                  onChange={(e) => setStepConfig({...stepConfig, template: e.target.value})}
                  className="form-input"
                >
                  {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  value={stepConfig.subject || emailTemplates.find(t => t.id === (stepConfig.template || 'welcome'))?.subject || ''}
                  onChange={(e) => setStepConfig({...stepConfig, subject: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Recipient</label>
                <select
                  value={stepConfig.recipient || 'lead'}
                  onChange={(e) => setStepConfig({...stepConfig, recipient: e.target.value})}
                  className="form-input"
                >
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                  <option value="team">Team</option>
                  <option value="custom">Custom Email</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Message Content</label>
                <textarea
                  value={stepConfig.content || emailTemplates.find(t => t.id === (stepConfig.template || 'welcome'))?.content || ''}
                  onChange={(e) => setStepConfig({...stepConfig, content: e.target.value})}
                  className="form-input"
                  rows={4}
                />
              </div>
            </div>
          );

        case 'add-to-group':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Select Group</label>
                <select
                  value={stepConfig.groupId || 'hot-leads'}
                  onChange={(e) => setStepConfig({...stepConfig, groupId: e.target.value})}
                  className="form-input"
                >
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name} - {group.description}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Action</label>
                <select
                  value={stepConfig.action || 'add'}
                  onChange={(e) => setStepConfig({...stepConfig, action: e.target.value})}
                  className="form-input"
                >
                  <option value="add">Add to Group</option>
                  <option value="remove">Remove from Group</option>
                  <option value="move">Move to Group</option>
                </select>
              </div>
            </div>
          );

        case 'move-stage':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Target Stage</label>
                <select
                  value={stepConfig.stage || 'Qualified'}
                  onChange={(e) => setStepConfig({...stepConfig, stage: e.target.value})}
                  className="form-input"
                >
                  {leadStages.map(stage => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Condition</label>
                <select
                  value={stepConfig.condition || 'immediate'}
                  onChange={(e) => setStepConfig({...stepConfig, condition: e.target.value})}
                  className="form-input"
                >
                  <option value="immediate">Immediately</option>
                  <option value="after-delay">After Delay</option>
                  <option value="if-condition">If Condition Met</option>
                </select>
              </div>
            </div>
          );

        case 'create-task':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  value={stepConfig.title || ''}
                  onChange={(e) => setStepConfig({...stepConfig, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter task title"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Assign To</label>
                <select
                  value={stepConfig.assignee || 'manager'}
                  onChange={(e) => setStepConfig({...stepConfig, assignee: e.target.value})}
                  className="form-input"
                >
                  <option value="manager">Manager</option>
                  <option value="sales-rep">Sales Rep</option>
                  <option value="team">Team</option>
                  <option value="specific">Specific User</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Priority</label>
                <select
                  value={stepConfig.priority || 'medium'}
                  onChange={(e) => setStepConfig({...stepConfig, priority: e.target.value})}
                  className="form-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Due Date</label>
                <input
                  type="datetime-local"
                  value={stepConfig.dueDate || ''}
                  onChange={(e) => setStepConfig({...stepConfig, dueDate: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>
          );

        default:
          return <div>No configuration needed for this step.</div>;
      }
    };

    return (
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
          minWidth: '500px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            Configure {step.name}
          </h3>
          {renderConfigForm()}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={cancelStepConfig}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={saveStepConfig}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showBuilder) {
    return (
      <div>
        {/* Breadcrumbs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Home / Marketing / Automations / Create Workflow</span>
        </div>

        {/* Page Title */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: 'rgb(68, 71, 69)' 
          }}>
            Create New Workflow
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  setShowBuilder(false);
                }
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={createWorkflow}
              disabled={!workflowName.trim() || workflowSteps.length === 0}
            >
              <Save size={16} style={{ marginRight: '4px' }} />
              Save Workflow
            </button>
          </div>
        </div>

        {/* Workflow Details */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '1rem', color: 'rgb(68, 71, 69)' }}>Workflow Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Workflow Name</label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="e.g., New Lead Welcome"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="What does this workflow do?"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Folder</label>
                <select
                  value={workflowFolder}
                  onChange={(e) => setWorkflowFolder(e.target.value)}
                  className="form-input"
                >
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Block Library */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Steps</h3>
              <p className="card-subtitle">Drag blocks to build your workflow</p>
            </div>
            <div className="card-body" style={{ padding: '1rem' }}>
              {blockCategories.map(category => (
                <div key={category.name} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: category.color,
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {category.name}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {category.blocks.map(block => {
                      const Icon = block.icon;
                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, block)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            cursor: 'grab',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.borderColor = category.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                          }}
                        >
                          <Icon size={18} color={category.color} />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500',
                              color: 'rgb(68, 71, 69)'
                            }}>
                              {block.name}
                            </div>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#64748b' 
                            }}>
                              {block.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Canvas */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Workflow Steps</h3>
              <p className="card-subtitle">Build your automation by adding steps</p>
            </div>
            <div 
              className="card-body"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{ 
                minHeight: '400px',
                backgroundColor: workflowSteps.length === 0 ? '#f8fafc' : 'white',
                border: workflowSteps.length === 0 ? '2px dashed #cbd5e1' : '1px solid #e2e8f0',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {workflowSteps.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  color: '#64748b'
                }}>
                  <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <div style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Start Building Your Workflow
                  </div>
                  <div>Drag blocks from the left to create your automation</div>
                </div>
              ) : (
                workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const hasConfig = ['scheduled', 'send-email', 'add-to-group', 'move-stage', 'create-task'].includes(step.type);
                  return (
                    <div 
                      key={step.id} 
                      onDoubleClick={() => hasConfig && configureStep(step.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        position: 'relative',
                        cursor: hasConfig ? 'pointer' : 'default'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'rgb(68, 71, 69)'
                      }}>
                        {index + 1}
                      </div>
                      
                      <Icon size={20} color="#64748b" />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '500',
                          color: 'rgb(68, 71, 69)'
                        }}>
                          {step.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: '#64748b' 
                        }}>
                          {step.description}
                        </div>
                        {step.config && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: '#3b82f6',
                            marginTop: '0.25rem',
                            fontStyle: 'italic'
                          }}>
                            {step.type === 'scheduled' && `Scheduled: ${step.config.scheduleType} at ${step.config.time}`}
                            {step.type === 'send-email' && `Email: ${step.config.subject || 'No subject'}`}
                            {step.type === 'add-to-group' && `Group: ${groups.find(g => g.id === step.config.groupId)?.name || 'Unknown'}`}
                            {step.type === 'move-stage' && `Stage: ${step.config.stage}`}
                            {step.type === 'create-task' && `Task: ${step.config.title || 'Untitled'}`}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {hasConfig && (
                          <button
                            onClick={() => configureStep(step.id)}
                            onDoubleClick={() => configureStep(step.id)}
                            style={{
                              padding: '0.5rem',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              color: '#3b82f6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#eff6ff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            title="Configure (click or double-click)"
                          >
                            <Settings size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => removeStep(step.id)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {index < workflowSteps.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-0.5rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '2px',
                          height: '1rem',
                          backgroundColor: '#e2e8f0'
                        }} />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Configuration Modal */}
        {renderConfigModal()}
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Home / Marketing / Automations</span>
      </div>

      {/* Page Title */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: 'rgb(68, 71, 69)' 
        }}>
          Workflow Automations
        </h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowBuilder(true)}
        >
          <Plus size={16} style={{ marginRight: '4px' }} />
          {editingWorkflowId ? 'Edit Workflow' : 'Create Workflow'}
        </button>
      </div>

      {/* Workflows Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {workflows.map(workflow => (
          <div key={workflow.id} className="card">
            <div className="card-body">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: 'rgb(68, 71, 69)',
                    marginBottom: '0.25rem'
                  }}>
                    {workflow.name}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b',
                    marginBottom: '0.75rem'
                  }}>
                    {workflow.description}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusIcon(workflow.status)}
                  <span className={`automation-status ${getStatusColor(workflow.status)}`}>
                    {workflow.status}
                  </span>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                <span>Last Run: {formatDate(workflow.lastRun)}</span>
                <span>Total Runs: {workflow.runs}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                justifyContent: 'flex-end'
              }}>
                <button className="btn btn-secondary btn-sm">
                  <Edit size={14} style={{ marginRight: '4px' }} />
                  Edit
                </button>
                <button className="btn btn-secondary btn-sm">
                  {workflow.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Copy size={14} />
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#64748b' 
        }}>
          <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No workflows created yet. Create your first automation to get started.</p>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
