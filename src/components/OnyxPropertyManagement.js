import React, { useState, useEffect } from 'react';
import './OnyxPropertyManagement.css';
import pmwBanner from '../assets/pmwBanner.png';
import ownersKey from '../assets/ownerskey.jpeg';

const OnyxPropertyManagement = () => {
  const [formData, setFormData] = useState({
    ownerType: 'owner',
    name: '',
    email: '',
    phone: '',
    address: '',
    comments: ''
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('services');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  
  const [ownerFormData, setOwnerFormData] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-123-4567',
    inquiryType: 'Property Management Inquiry',
    comment: 'I am interested in learning more about your property management services for my rental property.'
  });

  const [detailedFormData, setDetailedFormData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '555-987-6543',
    numberOfProperties: '2',
    properties: [
      {
        address: '1234 Maple Street, Austin, TX 78701',
        bedrooms: '3',
        bathrooms: '2.5',
        sqft: '2100',
        minRent: '2500',
        agreementLength: '1',
        homeType: 'house',
        furnished: 'unfurnished',
        repairLimit: '500',
        currentlyLiveInHome: 'no'
      },
      {
        address: '5678 Oak Avenue, Austin, TX 78702',
        bedrooms: '2',
        bathrooms: '2',
        sqft: '1400',
        minRent: '1800',
        agreementLength: '2',
        homeType: 'condo',
        furnished: 'furnished',
        repairLimit: '750',
        currentlyLiveInHome: 'no'
      }
    ]
  });

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'services';
      setActiveSection(hash);
    };

    handleHashChange(); // Set initial state
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOwnerFormChange = (e) => {
    const { name, value } = e.target;
    setOwnerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you shortly.');
  };

  const handleOwnerFormSubmit = (e) => {
    e.preventDefault();
    // Transfer data to detailed form and navigate
    setDetailedFormData(prev => ({
      ...prev,
      name: ownerFormData.name,
      email: ownerFormData.email,
      phone: ownerFormData.phone
    }));
    window.location.hash = 'owner-form';
  };

  const handleDetailedFormChange = (e) => {
    const { name, value } = e.target;
    setDetailedFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberOfPropertiesChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    const newProperties = Array(count).fill(null).map((_, index) => 
      detailedFormData.properties[index] || {
        address: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        minRent: '',
        agreementLength: '1',
        homeType: 'house',
        furnished: 'unfurnished',
        repairLimit: '500',
        currentlyLiveInHome: 'no'
      }
    );
    
    setDetailedFormData(prev => ({
      ...prev,
      numberOfProperties: e.target.value,
      properties: newProperties
    }));
  };

  const handlePropertyChange = (index, field, value) => {
    setDetailedFormData(prev => {
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

  const handleDetailedFormSubmit = (e) => {
    e.preventDefault();
    console.log('Detailed form submitted:', detailedFormData);
    setShowSuccessScreen(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessScreen(false);
    window.location.hash = 'services';
  };

  return (
    <div className="onyx-site">
      {/* Success Modal */}
      {showSuccessScreen && (
        <div className="success-modal-overlay" onClick={handleCloseSuccess}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <div className="success-checkmark">✓</div>
            </div>
            <h2 className="success-title">Application Submitted Successfully! 🎉</h2>
            <p className="success-message">
              Thank you for choosing The Onyx Property Management! We're thrilled to have the 
              opportunity to work with you.
            </p>
            <div className="success-details">
              <div className="success-detail-item">
                <span className="success-icon-text">📧</span>
                <p>We've received your application and our team is already reviewing your {detailedFormData.numberOfProperties} {detailedFormData.numberOfProperties === '1' ? 'property' : 'properties'}.</p>
              </div>
              <div className="success-detail-item">
                <span className="success-icon-text">📞</span>
                <p>One of our property management specialists will reach out to you within 24-48 hours to discuss next steps.</p>
              </div>
              <div className="success-detail-item">
                <span className="success-icon-text">✨</span>
                <p>In the meantime, check your email at <strong>{detailedFormData.email}</strong> for your application confirmation.</p>
              </div>
            </div>
            <button className="success-close-btn" onClick={handleCloseSuccess}>
              Return to Home
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="onyx-header">
        <div className="onyx-header-content">
          <div className="onyx-logo">
            <span className="logo-the">THE</span>
            <span className="logo-onyx">ONYX</span>
          </div>
          
          <nav className="onyx-nav desktop-nav">
            <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>SERVICES</a>
            <a href="#owners" className={`nav-link ${activeSection === 'owners' ? 'active' : ''}`}>OWNERS</a>
            <a href="#tenants" className={`nav-link ${activeSection === 'tenants' ? 'active' : ''}`}>TENANTS</a>
            <a href="#agents" className={`nav-link ${activeSection === 'agents' ? 'active' : ''}`}>AGENTS</a>
            <a href="#properties" className={`nav-link ${activeSection === 'properties' ? 'active' : ''}`}>PROPERTIES</a>
            <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>ABOUT</a>
            <a href="#login" className={`nav-link ${activeSection === 'login' ? 'active' : ''}`}>LOGIN</a>
          </nav>

          <div className="onyx-contact">
            <span className="phone-number">123.456.7890</span>
            <a href="mailto:contact@onyx.com" className="email-icon">✉</a>
          </div>

          <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            ☰ MENU
          </button>
        </div>

        {showMobileMenu && (
          <nav className="onyx-nav mobile-nav">
            <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>SERVICES</a>
            <a href="#owners" className={`nav-link ${activeSection === 'owners' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>OWNERS</a>
            <a href="#tenants" className={`nav-link ${activeSection === 'tenants' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>TENANTS</a>
            <a href="#agents" className={`nav-link ${activeSection === 'agents' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>AGENTS</a>
            <a href="#properties" className={`nav-link ${activeSection === 'properties' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>PROPERTIES</a>
            <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>ABOUT</a>
            <a href="#login" className={`nav-link ${activeSection === 'login' ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>LOGIN</a>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="onyx-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${pmwBanner})` }}>
        <div className="hero-content">
          <h2 className="hero-subtitle">[MARKET]</h2>
          <h1 className="hero-title">PROPERTY MANAGEMENT</h1>
          <p className="hero-tagline">We Eliminate the Stress of Property Ownership</p>
          
          <div className="hero-cta">
            <input 
              type="text" 
              placeholder="Enter Your Rental Property Address For A Free Rental Analysis*"
              className="hero-input"
            />
            <button className="hero-submit-btn">SUBMIT</button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="onyx-tabs">
        <a href="#overview" className="tab-link active">OVERVIEW</a>
        <a href="#marketing" className="tab-link">MARKETING</a>
        <a href="#tenant-screening" className="tab-link">TENANT SCREENING</a>
        <a href="#rent-collection" className="tab-link">RENT COLLECTION</a>
        <a href="#maintenance" className="tab-link">MAINTENANCE</a>
        <a href="#accounting" className="tab-link">ACCOUNTING</a>
        <a href="#eviction" className="tab-link">EVICTION</a>
        <a href="#pricing" className="tab-link">PRICING</a>
      </nav>

      {/* Main Content */}
      <div className="onyx-main">
        {activeSection === 'owner-form' ? (
          // Detailed Owner Form Page
          <div className="content-container owner-form-page">
            <div className="form-content-full">
              <h2 className="section-title">Property Management Lead Form</h2>
              <p className="section-subtitle">Tell us about your properties</p>
              
              <form onSubmit={handleDetailedFormSubmit} className="detailed-owner-form">
                {/* Contact Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Contact Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={detailedFormData.name}
                        onChange={handleDetailedFormChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={detailedFormData.email}
                        onChange={handleDetailedFormChange}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={detailedFormData.phone}
                        onChange={handleDetailedFormChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Number of Properties */}
                <div className="form-section">
                  <div className="form-group">
                    <label className="form-label">How many properties do you have?</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      name="numberOfProperties"
                      value={detailedFormData.numberOfProperties}
                      onChange={handleNumberOfPropertiesChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Property Details for Each Property */}
                {detailedFormData.properties.map((property, index) => (
                  <div key={index} className="form-section property-section">
                    <h3 className="form-section-title">Property {index + 1}</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Property Address</label>
                      <input
                        type="text"
                        value={property.address}
                        onChange={(e) => handlePropertyChange(index, 'address', e.target.value)}
                        className="form-input"
                        placeholder="123 Main St, City, State, ZIP"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Bedrooms</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={property.bedrooms}
                          onChange={(e) => handlePropertyChange(index, 'bedrooms', e.target.value)}
                          className="form-input"
                          placeholder="3"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Bathrooms</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={property.bathrooms}
                          onChange={(e) => handlePropertyChange(index, 'bathrooms', e.target.value)}
                          className="form-input"
                          placeholder="2"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Square Feet</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={property.sqft}
                          onChange={(e) => handlePropertyChange(index, 'sqft', e.target.value)}
                          className="form-input"
                          placeholder="1500"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Minimum Rent ($/month)</label>
                        <input
                          type="number"
                          min="0"
                          value={property.minRent}
                          onChange={(e) => handlePropertyChange(index, 'minRent', e.target.value)}
                          className="form-input"
                          placeholder="1500"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Agreement Length (years)</label>
                        <select
                          value={property.agreementLength}
                          onChange={(e) => handlePropertyChange(index, 'agreementLength', e.target.value)}
                          className="form-input"
                          required
                        >
                          <option value="1">1 year</option>
                          <option value="2">2 years</option>
                          <option value="3">3 years</option>
                          <option value="4">4 years</option>
                          <option value="5">5 years</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Type of Home</label>
                        <select
                          value={property.homeType}
                          onChange={(e) => handlePropertyChange(index, 'homeType', e.target.value)}
                          className="form-input"
                          required
                        >
                          <option value="house">House</option>
                          <option value="condo">Condo</option>
                          <option value="townhouse">Townhouse</option>
                          <option value="mobile-home">Mobile Home</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Furnished/Unfurnished</label>
                        <select
                          value={property.furnished}
                          onChange={(e) => handlePropertyChange(index, 'furnished', e.target.value)}
                          className="form-input"
                          required
                        >
                          <option value="unfurnished">Unfurnished</option>
                          <option value="furnished">Furnished</option>
                          <option value="partially-furnished">Partially Furnished</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Repair Authorization Limit ($)</label>
                        <input
                          type="number"
                          min="0"
                          value={property.repairLimit}
                          onChange={(e) => handlePropertyChange(index, 'repairLimit', e.target.value)}
                          className="form-input"
                          placeholder="500"
                          required
                        />
                        <small className="form-help-text">Amount below which repairs can be made without your authorization</small>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Is the home currently occupied?</label>
                        <select
                          value={property.currentlyLiveInHome}
                          onChange={(e) => handlePropertyChange(index, 'currentlyLiveInHome', e.target.value)}
                          className="form-input"
                          required
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="form-actions">
                  <button type="button" onClick={() => window.location.hash = 'owners'} className="btn-secondary">
                    Back
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : activeSection === 'owners' ? (
          // Owner Resources Page
          <div className="content-container owner-resources">
            <div className="left-content">
              <h2 className="section-title">OWNER RESOURCES</h2>
              <p className="section-subtitle">INFORMATION YOU NEED</p>
              
              <div className="owner-hero-image">
                <img 
                  src={ownersKey}
                  alt="Owner Resources"
                  className="resource-image"
                />
              </div>

              <p className="section-text">
                We treat your home as our own. We offer a wide range of property management services to fit your 
                needs as a landlord or home owner. We tailor our services to ensure that you have the highest 
                level of service for your home.
              </p>

              <div className="owner-cta-buttons">
                <a href="#login" className="owner-btn owner-login-btn">OWNER LOGIN</a>
                <a href="#services" className="owner-btn owner-services-btn">OUR SERVICES</a>
              </div>
            </div>

            <div className="right-sidebar">
              <div className="contact-form-card">
                <h3 className="form-title">Have a Question?</h3>
                
                <form onSubmit={handleOwnerFormSubmit}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={ownerFormData.name}
                      onChange={handleOwnerFormChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={ownerFormData.email}
                      onChange={handleOwnerFormChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={ownerFormData.phone}
                      onChange={handleOwnerFormChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Inquiry Type</label>
                    <input
                      type="text"
                      name="inquiryType"
                      value={ownerFormData.inquiryType}
                      onChange={handleOwnerFormChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea
                      name="comment"
                      value={ownerFormData.comment}
                      onChange={handleOwnerFormChange}
                      className="form-textarea"
                      rows="6"
                    ></textarea>
                  </div>

                  <button type="submit" className="form-submit-btn">
                    →
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          // Services Page (default)
          <div className="content-container">
          {/* Left Content */}
          <div className="left-content">
            <h2 className="section-title">OVERVIEW</h2>
            
            <p className="section-text">
              Having a successful [Market] rental property requires a lot of time, effort, experience and 
              knowledge. Let us save you that time, effort and frustration that comes with gaining that 
              experience.
            </p>

            <p className="section-text">
              As a full service [Market] property management company, our team is responsible for taking care 
              of all aspects of managing your rental(s).
            </p>

            <h3 className="subsection-title">How much rent can you get for your investment?</h3>
            
            <p className="section-text">
              Our market analysis helps landlords and us make data-informed decisions about their rental 
              property, including rate estimates and other information so they can invest and manage their 
              investment property more wisely.
            </p>

            <ul className="benefits-list">
              <li>✓ Get Optimized Rental Value for Your Property</li>
              <li>✓ Gain Crucial Insight into Current Market Conditions</li>
              <li>✓ Determine Your Cashflow from Monthly Rental Value</li>
            </ul>

            <div className="cta-section">
              <p className="cta-text">
                Get started with your <span className="highlight">FREE PROPERTY CONSULTATION</span> by completing the form 
                to the right.
              </p>
              <div className="arrow-decoration">→</div>
            </div>

            {/* Services Section */}
            <div className="services-section">
              <h2 className="services-heading">
                AS YOUR [MARKET] PROPERTY MANAGER,<br/>
                WE TAKE CARE OF EVERYTHING.
              </h2>

              <div className="services-grid">
                <div className="service-card">
                  <div className="service-icon">📢</div>
                  <h3 className="service-title">MARKETING</h3>
                  <p className="service-description">
                    Marketing is key to successful rentals. We provide an expert market analysis for each property 
                    we manage to maximize your return on investment.
                  </p>
                </div>

                <div className="service-card">
                  <div className="service-icon">🔍</div>
                  <h3 className="service-title">TENANT SCREENING</h3>
                  <p className="service-description">
                    We conduct extensive screening on all tenants and handle every aspect of getting your investment 
                    rented in the shortest time possible.
                  </p>
                </div>

                <div className="service-card">
                  <div className="service-icon">💰</div>
                  <h3 className="service-title">RENT COLLECTION</h3>
                  <p className="service-description">
                    We make sure you get paid on time, every time. You no longer have to worry about rent showing 
                    up in your bank account because we take care of everything.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Contact Form */}
          <div className="right-sidebar">
            <div className="contact-form-card">
              <h3 className="form-title">Schedule Your Free<br/>Consultation</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Owner or Renter?</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="ownerType"
                        value="owner"
                        checked={formData.ownerType === 'owner'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom">✓</span>
                      I'm an Owner
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="ownerType"
                        value="renter"
                        checked={formData.ownerType === 'renter'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      I'm a Renter
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="ownerType"
                        value="vendor"
                        checked={formData.ownerType === 'vendor'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      I'm a Vendor
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Comments</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group recaptcha-placeholder">
                  <div className="recaptcha-box">
                    <input type="checkbox" id="not-robot" />
                    <label htmlFor="not-robot">I'm not a robot</label>
                    <div className="recaptcha-logo">reCAPTCHA</div>
                  </div>
                </div>

                <button type="submit" className="form-submit-btn">
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Footer */}
      <footer className="onyx-footer">
        <p>&copy; 2025 The Onyx Property Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OnyxPropertyManagement;

