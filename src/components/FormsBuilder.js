import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Trash2,
  GripVertical,
  Type,
  Hash,
  List,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  FileText,
  Save,
  ArrowLeft,
  AlertCircle,
  Settings,
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { mockLeadQuestionnaireForm, mockOnboardingForm } from '../mockData';
import { customPropertyFields } from './CRMSettings';

const FormsBuilder = ({ formType = 'lead-questionnaire', onBack }) => {
  const [form, setForm] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Load form data on mount
  useEffect(() => {
    const formData = formType === 'lead-questionnaire' 
      ? JSON.parse(JSON.stringify(mockLeadQuestionnaireForm))
      : JSON.parse(JSON.stringify(mockOnboardingForm));
    
    setForm(formData);
    if (formData.sections.length > 0) {
      setActiveSection(formData.sections[0].id);
    }
  }, [formType]);

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'textarea', label: 'Text Area', icon: FileText },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'date', label: 'Date', icon: Calendar }
  ];

  const isLeadQuestionnaire = formType === 'lead-questionnaire';

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const addCustomPropertyField = (sectionId, customField) => {
    const section = form.sections.find(s => s.id === sectionId);
    const newField = {
      id: `field-${Date.now()}`,
      label: customField.label,
      type: customField.type,
      required: false,
      order: section.fields.length + 1,
      helpText: '',
      options: customField.options ? [...customField.options] : undefined,
      customPropertyId: customField.id // Link to the property system
    };
    
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      )
    });
    setHasChanges(true);
  };

  const addCustomPropertyCategory = (sectionId, categoryKey, categoryData) => {
    const section = form.sections.find(s => s.id === sectionId);
    const timestamp = Date.now();
    
    // Create all fields from this category
    const newFields = categoryData.fields.map((field, index) => ({
      id: `field-${timestamp}-${index}`,
      label: field.label,
      type: field.type,
      required: false,
      order: section.fields.length + index + 1,
      helpText: '',
      options: field.options ? [...field.options] : undefined,
      customPropertyId: field.id,
      categoryGroup: categoryKey, // Mark as part of a category group
      categoryLabel: categoryData.category
    }));
    
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: [...s.fields, ...newFields] }
          : s
      )
    });
    setHasChanges(true);
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      order: form.sections.length + 1,
      fields: []
    };
    setForm({
      ...form,
      sections: [...form.sections, newSection]
    });
    setActiveSection(newSection.id);
    setHasChanges(true);
  };

  const deleteSection = (sectionId) => {
    if (form.sections.length <= 1) {
      alert('You must have at least one section');
      return;
    }
    
    const newSections = form.sections.filter(s => s.id !== sectionId);
    setForm({
      ...form,
      sections: newSections
    });
    
    if (activeSection === sectionId && newSections.length > 0) {
      setActiveSection(newSections[0].id);
    }
    setHasChanges(true);
  };

  const updateSectionTitle = (sectionId, title) => {
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId ? { ...s, title } : s
      )
    });
    setHasChanges(true);
  };

  const toggleSectionRepeatable = (sectionId) => {
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId ? { ...s, repeatable: !s.repeatable } : s
      )
    });
    setHasChanges(true);
  };

  const addField = (sectionId, fieldType = 'text') => {
    const section = form.sections.find(s => s.id === sectionId);
    const newField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type: fieldType,
      required: isLeadQuestionnaire ? false : false,
      order: section.fields.length + 1,
      helpText: '',
      options: (fieldType === 'select' || fieldType === 'checkbox') ? [] : undefined
    };
    
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: [...s.fields, newField] }
          : s
      )
    });
    setHasChanges(true);
  };

  const duplicateField = (sectionId, field) => {
    const newField = {
      ...field,
      id: `field-${Date.now()}`,
      label: `${field.label} (Copy)`,
      order: field.order + 1
    };
    
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId
          ? { 
              ...s, 
              fields: [
                ...s.fields.slice(0, s.fields.findIndex(f => f.id === field.id) + 1),
                newField,
                ...s.fields.slice(s.fields.findIndex(f => f.id === field.id) + 1)
              ]
            }
          : s
      )
    });
    setHasChanges(true);
  };

  const updateField = (sectionId, fieldId, updates) => {
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
              )
            }
          : s
      )
    });
    setHasChanges(true);
  };

  const deleteField = (sectionId, fieldId) => {
    if (editingField === fieldId) {
      setEditingField(null);
    }
    setForm({
      ...form,
      sections: form.sections.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
          : s
      )
    });
    setHasChanges(true);
  };

  const handleDragStart = (e, sectionId, fieldId) => {
    setDraggedField({ sectionId, fieldId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSectionId, targetFieldId) => {
    e.preventDefault();
    
    if (!draggedField) return;
    
    const { sectionId: sourceSectionId, fieldId: sourceFieldId } = draggedField;
    
    if (sourceSectionId === targetSectionId && sourceFieldId === targetFieldId) {
      setDraggedField(null);
      return;
    }

    // Get the source and target sections
    const sourceSection = form.sections.find(s => s.id === sourceSectionId);
    const targetSection = form.sections.find(s => s.id === targetSectionId);
    
    const sourceField = sourceSection.fields.find(f => f.id === sourceFieldId);
    const targetIndex = targetSection.fields.findIndex(f => f.id === targetFieldId);

    // Remove from source
    const newSourceFields = sourceSection.fields.filter(f => f.id !== sourceFieldId);
    
    // Add to target at the correct position
    let newTargetFields;
    if (sourceSectionId === targetSectionId) {
      // Same section - reorder
      newTargetFields = [...newSourceFields];
      newTargetFields.splice(targetIndex, 0, sourceField);
    } else {
      // Different section - move
      newTargetFields = [...targetSection.fields];
      newTargetFields.splice(targetIndex, 0, sourceField);
    }

    // Update form
    setForm({
      ...form,
      sections: form.sections.map(s => {
        if (s.id === sourceSectionId && s.id === targetSectionId) {
          return { ...s, fields: newTargetFields };
        } else if (s.id === sourceSectionId) {
          return { ...s, fields: newSourceFields };
        } else if (s.id === targetSectionId) {
          return { ...s, fields: newTargetFields };
        }
        return s;
      })
    });

    setDraggedField(null);
    setHasChanges(true);
  };

  const saveForm = () => {
    console.log('Saving form:', form);
    alert('Form saved successfully! (Mock save - no backend)');
    setHasChanges(false);
  };

  if (!form) {
    return <div className="loading">Loading form...</div>;
  }

  const currentSection = form.sections.find(s => s.id === activeSection);

  const FieldSettingsPanel = ({ field, sectionId, onClose }) => {
    const handleOptionsChange = (value) => {
      const optionsArray = value.split('\n').filter(opt => opt.trim() !== '');
      updateField(sectionId, field.id, { options: optionsArray });
    };

    return (
      <div className="field-settings-panel">
        <div className="field-settings-header">
          <h3>Field Settings</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <div className="field-settings-content">
          <div className="form-group">
            <label>Field Type</label>
            <select
              className="form-select"
              value={field.type}
              onChange={(e) => {
                const newType = e.target.value;
                const updates = { type: newType };
                
                if (newType === 'select' || newType === 'checkbox') {
                  if (!field.options) {
                    updates.options = [];
                  }
                } else {
                  updates.options = undefined;
                }
                
                updateField(sectionId, field.id, updates);
              }}
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {(field.type === 'select' || field.type === 'checkbox') && (
            <div className="form-group">
              <label>Options (one per line)</label>
              <textarea
                className="form-input"
                rows={6}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={field.options ? field.options.join('\n') : ''}
                onChange={(e) => handleOptionsChange(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Help Text</label>
            <input
              type="text"
              className="form-input"
              placeholder="Optional help text for users"
              value={field.helpText || ''}
              onChange={(e) => updateField(sectionId, field.id, { helpText: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(sectionId, field.id, { required: e.target.checked })}
                disabled={isLeadQuestionnaire}
              />
              <span>Required field</span>
            </label>
            {isLeadQuestionnaire && (
              <p className="help-text" style={{ marginTop: '4px', color: '#6b7280', fontSize: '12px' }}>
                Lead questionnaire cannot have required fields
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PreviewField = ({ field, sectionId, isDragging }) => {
    const isEditing = editingField === field.id;
    
    return (
      <div 
        className={`preview-field-item ${isDragging ? 'dragging' : ''} ${field.categoryGroup ? 'grouped-field' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, sectionId, field.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, sectionId, field.id)}
      >
        <button 
          className="field-drag-handle-side"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
        
        <div className="preview-field-content">
          <div className="preview-field-header">
            <input
              type="text"
              className="preview-field-label-input"
              value={field.label}
              onChange={(e) => updateField(sectionId, field.id, { label: e.target.value })}
              placeholder="Field label"
            />
            <div className="preview-field-badges">
              {field.categoryGroup && (
                <span className="field-category-badge" title="Auto-syncs with Property Info">
                  {field.categoryLabel}
                </span>
              )}
              {field.required && <span className="field-required-badge">Required</span>}
              <span className="field-type-badge">{field.type}</span>
            </div>
          </div>
          
          {field.helpText && (
            <input
              type="text"
              className="preview-help-text-input"
              value={field.helpText}
              onChange={(e) => updateField(sectionId, field.id, { helpText: e.target.value })}
              placeholder="Help text"
            />
          )}
          
          <div className="preview-input-display">
            {field.type === 'textarea' ? (
              <textarea className="form-input" rows={3} disabled placeholder="User will enter text here..." />
            ) : field.type === 'select' ? (
              <select className="form-select" disabled>
                <option>Select...</option>
                {field.options && field.options.map((opt, idx) => (
                  <option key={idx}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="preview-checkbox-group">
                {field.options && field.options.length > 0 ? (
                  field.options.map((opt, idx) => (
                    <label key={idx} className="checkbox-label">
                      <input type="checkbox" disabled />
                      <span>{opt}</span>
                    </label>
                  ))
                ) : (
                  <label className="checkbox-label">
                    <input type="checkbox" disabled />
                    <span>Checkbox option</span>
                  </label>
                )}
              </div>
            ) : (
              <input type={field.type} className="form-input" disabled placeholder="User will enter information here..." />
            )}
          </div>
        </div>
        
        <div className="preview-field-actions">
          <button
            className="btn-icon"
            onClick={() => setEditingField(isEditing ? null : field.id)}
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            className="btn-icon"
            onClick={() => duplicateField(sectionId, field)}
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            className="btn-icon btn-icon-danger"
            onClick={() => deleteField(sectionId, field.id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {isEditing && (
          <FieldSettingsPanel 
            field={field} 
            sectionId={sectionId}
            onClose={() => setEditingField(null)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="forms-builder">
      <div className="builder-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onBack && (
            <button className="btn btn-secondary" onClick={onBack}>
              <ArrowLeft size={18} />
              Back to Settings
            </button>
          )}
          <div>
            <h1 className="builder-title">{form.name}</h1>
            <p className="builder-subtitle">{form.description}</p>
            {isLeadQuestionnaire && (
              <div className="builder-notice">
                <AlertCircle size={16} />
                <span>Note: Lead questionnaire fields cannot be marked as required</span>
              </div>
            )}
          </div>
        </div>
        <div className="builder-actions">
          <button 
            className={`btn btn-primary ${hasChanges ? 'has-changes' : ''}`}
            onClick={saveForm}
          >
            <Save size={18} />
            {hasChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="builder-visual-content">
        {/* Sections Sidebar */}
        <div className="builder-sections-nav">
          <div className="sections-nav-header">
            <h3>Sections</h3>
            <button className="btn-icon" onClick={addSection} title="Add section">
              <Plus size={16} />
            </button>
          </div>
          <div className="sections-nav-list">
            {form.sections.map(section => (
              <div
                key={section.id}
                className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
              >
                <button
                  className="section-nav-button"
                  onClick={() => setActiveSection(section.id)}
                >
                  <span>{section.title}</span>
                  <span className="section-field-count">{section.fields.length}</span>
                </button>
                {form.sections.length > 1 && (
                  <button
                    className="btn-icon-sm"
                    onClick={() => deleteSection(section.id)}
                    title="Delete section"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="builder-preview-main">
          {currentSection && (
            <>
              <div className="section-preview-header">
                <input
                  type="text"
                  className="section-title-input-large"
                  value={currentSection.title}
                  placeholder="Section Title"
                  onChange={(e) => updateSectionTitle(activeSection, e.target.value)}
                />
                <div className="section-header-actions">
                  {formType === 'onboarding-application' && (
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={currentSection.repeatable || false}
                        onChange={() => toggleSectionRepeatable(activeSection)}
                      />
                      <span>Repeatable Section</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="preview-fields-list">
                {currentSection.fields.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={48} style={{ opacity: 0.2 }} />
                    <p>No fields yet. Add your first field below.</p>
                  </div>
                ) : (
                  currentSection.fields.map(field => (
                    <PreviewField
                      key={field.id}
                      field={field}
                      sectionId={currentSection.id}
                      isDragging={draggedField?.fieldId === field.id}
                    />
                  ))
                )}
              </div>

              {/* Add Field Buttons */}
              <div className="add-field-section">
                <h4>Add Field</h4>
                <div className="add-field-buttons">
                  {fieldTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        className="add-field-button"
                        onClick={() => addField(currentSection.id, type.value)}
                        title={`Add ${type.label} field`}
                      >
                        <Icon size={18} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Property Fields - Only for Onboarding Application */}
              {formType === 'onboarding-application' && (
                <div className="custom-property-fields-section">
                  <div className="custom-fields-section-header">
                    <h4>Add from Property Info</h4>
                    <p>Add grouped fields from your property management system - they will auto-sync</p>
                  </div>
                  <div className="custom-property-categories">
                    {Object.entries(customPropertyFields).map(([key, categoryData]) => (
                      <div key={key} className="custom-property-category">
                        <button 
                          className="custom-category-header"
                          onClick={() => toggleCategory(key)}
                        >
                          {expandedCategories[key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          <span className="custom-category-name">{categoryData.category}</span>
                          <span className="custom-field-count">{categoryData.fields.length} fields</span>
                        </button>
                        {expandedCategories[key] && (
                          <div className="custom-category-fields">
                            <div className="category-add-all-button-wrapper">
                              <button
                                className="category-add-all-button"
                                onClick={() => addCustomPropertyCategory(currentSection.id, key, categoryData)}
                                title={`Add all ${categoryData.category} fields`}
                              >
                                <Plus size={16} />
                                <span>Add All {categoryData.category} Fields</span>
                              </button>
                            </div>
                            <div className="category-fields-preview">
                              <span className="preview-label">Includes:</span>
                              {categoryData.fields.map((field, index) => (
                                <span key={field.id} className="field-preview-item">
                                  {field.label}
                                  {index < categoryData.fields.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="custom-fields-info">
                    <AlertCircle size={14} />
                    <span>Fields added from Property Info automatically sync with your property management data</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormsBuilder;
