import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  User,
  Building,
  FileText,
  DollarSign
} from 'lucide-react';

const PropertyManagementSite = () => {
  console.log('PropertyManagementSite component rendering');
  
  const [currentStep, setCurrentStep] = useState('home');
  const [formData, setFormData] = useState({
    guestCard: {},
    additionalQuestions: {},
    ownerApplication: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const nextStep = (step) => {
    setCurrentStep(step);
  };

  const prevStep = () => {
    const steps = ['home', 'additionalQuestions', 'ownerApplication', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const resetApplication = () => {
    setCurrentStep('home');
    setFormData({
      guestCard: {},
      additionalQuestions: {},
      ownerApplication: {}
    });
  };

  // Hero Form Component
  const HeroForm = () => {
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (address.trim()) {
        setIsLoading(true);
        setTimeout(() => {
          alert('Thank you! We will contact you within 24 hours to discuss your property analysis.');
          setAddress('');
          setIsLoading(false);
        }, 1500);
      }
    };

    return (
      <section className="hero-section">
        <div className="hero-content">
          <h1>GET YOUR FREE RENTAL PRICE ANALYSIS</h1>
          <p>Call us today at 843-994-3869 or enter your address below.</p>
          <form onSubmit={handleSubmit} className="hero-form">
            <input
              type="text"
              placeholder="Enter your property address here*"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="address-input"
            />
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'SUBMIT'}
            </button>
          </form>
        </div>
      </section>
    );
  };

  // Guest Card Form Component
  const GuestCardForm = () => {
    const [formState, setFormState] = useState({
      // Lead Source Information
      howDidYouHear: '',
      referralSource: '',
      internetSource: '',
      
      // Owner Contact Information
      fullName: '',
      email: '',
      phone: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validation
      if (!formState.howDidYouHear || !formState.fullName || !formState.email || !formState.phone) {
        alert('Please fill in all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email)) {
        alert('Please enter a valid email address.');
        return;
      }

      updateFormData('guestCard', formState);
      nextStep('additionalQuestions');
    };

    return (
      <div className="guest-card-form">
        <h3>Start Your Owner Application</h3>
        <p className="form-description">Begin by providing your basic information as a property owner.</p>
        
        <form onSubmit={handleSubmit}>
          {/* Lead Source Information */}
          <div className="form-group">
            <label>How did you hear about us? *</label>
            <select name="howDidYouHear" value={formState.howDidYouHear} onChange={handleInputChange} required>
              <option value="">Select an option</option>
              <option value="Referral">Referral</option>
              <option value="Internet">Internet</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {formState.howDidYouHear === 'Referral' && (
            <div className="form-group">
              <input
                type="text"
                name="referralSource"
                placeholder="If referral, who referred you?"
                value={formState.referralSource}
                onChange={handleInputChange}
              />
            </div>
          )}
          
          {formState.howDidYouHear === 'Internet' && (
            <div className="form-group">
              <input
                type="text"
                name="internetSource"
                placeholder="If internet, what website?"
                value={formState.internetSource}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Owner Contact Information */}
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name of Owner(s) *"
              value={formState.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formState.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formState.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Continue to Application <ArrowRight size={16} />
          </button>
        </form>
      </div>
    );
  };

  // Progress Bar Component
  const ProgressBar = ({ currentStep }) => {
    const steps = [
      { id: 'home', label: '1', title: 'Contact Info' },
      { id: 'additionalQuestions', label: '2', title: 'Property Details' },
      { id: 'ownerApplication', label: '3', title: 'Rental Terms' }
    ];

    const getCurrentStepIndex = () => {
      return steps.findIndex(step => step.id === currentStep);
    };

    const currentIndex = getCurrentStepIndex();

    return (
      <div className="progress-bar">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`progress-step ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'active' : ''}`}>
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${index < currentIndex ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Additional Questions Component
  const AdditionalQuestions = () => {
    const [formState, setFormState] = useState({
      // Property Information
      propertyAddress: '',
      propertyType: '',
      multiFamilyUnits: '',
      
      // Property Specifications
      bedrooms: '',
      bathrooms: '',
      squareFootage: '',
      yearBuilt: '',
      
      // Key Amenities
      garageParking: '',
      airConditioning: '',
      washerDryer: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validation for required fields
      const requiredFields = ['propertyAddress', 'propertyType', 'bedrooms', 'bathrooms', 'squareFootage', 'yearBuilt'];
      const missingFields = requiredFields.filter(field => !formState[field]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields.');
        return;
      }

      updateFormData('additionalQuestions', formState);
      nextStep('ownerApplication');
    };

    return (
      <div className="application-screen">
        <div className="application-content">
          <ProgressBar currentStep={currentStep} />
          
          <h2>Property Information</h2>
          <p className="screen-description">Tell us about your property details and specifications.</p>
          
          <form onSubmit={handleSubmit}>
            {/* Property Information */}
            <div className="form-section">
              <h3>Property Details</h3>
              
              <div className="form-group">
                <label>Property Address (Street, City, State, Zip) *</label>
                <textarea
                  name="propertyAddress"
                  placeholder="Full property address"
                  value={formState.propertyAddress}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Property Type *</label>
                <select name="propertyType" value={formState.propertyType} onChange={handleInputChange} required>
                  <option value="">Select property type</option>
                  <option value="Single Family">Single Family</option>
                  <option value="Multi-Family">Multi-Family</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mobile Home">Mobile Home</option>
                  <option value="Unit/Apartment">Unit/Apartment</option>
                </select>
              </div>
              
              {formState.propertyType === 'Multi-Family' && (
                <div className="form-group">
                  <label>If multi-family, how many units?</label>
                  <input
                    type="number"
                    name="multiFamilyUnits"
                    placeholder="Number of units"
                    value={formState.multiFamilyUnits}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>

            {/* Property Specifications */}
            <div className="form-section">
              <h3>Property Specifications</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Bedrooms *</label>
                  <input
                    type="number"
                    name="bedrooms"
                    min="1"
                    max="10"
                    value={formState.bedrooms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Number of Bathrooms *</label>
                  <input
                    type="number"
                    name="bathrooms"
                    min="1"
                    max="10"
                    step="0.5"
                    value={formState.bathrooms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Square Footage *</label>
                  <input
                    type="number"
                    name="squareFootage"
                    placeholder="e.g., 1500"
                    value={formState.squareFootage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Year Built *</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    min="1800"
                    max="2024"
                    value={formState.yearBuilt}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Key Amenities */}
            <div className="form-section">
              <h3>Key Amenities</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Garage/Parking</label>
                  <select name="garageParking" value={formState.garageParking} onChange={handleInputChange}>
                    <option value="">Select option</option>
                    <option value="Garage">Garage</option>
                    <option value="Driveway">Driveway</option>
                    <option value="Street Parking">Street Parking</option>
                    <option value="None">None</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Air Conditioning</label>
                  <select name="airConditioning" value={formState.airConditioning} onChange={handleInputChange}>
                    <option value="">Select option</option>
                    <option value="Central AC">Central AC</option>
                    <option value="Window Units">Window Units</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Washer/Dryer</label>
                <select name="washerDryer" value={formState.washerDryer} onChange={handleInputChange}>
                  <option value="">Select option</option>
                  <option value="Included">Included</option>
                  <option value="Hookups Only">Hookups Only</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn-primary">
                Continue to Rental Terms <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Owner Application Component
  const OwnerApplication = () => {
    const [formState, setFormState] = useState({
      // Rental Terms & Financial Criteria
      furnished: '',
      leaseType: '',
      acceptableRent: '',
      managementAgreementLength: '',
      
      // Pet Policy
      allowPets: '',
      
      // Property Status & Quality
      listedForSale: '',
      homeownersAssociation: '',
      propertyCondition: '',
      willingToInvest: '',
      
      // Distance & Location
      distanceFromOffice: '',
      
      // Additional Information
      specialFeatures: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validation for required fields
      const requiredFields = [
        'furnished', 'leaseType', 'acceptableRent', 'managementAgreementLength',
        'propertyCondition', 'willingToInvest', 'distanceFromOffice'
      ];
      
      const missingFields = requiredFields.filter(field => !formState[field]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields.');
        return;
      }

      updateFormData('ownerApplication', formState);
      nextStep('success');
    };

    return (
      <div className="application-screen">
        <div className="application-content">
          <ProgressBar currentStep={currentStep} />
          
          <h2>Rental Terms & Property Status</h2>
          <p className="screen-description">Complete your rental terms and property status information.</p>
          
          <form onSubmit={handleSubmit}>

            {/* Rental Terms & Financial Criteria */}
            <div className="form-section">
              <h3>Rental Terms & Financial Criteria</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Is the property furnished? *</label>
                  <select name="furnished" value={formState.furnished} onChange={handleInputChange} required>
                    <option value="">Select option</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Partially Furnished">Partially Furnished</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>What type of lease do you prefer? *</label>
                  <select name="leaseType" value={formState.leaseType} onChange={handleInputChange} required>
                    <option value="">Select option</option>
                    <option value="Short-term (1-6 months)">Short-term (1-6 months)</option>
                    <option value="Long-term (12+ months)">Long-term (12+ months)</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Acceptable Rent Rate/Month ($) *</label>
                  <input
                    type="number"
                    name="acceptableRent"
                    placeholder="e.g., 2000"
                    value={formState.acceptableRent}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Minimum management agreement length (years) *</label>
                  <input
                    type="number"
                    name="managementAgreementLength"
                    min="1"
                    max="10"
                    value={formState.managementAgreementLength}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pet Policy */}
            <div className="form-section">
              <h3>Pet Policy</h3>
              
              <div className="form-group">
                <label>Do you allow pets?</label>
                <select name="allowPets" value={formState.allowPets} onChange={handleInputChange}>
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Property Status & Quality */}
            <div className="form-section">
              <h3>Property Status & Quality</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Is your property currently listed for sale?</label>
                  <select name="listedForSale" value={formState.listedForSale} onChange={handleInputChange}>
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Is there a homeowners association?</label>
                  <select name="homeownersAssociation" value={formState.homeownersAssociation} onChange={handleInputChange}>
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Property condition *</label>
                  <select name="propertyCondition" value={formState.propertyCondition} onChange={handleInputChange} required>
                    <option value="">Select condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Work">Needs Work</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Are you willing to invest in necessary repairs and maintenance? *</label>
                  <select name="willingToInvest" value={formState.willingToInvest} onChange={handleInputChange} required>
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Limited budget">Limited budget</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Distance & Location */}
            <div className="form-section">
              <h3>Distance & Location</h3>
              
              <div className="form-group">
                <label>Approximate driving distance from our office (minutes) *</label>
                <input
                  type="number"
                  name="distanceFromOffice"
                  placeholder="e.g., 15"
                  value={formState.distanceFromOffice}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3>Additional Information</h3>
              
              <div className="form-group">
                <label>Any special features or additional information about the property?</label>
                <textarea
                  name="specialFeatures"
                  placeholder="Any special features, restrictions, or additional information about your property..."
                  value={formState.specialFeatures}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={prevStep}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn-primary">
                Submit Application <CheckCircle size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Success Screen Component
  const SuccessScreen = () => {

    return (
      <div className="application-screen">
        <div className="application-content success-content">
          <div className="success-icon">
            <CheckCircle size={80} color="#10b981" />
          </div>
          
          <h2>Application Submitted Successfully!</h2>
          <p className="success-message">
            Thank you for your interest in Premier Property Management. We have received your application and will review it carefully.
          </p>
          
          <div className="next-steps">
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your application within 24 hours</li>
              <li>We'll contact you to schedule a property evaluation</li>
              <li>We'll provide you with a customized management proposal</li>
              <li>You'll receive our comprehensive service agreement</li>
            </ul>
          </div>
          
          <div className="contact-info">
            <p><strong>Questions?</strong> Contact us at 843-278-9003 or email info@premierpm.com</p>
          </div>
          
          <button type="button" className="btn-primary" onClick={resetApplication}>
            Start New Application
          </button>
        </div>
      </div>
    );
  };

  // Navigation function
  const goToPortal = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Main render logic
  if (currentStep === 'home') {
    return (
      <div className="property-management-site" style={{ 
        width: '100%', 
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-left">
              <button onClick={goToPortal} style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}>
                ← Back to Portal
              </button>
              <span>|</span>
              <a href="#">OWNER LOGIN</a>
              <span>|</span>
              <a href="#">PAY RENT</a>
              <span>|</span>
              <a href="#">REPAIR REQUEST</a>
            </div>
            <div className="top-bar-right">
              <Phone size={16} />
              <span>843-278-9003</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="main-nav">
          <div className="container">
            <div className="nav-left">
              <div className="logo">
                <div className="logo-icon">P</div>
                <div className="logo-text">
                  <div className="logo-main">PREMIER</div>
                  <div className="logo-sub">PROPERTY MANAGEMENT</div>
                </div>
              </div>
            </div>
            <div className="nav-right">
              <a href="#" className="nav-link">HOME</a>
              <a href="#" className="nav-link active">OWNERS & INVESTORS</a>
              <a href="#" className="nav-link">RENTALS</a>
              <a href="#" className="nav-link">RESIDENTS</a>
              <a href="#" className="nav-link">AGENTS</a>
              <a href="#" className="nav-link">ABOUT US</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <HeroForm />

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            <div className="content-grid">
              {/* Left Column */}
              <div className="left-column">
                <h2 className="section-title">
                  <span className="title-accent"></span>
                  PROPERTY MANAGEMENT CHARLESTON
                </h2>
                <h3 className="section-subtitle">LET US MANAGE YOUR CHARLESTON RENTAL PROPERTY</h3>
                
                <div className="team-image">
                  <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Professional team at work" />
                </div>
                
                <div className="content-text">
                  <p>At Premier Property Management, we specialize in maximizing your rental property's potential while minimizing your stress. Our experienced team handles everything from tenant screening to maintenance coordination, ensuring your investment works for you.</p>
                  
                  <h4>Why Choose Premier Property Management?</h4>
                  <ul>
                    <li>Comprehensive tenant screening and placement</li>
                    <li>24/7 maintenance support</li>
                    <li>Transparent financial reporting</li>
                    <li>Local market expertise</li>
                    <li>Competitive management fees</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Guest Card Form */}
              <div className="right-column">
                <GuestCardForm />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h4>Contact Information</h4>
                <p><Phone size={16} /> 843-278-9003</p>
                <p><Mail size={16} /> info@premierpm.com</p>
                <p><MapPin size={16} /> 123 King Street, Charleston, SC 29401</p>
              </div>
              <div className="footer-section">
                <h4>Services</h4>
                <ul>
                  <li>Property Management</li>
                  <li>Tenant Screening</li>
                  <li>Maintenance Coordination</li>
                  <li>Financial Reporting</li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#">Owner Portal</a></li>
                  <li><a href="#">Tenant Portal</a></li>
                  <li><a href="#">Maintenance Request</a></li>
                  <li><a href="#">Rent Payment</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2024 Premier Property Management. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Render application flow screens
  switch (currentStep) {
    case 'additionalQuestions':
      return <AdditionalQuestions />;
    case 'ownerApplication':
      return <OwnerApplication />;
    case 'success':
      return <SuccessScreen />;
    default:
      return null;
  }
};

export default PropertyManagementSite;
