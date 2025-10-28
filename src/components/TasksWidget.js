import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Users as UsersIcon, 
  Filter,
  ChevronDown,
  CheckSquare,
  Square,
  Calendar,
  Bot,
  X,
  XCircle,
  ExternalLink,
  UserCheck,
  Snooze,
  MessageSquare,
  Mail,
  Phone,
  Home,
  Circle,
  Edit,
  Plus
} from 'lucide-react';
import { mockTasks, currentUser, mockLeads, mockLeadQuestionnaireForm, mockUsers } from '../mockData';

const TasksWidget = ({ onNavigateToLead }) => {
  const [activeTab, setActiveTab] = useState('follow-ups'); // 'follow-ups' or 'approvals'
  const [filter, setFilter] = useState('all'); // all, me, me-others, specific, ai
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionOutcome, setCompletionOutcome] = useState(null); // 'answered', 'no-answer'
  const [completionNote, setCompletionNote] = useState('');
  const [showPastTasks, setShowPastTasks] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState({});
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'general',
    priority: 'medium',
    assignedTo: currentUser.name,
    leadId: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Helper function to get lead data - defined early so it can be used in filters
  const getLeadForTask = (leadId) => {
    return mockLeads.find(l => l.id === leadId);
  };

  // Filter tasks based on current filter and active tab
  const getFilteredTasks = () => {
    let filtered = mockTasks;

    // First filter by tab
    if (activeTab === 'follow-ups') {
      filtered = mockTasks.filter(t => 
        t.type === 'follow_up' || 
        (t.type === 'onboarding_review' && getLeadForTask(t.leadId)?.onboardingStatus === 'in_progress' && (getLeadForTask(t.leadId)?.onboardingCompletion || 0) < 100)
      );
    } else if (activeTab === 'approvals') {
      filtered = mockTasks.filter(t => 
        t.type === 'approval' || 
        (t.type === 'onboarding_review' && (!getLeadForTask(t.leadId)?.onboardingStatus || (getLeadForTask(t.leadId)?.onboardingCompletion || 0) === 100))
      );
    }

    // Then apply user filter
    switch (filter) {
      case 'me':
        filtered = filtered.filter(t => t.assignedTo === currentUser.name);
        break;
      case 'me-others':
        filtered = filtered.filter(t => 
          t.assignedTo === currentUser.name || t.assignedTo === null
        );
        break;
      case 'unassigned':
        filtered = filtered.filter(t => t.assignedTo === null);
        break;
      case 'ai':
        // Mock: no AI tasks yet
        filtered = [];
        break;
      default:
        // all
        break;
    }

    return filtered.filter(t => t.status !== 'completed');
  };

  const filteredTasks = getFilteredTasks();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const toggleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const initiateCompletion = (method) => {
    console.log('Initiated contact via:', method);
    setShowCompletionModal(true);
  };

  const completeTask = () => {
    if (!completionOutcome) return;

    if (completionOutcome === 'answered') {
      // Successful contact - task stays at day 1, marked as complete
      console.log('Task completed successfully - contact made');
      console.log('Note:', completionNote);
      // In real app: Task marked complete, stays on day 1, moves to past tasks
    } else {
      // Unsuccessful - create next task in Fibonacci sequence
      const nextDay = getNextFibonacciDay(selectedTask.cadenceDay);
      console.log('Task unsuccessful - left message/no answer');
      console.log('Note:', completionNote);
      console.log('Next task will be created for day:', nextDay);
      // In real app: Create new task for next Fibonacci day
    }

    // Reset and close
    setShowCompletionModal(false);
    setShowTaskDetail(false);
    setCompletionOutcome(null);
    setCompletionNote('');
  };

  const handleApprove = () => {
    console.log('Lead approved via task:', selectedTask.leadId);
    // In real app: Approve the lead, send onboarding invite, create follow-up task
    setShowTaskDetail(false);
  };

  const handleDeny = () => {
    console.log('Lead denied and archived:', selectedTask.leadId);
    // In real app: Mark lead as denied, auto-archive
    setShowTaskDetail(false);
  };

  const handleRequestRevisions = () => {
    setShowRevisionModal(true);
  };

  const submitRevisionRequest = () => {
    console.log('Requesting revisions for lead:', selectedTask.leadId);
    console.log('Revision notes:', revisionNotes);
    // In real app: Update lead status, send notification to lead, create follow-up task
    setShowRevisionModal(false);
    setShowTaskDetail(false);
    setRevisionNotes('');
  };

  const startEditingLead = () => {
    const lead = getLeadForTask(selectedTask.leadId);
    setEditedLeadData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      formAnswers: { ...(lead.formAnswers || {}) }
    });
    setIsEditingLead(true);
  };

  const cancelEditingLead = () => {
    setIsEditingLead(false);
    setEditedLeadData({});
  };

  const saveLeadEdits = () => {
    console.log('Saving lead edits:', editedLeadData);
    // In real app: Update lead data in database
    setIsEditingLead(false);
    setEditedLeadData({});
  };

  const updateEditedField = (field, value) => {
    setEditedLeadData({
      ...editedLeadData,
      [field]: value
    });
  };

  const updateEditedFormAnswer = (fieldId, value) => {
    setEditedLeadData({
      ...editedLeadData,
      formAnswers: {
        ...editedLeadData.formAnswers,
        [fieldId]: value
      }
    });
  };

  const updateNewTaskField = (field, value) => {
    setNewTask({
      ...newTask,
      [field]: value
    });
  };

  const createManualTask = () => {
    console.log('Creating manual task:', newTask);
    // In real app: Save task to database
    
    // Reset and close
    setShowCreateTaskModal(false);
    setNewTask({
      title: '',
      description: '',
      type: 'general',
      priority: 'medium',
      assignedTo: currentUser.name,
      leadId: '',
      dueDate: new Date().toISOString().split('T')[0]
    });
  };

  const getNextFibonacciDay = (currentDay) => {
    const sequence = [1, 2, 3, 5, 8, 13];
    const currentIndex = sequence.indexOf(currentDay);
    if (currentIndex === -1 || currentIndex === sequence.length - 1) {
      return null; // End of sequence, auto-archive
    }
    return sequence[currentIndex + 1];
  };

  const markTaskComplete = (taskId) => {
    console.log('Mark task complete:', taskId);
    // In real app: Update task status to completed
  };

  const snoozeTask = (taskId, days) => {
    console.log('Snooze task:', taskId, 'for', days, 'days');
    setShowTaskDetail(false);
  };

  const reassignTask = (taskId, userId) => {
    console.log('Reassign task:', taskId, 'to', userId);
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const getPastTasksForLead = (leadId) => {
    // Mock past completed tasks
    return mockTasks.filter(t => 
      t.leadId === leadId && 
      t.status === 'completed'
    );
  };

  const getFormFieldLabel = (fieldId) => {
    // Find the field label from the form structure
    for (const section of mockLeadQuestionnaireForm.sections) {
      const field = section.fields.find(f => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  const FilterButton = ({ value, label, icon: Icon }) => (
    <button
      className={`filter-option ${filter === value ? 'active' : ''}`}
      onClick={() => {
        setFilter(value);
        setShowFilterMenu(false);
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="tasks-widget" style={{ 
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden'
    }}>
      <div className="widget-header" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem 2.5rem',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem' }}>
          <h3 className="widget-title" style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
            <CheckCircle size={24} />
            Tasks
          </h3>
          <div className="widget-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowCreateTaskModal(true)}
              style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem' }}
            >
              <Plus size={18} />
              New Task
            </button>
            <div className="filter-dropdown">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                style={{ padding: '0.625rem 1.25rem', minWidth: '180px', fontSize: '0.9375rem' }}
              >
                <Filter size={18} />
                {filter === 'all' && 'All Tasks'}
                {filter === 'me' && 'My Tasks'}
                {filter === 'me-others' && 'Me + Unassigned'}
                {filter === 'unassigned' && 'Unassigned'}
                {filter === 'ai' && 'AI Agent'}
                <ChevronDown size={16} />
              </button>
              {showFilterMenu && (
                <div className="filter-menu">
                  <FilterButton value="all" label="All Tasks" icon={UsersIcon} />
                  <FilterButton value="me" label="My Tasks" icon={User} />
                  <FilterButton value="me-others" label="Me + Unassigned" icon={UsersIcon} />
                  <FilterButton value="unassigned" label="Unassigned" icon={AlertCircle} />
                  <FilterButton value="ai" label="AI Agent" icon={Bot} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '2px solid #f1f5f9', marginBottom: '-2rem', paddingBottom: '0' }}>
          <button
            onClick={() => setActiveTab('follow-ups')}
            style={{
              padding: '1rem 2.5rem',
              border: 'none',
              background: 'none',
              color: activeTab === 'follow-ups' ? 'rgb(0, 165, 79)' : '#64748b',
              fontWeight: activeTab === 'follow-ups' ? '600' : '500',
              fontSize: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'follow-ups' ? '3px solid rgb(0, 165, 79)' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem'
            }}
          >
            <MessageSquare size={18} />
            Follow-ups
            <span style={{
              backgroundColor: activeTab === 'follow-ups' ? 'rgb(0, 165, 79)' : '#94a3b8',
              color: 'white',
              padding: '0.25rem 0.625rem',
              borderRadius: '14px',
              fontSize: '0.8rem',
              fontWeight: '600',
              minWidth: '1.75rem',
              textAlign: 'center'
            }}>
              {mockTasks.filter(t => 
                t.status !== 'completed' && 
                (t.type === 'follow_up' || 
                (t.type === 'onboarding_review' && getLeadForTask(t.leadId)?.onboardingStatus === 'in_progress' && (getLeadForTask(t.leadId)?.onboardingCompletion || 0) < 100))
              ).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            style={{
              padding: '1rem 2.5rem',
              border: 'none',
              background: 'none',
              color: activeTab === 'approvals' ? 'rgb(0, 165, 79)' : '#64748b',
              fontWeight: activeTab === 'approvals' ? '600' : '500',
              fontSize: '1rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'approvals' ? '3px solid rgb(0, 165, 79)' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem'
            }}
          >
            <UserCheck size={18} />
            Approvals
            <span style={{
              backgroundColor: activeTab === 'approvals' ? 'rgb(0, 165, 79)' : '#94a3b8',
              color: 'white',
              padding: '0.25rem 0.625rem',
              borderRadius: '14px',
              fontSize: '0.8rem',
              fontWeight: '600',
              minWidth: '1.75rem',
              textAlign: 'center'
            }}>
              {mockTasks.filter(t => 
                t.status !== 'completed' && 
                (t.type === 'approval' || 
                (t.type === 'onboarding_review' && (!getLeadForTask(t.leadId)?.onboardingStatus || (getLeadForTask(t.leadId)?.onboardingCompletion || 0) === 100)))
              ).length}
            </span>
          </button>
        </div>
      </div>

      <div className="widget-content" style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} style={{ color: '#10b981', opacity: 0.5 }} />
            <p>No {activeTab === 'follow-ups' ? 'follow-up' : 'approval'} tasks found</p>
            <span className="empty-state-subtitle">
              {filter === 'ai' ? 'AI agent tasks will appear here' : 'All caught up!'}
            </span>
          </div>
        ) : (
          <div className="tasks-list">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className="task-item"
                onClick={() => openTaskDetail(task)}
              >
                <button
                  className="task-checkbox"
                  onClick={(e) => {
                    e.stopPropagation();
                    markTaskComplete(task.id);
                  }}
                >
                  <Square size={18} />
                </button>
                
                <div className="task-content">
                  <div className="task-header">
                    <span className="task-title">{task.title}</span>
                    <span 
                      className="task-priority"
                      style={{ 
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority)
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="task-description">{task.description}</div>
                  
                  <div className="task-meta">
                    <span className="task-lead">{task.leadName}</span>
                    <span className="task-separator">•</span>
                    <span className="task-due">
                      <Calendar size={12} />
                      {formatDueDate(task.dueDate)}
                    </span>
                    {task.assignedTo && (
                      <>
                        <span className="task-separator">•</span>
                        <span className="task-assignee">
                          <User size={12} />
                          {task.assignedTo}
                        </span>
                      </>
                    )}
                    {task.cadenceDay && (
                      <>
                        <span className="task-separator">•</span>
                        <span className="task-cadence">Day {task.cadenceDay}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="widget-footer" style={{ 
        padding: '1rem 1.5rem',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="widget-summary" style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {filteredTasks.length} {activeTab === 'follow-ups' ? 'follow-up' : 'approval'} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {filter !== 'all' && ` (filtered)`}
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowTaskDetail(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="task-detail-header">
                <div className="task-detail-title-row">
                  <h2>{selectedTask.title}</h2>
                  <span 
                    className="task-priority"
                    style={{ 
                      backgroundColor: `${getPriorityColor(selectedTask.priority)}20`,
                      color: getPriorityColor(selectedTask.priority)
                    }}
                  >
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="task-detail-meta">
                  {selectedTask.cadenceDay && (
                    <span className="meta-badge">
                      <Clock size={14} />
                      Fibonacci Day {selectedTask.cadenceDay}
                    </span>
                  )}
                  <span className="meta-badge">
                    <Calendar size={14} />
                    Due {formatDueDate(selectedTask.dueDate)}
                  </span>
                </div>
              </div>
              <button className="btn-close" onClick={() => setShowTaskDetail(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {/* Task Type Badge at top */}
              <div className="task-type-header">
                {selectedTask.type === 'follow_up' && (
                  <div className="task-type-badge-header follow-up">
                    <MessageSquare size={16} />
                    <span>Follow-up Task - Day {selectedTask.cadenceDay || 1}</span>
                  </div>
                )}
                {selectedTask.type === 'approval' && (
                  <div className="task-type-badge-header approval">
                    <UserCheck size={16} />
                    <span>Approval Required</span>
                  </div>
                )}
                {selectedTask.type === 'onboarding_review' && (() => {
                  const lead = getLeadForTask(selectedTask.leadId);
                  const isInOnboarding = lead?.onboardingStatus === 'in_progress';
                  const onboardingComplete = (lead?.onboardingCompletion || 0) === 100;
                  
                  if (isInOnboarding && !onboardingComplete) {
                    // In progress but not complete - it's a follow-up
                    return (
                      <div className="task-type-badge-header follow-up">
                        <MessageSquare size={16} />
                        <span>Follow-up: Onboarding In Progress ({lead?.onboardingCompletion}%)</span>
                      </div>
                    );
                  } else if (isInOnboarding && onboardingComplete) {
                    // Complete - ready for approval
                    return (
                      <div className="task-type-badge-header approval">
                        <UserCheck size={16} />
                        <span>Final Approval Required - Onboarding Complete</span>
                      </div>
                    );
                  } else {
                    // Not started yet
                    return (
                      <div className="task-type-badge-header approval">
                        <CheckCircle size={16} />
                        <span>Start Onboarding Approval</span>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Task Description */}
              <div className="task-detail-section">
                <h3 className="task-detail-section-title">Description</h3>
                <p className="task-detail-description">{selectedTask.description}</p>
              </div>

              {/* Actions based on task type - MOVED ABOVE LEAD INFO */}
              {selectedTask.type === 'follow_up' ? (
                <>
                  {/* Communication Actions for Follow-up Tasks */}
                  <div className="task-detail-section">
                    <h3 className="task-detail-section-title">Take Action</h3>
                    <div className="communication-buttons">
                      <button 
                        className="btn-communication btn-communication-call"
                        onClick={() => initiateCompletion('call')}
                      >
                        <Phone size={20} />
                        <div className="btn-communication-content">
                          <span className="btn-communication-label">Call</span>
                          <span className="btn-communication-value">
                            {getLeadForTask(selectedTask.leadId)?.phone || 'N/A'}
                          </span>
                        </div>
                      </button>

                      <button 
                        className="btn-communication btn-communication-text"
                        onClick={() => initiateCompletion('text')}
                      >
                        <MessageSquare size={20} />
                        <div className="btn-communication-content">
                          <span className="btn-communication-label">Text</span>
                          <span className="btn-communication-value">
                            {getLeadForTask(selectedTask.leadId)?.phone || 'N/A'}
                          </span>
                        </div>
                      </button>

                      <button 
                        className="btn-communication btn-communication-email"
                        onClick={() => initiateCompletion('email')}
                      >
                        <Mail size={20} />
                        <div className="btn-communication-content">
                          <span className="btn-communication-label">Email</span>
                          <span className="btn-communication-value">
                            {getLeadForTask(selectedTask.leadId)?.email || 'N/A'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Fibonacci Cadence Info for Follow-up Tasks */}
                  {selectedTask.cadenceDay && (
                    <div className="task-detail-section">
                      <h3 className="task-detail-section-title">Follow-up Cadence</h3>
                      <div className="fibonacci-info">
                        <div className="fibonacci-sequence">
                          {[1, 2, 3, 5, 8, 13].map((day, index) => (
                            <div 
                              key={day}
                              className={`fibonacci-day ${selectedTask.cadenceDay === day ? 'active' : ''} ${selectedTask.cadenceDay > day ? 'completed' : ''}`}
                            >
                              <div className="fibonacci-day-number">{day}</div>
                              <div className="fibonacci-day-label">Day {day}</div>
                            </div>
                          ))}
                        </div>
                        <p className="fibonacci-description">
                          This task is part of a Fibonacci follow-up sequence. The next follow-up will be scheduled {selectedTask.cadenceDay === 13 ? 'at auto-archive' : 'in ' + ([1, 2, 3, 5, 8, 13].find(d => d > selectedTask.cadenceDay) - selectedTask.cadenceDay) + ' days'}.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : selectedTask.type === 'approval' ? (
                <>
                  {/* Approval Actions */}
                  <div className="task-detail-section">
                    <h3 className="task-detail-section-title">Lead Approval Decision</h3>
                    <div className="approval-actions">
                      <button 
                        className="btn-approval btn-approval-approve"
                        onClick={handleApprove}
                      >
                        <CheckCircle size={24} />
                        <div className="btn-approval-content">
                          <span className="btn-approval-title">Approve Lead</span>
                          <span className="btn-approval-description">
                            Send onboarding invite and create follow-up task
                          </span>
                        </div>
                      </button>

                      <button 
                        className="btn-approval btn-approval-deny"
                        onClick={handleDeny}
                      >
                        <XCircle size={24} />
                        <div className="btn-approval-content">
                          <span className="btn-approval-title">Deny Lead</span>
                          <span className="btn-approval-description">
                            Lead will be denied and automatically archived
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : selectedTask.type === 'onboarding_review' ? (
                <>
                  {(() => {
                    const lead = getLeadForTask(selectedTask.leadId);
                    const isInOnboarding = lead?.onboardingStatus === 'in_progress';
                    const onboardingComplete = (lead?.onboardingCompletion || 0) === 100;
                    
                    if (isInOnboarding) {
                      // Lead is already in onboarding - check if complete
                      if (onboardingComplete) {
                        // Onboarding is 100% complete - show approval/revision options
                        return (
                          <div className="task-detail-section">
                            <h3 className="task-detail-section-title">Onboarding Complete - Ready for Final Approval</h3>
                            
                            <div className="onboarding-sections-checkmarks">
                              <div className="section-checkpoint completed">
                                <div className="checkpoint-icon">
                                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className="checkpoint-label">Owner Info</div>
                              </div>
                              
                              <div className="checkpoint-connector completed" />
                              
                              <div className="section-checkpoint completed">
                                <div className="checkpoint-icon">
                                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className="checkpoint-label">Property Info</div>
                              </div>
                              
                              <div className="checkpoint-connector completed" />
                              
                              <div className="section-checkpoint completed">
                                <div className="checkpoint-icon">
                                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className="checkpoint-label">Management Preferences</div>
                              </div>
                              
                              <div className="checkpoint-connector completed" />
                              
                              <div className="section-checkpoint completed">
                                <div className="checkpoint-icon">
                                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className="checkpoint-label">Documents & Signatures</div>
                              </div>
                            </div>

                            <div className="approval-actions">
                              <button 
                                className="btn-approval btn-approval-approve"
                                onClick={handleApprove}
                              >
                                <CheckCircle size={24} />
                                <div className="btn-approval-content">
                                  <span className="btn-approval-title">Approve Onboarding</span>
                                  <span className="btn-approval-description">
                                    Complete onboarding and add owner under management
                                  </span>
                                </div>
                              </button>

                              <button 
                                className="btn-approval btn-approval-deny"
                                onClick={handleRequestRevisions}
                              >
                                <XCircle size={24} />
                                <div className="btn-approval-content">
                                  <span className="btn-approval-title">Send Back for Revisions</span>
                                  <span className="btn-approval-description">
                                    Request specific changes and create follow-up task
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>
                        );
                      } else {
                        // Onboarding is in progress but not complete - show as follow-up
                        return (
                          <div className="task-detail-section">
                            <h3 className="task-detail-section-title">Onboarding In Progress</h3>
                            
                            <div className="onboarding-sections-checkmarks">
                              <div className="section-checkpoint completed">
                                <div className="checkpoint-icon">
                                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                                </div>
                                <div className="checkpoint-label">Owner Info</div>
                              </div>
                              
                              <div className="checkpoint-connector completed" />
                              
                              <div className="section-checkpoint in-progress">
                                <div className="checkpoint-icon">
                                  <Clock size={24} style={{ color: '#f59e0b' }} />
                                </div>
                                <div className="checkpoint-label">Property Info</div>
                              </div>
                              
                              <div className="checkpoint-connector pending" />
                              
                              <div className="section-checkpoint pending">
                                <div className="checkpoint-icon">
                                  <Circle size={24} style={{ color: '#cbd5e1' }} />
                                </div>
                                <div className="checkpoint-label">Management Preferences</div>
                              </div>
                              
                              <div className="checkpoint-connector pending" />
                              
                              <div className="section-checkpoint pending">
                                <div className="checkpoint-icon">
                                  <Circle size={24} style={{ color: '#cbd5e1' }} />
                                </div>
                                <div className="checkpoint-label">Documents & Signatures</div>
                              </div>
                            </div>

                            <div style={{ 
                              padding: '16px', 
                              background: 'var(--warning-light)', 
                              borderRadius: 'var(--border-radius)',
                              marginTop: '16px',
                              border: '1px solid var(--warning)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <AlertCircle size={18} style={{ color: 'var(--warning)' }} />
                                <strong style={{ color: 'var(--warning)' }}>Onboarding Not Complete</strong>
                              </div>
                              <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                                The owner is currently at <strong>{lead?.onboardingCompletion}% completion</strong>. 
                                Follow up to help them complete the remaining sections before final approval can be processed.
                              </p>
                            </div>

                            {/* Follow-up Communication Actions */}
                            <div className="task-detail-section" style={{ marginTop: '16px' }}>
                              <h3 className="task-detail-section-title">Follow Up Actions</h3>
                              <div className="communication-buttons">
                                <button 
                                  className="btn-communication btn-communication-call"
                                  onClick={() => initiateCompletion('call')}
                                >
                                  <Phone size={20} />
                                  <div className="btn-communication-content">
                                    <span className="btn-communication-label">Call</span>
                                    <span className="btn-communication-value">
                                      {lead?.phone || 'N/A'}
                                    </span>
                                  </div>
                                </button>

                                <button 
                                  className="btn-communication btn-communication-text"
                                  onClick={() => initiateCompletion('text')}
                                >
                                  <MessageSquare size={20} />
                                  <div className="btn-communication-content">
                                    <span className="btn-communication-label">Text</span>
                                    <span className="btn-communication-value">
                                      {lead?.phone || 'N/A'}
                                    </span>
                                  </div>
                                </button>

                                <button 
                                  className="btn-communication btn-communication-email"
                                  onClick={() => initiateCompletion('email')}
                                >
                                  <Mail size={20} />
                                  <div className="btn-communication-content">
                                    <span className="btn-communication-label">Email</span>
                                    <span className="btn-communication-value">
                                      {lead?.email || 'N/A'}
                                    </span>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    } else {
                      // Lead approved but hasn't started onboarding yet
                      return (
                        <div className="task-detail-section">
                          <h3 className="task-detail-section-title">Start Onboarding Approval</h3>
                          <div className="approval-actions">
                            <button 
                              className="btn-approval btn-approval-approve"
                              onClick={handleApprove}
                            >
                              <CheckCircle size={24} />
                              <div className="btn-approval-content">
                                <span className="btn-approval-title">Approve & Send Onboarding</span>
                                <span className="btn-approval-description">
                                  Send onboarding invite and create follow-up task
                                </span>
                              </div>
                            </button>

                            <button 
                              className="btn-approval btn-approval-deny"
                              onClick={handleDeny}
                            >
                              <XCircle size={24} />
                              <div className="btn-approval-content">
                                <span className="btn-approval-title">Deny Lead</span>
                                <span className="btn-approval-description">
                                  Lead will be denied and automatically archived
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </>
              ) : null}

               {/* Lead Information - MOVED BELOW ACTIONS */}
               <div className="task-detail-section">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                   <h3 className="task-detail-section-title" style={{ marginBottom: 0 }}>Related Lead Information</h3>
                   {!isEditingLead ? (
                     <button 
                       className="btn btn-sm btn-secondary"
                       onClick={startEditingLead}
                     >
                       <Edit size={14} />
                       Edit Info
                     </button>
                   ) : (
                     <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                       <button 
                         className="btn btn-sm btn-secondary"
                         onClick={cancelEditingLead}
                       >
                         Cancel
                       </button>
                       <button 
                         className="btn btn-sm btn-success"
                         onClick={saveLeadEdits}
                       >
                         <CheckCircle size={14} />
                         Save Changes
                       </button>
                     </div>
                   )}
                 </div>
                 {(() => {
                   const lead = getLeadForTask(selectedTask.leadId);
                   if (!lead) {
                     return <p className="text-muted">Lead information not available</p>;
                   }
                   
                   const displayData = isEditingLead ? editedLeadData : lead;
                   
                   return (
                     <div className="task-lead-detail-card">
                       <div className="task-lead-header">
                         <div className="task-lead-avatar-lg">
                           {displayData.firstName[0]}{displayData.lastName[0]}
                         </div>
                         <div className="task-lead-header-info">
                           <div className="task-lead-name-lg">{displayData.firstName} {displayData.lastName}</div>
                           <div className="task-lead-status-row">
                             <span 
                               className="status-badge"
                               style={{ 
                                 backgroundColor: `${
                                   lead.status === 'qualified' ? '#10b98120' :
                                   lead.status === 'approved' ? '#8b5cf620' :
                                   lead.status === 'partial' ? '#f59e0b20' :
                                   '#6b728020'
                                 }`,
                                 color: 
                                   lead.status === 'qualified' ? '#10b981' :
                                   lead.status === 'approved' ? '#8b5cf6' :
                                   lead.status === 'partial' ? '#f59e0b' :
                                   '#6b7280'
                               }}
                             >
                               <CheckCircle size={12} />
                               {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                             </span>
                             {lead.completionPercentage < 100 && (
                               <span className="completion-badge">
                                 {lead.completionPercentage}% complete
                               </span>
                             )}
                           </div>
                         </div>
                         {onNavigateToLead && !isEditingLead && (
                           <button 
                             className="btn btn-sm btn-primary"
                             onClick={() => {
                               onNavigateToLead(selectedTask.leadId);
                               setShowTaskDetail(false);
                             }}
                           >
                             <ExternalLink size={14} />
                             View Full Lead
                           </button>
                         )}
                       </div>

                       <div className="task-lead-details-grid">
                         <div className="lead-detail-item">
                           <div className="lead-detail-label">
                             <Mail size={14} />
                             Email
                           </div>
                           {isEditingLead ? (
                             <input
                               type="email"
                               className="form-input form-input-sm"
                               value={displayData.email}
                               onChange={(e) => updateEditedField('email', e.target.value)}
                             />
                           ) : (
                             <div className="lead-detail-value">{displayData.email}</div>
                           )}
                         </div>
 
                         <div className="lead-detail-item">
                           <div className="lead-detail-label">
                             <Phone size={14} />
                             Phone
                           </div>
                           {isEditingLead ? (
                             <input
                               type="tel"
                               className="form-input form-input-sm"
                               value={displayData.phone}
                               onChange={(e) => updateEditedField('phone', e.target.value)}
                             />
                           ) : (
                             <div className="lead-detail-value">{displayData.phone}</div>
                           )}
                         </div>
 
                         <div className="lead-detail-item">
                           <div className="lead-detail-label">
                             <Calendar size={14} />
                             Created
                           </div>
                           <div className="lead-detail-value">
                             {new Date(lead.createdAt).toLocaleDateString('en-US', {
                               month: 'short',
                               day: 'numeric',
                               year: 'numeric'
                             })}
                           </div>
                         </div>
 
                         <div className="lead-detail-item">
                           <div className="lead-detail-label">
                             <User size={14} />
                             Source
                           </div>
                           <div className="lead-detail-value">{lead.source}</div>
                         </div>
                       </div>

                       {/* Form Answers from Lead Qualifying Form */}
                       {(lead.formAnswers || isEditingLead) && (
                         <div className="task-lead-form-answers">
                           <div className="lead-detail-label-section">
                             <MessageSquare size={14} />
                             Qualifying Form Answers
                           </div>
                           <div className="form-answers-list">
                             {isEditingLead ? (
                               // Show all form fields when editing
                               mockLeadQuestionnaireForm.sections.map(section => 
                                 section.fields.map(field => (
                                   <div key={field.id} className="form-answer-item">
                                     <div className="form-answer-label">{field.label}</div>
                                     {field.type === 'textarea' ? (
                                       <textarea
                                         className="form-input form-input-sm"
                                         value={displayData.formAnswers?.[field.id] || ''}
                                         onChange={(e) => updateEditedFormAnswer(field.id, e.target.value)}
                                         rows={2}
                                       />
                                     ) : field.type === 'select' ? (
                                       <select
                                         className="form-select form-input-sm"
                                         value={displayData.formAnswers?.[field.id] || ''}
                                         onChange={(e) => updateEditedFormAnswer(field.id, e.target.value)}
                                       >
                                         <option value="">Select...</option>
                                         {field.options?.map(opt => (
                                           <option key={opt} value={opt}>{opt}</option>
                                         ))}
                                       </select>
                                     ) : (
                                       <input
                                         type={field.type}
                                         className="form-input form-input-sm"
                                         value={displayData.formAnswers?.[field.id] || ''}
                                         onChange={(e) => updateEditedFormAnswer(field.id, e.target.value)}
                                       />
                                     )}
                                   </div>
                                 ))
                               )
                             ) : (
                               // Show only filled answers when not editing
                               lead.formAnswers && Object.entries(lead.formAnswers).map(([fieldId, value]) => (
                                 <div key={fieldId} className="form-answer-item">
                                   <div className="form-answer-label">{getFormFieldLabel(fieldId)}</div>
                                   <div className="form-answer-value">{value}</div>
                                 </div>
                               ))
                             )}
                           </div>
                         </div>
                       )}

                      {lead.properties && lead.properties.length > 0 && (
                        <div className="task-lead-properties">
                          <div className="lead-detail-label-section">
                            <Home size={14} />
                            Properties ({lead.properties.length})
                          </div>
                          <div className="properties-mini-list">
                            {lead.properties.map((property, index) => (
                              <div key={property.id} className="property-mini-card">
                                <div className="property-mini-icon">
                                  <Home size={16} />
                                </div>
                                <div className="property-mini-info">
                                  <div className="property-mini-address">{property.address}</div>
                                  <div className="property-mini-details">
                                    {property.bedrooms} bed • {property.bathrooms} bath
                                    {property.minRentPrice && ` • $${property.minRentPrice}/mo`}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {lead.notes && (
                        <div className="task-lead-notes">
                          <div className="lead-detail-label-section">
                            <MessageSquare size={14} />
                            Notes
                          </div>
                          <div className="lead-notes-content">{lead.notes}</div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Assignment */}
              <div className="task-detail-section">
                <h3 className="task-detail-section-title">Assignment</h3>
                {selectedTask.assignedTo ? (
                  <div className="task-assignment">
                    <User size={16} />
                    <span>Assigned to <strong>{selectedTask.assignedTo}</strong></span>
                  </div>
                ) : (
                  <div className="task-assignment unassigned">
                    <AlertCircle size={16} />
                    <span>Unassigned</span>
                  </div>
                )}
              </div>
            </div>

            {/* Past Tasks */}
            {getPastTasksForLead(selectedTask.leadId).length > 0 && (
              <div className="task-detail-section">
                <div className="section-header-with-toggle">
                  <h3 className="task-detail-section-title">Past Tasks</h3>
                  <button 
                    className="btn-link"
                    onClick={() => setShowPastTasks(!showPastTasks)}
                  >
                    {showPastTasks ? 'Hide' : 'Show'} ({getPastTasksForLead(selectedTask.leadId).length})
                  </button>
                </div>
                {showPastTasks && (
                  <div className="past-tasks-list">
                    {getPastTasksForLead(selectedTask.leadId).map(task => (
                      <div key={task.id} className="past-task-item">
                        <div className="past-task-icon">
                          <CheckCircle size={16} style={{ color: '#10b981' }} />
                        </div>
                        <div className="past-task-content">
                          <div className="past-task-title">{task.title}</div>
                          {task.description && (
                            <div className="past-task-description">{task.description}</div>
                          )}
                          <div className="past-task-meta">
                            {task.assignedTo && <span>{task.assignedTo}</span>}
                            {task.completedAt && (
                              <>
                                <span className="task-separator">•</span>
                                <span>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                              </>
                            )}
                            {task.cadenceDay && (
                              <>
                                <span className="task-separator">•</span>
                                <span>Day {task.cadenceDay}</span>
                              </>
                            )}
                          </div>
                          {task.notes && (
                            <div className="past-task-notes">
                              <strong>Note:</strong> {task.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedTask.type === 'follow_up' && (
              <div className="modal-actions">
                <div className="btn-group">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => snoozeTask(selectedTask.id, 1)}
                  >
                    <Clock size={18} />
                    Snooze 1 Day
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => snoozeTask(selectedTask.id, 3)}
                  >
                    <Clock size={18} />
                    Snooze 3 Days
                  </button>
                </div>

                <button className="btn btn-secondary">
                  <UserCheck size={18} />
                  Reassign
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="modal-overlay" onClick={() => setShowCreateTaskModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="btn-close" onClick={() => setShowCreateTaskModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Task Title <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Follow up with owner about lease renewal"
                    value={newTask.title}
                    onChange={(e) => updateNewTaskField('title', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Add details about this task..."
                  value={newTask.description}
                  onChange={(e) => updateNewTaskField('description', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Task Type</label>
                  <select
                    className="form-select"
                    value={newTask.type}
                    onChange={(e) => updateNewTaskField('type', e.target.value)}
                  >
                    <option value="general">General Task</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="approval">Approval Required</option>
                    <option value="onboarding_review">Onboarding Review</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) => updateNewTaskField('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    value={newTask.assignedTo}
                    onChange={(e) => updateNewTaskField('assignedTo', e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {mockUsers.map(user => (
                      <option key={user.id} value={user.name}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Due Date <span className="required">*</span></label>
                  <input
                    type="date"
                    className="form-input"
                    value={newTask.dueDate}
                    onChange={(e) => updateNewTaskField('dueDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Related to Lead (Optional)</label>
                <select
                  className="form-select"
                  value={newTask.leadId}
                  onChange={(e) => updateNewTaskField('leadId', e.target.value)}
                >
                  <option value="">No lead selected</option>
                  {mockLeads.filter(l => l.status !== 'archived').map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.firstName} {lead.lastName} - {lead.email}
                    </option>
                  ))}
                </select>
                <p className="form-help">
                  Link this task to a specific lead for better tracking
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowCreateTaskModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={createManualTask}
                disabled={!newTask.title.trim() || !newTask.dueDate}
              >
                <CheckCircle size={18} />
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {showRevisionModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowRevisionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Revisions</h2>
              <button className="btn-close" onClick={() => setShowRevisionModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="revision-instructions">
                <h3>What needs to be changed?</h3>
                <p className="help-text">
                  Be specific about what information needs to be corrected or completed. 
                  This message will be sent to {getLeadForTask(selectedTask.leadId)?.firstName}.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Revision Notes <span className="required">*</span></label>
                <textarea
                  className="form-input"
                  rows={6}
                  placeholder="Example: Please update the following:&#10;- Property address is incomplete&#10;- Bathroom count needs to be verified&#10;- HOA information is required"
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                />
                <p className="form-help">
                  Tip: Use bullet points to make it clear what needs attention
                </p>
              </div>

              <div className="revision-preview">
                <div className="preview-label">
                  <MessageSquare size={14} />
                  Preview - What they'll receive:
                </div>
                <div className="preview-box">
                  <div className="preview-subject">Subject: Action Required - Onboarding Application Updates</div>
                  <div className="preview-body">
                    <p>Hi {getLeadForTask(selectedTask.leadId)?.firstName},</p>
                    <p>Thank you for submitting your onboarding application. We've reviewed it and need some additional information or corrections:</p>
                    <div className="preview-notes">
                      {revisionNotes || <em className="text-muted">Your revision notes will appear here...</em>}
                    </div>
                    <p>Please log back in to update your application. If you have any questions, feel free to reach out.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowRevisionModal(false);
                  setRevisionNotes('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-warning"
                onClick={submitRevisionRequest}
                disabled={!revisionNotes.trim()}
              >
                <MessageSquare size={18} />
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Completion Modal */}
      {showCompletionModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Complete Task</h2>
              <button className="btn-close" onClick={() => setShowCompletionModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="completion-question">
                <h3>Did {getLeadForTask(selectedTask.leadId)?.firstName} answer?</h3>
                <p className="help-text">This helps us track successful contact and plan follow-ups</p>
              </div>

              <div className="completion-options">
                <button
                  className={`completion-option ${completionOutcome === 'answered' ? 'selected' : ''}`}
                  onClick={() => setCompletionOutcome('answered')}
                >
                  <div className="completion-option-icon success">
                    <CheckCircle size={24} />
                  </div>
                  <div className="completion-option-content">
                    <div className="completion-option-title">Yes, They Answered</div>
                    <div className="completion-option-description">
                      Task will be marked complete and moved to past tasks
                    </div>
                  </div>
                </button>

                <button
                  className={`completion-option ${completionOutcome === 'no-answer' ? 'selected' : ''}`}
                  onClick={() => setCompletionOutcome('no-answer')}
                >
                  <div className="completion-option-icon warning">
                    <AlertCircle size={24} />
                  </div>
                  <div className="completion-option-content">
                    <div className="completion-option-title">No Answer / Left Message</div>
                    <div className="completion-option-description">
                      {selectedTask.cadenceDay ? (
                        <>Next follow-up will be scheduled for Day {getNextFibonacciDay(selectedTask.cadenceDay) || 'Auto-archive'}</>
                      ) : (
                        <>Follow-up will be scheduled</>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {completionOutcome && (
                <div className="completion-notes">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder={
                      completionOutcome === 'answered' 
                        ? "What did you discuss? Any next steps?" 
                        : "Left voicemail? Any details?"
                    }
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowCompletionModal(false);
                  setCompletionOutcome(null);
                  setCompletionNote('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={completeTask}
                disabled={!completionOutcome}
              >
                <CheckCircle size={18} />
                {completionOutcome === 'answered' ? 'Complete Task' : 'Complete & Schedule Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksWidget;

