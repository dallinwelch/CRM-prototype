import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Data types and mock data
const mockCustomQuestions = [
  {
    id: 'q1',
    label: 'How many properties do you currently own?',
    type: 'number',
    weight: 0.3,
    options: []
  },
  {
    id: 'q2',
    label: 'Are you interested in full-service property management?',
    type: 'boolean',
    weight: 0.4,
    options: []
  },
  {
    id: 'q3',
    label: 'What type of properties do you own?',
    type: 'select',
    weight: 0.2,
    options: ['Single Family', 'Multi-Family', 'Commercial', 'Mixed']
  },
  {
    id: 'q4',
    label: 'Tell us about your property management experience',
    type: 'text',
    weight: 0.1,
    options: []
  }
];

const mockEliminatingRules = [
  {
    id: 'r1',
    label: 'More than 30 minutes from office disqualifies',
    field: 'distanceMinutesFromOffice',
    op: '>',
    value: 30,
    isDisqualifying: true
  }
];

const mockApplications = [
  {
    id: 'app1',
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
    matchBand: null,
    disqualifiedByRuleId: null
  },
  {
    id: 'app2',
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
    matchBand: null,
    disqualifiedByRuleId: null
  },
  {
    id: 'app3',
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
    id: 'app4',
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
    matchBand: null,
    disqualifiedByRuleId: null
  },
  {
    id: 'app5',
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
];

// Matching logic functions
const evaluateApplication = (app, settings) => {
  if (app.status !== 'completed') {
    return { band: null, disqualifiedByRuleId: null };
  }

  // Check eliminating rules first
  for (const rule of settings.eliminatingRules) {
    const fieldValue = app[rule.field];
    if (fieldValue !== undefined) {
      let isDisqualified = false;
      
      switch (rule.op) {
        case '>':
          isDisqualified = fieldValue > rule.value;
          break;
        case '>=':
          isDisqualified = fieldValue >= rule.value;
          break;
        case '<':
          isDisqualified = fieldValue < rule.value;
          break;
        case '<=':
          isDisqualified = fieldValue <= rule.value;
          break;
        case '==':
          isDisqualified = fieldValue === rule.value;
          break;
        case '!=':
          isDisqualified = fieldValue !== rule.value;
          break;
      }
      
      if (isDisqualified) {
        return { band: 'bad', disqualifiedByRuleId: rule.id };
      }
    }
  }

  // Calculate weighted fit index
  let totalWeight = 0;
  let weightedScore = 0;

  for (const question of settings.customQuestions) {
    const answer = app.answers[question.id];
    if (answer !== undefined) {
      let score = 0;
      
      switch (question.type) {
        case 'boolean':
          score = answer ? 1 : 0;
          break;
        case 'number':
          // Normalize to 0-1, assuming reasonable range
          score = Math.min(answer / 10, 1);
          break;
        case 'select':
        case 'text':
          score = answer && answer.toString().trim() ? 0.7 : 0;
          break;
      }
      
      weightedScore += score * question.weight;
      totalWeight += question.weight;
    }
  }

  const fitIndex = totalWeight > 0 ? weightedScore / totalWeight : 0;

  // Map to bands
  if (fitIndex >= 0.85) return { band: 'perfect', disqualifiedByRuleId: null };
  if (fitIndex >= 0.65) return { band: 'great', disqualifiedByRuleId: null };
  if (fitIndex >= 0.40) return { band: 'issues', disqualifiedByRuleId: null };
  return { band: 'bad', disqualifiedByRuleId: null };
};

const OwnersMarketingDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState('completed');
  const [showSettings, setShowSettings] = useState(false);
  const [applications, setApplications] = useState(mockApplications);
  const [customQuestions, setCustomQuestions] = useState(mockCustomQuestions);
  const [eliminatingRules, setEliminatingRules] = useState(mockEliminatingRules);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBands, setSelectedBands] = useState([]);
  const [showDisqualifiedOnly, setShowDisqualifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingRule, setEditingRule] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ label: '', type: 'text', weight: 0.5, options: [] });
  const [newRule, setNewRule] = useState({ label: '', field: '', op: '>', value: '', isDisqualifying: true });
  const [editingQuestionData, setEditingQuestionData] = useState({ label: '', type: 'text', weight: 0.5, options: [] });
  const [editingRuleData, setEditingRuleData] = useState({ label: '', field: '', op: '>', value: '', isDisqualifying: true });

  // Evaluate applications when settings change
  useEffect(() => {
    const settings = { customQuestions, eliminatingRules };
    setApplications(prevApps => 
      prevApps.map(app => {
        const evaluation = evaluateApplication(app, settings);
        return {
          ...app,
          matchBand: evaluation.band,
          disqualifiedByRuleId: evaluation.disqualifiedByRuleId
        };
      })
    );
  }, [customQuestions, eliminatingRules]);

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

  const getBandOrder = (band) => {
    switch (band) {
      case 'perfect': return 1;
      case 'great': return 2;
      case 'issues': return 3;
      case 'bad': return 4;
      default: return 5;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeSubTab === 'completed' && app.status !== 'completed') return false;
    if (activeSubTab === 'incomplete' && app.status !== 'partial') return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!app.ownerName.toLowerCase().includes(searchLower) &&
          !app.email.toLowerCase().includes(searchLower) &&
          !(app.phone && app.phone.includes(searchTerm))) {
        return false;
      }
    }
    
    if (activeSubTab === 'completed') {
      if (selectedBands.length > 0 && !selectedBands.includes(app.matchBand)) {
        return false;
      }
      
      if (showDisqualifiedOnly && app.matchBand !== 'bad') {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    if (activeSubTab === 'completed') {
      if (sortBy === 'matchBand') {
        const aOrder = getBandOrder(a.matchBand);
        const bOrder = getBandOrder(b.matchBand);
        return sortOrder === 'asc' ? aOrder - bOrder : bOrder - aOrder;
      } else if (sortBy === 'ownerName') {
        return sortOrder === 'asc' 
          ? a.ownerName.localeCompare(b.ownerName)
          : b.ownerName.localeCompare(a.ownerName);
      } else if (sortBy === 'submittedAt') {
        const aDate = new Date(a.submittedAt || 0);
        const bDate = new Date(b.submittedAt || 0);
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
    } else {
      if (sortBy === 'lastActivityAt') {
        const aDate = new Date(a.lastActivityAt);
        const bDate = new Date(b.lastActivityAt);
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      } else if (sortBy === 'ownerName') {
        return sortOrder === 'asc' 
          ? a.ownerName.localeCompare(b.ownerName)
          : b.ownerName.localeCompare(a.ownerName);
      }
    }
    return 0;
  });

  const handleApprove = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, meta: { ...app.meta, statusNote: 'approved' } } : app
    ));
    setShowDetailModal(false);
    // Show toast notification
    console.log('Application approved');
  };

  const handleDeny = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, meta: { ...app.meta, statusNote: 'denied' } } : app
    ));
    setShowDetailModal(false);
    // Show toast notification
    console.log('Application denied');
  };

  const handleMarkCompleted = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? {
        ...app,
        status: 'completed',
        phone: '(555) 000-0000', // Mock phone
        submittedAt: new Date().toISOString()
      } : app
    ));
    setShowDetailModal(false);
  };

  const toggleOutreach = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, outreachActive: !app.outreachActive } : app
    ));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const addQuestion = () => {
    if (newQuestion.label.trim()) {
      const question = {
        id: `q${Date.now()}`,
        ...newQuestion,
        options: newQuestion.type === 'select' ? newQuestion.options : []
      };
      setCustomQuestions([...customQuestions, question]);
      setNewQuestion({ label: '', type: 'text', weight: 0.5, options: [] });
    }
  };

  const startEditingQuestion = (question) => {
    setEditingQuestion(question.id);
    setEditingQuestionData({
      label: question.label,
      type: question.type,
      weight: question.weight,
      options: question.options || []
    });
  };

  const saveQuestionEdit = () => {
    if (editingQuestion && editingQuestionData.label.trim()) {
      setCustomQuestions(customQuestions.map(q => 
        q.id === editingQuestion ? { 
          ...q, 
          ...editingQuestionData,
          options: editingQuestionData.type === 'select' ? editingQuestionData.options : []
        } : q
      ));
      setEditingQuestion(null);
      setEditingQuestionData({ label: '', type: 'text', weight: 0.5, options: [] });
    }
  };

  const cancelQuestionEdit = () => {
    setEditingQuestion(null);
    setEditingQuestionData({ label: '', type: 'text', weight: 0.5, options: [] });
  };

  const deleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question? This will affect the matching algorithm.')) {
      setCustomQuestions(customQuestions.filter(q => q.id !== id));
    }
  };

  const addRule = () => {
    if (newRule.label.trim() && newRule.field.trim()) {
      const rule = {
        id: `r${Date.now()}`,
        ...newRule,
        value: newRule.field === 'distanceMinutesFromOffice' ? Number(newRule.value) : newRule.value
      };
      setEliminatingRules([...eliminatingRules, rule]);
      setNewRule({ label: '', field: '', op: '>', value: '', isDisqualifying: true });
    }
  };

  const startEditingRule = (rule) => {
    setEditingRule(rule.id);
    setEditingRuleData({
      label: rule.label,
      field: rule.field,
      op: rule.op,
      value: rule.value.toString(),
      isDisqualifying: rule.isDisqualifying
    });
  };

  const saveRuleEdit = () => {
    if (editingRule && editingRuleData.label.trim() && editingRuleData.field.trim()) {
      setEliminatingRules(eliminatingRules.map(r => 
        r.id === editingRule ? { 
          ...r, 
          ...editingRuleData,
          value: editingRuleData.field === 'distanceMinutesFromOffice' ? Number(editingRuleData.value) : editingRuleData.value
        } : r
      ));
      setEditingRule(null);
      setEditingRuleData({ label: '', field: '', op: '>', value: '', isDisqualifying: true });
    }
  };

  const cancelRuleEdit = () => {
    setEditingRule(null);
    setEditingRuleData({ label: '', field: '', op: '>', value: '', isDisqualifying: true });
  };

  const deleteRule = (id) => {
    if (window.confirm('Are you sure you want to delete this eliminating rule?')) {
      setEliminatingRules(eliminatingRules.filter(r => r.id !== id));
    }
  };

  return (
    <div className="owners-marketing-dashboard">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#1e293b' 
          }}>
            Marketing Dashboard
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: '#64748b',
            fontSize: '1rem'
          }}>
            Review and manage owner applications
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '6px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Open settings"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
          border: '1px solid #e2e8f0',
          borderBottom: 'none'
        }}>
          <button
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: '2px solid #10b981',
              color: '#10b981',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Owners
          </button>
          <button
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'not-allowed',
              color: '#9ca3af',
              fontSize: '0.875rem',
              opacity: 0.5
            }}
            title="Coming soon"
          >
            Leads
          </button>
          <button
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'not-allowed',
              color: '#9ca3af',
              fontSize: '0.875rem',
              opacity: 0.5
            }}
            title="Coming soon"
          >
            Tenants
          </button>
        </div>
      </div>

      {/* Owners Sub-tabs */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0 0 8px 8px',
        border: '1px solid #e2e8f0',
        borderTop: 'none'
      }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0',
          padding: '0 1.5rem'
        }}>
          <button
            onClick={() => setActiveSubTab('completed')}
            style={{
              padding: '1rem 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeSubTab === 'completed' ? '2px solid #10b981' : '2px solid transparent',
              color: activeSubTab === 'completed' ? '#10b981' : '#64748b',
              fontWeight: activeSubTab === 'completed' ? '600' : '500',
              fontSize: '0.875rem',
              marginRight: '2rem'
            }}
          >
            Completed Applications ({applications.filter(app => app.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveSubTab('incomplete')}
            style={{
              padding: '1rem 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeSubTab === 'incomplete' ? '2px solid #10b981' : '2px solid transparent',
              color: activeSubTab === 'incomplete' ? '#10b981' : '#64748b',
              fontWeight: activeSubTab === 'incomplete' ? '600' : '500',
              fontSize: '0.875rem'
            }}
          >
            Incomplete Applications ({applications.filter(app => app.status === 'partial').length})
          </button>
        </div>

        {/* Filters */}
        <div style={{ 
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search by owner name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          {activeSubTab === 'completed' && (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Bands:</span>
                {['perfect', 'great', 'issues', 'bad'].map(band => (
                  <button
                    key={band}
                    onClick={() => {
                      setSelectedBands(prev => 
                        prev.includes(band) 
                          ? prev.filter(b => b !== band)
                          : [...prev, band]
                      );
                    }}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      backgroundColor: selectedBands.includes(band) ? '#10b981' : 'white',
                      color: selectedBands.includes(band) ? 'white' : '#64748b'
                    }}
                  >
                    {getBandLabel(band)}
                  </button>
                ))}
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showDisqualifiedOnly}
                  onChange={(e) => setShowDisqualifiedOnly(e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Disqualified only</span>
              </label>
            </>
          )}
        </div>

        {/* Applications Table */}
        <div style={{ padding: '1.5rem' }}>
          {filteredApplications.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#64748b' 
            }}>
              <p>No {activeSubTab} applications found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '0.75rem 0', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('ownerName')}
                    >
                      Owner {sortBy === 'ownerName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    {activeSubTab === 'completed' ? (
                      <>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '0.75rem 0', 
                          fontWeight: '600', 
                          color: '#374151',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                        onClick={() => handleSort('submittedAt')}
                        >
                          Submitted {sortBy === 'submittedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '0.75rem 0', 
                          fontWeight: '600', 
                          color: '#374151',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                        onClick={() => handleSort('matchBand')}
                        >
                          Match {sortBy === 'matchBand' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '0.75rem 0', 
                          fontWeight: '600', 
                          color: '#374151',
                          fontSize: '0.875rem'
                        }}>
                          Phone
                        </th>
                      </>
                    ) : (
                      <>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '0.75rem 0', 
                          fontWeight: '600', 
                          color: '#374151',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                        onClick={() => handleSort('lastActivityAt')}
                        >
                          Last Activity {sortBy === 'lastActivityAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '0.75rem 0', 
                          fontWeight: '600', 
                          color: '#374151',
                          fontSize: '0.875rem'
                        }}>
                          Outreach
                        </th>
                      </>
                    )}
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
                  {filteredApplications.map(app => (
                    <tr 
                      key={app.id}
                      style={{ 
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowDetailModal(true);
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
                          {app.meta?.statusNote && (
                            <span style={{
                              display: 'inline-block',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: app.meta.statusNote === 'approved' ? '#dcfce7' : '#fef2f2',
                              color: app.meta.statusNote === 'approved' ? '#166534' : '#991b1b',
                              marginTop: '0.25rem'
                            }}>
                              {app.meta.statusNote}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {activeSubTab === 'completed' ? (
                        <>
                          <td style={{ padding: '0.75rem 0' }}>
                            <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                              {formatRelativeTime(app.submittedAt)}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0' }}>
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
                          </td>
                          <td style={{ padding: '0.75rem 0' }}>
                            {app.phone && (
                              <a 
                                href={`tel:${app.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: '#10b981',
                                  textDecoration: 'none',
                                  fontSize: '0.875rem'
                                }}
                              >
                                <Phone size={14} />
                                {app.phone}
                              </a>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '0.75rem 0' }}>
                            <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                              {formatRelativeTime(app.lastActivityAt)}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0' }}>
                            {app.outreachActive && (
                              <Bot size={16} color="#10b981" title="AI outreach active" />
                            )}
                          </td>
                        </>
                      )}
                      
                      <td style={{ padding: '0.75rem 0' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplication(app);
                            setShowDetailModal(true);
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
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
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
            minWidth: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#1e293b' }}>Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Manage custom questions, weights, and eliminating rules for owner applications.
              </p>
              
              <button
                onClick={() => {
                  // Recalculate bands for all completed applications
                  const settings = { customQuestions, eliminatingRules };
                  setApplications(prev => 
                    prev.map(app => {
                      const evaluation = evaluateApplication(app, settings);
                      return {
                        ...app,
                        matchBand: evaluation.band,
                        disqualifiedByRuleId: evaluation.disqualifiedByRuleId
                      };
                    })
                  );
                  setShowSettings(false);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginBottom: '2rem'
                }}
              >
                Recalculate Bands
              </button>

              {/* Custom Questions Section */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>Custom Questions</h3>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {customQuestions.length} questions
                  </span>
                </div>
                
                {/* Add New Question */}
                <div style={{ 
                  border: '2px dashed #cbd5e1', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  marginBottom: '1.5rem',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} />
                    Add New Question
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px auto', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Question Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., How many properties do you own?"
                        value={newQuestion.label}
                        onChange={(e) => setNewQuestion({...newQuestion, label: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Type
                      </label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="boolean">Yes/No</option>
                        <option value="number">Number</option>
                        <option value="select">Multiple Choice</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Weight
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="0.5"
                        value={newQuestion.weight}
                        onChange={(e) => setNewQuestion({...newQuestion, weight: parseFloat(e.target.value) || 0})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    <button
                      onClick={addQuestion}
                      disabled={!newQuestion.label.trim()}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: newQuestion.label.trim() ? '#10b981' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: newQuestion.label.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </div>

                {/* Existing Questions */}
                {customQuestions.map(question => (
                  <div key={question.id} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}>
                    {editingQuestion === question.id ? (
                      // Edit Mode
                      <div>
                        <h4 style={{ marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Edit size={16} />
                          Edit Question
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                              Question Label
                            </label>
                            <input
                              type="text"
                              value={editingQuestionData.label}
                              onChange={(e) => setEditingQuestionData({...editingQuestionData, label: e.target.value})}
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
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                              Type
                            </label>
                            <select
                              value={editingQuestionData.type}
                              onChange={(e) => setEditingQuestionData({...editingQuestionData, type: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                backgroundColor: 'white'
                              }}
                            >
                              <option value="text">Text</option>
                              <option value="boolean">Yes/No</option>
                              <option value="number">Number</option>
                              <option value="select">Multiple Choice</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                              Weight
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="1"
                              step="0.1"
                              value={editingQuestionData.weight}
                              onChange={(e) => setEditingQuestionData({...editingQuestionData, weight: parseFloat(e.target.value) || 0})}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={cancelQuestionEdit}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveQuestionEdit}
                            disabled={!editingQuestionData.label.trim()}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: editingQuestionData.label.trim() ? '#10b981' : '#9ca3af',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: editingQuestionData.label.trim() ? 'pointer' : 'not-allowed',
                              fontSize: '0.875rem'
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937', fontSize: '1rem' }}>
                            {question.label}
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                            <span style={{ 
                              padding: '0.25rem 0.5rem', 
                              backgroundColor: '#f1f5f9', 
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}>
                              {question.type}
                            </span>
                            <span style={{ 
                              padding: '0.25rem 0.5rem', 
                              backgroundColor: '#dbeafe', 
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}>
                              Weight: {question.weight}
                            </span>
                            {question.options.length > 0 && (
                              <span style={{ 
                                padding: '0.25rem 0.5rem', 
                                backgroundColor: '#fef3c7', 
                                borderRadius: '4px',
                                fontWeight: '500'
                              }}>
                                {question.options.length} options
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEditingQuestion(question)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Eliminating Rules Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>Eliminating Rules</h3>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {eliminatingRules.length} rules
                  </span>
                </div>
                
                {/* Add New Rule */}
                <div style={{ 
                  border: '2px dashed #cbd5e1', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  marginBottom: '1.5rem',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} />
                    Add New Rule
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px auto', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Rule Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Too far from office"
                        value={newRule.label}
                        onChange={(e) => setNewRule({...newRule, label: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Field
                      </label>
                      <select
                        value={newRule.field}
                        onChange={(e) => setNewRule({...newRule, field: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Select field</option>
                        <option value="distanceMinutesFromOffice">Distance from office</option>
                        <option value="q1">Number of properties</option>
                        <option value="q2">Full service interest</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Operator
                      </label>
                      <select
                        value={newRule.op}
                        onChange={(e) => setNewRule({...newRule, op: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value=">">Greater than</option>
                        <option value=">=">Greater than or equal</option>
                        <option value="<">Less than</option>
                        <option value="<=">Less than or equal</option>
                        <option value="==">Equal to</option>
                        <option value="!=">Not equal to</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        Value
                      </label>
                      <input
                        type="text"
                        placeholder="30"
                        value={newRule.value}
                        onChange={(e) => setNewRule({...newRule, value: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    <button
                      onClick={addRule}
                      disabled={!newRule.label.trim() || !newRule.field.trim()}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: (newRule.label.trim() && newRule.field.trim()) ? '#10b981' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: (newRule.label.trim() && newRule.field.trim()) ? 'pointer' : 'not-allowed',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </div>

                {/* Existing Rules */}
                {eliminatingRules.map(rule => (
                  <div key={rule.id} style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                        {rule.label}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {rule.field} {rule.op} {rule.value}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setEditingRule(rule)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
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
            maxWidth: '800px',
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
                  {selectedApplication.ownerName}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: selectedApplication.status === 'completed' ? '#dcfce7' : '#fef3c7',
                    color: selectedApplication.status === 'completed' ? '#166534' : '#92400e'
                  }}>
                    {selectedApplication.status === 'completed' ? 'Completed' : 'Incomplete'}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    {selectedApplication.leadSource}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Owner Information */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                    Owner Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Name
                      </label>
                      <div style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                        {selectedApplication.ownerName}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email
                      </label>
                      <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                        {selectedApplication.email}
                      </div>
                    </div>
                    {selectedApplication.phone && (
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Phone
                        </label>
                        <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                          {selectedApplication.phone}
                        </div>
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Lead Source
                      </label>
                      <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                        {selectedApplication.leadSource}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Assessment */}
                {selectedApplication.status === 'completed' && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                      Match Assessment
                    </h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: '2px solid',
                        ...getBandColor(selectedApplication.matchBand)
                      }}>
                        {getBandLabel(selectedApplication.matchBand)}
                      </span>
                    </div>
                    {selectedApplication.disqualifiedByRuleId && (
                      <div style={{ 
                        padding: '1rem',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#dc2626'
                      }}>
                        <strong>Disqualified by:</strong> {eliminatingRules.find(r => r.id === selectedApplication.disqualifiedByRuleId)?.label}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Application Answers */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                  Application Answers
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {customQuestions.map(question => (
                    <div key={question.id} style={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        {question.label}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280',
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #f3f4f6'
                      }}>
                        {selectedApplication.answers[question.id] !== undefined 
                          ? selectedApplication.answers[question.id].toString()
                          : 'Not answered'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outreach Management for Partial Applications */}
              {selectedApplication.status === 'partial' && (
                <div style={{ 
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#92400e', fontSize: '1.125rem', fontWeight: '600' }}>
                    Outreach Management
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedApplication.outreachActive}
                      onChange={() => toggleOutreach(selectedApplication.id)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '500' }}>
                      AI outreach active
                    </span>
                  </div>
                  <button
                    onClick={() => handleMarkCompleted(selectedApplication.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}

              {/* Action Buttons for Completed Applications */}
              {selectedApplication.status === 'completed' && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleApprove(selectedApplication.id)}
                    style={{
                      flex: 1,
                      padding: '1rem 2rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                  >
                    <CheckCircle2 size={20} />
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleDeny(selectedApplication.id)}
                    style={{
                      flex: 1,
                      padding: '1rem 2rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                  >
                    <XCircle size={20} />
                    Deny Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersMarketingDashboard;
