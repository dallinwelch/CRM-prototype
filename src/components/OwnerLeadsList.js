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
  AlertCircle,
  MessageSquare,
  PhoneCall
} from 'lucide-react';
import { currentUser } from '../mockData';

const OwnerLeadsList = ({ leads, filterStatus, onNavigateToLead, onCreateLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState(filterStatus || 'all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and sort leads
  const getFilteredLeads = () => {
    let filtered = leads;

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        // Active excludes archived AND completed (owners who finished onboarding)
        filtered = filtered.filter(l => l.status !== 'archived' && l.status !== 'completed');
      } else if (statusFilter === 'onboarding') {
        // Show approved leads that are in onboarding
        filtered = filtered.filter(l => l.status === 'approved' && l.onboardingStatus === 'in_progress');
      } else {
        filtered = filtered.filter(l => l.status === statusFilter);
      }
    } else {
      // Don't show archived or completed in "all" view - they've been converted to owners
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

  const toggleContactStatus = (leadId, e) => {
    e.stopPropagation();
    console.log('Toggle contact status for lead:', leadId);
    // In real app, would update lead.hasBeenContacted
  };

  const getStatusBadge = (lead) => {
    const configs = {
      partial: { color: '#f59e0b', label: 'Partial Lead', icon: AlertCircle },
      qualified: { color: '#10b981', label: 'Qualified Lead', icon: CheckCircle },
      approved: { color: '#8b5cf6', label: 'Approved', icon: UserCheck },
      onboarding: { color: '#6366f1', label: 'In Onboarding', icon: Clock },
      denied: { color: '#ef4444', label: 'Denied', icon: XCircle },
      archived: { color: '#6b7280', label: 'Archived', icon: Archive }
    };

    // Show "Onboarding" for approved leads that are in onboarding
    let statusKey = lead.status;
    if (lead.status === 'approved' && lead.onboardingStatus === 'in_progress') {
      statusKey = 'onboarding';
    }

    const config = configs[statusKey] || configs.partial;
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
            className={`filter-tab ${statusFilter === 'partial' ? 'active' : ''}`}
            onClick={() => setStatusFilter('partial')}
          >
            Partial
          </button>
          <button
            className={`filter-tab ${statusFilter === 'qualified' ? 'active' : ''}`}
            onClick={() => setStatusFilter('qualified')}
          >
            Qualified
          </button>
          <button
            className={`filter-tab ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-tab ${statusFilter === 'onboarding' ? 'active' : ''}`}
            onClick={() => setStatusFilter('onboarding')}
          >
            Onboarding
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
              <th width="40" title="Contacted">
                <PhoneCall size={16} />
              </th>
              <th>Name</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Properties</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Updated</th>
              <th width="40" title="Notes">
                <MessageSquare size={16} />
              </th>
              <th width="60"></th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="11" className="empty-table">
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
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={lead.hasBeenContacted || false}
                      onChange={(e) => toggleContactStatus(lead.id, e)}
                      title={lead.hasBeenContacted ? 'Contacted' : 'Not contacted'}
                      style={{ cursor: 'pointer' }}
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
                    {lead.properties.length > 0 ? (
                      <span>{lead.properties.length} {lead.properties.length === 1 ? 'property' : 'properties'}</span>
                    ) : (
                      <span className="text-muted">None</span>
                    )}
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
                    {(lead.noteCount > 0 || lead.notes) && (
                      <div className="note-indicator-cell">
                        <span className="note-badge-sm">{lead.noteCount || 1}</span>
                      </div>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn-icon">
                      <MoreVertical size={16} />
                    </button>
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

