import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Plus, Trash2 } from 'lucide-react';

const NewLeadModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'Manual Entry',
    assignedTo: 'Sarah Johnson',
    notes: '',
    properties: []
  });

  const [newProperty, setNewProperty] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    petsAllowed: true,
    minRentPrice: ''
  });

  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePropertyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addProperty = () => {
    if (!newProperty.address.trim()) {
      alert('Please enter a property address');
      return;
    }

    const property = {
      id: `prop-${Date.now()}`,
      address: newProperty.address,
      bedrooms: parseInt(newProperty.bedrooms) || 0,
      bathrooms: parseFloat(newProperty.bathrooms) || 0,
      petsAllowed: newProperty.petsAllowed,
      minRentPrice: parseInt(newProperty.minRentPrice) || 0
    };

    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, property]
    }));

    // Reset property form
    setNewProperty({
      address: '',
      bedrooms: '',
      bathrooms: '',
      petsAllowed: true,
      minRentPrice: ''
    });
    setShowPropertyForm(false);
  };

  const removeProperty = (propertyId) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.filter(p => p.id !== propertyId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      status: formData.properties.length > 0 ? 'qualified' : 'partial',
      stage: 'Lead Created',
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: formData.properties.length > 0 ? 100 : 50,
      source: formData.source,
      properties: formData.properties,
      formAnswers: {},
      timeline: [
        {
          id: `event-${Date.now()}`,
          type: 'lead_created',
          description: 'Lead created manually',
          timestamp: new Date().toISOString(),
          user: 'Current User'
        }
      ],
      notes: formData.notes.trim()
    };

    onSave(newLead);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      source: 'Manual Entry',
      assignedTo: 'Sarah Johnson',
      notes: '',
      properties: []
    });
    setNewProperty({
      address: '',
      bedrooms: '',
      bathrooms: '',
      petsAllowed: true,
      minRentPrice: ''
    });
    setShowPropertyForm(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create New Owner Lead</h2>
            <p className="modal-subtitle">Add a new lead to your pipeline</p>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="form-section-title">
                <User size={18} />
                Basic Information
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <span className="error-text">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <span className="error-text">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label required">
                    <Mail size={14} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <Phone size={14} />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Lead Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option>Manual Entry</option>
                    <option>Website Form</option>
                    <option>Phone Call</option>
                    <option>Referral</option>
                    <option>Email</option>
                    <option>Social Media</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option>Sarah Johnson</option>
                    <option>Mike Davis</option>
                    <option>Jessica Martinez</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                  placeholder="Add any additional notes or context..."
                />
              </div>
            </div>

            {/* Properties */}
            <div className="form-section">
              <div className="form-section-header">
                <h3 className="form-section-title">
                  <MapPin size={18} />
                  Properties
                </h3>
                {!showPropertyForm && (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowPropertyForm(true)}
                  >
                    <Plus size={16} />
                    Add Property
                  </button>
                )}
              </div>

              {formData.properties.length > 0 && (
                <div className="properties-list">
                  {formData.properties.map((property) => (
                    <div key={property.id} className="property-card">
                      <div className="property-info">
                        <div className="property-address">{property.address}</div>
                        <div className="property-details">
                          {property.bedrooms} bed • {property.bathrooms} bath
                          {property.minRentPrice > 0 && ` • $${property.minRentPrice.toLocaleString()}/mo`}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => removeProperty(property.id)}
                        title="Remove property"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showPropertyForm && (
                <div className="property-form">
                  <div className="form-group">
                    <label className="form-label">Property Address</label>
                    <input
                      type="text"
                      name="address"
                      value={newProperty.address}
                      onChange={handlePropertyChange}
                      className="form-input"
                      placeholder="123 Main St, Austin, TX 78701"
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={newProperty.bedrooms}
                        onChange={handlePropertyChange}
                        className="form-input"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={newProperty.bathrooms}
                        onChange={handlePropertyChange}
                        className="form-input"
                        step="0.5"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Minimum Rent Price</label>
                      <input
                        type="number"
                        name="minRentPrice"
                        value={newProperty.minRentPrice}
                        onChange={handlePropertyChange}
                        className="form-input"
                        placeholder="2500"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label checkbox-label">
                        <input
                          type="checkbox"
                          name="petsAllowed"
                          checked={newProperty.petsAllowed}
                          onChange={handlePropertyChange}
                        />
                        Pets Allowed
                      </label>
                    </div>
                  </div>

                  <div className="property-form-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => setShowPropertyForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={addProperty}
                    >
                      Add Property
                    </button>
                  </div>
                </div>
              )}

              {formData.properties.length === 0 && !showPropertyForm && (
                <p className="empty-state-text">No properties added yet</p>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLeadModal;

