import React, { useState } from 'react';
import { TrendingUp, BarChart3, Clock, Target, X } from 'lucide-react';
import { timeSeriesFunnelData, getPropertyCount } from '../mockData';
import PMWLogo from '../assets/PMW logo.png';

const PMWAnalytics = ({ leads }) => {
  const [viewMode, setViewMode] = useState('owners'); // 'owners' or 'properties'
  const [timePeriod, setTimePeriod] = useState('month'); // 'day', 'week', 'month', 'year', 'all'
  const [organicChannel, setOrganicChannel] = useState('all'); // 'all', 'Google', 'Bing', 'ChatGPT'
  const [paidChannel, setPaidChannel] = useState('all'); // 'all', 'Google Ads', 'Facebook', 'LinkedIn'
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  const [hoveredGraph, setHoveredGraph] = useState(null); // 'organic' or 'paid'
  
  // Section collapse state
  const [showPipelineTrends, setShowPipelineTrends] = useState(true);
  const [showLeadSourcePerformance, setShowLeadSourcePerformance] = useState(true);
  const [showLandingPagePerformance, setShowLandingPagePerformance] = useState(true);
  const [showKeyMetrics, setShowKeyMetrics] = useState(true);

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
        startDate = new Date(0);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return timeSeriesFunnelData.filter(d => new Date(d.date) >= startDate);
  };

  const filteredTimeSeriesData = getFilteredTimeSeriesData();

  // Get unique channels
  const organicChannels = ['Google', 'Bing', 'ChatGPT'];
  const paidChannels = ['Google Ads', 'Facebook', 'LinkedIn'];

  // Calculate metrics based on view mode
  const getCount = (lead) => {
    return viewMode === 'owners' ? 1 : getPropertyCount(lead);
  };

  // Calculate total counts for each category
  const calculateCategoryMetrics = (category) => {
    const categoryLeads = leads.filter(l => 
      l.leadSourceCategory === category && 
      l.status !== 'archived'
    );
    
    const totalCount = categoryLeads.reduce((sum, lead) => sum + getCount(lead), 0);
    const applicationCount = categoryLeads.filter(l => l.status === 'application' || l.status === 'awaiting approval' || l.status === 'onboarding').reduce((sum, lead) => sum + getCount(lead), 0);
    const onboardedCount = categoryLeads.filter(l => 
      l.onboardingStatus === 'in_progress' && l.onboardingCompletion === 100
    ).reduce((sum, lead) => sum + getCount(lead), 0);
    
    return { totalCount, applicationCount, onboardedCount };
  };

  // Calculate metrics for specific channels
  const calculateChannelMetrics = (channel) => {
    const channelLeads = leads.filter(l => 
      l.leadSourceChannel === channel && 
      l.status !== 'archived'
    );
    
    const totalCount = channelLeads.reduce((sum, lead) => sum + getCount(lead), 0);
    const applicationCount = channelLeads.filter(l => l.status === 'application' || l.status === 'awaiting approval' || l.status === 'onboarding').reduce((sum, lead) => sum + getCount(lead), 0);
    const onboardedCount = channelLeads.filter(l => 
      l.onboardingStatus === 'in_progress' && l.onboardingCompletion === 100
    ).reduce((sum, lead) => sum + getCount(lead), 0);
    
    return { totalCount, applicationCount, onboardedCount };
  };

  // Aggregate time series data with proper grouping based on time period
  const aggregateTimeSeriesData = (category, channel) => {
    const data = filteredTimeSeriesData.filter(d => {
      if (channel === 'all') {
        return d.category === category;
      }
      return d.channel === channel;
    });

    if (data.length === 0) return [];

    // Group data based on time period
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
      grouped[key].leads += d.leads || 0;
      grouped[key].applications += d.applications || 0;
      grouped[key].onboarded += d.onboarded || 0;
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

  // Calculate property counts directly from leads array using same aggregation logic
  const aggregatePropertiesFromLeads = (category, channel) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (timePeriod) {
      case 'day': startDate.setDate(now.getDate() - 1); break;
      case 'week': startDate.setDate(now.getDate() - 7); break;
      case 'month': startDate.setMonth(now.getMonth() - 1); break;
      case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
      case 'all': startDate = new Date(0); break;
      default: startDate.setMonth(now.getMonth() - 1);
    }
    
    // Filter leads by time period and category/channel
    const filteredLeads = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      if (leadDate < startDate) return false;
      
      if (channel === 'all') {
        return lead.leadSourceCategory === category;
      } else {
        return lead.leadSourceChannel === channel;
      }
    });
    
    // Group by date using same logic as time series aggregation
    const grouped = {};
    
    filteredLeads.forEach(lead => {
      const date = new Date(lead.createdAt);
      let key;
      
      switch (timePeriod) {
        case 'day':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
          break;
        case 'week':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          break;
        case 'month': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
          break;
        }
        case 'year':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'all':
          key = `${date.getFullYear()}`;
          break;
        default:
          key = lead.createdAt;
      }
      
      if (!grouped[key]) {
        grouped[key] = { date: key, properties: 0 };
      }
      grouped[key].properties += getPropertyCount(lead);
    });
    
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Enhance aggregated data with property counts
  const enhanceDataWithProperties = (aggregatedData, category, channel) => {
    const propertiesData = aggregatePropertiesFromLeads(category, channel);
    
    // Create a map of date -> properties for quick lookup
    const propertiesMap = {};
    propertiesData.forEach(p => {
      propertiesMap[p.date] = p.properties;
    });
    
    // Merge properties into aggregated data
    return aggregatedData.map(dataPoint => ({
      ...dataPoint,
      properties: propertiesMap[dataPoint.date] || 0
    }));
  };

  // Get data for all channels when "All" is selected, or just the single channel
  const getMultiChannelData = (category, selectedChannel, channels) => {
    if (selectedChannel === 'all') {
      // Return data for combined total and each individual channel
      const combinedBase = aggregateTimeSeriesData(category, 'all');
      const combined = enhanceDataWithProperties(combinedBase, category, 'all');
      
      const channelData = channels.map(ch => {
        const chDataBase = aggregateTimeSeriesData(category, ch);
        const chData = enhanceDataWithProperties(chDataBase, category, ch);
        return {
          channel: ch,
          data: chData
        };
      });
      
      return {
        combined,
        channels: channelData,
        isMulti: true
      };
    } else {
      // Return data for just the selected channel
      const combinedBase = aggregateTimeSeriesData(category, selectedChannel);
      const combined = enhanceDataWithProperties(combinedBase, category, selectedChannel);
      
      return {
        combined,
        channels: [],
        isMulti: false
      };
    }
  };

  const organicDataSets = getMultiChannelData('organic', organicChannel, organicChannels);
  const paidDataSets = getMultiChannelData('paid', paidChannel, paidChannels);

  // Format date label based on time period and aggregation
  const formatDateLabel = (dateStr) => {
    if (timePeriod === 'day') {
      // Showing hours
      const parts = dateStr.split(' ');
      return parts[1] || dateStr;
    } else if (timePeriod === 'week') {
      // Showing days
      const date = new Date(dateStr);
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    } else if (timePeriod === 'month') {
      // Showing weeks (start of week date)
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (timePeriod === 'year') {
      // Showing months
      const parts = dateStr.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[parseInt(parts[1]) - 1] || dateStr;
    } else {
      // Showing years
      return dateStr;
    }
  };

  // Format tooltip date label
  const formatTooltipDateLabel = (dateStr) => {
    if (timePeriod === 'day') {
      const parts = dateStr.split(' ');
      const date = new Date(parts[0]);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${parts[1]}`;
    } else if (timePeriod === 'week') {
      const date = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (timePeriod === 'month') {
      const date = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `Week of ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (timePeriod === 'year') {
      const parts = dateStr.split('-');
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
    } else {
      return dateStr;
    }
  };

  // Render pipeline graph
  const renderPipelineGraph = (dataSets, title, channels, selectedChannel, setSelectedChannel, color, graphId) => {
    if (!dataSets.combined || dataSets.combined.length === 0) return null;
    
    const data = dataSets.combined;
    const channelDataSets = dataSets.channels;
    const isMultiChannel = dataSets.isMulti;
    
    // Determine which metric to display based on viewMode
    const metricKey = viewMode === 'properties' ? 'properties' : 'leads';
    const metricLabel = viewMode === 'properties' ? 'Properties' : 'Owners';

    // Calculate max value across all data series
    let maxValue = Math.max(...data.map(d => d[metricKey]), 1);
    if (isMultiChannel) {
      channelDataSets.forEach(chData => {
        const chMax = Math.max(...chData.data.map(d => d[metricKey]), 1);
        maxValue = Math.max(maxValue, chMax);
      });
    }
    const width = 480;
    const height = 280;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    // Color mappings for individual channels
    const channelColors = {
      'Google': '#4285F4',
      'Bing': '#008373',
      'ChatGPT': '#10a37f',
      'Google Ads': '#FBBC04',
      'Facebook': '#1877F2',
      'LinkedIn': '#0A66C2'
    };

    const xScale = (index, dataLength) => {
      if (dataLength === 1) return padding.left + graphWidth / 2;
      return padding.left + (index / (dataLength - 1)) * graphWidth;
    };
    const yScale = (value) => {
      return padding.top + graphHeight - (value / maxValue) * graphHeight;
    };

    const generatePath = (dataArray, metric) => {
      if (dataArray.length === 0) return '';
      let path = '';
      dataArray.forEach((d, i) => {
        const x = xScale(i, dataArray.length);
        const y = yScale(d[metric]);
        if (i === 0) {
          path = `M ${x} ${y}`;
        } else {
          const prevX = xScale(i - 1, dataArray.length);
          const prevY = yScale(dataArray[i - 1][metric]);
          const cpX1 = prevX + (x - prevX) * 0.5;
          const cpX2 = x - (x - prevX) * 0.5;
          path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
        }
      });
      return path;
    };

    const dateLabels = data.length <= 7 ? data.map((d, i) => ({ index: i, label: formatDateLabel(d.date) })) : 
      data.filter((_, i) => i % Math.floor(data.length / 7) === 0).map((d, i) => ({ 
        index: i * Math.floor(data.length / 7), 
        label: formatDateLabel(d.date) 
      }));

    return (
      <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', padding: '1rem', border: '1px solid #e2e8f0', position: 'relative' }}>
        {/* Tooltip */}
        {hoveredDataPoint && hoveredGraph === graphId && (
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
            minWidth: '220px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
              {hoveredDataPoint.dateLabel}
            </div>
            
            {/* Total count (owners or properties) */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#374151', marginBottom: '0.375rem' }}>
                Total {hoveredDataPoint.metricLabel} {hoveredDataPoint.isMulti ? '(All Channels)' : ''}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{hoveredDataPoint.metricLabel}</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>{hoveredDataPoint.data[hoveredDataPoint.metricKey]}</span>
              </div>
            </div>

            {/* Individual channels breakdown (if showing all) */}
            {hoveredDataPoint.isMulti && hoveredDataPoint.channelDataSets && hoveredDataPoint.channelDataSets.length > 0 && (
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: '#374151', marginBottom: '0.375rem' }}>
                  By Channel
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {hoveredDataPoint.channelDataSets.map(chData => {
                    const channelDataPoint = chData.data[hoveredDataPoint.dataIndex];
                    if (!channelDataPoint) return null;
                    const metricValue = channelDataPoint[hoveredDataPoint.metricKey];
                    const totalValue = hoveredDataPoint.data[hoveredDataPoint.metricKey];
                    const percentage = totalValue > 0 ? ((metricValue / totalValue) * 100).toFixed(0) : 0;
                    return (
                      <div key={`tooltip-${chData.channel}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '2px', 
                            backgroundColor: channelColors[chData.channel] || '#10b981',
                            opacity: 0.6,
                            borderTop: '1px dashed',
                            borderBottom: '1px dashed',
                            borderColor: channelColors[chData.channel] || '#10b981'
                          }}></div>
                          <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{chData.channel}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: channelColors[chData.channel] || '#10b981' }}>
                            {metricValue}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>
          {title}
        </h4>

        {/* Channel Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedChannel('all')}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '6px',
              border: selectedChannel === 'all' ? `2px solid ${color}` : '1px solid #d1d5db',
              backgroundColor: selectedChannel === 'all' ? `${color}15` : 'white',
              color: selectedChannel === 'all' ? color : '#64748b',
              fontSize: '0.75rem',
              fontWeight: selectedChannel === 'all' ? '600' : '500',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {channels.map(channel => (
            <button
              key={channel}
              onClick={() => setSelectedChannel(channel)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: selectedChannel === channel ? `2px solid ${color}` : '1px solid #d1d5db',
                backgroundColor: selectedChannel === channel ? `${color}15` : 'white',
                color: selectedChannel === channel ? color : '#64748b',
                fontSize: '0.75rem',
                fontWeight: selectedChannel === channel ? '600' : '500',
                cursor: 'pointer'
              }}
            >
              {channel}
            </button>
          ))}
        </div>

        {/* Graph */}
        <svg width={width} height={height} style={{ display: 'block' }}>
          <rect x={padding.left} y={padding.top} width={graphWidth} height={graphHeight} fill="#fafbfc" />

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
            const value = maxValue * percent;
            const y = yScale(value);
            return (
              <g key={percent}>
                <line x1={padding.left} y1={y} x2={padding.left + graphWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {dateLabels.map(({ index, label }) => (
            <text
              key={`x-${index}`}
              x={xScale(index, data.length)}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
            >
              {label}
            </text>
          ))}

          {/* Individual channel lines (if showing all) - render first so they appear behind combined line */}
          {isMultiChannel && channelDataSets.map(chData => (
            <g key={`channel-${chData.channel}`} opacity="0.5">
              <path d={generatePath(chData.data, metricKey)} fill="none" stroke={channelColors[chData.channel] || '#10b981'} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" />
            </g>
          ))}

          {/* Combined total line - bold and prominent */}
          <path d={generatePath(data, metricKey)} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />

          {/* Interactive hover areas and data points */}
          {data.map((d, i) => {
            const x = xScale(i, data.length);
            return (
              <g key={`points-${i}`}>
                {/* Invisible hover area */}
                <rect
                  x={x - 15}
                  y={padding.top}
                  width="30"
                  height={graphHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => {
                    setHoveredDataPoint({
                      x: x,
                      y: padding.top + 50,
                      data: d,
                      dateLabel: formatTooltipDateLabel(d.date),
                      isMulti: isMultiChannel,
                      channelDataSets: channelDataSets,
                      dataIndex: i,
                      metricKey: metricKey,
                      metricLabel: metricLabel
                    });
                    setHoveredGraph(graphId);
                  }}
                  onMouseLeave={() => {
                    setHoveredDataPoint(null);
                    setHoveredGraph(null);
                  }}
                />
                
                {/* Visual circle for total metric */}
                <circle cx={x} cy={yScale(d[metricKey])} r="5" fill="#10b981" stroke="white" strokeWidth="2" style={{ pointerEvents: 'none' }} />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          {/* Main metric legend */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ fontWeight: '600' }}>Total {metricLabel}</span>
            </div>
          </div>
          
          {/* Individual channels legend (if showing all) */}
          {isMultiChannel && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
              {channelDataSets.map(chData => (
                <div key={`legend-${chData.channel}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '2px', 
                    backgroundColor: channelColors[chData.channel] || '#10b981',
                    opacity: 0.5,
                    border: '1px dashed',
                    borderColor: channelColors[chData.channel] || '#10b981'
                  }}></div>
                  <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{chData.channel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate PMW metrics
  const organicMetrics = calculateCategoryMetrics('organic');
  const paidMetrics = calculateCategoryMetrics('paid');
  const allPMWMetrics = {
    totalCount: organicMetrics.totalCount + paidMetrics.totalCount,
    applicationCount: organicMetrics.applicationCount + paidMetrics.applicationCount,
    onboardedCount: organicMetrics.onboardedCount + paidMetrics.onboardedCount
  };

  // Extract page path from referrer URL
  const getPagePath = (url) => {
    if (!url) return 'Direct';
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      if (path === '/' || path === '') return 'Home';
      return path;
    } catch {
      return 'Unknown';
    }
  };

  // Get friendly page name
  const getPageName = (path) => {
    if (path === 'Direct') return 'Direct';
    if (path === 'Home' || path === '/') return 'Home';
    if (path === 'Unknown') return 'Unknown';
    
    // Remove leading slash and convert to title case
    const cleanPath = path.replace(/^\//, '').replace(/-/g, ' ');
    return cleanPath.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Generate fake landing page data for demonstration
  const landingPageMetrics = [
    {
      name: 'Owners',
      path: '/owners',
      leads: Array(45).fill(null),
      totalCount: 45,
      applicationCount: 32,
      onboardedCount: 18
    },
    {
      name: 'Market Property Management',
      path: '/market-property-management',
      leads: Array(28).fill(null),
      totalCount: 28,
      applicationCount: 21,
      onboardedCount: 12
    },
    {
      name: 'Services',
      path: '/services',
      leads: Array(22).fill(null),
      totalCount: 22,
      applicationCount: 16,
      onboardedCount: 9
    },
    {
      name: 'Home',
      path: '/',
      leads: Array(18).fill(null),
      totalCount: 18,
      applicationCount: 12,
      onboardedCount: 7
    },
    {
      name: 'Contact',
      path: '/contact',
      leads: Array(15).fill(null),
      totalCount: 15,
      applicationCount: 10,
      onboardedCount: 5
    },
    {
      name: 'About Us',
      path: '/about-us',
      leads: Array(12).fill(null),
      totalCount: 12,
      applicationCount: 8,
      onboardedCount: 4
    },
    {
      name: 'Pricing',
      path: '/pricing',
      leads: Array(9).fill(null),
      totalCount: 9,
      applicationCount: 6,
      onboardedCount: 3
    }
  ];

  // Calculate close rates
  const getCloseRate = (metrics) => {
    return metrics.totalCount > 0 ? ((metrics.onboardedCount / metrics.totalCount) * 100).toFixed(1) : '0.0';
  };

  // Calculate average properties per owner
  const avgPropertiesPerOwner = () => {
    const pmwLeads = leads.filter(l => 
      (l.leadSourceCategory === 'organic' || l.leadSourceCategory === 'paid') && 
      l.status !== 'archived'
    );
    if (pmwLeads.length === 0) return '0.0';
    const totalProperties = pmwLeads.reduce((sum, lead) => sum + getPropertyCount(lead), 0);
    return (totalProperties / pmwLeads.length).toFixed(1);
  };

  return (
    <div style={{ 
      backgroundColor: '#f8fafc',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Header with Logo and Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={PMWLogo} 
            alt="PMW Logo" 
            style={{ 
              width: '60px', 
              height: '60px',
              objectFit: 'contain'
            }} 
          />
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
              PMW Analytics Dashboard
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Track organic and paid channel performance
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #3b82f6', overflow: 'hidden' }}>
          <button
            onClick={() => setViewMode('owners')}
            style={{
              padding: '0.5rem 1.5rem',
              border: 'none',
              backgroundColor: viewMode === 'owners' ? '#3b82f6' : 'white',
              color: viewMode === 'owners' ? 'white' : '#3b82f6',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Owners
          </button>
          <button
            onClick={() => setViewMode('properties')}
            style={{
              padding: '0.5rem 1.5rem',
              border: 'none',
              backgroundColor: viewMode === 'properties' ? '#3b82f6' : 'white',
              color: viewMode === 'properties' ? 'white' : '#3b82f6',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Properties
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.875rem' }}>Time Period:</span>
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
                textTransform: 'capitalize'
              }}
            >
              {period === 'all' ? 'All Time' : `1 ${period.charAt(0).toUpperCase() + period.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Trends - Organic and Paid Side by Side */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            marginBottom: showPipelineTrends ? '1rem' : '0'
          }}
          onClick={() => setShowPipelineTrends(!showPipelineTrends)}
        >
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
            Pipeline Trends Over Time
          </h3>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1
            }}
          >
            {showPipelineTrends ? '−' : '+'}
          </button>
        </div>
        
        {showPipelineTrends && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {renderPipelineGraph(organicDataSets, 'Organic Channels Pipeline', organicChannels, organicChannel, setOrganicChannel, '#10b981', 'organic')}
            {renderPipelineGraph(paidDataSets, 'Paid Channels Pipeline', paidChannels, paidChannel, setPaidChannel, '#f59e0b', 'paid')}
          </div>
        )}
      </div>

      {/* Lead Source Performance */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            marginBottom: showLeadSourcePerformance ? '1.5rem' : '0'
          }}
          onClick={() => setShowLeadSourcePerformance(!showLeadSourcePerformance)}
        >
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
            Lead Source Performance
          </h3>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1
            }}
          >
            {showLeadSourcePerformance ? '−' : '+'}
          </button>
        </div>
        
        {showLeadSourcePerformance && (<>


        {/* Summary Cards - All PMW, All Organic, All Paid */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Overview
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {/* All PMW Card */}
            <div style={{
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  All PMW
                </h5>
                <TrendingUp size={20} color="#3b82f6" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.25rem' }}>
                  {allPMWMetrics.totalCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '500' }}>
                  Total {viewMode === 'properties' ? 'Properties' : 'Owners'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #93c5fd' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e40af' }}>
                    {allPMWMetrics.applicationCount}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#1e40af' }}>Applications</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e40af' }}>
                    {allPMWMetrics.onboardedCount}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#1e40af' }}>Onboarded</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e40af' }}>
                    {getCloseRate(allPMWMetrics)}%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#1e40af' }}>Close Rate</div>
                </div>
              </div>
            </div>

            {/* All Organic Card */}
            <div style={{
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              border: '2px solid #10b981',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  All Organic
                </h5>
                <TrendingUp size={20} color="#10b981" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#047857', marginBottom: '0.25rem' }}>
                  {organicMetrics.totalCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '500' }}>
                  Total {viewMode === 'properties' ? 'Properties' : 'Owners'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #6ee7b7' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#047857' }}>
                    {organicMetrics.applicationCount}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#047857' }}>Applications</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#047857' }}>
                    {organicMetrics.onboardedCount}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#047857' }}>Onboarded</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#047857' }}>
                    {getCloseRate(organicMetrics)}%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#047857' }}>Close Rate</div>
                </div>
              </div>
            </div>

            {/* All Paid Card */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  All Paid
                </h5>
                <TrendingUp size={20} color="#f59e0b" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#b45309', marginBottom: '0.25rem' }}>
                  {paidMetrics.totalCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '500' }}>
                  Total {viewMode === 'properties' ? 'Properties' : 'Owners'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #fcd34d' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#b45309' }}>
                    {paidMetrics.applicationCount}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#b45309' }}>Applications</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#b45309' }}>
                    {paidMetrics.onboardedCount}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#b45309' }}>Onboarded</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#b45309' }}>
                    {getCloseRate(paidMetrics)}%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#b45309' }}>Close Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Channels - Separated by Type */}
        <div>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            By Channel
          </h4>
          
          {/* Organic Channels */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '0.75rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #10b981'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#10b981' 
              }}></div>
              <h5 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: '700', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Organic Channels
              </h5>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {organicChannels.map(channel => {
                const metrics = calculateChannelMetrics(channel);
                return (
                  <PerformanceCard
                    key={channel}
                    title={channel}
                    metrics={metrics}
                    closeRate={getCloseRate(metrics)}
                    color="#10b981"
                    viewMode={viewMode}
                    isChannel={true}
                  />
                );
              })}
            </div>
          </div>

          {/* Paid Channels */}
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '0.75rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #f59e0b'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: '#f59e0b' 
              }}></div>
              <h5 style={{ margin: 0, fontSize: '0.8125rem', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Paid Channels
              </h5>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {paidChannels.map(channel => {
                const metrics = calculateChannelMetrics(channel);
                return (
                  <PerformanceCard
                    key={channel}
                    title={channel}
                    metrics={metrics}
                    closeRate={getCloseRate(metrics)}
                    color="#f59e0b"
                    viewMode={viewMode}
                    isChannel={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
        </>)}
      </div>

      {/* Landing Page Performance */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            marginBottom: showLandingPagePerformance ? '1rem' : '0'
          }}
          onClick={() => setShowLandingPagePerformance(!showLandingPagePerformance)}
        >
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
              Landing Page Performance
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Compare which pages on your PMW site are driving the most leads
            </p>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1
            }}
          >
            {showLandingPagePerformance ? '−' : '+'}
          </button>
        </div>
        
        {showLandingPagePerformance && (
          <div style={{ marginTop: '1.5rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {landingPageMetrics.map(page => (
              <div 
                key={page.name}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    fontSize: '0.6875rem', 
                    color: '#64748b', 
                    fontFamily: 'monospace',
                    backgroundColor: '#f1f5f9',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: '600'
                  }}>
                    {page.path}
                  </div>
                  <h4 style={{ margin: '0', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                    {page.name}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0ea5e9' }}>
                    {page.leads.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Leads
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      Applications
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>
                      {page.applicationCount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      Onboarded
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>
                      {page.onboardedCount}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      Close Rate
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981' }}>
                      {getCloseRate(page)}%
                    </div>
                  </div>
                </div>
            </div>
          ))}
        </div>
          </div>
        )}
      </div>

      {/* Key Performance Metrics */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            marginBottom: showKeyMetrics ? '1rem' : '0'
          }}
          onClick={() => setShowKeyMetrics(!showKeyMetrics)}
        >
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
            Key Performance Metrics
          </h3>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1
            }}
          >
            {showKeyMetrics ? '−' : '+'}
          </button>
        </div>
        
        {showKeyMetrics && (<>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {/* Lead → Application Time */}
          <MetricCard
            title="Lead → Application Time"
            organicValue="4 days"
            paidValue="5 days"
            icon={Clock}
            isBetterLower={true}
          />

          {/* Application → Onboarded Time */}
          <MetricCard
            title="Application → Onboarded Time"
            organicValue="6 days"
            paidValue="7 days"
            icon={Clock}
            isBetterLower={true}
          />

          {/* Overall Close Rate */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Overall Close Rate
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.25rem' }}>Organic</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981' }}>
                  {getCloseRate(organicMetrics)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.25rem' }}>Paid</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f59e0b' }}>
                  {getCloseRate(paidMetrics)}%
                </div>
              </div>
            </div>
            {viewMode === 'owners' && (
              <div style={{ 
                marginTop: '0.75rem', 
                paddingTop: '0.75rem', 
                borderTop: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                <div style={{ fontWeight: '600', color: '#3b82f6', fontSize: '1.25rem' }}>
                  {avgPropertiesPerOwner()}
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Avg properties per owner
                </div>
              </div>
            )}
          </div>
        </div>
        </>)}
      </div>
    </div>
  );
};

// Performance Card Component
const PerformanceCard = ({ title, metrics, closeRate, color, viewMode, highlight = false, isChannel = false }) => {
  return (
    <div
      style={{
        backgroundColor: highlight ? `${color}08` : 'white',
        borderRadius: '8px',
        padding: '1.25rem',
        border: highlight ? `2px solid ${color}` : '1px solid #e2e8f0',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ 
        fontSize: '0.9375rem', 
        fontWeight: '700', 
        color: '#1e293b', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {title}
        {highlight && (
          <span style={{
            fontSize: '0.6875rem',
            backgroundColor: color,
            color: 'white',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontWeight: '600'
          }}>
            TOTAL
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            {viewMode === 'owners' ? 'Leads' : 'Properties'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>
            {metrics.totalCount}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Applications
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
            {metrics.applicationCount}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Onboarded
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
            {metrics.onboardedCount}
          </div>
        </div>

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
};

// Metric Card Component
const MetricCard = ({ title, organicValue, paidValue, icon: Icon, isBetterLower }) => {
  const organicNum = parseInt(organicValue);
  const paidNum = parseInt(paidValue);
  const isBetter = isBetterLower ? organicNum < paidNum : organicNum > paidNum;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        {title}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.25rem' }}>Organic</div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            color: isBetter ? '#10b981' : '#64748b'
          }}>
            {organicValue}
          </div>
          {isBetter && (
            <div style={{ fontSize: '0.6875rem', color: '#10b981', marginTop: '0.25rem' }}>
              ✓ Faster
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.25rem' }}>Paid</div>
          <div style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            color: !isBetter ? '#f59e0b' : '#64748b'
          }}>
            {paidValue}
          </div>
          {!isBetter && (
            <div style={{ fontSize: '0.6875rem', color: '#f59e0b', marginTop: '0.25rem' }}>
              ✓ Faster
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PMWAnalytics;

