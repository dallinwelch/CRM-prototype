import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  TrendingUp,
  Settings,
  BarChart3,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Briefcase,
  X
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab, isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState('portfolio');

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleNavClick = (tab, subTab = null) => {
    setActiveTab(tab);
    if (setActiveSubTab) {
      setActiveSubTab(subTab);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Briefcase size={32} className="logo-icon" />
          <h1 className="logo-text">RentVine CRM</h1>
          {/* Mobile close button */}
          {onClose && (
            <button 
              className="mobile-menu-toggle"
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                display: 'none'
              }}
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
        {/* Portfolio Section with Sub-nav */}
        <div className="nav-section">
          <button
            className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => {
              toggleSection('portfolio');
              handleNavClick('portfolio', 'dashboard');
            }}
          >
            <Briefcase size={20} />
            <span>Portfolio</span>
            {expandedSection === 'portfolio' ? (
              <ChevronDown size={16} className="ml-auto" />
            ) : (
              <ChevronRight size={16} className="ml-auto" />
            )}
          </button>
          
          {expandedSection === 'portfolio' && (
            <div className="nav-subitems">
              <button
                className={`nav-subitem ${activeTab === 'portfolio' && activeSubTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('portfolio', 'dashboard')}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button
                className={`nav-subitem ${activeTab === 'portfolio' && activeSubTab === 'owner-leads' ? 'active' : ''}`}
                onClick={() => handleNavClick('portfolio', 'owner-leads')}
              >
                <Users size={18} />
                <span>Owner Leads</span>
              </button>
            </div>
          )}
        </div>

        {/* Other Nav Items */}
        <button
          className={`nav-item ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => handleNavClick('properties')}
        >
          <Home size={20} />
          <span>Properties</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'tenants' ? 'active' : ''}`}
          onClick={() => handleNavClick('tenants')}
        >
          <Users size={20} />
          <span>Tenants</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'leases' ? 'active' : ''}`}
          onClick={() => handleNavClick('leases')}
        >
          <FileText size={20} />
          <span>Leases</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'accounting' ? 'active' : ''}`}
          onClick={() => handleNavClick('accounting')}
        >
          <TrendingUp size={20} />
          <span>Accounting</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => handleNavClick('reports')}
        >
          <BarChart3 size={20} />
          <span>Reports</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'automations' ? 'active' : ''}`}
          onClick={() => handleNavClick('automations')}
        >
          <ClipboardList size={20} />
          <span>Automations</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleNavClick('settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">SJ</div>
          <div className="user-info">
            <div className="user-name">Sarah Johnson</div>
            <div className="user-role">Manager</div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
