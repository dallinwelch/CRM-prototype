import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Archive,
  Plus,
  Filter,
  Search,
  UserPlus,
  TrendingUp,
  AlertCircle,
  User,
  Home,
  Settings,
  FileText,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  X,
  UserCheck
} from 'lucide-react';
import { mockTasks, mockOnboardingForm, timeSeriesFunnelData } from '../mockData';
import TasksWidget from './TasksWidget';

const OwnerLeadsDashboard = ({ leads, onNavigateToList, onNavigateToLead, onCreateLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    partial: false,
    qualified: false,
    approved: false
  });
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');
  const [timePeriod, setTimePeriod] = useState('month'); // 'day', 'week', 'month', 'year', 'all'
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter leads by source
  const filteredLeads = selectedLeadSource === 'all' 
    ? leads 
    : leads.filter(l => l.leadSource === selectedLeadSource);

  // Calculate stats - exclude archived and completed (converted to owners)
  const stats = {
    total: filteredLeads.filter(l => l.status !== 'archived' && l.status !== 'completed').length,
    lead: filteredLeads.filter(l => l.status === 'lead').length,
    application: filteredLeads.filter(l => l.status === 'application').length,
    awaitingApproval: filteredLeads.filter(l => l.status === 'awaiting approval').length,
    onboarding: filteredLeads.filter(l => l.onboardingStatus === 'in_progress').length
  };

  // Calculate funnel metrics
  const funnelData = {
    leads: {
      total: filteredLeads.filter(l => 
        (l.status === 'lead' || l.status === 'application') && 
        l.status !== 'archived'
      ).length,
      application: filteredLeads.filter(l => l.status === 'application').length,
      lead: filteredLeads.filter(l => l.status === 'lead').length
    },
    awaitingApproval: filteredLeads.filter(l => l.status === 'awaiting approval').length,
    onboarded: filteredLeads.filter(l => 
      l.onboardingStatus === 'in_progress' && 
      l.onboardingCompletion === 100
    ).length
  };

  // Get all unique lead sources
  const leadSources = ['all', ...new Set(leads.map(l => l.leadSource).filter(Boolean))].sort();

  // Calculate conversion rates
  const conversionRate = funnelData.leads.total > 0 
    ? ((funnelData.awaitingApproval / funnelData.leads.total) * 100).toFixed(1)
    : 0;
  const onboardingRate = funnelData.awaitingApproval > 0 
    ? ((funnelData.onboarded / funnelData.awaitingApproval) * 100).toFixed(1)
    : 0;

  // Filter time-series data based on selected period
  const getFilteredTimeSeriesData = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timePeriod) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return timeSeriesFunnelData.filter(d => new Date(d.date) >= startDate);
  };

  const filteredTimeSeriesData = getFilteredTimeSeriesData();

  // Get recent leads by stage (using filtered leads)
  const getLeadsByStage = (status) => {
    return filteredLeads
      .filter(l => l.status === status)
      .slice(0, 5);
  };

  const leadStatusLeads = getLeadsByStage('lead');
  const applicationLeads = getLeadsByStage('application');
  const awaitingApprovalLeads = getLeadsByStage('awaiting approval');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const StatsCard = ({ title, value, icon: Icon, color, trend, onClick }) => (
    <div 
      className="stats-card" 
      style={{ borderLeftColor: color, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={24} />
        </div>
        <div className="stats-card-info">
          <div className="stats-card-title">{title}</div>
          <div className="stats-card-value">{value}</div>
        </div>
      </div>
      {trend && (
        <div className="stats-card-trend" style={{ color }}>
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  const LeadCard = ({ lead, onClick }) => (
    <div className="lead-card" onClick={() => onClick(lead.id)}>
      <div className="lead-card-header">
        <div className="lead-card-avatar">
          {lead.firstName[0]}{lead.lastName[0]}
        </div>
        <div className="lead-card-info">
          <div className="lead-card-name">{lead.firstName} {lead.lastName}</div>
          <div className="lead-card-contact">{lead.email}</div>
        </div>
      </div>
      <div className="lead-card-details">
        {lead.completionPercentage < 100 && (
          <div className="lead-card-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${lead.completionPercentage}%` }}
              />
            </div>
            <span className="progress-text">{lead.completionPercentage}% complete</span>
          </div>
        )}
        <div className="lead-card-meta">
          <span className="meta-item">
            <Clock size={14} />
            {formatDate(lead.createdAt)}
          </span>
          {lead.assignedTo && (
            <span className="meta-item">
              <Users size={14} />
              {lead.assignedTo}
            </span>
          )}
          {lead.properties.length > 0 && (
            <span className="meta-item">
              {lead.properties.length} {lead.properties.length === 1 ? 'property' : 'properties'}
            </span>
          )}
          {(lead.noteCount > 0 || lead.notes) && (
            <span className="meta-item note-indicator">
              <MessageSquare size={14} />
              <span className="note-badge">{lead.noteCount || 1}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Helper to determine onboarding stage based on completion percentage
  const getOnboardingStage = (completion) => {
    if (completion < 25) return { stage: 0, name: 'Owner Information', icon: User };
    if (completion < 50) return { stage: 1, name: 'Property Information', icon: Home };
    if (completion < 75) return { stage: 2, name: 'Management Preferences', icon: Settings };
    return { stage: 3, name: 'Documents & Signatures', icon: FileText };
  };

  // Helper to get missing required fields for a lead in onboarding
  const getMissingFields = (lead) => {
    const missingFields = [];
    const currentStageInfo = getOnboardingStage(lead.onboardingCompletion || 0);
    
    // Mock missing fields based on completion percentage - in real app, check actual form data
    if (currentStageInfo.stage === 0) {
      if ((lead.onboardingCompletion || 0) < 15) {
        missingFields.push('Legal Entity Name', 'Tax ID / EIN');
      } else if ((lead.onboardingCompletion || 0) < 25) {
        missingFields.push('Mailing Address');
      }
    } else if (currentStageInfo.stage === 1) {
      if ((lead.onboardingCompletion || 0) < 35) {
        missingFields.push('Property Address', 'Bedrooms/Bathrooms');
      } else if ((lead.onboardingCompletion || 0) < 50) {
        missingFields.push('Pets Allowed', 'Minimum Rent Price');
      }
    } else if (currentStageInfo.stage === 2) {
      if ((lead.onboardingCompletion || 0) < 60) {
        missingFields.push('Preferred Lease Length');
      } else if ((lead.onboardingCompletion || 0) < 75) {
        missingFields.push('Maintenance Approval Limit');
      }
    } else if (currentStageInfo.stage === 3) {
      if ((lead.onboardingCompletion || 0) < 85) {
        missingFields.push('Property Management Agreement', 'W9 Tax Form');
      } else if ((lead.onboardingCompletion || 0) < 100) {
        missingFields.push('Electronic Signature');
      }
    }
    
    return missingFields;
  };

  const OnboardingStatusCard = ({ lead, onClick }) => {
    const stageInfo = getOnboardingStage(lead.onboardingCompletion || 0);
    const missingFields = getMissingFields(lead);
    const StageIcon = stageInfo.icon;
    
    return (
      <div className="onboarding-status-card" onClick={() => onClick(lead.id)}>
        <div className="onboarding-status-header">
          <div className="lead-card-avatar">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div className="onboarding-status-info">
            <div className="lead-card-name">{lead.firstName} {lead.lastName}</div>
            <div className="onboarding-progress-mini">
              <div className="progress-bar-sm">
                <div 
                  className="progress-fill" 
                  style={{ width: `${lead.onboardingCompletion || 0}%` }}
                />
              </div>
              <span className="progress-text-sm">{lead.onboardingCompletion || 0}% complete</span>
            </div>
          </div>
        </div>

        {/* Stage Progress Indicators */}
        <div className="onboarding-stages">
          {mockOnboardingForm.sections.map((section, index) => {
            const sectionIcon = index === 0 ? User : index === 1 ? Home : index === 2 ? Settings : FileText;
            const SectionIcon = sectionIcon;
            const isCompleted = stageInfo.stage > index;
            const isCurrent = stageInfo.stage === index;
            
            return (
              <div 
                key={section.id}
                className={`stage-indicator ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                title={section.title}
              >
                <div className="stage-indicator-icon">
                  {isCompleted ? (
                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                  ) : isCurrent ? (
                    <Clock size={16} style={{ color: '#f59e0b' }} />
                  ) : (
                    <SectionIcon size={16} style={{ color: '#cbd5e1' }} />
                  )}
                </div>
                <div className="stage-indicator-label">{section.title.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>

        {/* Current Stage & Missing Info */}
        <div className="onboarding-current-stage">
          <div className="current-stage-badge">
            <StageIcon size={14} />
            <span>Current: {stageInfo.name}</span>
          </div>
          {missingFields.length > 0 && (
            <div className="missing-fields-badge">
              <AlertCircle size={14} style={{ color: '#ef4444' }} />
              <span>{missingFields.length} field{missingFields.length !== 1 ? 's' : ''} needed</span>
            </div>
          )}
        </div>

        {/* Missing Fields List */}
        {missingFields.length > 0 && (
          <div className="missing-fields-list">
            <div className="missing-fields-title">
              <AlertCircle size={16} />
              Action Required: {missingFields.length} Missing Field{missingFields.length !== 1 ? 's' : ''}
            </div>
            <ul className="missing-fields-items">
              {missingFields.map((field, index) => (
                <li key={index}>
                  <AlertCircle size={12} />
                  {field}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--danger)', fontWeight: '500' }}>
              ⚠️ Owner must complete these fields before approval
            </div>
          </div>
        )}

        <div className="lead-card-meta" style={{ marginTop: '0.75rem' }}>
          <span className="meta-item">
            <Clock size={14} />
            {formatDate(lead.updatedAt)}
          </span>
          {lead.assignedTo && (
            <span className="meta-item">
              <Users size={14} />
              {lead.assignedTo}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="owner-leads-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Owner Leads</h1>
          <p className="dashboard-subtitle">Manage and track your owner lead pipeline</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary" onClick={onCreateLead}>
            <UserPlus size={18} />
            New Lead
          </button>
        </div>
      </div>


      {/* Time Series Line Graph - Pipeline Trends Over Time */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          {/* Header */}
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
            Pipeline Trends Over Time
          </h3>
          
          {/* Time Period & Lead Source Filters - Side by Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Time Period Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' }}>Period:</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['day', 'week', 'month', 'year', 'all'].map(period => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      border: timePeriod === period ? '2px solid #3b82f6' : '1px solid #d1d5db',
                      backgroundColor: timePeriod === period ? '#dbeafe' : 'white',
                      color: timePeriod === period ? '#1e40af' : '#64748b',
                      fontSize: '0.8125rem',
                      fontWeight: timePeriod === period ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize'
                    }}
                  >
                    {period === 'all' ? 'All Time' : `1 ${period.charAt(0).toUpperCase() + period.slice(1)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Lead Source Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' }}>Source:</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {leadSources.map(source => (
                  <button
                    key={`graph-${source}`}
                    onClick={() => setSelectedLeadSource(source)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      border: selectedLeadSource === source ? '2px solid #10b981' : '1px solid #d1d5db',
                      backgroundColor: selectedLeadSource === source ? '#d1fae5' : 'white',
                      color: selectedLeadSource === source ? '#047857' : '#64748b',
                      fontSize: '0.8125rem',
                      fontWeight: selectedLeadSource === source ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedLeadSource !== source) {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.backgroundColor = '#f0fdf4';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLeadSource !== source) {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {source === 'all' ? 'All Sources' : source}
                  </button>
                ))}
              </div>
              {selectedLeadSource !== 'all' && (
                <button
                  onClick={() => setSelectedLeadSource('all')}
                  style={{
                    padding: '0.375rem 0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Line Graph */}
        {(() => {
          // Helper function to aggregate data based on time period
          const aggregateData = (data) => {
            if (data.length === 0) return [];
            
            const grouped = {};
            
            data.forEach(d => {
              const date = new Date(d.date);
              let key;
              
              switch (timePeriod) {
                case 'day':
                  // Group by hour
                  key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
                  break;
                case 'week':
                  // Group by day
                  key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  break;
                case 'month':
                  // Group by week
                  const weekStart = new Date(date);
                  weekStart.setDate(date.getDate() - date.getDay());
                  key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
                  break;
                case 'year':
                  // Group by month
                  key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  break;
                case 'all':
                  // Group by year
                  key = `${date.getFullYear()}`;
                  break;
                default:
                  key = d.date;
              }
              
              if (!grouped[key]) {
                grouped[key] = { date: key, leads: 0, applications: 0, onboarded: 0, count: 0 };
              }
              grouped[key].leads += d.leads;
              grouped[key].applications += d.applications;
              grouped[key].onboarded += d.onboarded;
              grouped[key].count += 1;
            });
            
            // Convert to array and sort by date
            return Object.values(grouped)
              .map(g => ({
                date: g.date,
                leads: g.leads,
                applications: g.applications,
                onboarded: g.onboarded
              }))
              .sort((a, b) => a.date.localeCompare(b.date));
          };

          // Aggregate data by date and metric for the selected source
          const rawAllSourceData = filteredTimeSeriesData.filter(d => d.source === 'all');
          const rawSpecificSourceData = selectedLeadSource !== 'all' 
            ? filteredTimeSeriesData.filter(d => d.source === selectedLeadSource)
            : [];

          const allSourceData = aggregateData(rawAllSourceData);
          const specificSourceData = aggregateData(rawSpecificSourceData);

          // Find min/max values for scaling - scale based on what's being displayed
          let allValues;
          if (selectedLeadSource !== 'all' && specificSourceData.length > 0) {
            // When a specific source is selected, scale to that source's data for better visibility
            allValues = specificSourceData.flatMap(d => [d.leads, d.applications, d.onboarded]);
          } else {
            // When showing all sources, scale to all data
            allValues = allSourceData.flatMap(d => [d.leads, d.applications, d.onboarded]);
          }
          const maxValue = Math.max(...allValues, 1);
          const minValue = 0; // Always start from 0 for better visualization

          // Graph dimensions
          const width = 1000;
          const height = 320;
          const padding = { top: 30, right: 120, bottom: 50, left: 60 };
          const graphWidth = width - padding.left - padding.right;
          const graphHeight = height - padding.top - padding.bottom;

          // Create scale functions
          const xScale = (index, dataLength) => {
            if (dataLength === 1) return padding.left + graphWidth / 2;
            return padding.left + (index / (dataLength - 1)) * graphWidth;
          };
          const yScale = (value) => {
            const range = maxValue - minValue;
            const scaledValue = range === 0 ? 0.5 : (value - minValue) / range;
            return padding.top + graphHeight - (scaledValue * graphHeight);
          };

          // Generate smooth curve path with area fill
          const generateSmoothPath = (data, metric) => {
            if (data.length === 0) return '';
            if (data.length === 1) {
              const x = xScale(0, 1);
              const y = yScale(data[0][metric]);
              return `M ${x} ${y}`;
            }
            
            // Create smooth bezier curve
            let path = '';
            for (let i = 0; i < data.length; i++) {
              const x = xScale(i, data.length);
              const y = yScale(data[i][metric]);
              
              if (i === 0) {
                path = `M ${x} ${y}`;
              } else {
                const prevX = xScale(i - 1, data.length);
                const prevY = yScale(data[i - 1][metric]);
                const cpX1 = prevX + (x - prevX) * 0.5;
                const cpX2 = x - (x - prevX) * 0.5;
                path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
              }
            }
            return path;
          };

          // Generate area path (curve + bottom line)
          const generateAreaPath = (data, metric) => {
            const curvePath = generateSmoothPath(data, metric);
            if (data.length === 0) return '';
            
            const lastX = xScale(data.length - 1, data.length);
            const firstX = xScale(0, data.length);
            const bottomY = yScale(0);
            
            return `${curvePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
          };

          // Format date label based on time period (for axis labels)
          const formatDateLabel = (dateStr) => {
            if (timePeriod === 'day') {
              // Show hour
              const parts = dateStr.split(' ');
              return parts[1] || dateStr;
            } else if (timePeriod === 'week') {
              // Show day (Mon, Tue, etc)
              const date = new Date(dateStr);
              return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            } else if (timePeriod === 'month') {
              // Show week number or date
              const date = new Date(dateStr);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            } else if (timePeriod === 'year') {
              // Show month
              const parts = dateStr.split('-');
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return months[parseInt(parts[1]) - 1] || dateStr;
            } else {
              // Show year
              return dateStr;
            }
          };

          // Format date label for tooltip (more detailed)
          const formatTooltipDateLabel = (dateStr) => {
            if (timePeriod === 'day') {
              // Show full date and hour
              const parts = dateStr.split(' ');
              const date = new Date(parts[0]);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${parts[1]}`;
            } else if (timePeriod === 'week') {
              // Show full date
              const date = new Date(dateStr);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            } else if (timePeriod === 'month') {
              // Show week starting date
              const date = new Date(dateStr);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `Week of ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            } else if (timePeriod === 'year') {
              // Show month and year
              const parts = dateStr.split('-');
              const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
            } else {
              // Show year only
              return dateStr;
            }
          };

          // Calculate date labels - show more labels for better readability
          const getDateLabels = () => {
            if (allSourceData.length === 0) return [];
            const numLabels = Math.min(7, allSourceData.length);
            const step = Math.max(1, Math.floor(allSourceData.length / (numLabels - 1)));
            const labels = [];
            
            for (let i = 0; i < allSourceData.length; i += step) {
              if (labels.length >= numLabels - 1) break;
              labels.push({ index: i, label: formatDateLabel(allSourceData[i].date) });
            }
            
            // Always include last point
            if (labels[labels.length - 1]?.index !== allSourceData.length - 1) {
              labels.push({ 
                index: allSourceData.length - 1, 
                label: formatDateLabel(allSourceData[allSourceData.length - 1].date) 
              });
            }
            
            return labels;
          };

          const dateLabels = getDateLabels();

          return (
            <div style={{ position: 'relative' }}>
              {/* Custom Tooltip */}
              {hoveredDataPoint && (
                <div style={{
                  position: 'absolute',
                  left: `${hoveredDataPoint.x}px`,
                  top: `${hoveredDataPoint.y - 10}px`,
                  transform: 'translate(-50%, -100%)',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  pointerEvents: 'none',
                  zIndex: 1000,
                  minWidth: '200px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                    {hoveredDataPoint.dateLabel}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Leads</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#10b981' }}>{hoveredDataPoint.data.leads}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Applications</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#f59e0b' }}>{hoveredDataPoint.data.applications}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Onboarded</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#3b82f6' }}>{hoveredDataPoint.data.onboarded}</span>
                    </div>
                  </div>
                  {hoveredDataPoint.source !== 'all' && (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      paddingTop: '0.5rem', 
                      borderTop: '1px solid #e5e7eb',
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Source: {hoveredDataPoint.source}
                    </div>
                  )}
                  <div style={{ 
                    marginTop: '0.5rem', 
                    paddingTop: '0.5rem', 
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#6b7280' }}>
                      <span>Lead → App Rate:</span>
                      <span style={{ fontWeight: '600' }}>
                        {hoveredDataPoint.data.leads > 0 ? ((hoveredDataPoint.data.applications / hoveredDataPoint.data.leads) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#6b7280' }}>
                      <span>App → Onboard Rate:</span>
                      <span style={{ fontWeight: '600' }}>
                        {hoveredDataPoint.data.applications > 0 ? ((hoveredDataPoint.data.onboarded / hoveredDataPoint.data.applications) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div id="pipeline-graph-scroll" style={{ overflowX: 'auto', backgroundColor: '#fafbfc', padding: '1rem', borderRadius: '8px' }}>
                <svg id="pipeline-graph-container" width={width} height={height} style={{ display: 'block', minWidth: '800px' }}>
                <defs>
                  {/* Gradient definitions for area fills */}
                  <linearGradient id="leadsAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.02 }} />
                  </linearGradient>
                  <linearGradient id="applicationsAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.02 }} />
                  </linearGradient>
                  <linearGradient id="onboardedAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.02 }} />
                  </linearGradient>
                  
                  {/* Gradients for specific source (dashed) */}
                  <linearGradient id="leadsSpecificGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.15 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.01 }} />
                  </linearGradient>
                  <linearGradient id="applicationsSpecificGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 0.15 }} />
                    <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.01 }} />
                  </linearGradient>
                  <linearGradient id="onboardedSpecificGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.15 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.01 }} />
                  </linearGradient>
                </defs>

                {/* Background */}
                <rect x={padding.left} y={padding.top} width={graphWidth} height={graphHeight} fill="white" />

                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
                  const value = minValue + (maxValue - minValue) * percent;
                  const y = yScale(value);
                  return (
                    <line
                      key={percent}
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + graphWidth}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
                  const value = minValue + (maxValue - minValue) * percent;
                  const y = yScale(value);
                  return (
                    <text
                      key={`y-label-${percent}`}
                      x={padding.left - 15}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#9ca3af"
                      fontWeight="500"
                    >
                      {Math.round(value)}
                    </text>
                  );
                })}

                {/* X-axis labels */}
                {dateLabels.map(({ index, label }) => (
                  <text
                    key={`x-label-${index}`}
                    x={xScale(index, allSourceData.length)}
                    y={height - 15}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#9ca3af"
                    fontWeight="500"
                  >
                    {label}
                  </text>
                ))}

                {/* Area fills and lines for "all" source */}
                {selectedLeadSource === 'all' && (
                  <>
                    {/* Onboarded (bottom layer) */}
                    <path
                      d={generateAreaPath(allSourceData, 'onboarded')}
                      fill="url(#onboardedAreaGradient)"
                    />
                    <path
                      d={generateSmoothPath(allSourceData, 'onboarded')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Applications (middle layer) */}
                    <path
                      d={generateAreaPath(allSourceData, 'applications')}
                      fill="url(#applicationsAreaGradient)"
                    />
                    <path
                      d={generateSmoothPath(allSourceData, 'applications')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Leads (top layer) */}
                    <path
                      d={generateAreaPath(allSourceData, 'leads')}
                      fill="url(#leadsAreaGradient)"
                    />
                    <path
                      d={generateSmoothPath(allSourceData, 'leads')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Dimmed "all" source when specific source is selected */}
                {selectedLeadSource !== 'all' && (
                  <>
                    <path
                      d={generateSmoothPath(allSourceData, 'onboarded')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.25"
                    />
                    <path
                      d={generateSmoothPath(allSourceData, 'applications')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.25"
                    />
                    <path
                      d={generateSmoothPath(allSourceData, 'leads')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.25"
                    />
                  </>
                )}

                {/* Area fills and lines for specific source */}
                {selectedLeadSource !== 'all' && specificSourceData.length > 0 && (
                  <>
                    {/* Onboarded */}
                    <path
                      d={generateAreaPath(specificSourceData, 'onboarded')}
                      fill="url(#onboardedSpecificGradient)"
                    />
                    <path
                      d={generateSmoothPath(specificSourceData, 'onboarded')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6,4"
                    />
                    
                    {/* Applications */}
                    <path
                      d={generateAreaPath(specificSourceData, 'applications')}
                      fill="url(#applicationsSpecificGradient)"
                    />
                    <path
                      d={generateSmoothPath(specificSourceData, 'applications')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6,4"
                    />
                    
                    {/* Leads */}
                    <path
                      d={generateAreaPath(specificSourceData, 'leads')}
                      fill="url(#leadsSpecificGradient)"
                    />
                    <path
                      d={generateSmoothPath(specificSourceData, 'leads')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6,4"
                    />
                  </>
                )}

                {/* Interactive hover areas for all source */}
                {allSourceData.map((d, i) => {
                  const x = xScale(i, allSourceData.length);
                  const containerRect = document.querySelector('#pipeline-graph-container')?.getBoundingClientRect();
                  const scrollLeft = document.querySelector('#pipeline-graph-scroll')?.scrollLeft || 0;
                  
                  return (
                    <g key={`point-all-${i}`}>
                      {/* Invisible hover area */}
                      <rect
                        x={x - 15}
                        y={padding.top}
                        width="30"
                        height={graphHeight}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          const svgRect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                          setHoveredDataPoint({
                            x: x + scrollLeft + 60,
                            y: padding.top + 50,
                            data: d,
                            dateLabel: formatTooltipDateLabel(d.date),
                            source: 'all'
                          });
                        }}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      />
                      
                      {/* Visual circles */}
                      <circle
                        cx={x}
                        cy={yScale(d.leads)}
                        r="4"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                        opacity={selectedLeadSource === 'all' ? 1 : 0.3}
                      />
                      <circle
                        cx={x}
                        cy={yScale(d.applications)}
                        r="4"
                        fill="#f59e0b"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                        opacity={selectedLeadSource === 'all' ? 1 : 0.3}
                      />
                      <circle
                        cx={x}
                        cy={yScale(d.onboarded)}
                        r="4"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                        opacity={selectedLeadSource === 'all' ? 1 : 0.3}
                      />
                    </g>
                  );
                })}

                {/* Interactive hover areas for specific source */}
                {selectedLeadSource !== 'all' && specificSourceData.map((d, i) => {
                  const x = xScale(i, specificSourceData.length);
                  const scrollLeft = document.querySelector('#pipeline-graph-scroll')?.scrollLeft || 0;
                  
                  return (
                    <g key={`point-specific-${i}`}>
                      {/* Invisible hover area */}
                      <rect
                        x={x - 15}
                        y={padding.top}
                        width="30"
                        height={graphHeight}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          setHoveredDataPoint({
                            x: x + scrollLeft + 60,
                            y: padding.top + 50,
                            data: d,
                            dateLabel: formatTooltipDateLabel(d.date),
                            source: selectedLeadSource
                          });
                        }}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      />
                      
                      {/* Visual circles */}
                      <circle
                        cx={x}
                        cy={yScale(d.leads)}
                        r="4"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                      />
                      <circle
                        cx={x}
                        cy={yScale(d.applications)}
                        r="4"
                        fill="#f59e0b"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                      />
                      <circle
                        cx={x}
                        cy={yScale(d.onboarded)}
                        r="4"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                        style={{ pointerEvents: 'none' }}
                      />
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform={`translate(${width - padding.right + 15}, ${padding.top})`}>
                  <rect x="-10" y="-10" width="100" height={selectedLeadSource === 'all' ? '110' : '210'} fill="white" stroke="#e5e7eb" strokeWidth="1" rx="6" />
                  <text x="0" y="5" fontSize="11" fontWeight="700" fill="#1f2937">Legend</text>
                  
                  {/* All sources legend */}
                  <g transform="translate(0, 25)">
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#10b981" strokeWidth="2.5" opacity={selectedLeadSource === 'all' ? 1 : 0.5} />
                    <text x="25" y="4" fontSize="10" fill="#6b7280" fontWeight="500">Leads {selectedLeadSource !== 'all' ? '(All)' : ''}</text>
                  </g>
                  
                  <g transform="translate(0, 45)">
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="2.5" opacity={selectedLeadSource === 'all' ? 1 : 0.5} />
                    <text x="25" y="4" fontSize="10" fill="#6b7280" fontWeight="500">Apps {selectedLeadSource !== 'all' ? '(All)' : ''}</text>
                  </g>
                  
                  <g transform="translate(0, 65)">
                    <line x1="0" y1="0" x2="20" y2="0" stroke="#3b82f6" strokeWidth="2.5" opacity={selectedLeadSource === 'all' ? 1 : 0.5} />
                    <text x="25" y="4" fontSize="10" fill="#6b7280" fontWeight="500">Onboarded {selectedLeadSource !== 'all' ? '(All)' : ''}</text>
                  </g>

                  {/* Specific source legend */}
                  {selectedLeadSource !== 'all' && (
                    <>
                      <line x1="-5" y1="90" x2="85" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                      
                      <g transform="translate(0, 105)">
                        <line x1="0" y1="0" x2="20" y2="0" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6,4" />
                        <text x="25" y="4" fontSize="10" fill="#6b7280" fontWeight="500">Leads</text>
                      </g>
                      
                      <g transform="translate(0, 125)">
                        <line x1="0" y1="0" x2="20" y2="0" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />
                        <text x="25" y="4" fontSize="10" fill="#6b7280" fontWeight="500">Apps</text>
                      </g>
                      
                      <g transform="translate(0, 145)">
                        <line x1="0" y1="0" x2="20" y2="0" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6,4" />
                        <text x="25" y="4" fontSize="10" fill="#6b7280" fontWeight="500">Onboarded</text>
                      </g>
                      
                      <text x="0" y="170" fontSize="9" fill="#9ca3af" fontWeight="600">({selectedLeadSource})</text>
                    </>
                  )}
                </g>
              </svg>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Lead Source Performance Comparison */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
          Lead Source Performance Comparison
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* All Sources Card */}
          {(() => {
            const allSourceData = filteredTimeSeriesData.filter(d => d.source === 'all');
            const totalLeads = allSourceData.reduce((sum, d) => sum + d.leads, 0);
            const totalApplications = allSourceData.reduce((sum, d) => sum + d.applications, 0);
            const totalOnboarded = allSourceData.reduce((sum, d) => sum + d.onboarded, 0);
            const closeRate = totalLeads > 0 ? ((totalOnboarded / totalLeads) * 100).toFixed(1) : 0;
            
            return (
              <div 
                onClick={() => setSelectedLeadSource('all')}
                style={{
                  backgroundColor: selectedLeadSource === 'all' ? '#dbeafe' : 'white',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  border: selectedLeadSource === 'all' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedLeadSource !== 'all') {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLeadSource !== 'all') {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Source Name */}
                <div style={{ 
                  fontSize: '0.9375rem', 
                  fontWeight: '700', 
                  color: selectedLeadSource === 'all' ? '#1e40af' : '#1e293b', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  All Sources
                  <span style={{
                    fontSize: '0.6875rem',
                    backgroundColor: selectedLeadSource === 'all' ? '#3b82f6' : '#e2e8f0',
                    color: selectedLeadSource === 'all' ? 'white' : '#64748b',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    fontWeight: '600'
                  }}>
                    OVERALL
                  </span>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Leads */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Leads
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>
                      {totalLeads}
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Applications
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
                      {totalApplications}
                    </div>
                  </div>

                  {/* Onboarded */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Onboarded
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                      {totalOnboarded}
                    </div>
                  </div>

                  {/* Close Rate */}
                  <div style={{ 
                    marginTop: '0.5rem', 
                    paddingTop: '0.75rem', 
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Close Rate
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '800', 
                      color: parseFloat(closeRate) > 15 ? '#10b981' : parseFloat(closeRate) > 10 ? '#f59e0b' : '#64748b'
                    }}>
                      {closeRate}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Individual Source Cards */}
          {leadSources.filter(s => s !== 'all').map(source => {
            // Calculate metrics for this source
            const sourceData = filteredTimeSeriesData.filter(d => d.source === source);
            const totalLeads = sourceData.reduce((sum, d) => sum + d.leads, 0);
            const totalApplications = sourceData.reduce((sum, d) => sum + d.applications, 0);
            const totalOnboarded = sourceData.reduce((sum, d) => sum + d.onboarded, 0);
            const closeRate = totalLeads > 0 ? ((totalOnboarded / totalLeads) * 100).toFixed(1) : 0;
            
            return (
              <div 
                key={source}
                onClick={() => setSelectedLeadSource(source)}
                style={{
                  backgroundColor: selectedLeadSource === source ? '#f0fdf4' : 'white',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  border: selectedLeadSource === source ? '2px solid #10b981' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedLeadSource !== source) {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLeadSource !== source) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Source Name */}
                <div style={{ 
                  fontSize: '0.9375rem', 
                  fontWeight: '700', 
                  color: selectedLeadSource === source ? '#047857' : '#1e293b', 
                  marginBottom: '1rem',
                  textTransform: 'capitalize'
                }}>
                  {source}
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Leads */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Leads
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>
                      {totalLeads}
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Applications
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
                      {totalApplications}
                    </div>
                  </div>

                  {/* Onboarded */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Onboarded
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                      {totalOnboarded}
                    </div>
                  </div>

                  {/* Close Rate */}
                  <div style={{ 
                    marginTop: '0.5rem', 
                    paddingTop: '0.75rem', 
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Close Rate
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '800', 
                      color: parseFloat(closeRate) > 15 ? '#10b981' : parseFloat(closeRate) > 10 ? '#f59e0b' : '#64748b'
                    }}>
                      {closeRate}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
          Key Performance Metrics
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {/* Time from Lead to Application */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            cursor: 'default',
            minHeight: '180px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Lead → Application
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', lineHeight: '1', marginBottom: '0.375rem' }}>
              {(() => {
                // Calculate average days from lead to application based on source
                const sourceMultipliers = {
                  'all': 5,
                  'PMW': 3,
                  'Phone': 2,
                  'Email': 7,
                  'SMS': 4,
                  'Word of Mouth': 3
                };
                const avgDays = sourceMultipliers[selectedLeadSource] || 5;
                return avgDays;
              })()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '0.5rem' }}>
              days average
            </div>
            {selectedLeadSource !== 'all' && (() => {
              const sourceMultipliers = {
                'all': 5,
                'PMW': 3,
                'Phone': 2,
                'Email': 7,
                'SMS': 4,
                'Word of Mouth': 3
              };
              const currentValue = sourceMultipliers[selectedLeadSource] || 5;
              const allAvg = sourceMultipliers['all'];
              const isBetter = currentValue < allAvg; // Lower is better for time
              const difference = Math.abs(currentValue - allAvg);
              
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: isBetter ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {isBetter ? '↓' : '↑'} {difference} {isBetter ? 'faster' : 'slower'}
                  </span>
                  <span style={{ color: '#94a3b8' }}>vs avg ({allAvg}d)</span>
                </div>
              );
            })()}
          </div>

          {/* Time from Application to Onboarded */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            cursor: 'default',
            minHeight: '180px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Application → Onboarded
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', lineHeight: '1', marginBottom: '0.375rem' }}>
              {(() => {
                // Calculate average days from application to onboarded based on source
                const sourceMultipliers = {
                  'all': 8,
                  'PMW': 7,
                  'Phone': 6,
                  'Email': 10,
                  'SMS': 8,
                  'Word of Mouth': 5
                };
                const avgDays = sourceMultipliers[selectedLeadSource] || 8;
                return avgDays;
              })()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '0.5rem' }}>
              days average
            </div>
            {selectedLeadSource !== 'all' && (() => {
              const sourceMultipliers = {
                'all': 8,
                'PMW': 7,
                'Phone': 6,
                'Email': 10,
                'SMS': 8,
                'Word of Mouth': 5
              };
              const currentValue = sourceMultipliers[selectedLeadSource] || 8;
              const allAvg = sourceMultipliers['all'];
              const isBetter = currentValue < allAvg; // Lower is better for time
              const difference = Math.abs(currentValue - allAvg);
              
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: isBetter ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {isBetter ? '↓' : '↑'} {difference} {isBetter ? 'faster' : 'slower'}
                  </span>
                  <span style={{ color: '#94a3b8' }}>vs avg ({allAvg}d)</span>
                </div>
              );
            })()}
          </div>

          {/* Overall Close Rate */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            cursor: 'default',
            minHeight: '180px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Overall Close Rate
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', lineHeight: '1', marginBottom: '0.375rem' }}>
              {(() => {
                // Calculate close rate from lead to onboarded
                const relevantData = selectedLeadSource === 'all' 
                  ? filteredTimeSeriesData.filter(d => d.source === 'all')
                  : filteredTimeSeriesData.filter(d => d.source === selectedLeadSource);
                
                const totalLeads = relevantData.reduce((sum, d) => sum + d.leads, 0);
                const totalOnboarded = relevantData.reduce((sum, d) => sum + d.onboarded, 0);
                const closeRate = totalLeads > 0 ? ((totalOnboarded / totalLeads) * 100).toFixed(1) : 0;
                
                return closeRate;
              })()}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500', marginBottom: '0.5rem' }}>
              lead to onboarded
            </div>
            {selectedLeadSource !== 'all' && (() => {
              // Calculate current source close rate
              const specificData = filteredTimeSeriesData.filter(d => d.source === selectedLeadSource);
              const specificLeads = specificData.reduce((sum, d) => sum + d.leads, 0);
              const specificOnboarded = specificData.reduce((sum, d) => sum + d.onboarded, 0);
              const currentRate = specificLeads > 0 ? ((specificOnboarded / specificLeads) * 100) : 0;
              
              // Calculate all sources average
              const allData = filteredTimeSeriesData.filter(d => d.source === 'all');
              const allLeads = allData.reduce((sum, d) => sum + d.leads, 0);
              const allOnboarded = allData.reduce((sum, d) => sum + d.onboarded, 0);
              const allAvg = allLeads > 0 ? ((allOnboarded / allLeads) * 100) : 0;
              
              const isBetter = currentRate > allAvg; // Higher is better for close rate
              const difference = Math.abs(currentRate - allAvg).toFixed(1);
              
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: isBetter ? '#10b981' : '#ef4444', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {isBetter ? '↑' : '↓'} {difference}% {isBetter ? 'better' : 'worse'}
                  </span>
                  <span style={{ color: '#94a3b8' }}>vs avg ({allAvg.toFixed(1)}%)</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Stats Cards - Single Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
        <StatsCard
          title="Partial Leads"
          value={stats.lead}
          icon={AlertCircle}
          color="#f59e0b"
        />
        <StatsCard
          title="Qualified Leads"
          value={stats.application}
          icon={CheckCircle}
          color="#10b981"
        />
        <StatsCard
          title="In Onboarding"
          value={stats.onboarding}
          icon={Clock}
          color="#8b5cf6"
          onClick={() => onNavigateToList('onboarding')}
        />
      </div>

      {/* Tasks Section - Full Width */}
      <div style={{ marginBottom: '2rem' }}>
        <TasksWidget onNavigateToLead={onNavigateToLead} />
      </div>

      {/* Lead Stages - Partial and Qualified in One Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Partial Leads */}
        <div className="leads-section">
          <div className="section-header collapsible" onClick={() => toggleSection('partial')}>
            <h2 className="section-title">
              <span className="collapse-icon">
                {collapsedSections.partial ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
              <AlertCircle size={20} style={{ color: '#f59e0b' }} />
              Partial Leads ({leadStatusLeads.length})
            </h2>
            <button 
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToList('partial');
              }}
            >
              View All
            </button>
          </div>
            {!collapsedSections.partial && (
             <div className="leads-list">
               {leadStatusLeads.length > 0 ? (
                 leadStatusLeads.map(lead => (
                   <LeadCard key={lead.id} lead={lead} onClick={onNavigateToLead} />
                 ))
               ) : (
                 <div className="empty-state">No partial leads</div>
               )}
             </div>
            )}
        </div>

        {/* Qualified Leads */}
        <div className="leads-section">
          <div className="section-header collapsible" onClick={() => toggleSection('qualified')}>
            <h2 className="section-title">
              <span className="collapse-icon">
                {collapsedSections.qualified ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
              <CheckCircle size={20} style={{ color: '#10b981' }} />
              Qualified Leads ({applicationLeads.length})
            </h2>
            <button 
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToList('qualified');
              }}
            >
              View All
            </button>
          </div>
          {!collapsedSections.qualified && (
            <div className="leads-list">
              {applicationLeads.length > 0 ? (
                applicationLeads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} onClick={onNavigateToLead} />
                ))
              ) : (
                <div className="empty-state">No qualified leads</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Section - Full Width Row */}
      <div>
        {/* Approved Leads / Onboarding */}
        <div className="leads-section">
            <div className="section-header collapsible" onClick={() => toggleSection('approved')}>
              <h2 className="section-title">
                <span className="collapse-icon">
                  {collapsedSections.approved ? (
                    <ChevronRight size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </span>
                <Clock size={20} style={{ color: '#8b5cf6' }} />
                In Onboarding ({filteredLeads.filter(l => l.onboardingStatus === 'in_progress').length})
              </h2>
              <button 
                className="btn-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToList('onboarding');
                }}
              >
                View All
              </button>
            </div>
            {!collapsedSections.approved && (
              <div className="leads-list">
                {filteredLeads.filter(l => l.onboardingStatus === 'in_progress').length > 0 ? (
                  filteredLeads.filter(l => l.onboardingStatus === 'in_progress').slice(0, 5).map(lead => (
                    <OnboardingStatusCard key={lead.id} lead={lead} onClick={onNavigateToLead} />
                  ))
                ) : (
                  <div className="empty-state">No leads in onboarding</div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OwnerLeadsDashboard;

