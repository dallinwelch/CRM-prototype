import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
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
  Zap,
  GripVertical,
  X,
  RotateCcw,
  Webhook
} from 'lucide-react';

// Custom Node Component
const CustomNode = ({ data, isConnectable }) => {
  const { label, icon: IconComponent, color, category, description, onConfigure, onDelete, config, type } = data;

  return (
    <div style={{
      backgroundColor: 'white',
      border: `2px solid ${color}`,
      borderRadius: '8px',
      padding: '12px',
      minWidth: '180px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      {data.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ 
            background: color,
            width: '12px',
            height: '12px',
            border: '2px solid white'
          }}
        />
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <IconComponent size={24} color={color} />
        <div style={{ 
          fontSize: '12px', 
          fontWeight: '600', 
          color: '#1e293b',
          textAlign: 'center'
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#64748b',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          {description}
        </div>
        
        {config && (
          <div style={{ 
            fontSize: '8px', 
            color: '#3b82f6',
            textAlign: 'center',
            marginTop: '2px',
            fontStyle: 'italic',
            maxWidth: '160px',
            wordWrap: 'break-word'
          }}>
            {type === 'scheduled' && `${config.scheduleType} at ${config.time}`}
            {type === 'send-email' && `${config.subject || 'No subject'}`}
            {type === 'add-to-group' && `${config.groupName || 'Unknown'}`}
            {type === 'move-stage' && `${config.stageName || config.stage}`}
            {type === 'stage-webhook' && `Webhook: ${config.stageName || config.stage}`}
            {type === 'if-stage' && `If stage is ${config.stageName || config.stage}`}
            {type === 'create-task' && `${config.title || 'Untitled'}`}
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        display: 'flex',
        gap: '4px'
      }}>
        {['scheduled', 'send-email', 'add-to-group', 'move-stage', 'create-task', 'stage-webhook', 'if-stage'].includes(type) && (
          <button
            onClick={onConfigure}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Configure"
          >
            <Settings size={10} />
          </button>
        )}
        <button
          onClick={onDelete}
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Delete"
        >
          <X size={12} />
        </button>
      </div>

      {data.outputs > 0 && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{ 
            background: color,
            width: '12px',
            height: '12px',
            border: '2px solid white'
          }}
        />
      )}
    </div>
  );
};

