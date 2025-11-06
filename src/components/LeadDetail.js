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
  AlertCircle,
  MoreVertical,
  Trash2,
  Save
} from 'lucide-react';
import { currentUser, mockOnboardingForm } from '../mockData';

const LeadDetail = ({ leadId, leads, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('not_moving_forward');
  const [note, setNote] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionFormData, setSectionFormData] = useState({});
  const [modalPropertyCount, setModalPropertyCount] = useState(1);

  const lead = leads.find(l => l.id === leadId);
  
  // Determine if this is a lead or applicant
  const isApplicant = lead ? (lead.status === 'approved' || lead.onboardingStatus || lead.completionPercentage === 100) : false;
  
  // Default Lead Info: collapsed for applicants, expanded for leads
  const [isLeadInfoExpanded, setIsLeadInfoExpanded] = useState(!isApplicant);
  
  // Initialize editedData when lead is found
  React.useEffect(() => {
    if (lead && !editedData) {
      setEditedData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        properties: lead.properties.map(p => ({...p})),
        questionnaireAnswers: lead.questionnaireAnswers ? {...lead.questionnaireAnswers} : {}
      });
    }
  }, [lead, editedData]);

  // Close dropdown menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreMenu) {
        const dropdown = event.target.closest('.dropdown-menu');
        const trigger = event.target.closest('[data-dropdown-trigger]');
        if (!dropdown && !trigger) {
          setShowMoreMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

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

  const handleArchive = () => {
    console.log('Archive lead:', leadId);
    setShowMoreMenu(false);
    // In real app, would update lead status to archived
  };

  const handleSaveEdit = () => {
    console.log('Save edited data:', editedData);
    // In real app, would save the edited data
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original lead data
    setEditedData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      properties: lead.properties.map(p => ({...p})),
      questionnaireAnswers: lead.questionnaireAnswers ? {...lead.questionnaireAnswers} : {}
    });
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePropertyChange = (index, field, value) => {
    setEditedData(prev => {
      const newProperties = [...prev.properties];
      newProperties[index] = {
        ...newProperties[index],
        [field]: value
      };
      return {
        ...prev,
        properties: newProperties
      };
    });
  };

  const handleQuestionnaireChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      questionnaireAnswers: {
        ...prev.questionnaireAnswers,
        [field]: value
      }
    }));
  };

  const addProperty = () => {
    setEditedData(prev => ({
      ...prev,
      properties: [...prev.properties, {
        id: `prop-${Date.now()}`,
        address: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        minRentPrice: '',
        agreementLength: '1',
        homeType: 'house',
        furnished: 'unfurnished',
        repairLimit: '500',
        currentlyLiveInHome: 'no',
        petsAllowed: false
      }]
    }));
  };

  const removeProperty = (index) => {
    setEditedData(prev => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index)
    }));
  };

  const handleOpenSectionModal = (section) => {
    setSelectedSection(section);
    
    // Initialize form data with existing onboarding answers
    const initialData = {};
    
    if (section.repeatable) {
      // For repeatable sections (property info), load all property data
      const numProperties = lead.properties?.length || 1;
      setModalPropertyCount(numProperties);
      
      for (let i = 0; i < numProperties; i++) {
        section.fields.forEach(field => {
          const fieldKey = `property-${i}-${field.id}`;
          initialData[fieldKey] = lead.onboardingAnswers?.[fieldKey] || '';
        });
      }
    } else {
      // For non-repeatable sections, load field data
      section.fields.forEach(field => {
        initialData[field.id] = lead.onboardingAnswers?.[field.id] || '';
      });
    }
    
    setSectionFormData(initialData);
    setShowSectionModal(true);
  };

  const handleAddModalProperty = () => {
    setModalPropertyCount(prev => prev + 1);
  };

  const handleRemoveModalProperty = (index) => {
    if (modalPropertyCount <= 1) return; // Don't remove if it's the last one
    
    // Remove data for this property
    const newFormData = { ...sectionFormData };
    selectedSection.fields.forEach(field => {
      const fieldKey = `property-${index}-${field.id}`;
      delete newFormData[fieldKey];
    });
    
    // Shift down all properties after this one
    for (let i = index + 1; i < modalPropertyCount; i++) {
      selectedSection.fields.forEach(field => {
        const oldKey = `property-${i}-${field.id}`;
        const newKey = `property-${i - 1}-${field.id}`;
        if (newFormData[oldKey]) {
          newFormData[newKey] = newFormData[oldKey];
          delete newFormData[oldKey];
        }
      });
    }
    
    setSectionFormData(newFormData);
    setModalPropertyCount(prev => prev - 1);
  };

  const handleSectionFormChange = (fieldId, value) => {
    setSectionFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSaveSectionData = () => {
    // In a real app, this would save to the backend
    console.log('Saving section data:', sectionFormData);
    
    // Update the lead's onboardingAnswers with the new data
    lead.onboardingAnswers = {
      ...lead.onboardingAnswers,
      ...sectionFormData
    };
    
    // Close modal
    setShowSectionModal(false);
    setSelectedSection(null);
    setSectionFormData({});
  };

  const handleCloseSectionModal = () => {
    setShowSectionModal(false);
    setSelectedSection(null);
    setSectionFormData({});
    setModalPropertyCount(1);
  };

  const displayData = isEditing ? editedData : lead;

  // Helper function to check if a section is complete
  const isSectionComplete = (section) => {
    if (!lead.onboardingAnswers) return false;
    
    const requiredFields = section.fields.filter(f => f.required);
    if (requiredFields.length === 0) return true; // No required fields = automatically complete
    
    // For repeatable sections (property info), check if at least one property is complete
    if (section.repeatable) {
      const numProperties = lead.properties?.length || 0;
      if (numProperties === 0) return false;
      
      // Check if at least one property has all required fields filled
      for (let i = 0; i < numProperties; i++) {
        const allRequiredFilled = requiredFields.every(field => {
          const fieldKey = `property-${i}-${field.id}`;
          return lead.onboardingAnswers[fieldKey];
        });
        if (allRequiredFilled) return true;
      }
      return false;
    }
    
    // For non-repeatable sections, check if all required fields are filled
    return requiredFields.every(field => lead.onboardingAnswers[field.id]);
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
            </h1>
            <div className="detail-meta">
              {/* Lead/Applicant Type Badge */}
              <span 
                className="status-badge"
                style={{ 
                  backgroundColor: isApplicant ? '#8b5cf620' : '#3b82f620',
                  color: isApplicant ? '#8b5cf6' : '#3b82f6',
                  fontWeight: '600'
                }}
              >
                {isApplicant ? '📋 Applicant' : '🎯 Lead'}
              </span>
              <span className="detail-separator">•</span>
              {/* Status Badge */}
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
          {/* Actions moved to Lead Info section */}
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
            {/* LEAD INFO SECTION */}
            <div className="detail-section full-width" style={{ 
              border: '2px solid #e2e8f0', 
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {/* Lead Info Header */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#f8fafc',
                  borderBottom: isLeadInfoExpanded ? '1px solid #e2e8f0' : 'none'
                }}
              >
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                  onClick={() => setIsLeadInfoExpanded(!isLeadInfoExpanded)}
                >
                  <h3 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={20} />
                    Lead Info
                  </h3>
                  <span 
                    style={{
                      color: '#64748b',
                      fontSize: '16px',
                      transition: 'transform 0.2s'
                    }}
                  >
                    {isLeadInfoExpanded ? '▼' : '▶'}
                  </span>
                </div>

                {/* Actions Menu */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Save/Cancel buttons when editing */}
                  {isEditing ? (
                    <>
                      <button 
                        className="btn btn-success"
                        onClick={handleSaveEdit}
                        style={{ fontSize: '14px', padding: '6px 16px' }}
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        style={{ fontSize: '14px', padding: '6px 16px' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {/* 3-dot menu as clickable text */}
                      <span
                        data-dropdown-trigger
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMoreMenu(!showMoreMenu);
                        }}
                        style={{
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#64748b',
                          padding: '4px 8px',
                          lineHeight: 1,
                          userSelect: 'none',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#334155'}
                        onMouseLeave={(e) => e.target.style.color = '#64748b'}
                      >
                        •••
                      </span>
                      
                      {/* Dropdown Menu */}
                      {showMoreMenu && (
                        <div 
                          className="dropdown-menu" 
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            marginTop: '8px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            minWidth: '180px',
                            overflow: 'hidden'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Edit */}
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setIsEditing(true);
                              setShowMoreMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '14px',
                              color: '#334155',
                              fontWeight: '500'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                          >
                            <Edit size={16} />
                            Edit Lead Info
                          </button>

                          {/* Approve (only for qualifying leads) */}
                          {currentUser.permissions.approveOwnerLeads && lead.status !== 'approved' && lead.status !== 'denied' && (
                            <>
                              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowApprovalModal(true);
                                  setShowMoreMenu(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontSize: '14px',
                                  color: '#10b981',
                                  fontWeight: '500'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#ecfdf5'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <CheckCircle size={16} />
                                Approve & Send Application
                              </button>

                              {/* Deny */}
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowDenyModal(true);
                                  setShowMoreMenu(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  fontSize: '14px',
                                  color: '#ef4444',
                                  fontWeight: '500'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                <XCircle size={16} />
                                Deny Lead
                              </button>
                            </>
                          )}

                          {/* Archive */}
                          <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              handleArchive();
                              setShowMoreMenu(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: 'none',
                              background: 'none',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '14px',
                              color: '#64748b',
                              fontWeight: '500'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                          >
                            <Archive size={16} />
                            Archive Lead
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Lead Info Body */}
              {isLeadInfoExpanded && (
                <div style={{ padding: '20px' }}>
                  {/* Contact Information - Single Row */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Contact Information
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(5, 1fr)', 
                      gap: '16px',
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      {/* Name */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Name</div>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input
                              type="text"
                              value={editedData.firstName}
                              onChange={(e) => handleEditChange('firstName', e.target.value)}
                              className="form-input"
                              placeholder="First"
                              style={{ fontSize: '13px', padding: '6px 8px' }}
                            />
                            <input
                              type="text"
                              value={editedData.lastName}
                              onChange={(e) => handleEditChange('lastName', e.target.value)}
                              className="form-input"
                              placeholder="Last"
                              style={{ fontSize: '13px', padding: '6px 8px' }}
                            />
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{lead.firstName} {lead.lastName}</div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Email</div>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedData.email}
                            onChange={(e) => handleEditChange('email', e.target.value)}
                            className="form-input"
                            style={{ fontSize: '13px', padding: '6px 8px' }}
                          />
                        ) : (
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>
                            {lead.email}
                            {lead.emailBounced && (
                              <AlertCircle size={14} style={{ marginLeft: '4px', color: 'var(--danger)', verticalAlign: 'middle' }} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Phone</div>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedData.phone}
                            onChange={(e) => handleEditChange('phone', e.target.value)}
                            className="form-input"
                            style={{ fontSize: '13px', padding: '6px 8px' }}
                          />
                        ) : (
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>
                            {lead.phone}
                            {lead.phoneInvalid && (
                              <AlertCircle size={14} style={{ marginLeft: '4px', color: 'var(--danger)', verticalAlign: 'middle' }} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Created */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Created</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>{formatDate(lead.createdAt)}</div>
                      </div>

                      {/* Source */}
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Source</div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.source}
                            onChange={(e) => handleEditChange('source', e.target.value)}
                            className="form-input"
                            style={{ fontSize: '13px', padding: '6px 8px' }}
                          />
                        ) : (
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{lead.source}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Questionnaire Information */}
                  {lead.questionnaireAnswers && Object.keys(lead.questionnaireAnswers).some(key => 
                    ['field-num-properties', 'field-timeline', 'field-experience', 'field-current-situation', 'field-specific-needs', 'field-additional-info'].includes(key)
                  ) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
                        Lead Questionnaire
                      </h4>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '16px',
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '8px'
                      }}>
                        {/* Number of Properties */}
                        {lead.questionnaireAnswers['field-num-properties'] && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Properties to Manage</div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {lead.questionnaireAnswers['field-num-properties']}
                            </div>
                          </div>
                        )}

                        {/* Timeline */}
                        {lead.questionnaireAnswers['field-timeline'] && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Timeline</div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {lead.questionnaireAnswers['field-timeline']}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {lead.questionnaireAnswers['field-experience'] && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Prior PM Experience</div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {lead.questionnaireAnswers['field-experience']}
                            </div>
                          </div>
                        )}

                        {/* Current Situation */}
                        {lead.questionnaireAnswers['field-current-situation'] && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Current Situation</div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {lead.questionnaireAnswers['field-current-situation']}
                            </div>
                          </div>
                        )}

                        {/* Specific Needs */}
                        {lead.questionnaireAnswers['field-specific-needs'] && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Service Needs</div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {lead.questionnaireAnswers['field-specific-needs']}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional Info - Full Width if Present */}
                      {lead.questionnaireAnswers['field-additional-info'] && (
                        <div style={{ 
                          marginTop: '12px',
                          padding: '16px',
                          background: '#f0f9ff',
                          border: '1px solid #e0f2fe',
                          borderRadius: '8px'
                        }}>
                          <div style={{ fontSize: '12px', color: '#0369a1', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>
                            Additional Details
                          </div>
                          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#0c4a6e' }}>
                            {lead.questionnaireAnswers['field-additional-info']}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Property Information - 3 Rows */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Property Information ({displayData.properties.length} {displayData.properties.length === 1 ? 'Property' : 'Properties'})
                      {isEditing && (
                        <button 
                          onClick={addProperty}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '4px 12px', marginLeft: '12px' }}
                        >
                          <Plus size={14} />
                          Add
                        </button>
                      )}
                    </h4>
                    {displayData.properties.length > 0 ? (
                      displayData.properties.map((property, index) => (
                        <div key={property.id || index} style={{
                          marginBottom: '16px',
                          padding: '16px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Property {index + 1}</div>
                            {isEditing && displayData.properties.length > 1 && (
                              <button
                                onClick={() => removeProperty(index)}
                                style={{
                                  background: '#fef2f2',
                                  border: '1px solid #fee2e2',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: '#dc2626',
                                  fontSize: '12px'
                                }}
                              >
                                <Trash2 size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                Remove
                              </button>
                            )}
                          </div>

                          {/* Row 1: Address */}
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Address</div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={property.address}
                                onChange={(e) => handlePropertyChange(index, 'address', e.target.value)}
                                className="form-input"
                                placeholder="123 Main St, City, State, ZIP"
                                style={{ width: '100%', fontSize: '13px', padding: '6px 8px' }}
                              />
                            ) : (
                              <div style={{ fontSize: '14px', fontWeight: '600' }}>{property.address}</div>
                            )}
                          </div>

                          {/* Row 2: Bed, Bath, Sqft, Rent, Agreement */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Beds</div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={property.bedrooms}
                                  onChange={(e) => handlePropertyChange(index, 'bedrooms', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                />
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>{property.bedrooms}</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Baths</div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.5"
                                  value={property.bathrooms}
                                  onChange={(e) => handlePropertyChange(index, 'bathrooms', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                />
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>{property.bathrooms}</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Sq Ft</div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={property.sqft}
                                  onChange={(e) => handlePropertyChange(index, 'sqft', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                />
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>{property.sqft}</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Min Rent</div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={property.minRentPrice}
                                  onChange={(e) => handlePropertyChange(index, 'minRentPrice', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                />
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>${property.minRentPrice}/mo</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Agreement</div>
                              {isEditing ? (
                                <select
                                  value={property.agreementLength || '1'}
                                  onChange={(e) => handlePropertyChange(index, 'agreementLength', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                >
                                  <option value="1">1 yr</option>
                                  <option value="2">2 yrs</option>
                                  <option value="3">3 yrs</option>
                                  <option value="4">4 yrs</option>
                                  <option value="5">5 yrs</option>
                                </select>
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>{property.agreementLength || '1'} yr</div>
                              )}
                            </div>
                          </div>

                          {/* Row 3: Type, Furnished, Repair Limit, Occupied, Pets */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Type</div>
                              {isEditing ? (
                                <select
                                  value={property.homeType || 'house'}
                                  onChange={(e) => handlePropertyChange(index, 'homeType', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                >
                                  <option value="house">House</option>
                                  <option value="condo">Condo</option>
                                  <option value="townhouse">Townhouse</option>
                                  <option value="mobile-home">Mobile</option>
                                </select>
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>
                                  {(property.homeType || 'house').replace('-', ' ')}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Furnished</div>
                              {isEditing ? (
                                <select
                                  value={property.furnished || 'unfurnished'}
                                  onChange={(e) => handlePropertyChange(index, 'furnished', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                >
                                  <option value="unfurnished">No</option>
                                  <option value="furnished">Yes</option>
                                  <option value="partially-furnished">Partial</option>
                                </select>
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>
                                  {property.furnished === 'furnished' ? 'Yes' : 
                                   property.furnished === 'partially-furnished' ? 'Partial' : 'No'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Repair $</div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={property.repairLimit || '500'}
                                  onChange={(e) => handlePropertyChange(index, 'repairLimit', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                />
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>${property.repairLimit || '500'}</div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Occupied</div>
                              {isEditing ? (
                                <select
                                  value={property.currentlyLiveInHome || 'no'}
                                  onChange={(e) => handlePropertyChange(index, 'currentlyLiveInHome', e.target.value)}
                                  className="form-input"
                                  style={{ fontSize: '13px', padding: '4px 6px' }}
                                >
                                  <option value="no">No</option>
                                  <option value="yes">Yes</option>
                                </select>
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>
                                  {property.currentlyLiveInHome === 'yes' ? 'Yes' : 'No'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Pets</div>
                              {isEditing ? (
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={property.petsAllowed || false}
                                    onChange={(e) => handlePropertyChange(index, 'petsAllowed', e.target.checked)}
                                  />
                                  <span style={{ fontSize: '13px' }}>Allowed</span>
                                </label>
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>
                                  {property.petsAllowed ? '✓ Yes' : '✗ No'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ 
                        padding: '32px', 
                        textAlign: 'center', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        color: '#94a3b8'
                      }}>
                        <Home size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                        <div style={{ fontSize: '14px' }}>No properties added</div>
                        {isEditing && (
                          <button 
                            onClick={addProperty}
                            className="btn btn-primary"
                            style={{ marginTop: '12px', fontSize: '13px', padding: '6px 16px' }}
                          >
                            <Plus size={14} />
                            Add Property
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Notes
                    </h4>
                    <div style={{
                      padding: '12px 16px',
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      borderRadius: '8px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#92400e',
                      minHeight: '60px'
                    }}>
                      {lead.notes || 'No notes added yet.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* APPLICATION SECTION - Only show for applicants */}
            {isApplicant && (
              <div className="detail-section full-width" style={{ 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* Application Header */}
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <h3 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} />
                    Application
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    background: lead.onboardingStatus === 'in_progress' ? '#3b82f6' : '#10b981',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {lead.onboardingStatus === 'in_progress' ? `${lead.onboardingCompletion}% Complete` : 'Ready for Review'}
                  </span>
                </div>

                {/* Application Sections */}
                <div style={{ padding: '20px' }}>
                  {mockOnboardingForm.sections.map((section, index) => {
                    const isComplete = isSectionComplete(section);
                    
                    return (
                      <div 
                        key={section.id}
                        onClick={() => handleOpenSectionModal(section)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 20px',
                          marginBottom: '12px',
                          background: isComplete ? '#f0fdf4' : '#fafafa',
                          border: `1px solid ${isComplete ? '#bbf7d0' : '#e5e7eb'}`,
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* Checkmark Icon */}
                        <div style={{ 
                          marginRight: '16px',
                          opacity: isComplete ? 1 : 0.3
                        }}>
                          <CheckCircle 
                            size={24} 
                            style={{ 
                              color: isComplete ? '#10b981' : '#6b7280',
                              fill: isComplete ? '#dcfce7' : 'none',
                              strokeWidth: 2
                            }} 
                          />
                        </div>

                        {/* Section Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '15px', 
                            fontWeight: '600',
                            color: isComplete ? '#166534' : '#374151',
                            marginBottom: '2px'
                          }}>
                            {section.title}
                          </div>
                          <div style={{ 
                            fontSize: '13px', 
                            color: isComplete ? '#16a34a' : '#6b7280'
                          }}>
                            {isComplete ? 'All required fields completed' : 'Required fields pending'}
                          </div>
                        </div>

                        {/* Step Number */}
                        <div style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#94a3b8',
                          padding: '4px 10px',
                          background: 'white',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          Step {index + 1}
                        </div>
                      </div>
                    );
                  })}

                  {/* Overall Progress Note */}
                  {lead.onboardingStatus === 'in_progress' && lead.onboardingCompletion < 100 && (
                    <div style={{
                      marginTop: '20px',
                      padding: '14px 18px',
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#92400e' }}>
                        <strong>Application In Progress:</strong> The applicant is currently at {lead.onboardingCompletion}% completion. 
                        They will need to finish all required sections before you can approve.
                      </div>
                    </div>
                  )}

                  {/* Ready for Approval */}
                  {lead.onboardingCompletion === 100 && (
                    <div style={{
                      marginTop: '20px',
                      padding: '14px 18px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                      <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#166534' }}>
                        <strong>Application Complete:</strong> All required sections have been completed. 
                        This application is ready for your review and approval.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LEGACY - Old Property Questionnaire Section (keeping for reference, can be removed) */}
            <div className="detail-section full-width" style={{ display: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="section-title">
                  <Home size={18} />
                  Property Information ({displayData.properties.length} {displayData.properties.length === 1 ? 'Property' : 'Properties'})
                </h3>
                {isEditing && (
                  <button 
                    className="btn btn-primary"
                    onClick={addProperty}
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    <Plus size={16} />
                    Add Property
                  </button>
                )}
              </div>

              {displayData.properties.length > 0 ? (
                displayData.properties.map((property, index) => (
                  <div key={property.id || index} className="property-section" style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    marginBottom: '16px',
                    background: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                        Property {index + 1}
                      </h4>
                      {isEditing && displayData.properties.length > 1 && (
                        <button
                          onClick={() => removeProperty(index)}
                          className="btn-icon"
                          style={{ 
                            color: '#dc2626', 
                            padding: '6px', 
                            cursor: 'pointer',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            borderRadius: '6px'
                          }}
                          title="Remove property"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="form-grid" style={{ display: 'grid', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Property Address *</label>
                          <input
                            type="text"
                            value={property.address}
                            onChange={(e) => handlePropertyChange(index, 'address', e.target.value)}
                            className="form-input"
                            placeholder="123 Main St, City, State, ZIP"
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Bedrooms *</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={property.bedrooms}
                              onChange={(e) => handlePropertyChange(index, 'bedrooms', e.target.value)}
                              className="form-input"
                              placeholder="3"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Bathrooms *</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={property.bathrooms}
                              onChange={(e) => handlePropertyChange(index, 'bathrooms', e.target.value)}
                              className="form-input"
                              placeholder="2"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Square Feet *</label>
                            <input
                              type="number"
                              min="0"
                              value={property.sqft}
                              onChange={(e) => handlePropertyChange(index, 'sqft', e.target.value)}
                              className="form-input"
                              placeholder="1500"
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Minimum Rent ($/month) *</label>
                            <input
                              type="number"
                              min="0"
                              value={property.minRentPrice}
                              onChange={(e) => handlePropertyChange(index, 'minRentPrice', e.target.value)}
                              className="form-input"
                              placeholder="1500"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Agreement Length *</label>
                            <select
                              value={property.agreementLength || '1'}
                              onChange={(e) => handlePropertyChange(index, 'agreementLength', e.target.value)}
                              className="form-input"
                            >
                              <option value="1">1 year</option>
                              <option value="2">2 years</option>
                              <option value="3">3 years</option>
                              <option value="4">4 years</option>
                              <option value="5">5 years</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Type of Home *</label>
                            <select
                              value={property.homeType || 'house'}
                              onChange={(e) => handlePropertyChange(index, 'homeType', e.target.value)}
                              className="form-input"
                            >
                              <option value="house">House</option>
                              <option value="condo">Condo</option>
                              <option value="townhouse">Townhouse</option>
                              <option value="mobile-home">Mobile Home</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Furnished *</label>
                            <select
                              value={property.furnished || 'unfurnished'}
                              onChange={(e) => handlePropertyChange(index, 'furnished', e.target.value)}
                              className="form-input"
                            >
                              <option value="unfurnished">Unfurnished</option>
                              <option value="furnished">Furnished</option>
                              <option value="partially-furnished">Partially Furnished</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Repair Authorization Limit ($) *</label>
                            <input
                              type="number"
                              min="0"
                              value={property.repairLimit || '500'}
                              onChange={(e) => handlePropertyChange(index, 'repairLimit', e.target.value)}
                              className="form-input"
                              placeholder="500"
                            />
                            <small style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                              Amount below which repairs can be made without your authorization
                            </small>
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Currently Occupied? *</label>
                            <select
                              value={property.currentlyLiveInHome || 'no'}
                              onChange={(e) => handlePropertyChange(index, 'currentlyLiveInHome', e.target.value)}
                              className="form-input"
                            >
                              <option value="no">No</option>
                              <option value="yes">Yes</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={property.petsAllowed || false}
                              onChange={(e) => handlePropertyChange(index, 'petsAllowed', e.target.checked)}
                            />
                            <span style={{ fontWeight: '500' }}>Pets Allowed</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="property-details-view" style={{ display: 'grid', gap: '12px' }}>
                        <div>
                          <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Address</div>
                          <div className="info-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.address}</div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Bedrooms</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>{property.bedrooms}</div>
                          </div>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Bathrooms</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>{property.bathrooms}</div>
                          </div>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Square Feet</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>{property.sqft}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Min Rent</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>${property.minRentPrice}/month</div>
                          </div>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Agreement Length</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>{property.agreementLength || '1'} {property.agreementLength === '1' ? 'year' : 'years'}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Home Type</div>
                            <div className="info-value" style={{ fontSize: '14px', textTransform: 'capitalize' }}>{(property.homeType || 'house').replace('-', ' ')}</div>
                          </div>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Furnished</div>
                            <div className="info-value" style={{ fontSize: '14px', textTransform: 'capitalize' }}>{(property.furnished || 'unfurnished').replace('-', ' ')}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Repair Limit</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>${property.repairLimit || '500'}</div>
                          </div>
                          <div>
                            <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Currently Occupied</div>
                            <div className="info-value" style={{ fontSize: '14px' }}>{property.currentlyLiveInHome === 'yes' ? 'Yes' : 'No'}</div>
                          </div>
                        </div>

                        <div>
                          <div className="info-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pets Allowed</div>
                          <div className="info-value" style={{ fontSize: '14px' }}>{property.petsAllowed ? '✓ Yes' : '✗ No'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state-sm" style={{ textAlign: 'center', padding: '40px' }}>
                  <Home size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, color: '#64748b' }}>No properties added yet</p>
                  {isEditing && (
                    <button 
                      className="btn btn-primary"
                      onClick={addProperty}
                      style={{ marginTop: '12px' }}
                    >
                      <Plus size={16} />
                      Add Property
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'properties' && (
          <div className="properties-view">
            <div className="properties-header">
              <h3>Properties ({displayData.properties.length})</h3>
              {isEditing && (
                <button className="btn btn-primary" onClick={addProperty}>
                  <Plus size={18} />
                  Add Property
                </button>
              )}
            </div>
            {displayData.properties.length > 0 ? (
              <div className="properties-list">
                {displayData.properties.map((property, index) => (
                  <div key={property.id || index} className="property-card-lg" style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '16px',
                    background: 'white'
                  }}>
                    <div className="property-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="property-icon-lg" style={{ 
                          width: '48px', 
                          height: '48px', 
                          background: 'var(--primary-light)', 
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)'
                        }}>
                          <Home size={24} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Property {index + 1}</h4>
                        </div>
                      </div>
                      {isEditing && displayData.properties.length > 1 && (
                        <button 
                          className="btn-icon"
                          onClick={() => removeProperty(index)}
                          style={{
                            color: '#dc2626',
                            padding: '8px',
                            cursor: 'pointer',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            borderRadius: '6px'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="form-grid" style={{ display: 'grid', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '500', marginBottom: '6px', display: 'block' }}>Property Address *</label>
                          <input
                            type="text"
                            value={property.address}
                            onChange={(e) => handlePropertyChange(index, 'address', e.target.value)}
                            className="form-input"
                            placeholder="123 Main St, City, State, ZIP"
                            style={{ width: '100%' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label">Bedrooms *</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={property.bedrooms}
                              onChange={(e) => handlePropertyChange(index, 'bedrooms', e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Bathrooms *</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={property.bathrooms}
                              onChange={(e) => handlePropertyChange(index, 'bathrooms', e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Square Feet *</label>
                            <input
                              type="number"
                              min="0"
                              value={property.sqft}
                              onChange={(e) => handlePropertyChange(index, 'sqft', e.target.value)}
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label">Minimum Rent ($/month) *</label>
                            <input
                              type="number"
                              min="0"
                              value={property.minRentPrice}
                              onChange={(e) => handlePropertyChange(index, 'minRentPrice', e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Agreement Length *</label>
                            <select
                              value={property.agreementLength || '1'}
                              onChange={(e) => handlePropertyChange(index, 'agreementLength', e.target.value)}
                              className="form-input"
                            >
                              <option value="1">1 year</option>
                              <option value="2">2 years</option>
                              <option value="3">3 years</option>
                              <option value="4">4 years</option>
                              <option value="5">5 years</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label">Type of Home *</label>
                            <select
                              value={property.homeType || 'house'}
                              onChange={(e) => handlePropertyChange(index, 'homeType', e.target.value)}
                              className="form-input"
                            >
                              <option value="house">House</option>
                              <option value="condo">Condo</option>
                              <option value="townhouse">Townhouse</option>
                              <option value="mobile-home">Mobile Home</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Furnished *</label>
                            <select
                              value={property.furnished || 'unfurnished'}
                              onChange={(e) => handlePropertyChange(index, 'furnished', e.target.value)}
                              className="form-input"
                            >
                              <option value="unfurnished">Unfurnished</option>
                              <option value="furnished">Furnished</option>
                              <option value="partially-furnished">Partially Furnished</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label">Repair Authorization Limit ($) *</label>
                            <input
                              type="number"
                              min="0"
                              value={property.repairLimit || '500'}
                              onChange={(e) => handlePropertyChange(index, 'repairLimit', e.target.value)}
                              className="form-input"
                            />
                            <small style={{ fontSize: '12px', color: '#64748b' }}>
                              Amount below which repairs can be made without your authorization
                            </small>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Currently Occupied? *</label>
                            <select
                              value={property.currentlyLiveInHome || 'no'}
                              onChange={(e) => handlePropertyChange(index, 'currentlyLiveInHome', e.target.value)}
                              className="form-input"
                            >
                              <option value="no">No</option>
                              <option value="yes">Yes</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={property.petsAllowed || false}
                              onChange={(e) => handlePropertyChange(index, 'petsAllowed', e.target.checked)}
                            />
                            <span style={{ fontWeight: '500' }}>Pets Allowed</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="property-address-lg" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>
                          {property.address}
                        </div>
                        <div className="property-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Bedrooms</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.bedrooms}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Bathrooms</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.bathrooms}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Square Feet</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.sqft}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Min Rent</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>${property.minRentPrice}/month</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Agreement Length</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.agreementLength || '1'} {property.agreementLength === '1' ? 'year' : 'years'}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Home Type</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{(property.homeType || 'house').replace('-', ' ')}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Furnished</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>{(property.furnished || 'unfurnished').replace('-', ' ')}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Repair Limit</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>${property.repairLimit || '500'}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Currently Occupied</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.currentlyLiveInHome === 'yes' ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="property-detail-item">
                            <span className="detail-label" style={{ fontSize: '12px', color: '#64748b' }}>Pets Allowed</span>
                            <span className="detail-value" style={{ fontSize: '14px', fontWeight: '500' }}>{property.petsAllowed ? '✓ Yes' : '✗ No'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center', padding: '60px' }}>
                <Home size={64} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                <p style={{ margin: '0 0 16px', color: '#64748b' }}>No properties added</p>
                {isEditing && (
                  <button className="btn btn-primary" onClick={addProperty}>
                    <Plus size={18} />
                    Add First Property
                  </button>
                )}
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

      {/* Section Edit Modal */}
      {showSectionModal && selectedSection && (
        <div className="modal-overlay" onClick={handleCloseSectionModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '85vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h2>{selectedSection.title}</h2>
              <button className="btn-close" onClick={handleCloseSectionModal}>
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="modal-content" style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {selectedSection.repeatable ? (
                // Repeatable section (e.g., Property Information)
                <>
                  {Array.from({ length: modalPropertyCount }).map((_, propIndex) => (
                    <div key={`property-${propIndex}`} style={{ 
                      marginBottom: '30px',
                      padding: '20px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '16px', 
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          Property {propIndex + 1}
                        </h3>
                        {modalPropertyCount > 1 && (
                          <button
                            onClick={() => handleRemoveModalProperty(propIndex)}
                            className="btn btn-sm"
                            style={{
                              padding: '4px 12px',
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        )}
                      </div>
                      
                      {selectedSection.fields.map(field => {
                        const fieldKey = `property-${propIndex}-${field.id}`;
                        const value = sectionFormData[fieldKey] || '';
                        
                        return (
                          <div key={field.id} className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label">
                              {field.label}
                              {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                            </label>
                            
                            {field.type === 'select' ? (
                              <select
                                className="form-select"
                                value={value}
                                onChange={(e) => handleSectionFormChange(fieldKey, e.target.value)}
                              >
                                <option value="">Select...</option>
                                {field.options.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            ) : field.type === 'textarea' ? (
                              <textarea
                                className="form-input"
                                value={value}
                                onChange={(e) => handleSectionFormChange(fieldKey, e.target.value)}
                                placeholder={field.helpText}
                                rows={3}
                              />
                            ) : field.type === 'checkbox' ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={value === 'true' || value === true}
                                  onChange={(e) => handleSectionFormChange(fieldKey, e.target.checked.toString())}
                                  style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '14px', color: '#64748b' }}>{field.helpText}</span>
                              </div>
                            ) : (
                              <input
                                type={field.type}
                                className="form-input"
                                value={value}
                                onChange={(e) => handleSectionFormChange(fieldKey, e.target.value)}
                                placeholder={field.helpText}
                              />
                            )}
                            
                            {field.helpText && !['checkbox', 'text', 'number', 'email', 'phone', 'date'].includes(field.type) && (
                              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                                {field.helpText}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Add Property Button */}
                  <button
                    onClick={handleAddModalProperty}
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#f0f9ff',
                      color: '#0284c7',
                      border: '2px dashed #0284c7',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginBottom: '20px'
                    }}
                  >
                    <Plus size={18} />
                    Add Another Property
                  </button>
                </>
              ) : (
                // Non-repeatable section
                selectedSection.fields.map(field => {
                  const value = sectionFormData[field.id] || '';
                  
                  return (
                    <div key={field.id} className="form-group" style={{ marginBottom: '20px' }}>
                      <label className="form-label">
                        {field.label}
                        {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select
                          className="form-select"
                          value={value}
                          onChange={(e) => handleSectionFormChange(field.id, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          className="form-input"
                          value={value}
                          onChange={(e) => handleSectionFormChange(field.id, e.target.value)}
                          placeholder={field.helpText}
                          rows={3}
                        />
                      ) : field.type === 'checkbox' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={value === 'true' || value === true}
                            onChange={(e) => handleSectionFormChange(field.id, e.target.checked.toString())}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span style={{ fontSize: '14px', color: '#64748b' }}>{field.helpText}</span>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          className="form-input"
                          value={value}
                          onChange={(e) => handleSectionFormChange(field.id, e.target.value)}
                          placeholder={field.helpText}
                        />
                      )}
                      
                      {field.helpText && !['checkbox', 'text', 'number', 'email', 'phone', 'date'].includes(field.type) && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                          {field.helpText}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCloseSectionModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveSectionData}>
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Approve Lead & Send Application</h2>
              <button className="btn-close" onClick={() => setShowApprovalModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>
                Approving this lead will send an <strong>application invitation email</strong> to <strong>{lead.firstName} {lead.lastName}</strong> at <strong>{lead.email}</strong>.
              </p>
              <p>
                The email will contain a link to complete the full property management application. Once they complete and submit the application, you'll be able to review it for final approval.
              </p>
              <p style={{ marginTop: '16px', padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                <strong style={{ color: '#059669' }}>✓ What happens next:</strong><br/>
                <span style={{ fontSize: '14px', color: '#047857' }}>
                  • Email sent immediately<br/>
                  • Lead status updates to "Approved"<br/>
                  • Follow-up task created for 2 days from now
                </span>
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleApprove}>
                <CheckCircle size={18} />
                Send Application Email
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

