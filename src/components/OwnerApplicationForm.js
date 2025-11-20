import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, Save, Send, HelpCircle } from 'lucide-react';
import { mockOnboardingForm } from '../mockData';

const OwnerApplicationForm = ({ lead, onSave, onSubmitForReview }) => {
  const [formData, setFormData] = useState(lead.onboardingAnswers || {});
  const [expandedSections, setExpandedSections] = useState({
    'section-owner': true,
    'section-property': true,
    'section-preferences': true,
    'section-documents': true
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    // Clear error when field is edited
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    mockOnboardingForm.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          // For repeatable sections (properties), check each instance
          if (section.repeatable) {
            const propertyCount = lead.properties?.length || 0;
            for (let i = 0; i < propertyCount; i++) {
              const fieldKey = `property-${i}-${field.id}`;
              if (!formData[fieldKey] || formData[fieldKey] === '') {
                newErrors[fieldKey] = `${field.label} is required`;
              }
            }
          } else {
            if (!formData[field.id] || formData[field.id] === '') {
              newErrors[field.id] = `${field.label} is required`;
            }
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      // Show success message
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Error saving:', error);
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmitForReview(formData);
    } else {
      alert('Please complete all required fields before submitting.');
    }
  };

  const calculateSectionProgress = (section) => {
    let totalFields = 0;
    let completedFields = 0;

    section.fields.forEach(field => {
      if (section.repeatable) {
        const propertyCount = lead.properties?.length || 0;
        for (let i = 0; i < propertyCount; i++) {
          totalFields++;
          const fieldKey = `property-${i}-${field.id}`;
          if (formData[fieldKey] && formData[fieldKey] !== '') {
            completedFields++;
          }
        }
      } else {
        totalFields++;
        if (formData[field.id] && formData[field.id] !== '') {
          completedFields++;
        }
      }
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  const renderField = (field, propertyIndex = null) => {
    const fieldKey = propertyIndex !== null ? `property-${propertyIndex}-${field.id}` : field.id;
    const value = formData[fieldKey] || '';
    const error = errors[fieldKey];

    const commonProps = {
      value: value,
      onChange: (e) => handleFieldChange(fieldKey, e.target.value),
      className: `form-input ${error ? 'error' : ''}`
    };

    return (
      <div key={fieldKey} className="form-field">
        <div className="form-label-wrapper">
          <label className="form-label">
            {field.label}
            {field.required && <span className="required-asterisk">*</span>}
          </label>
          {field.helpText && (
            <div className="help-tooltip">
              <HelpCircle size={16} className="help-icon" />
              <span className="tooltip-text">{field.helpText}</span>
            </div>
          )}
        </div>
        
        {field.type === 'text' && (
          <input type="text" {...commonProps} placeholder={field.helpText} />
        )}
        
        {field.type === 'email' && (
          <input type="email" {...commonProps} placeholder="email@example.com" />
        )}
        
        {field.type === 'phone' && (
          <input type="tel" {...commonProps} placeholder="(555) 123-4567" />
        )}
        
        {field.type === 'number' && (
          <input type="number" {...commonProps} />
        )}
        
        {field.type === 'textarea' && (
          <textarea {...commonProps} rows="3" placeholder={field.placeholder} />
        )}
        
        {field.type === 'select' && (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
        
        {field.type === 'date' && (
          <input type="date" {...commonProps} />
        )}
        
        {field.type === 'checkbox' && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value === 'true' || value === true}
              onChange={(e) => handleFieldChange(fieldKey, e.target.checked ? 'true' : 'false')}
              className="form-checkbox"
            />
            <span>{field.helpText}</span>
          </label>
        )}
        
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  };

  const renderSection = (section) => {
    const isExpanded = expandedSections[section.id];
    const progress = calculateSectionProgress(section);
    const isComplete = progress === 100;

    return (
      <div key={section.id} className="application-section">
        <div className="section-header" onClick={() => toggleSection(section.id)}>
          <div className="section-header-left">
            <div className="section-icon">
              {isComplete ? (
                <CheckCircle size={20} className="text-success" />
              ) : (
                <AlertCircle size={20} className="text-warning" />
              )}
            </div>
            <div>
              <h3 className="section-title">{section.title}</h3>
              <div className="section-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="progress-text">{progress}% complete</span>
              </div>
            </div>
          </div>
          <button className="section-toggle">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {isExpanded && (
          <div className="section-content">
            {section.repeatable ? (
              // Render fields for each property
              lead.properties?.map((property, index) => (
                <div key={index} className="property-section">
                  <h4 className="property-title">
                    Property {index + 1}: {property.address || 'New Property'}
                  </h4>
                  <div className="form-grid">
                    {section.fields.map(field => renderField(field, index))}
                  </div>
                </div>
              ))
            ) : (
              <div className="form-grid">
                {section.fields.map(field => renderField(field))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const overallProgress = Math.round(
    mockOnboardingForm.sections.reduce((sum, section) => {
      return sum + calculateSectionProgress(section);
    }, 0) / mockOnboardingForm.sections.length
  );

  const canSubmit = overallProgress === 100;
  const isAwaitingApproval = lead.status === 'under review' && lead.onboardingCompletion === 100;

  return (
    <div className="owner-application-form">
      <div className="application-header">
        <div>
          <h2 className="application-title">Owner Application</h2>
          <p className="application-subtitle">
            Complete all sections to submit your application for review
          </p>
        </div>
        <div className="application-progress-card">
          <div className="progress-circle">
            <svg width="60" height="60">
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="5"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#10b981"
                strokeWidth="5"
                strokeDasharray={`${overallProgress * 1.57} 157`}
                transform="rotate(-90 30 30)"
              />
            </svg>
            <span className="progress-percentage">{overallProgress}%</span>
          </div>
          <div>
            <p className="progress-label">Overall Progress</p>
            {isAwaitingApproval && (
              <span className="status-badge awaiting">Awaiting Approval</span>
            )}
          </div>
        </div>
      </div>

      {isAwaitingApproval && (
        <div className="alert alert-info">
          <AlertCircle size={18} />
          <div>
            <strong>Application Submitted</strong>
            <p>Your application is being reviewed by our team. We'll contact you soon!</p>
          </div>
        </div>
      )}

      <div className="sections-container">
        {mockOnboardingForm.sections.map(section => renderSection(section))}
      </div>

      <div className="form-actions">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-secondary"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={false}
          className="btn btn-primary"
        >
          <Send size={18} />
          Submit Application
        </button>
      </div>

      {!canSubmit && !isAwaitingApproval && (
        <p className="form-notice">
          Complete all required fields (marked with *) to submit your application
        </p>
      )}
    </div>
  );
};

export default OwnerApplicationForm;