const VisualWorkflowBuilder = ({ editingWorkflowId, selectedFolder, onClose, onSave }) => {
  const [workflows, setWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowFolder, setWorkflowFolder] = useState(selectedFolder || 'system');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [configuringNodeId, setConfiguringNodeId] = useState(null);
  const [nodeConfig, setNodeConfig] = useState({});

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Available node types
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

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
    { id: 'new', name: 'New Lead', color: '#3b82f6' },
    { id: 'contacted', name: 'Contacted', color: '#8b5cf6' },
    { id: 'qualified', name: 'Qualified', color: '#10b981' },
    { id: 'interested', name: 'Interested', color: '#f59e0b' },
    { id: 'proposal', name: 'Proposal Sent', color: '#ef4444' },
    { id: 'negotiation', name: 'Negotiation', color: '#6366f1' },
    { id: 'contract', name: 'Contract Review', color: '#ec4899' },
    { id: 'closed-won', name: 'Closed Won', color: '#059669' },
    { id: 'closed-lost', name: 'Closed Lost', color: '#dc2626' },
    { id: 'on-hold', name: 'On Hold', color: '#6b7280' },
    { id: 're-engaged', name: 'Re-engaged', color: '#f97316' }
  ]);

  // Folder data structure
  const [folders] = useState([
    { id: 'system', name: 'System', type: 'system', parentId: null },
    { id: 'lead-management', name: 'Lead Management', type: 'custom', parentId: 'system' },
    { id: 'lead-nurturing', name: 'Lead Nurturing', type: 'custom', parentId: 'lead-management' },
    { id: 'customer-service', name: 'Customer Service', type: 'custom', parentId: 'system' },
    { id: 'data-sync', name: 'Data Synchronization', type: 'custom', parentId: 'system' }
  ]);

  // Node palette definitions
  const nodePalette = [
    {
      category: 'Triggers',
      color: '#3b82f6',
      nodes: [
        { id: 'new-lead', name: 'New Lead Added', icon: UserPlus, description: 'When someone fills out a lead form', inputs: 0, outputs: 1 },
        { id: 'lead-stage-change', name: 'Lead Stage Changed', icon: ArrowRight, description: 'When lead moves between stages', inputs: 0, outputs: 1 },
        { id: 'stage-webhook', name: 'Stage Webhook', icon: Webhook, description: 'Webhook triggered when lead reaches specific stage', inputs: 0, outputs: 1 },
        { id: 'scheduled', name: 'Scheduled Time', icon: Clock, description: 'Run at specific times', inputs: 0, outputs: 1 },
        { id: 'form-submitted', name: 'Form Submitted', icon: FileText, description: 'When any form is completed', inputs: 0, outputs: 1 },
        { id: 'tour-scheduled', name: 'Tour Scheduled', icon: Calendar, description: 'When property tour is booked', inputs: 0, outputs: 1 }
      ]
    },
    {
      category: 'Actions',
      color: '#10b981',
      nodes: [
        { id: 'send-email', name: 'Send Email', icon: Mail, description: 'Send email to lead or team member', inputs: 1, outputs: 1 },
        { id: 'send-text', name: 'Send Text Message', icon: MessageSquare, description: 'Send SMS to lead', inputs: 1, outputs: 1 },
        { id: 'add-to-group', name: 'Add to Group', icon: Users, description: 'Add lead to a group or list', inputs: 1, outputs: 1 },
        { id: 'move-stage', name: 'Move to Stage', icon: ArrowRight, description: 'Move lead to different stage', inputs: 1, outputs: 1 },
        { id: 'create-task', name: 'Create Task', icon: CheckCircle, description: 'Create task for team member', inputs: 1, outputs: 1 },
        { id: 'make-call', name: 'Make Phone Call', icon: Phone, description: 'Call lead or team member', inputs: 1, outputs: 1 },
        { id: 'update-record', name: 'Update Record', icon: Database, description: 'Update lead information', inputs: 1, outputs: 1 }
      ]
    },
    {
      category: 'Conditions',
      color: '#f59e0b',
      nodes: [
        { id: 'if-email', name: 'If Email Contains', icon: Mail, description: 'Check if email contains specific text', inputs: 1, outputs: 2 },
        { id: 'if-stage', name: 'If Stage Is', icon: ArrowRight, description: 'Check current lead stage', inputs: 1, outputs: 2 },
        { id: 'if-group', name: 'If In Group', icon: Users, description: 'Check if lead is in specific group', inputs: 1, outputs: 2 },
        { id: 'if-time', name: 'If Time Is', icon: Clock, description: 'Check current time or date', inputs: 1, outputs: 2 }
      ]
    }
  ];

  // Effect to handle editing existing workflows
  useEffect(() => {
    if (editingWorkflowId) {
      const workflow = workflows.find(w => w.id === editingWorkflowId);
      if (workflow) {
        setWorkflowName(workflow.name);
        setWorkflowDescription(workflow.description);
        setWorkflowFolder(workflow.folderId || 'system');
        if (workflow.nodes) {
          setNodes(workflow.nodes);
        }
        if (workflow.edges) {
          setEdges(workflow.edges);
        }
      }
    } else if (selectedFolder) {
      setWorkflowFolder(selectedFolder);
    }
  }, [editingWorkflowId, selectedFolder]);

  // Handle connection between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }, eds));
  }, [setEdges]);

  // Handle drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from palette
  const onDrop = useCallback((event) => {
    event.preventDefault();

    if (!reactFlowInstance) return;

    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const nodeData = nodePalette
      .flatMap(cat => cat.nodes)
      .find(n => n.id === type);
    
    if (!nodeData) return;

    const category = nodePalette.find(cat => cat.nodes.some(n => n.id === type));
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'customNode',
      position,
      data: {
        label: nodeData.name,
        icon: nodeData.icon,
        color: category.color,
        category: category.category,
        description: nodeData.description,
        inputs: nodeData.inputs,
        outputs: nodeData.outputs,
        type: nodeData.id,
        onConfigure: () => configureNode(`node-${Date.now()}`),
        onDelete: () => deleteNode(`node-${Date.now()}`),
      },
    };

    // Update the onConfigure and onDelete with correct ID
    newNode.data.onConfigure = () => configureNode(newNode.id);
    newNode.data.onDelete = () => deleteNode(newNode.id);

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, nodePalette]);

  // Drag start handler for palette
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Configure node
  const configureNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setConfiguringNodeId(nodeId);
      setNodeConfig(node.data.config || {});
    }
  };

  // Delete node
  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  // Save node configuration
  const saveNodeConfig = () => {
    if (configuringNodeId) {
      const node = nodes.find(n => n.id === configuringNodeId);
      if (node) {
        // Add additional display info for config
        const enrichedConfig = { ...nodeConfig };
        
        // Add display names for dropdowns
        if (nodeConfig.groupId) {
          enrichedConfig.groupName = groups.find(g => g.id === nodeConfig.groupId)?.name;
        }
        if (nodeConfig.stage) {
          enrichedConfig.stageName = leadStages.find(s => s.id === nodeConfig.stage)?.name;
        }

        setNodes((nds) =>
          nds.map((n) =>
            n.id === configuringNodeId
              ? { ...n, data: { ...n.data, config: enrichedConfig } }
              : n
          )
        );
      }
      setConfiguringNodeId(null);
      setNodeConfig({});
    }
  };

  // Cancel node configuration
  const cancelNodeConfig = () => {
    setConfiguringNodeId(null);
    setNodeConfig({});
  };

  // Handle workflow name change
  const handleWorkflowNameChange = (e) => {
    setWorkflowName(e.target.value);
    if (nameError) {
      setNameError(false);
    }
  };

  // Create/Save workflow
  const createWorkflow = () => {
    setNameError(false);
    
    if (!workflowName.trim()) {
      setNameError(true);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    
    if (nodes.length === 0) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    
    const newWorkflow = {
      id: editingWorkflowId || Date.now(),
      name: workflowName,
      status: 'inactive',
      description: workflowDescription,
      lastRun: null,
      runs: 0,
      successRate: 0,
      triggers: ['Manual'],
      actions: ['Custom'],
      nodes,
      edges,
      folderId: workflowFolder
    };
    
    if (onSave) {
      onSave(newWorkflow);
    } else {
      setWorkflows([...workflows, newWorkflow]);
    }
    
    // Reset form after successful save (when not using onClose callback)
    if (!onClose) {
      setWorkflowName('');
      setWorkflowDescription('');
      setWorkflowFolder('system');
      setNodes([]);
      setEdges([]);
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  // Configuration modal
  const renderConfigModal = () => {
    if (!configuringNodeId) return null;

    const node = nodes.find(n => n.id === configuringNodeId);
    if (!node) return null;

    const renderConfigForm = () => {
      switch (node.data.type) {
        case 'scheduled':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Schedule Type</label>
                <select
                  value={nodeConfig.scheduleType || 'daily'}
                  onChange={(e) => setNodeConfig({...nodeConfig, scheduleType: e.target.value})}
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
                  value={nodeConfig.time || '09:00'}
                  onChange={(e) => setNodeConfig({...nodeConfig, time: e.target.value})}
                  className="form-input"
                />
              </div>
              {nodeConfig.scheduleType === 'weekly' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Day of Week</label>
                  <select
                    value={nodeConfig.dayOfWeek || 'monday'}
                    onChange={(e) => setNodeConfig({...nodeConfig, dayOfWeek: e.target.value})}
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
                  value={nodeConfig.template || 'welcome'}
                  onChange={(e) => setNodeConfig({...nodeConfig, template: e.target.value})}
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
                  value={nodeConfig.subject || emailTemplates.find(t => t.id === (nodeConfig.template || 'welcome'))?.subject || ''}
                  onChange={(e) => setNodeConfig({...nodeConfig, subject: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Recipient</label>
                <select
                  value={nodeConfig.recipient || 'lead'}
                  onChange={(e) => setNodeConfig({...nodeConfig, recipient: e.target.value})}
                  className="form-input"
                >
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                  <option value="team">Team</option>
                  <option value="custom">Custom Email</option>
                </select>
              </div>
            </div>
          );

        case 'add-to-group':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Select Group</label>
                <select
                  value={nodeConfig.groupId || 'hot-leads'}
                  onChange={(e) => setNodeConfig({...nodeConfig, groupId: e.target.value})}
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
                  value={nodeConfig.action || 'add'}
                  onChange={(e) => setNodeConfig({...nodeConfig, action: e.target.value})}
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
        case 'stage-webhook':
        case 'if-stage':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">
                  {node.data.type === 'stage-webhook' ? 'Trigger When Lead Reaches Stage' : 'Target Stage'}
                </label>
                <select
                  value={nodeConfig.stage || 'qualified'}
                  onChange={(e) => setNodeConfig({...nodeConfig, stage: e.target.value})}
                  className="form-input"
                >
                  {leadStages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
              {node.data.type === 'stage-webhook' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Webhook URL</label>
                    <input
                      type="url"
                      value={nodeConfig.webhookUrl || ''}
                      onChange={(e) => setNodeConfig({...nodeConfig, webhookUrl: e.target.value})}
                      className="form-input"
                      placeholder="https://your-webhook-url.com/stage-change"
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Method</label>
                    <select
                      value={nodeConfig.method || 'POST'}
                      onChange={(e) => setNodeConfig({...nodeConfig, method: e.target.value})}
                      className="form-input"
                    >
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          );

        case 'create-task':
          return (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  value={nodeConfig.title || ''}
                  onChange={(e) => setNodeConfig({...nodeConfig, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter task title"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Assign To</label>
                <select
                  value={nodeConfig.assignee || 'manager'}
                  onChange={(e) => setNodeConfig({...nodeConfig, assignee: e.target.value})}
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
                  value={nodeConfig.priority || 'medium'}
                  onChange={(e) => setNodeConfig({...nodeConfig, priority: e.target.value})}
                  className="form-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          );

        default:
          return <div>No configuration needed for this node.</div>;
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
        zIndex: 2000
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
            Configure {node.data.label}
          </h3>
          {renderConfigForm()}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={cancelNodeConfig}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={saveNodeConfig}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Page Title */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem',
          padding: '1rem 0'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#1e293b' 
          }}>
            Visual Workflow Builder
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={clearCanvas}
            >
              <RotateCcw size={16} style={{ marginRight: '4px' }} />
              Clear
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={createWorkflow}
              disabled={!workflowName.trim() || nodes.length === 0}
            >
              <Save size={16} style={{ marginRight: '4px' }} />
              Save Workflow
            </button>
          </div>
        </div>

        {/* Workflow Details */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Workflow Name *</label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={handleWorkflowNameChange}
                  placeholder="e.g., New Lead Welcome"
                  className="form-input"
                  style={{
                    borderColor: nameError ? '#dc2626' : undefined,
                    backgroundColor: nameError ? '#fef2f2' : undefined
                  }}
                />
                {nameError && (
                  <div style={{ 
                    color: '#dc2626', 
                    fontSize: '0.75rem', 
                    marginTop: '0.25rem' 
                  }}>
                    Workflow name is required
                  </div>
                )}
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

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
          {/* Node Palette */}
          <div className="card" style={{ height: '100%', overflow: 'auto' }}>
            <div className="card-header">
              <h3 className="card-title">Node Library</h3>
              <p className="card-subtitle">Drag nodes to canvas</p>
            </div>
            <div className="card-body" style={{ padding: '1rem' }}>
              {nodePalette.map(category => (
                <div key={category.category} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: category.color,
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {category.category}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {category.nodes.map(nodeType => {
                      const IconComponent = nodeType.icon;
                      return (
                        <div
                          key={nodeType.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, nodeType.id)}
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
                          <IconComponent size={18} color={category.color} />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500',
                              color: '#1e293b'
                            }}>
                              {nodeType.name}
                            </div>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#64748b' 
                            }}>
                              {nodeType.description}
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

          {/* Canvas */}
          <div className="card" style={{ height: '100%', padding: 0, position: 'relative' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#e2e8f0" gap={20} />
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  return node.data.color || '#64748b';
                }}
                style={{
                  backgroundColor: '#f8fafc',
                }}
              />
              <Panel position="top-center">
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  color: '#64748b'
                }}>
                  Drag nodes from the left panel to build your workflow
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
        
        {/* Configuration Modal */}
        {renderConfigModal()}

        {/* Error Toast */}
        {showErrorToast && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                Validation Error
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                {!workflowName.trim() ? 'Workflow name is required' : 'At least one workflow step is required'}
              </div>
            </div>
            <button
              onClick={() => setShowErrorToast(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                marginLeft: '0.5rem'
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    );
};

export default VisualWorkflowBuilder;
