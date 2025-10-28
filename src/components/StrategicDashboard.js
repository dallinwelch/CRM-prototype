import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign, 
  Calendar,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Phone,
  Mail,
  Plus,
  Filter,
  Search
} from 'lucide-react';

const StrategicDashboard = () => {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  // Priority tasks data
  const priorityTasks = [
    {
      id: 1,
      title: 'Urgent Maintenance Request - Unit 4B',
      type: 'maintenance',
      priority: 'urgent',
      dueDate: '2024-01-15',
      timeLeft: '2 hours',
      property: 'Sunset Apartments',
      unit: '4B',
      description: 'Water leak in kitchen - tenant reported flooding',
      impact: 'high',
      revenue: 0,
      effort: 'medium',
      category: 'reactive'
    },
    {
      id: 2,
      title: 'Lease Renewal - Unit 2A',
      type: 'renewal',
      priority: 'high',
      dueDate: '2024-01-20',
      timeLeft: '5 days',
      property: 'Sunset Apartments',
      unit: '2A',
      description: 'Current lease expires in 5 days - need to negotiate renewal',
      impact: 'high',
      revenue: 1200,
      effort: 'low',
      category: 'revenue'
    },
    {
      id: 3,
      title: 'Vacant Unit Marketing - Unit 1C',
      type: 'vacancy',
      priority: 'high',
      dueDate: '2024-01-25',
      timeLeft: '10 days',
      property: 'Sunset Apartments',
      unit: '1C',
      description: 'Unit has been vacant for 2 weeks - need immediate marketing push',
      impact: 'high',
      revenue: -1800,
      effort: 'medium',
      category: 'revenue'
    },
    {
      id: 4,
      title: 'Owner Outreach - 5 Properties',
      type: 'growth',
      priority: 'medium',
      dueDate: '2024-01-30',
      timeLeft: '15 days',
      property: 'Various',
      unit: 'N/A',
      description: 'Follow up with 5 property owners for management services',
      impact: 'very-high',
      revenue: 5000,
      effort: 'high',
      category: 'growth'
    },
    {
      id: 5,
      title: 'Routine Maintenance - HVAC Check',
      type: 'maintenance',
      priority: 'medium',
      dueDate: '2024-01-18',
      timeLeft: '3 days',
      property: 'Sunset Apartments',
      unit: 'All',
      description: 'Quarterly HVAC maintenance for all units',
      impact: 'medium',
      revenue: 0,
      effort: 'medium',
      category: 'preventive'
    },
    {
      id: 6,
      title: 'Lease Renewal - Unit 3B',
      type: 'renewal',
      priority: 'medium',
      dueDate: '2024-02-01',
      timeLeft: '17 days',
      property: 'Sunset Apartments',
      unit: '3B',
      description: 'Lease renewal discussion with tenant',
      impact: 'high',
      revenue: 1100,
      effort: 'low',
      category: 'revenue'
    }
  ];

  // Business growth opportunities
  const growthOpportunities = [
    {
      id: 1,
      title: 'Smith Property Management',
      type: 'owner',
      status: 'warm-lead',
      properties: 8,
      potentialRevenue: 12000,
      lastContact: '2024-01-10',
      nextAction: 'Send proposal',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Johnson Real Estate',
      type: 'owner',
      status: 'cold-lead',
      properties: 12,
      potentialRevenue: 18000,
      lastContact: '2024-01-05',
      nextAction: 'Initial call',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Williams Investment Group',
      type: 'owner',
      status: 'proposal-sent',
      properties: 15,
      potentialRevenue: 25000,
      lastContact: '2024-01-12',
      nextAction: 'Follow up call',
      priority: 'high'
    }
  ];

  // Key metrics
  const metrics = [
    {
      title: 'Vacancy Rate',
      value: '8.3%',
      change: '+2.1%',
      trend: 'up',
      color: 'red',
      description: '2 units vacant out of 24'
    },
    {
      title: 'Renewal Rate',
      value: '85%',
      change: '+5%',
      trend: 'up',
      color: 'green',
      description: '17 out of 20 leases renewed'
    },
    {
      title: 'Maintenance Response',
      value: '4.2 hrs',
      change: '-0.8 hrs',
      trend: 'up',
      color: 'green',
      description: 'Average response time'
    },
    {
      title: 'Growth Pipeline',
      value: '$55K',
      change: '+$12K',
      trend: 'up',
      color: 'blue',
      description: 'Potential new revenue'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle size={16} />;
      case 'high': return <Clock size={16} />;
      case 'medium': return <Target size={16} />;
      case 'low': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'reactive': return <AlertTriangle size={16} />;
      case 'revenue': return <DollarSign size={16} />;
      case 'growth': return <TrendingUp size={16} />;
      case 'preventive': return <Zap size={16} />;
      default: return <Target size={16} />;
    }
  };

  const filteredTasks = priorityTasks.filter(task => {
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedTimeframe === 'today' && task.dueDate !== '2024-01-15') return false;
    if (selectedTimeframe === 'week' && new Date(task.dueDate) > new Date('2024-01-21')) return false;
    return true;
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '0.5rem'
        }}>
          Strategic Dashboard
        </h1>
        <p style={{ 
          color: '#64748b',
          fontSize: '1.125rem'
        }}>
          What should you work on next? Focus on high-impact tasks that grow your business.
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <h3 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#64748b',
                margin: 0
              }}>
                {metric.title}
              </h3>
              <span style={{
                fontSize: '0.75rem',
                color: metric.trend === 'up' ? '#16a34a' : '#dc2626',
                fontWeight: '600'
              }}>
                {metric.change}
              </span>
            </div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '0.25rem'
            }}>
              {metric.value}
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#64748b' 
            }}>
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#64748b" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="#64748b" />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white'
            }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Priority Tasks */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1e293b',
              margin: 0
            }}>
              Priority Tasks
            </h2>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <Plus size={16} />
              Add Task
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredTasks.map(task => (
              <div key={task.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      color: getPriorityColor(task.priority),
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {getPriorityIcon(task.priority)}
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: '#1e293b',
                        margin: 0,
                        marginBottom: '0.25rem'
                      }}>
                        {task.title}
                      </h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#64748b'
                      }}>
                        <Building size={14} />
                        <span>{task.property} - {task.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    <Clock size={14} />
                    <span>{task.timeLeft}</span>
                  </div>
                </div>

                <p style={{ 
                  color: '#64748b',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  {task.description}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      {getCategoryIcon(task.category)}
                      <span style={{ textTransform: 'capitalize' }}>{task.category}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: task.revenue > 0 ? '#16a34a' : task.revenue < 0 ? '#dc2626' : '#64748b'
                    }}>
                      <DollarSign size={12} />
                      <span>${Math.abs(task.revenue).toLocaleString()}</span>
                    </div>
                  </div>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    <ArrowRight size={14} />
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Opportunities */}
        <div>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '1.5rem',
            margin: 0
          }}>
            Growth Opportunities
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {growthOpportunities.map(opportunity => (
              <div key={opportunity.id} style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      margin: 0,
                      marginBottom: '0.25rem'
                    }}>
                      {opportunity.title}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <Building size={14} />
                      <span>{opportunity.properties} properties</span>
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: opportunity.priority === 'high' ? '#fef2f2' : '#f0f9ff',
                    color: opportunity.priority === 'high' ? '#dc2626' : '#0369a1',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {opportunity.priority}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#16a34a'
                  }}>
                    ${opportunity.potentialRevenue.toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b'
                  }}>
                    Last: {opportunity.lastContact}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b'
                  }}>
                    Next: {opportunity.nextAction}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                      padding: '0.5rem',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Phone size={14} />
                    </button>
                    <button style={{
                      padding: '0.5rem',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <Mail size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem',
            marginTop: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '1rem',
              margin: 0
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <Users size={16} />
                <span>Find New Owners</span>
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <TrendingUp size={16} />
                <span>Analyze Market</span>
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <Target size={16} />
                <span>Set Goals</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicDashboard;
