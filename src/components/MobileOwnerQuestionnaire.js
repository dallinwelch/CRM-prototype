import React, { useState } from 'react';
import { 
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Home,
  FileText,
  User,
  DollarSign
} from 'lucide-react';

// Questions for the owner questionnaire (mobile-optimized)
const questionnaireQuestions = [
  {
    id: 'contact-info',
    section: 'Contact Information',
    icon: <User size={20} />,
    questions: [
      {
        id: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'John'
      },
      {
        id: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Smith'
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'john@example.com'
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: '(555) 123-4567'
      }
    ]
  },
  {
    id: 'property-details',
    section: 'Property Details',
    icon: <Home size={20} />,
    questions: [
      {
        id: 'propertyAddress',
        label: 'Property Address',
        type: 'textarea',
        required: true,
        placeholder: 'Enter full property address including street, city, state, and zip code',
        help: 'Include street, city, state, and ZIP code'
      },
      {
        id: 'propertyType',
        label: 'Property Type',
        type: 'select',
        required: true,
        options: ['', 'Single Family', 'Multi-Family', 'Condo', 'Townhouse', 'Commercial', 'Other']
      },
      {
        id: 'bedrooms',
        label: 'Number of Bedrooms',
        type: 'number',
        required: true,
        placeholder: '3'
      },
      {
        id: 'bathrooms',
        label: 'Number of Bathrooms',
        type: 'number',
        required: true,
        placeholder: '2',
        step: '0.5'
      }
    ]
  },
  {
    id: 'rental-preferences',
    section: 'Rental Preferences',
    icon: <DollarSign size={20} />,
    questions: [
      {
        id: 'desiredRent',
        label: 'Desired Monthly Rent',
        type: 'number',
        required: true,
        placeholder: '2500',
        prefix: '$'
      },
      {
        id: 'petsAllowed',
        label: 'Do you allow pets?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes, pets allowed' },
          { value: 'no', label: 'No pets' },
          { value: 'negotiable', label: 'Case by case' }
        ]
      },
      {
        id: 'availableDate',
        label: 'When is the property available?',
        type: 'select',
        required: true,
        options: ['', 'Immediately', 'Within 1 month', '1-3 months', '3-6 months', 'More than 6 months']
      },
      {
        id: 'furnished',
        label: 'Is the property furnished?',
        type: 'radio',
        required: false,
        options: [
          { value: 'yes', label: 'Fully furnished' },
          { value: 'partial', label: 'Partially furnished' },
          { value: 'no', label: 'Unfurnished' }
        ]
      }
    ]
  },
  {
    id: 'additional-info',
    section: 'Additional Information',
    icon: <FileText size={20} />,
    questions: [
      {
        id: 'currentlyManaged',
        label: 'Is your property currently professionally managed?',
        type: 'radio',
        required: false,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No, I self-manage' },
          { value: 'first', label: 'This is my first rental property' }
        ]
      },
      {
        id: 'propertyCount',
        label: 'How many properties do you own?',
        type: 'select',
        required: false,
        options: ['', '1', '2-3', '4-5', '6-10', 'More than 10']
      },
      {
        id: 'specificNeeds',
        label: 'What services are you looking for? *',
        type: 'select',
        required: true,
        options: [
          '',
          'Full property management',
          'Tenant placement only',
          'Maintenance coordination',
          'Lease renewals',
          'Financial reporting',
          'Other'
        ],
        help: 'Select the main service you need'
      },
      {
        id: 'currentSituation',
        label: 'Your Current Situation *',
        type: 'select',
        required: true,
        options: [
          '',
          'Currently self-managing',
          'Switching from another PM',
          'New property owner',
          'Property is vacant',
          'Have existing tenants'
        ]
      },
      {
        id: 'additionalNotes',
        label: 'Tell Us More About Your Needs *',
        type: 'textarea',
        required: true,
        placeholder: 'Please be specific about what you\'re looking for. For example:\n- "Need help finding quality tenants for my 3-bedroom house"\n- "Current property manager isn\'t handling maintenance well"\n- "Looking to rent out my home while I\'m relocated for work"\n\n(Generic messages like "I am interested" will delay our response)',
        help: 'The more detail you provide, the faster we can help you!',
        rows: 5
      }
    ]
  }
];

