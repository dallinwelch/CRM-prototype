import React, { useState } from 'react';
import { Edit, Users, FileText, CheckCircle, Clock, AlertCircle, GripVertical, X } from 'lucide-react';

const LeadToLeaseDashboard = () => {
  const [lanes, setLanes] = useState([
    { id: 'leads', title: 'Leads', color: '#3b82f6', count: 3 },
    { id: 'scheduled-tour', title: 'Scheduled Tour', color: '#8b5cf6', count: 3 },
    { id: 'applicant-started', title: 'Applicant Started', color: '#f59e0b', count: 2 },
    { id: 'applicant-completed', title: 'Applicant Completed', color: '#ef4444', count: 2 },
    { id: 'verification-started', title: 'Verification Started', color: '#10b981', count: 1 },
    { id: 'verification-finished', title: 'Verification Finished', color: '#06b6d4', count: 1 },
    { id: 'lease-generated', title: 'Lease Generated', color: '#84cc16', count: 1 },
    { id: 'lease-signed', title: 'Lease Signed', color: '#6366f1', count: 1 },
    { id: 'tenants', title: 'Tenants', color: '#a855f7', count: 3 }
  ]);

  const [showCustomize, setShowCustomize] = useState(false);
  const [editingLane, setEditingLane] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Sample lead data for each lane
  const leadData = {
    leads: [
      { id: 1, name: 'John Smith', email: 'john@email.com', phone: '(555) 123-4567', date: '2024-01-14', priority: 'high' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 234-5678', date: '2024-01-13', priority: 'medium' },
      { id: 3, name: 'Mike Davis', email: 'mike@email.com', phone: '(555) 345-6789', date: '2024-01-12', priority: 'low' }
    ],
    'scheduled-tour': [
      { id: 4, name: 'Lisa Chen', email: 'lisa@email.com', phone: '(555) 456-7890', date: '2024-01-11', priority: 'high' },
      { id: 5, name: 'David Brown', email: 'david@email.com', phone: '(555) 567-8901', date: '2024-01-10', priority: 'medium' },
      { id: 6, name: 'Emma Wilson', email: 'emma@email.com', phone: '(555) 678-9012', date: '2024-01-09', priority: 'high' }
    ],
    'applicant-started': [
      { id: 7, name: 'Alex Garcia', email: 'alex@email.com', phone: '(555) 789-0123', date: '2024-01-08', priority: 'medium' },
      { id: 8, name: 'Maria Rodriguez', email: 'maria@email.com', phone: '(555) 890-1234', date: '2024-01-07', priority: 'high' }
    ],
    'applicant-completed': [
      { id: 9, name: 'James Taylor', email: 'james@email.com', phone: '(555) 901-2345', date: '2024-01-06', priority: 'high' },
      { id: 10, name: 'Jennifer Lee', email: 'jennifer@email.com', phone: '(555) 012-3456', date: '2024-01-05', priority: 'medium' }
    ],
    'verification-started': [
      { id: 11, name: 'Robert Kim', email: 'robert@email.com', phone: '(555) 123-4567', date: '2024-01-04', priority: 'high' }
    ],
    'verification-finished': [
      { id: 12, name: 'Amanda White', email: 'amanda@email.com', phone: '(555) 234-5678', date: '2024-01-03', priority: 'medium' }
    ],
    'lease-generated': [
      { id: 13, name: 'Chris Anderson', email: 'chris@email.com', phone: '(555) 345-6789', date: '2024-01-02', priority: 'high' }
    ],
    'lease-signed': [
      { id: 14, name: 'Michael Johnson', email: 'michael@email.com', phone: '(555) 456-7890', date: '2024-01-01', priority: 'high' }
    ],
    'tenants': [
      { id: 15, name: 'Sarah Davis', email: 'sarah@email.com', phone: '(555) 567-8901', date: '2023-12-31', priority: 'medium' },
      { id: 16, name: 'David Wilson', email: 'david@email.com', phone: '(555) 678-9012', date: '2023-12-30', priority: 'low' },
      { id: 17, name: 'Lisa Brown', email: 'lisa@email.com', phone: '(555) 789-0123', date: '2023-12-29', priority: 'medium' }
    ]
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#64748b';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={12} />;
      case 'medium': return <Clock size={12} />;
      case 'low': return <CheckCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const addLane = () => {
    const newLane = {
      id: `lane-${Date.now()}`,
      title: 'New Lane',
      color: '#64748b',
      count: 0
    };
    setLanes([...lanes, newLane]);
  };

  const deleteLane = (laneId) => {
    setLanes(lanes.filter(lane => lane.id !== laneId));
  };

  const updateLaneTitle = (laneId, newTitle) => {
    setLanes(lanes.map(lane => 
      lane.id === laneId ? { ...lane, title: newTitle } : lane
    ));
  };

  const updateLaneColor = (laneId, newColor) => {
    setLanes(lanes.map(lane => 
      lane.id === laneId ? { ...lane, color: newColor } : lane
    ));
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newLanes = [...lanes];
    const draggedLane = newLanes[draggedItem];
    newLanes.splice(draggedItem, 1);
    newLanes.splice(dropIndex, 0, draggedLane);

    setLanes(newLanes);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Home / Marketing / Lead to Lease</span>
      </div>

      {/* Page Title and Controls */}
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
          Lead to Lease Pipeline
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCustomize(true)}
          >
            <Edit size={16} style={{ marginRight: '4px' }} />
            Customize
          </button>
        </div>
      </div>


      {/* Swim Lanes Container */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem',
        minHeight: '600px'
      }}>
        {lanes.map((lane) => (
          <div 
            key={lane.id} 
            style={{ 
              minWidth: '300px', 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content'
            }}
          >
            {/* Lane Header */}
            <div style={{ 
              padding: '1rem', 
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: lane.color
                }} />
                {editingLane === lane.id ? (
                  <input
                    type="text"
                    value={lane.title}
                    onChange={(e) => setLanes(lanes.map(l => 
                      l.id === lane.id ? { ...l, title: e.target.value } : l
                    ))}
                    onBlur={() => setEditingLane(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingLane(null)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      outline: 'none',
                      color: 'rgb(68, 71, 69)'
                    }}
                    autoFocus
                  />
                ) : (
                  <span 
                    style={{ 
                      fontWeight: '600', 
                      fontSize: '0.875rem',
                      color: 'rgb(68, 71, 69)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setEditingLane(lane.id)}
                  >
                    {lane.title}
                  </span>
                )}
                <span style={{
                  backgroundColor: lane.color,
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {lane.count}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <input
                  type="color"
                  value={lane.color}
                  onChange={(e) => updateLaneColor(lane.id, e.target.value)}
                  style={{ width: '24px', height: '24px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Lane Content */}
            <div style={{ padding: '1rem', flex: 1, minHeight: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(leadData[lane.id] || []).map((lead) => (
                  <div 
                    key={lead.id}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.borderColor = lane.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: 'rgb(68, 71, 69)',
                        margin: 0
                      }}>
                        {lead.name}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: getPriorityColor(lead.priority)
                      }}>
                        {getPriorityIcon(lead.priority)}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      {lead.email}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      {lead.phone}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#64748b',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{new Date(lead.date).toLocaleDateString()}</span>
                      <span style={{
                        padding: '0.125rem 0.375rem',
                        backgroundColor: getPriorityColor(lead.priority),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.625rem',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {lead.priority}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Empty State */}
                {(!leadData[lane.id] || leadData[lane.id].length === 0) && (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    color: '#64748b',
                    fontSize: '0.875rem'
                  }}>
                    <Users size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <div>No leads in this stage</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Statistics */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Pipeline Statistics</h3>
          <p className="card-subtitle">Conversion rates and performance metrics</p>
        </div>
        <div className="card-body">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'rgb(0, 165, 79)' }}>24</div>
              <div className="stat-label">Total Leads</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'rgb(11, 67, 119)' }}>33%</div>
              <div className="stat-label">Conversion Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'rgb(245, 158, 11)' }}>12</div>
              <div className="stat-label">Days Avg. Cycle</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'rgb(139, 92, 246)' }}>8</div>
              <div className="stat-label">Active Applications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      {showCustomize && (
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
            borderRadius: '8px',
            padding: '2rem',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem' 
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'rgb(68, 71, 69)',
                margin: 0
              }}>
                Customize Pipeline Lanes
              </h2>
              <button
                onClick={() => setShowCustomize(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  color: '#64748b'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <button 
                className="btn btn-primary"
                onClick={addLane}
                style={{ marginBottom: '1rem' }}
              >
                Add New Lane
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lanes.map((lane, index) => (
                <div
                  key={lane.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'move',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <GripVertical size={20} color="#64748b" />
                  
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: lane.color
                  }} />
                  
                  <div style={{ flex: 1 }}>
                    {editingLane === lane.id ? (
                      <input
                        type="text"
                        value={lane.title}
                        onChange={(e) => updateLaneTitle(lane.id, e.target.value)}
                        onBlur={() => setEditingLane(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingLane(null)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '0.5rem',
                          fontSize: '0.875rem',
                          width: '100%',
                          outline: 'none'
                        }}
                        autoFocus
                      />
                    ) : (
                      <span 
                        style={{ 
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: 'rgb(68, 71, 69)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setEditingLane(lane.id)}
                      >
                        {lane.title}
                      </span>
                    )}
                  </div>
                  
                  <input
                    type="color"
                    value={lane.color}
                    onChange={(e) => updateLaneColor(lane.id, e.target.value)}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  />
                  
                  <span style={{
                    backgroundColor: lane.color,
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    minWidth: '24px',
                    textAlign: 'center'
                  }}>
                    {lane.count}
                  </span>
                  
                  <button
                    onClick={() => deleteLane(lane.id)}
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
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '1rem', 
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCustomize(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCustomize(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadToLeaseDashboard;
