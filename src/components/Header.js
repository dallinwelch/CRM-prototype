import React from 'react';
import { Search, Sparkles, Bell, User, HelpCircle, Menu } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile menu toggle */}
        {onMenuToggle && (
          <button className="mobile-menu-toggle" onClick={onMenuToggle}>
            <Menu size={24} />
          </button>
        )}
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#10B981" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>rentvine</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search..." 
          />
          <span style={{ 
            fontSize: '0.75rem', 
            opacity: 0.7, 
            marginLeft: '0.5rem' 
          }}>
            ⌘K
          </span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-icon">
          <Sparkles size={18} />
        </div>
        <div className="header-icon">
          <Bell size={18} />
        </div>
        <div className="header-icon">
          <User size={18} />
        </div>
        <div className="header-icon">
          <HelpCircle size={18} />
        </div>
        <div className="user-avatar">DW</div>
      </div>
    </header>
  );
};

export default Header;
