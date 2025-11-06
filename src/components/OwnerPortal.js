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
  ArrowLeft
} from 'lucide-react';
import OwnerApplicationForm from './OwnerApplicationForm';

const OwnerPortal = () => {
  const [activeNav, setActiveNav] = useState('properties');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, application-form
  const [selectedLead, setSelectedLead] = useState(null);

  // Mock data for the logged-in owner
  // This would come from authentication/API in real app
  const currentOwner = {
    id: 'lead-003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@email.com',
    phone: '(555) 345-6789',
    status: 'awaiting approval', // Can be: qualified, application, awaiting approval, onboarding
    stage: 'Awaiting Approval',
    onboardingCompletion: 75, // Progress percentage
    properties: [
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
    ],
    onboardingAnswers: {
      'field-legal-entity': 'Chen Properties LLC',
      'field-tax-id': '12-3456789',
      'field-mailing-address': '456 Oak Ave, Austin, TX 78702',
      'field-business-structure': 'LLC',
      'field-emergency-contact': 'Lisa Chen',
      'field-emergency-phone': '(555) 345-6790',
      'property-0-field-property-address': '456 Oak Ave, Austin, TX 78702',
      'property-0-field-property-bedrooms': '4',
      'property-0-field-property-bathrooms': '3',
      'property-0-field-square-footage': '2400',
      'property-0-field-pets-allowed': 'No',
      'property-0-field-min-rent': '3200'
      // Property 1 incomplete - needs to be filled out
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
                  <div className={`stage ${currentOwner.status === 'qualified' || currentOwner.status === 'application' || currentOwner.status === 'awaiting approval' || currentOwner.status === 'onboarding' ? 'completed' : ''}`}>
                    <div className="stage-indicator">
                      <CheckCircle size={20} />
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Lead Complete</div>
                      <div className="stage-description">Initial information submitted</div>
                    </div>
                  </div>

                  <div className="stage-connector"></div>

                  <div className={`stage ${currentOwner.status === 'awaiting approval' || currentOwner.status === 'onboarding' ? 'current' : currentOwner.status === 'onboarding' ? 'completed' : ''}`}>
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

                  <div className={`stage ${currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion >= 75 ? 'current' : ''}`}>
                    <div className="stage-indicator">
                      <FileText size={20} />
                    </div>
                    <div className="stage-content">
                      <div className="stage-title">Signed Agreement</div>
                      <div className="stage-description">Management agreement signed</div>
                    </div>
                  </div>

                  <div className="stage-connector"></div>

                  <div className={`stage ${currentOwner.status === 'onboarding' && currentOwner.onboardingCompletion >= 90 ? 'current' : ''}`}>
                    <div className="stage-indicator">
                      <Home size={20} />
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
                      <div className="property-rent-display">${property.minRentPrice}/mo</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Properties - Empty State */}
              <div className="section-container">
                <h2 className="section-title">Active Properties</h2>
                <p className="section-subtitle">PROPERTIES FULLY ONBOARDED AND UNDER MANAGEMENT</p>
                
                <div className="empty-state">
                  <Home size={64} className="empty-icon" />
                  <h3>No Active Properties Yet</h3>
                  <p>Complete your application to get your properties under management</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="section-container">
                <h2 className="section-title">Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <FileText size={16} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Application Started</p>
                      <p className="activity-time">2 days ago</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">Owner Information Completed</p>
                      <p className="activity-time">2 days ago</p>
                    </div>
                  </div>
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
    </div>
  );
};

export default OwnerPortal;

