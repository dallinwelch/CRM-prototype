import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import TasksWidget from './TasksWidget';

const Dashboard = () => {
  const stats = [
    { label: 'Total Tasks', value: '24', icon: CheckCircle, color: 'rgb(0, 165, 79)' },
    { label: 'Active Projects', value: '8', icon: BarChart3, color: 'rgb(11, 67, 119)' },
    { label: 'Team Members', value: '12', icon: Users, color: 'rgb(16, 185, 129)' },
    { label: 'Revenue', value: '$45,230', icon: DollarSign, color: 'rgb(245, 158, 11)' },
    { label: 'Completion Rate', value: '87%', icon: TrendingUp, color: 'rgb(139, 92, 246)' },
    { label: 'This Month', value: '156', icon: Calendar, color: 'rgb(239, 68, 68)' }
  ];

  const recentActivities = [
    { id: 1, action: 'New task created', user: 'John Doe', time: '2 minutes ago', type: 'task' },
    { id: 2, action: 'Task completed', user: 'Sarah Wilson', time: '15 minutes ago', type: 'success' },
    { id: 3, action: 'New lead added', user: 'Mike Johnson', time: '1 hour ago', type: 'lead' },
    { id: 4, action: 'Automation triggered', user: 'System', time: '2 hours ago', type: 'automation' },
    { id: 5, action: 'Report generated', user: 'Lisa Chen', time: '3 hours ago', type: 'report' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task': return <CheckCircle size={16} color="rgb(0, 165, 79)" />;
      case 'success': return <CheckCircle size={16} color="rgb(16, 185, 129)" />;
      case 'lead': return <Users size={16} color="rgb(11, 67, 119)" />;
      case 'automation': return <BarChart3 size={16} color="rgb(139, 92, 246)" />;
      case 'report': return <DollarSign size={16} color="rgb(245, 158, 11)" />;
      default: return <CheckCircle size={16} />;
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Home / Dashboard</span>
      </div>

      {/* Page Title */}
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        color: 'rgb(68, 71, 69)', 
        marginBottom: '2rem' 
      }}>
        Dashboard
      </h1>

      {/* Tasks Bar - Raised and Prominent */}
      <div style={{ marginBottom: '2rem' }}>
        <TasksWidget />
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Icon size={24} color={stat.color} />
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </span>
              </div>
              <div className="stat-number" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activities</h3>
            <p className="card-subtitle">Latest updates from your team</p>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivities.map(activity => (
                <div key={activity.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px'
                }}>
                  {getActivityIcon(activity.type)}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: 'rgb(68, 71, 69)' }}>
                      {activity.action}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      by {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-subtitle">Common tasks and shortcuts</p>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />
                Create New Task
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Users size={16} style={{ marginRight: '0.5rem' }} />
                Add Team Member
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <BarChart3 size={16} style={{ marginRight: '0.5rem' }} />
                Generate Report
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <DollarSign size={16} style={{ marginRight: '0.5rem' }} />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
