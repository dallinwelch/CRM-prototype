import React, { useState } from 'react';
import { 
  Bell, 
  Search,
  ChevronDown,
  Plus,
  MessageSquare,
  BarChart3,
  FileText,
  DollarSign,
  Settings,
  Home,
  Users,
  Receipt,
  FolderOpen,
  Package,
  Wrench,
  Calculator,
  CreditCard,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  PenTool,
  Download,
  Eye
} from 'lucide-react';
import OwnerApplicationForm from './OwnerApplicationForm';

const OwnerPortal = () => {
  const [activeNav, setActiveNav] = useState('properties');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, application-form
  const [selectedLead, setSelectedLead] = useState(null);
  const [testStage, setTestStage] = useState(0); // 0: awaiting approval, 1: signed agreement, 2: property setup, 3: onboarded
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [properties, setProperties] = useState([
    {
      id: 'prop-002',
      address: '456 Oak Ave, Austin, TX 78702',
      bedrooms: 4,
      bathrooms: 3,
      petsAllowed: false,
      minRentPrice: 3200,
      status: 'pending' // pending or active
    },
    {
      id: 'prop-003',
      address: '789 Pine St, Austin, TX 78703',
      bedrooms: 2,
      bathrooms: 1,
      petsAllowed: true,
      minRentPrice: 1800,
      status: 'pending'
    }
  ]);
  const [documents, setDocuments] = useState([
    {
      id: 'doc-001',
      name: 'Property Management Agreement',
      description: 'Standard agreement outlining terms and conditions',
      type: 'Management Agreement',
      status: 'pending', // pending, signed
      uploadedDate: '2024-01-15',
      size: '245 KB'
    },
    {
      id: 'doc-002',
      name: 'W-9 Tax Form',
      description: 'Required for tax reporting purposes',
      type: 'Tax Form',
      status: 'pending',
      uploadedDate: '2024-01-15',
      size: '128 KB'
    },
    {
      id: 'doc-003',
      name: 'Direct Deposit Authorization',
      description: 'Setup automatic rent payments to your account',
      type: 'Banking Form',
      status: 'pending',
      uploadedDate: '2024-01-15',
      size: '95 KB'
    }
  ]);
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 'activity-001',
      icon: FileText,
      title: 'Application Started',
      time: '2 days ago'
    },
    {
      id: 'activity-002',
      icon: CheckCircle,
      title: 'Owner Information Completed',
      time: '2 days ago'
    }
  ]);

  // Map test stage to owner status and completion
  const getOwnerStatus = () => {
    switch(testStage) {
      case 0:
        return { status: 'awaiting approval', onboardingCompletion: 75 };
      case 1:
        return { status: 'onboarding', onboardingCompletion: 75 };
      case 2:
        return { status: 'onboarding', onboardingCompletion: 90 };
      case 3:
        return { status: 'completed', onboardingCompletion: 100 };
      default:
        return { status: 'awaiting approval', onboardingCompletion: 75 };
    }
  };

  const handleTestAdvance = () => {
    if (testStage < 3) {
      const newStage = testStage + 1;
      setTestStage(newStage);
      if (newStage === 3) {
        // Activate all properties when onboarding is complete
        setProperties(properties.map(prop => ({ ...prop, status: 'active' })));
        // Add onboarding completion to recent activity
        setRecentActivity([
          {
            id: 'activity-onboarded',
            icon: CheckCircle,
            title: 'Onboarding Completed! Properties Now Active',
            time: 'Just now'
          },
          ...recentActivity
        ]);
        // Show completion modal and confetti
        setTimeout(() => {
          setShowCompletionModal(true);
          triggerConfetti();
        }, 500);
      }
    } else {
      // Reset to beginning
      setTestStage(0);
      setShowCompletionModal(false);
      // Reset properties back to pending
      setProperties(properties.map(prop => ({ ...prop, status: 'pending' })));
      // Reset activity
      setRecentActivity([
        {
          id: 'activity-001',
          icon: FileText,
          title: 'Application Started',
          time: '2 days ago'
        },
        {
          id: 'activity-002',
          icon: CheckCircle,
          title: 'Owner Information Completed',
          time: '2 days ago'
        }
      ]);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Create confetti from multiple positions
      createConfetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      createConfetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);
  };

  const createConfetti = (options) => {
    // Simple confetti implementation using DOM elements
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const confettiCount = options.particleCount || 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = (options.origin.x * 100) + '%';
      confetti.style.top = (options.origin.y * 100 + 50) + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'vw');
      confetti.style.setProperty('--y', (Math.random() * 100 + 100) + 'vh');
      confetti.style.setProperty('--rotation', Math.random() * 360 + 'deg');
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  const ownerStatus = getOwnerStatus();

  // Function to check missing property setup fields
  const getMissingPropertyFields = (propertyIndex) => {
    const optionalFields = [
      `property-${propertyIndex}-field-square-footage`,
      `property-${propertyIndex}-field-year-built`,
      `property-${propertyIndex}-field-garage-code`,
      `property-${propertyIndex}-field-hoa`,
      `property-${propertyIndex}-field-hoa-fee`
    ];
    
    return optionalFields.filter(fieldId => !currentOwner.onboardingAnswers?.[fieldId]);
  };

  const getTotalMissingFields = () => {
    let total = 0;
    currentOwner.properties.forEach((_, index) => {
      total += getMissingPropertyFields(index).length;
    });
    return total;
  };

  // Mock data for the logged-in owner
  // This would come from authentication/API in real app
  const currentOwner = {
    id: 'lead-003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@email.com',
    phone: '(555) 345-6789',
    status: ownerStatus.status, // Can be: qualified, application, awaiting approval, onboarding, completed
    stage: 'Awaiting Approval',
    onboardingCompletion: ownerStatus.onboardingCompletion, // Progress percentage
    properties: properties, // Use state for dynamic property updates
    onboardingAnswers: {
      'field-legal-entity': 'Chen Properties LLC',
      'field-tax-id': '12-3456789',
      'field-mailing-address': '456 Oak Ave, Austin, TX 78702',
      'field-business-structure': 'LLC',
      'field-emergency-contact': 'Lisa Chen',
      'field-emergency-phone': '(555) 345-6790',
      // Property 0 - Complete with all optional fields
      'property-0-field-property-address': '456 Oak Ave, Austin, TX 78702',
      'property-0-field-property-bedrooms': '4',
      'property-0-field-property-bathrooms': '3',
      'property-0-field-square-footage': '2400',
      'property-0-field-year-built': '2015',
      'property-0-field-pets-allowed': 'No',
      'property-0-field-min-rent': '3200',
      'property-0-field-garage-code': '4567',
      'property-0-field-hoa': 'Oak Hills HOA',
      'property-0-field-hoa-fee': '150',
      // Property 1 - Missing optional fields (square-footage, year-built, garage-code, hoa, hoa-fee)
      'property-1-field-property-address': '789 Pine St, Austin, TX 78703',
      'property-1-field-property-bedrooms': '2',
      'property-1-field-property-bathrooms': '1',
      'property-1-field-pets-allowed': 'Yes',
      'property-1-field-min-rent': '1800'
    }
  };

  const handleSaveApplication = async (formData) => {
    console.log('Saving application data:', formData);
    // In real app, this would call an API to save the data
    // Update local state for demo purposes
    alert('Progress saved successfully!');
  };

  const handleSubmitForReview = (formData) => {
    console.log('Submitting application for review:', formData);
    // In real app, this would call an API to submit for manager review
    alert('Application submitted for review! Our team will get back to you soon.');
    setCurrentView('dashboard');
  };

  const handlePropertyClick = (property) => {
    setSelectedLead(currentOwner);
    setCurrentView('application-form');
  };

  const handleSignDocument = (docId) => {
    // In a real app, this would open a signing interface
    const updatedDocs = documents.map(doc => 
      doc.id === docId ? { ...doc, status: 'signed' } : doc
    );
    setDocuments(updatedDocs);
    alert('Document signed successfully! It will now appear in your Files.');
  };

  const handleViewDocument = (docId) => {
    // In a real app, this would open a document viewer
    alert('Opening document viewer...');
  };

  const handleDownloadDocument = (docId) => {
    // In a real app, this would download the document
    alert('Downloading document...');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedLead(null);
  };

  const getStatusInfo = () => {
    switch (currentOwner.status) {
      case 'qualified':
        return {
          title: 'Ready to Apply',
          description: 'Start your owner application',
          icon: FileText,
          color: 'blue'
        };
      case 'application':
        return {
          title: 'Application In Progress',
          description: `${currentOwner.onboardingCompletion}% complete`,
          icon: Clock,
          color: 'orange'
        };
      case 'awaiting approval':
        return {
          title: 'Awaiting Approval',
          description: 'Your application is being reviewed',
          icon: AlertCircle,
          color: 'purple'
        };
      case 'onboarding':
        return {
          title: 'Onboarding',
          description: 'Complete final setup steps',
          icon: CheckCircle,
          color: 'green'
        };
      default:
        return {
          title: 'Application',
          description: 'Get started',
          icon: FileText,
          color: 'gray'
        };
    }
  };

  const statusInfo = getStatusInfo();

  const getStatusColor = (color) => {
    const colors = {
      blue: '#3b82f6',
      orange: '#f59e0b',
      purple: '#8b5cf6',
      green: '#10b981',
      gray: '#6b7280'
    };
    return colors[color] || colors.gray;
  };

  const navItems = [
    { id: 'ledger', label: 'Ledger', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'rent-roll', label: 'Rent Roll', icon: Receipt },
    { id: 'statements', label: 'Statements', icon: FileText },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'bills', label: 'Bills', icon: Receipt },
    { id: 'work-orders', label: 'Work Orders', icon: Wrench },
    { id: 'estimates', label: 'Estimates', icon: Calculator },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="owner-portal">
      {/* Sidebar */}
      <aside className="owner-portal-sidebar">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="logo-text">rentvine</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-time">
            <span>🕐 123 PM</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="owner-portal-main">
        {/* Header */}
        <header className="portal-header">
          <div className="header-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
            <kbd className="search-kbd">⌘K</kbd>
          </div>

          <div className="header-actions">
            <button className="test-advance-button" onClick={handleTestAdvance}>
              {testStage === 0 && 'Test Approve'}
              {testStage === 1 && 'Continue to Property Setup'}
              {testStage === 2 && 'Complete Onboarding'}
              {testStage === 3 && 'Reset to Start'}
            </button>
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-badge">1</span>
            </button>
            <button className="profile-button">
              <div className="profile-avatar">
                <img src="https://via.placeholder.com/32" alt="Profile" />
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="portal-content">
          {currentView === 'dashboard' ? (
            <>
              <div className="content-header">
                <div>
                  <h1 className="page-title">Welcome, {currentOwner.firstName}!</h1>
                  <p className="page-subtitle">Manage your properties and track your onboarding progress</p>
                </div>
              </div>

              {/* Application Status Card */}
              <div className="application-status-card">
                <h2 className="onboarding-stages-title">Your Onboarding Progress</h2>
                
                <div className="onboarding-stages">
                  <div className={`stage ${currentOwner.status === 'qualified' || currentOwner.status === 'application' || currentOwner.status === 'awaiting approval' || currentOwner.status === 'onboarding' || currentOwner.status === 'completed' ? 'completed' : ''}`}>
                    <div className="stage-indicator">
                      <CheckCircle size={20} />
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Lead Complete</div>
                      <div className="stage-description">Initial information submitted</div>
                    </div>
                  </div>

                  <div className="stage-connector"></div>

                  <div className={`stage ${currentOwner.status === 'awaiting approval' ? 'current' : (currentOwner.status === 'onboarding' || currentOwner.status === 'completed') ? 'completed' : ''}`}>
                    <div className="stage-indicator">
                      {currentOwner.status === 'awaiting approval' ? <Clock size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Application Awaiting Approval</div>
                      <div className="stage-description">
                        {currentOwner.status === 'awaiting approval' ? 'Under review by our team' : 'Application reviewed'}
                      </div>
                    </div>
                  </div>

                  <div className="stage-connector"></div>

                  <div className={`stage ${currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion === 75 ? 'current' : (currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion > 75) || currentOwner.status === 'completed' ? 'completed' : ''}`}>
                    <div className="stage-indicator">
                      {currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion === 75 ? <FileText size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Signed Agreement</div>
                      <div className="stage-description">Management agreement signed</div>
                    </div>
                  </div>

                  <div className="stage-connector"></div>

                  <div className={`stage ${currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion === 90 ? 'current' : currentOwner.status === 'completed' ? 'completed' : ''}`}>
                    <div className="stage-indicator">
                      {currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion === 90 ? <Home size={20} /> : <CheckCircle size={20} />}
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Property Setup</div>
                      <div className="stage-description">Properties being configured</div>
                    </div>
                  </div>

                  <div className="stage-connector"></div>

                  <div className={`stage final ${currentOwner.status === 'completed' ? 'completed' : ''}`}>
                    <div className="stage-indicator large">
                      <CheckCircle size={32} />
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Onboarded</div>
                      <div className="stage-description">Welcome! You're all set</div>
                    </div>
                  </div>
                </div>

                {currentOwner.status === 'awaiting approval' && (
                  <div className="action-message">
                    <AlertCircle size={18} />
                    <span>Your application is being reviewed. We'll notify you once approved!</span>
                  </div>
                )}

                {(currentOwner.status === 'application') && (
                  <div className="action-message clickable" onClick={() => handlePropertyClick(currentOwner.properties[0])}>
                    <FileText size={18} />
                    <span>Continue your application →</span>
                  </div>
                )}
              </div>

              {/* Missing Property Fields Warning */}
              {(currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion >= 90) && getTotalMissingFields() > 0 && (
                <div className="missing-fields-warning">
                  <AlertCircle size={20} />
                  <div className="warning-content">
                    <strong>Optional Property Information</strong>
                    <p>You have {getTotalMissingFields()} missing field{getTotalMissingFields() !== 1 ? 's' : ''} </p>
                  </div>
                </div>
              )}

              {/* Documents to Sign */}
              {documents.filter(doc => doc.status === 'pending').length > 0 && 
               currentOwner.status === 'onboarding' && 
               currentOwner.onboardingCompletion === 75 && (
                <div className="section-container">
                  <h2 className="section-title">Documents to Sign</h2>
                  <p className="section-subtitle">REVIEW AND SIGN REQUIRED DOCUMENTS</p>
                  
                  <div className="documents-grid">
                    {documents.filter(doc => doc.status === 'pending').map((doc) => (
                      <div key={doc.id} className="document-card">
                        <div className="document-card-header">
                          <div className="document-icon-wrapper">
                            <FileText size={24} />
                          </div>
                          <div className="document-info">
                            <h3 className="document-name">{doc.name}</h3>
                            <p className="document-description">{doc.description}</p>
                            <div className="document-meta">
                              <span className="document-type">{doc.type}</span>
                              <span className="document-divider">•</span>
                              <span className="document-size">{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="document-actions">
                          <button 
                            className="btn-document-secondary"
                            onClick={() => handleViewDocument(doc.id)}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button 
                            className="btn-document-secondary"
                            onClick={() => handleDownloadDocument(doc.id)}
                          >
                            <Download size={16} />
                            Download
                          </button>
                          <button 
                            className="btn-document-primary"
                            onClick={() => handleSignDocument(doc.id)}
                          >
                            <PenTool size={16} />
                            Sign Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Properties */}
              <div className="section-container">
                <h2 className="section-title">Pending Properties</h2>
                <p className="section-subtitle">COMPLETE YOUR APPLICATION FOR THESE PROPERTIES</p>
                
                <div className="properties-grid">
                  {currentOwner.properties.filter(p => p.status === 'pending').map((property, index) => (
                    <div 
                      key={property.id} 
                      className="property-card-portal"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className="property-card-icon-wrapper">
                        <Home size={32} className="property-card-icon-large" />
                        <span className="property-badge-pending">Pending</span>
                      </div>
                      <div className="property-card-details">
                        <h3 className="property-card-address">{property.address}</h3>
                        <div className="property-card-specs">
                          <span>{property.bedrooms} bed</span>
                          <span>•</span>
                          <span>{property.bathrooms} bath</span>
                        </div>
                      </div>
                      {/* <button 
                        className="complete-app-button"
                        onClick={() => handlePropertyClick(property)}
                      >
                        COMPLETE APPLICATION
                      </button> */}
                      <div className="property-rent-display">
                        ${property.minRentPrice}/mo
                        {getMissingPropertyFields(index).length > 0 && (
                          <div className="property-missing-info">
                            <AlertCircle size={14} />
                            <span>Missing info</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Properties */}
              <div className="section-container">
                <h2 className="section-title">Active Properties</h2>
                <p className="section-subtitle">PROPERTIES FULLY ONBOARDED AND UNDER MANAGEMENT</p>
                
                {currentOwner.properties.filter(p => p.status === 'active').length > 0 ? (
                  <div className="properties-grid">
                    {currentOwner.properties.filter(p => p.status === 'active').map((property, index) => (
                      <div 
                        key={property.id} 
                        className="property-card-portal active"
                      >
                        <div className="property-card-icon-wrapper">
                          <Home size={32} className="property-card-icon-large" />
                          <span className="property-badge-active">Active</span>
                        </div>
                        <div className="property-card-details">
                          <h3 className="property-card-address">{property.address}</h3>
                          <div className="property-card-specs">
                            <span>{property.bedrooms} bed</span>
                            <span>•</span>
                            <span>{property.bathrooms} bath</span>
                          </div>
                        </div>
                        <div className="property-rent-display">
                          ${property.minRentPrice}/mo
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Home size={64} className="empty-icon" />
                    <h3>No Active Properties Yet</h3>
                    <p>Complete your application to get your properties under management</p>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="section-container">
                <h2 className="section-title">Recent Activity</h2>
                <div className="activity-list">
                  {recentActivity.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <IconComponent size={16} />
                        </div>
                        <div className="activity-content">
                          <p className="activity-title">{activity.title}</p>
                          <p className="activity-time">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="content-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                  <ArrowLeft size={20} />
                  <span>Back to Dashboard</span>
                </button>
              </div>
              
              <OwnerApplicationForm
                lead={currentOwner}
                onSave={handleSaveApplication}
                onSubmitForReview={handleSubmitForReview}
              />
            </>
          )}
        </main>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
          <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
            <div className="completion-icon">
              <CheckCircle size={80} />
            </div>
            <h2 className="completion-title">🎉 Congratulations!</h2>
            <p className="completion-message">
              You're all set and ready to go! Your onboarding is complete.
            </p>
            <p className="completion-submessage">
              Welcome to the RentVine family. We're excited to help you manage your properties!
            </p>
            <button 
              className="completion-button"
              onClick={() => setShowCompletionModal(false)}
            >
              Let's Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPortal;

