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
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { currentUser, mockLeadQuestionnaireForm, mockOnboardingForm } from '../mockData';

const OwnerLeadsList = ({ leads, filterStatus, onNavigateToLead, onCreateLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState(filterStatus || 'all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Calculate section completion for a lead in onboarding
  const calculateSectionCompletion = (lead) => {
    // Only calculate for leads with application status or those in onboarding
    const isApplication = lead.status === 'application' || lead.status === 'qualified';
    const isInOnboarding = lead.onboardingStatus === 'in_progress';
    
    if (!isApplication && !isInOnboarding) {
      return null;
    }

    const sections = mockOnboardingForm.sections;
    let completedSections = 0;

    // If they haven't started onboarding yet, return 0/4
    if (!lead.onboardingAnswers) {
      return { completed: 0, total: sections.length };
    }

    // Calculate actual completion from onboarding answers
    sections.forEach(section => {
      const sectionFields = section.fields;
      
      if (section.repeatable) {
        // For repeatable property sections, check if at least one property has required fields filled
        const propertyCount = lead.properties?.length || 0;
        if (propertyCount > 0) {
          // Check if first property has required onboarding fields filled
          const requiredFields = sectionFields.filter(f => f.required);
          const allRequiredFilled = requiredFields.every(field => {
            // For repeatable sections, check property-0-field-* pattern
            const fieldId = `property-0-${field.id}`;
            return lead.onboardingAnswers[fieldId] !== undefined && lead.onboardingAnswers[fieldId] !== '';
          });
          if (allRequiredFilled) completedSections++;
        }
      } else {
        // For non-repeatable sections, check if all required fields are filled
        const requiredFields = sectionFields.filter(f => f.required);
        
        if (requiredFields.length === 0) {
          // If no required fields, check if any field is filled
          const anyFilled = sectionFields.some(field => {
            const fieldId = field.id;
            return lead.onboardingAnswers[fieldId] !== undefined && lead.onboardingAnswers[fieldId] !== '';
          });
          if (anyFilled) completedSections++;
        } else {
          // Check if all required fields are filled
          const allRequiredFilled = requiredFields.every(field => {
            const fieldId = field.id;
            return lead.onboardingAnswers[fieldId] !== undefined && 
                   lead.onboardingAnswers[fieldId] !== '' &&
                   lead.onboardingAnswers[fieldId] !== null;
          });
          if (allRequiredFilled) completedSections++;
        }
      }
    });

    return { completed: completedSections, total: sections.length };
  };

  // Handle column sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to descending
      setSortBy(column);
      setSortOrder('desc');
    }
  };

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
      let aVal, bVal;

      // Handle different column types
      switch(sortBy) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'contact':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'properties':
          aVal = a.properties?.length || 0;
          bVal = b.properties?.length || 0;
          break;
        case 'assignedTo':
          aVal = a.assignedTo || '';
          bVal = b.assignedTo || '';
          break;
        case 'createdAt':
        case 'updatedAt':
        case 'lastReachedOut':
          // Handle dates, treating null/undefined as very old dates for sorting
          aVal = a[sortBy] ? new Date(a[sortBy]) : new Date(0);
          bVal = b[sortBy] ? new Date(b[sortBy]) : new Date(0);
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }

      // Compare values
      if (aVal === bVal) return 0;
      
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
    const completion = calculateSectionCompletion(lead);
    
    // Determine actual display status based on simplified logic
    let displayLabel = 'Lead';
    let displayColor = '#f59e0b';
    let displayIcon = AlertCircle;
    let showCompletion = false;
    
    // Special handling for archived
    if (lead.status === 'archived') {
      displayLabel = 'Archived';
      displayColor = '#6b7280';
      displayIcon = Archive;
    }
    // If status is 'awaiting approval'
    else if (lead.status === 'awaiting approval') {
      displayLabel = 'Awaiting Approval';
      displayColor = '#8b5cf6';
      displayIcon = UserCheck;
      showCompletion = false;
    }
    // If status is 'application' or 'qualified' (these show as "Application")
    else if (lead.status === 'application' || lead.status === 'qualified') {
      // Check if they've completed all sections (4/4)
      if (completion && completion.completed === completion.total) {
        displayLabel = 'Awaiting Approval';
        displayColor = '#8b5cf6';
        displayIcon = UserCheck;
        showCompletion = false; // Don't show (4/4) for awaiting approval
      } else {
        // Still working on application (could be 0/4, 1/4, 2/4, 3/4)
        displayLabel = 'Application';
        displayColor = '#3b82f6';
        displayIcon = Clock;
        showCompletion = true; // Show (X/4)
      }
    }
    // Everything else is a Lead (lead, partial, etc.)
    else {
      displayLabel = 'Lead';
      displayColor = '#f59e0b';
      displayIcon = AlertCircle;
    }

    const Icon = displayIcon;

    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: `${displayColor}20`,
          color: displayColor,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Icon size={14} />
        <span>{displayLabel}</span>
        {/* Only show completion for Application status (X/4) */}
        {showCompletion && completion && completion.total > 0 && (
          <span 
            style={{ 
              fontSize: '11px',
              fontWeight: '600',
              opacity: 0.8,
              marginLeft: '2px',
              whiteSpace: 'nowrap'
            }}
          >
            ({completion.completed}/{completion.total})
          </span>
        )}
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

  // Sortable header component
  const SortableHeader = ({ column, children, width }) => {
    const isActive = sortBy === column;
    const SortIcon = isActive 
      ? (sortOrder === 'asc' ? ArrowUp : ArrowDown)
      : ArrowUpDown;
    
    return (
      <th 
        width={width}
        onClick={() => handleSort(column)}
        style={{ 
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          justifyContent: 'space-between'
        }}>
          <span>{children}</span>
          <SortIcon 
            size={14} 
            style={{ 
              opacity: isActive ? 1 : 0.3,
              flexShrink: 0
            }} 
          />
        </div>
      </th>
    );
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
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="contact">Contact</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="properties">Properties</SortableHeader>
              <SortableHeader column="assignedTo">Assigned To</SortableHeader>
              <SortableHeader column="createdAt">Created</SortableHeader>
              <SortableHeader column="updatedAt">Updated</SortableHeader>
              <SortableHeader column="lastReachedOut">Last Reached Out</SortableHeader>
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

