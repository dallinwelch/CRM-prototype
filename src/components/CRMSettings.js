import React, { useState } from 'react';
import { 
  Users,
  Shield,
  Mail,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { mockUsers, mockTemplates, currentUser, mockLeadQuestionnaireForm, mockOnboardingForm } from '../mockData';

const CRMSettings = ({ onEditForm }) => {
  const [activeSection, setActiveSection] = useState('permissions');
  const [users, setUsers] = useState(mockUsers);
  const [templates, setTemplates] = useState(mockTemplates);
  const [editingUser, setEditingUser] = useState(null);

  const canEdit = currentUser.role === 'Manager' || currentUser.role === 'Admin';

  // Calculate form stats
  const getFormStats = (formType) => {
    const form = formType === 'lead-questionnaire' ? mockLeadQuestionnaireForm : mockOnboardingForm;
    const totalFields = form.sections.reduce((acc, section) => acc + section.fields.length, 0);
    const requiredFields = form.sections.reduce((acc, section) => 
      acc + section.fields.filter(f => f.required).length, 0
    );
    return {
      sections: form.sections.length,
      fields: totalFields,
      required: requiredFields,
      version: form.version
    };
  };

  const togglePermission = (userId, permission) => {
    if (!canEdit) return;

    setUsers(users.map(user => 
      user.id === userId
        ? {
            ...user,
            permissions: {
              ...user.permissions,
              [permission]: !user.permissions[permission]
            }
          }
        : user
    ));
  };

  const PermissionsSection = () => (
    <div className="settings-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Shield size={24} />
            CRM Permissions
          </h2>
          <p className="section-subtitle">
            Manage user permissions for Owner CRM features
          </p>
        </div>
      </div>

      {!canEdit && (
        <div className="permissions-notice">
          <AlertCircle size={18} />
          <span>You don't have permission to modify user permissions. Contact your admin.</span>
        </div>
      )}

      <div className="permissions-table-container">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Approve Owner Leads</th>
              <th>Approve Owner Onboarding</th>
              <th>Create/Edit Automations</th>
              <th>Create/Edit Templates</th>
              <th>Assign Leads</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="role-badge">{user.role}</span>
                </td>
                <td>
                  <button
                    className={`permission-toggle ${user.permissions.approveOwnerLeads ? 'enabled' : 'disabled'}`}
                    onClick={() => togglePermission(user.id, 'approveOwnerLeads')}
                    disabled={!canEdit}
                  >
                    {user.permissions.approveOwnerLeads ? <Check size={16} /> : <X size={16} />}
                  </button>
                </td>
                <td>
                  <button
                    className={`permission-toggle ${user.permissions.approveOwnerOnboarding ? 'enabled' : 'disabled'}`}
                    onClick={() => togglePermission(user.id, 'approveOwnerOnboarding')}
                    disabled={!canEdit}
                  >
                    {user.permissions.approveOwnerOnboarding ? <Check size={16} /> : <X size={16} />}
                  </button>
                </td>
                <td>
                  <button
                    className={`permission-toggle ${user.permissions.createEditAutomations ? 'enabled' : 'disabled'}`}
                    onClick={() => togglePermission(user.id, 'createEditAutomations')}
                    disabled={!canEdit}
                  >
                    {user.permissions.createEditAutomations ? <Check size={16} /> : <X size={16} />}
                  </button>
                </td>
                <td>
                  <button
                    className={`permission-toggle ${user.permissions.createEditTemplates ? 'enabled' : 'disabled'}`}
                    onClick={() => togglePermission(user.id, 'createEditTemplates')}
                    disabled={!canEdit}
                  >
                    {user.permissions.createEditTemplates ? <Check size={16} /> : <X size={16} />}
                  </button>
                </td>
                <td>
                  <button
                    className={`permission-toggle ${user.permissions.assignLeads ? 'enabled' : 'disabled'}`}
                    onClick={() => togglePermission(user.id, 'assignLeads')}
                    disabled={!canEdit}
                  >
                    {user.permissions.assignLeads ? <Check size={16} /> : <X size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="permissions-help">
        <h3>Permission Descriptions</h3>
        <ul>
          <li><strong>Approve Owner Leads:</strong> Can approve or deny owner leads to move them into onboarding</li>
          <li><strong>Approve Owner Onboarding:</strong> Can give final approval on completed onboarding applications</li>
          <li><strong>Create/Edit Automations:</strong> Can create, modify, and manage automation workflows</li>
          <li><strong>Create/Edit Templates:</strong> Can create and edit email/SMS communication templates</li>
          <li><strong>Assign Leads:</strong> Can assign leads and tasks to users</li>
        </ul>
      </div>
    </div>
  );

  const TemplatesSection = () => (
    <div className="settings-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <FileText size={24} />
            Communication Templates
          </h2>
          <p className="section-subtitle">
            Manage email and SMS templates for owner communications
          </p>
        </div>
        {canEdit && (
          <button className="btn btn-primary">
            <Plus size={18} />
            New Template
          </button>
        )}
      </div>

      {/* Email Templates */}
      <div className="templates-subsection">
        <h3 className="subsection-title">
          <Mail size={20} />
          Email Templates
        </h3>
        <div className="templates-list">
          {templates.email.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-card-header">
                <div>
                  <h4 className="template-name">{template.name}</h4>
                  <p className="template-subject">{template.subject}</p>
                </div>
                {canEdit && (
                  <div className="template-actions">
                    <button className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="template-body">
                {template.body.substring(0, 150)}...
              </div>
              <div className="template-variables">
                <span className="variables-label">Variables:</span>
                {template.variables.map(variable => (
                  <span key={variable} className="variable-tag">
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SMS Templates */}
      <div className="templates-subsection">
        <h3 className="subsection-title">
          <MessageSquare size={20} />
          SMS Templates
        </h3>
        <div className="templates-list">
          {templates.sms.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-card-header">
                <div>
                  <h4 className="template-name">{template.name}</h4>
                </div>
                {canEdit && (
                  <div className="template-actions">
                    <button className="btn-icon">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="template-body">
                {template.body}
              </div>
              <div className="template-variables">
                <span className="variables-label">Variables:</span>
                {template.variables.map(variable => (
                  <span key={variable} className="variable-tag">
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FormsSection = () => {
    const questionnaireStats = getFormStats('lead-questionnaire');
    const onboardingStats = getFormStats('onboarding-application');

    return (
      <div className="settings-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <FileText size={24} />
              Forms & Applications
            </h2>
            <p className="section-subtitle">
              Manage owner lead questionnaire and onboarding application forms
            </p>
          </div>
        </div>

        <div className="forms-list">
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-icon">
                <FileText size={24} />
              </div>
              <div>
                <h3>Owner Lead Questionnaire</h3>
                <p>Qualifying questions for new owner leads</p>
                <span className="form-notice-badge">No required fields allowed</span>
              </div>
            </div>
            <div className="form-card-stats">
              <div className="stat">
                <span className="stat-label">Sections</span>
                <span className="stat-value">{questionnaireStats.sections}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Questions</span>
                <span className="stat-value">{questionnaireStats.fields}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Version</span>
                <span className="stat-value">{questionnaireStats.version}</span>
              </div>
            </div>
            {canEdit && (
              <div className="form-card-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => onEditForm && onEditForm('lead-questionnaire')}
                >
                  <Edit size={16} />
                  Edit Form
                </button>
              </div>
            )}
          </div>

          <div className="form-card">
            <div className="form-card-header">
              <div className="form-icon">
                <FileText size={24} />
              </div>
              <div>
                <h3>Owner Onboarding Application</h3>
                <p>Complete application for approved owner leads</p>
              </div>
            </div>
            <div className="form-card-stats">
              <div className="stat">
                <span className="stat-label">Sections</span>
                <span className="stat-value">{onboardingStats.sections}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Questions</span>
                <span className="stat-value">{onboardingStats.fields}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Required</span>
                <span className="stat-value">{onboardingStats.required}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Version</span>
                <span className="stat-value">{onboardingStats.version}</span>
              </div>
            </div>
            {canEdit && (
              <div className="form-card-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => onEditForm && onEditForm('onboarding-application')}
                >
                  <Edit size={16} />
                  Edit Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="crm-settings">
      <div className="settings-header">
        <h1 className="settings-title">CRM Settings</h1>
        <p className="settings-subtitle">
          Configure permissions, templates, and forms for your Owner CRM
        </p>
      </div>

      <div className="settings-nav">
        <button
          className={`settings-nav-item ${activeSection === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveSection('permissions')}
        >
          <Shield size={20} />
          Permissions
        </button>
        <button
          className={`settings-nav-item ${activeSection === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveSection('templates')}
        >
          <Mail size={20} />
          Templates
        </button>
        <button
          className={`settings-nav-item ${activeSection === 'forms' ? 'active' : ''}`}
          onClick={() => setActiveSection('forms')}
        >
          <FileText size={20} />
          Forms
        </button>
      </div>

      <div className="settings-content">
        {activeSection === 'permissions' && <PermissionsSection />}
        {activeSection === 'templates' && <TemplatesSection />}
        {activeSection === 'forms' && <FormsSection />}
      </div>
    </div>
  );
};

export default CRMSettings;

