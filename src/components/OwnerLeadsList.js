import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle, 
  X, 
  Archive,
  Edit,
  Eye,
  UserCheck,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { currentUser } from '../mockData';

const OwnerLeadsList = ({ leads, filterStatus, onNavigateToLead, onCreateLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState(filterStatus || 'all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Filter and sort leads
  const getFilteredLeads = () => {
    let filtered = leads;

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'archived') {
        filtered = filtered.filter(l => l.status === 'archived' || l.status === 'completed');
      } else {
        filtered = filtered.filter(l => l.status === statusFilter);
      }
    } else {
      // Don't show archived or completed in "all" view
      filtered = filtered.filter(l => l.status !== 'archived' && l.status !== 'completed');
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(l => 
        l.firstName.toLowerCase().includes(term) ||
        l.lastName.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        (l.phone && l.phone.includes(term))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredLeads = getFilteredLeads();

  const toggleLeadSelection = (leadId) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleAllLeads = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleBulkAction = (action) => {
    const leadCount = selectedLeads.size;
    if (action === 'archive') {
      if (window.confirm(`Are you sure you want to archive ${leadCount} lead(s)? This will remove them from the active list.`)) {
        console.log(`Archiving ${leadCount} leads:`, Array.from(selectedLeads));
        // In real app, would update leads to archived status
        setSelectedLeads(new Set());
      }
    } else {
      console.log(`Bulk ${action} for leads:`, Array.from(selectedLeads));
      // In real app, would update leads
      setSelectedLeads(new Set());
    }
  };

  const handleArchiveLead = (leadId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to archive this lead?')) {
      console.log('Archiving lead:', leadId);
      // In real app, would update lead status to archived
    }
    setOpenDropdown(null);
  };

  const getStatusBadge = (lead) => {
    const configs = {
      lead: { color: '#f59e0b', label: 'Lead', icon: AlertCircle },
      application: { color: '#3b82f6', label: 'Application', icon: Clock },
      'awaiting approval': { color: '#8b5cf6', label: 'Awaiting Approval', icon: UserCheck },
      archived: { color: '#6b7280', label: 'Archived', icon: Archive }
    };

    const config = configs[lead.status] || configs.lead;
    const Icon = config.icon;

    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: `${config.color}20`,
          color: config.color
        }}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const formatPropertyCount = (count) => {
    if (count === 0) return 'None';
    if (count >= 4) return '4+';
    return count.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="owner-leads-list">
      {/* Header */}
      <div className="list-header">
        <div>
          <h1 className="list-title">Owner Leads</h1>
          <p className="list-subtitle">
            {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
            {selectedLeads.size > 0 && ` • ${selectedLeads.size} selected`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onCreateLead}>
          <Plus size={18} />
          New Lead
        </button>
      </div>

      {/* Filters and Search */}
      <div className="list-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Active
          </button>
          <button
            className={`filter-tab ${statusFilter === 'lead' ? 'active' : ''}`}
            onClick={() => setStatusFilter('lead')}
          >
            Lead
          </button>
          <button
            className={`filter-tab ${statusFilter === 'application' ? 'active' : ''}`}
            onClick={() => setStatusFilter('application')}
          >
            Application
          </button>
          <button
            className={`filter-tab ${statusFilter === 'awaiting approval' ? 'active' : ''}`}
            onClick={() => setStatusFilter('awaiting approval')}
          >
            Awaiting Approval
          </button>
          <button
            className={`filter-tab ${statusFilter === 'archived' ? 'active' : ''}`}
            onClick={() => setStatusFilter('archived')}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && currentUser.permissions.approveOwnerLeads && (
        <div className="bulk-actions">
          <span className="bulk-actions-text">
            {selectedLeads.size} selected
          </span>
          <div className="bulk-actions-buttons">
            <button 
              className="btn btn-sm btn-success"
              onClick={() => handleBulkAction('approve')}
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={() => handleBulkAction('deny')}
            >
              <XCircle size={16} />
              Deny
            </button>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={() => handleBulkAction('archive')}
            >
              <Archive size={16} />
              Archive
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th width="40">
                <input
                  type="checkbox"
                  checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                  onChange={toggleAllLeads}
                />
              </th>
              <th>Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Properties</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Last Reached Out</th>
              <th width="60"></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-table">
                  <div className="empty-state">
                    <AlertCircle size={48} style={{ opacity: 0.3 }} />
                    <p>No leads found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr 
                  key={lead.id}
                  className={selectedLeads.has(lead.id) ? 'selected' : ''}
                  onClick={() => onNavigateToLead(lead.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                    />
                  </td>
                  <td>
                    <div className="lead-name-cell">
                      <div className="lead-avatar-sm">
                        {lead.firstName[0]}{lead.lastName[0]}
                      </div>
                      <div>
                        <div className="lead-name">{lead.firstName} {lead.lastName}</div>
                        {lead.isDuplicate && (
                          <span className="duplicate-tag">Duplicate</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div>
                        {lead.email}
                        {lead.emailBounced && (
                          <span className="contact-validation-badge" title="Email bounced">
                            <AlertCircle size={10} />
                            Bounced
                          </span>
                        )}
                      </div>
                      <div className="contact-secondary">
                        {lead.phone}
                        {lead.phoneInvalid && (
                          <span className="contact-validation-badge" title="Cannot text this number">
                            <AlertCircle size={10} />
                            No SMS
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(lead)}
                  </td>
                  <td>
                    <span>{formatPropertyCount(lead.properties?.length || 0)}</span>
                  </td>
                  <td>
                    {lead.assignedTo ? (
                      <span>{lead.assignedTo}</span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>{formatDate(lead.updatedAt)}</td>
                  <td>
                    {lead.lastReachedOut ? (
                      <span>{formatDate(lead.lastReachedOut)}</span>
                    ) : (
                      <span className="text-muted">Never</span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ position: 'relative' }}>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === lead.id ? null : lead.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdown === lead.id && (
                        <>
                          <div 
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 999
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(null);
                            }}
                          />
                          <div className="dropdown-menu" style={{ 
                            position: 'absolute',
                            right: '0',
                            top: '100%',
                            marginTop: '4px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            minWidth: '160px',
                            zIndex: 1000,
                            overflow: 'hidden'
                          }}>
                            <button
                              className="dropdown-item"
                              onClick={(e) => handleArchiveLead(lead.id, e)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#6b7280',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              <Archive size={16} />
                              Archive Lead
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerLeadsList;

