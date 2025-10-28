import React, { useState } from 'react';
import { Plus, Filter, Calendar, User, Clock, AlertCircle } from 'lucide-react';

const TasksDashboard = () => {
  const [filter, setFilter] = useState('all');

  // Hardcoded task data
  const tasks = [
    {
      id: 1,
      title: 'Follow up with Acme Corp',
      description: 'Schedule meeting to discuss Q4 contract renewal',
      priority: 'high',
      status: 'in-progress',
      assignee: 'John Doe',
      assigneeInitials: 'JD',
      dueDate: '2024-01-15',
      createdDate: '2024-01-10',
      customer: 'Acme Corp'
    },
    {
      id: 2,
      title: 'Prepare proposal for TechStart Inc',
      description: 'Create detailed proposal for new software implementation',
      priority: 'medium',
      status: 'todo',
      assignee: 'Sarah Wilson',
      assigneeInitials: 'SW',
      dueDate: '2024-01-20',
      createdDate: '2024-01-12',
      customer: 'TechStart Inc'
    },
    {
      id: 3,
      title: 'Review contract terms',
      description: 'Legal review of new partnership agreement',
      priority: 'high',
      status: 'review',
      assignee: 'Mike Johnson',
      assigneeInitials: 'MJ',
      dueDate: '2024-01-18',
      createdDate: '2024-01-08',
      customer: 'Global Solutions'
    },
    {
      id: 4,
      title: 'Update customer database',
      description: 'Sync customer information with new CRM system',
      priority: 'low',
      status: 'done',
      assignee: 'Lisa Chen',
      assigneeInitials: 'LC',
      dueDate: '2024-01-14',
      createdDate: '2024-01-05',
      customer: 'Internal'
    },
    {
      id: 5,
      title: 'Client onboarding call',
      description: 'Initial setup call with new enterprise client',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'David Brown',
      assigneeInitials: 'DB',
      dueDate: '2024-01-22',
      createdDate: '2024-01-13',
      customer: 'Enterprise Corp'
    },
    {
      id: 6,
      title: 'Quarterly review preparation',
      description: 'Compile data and prepare presentation for Q1 review',
      priority: 'high',
      status: 'todo',
      assignee: 'Emma Davis',
      assigneeInitials: 'ED',
      dueDate: '2024-01-25',
      createdDate: '2024-01-14',
      customer: 'Internal'
    }
  ];

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'done').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    overdue: tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== 'done';
    }).length
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'todo': return 'status-todo';
      case 'in-progress': return 'status-in-progress';
      case 'review': return 'status-review';
      case 'done': return 'status-done';
      default: return 'status-todo';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return 'To Do';
    }
  };

  const isOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Home / Tasks</span>
      </div>

      {/* Page Title */}
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        color: 'rgb(68, 71, 69)', 
        marginBottom: '2rem' 
      }}>
        Tasks
      </h1>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: stats.overdue > 0 ? '#dc2626' : '#16a34a' }}>
            {stats.overdue}
          </div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* Task Management Header */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Task Management</h2>
              <p className="card-subtitle">Manage and track your customer-related tasks</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary">
                <Filter size={16} style={{ marginRight: '4px' }} />
                Filter
              </button>
              <button className="btn btn-primary">
                <Plus size={16} style={{ marginRight: '4px' }} />
                New Task
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['all', 'todo', 'in-progress', 'review', 'done'].map(status => (
              <button
                key={status}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(status)}
                style={{ textTransform: 'capitalize' }}
              >
                {status === 'all' ? 'All Tasks' : getStatusLabel(status)}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          <div className="task-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <div style={{ flex: 1 }}>
                    <h3 className="task-title">{task.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {task.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`status-badge ${getStatusBadge(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="task-meta">
                  <div className="task-assignee">
                    <div className="avatar">{task.assigneeInitials}</div>
                    <span>{task.assignee}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    <span style={{ 
                      color: isOverdue(task.dueDate) && task.status !== 'done' ? '#dc2626' : '#64748b',
                      fontWeight: isOverdue(task.dueDate) && task.status !== 'done' ? '600' : 'normal'
                    }}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    {isOverdue(task.dueDate) && task.status !== 'done' && (
                      <AlertCircle size={14} color="#dc2626" />
                    )}
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '0.5rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <strong>Customer:</strong> {task.customer}
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#64748b' 
            }}>
              <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No tasks found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksDashboard;