const MobileOwnerQuestionnaire = ({ onComplete }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const currentSection = questionnaireQuestions[currentSectionIndex];
  const totalSections = questionnaireQuestions.length;

  const updateFormData = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const canProgress = () => {
    const requiredFields = currentSection.questions.filter(q => q.required);
    return requiredFields.every(field => {
      const value = formData[field.id];
      return value && value.toString().trim() !== '';
    });
  };

  const calculateProgress = () => {
    return Math.round(((currentSectionIndex + 1) / totalSections) * 100);
  };

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete questionnaire
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    console.log('Questionnaire submitted:', formData);
    setIsComplete(true);
    
    // In a real app, this would send data to the backend
    if (onComplete) {
      onComplete(formData);
    }
  };

  const renderField = (question) => {
    const value = formData[question.id] || '';

    switch (question.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={question.type}
            className="mobile-form-input"
            value={value}
            onChange={(e) => updateFormData(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
          />
        );

      case 'number':
        return (
          <div style={{ position: 'relative' }}>
            {question.prefix && (
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                fontWeight: 500
              }}>
                {question.prefix}
              </span>
            )}
            <input
              type="number"
              className="mobile-form-input"
              style={question.prefix ? { paddingLeft: '32px' } : {}}
              value={value}
              onChange={(e) => updateFormData(question.id, e.target.value)}
              placeholder={question.placeholder}
              step={question.step || '1'}
              required={question.required}
            />
          </div>
        );

      case 'textarea':
        return (
          <textarea
            className="mobile-form-textarea"
            value={value}
            onChange={(e) => updateFormData(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            className="mobile-form-select"
            value={value}
            onChange={(e) => updateFormData(question.id, e.target.value)}
            required={question.required}
          >
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option || 'Select an option...'}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="mobile-radio-group">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`mobile-radio-option ${value === option.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => updateFormData(question.id, e.target.value)}
                  style={{ accentColor: '#3b82f6' }}
                />
                <span className="mobile-radio-label">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="mobile-success-screen">
        <div className="mobile-success-content">
          <div className="mobile-success-icon">
            <CheckCircle size={80} color="#10b981" />
          </div>
          
          <h2>Thank You!</h2>
          <p className="mobile-success-message">
            Your property information has been successfully submitted. Our team will review your details and contact you within 24 hours.
          </p>
          
          <div className="mobile-next-steps">
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your property details</li>
              <li>We'll conduct a market analysis for your property</li>
              <li>You'll receive a personalized rental proposal</li>
              <li>We'll schedule a property walkthrough</li>
            </ul>
          </div>
          
          <div className="mobile-contact-info">
            <p>
              <strong>Questions?</strong><br />
              Call us at (555) 123-4567<br />
              Email: info@premierpm.com
            </p>
          </div>
          
          <button 
            className="mobile-btn mobile-btn-primary"
            onClick={() => {
              setIsComplete(false);
              setCurrentSectionIndex(0);
              setFormData({});
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Submit Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-questionnaire">
      {/* Header */}
      <div className="mobile-questionnaire-header">
        <div className="mobile-questionnaire-logo">
          <div className="mobile-questionnaire-logo-icon">R</div>
          <div className="mobile-questionnaire-logo-text">RentVine Owner Application</div>
        </div>
        
        <div className="mobile-questionnaire-progress">
          <div className="mobile-progress-bar">
            <div 
              className="mobile-progress-fill"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <span className="mobile-progress-text">{calculateProgress()}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="mobile-questionnaire-content">
        <div className="mobile-question-card">
          <div className="mobile-question-number">
            Section {currentSectionIndex + 1} of {totalSections}
          </div>
          
          <h2 className="mobile-question-title">
            {currentSection.icon} {currentSection.section}
          </h2>
          
          <p className="mobile-question-subtitle">
            Please provide the following information about your property.
          </p>
          
          {currentSection.questions.map((question, index) => (
            <div key={question.id} className="mobile-form-group">
              <label className="mobile-form-label">
                {question.label}
                {question.required && <span className="required">*</span>}
              </label>
              {renderField(question)}
              {question.help && (
                <p className="mobile-form-help">{question.help}</p>
              )}
            </div>
          ))}
        </div>

        {/* Information Card */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#1e40af',
            margin: 0,
            lineHeight: 1.5
          }}>
            <strong>💡 Tip:</strong> All information is kept confidential and will only be used to provide you with an accurate property management proposal.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mobile-questionnaire-footer">
        <div className="mobile-footer-buttons">
          {currentSectionIndex > 0 && (
            <button
              className="mobile-btn mobile-btn-secondary"
              onClick={handleBack}
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
          
          <button
            className="mobile-btn mobile-btn-primary"
            onClick={handleNext}
            disabled={!canProgress()}
            style={currentSectionIndex === 0 ? { flex: 1 } : {}}
          >
            {currentSectionIndex === totalSections - 1 ? (
              <>
                Submit
                <CheckCircle size={20} />
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileOwnerQuestionnaire;

