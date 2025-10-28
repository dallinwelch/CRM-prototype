import React, { useState } from 'react';
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Home,
  MapPin,
  CheckCircle,
  XCircle,
  Send,
  Archive,
  Edit,
  Plus,
  Clock,
  MessageSquare,
  FileText,
  AlertCircle
} from 'lucide-react';
import { currentUser } from '../mockData';

const LeadDetail = ({ leadId, leads, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('not_moving_forward');
  const [note, setNote] = useState('');
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);

  const lead = leads.find(l => l.id === leadId);

  if (!lead) {
    return (
      <div className="lead-detail">
        <div className="empty-state">
          <AlertCircle size={48} />
          <p>Lead not found</p>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    console.log('Approve lead:', leadId);
    setShowApprovalModal(false);
    // In real app, would update lead status and send onboarding invite
  };

  const handleDeny = () => {
    console.log('Deny lead:', leadId, denyReason);
    setShowDenyModal(false);
    // In real app, would update lead status
  };

  const addNote = () => {
    if (note.trim()) {
      console.log('Add note:', note);
      setNote('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      partial: '#f59e0b',
      qualified: '#10b981',
      approved: '#8b5cf6',
      denied: '#ef4444',
      archived: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const TimelineEvent = ({ event }) => {
    const getIcon = () => {
      switch (event.type) {
        case 'lead_created': return <Plus size={16} />;
        case 'lead_approved': return <CheckCircle size={16} />;
        case 'lead_denied': return <XCircle size={16} />;
        case 'form_completed': return <FileText size={16} />;
        case 'onboarding_started': return <Clock size={16} />;
        case 'note_added': return <MessageSquare size={16} />;
        default: return <Clock size={16} />;
      }
    };

    return (
      <div className="timeline-event">
        <div className="timeline-icon">{getIcon()}</div>
        <div className="timeline-content">
          <div className="timeline-description">{event.description}</div>
          <div className="timeline-meta">
            <span>{event.user}</span>
            <span className="timeline-separator">•</span>
            <span>{formatDate(event.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lead-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        
        <div className="detail-header-info">
          <div className="detail-avatar-lg">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div>
            <h1 className="detail-title">
              {lead.firstName} {lead.lastName}
              {lead.isDuplicate && (
                <span className="duplicate-tag" title="Potential duplicate lead">Duplicate</span>
              )}
            </h1>
            <div className="detail-meta">
              <span 
                className="status-badge"
                style={{ 
                  backgroundColor: `${getStatusColor(lead.status)}20`,
                  color: getStatusColor(lead.status)
                }}
              >
                {lead.status === 'partial' ? 'Partial Lead' : 
                 lead.status === 'qualified' ? 'Qualified Lead' : 
                 lead.status === 'approved' ? 'Approved' : 
                 lead.status === 'denied' ? 'Denied' : 
                 lead.status === 'archived' ? 'Archived' : 
                 lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
              {lead.completionPercentage < 100 && (
                <>
                  <span className="detail-separator">•</span>
                  <span>{lead.completionPercentage}% complete</span>
                </>
              )}
              {lead.assignedTo && (
                <>
                  <span className="detail-separator">•</span>
                  <span>Assigned to {lead.assignedTo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="detail-actions">
          {currentUser.permissions.approveOwnerLeads && lead.status !== 'approved' && lead.status !== 'denied' && (
            <>
              <button 
                className="btn btn-success"
                onClick={() => setShowApprovalModal(true)}
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => setShowDenyModal(true)}
              >
                <XCircle size={18} />
                Deny
              </button>
            </>
          )}
          <button className="btn btn-secondary">
            <Edit size={18} />
            Edit
          </button>
          <button className="btn btn-secondary">
            <Archive size={18} />
            Archive
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button
          className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`detail-tab ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties ({lead.properties.length})
        </button>
        <button
          className={`detail-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
          {(lead.noteCount > 0 || lead.notes) && (
            <span className="tab-badge">{lead.noteCount || 1}</span>
          )}
        </button>
        {lead.onboardingStatus && (
          <button
            className={`detail-tab ${activeTab === 'onboarding' ? 'active' : ''}`}
            onClick={() => setActiveTab('onboarding')}
          >
            Onboarding ({lead.onboardingCompletion}%)
          </button>
        )}
      </div>

      {/* Content */}
      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="detail-grid">
            {lead.isDuplicate && lead.duplicateOf && (
              <div className="detail-section full-width" style={{ 
                background: 'var(--warning-light)', 
                border: '1px solid var(--warning)',
                borderLeft: '4px solid var(--warning)'
              }}>
                <h3 className="section-title" style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} />
                  Duplicate Lead Detected
                </h3>
                <p style={{ marginTop: '8px', lineHeight: '1.6' }}>
                  This lead may be a duplicate of another lead in the system. 
                  The email or phone number matches an existing non-archived lead.
                </p>
                <button 
                  className="btn btn-secondary" 
                  style={{ marginTop: '12px' }}
                  onClick={() => {
                    // Navigate to the original lead
                    console.log('View original lead:', lead.duplicateOf);
                  }}
                >
                  View Original Lead
                </button>
              </div>
            )}

            {lead.initialMessage && (
              <div className="detail-section full-width initial-message-section">
                <h3 className="section-title">
                  <MessageSquare size={18} />
                  Initial Inquiry Message
                </h3>
                <div className={`initial-message-content message-preview ${isMessageExpanded ? 'expanded' : lead.initialMessage.length > 200 ? 'truncated' : ''}`}>
                  {isMessageExpanded || lead.initialMessage.length <= 200 
                    ? lead.initialMessage 
                    : `${lead.initialMessage.substring(0, 200)}...`}
                </div>
                {lead.initialMessage.length > 200 && (
                  <button 
                    className="message-expand-btn"
                    onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                  >
                    {isMessageExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}

            <div className="detail-section">
              <h3 className="section-title">Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <Mail size={18} />
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">
                      {lead.email}
                      {lead.emailBounced && (
                        <span className="validation-warning" title="Email bounced - may not be deliverable">
                          <AlertCircle size={14} style={{ marginLeft: '6px', color: 'var(--danger)' }} />
                        </span>
                      )}
                    </div>
                    {lead.emailBounced && (
                      <div className="validation-message" style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>
                        ⚠️ Email bounced - try calling instead
                      </div>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={18} />
                  <div>
                    <div className="info-label">Phone</div>
                    <div className="info-value">
                      {lead.phone}
                      {lead.phoneInvalid && (
                        <span className="validation-warning" title="Invalid or non-textable number">
                          <AlertCircle size={14} style={{ marginLeft: '6px', color: 'var(--danger)' }} />
                        </span>
                      )}
                    </div>
                    {lead.phoneInvalid && (
                      <div className="validation-message" style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>
                        ⚠️ Cannot text this number - call only
                      </div>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={18} />
                  <div>
                    <div className="info-label">Created</div>
                    <div className="info-value">{formatDate(lead.createdAt)}</div>
                  </div>
                </div>
                <div className="info-item">
                  <User size={18} />
                  <div>
                    <div className="info-label">Source</div>
                    <div className="info-value">{lead.source}</div>
                  </div>
                </div>
              </div>
              {lead.sourceMetadata && (
                <div className="source-metadata">
                  <details>
                    <summary style={{ cursor: 'pointer', marginTop: '1rem', fontWeight: '500' }}>
                      View Source Details
                    </summary>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {lead.sourceMetadata.formName && (
                        <div><strong>Form:</strong> {lead.sourceMetadata.formName}</div>
                      )}
                      {lead.sourceMetadata.referrerUrl && (
                        <div><strong>Referrer:</strong> {lead.sourceMetadata.referrerUrl}</div>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h3 className="section-title">Properties</h3>
              {lead.properties.length > 0 ? (
                <div className="properties-grid">
                  {lead.properties.map(property => (
                    <div key={property.id} className="property-card">
                      <div className="property-icon">
                        <Home size={24} />
                      </div>
                      <div className="property-info">
                        <div className="property-address">{property.address}</div>
                        <div className="property-details">
                          {property.bedrooms} bed • {property.bathrooms} bath
                          {property.petsAllowed && ' • Pets OK'}
                        </div>
                        {property.minRentPrice && (
                          <div className="property-rent">${property.minRentPrice}/mo</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-sm">
                  <Home size={32} style={{ opacity: 0.3 }} />
                  <p>No properties added yet</p>
                </div>
              )}
            </div>

            {/* Show Partial Questionnaire Data */}
            {lead.status === 'partial' && lead.questionnaireAnswers && Object.keys(lead.questionnaireAnswers).length > 0 && (
              <div className="detail-section full-width">
                <h3 className="section-title">
                  <FileText size={18} />
                  Partial Application Data
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    ({Object.keys(lead.questionnaireAnswers).length} fields completed)
                  </span>
                </h3>
                <div className="partial-data-grid">
                  {Object.entries(lead.questionnaireAnswers).map(([key, value]) => {
                    // Format field names nicely
                    const fieldName = key
                      .replace(/^field-/, '')
                      .replace(/^property-\d+-field-/, '')
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <div key={key} className="partial-data-item">
                        <div className="partial-data-label">{fieldName}</div>
                        <div className="partial-data-value">{value || <em style={{ color: 'var(--text-muted)' }}>Not provided</em>}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--warning-light)', borderRadius: 'var(--border-radius)', fontSize: '14px' }}>
                  <strong style={{ color: 'var(--warning)' }}>💡 Pro Tip:</strong> Follow up to help them complete the rest of the form
                </div>
              </div>
            )}

            {lead.notes && (
              <div className="detail-section full-width">
                <h3 className="section-title">Notes</h3>
                <div className="notes-content">{lead.notes}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="properties-view">
            <div className="properties-header">
              <h3>Properties ({lead.properties.length})</h3>
              <button className="btn btn-primary">
                <Plus size={18} />
                Add Property
              </button>
            </div>
            {lead.properties.length > 0 ? (
              <div className="properties-list">
                {lead.properties.map(property => (
                  <div key={property.id} className="property-card-lg">
                    <div className="property-card-header">
                      <div className="property-icon-lg">
                        <Home size={32} />
                      </div>
                      <button className="btn-icon">
                        <Edit size={16} />
                      </button>
                    </div>
                    <div className="property-address-lg">{property.address}</div>
                    <div className="property-details-grid">
                      <div className="property-detail-item">
                        <span className="detail-label">Bedrooms</span>
                        <span className="detail-value">{property.bedrooms}</span>
                      </div>
                      <div className="property-detail-item">
                        <span className="detail-label">Bathrooms</span>
                        <span className="detail-value">{property.bathrooms}</span>
                      </div>
                      <div className="property-detail-item">
                        <span className="detail-label">Pets Allowed</span>
                        <span className="detail-value">{property.petsAllowed ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="property-detail-item">
                        <span className="detail-label">Min Rent</span>
                        <span className="detail-value">${property.minRentPrice}/mo</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Home size={64} style={{ opacity: 0.2 }} />
                <p>No properties added</p>
                <button className="btn btn-primary">
                  <Plus size={18} />
                  Add First Property
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-view">
            <div className="timeline-header">
              <h3>Activity Timeline</h3>
            </div>
            
            {/* Communication Context Summary */}
            <div className="communication-context" style={{ 
              padding: '16px', 
              background: 'var(--purple-light)', 
              borderRadius: 'var(--border-radius)',
              marginBottom: '16px',
              border: '1px solid var(--purple)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MessageSquare size={18} style={{ color: 'var(--purple)' }} />
                <strong style={{ color: 'var(--purple)' }}>Communication Summary</strong>
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div><strong>Total Contacts:</strong> {lead.timeline.filter(e => e.type === 'note_added').length} notes</div>
                <div><strong>Last Contact:</strong> {lead.timeline.length > 0 ? formatDate(lead.timeline[lead.timeline.length - 1].timestamp) : 'Never'}</div>
                <div><strong>Assigned To:</strong> {lead.assignedTo || 'Unassigned'}</div>
                <div style={{ marginTop: '8px', padding: '8px', background: 'var(--primary-light)', borderRadius: '4px', color: 'var(--primary)', fontSize: '13px' }}>
                  📞 <strong>Office Number:</strong> (555) 123-4567
                  <div style={{ marginTop: '4px', fontSize: '12px', opacity: 0.8 }}>
                    All communications will display this number to the owner
                  </div>
                </div>
                {lead.hasBeenContacted && (
                  <div style={{ marginTop: '8px', padding: '8px', background: 'var(--success-light)', borderRadius: '4px', color: 'var(--success)' }}>
                    ✓ Owner has been contacted
                  </div>
                )}
              </div>
            </div>

            <div className="timeline">
              {lead.timeline.map(event => (
                <TimelineEvent key={event.id} event={event} />
              ))}
            </div>

            {/* Add Note */}
            <div className="add-note-section">
              <h4>Add Note</h4>
              <textarea
                className="note-input"
                placeholder="Add a note to the timeline..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <button 
                className="btn btn-primary"
                onClick={addNote}
                disabled={!note.trim()}
              >
                <MessageSquare size={18} />
                Add Note
              </button>
            </div>
          </div>
        )}

        {activeTab === 'onboarding' && lead.onboardingStatus && (
          <div className="onboarding-view">
            <div className="onboarding-progress">
              <div className="progress-header">
                <h3>Onboarding Progress</h3>
                <span className="progress-percentage">{lead.onboardingCompletion}%</span>
              </div>
              <div className="progress-bar-lg">
                <div 
                  className="progress-fill"
                  style={{ width: `${lead.onboardingCompletion}%` }}
                />
              </div>
            </div>

            <div className="onboarding-sections">
              <div className="onboarding-section">
                <CheckCircle size={20} style={{ color: '#10b981' }} />
                <div>
                  <div className="section-name">Owner Information</div>
                  <div className="section-status">Completed</div>
                </div>
              </div>
              <div className="onboarding-section">
                <Clock size={20} style={{ color: '#f59e0b' }} />
                <div>
                  <div className="section-name">Property Information</div>
                  <div className="section-status">In Progress</div>
                </div>
              </div>
              <div className="onboarding-section">
                <Clock size={20} style={{ color: '#6b7280' }} />
                <div>
                  <div className="section-name">Documents & Signatures</div>
                  <div className="section-status">Pending</div>
                </div>
              </div>
            </div>

            {lead.onboardingCompletion === 100 ? (
              // Onboarding is 100% complete - show approval/revision actions
              currentUser.permissions.approveOwnerOnboarding && (
                <div className="onboarding-actions">
                  <button className="btn btn-success">
                    <CheckCircle size={18} />
                    Approve Onboarding
                  </button>
                  <button className="btn btn-warning">
                    <Send size={18} />
                    Send Back for Revisions
                  </button>
                  <button className="btn btn-danger">
                    <XCircle size={18} />
                    Deny Application
                  </button>
                </div>
              )
            ) : (
              // Onboarding not complete - show message to follow up
              <div style={{ 
                marginTop: '1.5rem',
                padding: '1rem', 
                background: 'var(--warning-light)', 
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--warning)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertCircle size={18} style={{ color: 'var(--warning)' }} />
                  <strong style={{ color: 'var(--warning)' }}>Onboarding Not Complete</strong>
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  The owner is currently at <strong>{lead.onboardingCompletion}% completion</strong>. 
                  Follow up to help them complete the remaining sections before final approval can be processed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Approve Lead</h2>
              <button className="btn-close" onClick={() => setShowApprovalModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>
                Approving this lead will send an onboarding invitation to <strong>{lead.firstName} {lead.lastName}</strong> via email and SMS.
              </p>
              <p>
                A follow-up task will be created for tomorrow.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleApprove}>
                <CheckCircle size={18} />
                Approve & Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Modal */}
      {showDenyModal && (
        <div className="modal-overlay" onClick={() => setShowDenyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deny Lead</h2>
              <button className="btn-close" onClick={() => setShowDenyModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Reason for denial</label>
                <select 
                  className="form-select"
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                >
                  <option value="not_moving_forward">Not moving forward</option>
                  <option value="requires_fixes">Requires fixes</option>
                  <option value="outside_service_area">Outside service area</option>
                  <option value="incomplete_info">Incomplete information</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {denyReason === 'not_moving_forward' && (
                <p className="help-text">
                  A courtesy decline email will be sent and the lead will be archived.
                </p>
              )}
              {denyReason === 'requires_fixes' && (
                <p className="help-text">
                  A fixes request email will be sent and follow-up tasks will resume tomorrow.
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDenyModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeny}>
                <XCircle size={18} />
                Deny Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;

