import React, { useState } from 'react';
import { User, Users, Workflow, Bell, Database, Palette, Shield, Key, Settings, Save, Plus, Trash2, X, Eye, ToggleLeft, ToggleRight, CheckCircle, ChevronRight } from 'lucide-react';

const SettingsTab = () => {
  const [activeSection, setActiveSection] = useState('general');
  
  // Owner Application Settings State
  const [showApplicationsView, setShowApplicationsView] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationEditor, setShowApplicationEditor] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [applications, setApplications] = useState([
    {
      id: 'app1',
      name: 'Property Owner Information Sheet',
      description: 'Comprehensive property owner application form for RentEngine - icpment smart.com',
      isActive: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-14T10:30:00Z',
      customQuestions: [
        // Lead Source Information
        {
          id: 'q1',
          label: 'How did you hear about us?',
          type: 'select',
          weight: 0.05,
          options: ['Referral', 'Internet', 'Walk-in', 'Other'],
          order: 1,
          required: true,
          active: true
        },
        {
          id: 'q2',
          label: 'If referral, who referred you?',
          type: 'text',
          weight: 0.02,
          options: [],
          order: 2,
          required: false,
          active: true,
          condition: {
            dependsOn: 'q1',
            showWhen: 'Referral'
          }
        },
        {
          id: 'q3',
          label: 'If internet, what website?',
          type: 'text',
          weight: 0.02,
          options: [],
          order: 3,
          required: false,
          active: true,
          condition: {
            dependsOn: 'q1',
            showWhen: 'Internet'
          }
        },
        
        // Owner Contact Information
        {
          id: 'q4',
          label: 'Full Name of Owner(s)',
          type: 'text',
          weight: 0.1,
          options: [],
          order: 4,
          required: true,
          active: true
        },
        {
          id: 'q5',
          label: 'Email Address',
          type: 'text',
          weight: 0.1,
          options: [],
          order: 5,
          required: true,
          active: true
        },
        {
          id: 'q6',
          label: 'Phone Number',
          type: 'text',
          weight: 0.1,
          options: [],
          order: 6,
          required: true,
          active: true
        },
        
        // Property Information
        {
          id: 'q7',
          label: 'Property Address (Street, City, State, Zip)',
          type: 'textarea',
          weight: 0.1,
          options: [],
          order: 7,
          required: true,
          active: true
        },
        {
          id: 'q8',
          label: 'Property Type',
          type: 'select',
          weight: 0.1,
          options: ['Single Family', 'Multi-Family', 'Commercial', 'Mobile Home', 'Unit/Apartment'],
          order: 8,
          required: true,
          active: true
        },
        {
          id: 'q9',
          label: 'If multi-family, how many units?',
          type: 'number',
          weight: 0.05,
          options: [],
          order: 9,
          required: false,
          active: true,
          condition: {
            dependsOn: 'q8',
            showWhen: 'Multi-Family'
          }
        },
        
        // Property Specifications
        {
          id: 'q10',
          label: 'Number of Bedrooms',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 10,
          required: true,
          active: true
        },
        {
          id: 'q11',
          label: 'Number of Bathrooms',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 11,
          required: true,
          active: true
        },
        {
          id: 'q12',
          label: 'Square Footage',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 12,
          required: true,
          active: true
        },
        {
          id: 'q13',
          label: 'Year Built',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 13,
          required: true,
          active: true
        },
        
        // Key Amenities
        {
          id: 'q14',
          label: 'Garage/Parking',
          type: 'select',
          weight: 0.05,
          options: ['Garage', 'Driveway', 'Street Parking', 'None'],
          order: 14,
          required: false,
          active: true
        },
        {
          id: 'q15',
          label: 'Air Conditioning',
          type: 'select',
          weight: 0.05,
          options: ['Central AC', 'Window Units', 'None'],
          order: 15,
          required: false,
          active: true
        },
        {
          id: 'q16',
          label: 'Washer/Dryer',
          type: 'select',
          weight: 0.05,
          options: ['Included', 'Hookups Only', 'None'],
          order: 16,
          required: false,
          active: true
        },
        
        // Rental Terms & Financial Criteria
        {
          id: 'q17',
          label: 'Is the property furnished?',
          type: 'select',
          weight: 0.1,
          options: ['Furnished', 'Unfurnished', 'Partially Furnished'],
          order: 17,
          required: true,
          active: true
        },
        {
          id: 'q18',
          label: 'What type of lease do you prefer?',
          type: 'select',
          weight: 0.1,
          options: ['Short-term (1-6 months)', 'Long-term (12+ months)', 'Flexible'],
          order: 18,
          required: true,
          active: true
        },
        {
          id: 'q19',
          label: 'Acceptable Rent Rate/Month ($)',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 19,
          required: true,
          active: true
        },
        {
          id: 'q20',
          label: 'Minimum management agreement length (years)',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 20,
          required: true,
          active: true
        },
        
        // Pet Policy
        {
          id: 'q21',
          label: 'Do you allow pets?',
          type: 'select',
          weight: 0.05,
          options: ['Yes', 'No'],
          order: 21,
          required: false,
          active: true
        },
        
        // Property Status & Quality
        {
          id: 'q22',
          label: 'Is your property currently listed for sale?',
          type: 'select',
          weight: 0.05,
          options: ['Yes', 'No'],
          order: 22,
          required: false,
          active: true
        },
        {
          id: 'q23',
          label: 'Is there a homeowners association?',
          type: 'select',
          weight: 0.05,
          options: ['Yes', 'No'],
          order: 23,
          required: false,
          active: true
        },
        {
          id: 'q24',
          label: 'Property condition',
          type: 'select',
          weight: 0.1,
          options: ['Excellent', 'Good', 'Fair', 'Needs Work'],
          order: 24,
          required: true,
          active: true
        },
        {
          id: 'q25',
          label: 'Are you willing to invest in necessary repairs and maintenance?',
          type: 'select',
          weight: 0.1,
          options: ['Yes', 'No', 'Limited budget'],
          order: 25,
          required: true,
          active: true
        },
        
        // Distance & Location
        {
          id: 'q26',
          label: 'Approximate driving distance from our office (minutes)',
          type: 'number',
          weight: 0.1,
          options: [],
          order: 26,
          required: true,
          active: true
        },
        
        // Additional Information
        {
          id: 'q27',
          label: 'Any special features or additional information about the property?',
          type: 'textarea',
          weight: 0.05,
          options: [],
          order: 27,
          required: false,
          active: true
        }
      ],
      eliminatingRules: [
        {
          id: 'r1',
          label: 'Property must be within 30 minutes of office',
          field: 'q26',
          op: '<=',
          value: '30',
          isDisqualifying: true
        },
        {
          id: 'r2',
          label: 'Minimum rent must be at least $1,500/month',
          field: 'q19',
          op: '>=',
          value: '1500',
          isDisqualifying: true
        },
        {
          id: 'r3',
          label: 'Property must be in good or excellent condition',
          field: 'q24',
          op: 'in',
          value: 'Excellent,Good',
          isDisqualifying: true
        },
        {
          id: 'r4',
          label: 'Owner must be willing to invest in repairs',
          field: 'q25',
          op: '!=',
          value: 'No',
          isDisqualifying: true
        },
        {
          id: 'r5',
          label: 'No mobile homes or units (unless high-end)',
          field: 'q8',
          op: 'not_in',
          value: 'Mobile Home,Unit/Apartment',
          isDisqualifying: true
        },
        {
          id: 'r6',
          label: 'No furnished properties (unless high-end executive)',
          field: 'q17',
          op: '!=',
          value: 'Furnished',
          isDisqualifying: true
        },
        {
          id: 'r7',
          label: 'Minimum 1-year management agreement',
          field: 'q20',
          op: '>=',
          value: '1',
          isDisqualifying: true
        }
      ],
      applicationSettings: {
        autoEvaluate: true,
        sendNotifications: true,
        requirePhoneVerification: true,
        maxApplicationsPerDay: 5,
        applicationTimeout: 45
      }
    },
    {
      id: 'app2',
      name: 'Commercial Property Application',
      description: 'Specialized application for commercial property owners',
      isActive: false,
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-12T14:00:00Z',
      customQuestions: [
        {
          id: 'q1',
          label: 'What type of commercial properties do you own?',
          type: 'select',
          weight: 0.4,
          options: ['Office Buildings', 'Retail Spaces', 'Industrial', 'Mixed Use'],
          order: 1,
          required: true,
          active: true
        },
        {
          id: 'q2',
          label: 'Total square footage of properties',
          type: 'number',
          weight: 0.3,
          options: [],
          order: 2,
          required: false,
          active: true
        }
      ],
      eliminatingRules: [],
      applicationSettings: {
        autoEvaluate: true,
        sendNotifications: true,
        requirePhoneVerification: true,
        maxApplicationsPerDay: 25,
        applicationTimeout: 45
      }
    }
  ]);

  // Mock submitted applications data (responses to the application forms)
  const [submittedApplications, setSubmittedApplications] = useState([
    {
      id: 'sub1',
      applicationId: 'app1',
      ownerName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'completed',
      submittedAt: '2024-01-14T10:30:00Z',
      lastActivityAt: '2024-01-14T10:30:00Z',
      outreachActive: true,
      distanceMinutesFromOffice: 15,
      leadSource: 'Google Ads',
      answers: {
        q1: 3,
        q2: true,
        q3: 'Single Family',
        q4: 'I have been managing my own properties for 5 years'
      },
      matchBand: 'great',
      disqualifiedByRuleId: null
    },
    {
      id: 'sub2',
      applicationId: 'app1',
      ownerName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      status: 'completed',
      submittedAt: '2024-01-13T14:20:00Z',
      lastActivityAt: '2024-01-13T14:20:00Z',
      outreachActive: true,
      distanceMinutesFromOffice: 45,
      leadSource: 'Facebook',
      answers: {
        q1: 1,
        q2: false,
        q3: 'Multi-Family',
        q4: 'New to property management'
      },
      matchBand: 'bad',
      disqualifiedByRuleId: 'r1'
    },
    {
      id: 'sub3',
      applicationId: 'app1',
      ownerName: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      status: 'partial',
      lastActivityAt: '2024-01-12T09:15:00Z',
      outreachActive: true,
      leadSource: 'Referral',
      answers: {
        q1: 2,
        q2: true
      },
      matchBand: null,
      disqualifiedByRuleId: null
    },
    {
      id: 'sub4',
      applicationId: 'app1',
      ownerName: 'David Thompson',
      email: 'david.thompson@email.com',
      phone: '(555) 345-6789',
      status: 'completed',
      submittedAt: '2024-01-11T16:45:00Z',
      lastActivityAt: '2024-01-11T16:45:00Z',
      outreachActive: true,
      distanceMinutesFromOffice: 8,
      leadSource: 'Website',
      answers: {
        q1: 5,
        q2: true,
        q3: 'Mixed',
        q4: 'Extensive experience with both residential and commercial properties'
      },
      matchBand: 'perfect',
      disqualifiedByRuleId: null
    },
    {
      id: 'sub5',
      applicationId: 'app1',
      ownerName: 'Lisa Wang',
      email: 'lisa.wang@email.com',
      status: 'partial',
      lastActivityAt: '2024-01-10T11:30:00Z',
      outreachActive: false,
      leadSource: 'LinkedIn',
      answers: {
        q1: 1
      },
      matchBand: null,
      disqualifiedByRuleId: null
    }
  ]);

  const settingsSections = [
    { id: 'general', label: 'General', icon: User },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'owner-applications', label: 'Owner Applications', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  // Hardcoded settings data
  const generalSettings = {
    companyName: 'CRM Prototype Inc.',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'English'
  };

  const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'User', status: 'Active' },
    { id: 4, name: 'Lisa Chen', email: 'lisa@company.com', role: 'User', status: 'Inactive' },
    { id: 5, name: 'David Brown', email: 'david@company.com', role: 'User', status: 'Active' }
  ];

  const workflowStages = [
    { id: 1, name: 'Lead', color: '#3b82f6', order: 1 },
    { id: 2, name: 'Qualified', color: '#8b5cf6', order: 2 },
    { id: 3, name: 'Proposal', color: '#f59e0b', order: 3 },
    { id: 4, name: 'Negotiation', color: '#ef4444', order: 4 },
    { id: 5, name: 'Closed Won', color: '#10b981', order: 5 },
    { id: 6, name: 'Closed Lost', color: '#6b7280', order: 6 }
  ];

  const integrations = [
    { name: 'n8n Workflows', status: 'Connected', description: 'Automation and workflow management' },
    { name: 'Email Service', status: 'Connected', description: 'Send automated emails and notifications' },
    { name: 'Calendar Sync', status: 'Disconnected', description: 'Sync with Google Calendar' },
    { name: 'Slack Integration', status: 'Disconnected', description: 'Team notifications and updates' }
  ];

  // Application Management Functions
  const createNewApplication = () => {
    const newApplication = {
      id: `app${Date.now()}`,
      name: '',
      description: '',
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customQuestions: [],
      eliminatingRules: [],
      applicationSettings: {
        autoEvaluate: true,
        sendNotifications: true,
        requirePhoneVerification: false,
        maxApplicationsPerDay: 50,
        applicationTimeout: 30
      }
    };
    setEditingApplication(newApplication);
    setShowApplicationEditor(true);
  };

  const editApplication = (application) => {
    setEditingApplication({ ...application });
    setShowApplicationEditor(true);
  };

  const saveApplication = () => {
    if (editingApplication.isActive) {
      // Deactivate all other applications
      setApplications(applications.map(app => 
        app.id !== editingApplication.id ? { ...app, isActive: false } : app
      ));
    }
    
    if (editingApplication.id.startsWith('app') && editingApplication.id.length > 3) {
      // Update existing application
      setApplications(applications.map(app => 
        app.id === editingApplication.id ? { ...editingApplication, updatedAt: new Date().toISOString() } : app
      ));
    } else {
      // Create new application
      const newApp = { ...editingApplication, id: `app${Date.now()}` };
      setApplications([...applications, newApp]);
    }
    
    setShowApplicationEditor(false);
    setEditingApplication(null);
  };

  const deleteApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      setApplications(applications.filter(app => app.id !== applicationId));
    }
  };

  const toggleApplicationActive = (applicationId) => {
    setApplications(applications.map(app => {
      if (app.id === applicationId) {
        // If activating this application, deactivate all others
        if (!app.isActive) {
          return { ...app, isActive: true, updatedAt: new Date().toISOString() };
        } else {
          return { ...app, isActive: false, updatedAt: new Date().toISOString() };
        }
      } else {
        // Deactivate all other applications
        return { ...app, isActive: false };
      }
    }));
  };

  // Question Management Functions (within application editor)
  const addCustomQuestion = () => {
    if (!editingApplication) return;
    
    const newQuestion = {
      id: `q${Date.now()}`,
      label: '',
      type: 'text',
      weight: 0.5,
      options: [],
      order: editingApplication.customQuestions.length + 1,
      required: false,
      active: true
    };
    setEditingApplication({
      ...editingApplication,
      customQuestions: [...editingApplication.customQuestions, newQuestion]
    });
  };

  const updateCustomQuestion = (questionId, updatedQuestion) => {
    if (!editingApplication) return;
    
    setEditingApplication({
      ...editingApplication,
      customQuestions: editingApplication.customQuestions.map(q => 
        q.id === questionId ? { ...q, ...updatedQuestion } : q
      )
    });
  };

  const deleteCustomQuestion = (questionId) => {
    if (!editingApplication) return;
    
    setEditingApplication({
      ...editingApplication,
      customQuestions: editingApplication.customQuestions.filter(q => q.id !== questionId)
    });
  };

  const addEliminatingRule = () => {
    if (!editingApplication) return;
    
    const newRule = {
      id: `r${Date.now()}`,
      label: '',
      field: '',
      op: '>',
      value: '',
      isDisqualifying: true
    };
    setEditingApplication({
      ...editingApplication,
      eliminatingRules: [...editingApplication.eliminatingRules, newRule]
    });
  };

  const updateEliminatingRule = (ruleId, updatedRule) => {
    if (!editingApplication) return;
    
    setEditingApplication({
      ...editingApplication,
      eliminatingRules: editingApplication.eliminatingRules.map(r => 
        r.id === ruleId ? { ...r, ...updatedRule } : r
      )
    });
  };

  const deleteEliminatingRule = (ruleId) => {
    if (!editingApplication) return;
    
    setEditingApplication({
      ...editingApplication,
      eliminatingRules: editingApplication.eliminatingRules.filter(r => r.id !== ruleId)
    });
  };

  // Question ordering functions
  const moveQuestionUp = (questionId) => {
    if (!editingApplication) return;
    
    const questions = [...editingApplication.customQuestions];
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex > 0) {
      [questions[currentIndex], questions[currentIndex - 1]] = [questions[currentIndex - 1], questions[currentIndex]];
      // Update order numbers
      questions.forEach((q, index) => {
        q.order = index + 1;
      });
      setEditingApplication({
        ...editingApplication,
        customQuestions: questions
      });
    }
  };

  const moveQuestionDown = (questionId) => {
    if (!editingApplication) return;
    
    const questions = [...editingApplication.customQuestions];
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex < questions.length - 1) {
      [questions[currentIndex], questions[currentIndex + 1]] = [questions[currentIndex + 1], questions[currentIndex]];
      // Update order numbers
      questions.forEach((q, index) => {
        q.order = index + 1;
      });
      setEditingApplication({
        ...editingApplication,
        customQuestions: questions
      });
    }
  };

  const toggleQuestionRequired = (questionId) => {
    if (!editingApplication) return;
    
    setEditingApplication({
      ...editingApplication,
      customQuestions: editingApplication.customQuestions.map(q => 
        q.id === questionId ? { ...q, required: !q.required } : q
      )
    });
  };

  const toggleQuestionActive = (questionId) => {
    if (!editingApplication) return;
    
    setEditingApplication({
      ...editingApplication,
      customQuestions: editingApplication.customQuestions.map(q => 
        q.id === questionId ? { ...q, active: !q.active } : q
      )
    });
  };

  // Drag and drop functions
  const handleDragStart = (e, questionId) => {
    e.dataTransfer.setData('text/plain', questionId);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetQuestionId) => {
    e.preventDefault();
    const draggedQuestionId = e.dataTransfer.getData('text/plain');
    
    if (draggedQuestionId === targetQuestionId) return;

    const questions = [...editingApplication.customQuestions];
    const draggedIndex = questions.findIndex(q => q.id === draggedQuestionId);
    const targetIndex = questions.findIndex(q => q.id === targetQuestionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged question and insert at target position
    const draggedQuestion = questions.splice(draggedIndex, 1)[0];
    questions.splice(targetIndex, 0, draggedQuestion);

    // Update order values
    const updatedQuestions = questions.map((question, index) => ({
      ...question,
      order: index
    }));

    setEditingApplication({
      ...editingApplication,
      customQuestions: updatedQuestions
    });
  };

  // Conditional logic function
  const shouldShowQuestion = (question, allQuestions) => {
    if (!question.condition) return true;
    
    const { dependsOn, showWhen } = question.condition;
    const dependentQuestion = allQuestions.find(q => q.id === dependsOn);
    
    if (!dependentQuestion) return true;
    
    // Get the current answer for the dependent question
    // For now, we'll assume we have access to answers through a form state
    // In a real implementation, you'd get this from form data
    const currentAnswer = dependentQuestion.currentAnswer || '';
    
    if (Array.isArray(showWhen)) {
      return showWhen.includes(currentAnswer);
    } else {
      return currentAnswer === showWhen;
    }
  };

  // Application management functions
  const getBandColor = (band) => {
    switch (band) {
      case 'perfect': return {
        backgroundColor: 'rgba(4, 120, 87, 0.1)',
        color: '#047857',
        borderColor: 'rgba(4, 120, 87, 0.2)'
      };
      case 'great': return {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10B981',
        borderColor: 'rgba(16, 185, 129, 0.2)'
      };
      case 'issues': return {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        color: '#F59E0B',
        borderColor: 'rgba(245, 158, 11, 0.2)'
      };
      case 'bad': return {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#EF4444',
        borderColor: 'rgba(239, 68, 68, 0.2)'
      };
      default: return {
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        borderColor: '#e5e7eb'
      };
    }
  };

  const getBandLabel = (band) => {
    switch (band) {
      case 'perfect': return 'Perfect match';
      case 'great': return 'Great match';
      case 'issues': return 'Possible issues';
      case 'bad': return 'Bad match';
      default: return 'Not evaluated';
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderGeneralSettings = () => (
    <div className="settings-grid">
      <div className="setting-group">
        <h3 className="setting-title">Company Information</h3>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input 
            type="text" 
            className="form-input" 
            defaultValue={generalSettings.companyName}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select className="form-input">
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date Format</label>
          <select className="form-input">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="setting-group">
        <h3 className="setting-title">System Preferences</h3>
        <div className="form-group">
          <label className="form-label">Default Currency</label>
          <select className="form-input">
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Language</label>
          <select className="form-input">
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Auto-save Interval</label>
          <select className="form-input">
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="0">Disabled</option>
          </select>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );

  const renderTeamManagement = () => (
    <div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="card-title">Team Members</h3>
              <p className="card-subtitle">Manage user access and permissions</p>
            </div>
            <button className="btn btn-primary">
              <User size={16} style={{ marginRight: '4px' }} />
              Add Member
            </button>
          </div>
        </div>
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="avatar">{member.name.split(' ').map(n => n[0]).join('')}</div>
                        {member.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{member.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        backgroundColor: member.role === 'Admin' ? '#fef2f2' : member.role === 'Manager' ? '#fef3c7' : '#f0fdf4',
                        color: member.role === 'Admin' ? '#dc2626' : member.role === 'Manager' ? '#d97706' : '#16a34a'
                      }}>
                        {member.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        backgroundColor: member.status === 'Active' ? '#f0fdf4' : '#f1f5f9',
                        color: member.status === 'Active' ? '#16a34a' : '#64748b'
                      }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm">Edit</button>
                        <button className="btn btn-secondary btn-sm">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Pipeline Stages</h3>
          <p className="card-subtitle">Configure your sales pipeline stages</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {workflowStages.map(stage => (
              <div key={stage.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                border: '1px solid #e2e8f0', 
                borderRadius: '6px',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: stage.color,
                  marginRight: '1rem'
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{stage.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Stage {stage.order}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm">Edit</button>
                  <button className="btn btn-secondary btn-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Add New Stage
          </button>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="settings-grid">
      {integrations.map((integration, index) => (
        <div key={index} className="setting-group">
          <h3 className="setting-title">{integration.name}</h3>
          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {integration.description}
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500',
              backgroundColor: integration.status === 'Connected' ? '#f0fdf4' : '#f1f5f9',
              color: integration.status === 'Connected' ? '#16a34a' : '#64748b'
            }}>
              {integration.status}
            </span>
          </div>
          <button className={`btn ${integration.status === 'Connected' ? 'btn-secondary' : 'btn-primary'}`}>
            {integration.status === 'Connected' ? 'Configure' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );

  const renderOwnerApplications = () => (
    <div>
      {/* Application Cards View */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              margin: 0, 
              color: '#374151' 
            }}>
              Application Forms ({applications.length})
            </h3>
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: '#64748b',
              fontSize: '0.875rem'
            }}>
              Create and manage application forms for property owners
            </p>
          </div>
          <button
            onClick={createNewApplication}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <Plus size={16} />
            Create Application
          </button>
        </div>

        {/* Application Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {applications.map(app => (
            <div key={app.id} style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              {/* Active Badge */}
              {app.isActive && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Active
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1e293b' 
                }}>
                  {app.name}
                </h4>
                <p style={{ 
                  margin: 0, 
                  color: '#64748b', 
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}>
                  {app.description}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                <span>{app.customQuestions.length} questions</span>
                <span>Updated {formatRelativeTime(app.updatedAt)}</span>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => editApplication(app)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleApplicationActive(app.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: app.isActive ? '#ef4444' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {app.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteApplication(app.id)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  title="Delete Application"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Applications View Toggle */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users size={16} />
            Submitted Applications
          </h3>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            View submitted applications from property owners
          </p>
        </div>
        <button
          onClick={() => setShowApplicationsView(!showApplicationsView)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: showApplicationsView ? '#3b82f6' : '#f8fafc',
            color: showApplicationsView ? 'white' : '#374151',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!showApplicationsView) {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }
          }}
          onMouseLeave={(e) => {
            if (!showApplicationsView) {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }
          }}
        >
          <Eye size={16} />
          {showApplicationsView ? 'Hide Submissions' : 'View Submissions'}
        </button>
      </div>

      {/* Submitted Applications View */}
      {showApplicationsView && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem' 
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              margin: 0, 
              color: '#374151' 
            }}>
              Submitted Applications ({submittedApplications.length})
            </h3>
          </div>

          {/* Applications Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.75rem 0', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Owner
                  </th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.75rem 0', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.75rem 0', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Match
                  </th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.75rem 0', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Submitted
                  </th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '0.75rem 0', 
                    fontWeight: '600', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {submittedApplications.map(app => (
                  <tr 
                    key={app.id}
                    style={{ 
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowQuestionModal(true);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem 0' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                          {app.ownerName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {app.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: app.status === 'completed' ? '#dcfce7' : '#fef3c7',
                        color: app.status === 'completed' ? '#166534' : '#92400e'
                      }}>
                        {app.status === 'completed' ? 'Completed' : 'Incomplete'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>
                      {app.matchBand && (
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          border: '1px solid',
                          ...getBandColor(app.matchBand)
                        }}>
                          {getBandLabel(app.matchBand)}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                        {app.submittedAt ? formatRelativeTime(app.submittedAt) : formatRelativeTime(app.lastActivityAt)}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(app);
                          setShowQuestionModal(true);
                        }}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'team': return renderTeamManagement();
      case 'workflows': return renderWorkflows();
      case 'owner-applications': return renderOwnerApplications();
      case 'integrations': return renderIntegrations();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Settings</h2>
          <p className="card-subtitle">Configure your CRM system preferences</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {settingsSections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`btn ${activeSection === section.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveSection(section.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
          {renderActiveSection()}
        </div>
      </div>

      {/* Application Editor Modal */}
      {showApplicationEditor && editingApplication && (
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
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '2rem 2rem 1rem 2rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  color: '#1e293b', 
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  {editingApplication.id.startsWith('app') && editingApplication.id.length > 3 ? 'Edit Application' : 'Create New Application'}
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: '#64748b',
                  fontSize: '0.875rem'
                }}>
                  Configure application form settings, questions, and rules
                </p>
              </div>
              <button
                onClick={() => {
                  setShowApplicationEditor(false);
                  setEditingApplication(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  color: '#64748b',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={{ flex: 1, padding: '2rem' }}>
              {/* Basic Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Application Name *
                    </label>
                    <input
                      type="text"
                      value={editingApplication.name}
                      onChange={(e) => setEditingApplication({ ...editingApplication, name: e.target.value })}
                      placeholder="Enter application name"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Description
                    </label>
                    <textarea
                      value={editingApplication.description}
                      onChange={(e) => setEditingApplication({ ...editingApplication, description: e.target.value })}
                      placeholder="Enter application description"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={editingApplication.isActive}
                        onChange={(e) => setEditingApplication({ ...editingApplication, isActive: e.target.checked })}
                        style={{ margin: 0 }}
                      />
                      Make this application active (only one can be active at a time)
                    </label>
                  </div>
                </div>
              </div>

              {/* Application Settings */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                  Application Settings
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={editingApplication.applicationSettings.autoEvaluate}
                        onChange={(e) => setEditingApplication({
                          ...editingApplication,
                          applicationSettings: {
                            ...editingApplication.applicationSettings,
                            autoEvaluate: e.target.checked
                          }
                        })}
                        style={{ margin: 0 }}
                      />
                      Auto-evaluate applications
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={editingApplication.applicationSettings.sendNotifications}
                        onChange={(e) => setEditingApplication({
                          ...editingApplication,
                          applicationSettings: {
                            ...editingApplication.applicationSettings,
                            sendNotifications: e.target.checked
                          }
                        })}
                        style={{ margin: 0 }}
                      />
                      Send email notifications
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={editingApplication.applicationSettings.requirePhoneVerification}
                        onChange={(e) => setEditingApplication({
                          ...editingApplication,
                          applicationSettings: {
                            ...editingApplication.applicationSettings,
                            requirePhoneVerification: e.target.checked
                          }
                        })}
                        style={{ margin: 0 }}
                      />
                      Require phone verification
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', minWidth: '200px' }}>
                      Max applications per day:
                    </label>
                    <input
                      type="number"
                      value={editingApplication.applicationSettings.maxApplicationsPerDay}
                      onChange={(e) => setEditingApplication({
                        ...editingApplication,
                        applicationSettings: {
                          ...editingApplication.applicationSettings,
                          maxApplicationsPerDay: parseInt(e.target.value) || 0
                        }
                      })}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        width: '100px'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', minWidth: '200px' }}>
                      Application timeout (minutes):
                    </label>
                    <input
                      type="number"
                      value={editingApplication.applicationSettings.applicationTimeout}
                      onChange={(e) => setEditingApplication({
                        ...editingApplication,
                        applicationSettings: {
                          ...editingApplication.applicationSettings,
                          applicationTimeout: parseInt(e.target.value) || 0
                        }
                      })}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        width: '100px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Questions */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1rem' 
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    margin: 0, 
                    color: '#1e293b' 
                  }}>
                    Custom Questions ({editingApplication.customQuestions.length} total)
                  </h3>
                  <button
                    onClick={addCustomQuestion}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {editingApplication.customQuestions
                    .sort((a, b) => a.order - b.order)
                    .filter(question => shouldShowQuestion(question, editingApplication.customQuestions))
                    .map((question, index) => (
                    <div 
                      key={question.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, question.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, question.id)}
                      style={{
                        padding: '1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: question.active ? '#f8fafc' : '#f3f4f6',
                        opacity: question.active ? 1 : 0.7,
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.cursor = 'grab';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      {/* Drag Handle */}
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        color: '#9ca3af',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        ⋮⋮ Drag to reorder
                      </div>

                      {/* Required Toggle at Top */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '1rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                            Question {index + 1}
                          </span>
                          {question.required && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              Required
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleQuestionRequired(question.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: question.required ? '#dc2626' : '#6b7280',
                            backgroundColor: question.required ? '#fef2f2' : '#f9fafb'
                          }}
                          title={question.required ? 'Required' : 'Optional'}
                        >
                          {question.required ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          {question.required ? 'Required' : 'Optional'}
                        </button>
                      </div>

                      {/* Question Content */}
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                            Question Label
                          </label>
                          <input
                            type="text"
                            value={question.label}
                            onChange={(e) => updateCustomQuestion(question.id, { label: e.target.value })}
                            placeholder="Enter your question here..."
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                              Question Type
                            </label>
                            <select
                              value={question.type}
                              onChange={(e) => updateCustomQuestion(question.id, { type: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                              }}
                            >
                              <option value="text">Text Field</option>
                              <option value="textarea">Text Area</option>
                              <option value="number">Number</option>
                              <option value="boolean">Yes/No</option>
                              <option value="select">Select</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                              Weight (%)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={Math.round(question.weight * 100)}
                              onChange={(e) => updateCustomQuestion(question.id, { weight: parseFloat(e.target.value) / 100 })}
                              placeholder="50"
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => toggleQuestionActive(question.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                backgroundColor: question.active ? '#10b981' : '#6b7280',
                                color: 'white'
                              }}
                              title={question.active ? 'Active' : 'Inactive'}
                            >
                              {question.active ? <CheckCircle size={16} /> : <X size={16} />}
                              {question.active ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => deleteCustomQuestion(question.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                backgroundColor: '#dc2626',
                                color: 'white'
                              }}
                              title="Delete Question"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>

                        {question.type === 'select' && (
                          <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                              Options (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={question.options.join(', ')}
                              onChange={(e) => updateCustomQuestion(question.id, { 
                                options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
                              })}
                              placeholder="Option 1, Option 2, Option 3"
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eliminating Rules */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1rem' 
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    margin: 0, 
                    color: '#1e293b' 
                  }}>
                    Eliminating Rules ({editingApplication.eliminatingRules.length})
                  </h3>
                  <button
                    onClick={addEliminatingRule}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <Plus size={16} />
                    Add Rule
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {editingApplication.eliminatingRules.map((rule, index) => (
                    <div key={rule.id} style={{
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2'
                    }}>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={rule.label}
                            onChange={(e) => updateEliminatingRule(rule.id, { label: e.target.value })}
                            placeholder="Rule description"
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}
                          />
                          <select
                            value={rule.field}
                            onChange={(e) => updateEliminatingRule(rule.id, { field: e.target.value })}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              minWidth: '150px'
                            }}
                          >
                            <option value="">Select Field</option>
                            <option value="distanceMinutesFromOffice">Distance from Office</option>
                            <option value="creditScore">Credit Score</option>
                            <option value="income">Income</option>
                            <option value="propertyCount">Property Count</option>
                          </select>
                          <select
                            value={rule.op}
                            onChange={(e) => updateEliminatingRule(rule.id, { op: e.target.value })}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              minWidth: '80px'
                            }}
                          >
                            <option value=">">Greater than</option>
                            <option value="<">Less than</option>
                            <option value=">=">Greater or equal</option>
                            <option value="<=">Less or equal</option>
                            <option value="==">Equal to</option>
                            <option value="!=">Not equal</option>
                          </select>
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => updateEliminatingRule(rule.id, { value: e.target.value })}
                            placeholder="Value"
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              width: '100px'
                            }}
                          />
                          <button
                            onClick={() => deleteEliminatingRule(rule.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.5rem',
                              borderRadius: '4px',
                              color: '#dc2626'
                            }}
                            title="Delete Rule"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 2rem 2rem 2rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  setShowApplicationEditor(false);
                  setEditingApplication(null);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f8fafc',
                  color: '#374151',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveApplication}
                disabled={!editingApplication.name.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: editingApplication.name.trim() ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: editingApplication.name.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Save size={16} />
                {editingApplication.id.startsWith('app') && editingApplication.id.length > 3 ? 'Update Application' : 'Create Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Management Modal */}
      {showQuestionModal && selectedApplication && (
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
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '2rem 2rem 1rem 2rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  color: '#1e293b', 
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  {selectedApplication.name} - Questions
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: '#64748b',
                  fontSize: '0.875rem'
                }}>
                  View application questions and settings
                </p>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  color: '#64748b',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={{ flex: 1, padding: '2rem' }}>
              {/* Application Info */}
              <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: '600' }}>
                  Application Details
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                  <strong>Name:</strong> {selectedApplication.name}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                  <strong>Description:</strong> {selectedApplication.description || 'No description'}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                  <strong>Status:</strong> {selectedApplication.isActive ? 'Active' : 'Inactive'}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                  <strong>Questions:</strong> {selectedApplication.customQuestions.length}
                </p>
                <p style={{ margin: '0', color: '#64748b', fontSize: '0.875rem' }}>
                  <strong>Last Updated:</strong> {formatRelativeTime(selectedApplication.updatedAt)}
                </p>
              </div>

              {/* Custom Questions */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  margin: '0 0 1rem 0', 
                  color: '#1e293b' 
                }}>
                  Custom Questions ({selectedApplication.customQuestions.length})
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {selectedApplication.customQuestions
                    .sort((a, b) => a.order - b.order)
                    .map((question, index) => (
                    <div key={question.id} style={{
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: question.active ? '#f8fafc' : '#f3f4f6',
                      opacity: question.active ? 1 : 0.7
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '0.875rem', fontWeight: '600' }}>
                            {question.label || 'Untitled Question'}
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                            <span>Type: {question.type}</span>
                            <span>Weight: {Math.round(question.weight * 100)}%</span>
                            <span>Required: {question.required ? 'Yes' : 'No'}</span>
                            <span>Active: {question.active ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {question.required && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              Required
                            </span>
                          )}
                          {question.active ? (
                            <CheckCircle size={16} color="#10b981" />
                          ) : (
                            <X size={16} color="#9ca3af" />
                          )}
                        </div>
                      </div>
                      {question.type === 'select' && question.options.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                            Options:
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {question.options.map((option, optIndex) => (
                              <span key={optIndex} style={{
                                padding: '0.125rem 0.5rem',
                                backgroundColor: '#e2e8f0',
                                color: '#374151',
                                borderRadius: '4px',
                                fontSize: '0.75rem'
                              }}>
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Eliminating Rules */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  margin: '0 0 1rem 0', 
                  color: '#1e293b' 
                }}>
                  Eliminating Rules ({selectedApplication.eliminatingRules.length})
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {selectedApplication.eliminatingRules.map((rule, index) => (
                    <div key={rule.id} style={{
                      padding: '1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '0.875rem', fontWeight: '600' }}>
                            {rule.label || 'Untitled Rule'}
                          </h4>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            <span style={{ fontWeight: '500' }}>{rule.field}</span> {rule.op} <span style={{ fontWeight: '500' }}>{rule.value}</span>
                          </div>
                        </div>
                        <div style={{ color: '#dc2626' }}>
                          <X size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 2rem 2rem 2rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowQuestionModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f8fafc',
                  color: '#374151',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  editApplication(selectedApplication);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <Settings size={16} />
                Edit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
