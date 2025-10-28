import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  AlertCircle,
  User,
  Home,
  PenTool
} from 'lucide-react';
import { mockOnboardingForm } from '../mockData';

const OwnerOnboarding = ({ leadName = 'Owner', onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [properties, setProperties] = useState([{}]); // Start with one empty property
  const [formData, setFormData] = useState({});

  const sections = mockOnboardingForm.sections;
  const currentSection = sections[currentStep];

  const isOwnerSection = currentSection.id === 'owner-info';
  const isPropertySection = currentSection.id === 'property-info';
  const isDocumentSection = currentSection.id === 'documents';

  const updateFormData = (fieldId, value) => {
    if (isPropertySection) {
      const newProperties = [...properties];
      newProperties[currentPropertyIndex] = {
        ...newProperties[currentPropertyIndex],
        [fieldId]: value
      };
      setProperties(newProperties);
    } else {
      setFormData({
        ...formData,
        [fieldId]: value
      });
    }
  };

  const getFieldValue = (fieldId) => {
    if (isPropertySection) {
      return properties[currentPropertyIndex]?.[fieldId] || '';
    }
    return formData[fieldId] || '';
  };

  const addProperty = () => {
    setProperties([...properties, {}]);
    setCurrentPropertyIndex(properties.length);
  };

  const removeProperty = (index) => {
    if (properties.length > 1) {
      const newProperties = properties.filter((_, i) => i !== index);
      setProperties(newProperties);
      if (currentPropertyIndex >= newProperties.length) {
        setCurrentPropertyIndex(newProperties.length - 1);
      }
    }
  };

  const canProgress = () => {
    if (isPropertySection) {
      const currentProperty = properties[currentPropertyIndex];
      const requiredFields = currentSection.fields.filter(f => f.required);
      return requiredFields.every(field => currentProperty?.[field.id]);
    } else {
      const requiredFields = currentSection.fields.filter(f => f.required);
      return requiredFields.every(field => formData[field.id]);
    }
  };

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentPropertyIndex(0);
    } else {
      // Complete onboarding
      console.log('Complete onboarding:', { formData, properties });
      if (onComplete) onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentPropertyIndex(0);
    }
  };

  const calculateProgress = () => {
    const totalSections = sections.length;
    return Math.round(((currentStep + 1) / totalSections) * 100);
  };

  const renderField = (field) => {
    const value = getFieldValue(field.id);

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            className="form-input"
            value={value}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            placeholder={field.helpText}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            className="form-input"
            value={value}
            onChange={(e) => updateFormData(field.id, e.target.value)}
            placeholder={field.helpText}
            rows={3}
          />
        );
      
      case 'select':
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) => updateFormData(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'document':
        return (
          <div className="document-upload">
            <div className="upload-zone">
              <Upload size={32} />
              <p>Click to upload or drag and drop</p>
              <span className="upload-hint">PDF, DOC up to 10MB</span>
            </div>
            {value && (
              <div className="uploaded-file">
                <FileText size={18} />
                <span>{field.label} - uploaded</span>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'owner-info': return <User size={20} />;
      case 'property-info': return <Home size={20} />;
      case 'documents': return <PenTool size={20} />;
      default: return <Circle size={20} />;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <div>
          <h1 className="onboarding-title">Owner Onboarding Application</h1>
          <p className="onboarding-subtitle">Welcome, {leadName}! Complete your application to get started.</p>
        </div>
        <div className="onboarding-progress-header">
          <span className="progress-text">{calculateProgress()}% Complete</span>
          <div className="progress-bar-sm">
            <div 
              className="progress-fill"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="onboarding-steps">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            <div className="step-icon">
              {index < currentStep ? (
                <CheckCircle size={24} />
              ) : (
                getSectionIcon(section.id)
              )}
            </div>
            <div className="step-info">
              <div className="step-number">Step {index + 1}</div>
              <div className="step-title">{section.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="onboarding-content">
        <div className="onboarding-section-header">
          <h2>{currentSection.title}</h2>
          {isPropertySection && (
            <div className="property-tabs">
              {properties.map((_, index) => (
                <button
                  key={index}
                  className={`property-tab ${index === currentPropertyIndex ? 'active' : ''}`}
                  onClick={() => setCurrentPropertyIndex(index)}
                >
                  Property {index + 1}
                  {properties.length > 1 && (
                    <button
                      className="property-tab-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProperty(index);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </button>
              ))}
              <button
                className="property-tab property-tab-add"
                onClick={addProperty}
              >
                <Plus size={16} />
                Add Property
              </button>
            </div>
          )}
        </div>

        <form className="onboarding-form">
          {currentSection.fields.map(field => (
            <div key={field.id} className="form-group">
              <label className="form-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              {renderField(field)}
              {field.helpText && !['text', 'number'].includes(field.type) && (
                <p className="form-help">{field.helpText}</p>
              )}
            </div>
          ))}
        </form>

        {isPropertySection && properties.length > 1 && (
          <div className="properties-summary">
            <h3>Properties Summary</h3>
            <div className="properties-summary-list">
              {properties.map((property, index) => (
                <div key={index} className="property-summary-item">
                  <div className="property-summary-icon">
                    <Home size={20} />
                  </div>
                  <div className="property-summary-info">
                    <div className="property-summary-title">
                      Property {index + 1}
                      {index === currentPropertyIndex && (
                        <span className="badge badge-primary">Current</span>
                      )}
                    </div>
                    <div className="property-summary-details">
                      {property['property-address'] ? (
                        property['property-address']
                      ) : (
                        <span className="text-muted">Not completed</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setCurrentPropertyIndex(index)}
                  >
                    {index === currentPropertyIndex ? 'Editing' : 'Edit'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="onboarding-footer">
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="onboarding-footer-info">
          Step {currentStep + 1} of {sections.length}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!canProgress()}
        >
          {currentStep === sections.length - 1 ? 'Submit Application' : 'Next'}
          <ChevronRight size={18} />
        </button>
      </div>

      {!canProgress() && (
        <div className="onboarding-warning">
          <AlertCircle size={18} />
          Please complete all required fields before continuing
        </div>
      )}
    </div>
  );
};

export default OwnerOnboarding;

