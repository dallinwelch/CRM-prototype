import React from 'react';
import { Search, Sparkles, Bell, User, HelpCircle, Menu } from 'lucide-react';
import companyLogo from '../assets/companyLogo.png';

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
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            style={{ 
              height: '28px',
              width: 'auto'
            }} 
          />
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
