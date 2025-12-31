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
  Save,
  Building
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
  const [showSubmitForApprovalModal, setShowSubmitForApprovalModal] = useState(false);
  const [showApproveApplicationModal, setShowApproveApplicationModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [showDenyApplicationModal, setShowDenyApplicationModal] = useState(false);
  const [changeRequestMessage, setChangeRequestMessage] = useState('');
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const lead = leads.find(l => l.id === leadId);
  
  // Determine if this is a lead or applicant
  // Show as applicant UNLESS status is 'lead'
  const isApplicant = lead ? (lead.status !== 'lead') : false;
  
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
    
    // Check if we're editing a specific property
    const editingPropertyIndex = sectionFormData._editingPropertyIndex;
    
    if (editingPropertyIndex !== undefined) {
      // We're editing a specific property, so map property-0-* fields back to property-X-* fields
      const updatedData = {};
      Object.keys(sectionFormData).forEach(key => {
        if (key.startsWith('property-0-')) {
          const fieldId = key.replace('property-0-', '');
          const newKey = `property-${editingPropertyIndex}-${fieldId}`;
          updatedData[newKey] = sectionFormData[key];
        } else if (key !== '_editingPropertyIndex') {
          updatedData[key] = sectionFormData[key];
        }
      });
      
      // Update the lead's onboardingAnswers with the mapped data
      lead.onboardingAnswers = {
        ...lead.onboardingAnswers,
        ...updatedData
      };
    } else {
      // Normal save for non-property sections or multiple properties
      const cleanedData = {...sectionFormData};
      delete cleanedData._editingPropertyIndex;
      
      lead.onboardingAnswers = {
        ...lead.onboardingAnswers,
        ...cleanedData
      };
    }
    
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

  const handleSubmitForApproval = () => {
    // Update lead status to "pending_review"
    console.log('Submitting application for approval:', lead.id);
    // In real app, this would call API and send notification
    setShowSubmitForApprovalModal(false);
    // Update the lead object (in real app this would be from backend)
    lead.applicationStatus = 'pending_review';
  };

  const handleApproveApplication = () => {
    console.log('Approving application:', lead.id);
    // Update status to approved and send email
    setShowApproveApplicationModal(false);
    lead.applicationStatus = 'approved';
    lead.status = 'onboarding';
  };

  const handleRequestChanges = () => {
    console.log('Requesting changes:', changeRequestMessage);
    // Send email and change status back to applicant (approved) status
    setShowRequestChangesModal(false);
    lead.status = 'approved'; // Back to applicant status
    lead.applicationStatus = 'changes_requested';
    setChangeRequestMessage('');
  };

  const handleDenyApplication = () => {
    console.log('Denying application:', lead.id);
    setShowDenyApplicationModal(false);
    lead.status = 'denied';
    lead.applicationStatus = 'denied';
  };

  const handleAddToPortfolio = () => {
    console.log('Adding to portfolio:', lead.id);
    // Trigger confetti
    setShowConfetti(true);
    // Show celebration modal
    setShowCelebrationModal(true);
    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
    // Update lead status
    lead.status = 'completed';
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

  // Helper function to check if all application sections (1-3) are complete
  const isApplicationComplete = () => {
    return mockOnboardingForm.applicationSections.every(section => isSectionComplete(section));
  };

  // Helper function to check if all onboarding sections (documents) are complete
  const isOnboardingComplete = () => {
    return mockOnboardingForm.onboardingSections.every(section => isSectionComplete(section));
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
    <div className="lead-detail" style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 80px - 2 * var(--spacing-lg))',
      overflow: 'hidden',
      margin: 'calc(-1 * var(--spacing-lg))',
      padding: 0
    }}>
      {/* Header */}
      <div 
        className="detail-header" 
        style={{
          flexShrink: 0,
          zIndex: 100,
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          paddingLeft: 'var(--spacing-lg)',
          paddingRight: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          paddingBottom: 'var(--spacing-lg)'
        }}
      >
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
              
              {/* <span className="detail-separator">•</span> */}
              {/* Status Badge */}
              <span 
                className="status-badge"
                style={{ 
                  backgroundColor: `${getStatusColor(lead.status)}20`,
                  color: getStatusColor(lead.status)
                }}
              >
                {lead.status === 'lead' ? 'Lead' : 
                 lead.status === 'application' ? 'Application' : 
                 lead.status === 'sign docs' ? 'Sign Documents' :
                 lead.status === 'under review' ? 'Under Review' :
                 lead.status === 'onboarding' ? 'Onboarding' :
                 lead.status === 'completed' ? 'Completed' :
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

        <div className="detail-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* QUICK ACTION BUTTONS - Conditional based on stage */}

          {/* UNDER REVIEW STAGE - Approve, Request Changes, & Deny */}
          {lead.status === 'under review' && currentUser.permissions.approveOwnerLeads && (
            <>
              <button 
                className="btn btn-success"
                onClick={() => setShowApproveApplicationModal(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => setShowRequestChangesModal(true)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <Edit size={18} />
                Request Changes
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => setShowDenyApplicationModal(true)}
                    style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600'
                    }}
                  >
                <XCircle size={18} />
                Deny
              </button>
            </>
          )}

          {/* ONBOARDING STAGE - Add to Portfolio (disabled until documents are complete) */}
          {lead.status === 'onboarding' && lead.applicationStatus === 'approved' && (
                      <button 
                        className="btn btn-success"
              onClick={() => isOnboardingComplete() && handleAddToPortfolio()}
              disabled={!isOnboardingComplete()}
              style={{
                background: isOnboardingComplete() 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: 'white',
                fontWeight: '600',
                padding: '12px 24px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isOnboardingComplete() 
                  ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                  : '0 4px 12px rgba(107, 114, 128, 0.3)',
                border: 'none',
                transition: 'all 0.2s ease',
                cursor: isOnboardingComplete() ? 'pointer' : 'not-allowed',
                opacity: isOnboardingComplete() ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (isOnboardingComplete()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (isOnboardingComplete()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              <CheckCircle size={20} />
              Add to Portfolio
                      </button>
          )}

          {/* THREE-DOT MENU - Always visible, conditional content */}
          <div style={{ position: 'relative' }}>
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
                padding: '8px 12px',
                          lineHeight: 1,
                          userSelect: 'none',
                transition: 'color 0.2s',
                display: 'block'
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
                  minWidth: '200px',
                            overflow: 'hidden'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                {/* LEAD STAGE */}
                {lead.status === 'lead' && (
                  <>
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
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                  </>
                )}

                {/* APPLICATION STAGE */}
                {(lead.status === 'approved' || lead.status === 'application') && !lead.applicationStatus && (
                            <>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                        console.log('Re-send application email');
                                  setShowMoreMenu(false);
                        // In real app, would trigger re-send application email
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
                      <Send size={16} />
                      Re-send Application
                              </button>
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                  </>
                )}

                {/* UNDER REVIEW STAGE */}
                {lead.applicationStatus === 'pending_review' && currentUser.permissions.approveOwnerOnboarding && (
                  <>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                        setShowDenyApplicationModal(true);
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
                      Deny Application
                              </button>
                    <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                            </>
                          )}

                {/* Archive - Always available */}
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="detail-tabs"
        style={{
          flexShrink: 0,
          zIndex: 99,
          backgroundColor: 'white',
          paddingLeft: 'var(--spacing-lg)',
          paddingRight: 'var(--spacing-lg)',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <button
          className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
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
                </div>

      {/* Content */}
      <div className="detail-content" style={{
        flex: 1,
        overflowY: 'auto',
        paddingLeft: 'var(--spacing-lg)',
        paddingRight: 'var(--spacing-lg)',
        paddingTop: 'var(--spacing-lg)',
        paddingBottom: 'var(--spacing-lg)'
      }}>
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

              {/* Save/Cancel buttons when editing */}
              {isEditing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                </div>
              )}
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
                    background: isApplicationComplete() ? '#10b981' : '#3b82f6',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {isApplicationComplete() ? 'Complete - Ready for Review' : 'In Progress'}
                  </span>
                </div>

                {/* Application Sections (Sections 1-3 only) */}
                <div style={{ padding: '20px' }}>
                  {mockOnboardingForm.applicationSections.map((section, index) => {
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
                  {lead.onboardingStatus === 'in_progress' && !isApplicationComplete() && (
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
                        <strong>Application In Progress:</strong> The applicant needs to complete all required sections before submitting for approval.
                      </div>
                    </div>
                  )}

                  {/* Application Status Messages (no action buttons - those are in header) */}
                  {isApplicationComplete() && !lead.applicationStatus && (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#166534' }}>
                          <strong>Application Complete:</strong> All required sections have been completed. Ready to submit for approval.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pending Review Status */}
                  {lead.applicationStatus === 'pending_review' && (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#eff6ff',
                      border: '1px solid #dbeafe',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Clock size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#1e40af' }}>
                          <strong>Pending Manager Review:</strong> This application is awaiting manager approval.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Changes Requested Status */}
                  {lead.applicationStatus === 'changes_requested' && (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#fef3c7',
                      border: '1px solid #fde047',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#92400e' }}>
                          <strong>Changes Requested:</strong> The manager has requested changes to this application. Please review the feedback and resubmit.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approved - Shows Onboarding Link */}
                  {lead.applicationStatus === 'approved' && (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#166534' }}>
                          <strong>Application Approved!</strong> This applicant has been approved and can now proceed to property onboarding.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENTS TO SIGN SECTION - Show if documents exist */}
            {isApplicant && lead.documents && lead.documents.length > 0 && (
              <div className="detail-section full-width" style={{ 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* Documents Header */}
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
                    Documents to Sign
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    background: lead.documents.every(doc => doc.status === 'signed') ? '#10b981' : '#f59e0b',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {lead.documents.filter(doc => doc.status === 'signed').length} / {lead.documents.length} Signed
                  </span>
                </div>

                {/* Documents List */}
                <div style={{ padding: '20px' }}>
                  {lead.documents.map((document) => {
                    const isSigned = document.status === 'signed';
                    
                    return (
                      <div 
                        key={document.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 20px',
                          marginBottom: '12px',
                          background: isSigned ? '#f0fdf4' : '#fafafa',
                          border: `1px solid ${isSigned ? '#bbf7d0' : '#e5e7eb'}`,
                          borderRadius: '8px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Status Icon */}
                        <div style={{ 
                          marginRight: '16px',
                          opacity: isSigned ? 1 : 0.3
                        }}>
                          <CheckCircle 
                            size={24} 
                            style={{ 
                              color: isSigned ? '#10b981' : '#6b7280',
                              fill: isSigned ? '#dcfce7' : 'none',
                              strokeWidth: 2
                            }} 
                          />
                        </div>

                        {/* Document Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '15px', 
                            fontWeight: '600',
                            color: isSigned ? '#166534' : '#374151',
                            marginBottom: '4px'
                          }}>
                            {document.name}
                          </div>
                          <div style={{ 
                            fontSize: '13px', 
                            color: isSigned ? '#16a34a' : '#6b7280',
                            marginBottom: '2px'
                          }}>
                            {document.description}
                          </div>
                          {isSigned && document.signedDate && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#10b981',
                              fontWeight: '500',
                              marginTop: '4px'
                            }}>
                              ✓ Signed on {new Date(document.signedDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                          )}
                        </div>

                        {/* Document Details */}
                        <div style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '4px'
                        }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#94a3b8',
                            padding: '4px 10px',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {document.type}
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: '#94a3b8'
                          }}>
                            {document.size}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* All Documents Signed Status */}
                  {lead.documents.every(doc => doc.status === 'signed') && (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#166534' }}>
                          <strong>All Documents Signed!</strong> All required documents have been electronically signed and are ready for review.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pending Documents Status */}
                  {!lead.documents.every(doc => doc.status === 'signed') && (
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
                        <strong>Pending Signatures:</strong> Waiting for applicant to sign {lead.documents.filter(doc => doc.status !== 'signed').length} remaining document(s).
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROPERTY ONBOARDING SECTION - Shows after application approval */}
            {lead.applicationStatus === 'approved' && (
              <div className="detail-section full-width" style={{ 
                border: '2px solid #10b981', 
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: '#f0fdf4',
                    borderBottom: '1px solid #bbf7d0'
                  }}
                >
                  <h3 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={20} />
                    Property Onboarding
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    IN PROGRESS
                  </span>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* Non-repeatable APPLICATION sections (Owner Information, Management Preferences) */}
                  {mockOnboardingForm.applicationSections
                    .filter(section => !section.repeatable)
                    .map((section, sectionIndex) => {
                      // Calculate completion for this section
                      const requiredFields = section.fields.filter(f => f.required);
                      const completedFields = requiredFields.filter(f => lead.onboardingAnswers?.[f.id]);
                      const isComplete = requiredFields.length === 0 || completedFields.length === requiredFields.length;
                      
                      return (
                        <div 
                          key={section.id}
                          style={{
                            marginBottom: '24px',
                            padding: '20px',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => handleOpenSectionModal(section)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                          }}>
                            <h4 style={{ 
                              margin: 0, 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: '#374151',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenSectionModal(section);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#3b82f6';
                                }}
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              {isComplete && (
                                <span style={{ 
                                  fontSize: '12px', 
                                  fontWeight: '600',
                                  color: '#10b981',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <CheckCircle size={14} />
                                  Complete
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'grid', gap: '12px' }}>
                            {section.fields.map((field) => {
                              const hasValue = lead.onboardingAnswers?.[field.id];
                              return (
                                <div 
                                  key={field.id}
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '8px 12px',
                                    background: hasValue ? '#f0fdf4' : '#f9fafb',
                                    borderRadius: '6px',
                                    fontSize: '13px'
                                  }}
                                >
                                  <CheckCircle 
                                    size={16} 
                                    style={{ 
                                      color: hasValue ? '#10b981' : '#d1d5db',
                                      flexShrink: 0 
                                    }} 
                                  />
                                  <span style={{ color: '#374151', flex: 1 }}>
                                    {field.label}
                                  </span>
                                  {hasValue && (
                                    <span style={{ 
                                      color: '#6b7280', 
                                      fontSize: '12px',
                                      fontStyle: 'italic'
                                    }}>
                                      {String(lead.onboardingAnswers[field.id]).substring(0, 40)}
                                      {String(lead.onboardingAnswers[field.id]).length > 40 ? '...' : ''}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  }

                  {/* Property-specific information grouped by property */}
                  {lead.properties && lead.properties.length > 0 && (
                    <div>
                      <h4 style={{ 
                        margin: '0 0 16px 0', 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        color: '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Home size={18} />
                        Properties
                      </h4>
                      {lead.properties.map((property, propertyIndex) => {
                        // Get property-specific section
                        const propertySection = mockOnboardingForm.sections.find(s => s.repeatable);
                        
                        // Calculate completion for this property
                        const requiredFields = propertySection.fields.filter(f => f.required);
                        const completedFields = requiredFields.filter(f => {
                          const fieldKey = `property-${propertyIndex}-${f.id}`;
                          return lead.onboardingAnswers?.[fieldKey];
                        });
                        const completionPercent = requiredFields.length > 0 
                          ? Math.round((completedFields.length / requiredFields.length) * 100)
                          : 100;
                        
                        return (
                          <div 
                            key={propertyIndex}
                            style={{
                              marginBottom: propertyIndex < lead.properties.length - 1 ? '16px' : '0',
                              padding: '20px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '2px solid #e5e7eb',
                              borderLeftWidth: '4px',
                              borderLeftColor: completionPercent === 100 ? '#10b981' : '#f59e0b',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              const propertySection = mockOnboardingForm.sections.find(s => s.repeatable);
                              if (propertySection) {
                                setSelectedSection(propertySection);
                                
                                // Initialize form data with THIS specific property's data
                                const initialData = {};
                                setModalPropertyCount(1); // Edit single property at a time
                                
                                propertySection.fields.forEach(field => {
                                  const fieldKey = `property-${propertyIndex}-${field.id}`;
                                  initialData[`property-0-${field.id}`] = lead.onboardingAnswers?.[fieldKey] || '';
                                });
                                
                                // Store which property index we're editing
                                initialData._editingPropertyIndex = propertyIndex;
                                
                                setSectionFormData(initialData);
                                setShowSectionModal(true);
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              marginBottom: '16px'
                            }}>
                              <h5 style={{ 
                                margin: 0, 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#374151',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <Building size={16} />
                                Property {propertyIndex + 1}
                              </h5>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px'
                              }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const propertySection = mockOnboardingForm.sections.find(s => s.repeatable);
                                    if (propertySection) {
                                      setSelectedSection(propertySection);
                                      
                                      // Initialize form data with THIS specific property's data
                                      const initialData = {};
                                      setModalPropertyCount(1);
                                      
                                      propertySection.fields.forEach(field => {
                                        const fieldKey = `property-${propertyIndex}-${field.id}`;
                                        initialData[`property-0-${field.id}`] = lead.onboardingAnswers?.[fieldKey] || '';
                                      });
                                      
                                      initialData._editingPropertyIndex = propertyIndex;
                                      
                                      setSectionFormData(initialData);
                                      setShowSectionModal(true);
                                    }
                                  }}
                                  style={{
                                    padding: '6px 12px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#2563eb';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#3b82f6';
                                  }}
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px'
                                }}>
                                  <span style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '600',
                                    color: completionPercent === 100 ? '#10b981' : '#f59e0b'
                                  }}>
                                    {completionPercent}% Complete
                                  </span>
                                  <div style={{
                                    width: '60px',
                                    height: '6px',
                                    background: '#e5e7eb',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                  }}>
                                    <div style={{
                                      width: `${completionPercent}%`,
                                      height: '100%',
                                      background: completionPercent === 100 ? '#10b981' : '#f59e0b',
                                      transition: 'width 0.3s ease'
                                    }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Property Address */}
                            <div style={{ 
                              padding: '12px',
                              background: '#f9fafb',
                              borderRadius: '6px',
                              marginBottom: '12px',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#6b7280'
                            }}>
                              {property.address || `Property ${propertyIndex + 1}`}
                            </div>

                            {/* All fields for this property */}
                            <div style={{ display: 'grid', gap: '8px' }}>
                              {propertySection.fields.map((field) => {
                                const fieldKey = `property-${propertyIndex}-${field.id}`;
                                const hasValue = lead.onboardingAnswers?.[fieldKey];
                                return (
                                  <div 
                                    key={fieldKey}
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '8px',
                                      padding: '8px 12px',
                                      background: hasValue ? '#f0fdf4' : '#fafafa',
                                      borderRadius: '6px',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <CheckCircle 
                                      size={16} 
                                      style={{ 
                                        color: hasValue ? '#10b981' : '#d1d5db',
                                        flexShrink: 0 
                                      }} 
                                    />
                                    <span style={{ 
                                      color: '#374151', 
                                      flex: 1,
                                      fontWeight: field.required ? '500' : '400'
                                    }}>
                                      {field.label}
                                      {field.required && <span style={{ color: '#ef4444' }}> *</span>}
                                    </span>
                                    {hasValue && (
                                      <span style={{ 
                                        color: '#6b7280', 
                                        fontSize: '12px',
                                        fontStyle: 'italic',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}>
                                        {String(lead.onboardingAnswers[fieldKey])}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ONBOARDING sections (Documents & Signatures) */}
                  <div style={{ marginTop: '32px' }}>
                    <h4 style={{ 
                      margin: '0 0 16px 0', 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FileText size={18} />
                      Documents & Signatures
                    </h4>
                    {mockOnboardingForm.onboardingSections.map((section) => {
                      // Calculate completion for this section
                      const requiredFields = section.fields.filter(f => f.required);
                      const completedFields = requiredFields.filter(f => lead.onboardingAnswers?.[f.id]);
                      const isComplete = requiredFields.length === 0 || completedFields.length === requiredFields.length;
                      
                      return (
                        <div 
                          key={section.id}
                          style={{
                            marginBottom: '24px',
                            padding: '20px',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => handleOpenSectionModal(section)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                          }}>
                            <h4 style={{ 
                              margin: 0, 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: '#374151',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {section.title}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenSectionModal(section);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#3b82f6';
                                }}
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              {isComplete && (
                                <span style={{ 
                                  fontSize: '12px', 
                                  fontWeight: '600',
                                  color: '#10b981',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <CheckCircle size={14} />
                                  Complete
                                </span>
                  )}
                </div>
              </div>
                          <div style={{ display: 'grid', gap: '12px' }}>
                            {section.fields.map((field) => {
                              const hasValue = lead.onboardingAnswers?.[field.id];
                              return (
                                <div 
                                  key={field.id}
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    padding: '8px 12px',
                                    background: hasValue ? '#f0fdf4' : '#f9fafb',
                                    borderRadius: '6px',
                                    fontSize: '13px'
                                  }}
                                >
                                  <CheckCircle 
                                    size={16} 
                                    style={{ 
                                      color: hasValue ? '#10b981' : '#d1d5db',
                                      flexShrink: 0 
                                    }} 
                                  />
                                  <span style={{ color: '#374151', flex: 1 }}>
                                    {field.label}
                                  </span>
                                  {hasValue && (
                                    <span style={{ 
                                      color: '#6b7280', 
                                      fontSize: '12px',
                                      fontStyle: 'italic'
                                    }}>
                                      {String(lead.onboardingAnswers[field.id]).substring(0, 40)}
                                      {String(lead.onboardingAnswers[field.id]).length > 40 ? '...' : ''}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status message based on onboarding completion */}
                  {isOnboardingComplete() ? (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#166534' }}>
                          <strong>Onboarding Complete!</strong> All property information and documents have been completed. Ready to add to portfolio.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      marginTop: '20px',
                      padding: '18px',
                      background: '#fffbeb',
                      border: '1px solid #fef3c7',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#92400e' }}>
                          <strong>Documents Pending:</strong> Please complete all document signing and property details to finalize onboarding.
                        </div>
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

      {/* Submit for Approval Modal */}
      {showSubmitForApprovalModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitForApprovalModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit Application for Approval</h2>
              <button className="btn-close" onClick={() => setShowSubmitForApprovalModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>
                You are about to submit this application for manager review. Once submitted:
              </p>
              <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>The manager will be notified to review the application</li>
                <li>You won't be able to make changes until approved or changes are requested</li>
                <li>The applicant will receive a confirmation email</li>
              </ul>
              <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
                <strong style={{ color: '#0369a1' }}>✓ All Required Information Complete</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#0c4a6e' }}>
                  All required application sections have been completed and validated.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowSubmitForApprovalModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitForApproval}>
                <Send size={18} />
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Application Modal */}
      {showApproveApplicationModal && (
        <div className="modal-overlay" onClick={() => setShowApproveApplicationModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Approve Application</h2>
              <button className="btn-close" onClick={() => setShowApproveApplicationModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>
                Approving <strong>{lead.firstName} {lead.lastName}</strong>'s application will:
              </p>
              <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>Send an approval email</strong> with next steps for property onboarding</li>
                <li><strong>Change status to "Onboarding"</strong> - they can now complete property details</li>
                <li><strong>Grant access</strong> to non-required property information forms</li>
                <li><strong>Create onboarding tasks</strong> for both the owner and your team</li>
              </ul>
              <div style={{ marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: '#166534' }}>✓ Ready for Approval</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#166534' }}>
                  All required application fields have been reviewed and verified.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowApproveApplicationModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleApproveApplication}>
                <CheckCircle size={18} />
                Approve & Send to Onboarding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showRequestChangesModal && (
        <div className="modal-overlay" onClick={() => setShowRequestChangesModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Changes</h2>
              <button className="btn-close" onClick={() => setShowRequestChangesModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>
                Request changes to <strong>{lead.firstName} {lead.lastName}</strong>'s application:
              </p>
              <div style={{ marginTop: '16px' }}>
                <label className="form-label">
                  What needs to be changed? <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  className="form-input"
                  rows={5}
                  value={changeRequestMessage}
                  onChange={(e) => setChangeRequestMessage(e.target.value)}
                  placeholder="Please provide specific details about what information needs to be updated or corrected..."
                  style={{ resize: 'vertical' }}
                />
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
                  This message will be sent to the applicant via email and they'll be able to make updates.
                </p>
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                <strong style={{ color: '#92400e' }}>⚠ Application will return to "In Progress"</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#92400e' }}>
                  The applicant will be notified and can make the requested changes.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowRequestChangesModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-warning" 
                onClick={handleRequestChanges}
                disabled={!changeRequestMessage.trim()}
              >
                <AlertCircle size={18} />
                Send Change Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Application Modal */}
      {showDenyApplicationModal && (
        <div className="modal-overlay" onClick={() => setShowDenyApplicationModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deny Application</h2>
              <button className="btn-close" onClick={() => setShowDenyApplicationModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to deny <strong>{lead.firstName} {lead.lastName}</strong>'s application?
              </p>
              <div style={{ marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <strong style={{ color: '#dc2626' }}>⚠ This action will:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#991b1b', lineHeight: '1.8' }}>
                  <li>Send a denial notification email to the applicant</li>
                  <li>Change the lead status to "Denied"</li>
                  <li>Remove this application from the active pipeline</li>
                </ul>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label className="form-label">
                  Reason for Denial (Optional)
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Provide a reason for the denial (this will be included in the notification email)..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDenyApplicationModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDenyApplication}>
                <XCircle size={18} />
                Deny Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal - Add to Portfolio */}
      {showCelebrationModal && (
        <div className="modal-overlay" style={{ background: 'rgba(0, 0, 0, 0.75)' }}>
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '600px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              border: '3px solid #10b981',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            {/* Success Icon */}
            <div style={{
              width: '120px',
              height: '120px',
              margin: '-60px auto 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              border: '6px solid white'
            }}>
              <CheckCircle size={64} style={{ color: 'white' }} />
            </div>

            <div className="modal-content" style={{ padding: '0 32px 32px' }}>
              <h2 style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                color: '#065f46',
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                🎉 Welcome to the Portfolio!
              </h2>
              
              <p style={{ 
                fontSize: '18px', 
                color: '#374151', 
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                <strong>{lead.firstName} {lead.lastName}</strong> has been successfully added to your portfolio!
              </p>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#065f46',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ✅ What happens next:
                </h3>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📧</span>
                    <div>
                      <strong style={{ color: '#374151', display: 'block' }}>Welcome email sent</strong>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        Confirmation and next steps delivered to {lead.email}
                      </span>
                    </div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🏠</span>
                    <div>
                      <strong style={{ color: '#374151', display: 'block' }}>
                        {lead.properties?.length || 0} {lead.properties?.length === 1 ? 'property' : 'properties'} added
                      </strong>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        Now visible in your active portfolio
                      </span>
                    </div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🔐</span>
                    <div>
                      <strong style={{ color: '#374151', display: 'block' }}>Portal access granted</strong>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        Owner can now access their client dashboard
                      </span>
                    </div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📋</span>
                    <div>
                      <strong style={{ color: '#374151', display: 'block' }}>Tasks created</strong>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        Initial setup tasks added to your workflow
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <button 
                className="btn btn-success"
                onClick={() => {
                  setShowCelebrationModal(false);
                  onBack(); // Navigate back to dashboard
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '14px 32px',
                  fontSize: '16px',
                  width: '100%',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  border: 'none'
                }}
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'][i % 5],
                top: '-10px',
                left: `${Math.random() * 100}%`,
                animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random()
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 720}deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LeadDetail;

