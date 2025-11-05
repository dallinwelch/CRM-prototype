// Mock data for the CRM prototype
// Helper function to add default values to leads
const addDefaultValues = (lead) => ({
  ...lead,
  noteCount: lead.noteCount || 0,
  hasBeenContacted: lead.hasBeenContacted !== undefined ? lead.hasBeenContacted : false,
  initialMessage: lead.initialMessage || null,
  sourceMetadata: lead.sourceMetadata || null,
  isDuplicate: lead.isDuplicate !== undefined ? lead.isDuplicate : false,
  duplicateOf: lead.duplicateOf || null,
  lastReachedOut: lead.lastReachedOut || null
});

export const mockLeads = [
  // PARTIAL LEADS (8 examples)
  {
    id: 'lead-002',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.j@email.com',
    phone: '(555) 234-5678',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-22T09:15:00Z',
    updatedAt: '2025-10-22T09:15:00Z',
    lastReachedOut: '2025-10-23T10:30:00Z',
    completionPercentage: 45,
    source: 'Word of Mouth',
    leadSource: 'Word of Mouth',
    isDuplicate: false,
    properties: [],
    questionnaireAnswers: {
      'field-firstname': 'Emily',
      'field-lastname': 'Johnson',
      'field-email': 'emily.j@email.com',
      'field-phone': '(555) 234-5678',
      'field-num-properties': '2',
      'field-timeline': 'Immediately'
    },
    timeline: [
      {
        id: 'event-003',
        type: 'lead_created',
        description: 'Lead created manually',
        timestamp: '2025-10-22T09:15:00Z',
        user: 'Mike Davis'
      },
      {
        id: 'event-003-note',
        type: 'note_added',
        description: 'Referred by current client - David Thompson',
        timestamp: '2025-10-22T09:20:00Z',
        user: 'Mike Davis'
      }
    ],
    notes: 'Referred by current client - David Thompson',
    noteCount: 1,
    hasBeenContacted: false,
    initialMessage: null
  },
  {
    id: 'lead-006',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'rtaylor@email.com',
    phone: '(555) 678-9012',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-25T14:20:00Z',
    updatedAt: '2025-10-25T14:20:00Z',
    lastReachedOut: null,
    completionPercentage: 30,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    emailBounced: true, // Example of bounced email
    phoneInvalid: false,
    properties: [],
    questionnaireAnswers: {
      'field-firstname': 'Robert',
      'field-lastname': 'Taylor',
      'field-email': 'rtaylor@email.com',
      'field-phone': '(555) 678-9012'
    },
    timeline: [
      {
        id: 'event-010',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-25T14:20:00Z',
        user: 'System'
      }
    ],
    notes: 'Started form but did not complete property details',
    noteCount: 1,
    hasBeenContacted: false,
    initialMessage: 'Started the form but abandoned midway'
  },
  {
    id: 'lead-007',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@email.com',
    phone: '(555) 789-0123',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-26T10:45:00Z',
    updatedAt: '2025-10-26T10:45:00Z',
    completionPercentage: 60,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': '1-3 months',
      'field-experience': 'No'
    },
    timeline: [
      {
        id: 'event-011',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-26T10:45:00Z',
        user: 'System'
      }
    ],
    notes: 'Interested but needs more time to decide',
    noteCount: 1,
    hasBeenContacted: true,
    initialMessage: null
  },
  {
    id: 'lead-008',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'jwilson@email.com',
    phone: '(555) 890-1234',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-27T08:00:00Z',
    updatedAt: '2025-10-27T08:00:00Z',
    completionPercentage: 25,
    source: 'Phone Call',
    leadSource: 'Phone',
    isDuplicate: false,
    properties: [],
    questionnaireAnswers: {
      'field-num-properties': '3'
    },
    timeline: [
      {
        id: 'event-012',
        type: 'lead_created',
        description: 'Lead created from phone inquiry',
        timestamp: '2025-10-27T08:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Multiple properties, needs to gather more info before completing form',
    noteCount: 1,
    hasBeenContacted: true,
    initialMessage: 'I have 3 properties that need management'
  },
  {
    id: 'lead-009',
    firstName: 'Patricia',
    lastName: 'Moore',
    email: 'pmoore@email.com',
    phone: '(555) 901-2345',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-23T16:30:00Z',
    updatedAt: '2025-10-23T16:30:00Z',
    completionPercentage: 50,
    source: 'Referral',
    leadSource: 'Email',
    isDuplicate: false,
    properties: [],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month'
    },
    timeline: [
      {
        id: 'event-013',
        type: 'lead_created',
        description: 'Lead created manually',
        timestamp: '2025-10-23T16:30:00Z',
        user: 'Jessica Martinez'
      }
    ],
    notes: 'Referred by existing owner - Jennifer Lee'
  },
  {
    id: 'lead-010',
    firstName: 'Christopher',
    lastName: 'Brown',
    email: 'cbrown@email.com',
    phone: '(800) 555-0100', // Toll-free number - cannot text
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-27T11:15:00Z',
    updatedAt: '2025-10-27T11:15:00Z',
    completionPercentage: 35,
    source: 'Website Form',
    leadSource: 'SMS',
    isDuplicate: false,
    emailBounced: false,
    phoneInvalid: true, // Example of non-textable phone
    properties: [],
    questionnaireAnswers: {
      'field-firstname': 'Christopher',
      'field-email': 'cbrown@email.com',
      'field-phone': '(800) 555-0100'
    },
    timeline: [
      {
        id: 'event-014',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-27T11:15:00Z',
        user: 'System'
      }
    ],
    notes: 'Form abandoned after contact info'
  },
  {
    id: 'lead-011',
    firstName: 'Michelle',
    lastName: 'Davis',
    email: 'mdavis@email.com',
    phone: '(555) 123-7890',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-21T13:00:00Z',
    updatedAt: '2025-10-21T13:00:00Z',
    completionPercentage: 70,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [],
    questionnaireAnswers: {
      'field-num-properties': '2',
      'field-timeline': 'Within 1 month',
      'field-experience': 'Yes',
      'field-additional-info': 'Looking to switch from current PM'
    },
    timeline: [
      {
        id: 'event-015',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-21T13:00:00Z',
        user: 'System'
      }
    ],
    notes: 'High completion rate - likely to finish form'
  },
  {
    id: 'lead-012',
    firstName: 'Daniel',
    lastName: 'Garcia',
    email: 'dgarcia@email.com',
    phone: '(555) 234-8901',
    status: 'lead',
    stage: 'Lead Created',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-28T09:30:00Z',
    updatedAt: '2025-10-28T09:30:00Z',
    completionPercentage: 40,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Immediately'
    },
    timeline: [
      {
        id: 'event-016',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-28T09:30:00Z',
        user: 'System'
      }
    ],
    notes: 'New lead - requires follow-up'
  },

  // QUALIFIED LEADS (8 examples)
  {
    id: 'lead-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-10-21T14:30:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    sourceMetadata: {
      formName: 'Owner Interest Form',
      referrerUrl: 'https://propertymanagement.com/services',
      userAgent: 'Mozilla/5.0...',
      ipAddress: '192.168.1.1'
    },
    isDuplicate: false,
    hasBeenContacted: true,
    initialMessage: 'Looking for full-service property management. Currently self-managing but need help.',
    noteCount: 1,
    properties: [
      {
        id: 'prop-001',
        address: '123 Main St, Austin, TX 78701',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2500
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'John',
      'field-lastname': 'Smith',
      'field-email': 'john.smith@email.com',
      'field-phone': '(555) 123-4567',
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'No',
      'field-additional-info': 'Looking for full-service property management. Currently self-managing but need help.',
      'property-0-field-address': '123 Main St, Austin, TX 78701',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '3',
      'property-0-field-bathrooms': '2',
      'property-0-field-currently-rented': 'Yes'
    },
    timeline: [
      {
        id: 'event-001',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-20T10:00:00Z',
        user: 'System'
      },
      {
        id: 'event-002',
        type: 'form_completed',
        description: 'Qualifying questionnaire completed',
        timestamp: '2025-10-21T14:30:00Z',
        user: 'John Smith'
      },
      {
        id: 'event-001-note',
        type: 'note_added',
        description: 'Interested in property management services for downtown Austin property.',
        timestamp: '2025-10-21T15:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Interested in property management services for downtown Austin property.'
  },
  {
    id: 'lead-004',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'swilliams@email.com',
    phone: '(555) 456-7890',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-24T08:30:00Z',
    updatedAt: '2025-10-24T09:00:00Z',
    completionPercentage: 100,
    source: 'Phone Call',
    leadSource: 'Phone',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-004',
        address: '321 Elm St, Austin, TX 78704',
        bedrooms: 3,
        bathrooms: 2.5,
        petsAllowed: true,
        minRentPrice: 2800
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Sarah',
      'field-lastname': 'Williams',
      'field-email': 'swilliams@email.com',
      'field-phone': '(555) 456-7890',
      'field-num-properties': '1',
      'field-timeline': 'Immediately',
      'field-experience': 'No',
      'field-additional-info': 'Need to start management ASAP. Current tenant lease ending soon.',
      'property-0-field-address': '321 Elm St, Austin, TX 78704',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '3',
      'property-0-field-bathrooms': '2.5',
      'property-0-field-currently-rented': 'Yes'
    },
    timeline: [
      {
        id: 'event-007',
        type: 'lead_created',
        description: 'Lead created from phone inquiry',
        timestamp: '2025-10-24T08:30:00Z',
        user: 'Mike Davis'
      }
    ],
    notes: 'Urgent - needs management to start next month'
  },
  {
    id: 'lead-013',
    firstName: 'Karen',
    lastName: 'Rodriguez',
    email: 'krodriguez@email.com',
    phone: '(555) 345-9012',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-19T15:00:00Z',
    updatedAt: '2025-10-20T10:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-006',
        address: '890 Maple Dr, Austin, TX 78705',
        bedrooms: 4,
        bathrooms: 3,
        petsAllowed: false,
        minRentPrice: 3500
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Karen',
      'field-lastname': 'Rodriguez',
      'field-email': 'krodriguez@email.com',
      'field-phone': '(555) 345-9012',
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'Yes',
      'field-additional-info': 'Previous PM company went out of business. Need reliable service.',
      'property-0-field-address': '890 Maple Dr, Austin, TX 78705',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '4',
      'property-0-field-bathrooms': '3',
      'property-0-field-currently-rented': 'Yes'
    },
    timeline: [
      {
        id: 'event-017',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-19T15:00:00Z',
        user: 'System'
      }
    ],
    notes: 'High-value property in great location'
  },
  {
    id: 'lead-014',
    firstName: 'Thomas',
    lastName: 'Miller',
    email: 'tmiller@email.com',
    phone: '(555) 456-0123',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-25T12:00:00Z',
    updatedAt: '2025-10-25T16:45:00Z',
    completionPercentage: 100,
    source: 'Referral',
    leadSource: 'Word of Mouth',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-007',
        address: '234 Cedar Ln, Austin, TX 78706',
        bedrooms: 2,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2200
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': '1-3 months',
      'field-experience': 'No',
      'field-additional-info': 'First rental property. Need guidance on the process.'
    },
    timeline: [
      {
        id: 'event-018',
        type: 'lead_created',
        description: 'Lead created from referral',
        timestamp: '2025-10-25T12:00:00Z',
        user: 'Jessica Martinez'
      }
    ],
    notes: 'First-time landlord, needs extra support'
  },
  {
    id: 'lead-015',
    firstName: 'Nancy',
    lastName: 'White',
    email: 'nwhite@email.com',
    phone: '(555) 567-1234',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-23T09:00:00Z',
    updatedAt: '2025-10-23T14:30:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'Email',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-008',
        address: '567 Birch St, Austin, TX 78707',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2600
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'No'
    },
    timeline: [
      {
        id: 'event-019',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-23T09:00:00Z',
        user: 'System'
      }
    ],
    notes: 'Property is currently vacant'
  },
  {
    id: 'lead-016',
    firstName: 'Steven',
    lastName: 'Lee',
    email: 'slee@email.com',
    phone: '(555) 678-2345',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-26T14:00:00Z',
    updatedAt: '2025-10-27T09:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-009',
        address: '678 Walnut Ave, Austin, TX 78708',
        bedrooms: 5,
        bathrooms: 4,
        petsAllowed: false,
        minRentPrice: 4200
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Immediately',
      'field-experience': 'Yes',
      'field-additional-info': 'Large executive home. Looking for quality tenants only.'
    },
    timeline: [
      {
        id: 'event-020',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-26T14:00:00Z',
        user: 'System'
      }
    ],
    notes: 'Luxury property - premium pricing'
  },
  {
    id: 'lead-017',
    firstName: 'Betty',
    lastName: 'Harris',
    email: 'bharris@email.com',
    phone: '(555) 789-3456',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-18T11:30:00Z',
    updatedAt: '2025-10-19T08:00:00Z',
    completionPercentage: 100,
    source: 'Phone Call',
    leadSource: 'Phone',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-010',
        address: '789 Ash Ct, Austin, TX 78709',
        bedrooms: 3,
        bathrooms: 2.5,
        petsAllowed: true,
        minRentPrice: 2900
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': '1-3 months',
      'field-experience': 'Yes'
    },
    timeline: [
      {
        id: 'event-021',
        type: 'lead_created',
        description: 'Lead created from phone inquiry',
        timestamp: '2025-10-18T11:30:00Z',
        user: 'Jessica Martinez'
      }
    ],
    notes: 'Current tenant moving out in 2 months'
  },
  {
    id: 'lead-018',
    firstName: 'Richard',
    lastName: 'Clark',
    email: 'rclark@email.com',
    phone: '(555) 890-4567',
    status: 'application',
    stage: 'Qualified',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-27T10:00:00Z',
    updatedAt: '2025-10-27T15:30:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'SMS',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-011',
        address: '890 Spruce Way, Austin, TX 78710',
        bedrooms: 2,
        bathrooms: 1.5,
        petsAllowed: true,
        minRentPrice: 1900
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'No'
    },
    timeline: [
      {
        id: 'event-022',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-27T10:00:00Z',
        user: 'System'
      }
    ],
    notes: 'Townhouse near university area'
  },

  // APPROVED LEADS (not yet in onboarding) (4 examples)
  {
    id: 'lead-019',
    firstName: 'Jennifer',
    lastName: 'Lewis',
    email: 'jlewis@email.com',
    phone: '(555) 901-5678',
    status: 'awaiting approval',
    stage: 'Approved',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-16T09:00:00Z',
    updatedAt: '2025-10-22T11:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-012',
        address: '901 Hickory Blvd, Austin, TX 78711',
        bedrooms: 4,
        bathrooms: 2.5,
        petsAllowed: true,
        minRentPrice: 3100
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Jennifer',
      'field-lastname': 'Lewis',
      'field-email': 'jlewis@email.com',
      'field-phone': '(555) 901-5678',
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'Yes',
      'property-0-field-address': '901 Hickory Blvd, Austin, TX 78711',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '4',
      'property-0-field-bathrooms': '2.5',
      'property-0-field-currently-rented': 'Yes'
    },
    timeline: [
      {
        id: 'event-023',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-16T09:00:00Z',
        user: 'System'
      },
      {
        id: 'event-024',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-22T11:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Approved - awaiting onboarding invitation'
  },
  {
    id: 'lead-020',
    firstName: 'Matthew',
    lastName: 'Walker',
    email: 'mwalker@email.com',
    phone: '(555) 012-6789',
    status: 'awaiting approval',
    stage: 'Approved',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-17T14:00:00Z',
    updatedAt: '2025-10-23T16:00:00Z',
    completionPercentage: 100,
    source: 'Referral',
    leadSource: 'Word of Mouth',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-013',
        address: '123 Dogwood Dr, Austin, TX 78712',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: false,
        minRentPrice: 2700
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Immediately',
      'field-experience': 'No'
    },
    timeline: [
      {
        id: 'event-025',
        type: 'lead_created',
        description: 'Lead created from referral',
        timestamp: '2025-10-17T14:00:00Z',
        user: 'Mike Davis'
      },
      {
        id: 'event-026',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-23T16:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Approved - onboarding email sent'
  },
  {
    id: 'lead-021',
    firstName: 'Dorothy',
    lastName: 'Hall',
    email: 'dhall@email.com',
    phone: '(555) 123-7890',
    status: 'awaiting approval',
    stage: 'Approved',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-19T08:00:00Z',
    updatedAt: '2025-10-24T10:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-014',
        address: '234 Magnolia Ln, Austin, TX 78713',
        bedrooms: 2,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2100
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': '1-3 months',
      'field-experience': 'Yes'
    },
    timeline: [
      {
        id: 'event-027',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-19T08:00:00Z',
        user: 'System'
      },
      {
        id: 'event-028',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-24T10:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Approved - waiting for owner to start onboarding'
  },
  {
    id: 'lead-022',
    firstName: 'Kevin',
    lastName: 'Young',
    email: 'kyoung@email.com',
    phone: '(555) 234-8901',
    status: 'awaiting approval',
    stage: 'Approved',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-21T12:00:00Z',
    updatedAt: '2025-10-26T09:00:00Z',
    completionPercentage: 100,
    source: 'Phone Call',
    leadSource: 'Phone',
    isDuplicate: false,
    properties: [
      {
        id: 'prop-015',
        address: '345 Willow St, Austin, TX 78714',
        bedrooms: 3,
        bathrooms: 2.5,
        petsAllowed: true,
        minRentPrice: 2850
      }
    ],
    questionnaireAnswers: {
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'No'
    },
    timeline: [
      {
        id: 'event-029',
        type: 'lead_created',
        description: 'Lead created from phone inquiry',
        timestamp: '2025-10-21T12:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-030',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-26T09:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Recently approved'
  },

  // ONBOARDING LEADS (approved + onboardingStatus: 'in_progress') (7 examples)
  {
    id: 'lead-003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@email.com',
    phone: '(555) 345-6789',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-15T11:00:00Z',
    updatedAt: '2025-10-23T16:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'Email',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 60,
    properties: [
      {
        id: 'prop-002',
        address: '456 Oak Ave, Austin, TX 78702',
        bedrooms: 4,
        bathrooms: 3,
        petsAllowed: false,
        minRentPrice: 3200
      },
      {
        id: 'prop-003',
        address: '789 Pine St, Austin, TX 78703',
        bedrooms: 2,
        bathrooms: 1,
        petsAllowed: true,
        minRentPrice: 1800
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Michael',
      'field-lastname': 'Chen',
      'field-email': 'mchen@email.com',
      'field-phone': '(555) 345-6789',
      'field-num-properties': '2',
      'field-timeline': 'Within 1 month',
      'field-experience': 'Yes',
      'field-additional-info': 'Previous PM company did not handle maintenance well. Looking for better service.',
      'property-0-field-address': '456 Oak Ave, Austin, TX 78702',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '4',
      'property-0-field-bathrooms': '3',
      'property-0-field-currently-rented': 'Yes',
      'property-1-field-address': '789 Pine St, Austin, TX 78703',
      'property-1-field-property-type': 'Condo',
      'property-1-field-bedrooms': '2',
      'property-1-field-bathrooms': '1',
      'property-1-field-currently-rented': 'Vacant'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Chen Properties LLC',
      'field-tax-id': '12-3456789',
      'field-mailing-address': '456 Oak Ave, Austin, TX 78702',
      'field-business-structure': 'LLC',
      'field-emergency-contact': 'Lisa Chen',
      'field-emergency-phone': '(555) 345-6790',
      'property-0-field-property-address': '456 Oak Ave, Austin, TX 78702',
      'property-0-field-property-bedrooms': '4',
      'property-0-field-property-bathrooms': '3',
      'property-0-field-square-footage': '2400',
      'property-0-field-year-built': '2015',
      'property-0-field-pets-allowed': 'No',
      'property-0-field-min-rent': '3200',
      'property-1-field-property-address': '789 Pine St, Austin, TX 78703',
      'property-1-field-property-bedrooms': '2',
      'property-1-field-property-bathrooms': '1',
      'property-1-field-square-footage': '950',
      'property-1-field-year-built': '2008',
      'property-1-field-pets-allowed': 'Yes',
      'property-1-field-min-rent': '1800',
      'field-lease-length': '12 months',
      'field-maintenance-limit': '500'
    },
    timeline: [
      {
        id: 'event-004',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-15T11:00:00Z',
        user: 'System'
      },
      {
        id: 'event-005',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-18T10:30:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-006',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-20T14:00:00Z',
        user: 'Michael Chen'
      },
      {
        id: 'event-006-note1',
        type: 'note_added',
        description: 'Multiple properties - high value lead',
        timestamp: '2025-10-18T11:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-006-note2',
        type: 'note_added',
        description: 'Need to follow up on property #2 details',
        timestamp: '2025-10-22T09:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Multiple properties - high value lead',
    noteCount: 2,
    hasBeenContacted: true,
    initialMessage: 'Previous PM company did not handle maintenance well. Looking for better service.'
  },
  {
    id: 'lead-023',
    firstName: 'Jessica',
    lastName: 'King',
    email: 'jking@email.com',
    phone: '(555) 345-9012',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-14T10:00:00Z',
    updatedAt: '2025-10-25T14:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 45,
    properties: [
      {
        id: 'prop-016',
        address: '456 Poplar Rd, Austin, TX 78715',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2650
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Jessica',
      'field-lastname': 'King',
      'field-email': 'jking@email.com',
      'field-phone': '(555) 345-9012',
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'No',
      'property-0-field-address': '456 Poplar Rd, Austin, TX 78715',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '3',
      'property-0-field-bathrooms': '2',
      'property-0-field-currently-rented': 'No'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Jessica King',
      'field-tax-id': '98-7654321',
      'field-mailing-address': '456 Poplar Rd, Austin, TX 78715',
      'field-business-structure': 'Individual',
      'property-0-field-property-address': '456 Poplar Rd, Austin, TX 78715',
      'property-0-field-property-bedrooms': '3',
      'property-0-field-property-bathrooms': '2',
      'property-0-field-square-footage': '1800',
      'property-0-field-pets-allowed': 'Yes',
      'property-0-field-min-rent': '2650'
    },
    timeline: [
      {
        id: 'event-031',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-14T10:00:00Z',
        user: 'System'
      },
      {
        id: 'event-032',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-20T09:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-033',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-22T11:00:00Z',
        user: 'Jessica King'
      }
    ],
    notes: 'In progress - completing property documents'
  },
  {
    id: 'lead-024',
    firstName: 'Brian',
    lastName: 'Wright',
    email: 'bwright@email.com',
    phone: '(555) 456-0123',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-12T15:00:00Z',
    updatedAt: '2025-10-24T10:00:00Z',
    completionPercentage: 100,
    source: 'Referral',
    leadSource: 'Word of Mouth',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 80,
    properties: [
      {
        id: 'prop-017',
        address: '567 Cypress Ave, Austin, TX 78716',
        bedrooms: 4,
        bathrooms: 3.5,
        petsAllowed: false,
        minRentPrice: 3800
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Brian',
      'field-lastname': 'Wright',
      'field-email': 'bwright@email.com',
      'field-phone': '(555) 456-0123',
      'field-num-properties': '1',
      'field-timeline': 'Immediately',
      'field-experience': 'Yes',
      'field-additional-info': 'Looking to upgrade management services',
      'property-0-field-address': '567 Cypress Ave, Austin, TX 78716',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '4',
      'property-0-field-bathrooms': '3.5',
      'property-0-field-currently-rented': 'Yes'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Wright Real Estate Holdings LLC',
      'field-tax-id': '45-6789012',
      'field-mailing-address': '567 Cypress Ave, Austin, TX 78716',
      'field-business-structure': 'LLC',
      'field-emergency-contact': 'Amanda Wright',
      'field-emergency-phone': '(555) 456-0124',
      'property-0-field-property-address': '567 Cypress Ave, Austin, TX 78716',
      'property-0-field-property-bedrooms': '4',
      'property-0-field-property-bathrooms': '3.5',
      'property-0-field-square-footage': '3200',
      'property-0-field-year-built': '2018',
      'property-0-field-pets-allowed': 'No',
      'property-0-field-min-rent': '3800',
      'property-0-field-garage-code': '4567',
      'field-lease-length': '12 months',
      'field-maintenance-limit': '1000',
      'field-showing-instructions': 'Tenant currently occupies - 24hr notice required',
      'field-management-agreement': 'true',
      'field-w9-upload': 'true',
      'field-signature': 'Brian Wright'
    },
    timeline: [
      {
        id: 'event-034',
        type: 'lead_created',
        description: 'Lead created from referral',
        timestamp: '2025-10-12T15:00:00Z',
        user: 'Jessica Martinez'
      },
      {
        id: 'event-035',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-17T14:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-036',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-18T09:00:00Z',
        user: 'Brian Wright'
      }
    ],
    notes: 'Almost complete - just needs final signatures'
  },
  {
    id: 'lead-025',
    firstName: 'Susan',
    lastName: 'Lopez',
    email: 'slopez@email.com',
    phone: '(555) 567-1234',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-13T11:00:00Z',
    updatedAt: '2025-10-26T15:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'PMW',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 35,
    properties: [
      {
        id: 'prop-018',
        address: '678 Redwood Ct, Austin, TX 78717',
        bedrooms: 2,
        bathrooms: 1.5,
        petsAllowed: true,
        minRentPrice: 1950
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Susan',
      'field-lastname': 'Lopez',
      'field-email': 'slopez@email.com',
      'field-phone': '(555) 567-1234',
      'field-num-properties': '1',
      'field-timeline': '1-3 months',
      'field-experience': 'No',
      'property-0-field-address': '678 Redwood Ct, Austin, TX 78717',
      'property-0-field-property-type': 'Townhouse',
      'property-0-field-bedrooms': '2',
      'property-0-field-bathrooms': '1.5',
      'property-0-field-currently-rented': 'Vacant'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Susan Lopez',
      'field-tax-id': '55-4433221',
      'field-mailing-address': '678 Redwood Ct, Austin, TX 78717',
      'field-business-structure': 'Individual',
      'property-0-field-property-address': '678 Redwood Ct, Austin, TX 78717',
      'property-0-field-property-bedrooms': '2',
      'property-0-field-property-bathrooms': '1.5'
    },
    timeline: [
      {
        id: 'event-037',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-13T11:00:00Z',
        user: 'System'
      },
      {
        id: 'event-038',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-19T10:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-039',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-21T13:00:00Z',
        user: 'Susan Lopez'
      }
    ],
    notes: 'Slow progress on onboarding - may need reminder'
  },
  {
    id: 'lead-026',
    firstName: 'George',
    lastName: 'Hill',
    email: 'ghill@email.com',
    phone: '(555) 678-2345',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-11T09:00:00Z',
    updatedAt: '2025-10-27T11:00:00Z',
    completionPercentage: 100,
    source: 'Phone Call',
    leadSource: 'Phone',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 90,
    properties: [
      {
        id: 'prop-019',
        address: '789 Sycamore Ln, Austin, TX 78718',
        bedrooms: 5,
        bathrooms: 4,
        petsAllowed: true,
        minRentPrice: 4500
      },
      {
        id: 'prop-020',
        address: '890 Cherry Blvd, Austin, TX 78719',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: false,
        minRentPrice: 2750
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'George',
      'field-lastname': 'Hill',
      'field-email': 'ghill@email.com',
      'field-phone': '(555) 678-2345',
      'field-num-properties': '2',
      'field-timeline': 'Within 1 month',
      'field-experience': 'Yes',
      'field-additional-info': 'Have worked with property managers before, looking for better service',
      'property-0-field-address': '789 Sycamore Ln, Austin, TX 78718',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '5',
      'property-0-field-bathrooms': '4',
      'property-0-field-currently-rented': 'Yes',
      'property-1-field-address': '890 Cherry Blvd, Austin, TX 78719',
      'property-1-field-property-type': 'Single Family Home',
      'property-1-field-bedrooms': '3',
      'property-1-field-bathrooms': '2',
      'property-1-field-currently-rented': 'Yes'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Hill Investment Properties LLC',
      'field-tax-id': '33-2211445',
      'field-mailing-address': '789 Sycamore Ln, Austin, TX 78718',
      'field-business-structure': 'LLC',
      'field-emergency-contact': 'Martha Hill',
      'field-emergency-phone': '(555) 678-2346',
      'property-0-field-property-address': '789 Sycamore Ln, Austin, TX 78718',
      'property-0-field-property-bedrooms': '5',
      'property-0-field-property-bathrooms': '4',
      'property-0-field-square-footage': '4200',
      'property-0-field-year-built': '2020',
      'property-0-field-pets-allowed': 'Yes',
      'property-0-field-min-rent': '4500',
      'property-0-field-hoa': 'Sycamore Hills HOA',
      'property-0-field-hoa-fee': '150',
      'property-1-field-property-address': '890 Cherry Blvd, Austin, TX 78719',
      'property-1-field-property-bedrooms': '3',
      'property-1-field-property-bathrooms': '2',
      'property-1-field-square-footage': '1850',
      'property-1-field-year-built': '2012',
      'property-1-field-pets-allowed': 'No',
      'property-1-field-min-rent': '2750',
      'field-lease-length': '12 months',
      'field-maintenance-limit': '750',
      'field-showing-instructions': 'Both properties are currently occupied',
      'field-management-agreement': 'true',
      'field-w9-upload': 'true',
      'field-signature': 'George Hill',
      'field-signature-date': '2025-10-27'
    },
    timeline: [
      {
        id: 'event-040',
        type: 'lead_created',
        description: 'Lead created from phone inquiry',
        timestamp: '2025-10-11T09:00:00Z',
        user: 'Mike Davis'
      },
      {
        id: 'event-041',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-16T11:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-042',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-17T08:00:00Z',
        user: 'George Hill'
      }
    ],
    notes: 'Multiple luxury properties - nearly complete with onboarding'
  },
  {
    id: 'lead-027',
    firstName: 'Carol',
    lastName: 'Scott',
    email: 'cscott@email.com',
    phone: '(555) 789-3456',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-16T13:00:00Z',
    updatedAt: '2025-10-23T09:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    leadSource: 'SMS',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 55,
    properties: [
      {
        id: 'prop-021',
        address: '901 Beech St, Austin, TX 78720',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2450
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Carol',
      'field-lastname': 'Scott',
      'field-email': 'cscott@email.com',
      'field-phone': '(555) 789-3456',
      'field-num-properties': '1',
      'field-timeline': 'Within 1 month',
      'field-experience': 'Yes',
      'property-0-field-address': '901 Beech St, Austin, TX 78720',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '3',
      'property-0-field-bathrooms': '2',
      'property-0-field-currently-rented': 'No'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Carol Scott',
      'field-tax-id': '77-8899001',
      'field-mailing-address': '901 Beech St, Austin, TX 78720',
      'field-business-structure': 'Individual',
      'property-0-field-property-address': '901 Beech St, Austin, TX 78720',
      'property-0-field-property-bedrooms': '3',
      'property-0-field-property-bathrooms': '2',
      'property-0-field-square-footage': '1650',
      'property-0-field-year-built': '2010',
      'property-0-field-pets-allowed': 'Yes',
      'property-0-field-min-rent': '2450',
      'field-lease-length': '12 months',
      'field-maintenance-limit': '500',
      'field-showing-instructions': 'Property is vacant - lockbox on front door'
    },
    timeline: [
      {
        id: 'event-043',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-16T13:00:00Z',
        user: 'System'
      },
      {
        id: 'event-044',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-21T10:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-045',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-22T14:00:00Z',
        user: 'Carol Scott'
      }
    ],
    notes: 'Making good progress on onboarding'
  },
  {
    id: 'lead-028',
    firstName: 'Edward',
    lastName: 'Green',
    email: 'egreen@email.com',
    phone: '(555) 890-4567',
    status: 'awaiting approval',
    stage: 'Onboarding',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-14T08:00:00Z',
    updatedAt: '2025-10-25T16:00:00Z',
    completionPercentage: 100,
    source: 'Referral',
    leadSource: 'Email',
    isDuplicate: false,
    onboardingStatus: 'in_progress',
    onboardingCompletion: 70,
    properties: [
      {
        id: 'prop-022',
        address: '123 Fir Ave, Austin, TX 78721',
        bedrooms: 4,
        bathrooms: 2.5,
        petsAllowed: false,
        minRentPrice: 3300
      }
    ],
    questionnaireAnswers: {
      'field-firstname': 'Edward',
      'field-lastname': 'Green',
      'field-email': 'egreen@email.com',
      'field-phone': '(555) 890-4567',
      'field-num-properties': '1',
      'field-timeline': 'Immediately',
      'field-experience': 'No',
      'field-additional-info': 'First rental property, need help getting started',
      'property-0-field-address': '123 Fir Ave, Austin, TX 78721',
      'property-0-field-property-type': 'Single Family Home',
      'property-0-field-bedrooms': '4',
      'property-0-field-bathrooms': '2.5',
      'property-0-field-currently-rented': 'Vacant'
    },
    onboardingAnswers: {
      'field-legal-entity': 'Edward Green',
      'field-tax-id': '44-5566778',
      'field-mailing-address': '123 Fir Ave, Austin, TX 78721',
      'field-business-structure': 'Individual',
      'field-emergency-contact': 'Sarah Green',
      'field-emergency-phone': '(555) 890-4568',
      'property-0-field-property-address': '123 Fir Ave, Austin, TX 78721',
      'property-0-field-property-bedrooms': '4',
      'property-0-field-property-bathrooms': '2.5',
      'property-0-field-square-footage': '2600',
      'property-0-field-year-built': '2016',
      'property-0-field-pets-allowed': 'No',
      'property-0-field-min-rent': '3300',
      'field-lease-length': '12 months',
      'field-maintenance-limit': '750',
      'field-management-agreement': 'true',
      'field-w9-upload': 'true'
    },
    timeline: [
      {
        id: 'event-046',
        type: 'lead_created',
        description: 'Lead created from referral',
        timestamp: '2025-10-14T08:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-047',
        type: 'lead_approved',
        description: 'Lead approved by manager',
        timestamp: '2025-10-19T15:00:00Z',
        user: 'Sarah Johnson'
      },
      {
        id: 'event-048',
        type: 'onboarding_started',
        description: 'Owner started onboarding application',
        timestamp: '2025-10-20T10:00:00Z',
        user: 'Edward Green'
      }
    ],
    notes: 'Referred by existing client - good candidate'
  },

  // ARCHIVED/DENIED LEADS (5 examples)
  {
    id: 'lead-005',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'dmartinez@email.com',
    phone: '(555) 567-8901',
    status: 'archived',
    stage: 'Denied',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-10-10T14:00:00Z',
    updatedAt: '2025-10-18T11:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    isDuplicate: false,
    denialReason: 'Property not in service area',
    properties: [
      {
        id: 'prop-005',
        address: '555 Far Away Rd, Houston, TX 77001',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2200
      }
    ],
    timeline: [
      {
        id: 'event-008',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-10T14:00:00Z',
        user: 'System'
      },
      {
        id: 'event-009',
        type: 'lead_denied',
        description: 'Lead denied - property outside service area',
        timestamp: '2025-10-18T11:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Property location not within our service area'
  },
  {
    id: 'lead-029',
    firstName: 'Helen',
    lastName: 'Adams',
    email: 'hadams@email.com',
    phone: '(555) 901-5678',
    status: 'archived',
    stage: 'Denied',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-08T10:00:00Z',
    updatedAt: '2025-10-15T14:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    isDuplicate: false,
    denialReason: 'Property does not meet minimum requirements',
    properties: [
      {
        id: 'prop-023',
        address: '234 Old Cabin Rd, Austin, TX 78722',
        bedrooms: 1,
        bathrooms: 1,
        petsAllowed: false,
        minRentPrice: 800
      }
    ],
    timeline: [
      {
        id: 'event-049',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-10-08T10:00:00Z',
        user: 'System'
      },
      {
        id: 'event-050',
        type: 'lead_denied',
        description: 'Lead denied - property below minimum standards',
        timestamp: '2025-10-15T14:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Property rental price too low for our services'
  },
  {
    id: 'lead-030',
    firstName: 'Raymond',
    lastName: 'Baker',
    email: 'rbaker@email.com',
    phone: '(555) 012-6789',
    status: 'archived',
    stage: 'Archived',
    assignedTo: 'Jessica Martinez',
    createdAt: '2025-10-05T15:00:00Z',
    updatedAt: '2025-10-12T09:00:00Z',
    completionPercentage: 100,
    source: 'Phone Call',
    isDuplicate: false,
    denialReason: 'Lead no longer interested',
    properties: [
      {
        id: 'prop-024',
        address: '345 Pleasant Dr, Austin, TX 78723',
        bedrooms: 3,
        bathrooms: 2,
        petsAllowed: true,
        minRentPrice: 2400
      }
    ],
    timeline: [
      {
        id: 'event-051',
        type: 'lead_created',
        description: 'Lead created from phone inquiry',
        timestamp: '2025-10-05T15:00:00Z',
        user: 'Jessica Martinez'
      },
      {
        id: 'event-052',
        type: 'lead_archived',
        description: 'Lead archived - decided to self-manage',
        timestamp: '2025-10-12T09:00:00Z',
        user: 'Jessica Martinez'
      }
    ],
    notes: 'Owner decided to continue self-managing'
  },
  {
    id: 'lead-031',
    firstName: 'Sandra',
    lastName: 'Nelson',
    email: 'snelson@email.com',
    phone: '(555) 123-7890',
    status: 'archived',
    stage: 'Denied',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-09-28T11:00:00Z',
    updatedAt: '2025-10-05T16:00:00Z',
    completionPercentage: 100,
    source: 'Website Form',
    isDuplicate: false,
    denialReason: 'Property condition issues',
    properties: [
      {
        id: 'prop-025',
        address: '456 Rundown St, Austin, TX 78724',
        bedrooms: 2,
        bathrooms: 1,
        petsAllowed: true,
        minRentPrice: 1500
      }
    ],
    timeline: [
      {
        id: 'event-053',
        type: 'lead_created',
        description: 'Lead created from website form',
        timestamp: '2025-09-28T11:00:00Z',
        user: 'System'
      },
      {
        id: 'event-054',
        type: 'lead_denied',
        description: 'Lead denied - property needs significant repairs before rental',
        timestamp: '2025-10-05T16:00:00Z',
        user: 'Sarah Johnson'
      }
    ],
    notes: 'Property requires extensive repairs before we can manage'
  },
  {
    id: 'lead-032',
    firstName: 'Larry',
    lastName: 'Carter',
    email: 'lcarter@email.com',
    phone: '(555) 234-8901',
    status: 'archived',
    stage: 'Archived',
    assignedTo: 'Mike Davis',
    createdAt: '2025-10-03T09:00:00Z',
    updatedAt: '2025-10-10T13:00:00Z',
    completionPercentage: 70,
    source: 'Referral',
    isDuplicate: false,
    denialReason: 'No response from lead',
    properties: [],
    timeline: [
      {
        id: 'event-055',
        type: 'lead_created',
        description: 'Lead created from referral',
        timestamp: '2025-10-03T09:00:00Z',
        user: 'Mike Davis'
      },
      {
        id: 'event-056',
        type: 'lead_archived',
        description: 'Lead archived - no response after multiple follow-ups',
        timestamp: '2025-10-10T13:00:00Z',
        user: 'Mike Davis'
      }
    ],
    notes: 'Could not reach after 5 attempts - archived'
  }
];

export const mockTasks = [
  {
    id: 'task-001',
    title: 'Follow up with John Smith',
    description: 'Check on qualifying questionnaire status',
    leadId: 'lead-001',
    leadName: 'John Smith',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-10-29T10:00:00Z',
    status: 'pending', // pending, completed, snoozed
    priority: 'high',
    cadenceDay: 1, // Fibonacci: 1, 2, 3, 5, 8, 13
    createdAt: '2025-10-28T10:00:00Z',
    type: 'follow_up'
  },
  {
    id: 'task-002',
    title: 'Complete onboarding review - Michael Chen',
    description: 'Review owner onboarding application and documents',
    leadId: 'lead-003',
    leadName: 'Michael Chen',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-10-28T14:00:00Z',
    status: 'pending',
    priority: 'urgent',
    createdAt: '2025-10-23T16:00:00Z',
    type: 'onboarding_review'
  },
  {
    id: 'task-003',
    title: 'Follow up - Emily Johnson (Day 3)',
    description: 'Third attempt to reach out to complete partial lead information',
    leadId: 'lead-002',
    leadName: 'Emily Johnson',
    assignedTo: 'Jessica Martinez',
    dueDate: '2025-10-29T09:00:00Z',
    status: 'pending',
    priority: 'medium',
    cadenceDay: 3,
    createdAt: '2025-10-26T09:15:00Z',
    type: 'follow_up'
  },
  {
    id: 'task-004',
    title: 'Approve Sarah Williams lead',
    description: 'Review and approve qualified lead',
    leadId: 'lead-004',
    leadName: 'Sarah Williams',
    assignedTo: null, // Unassigned
    dueDate: '2025-10-29T08:00:00Z',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-10-24T09:00:00Z',
    type: 'approval'
  },
  {
    id: 'task-005',
    title: 'Initial contact - John Smith (Day 1)',
    description: 'First contact attempt with new lead',
    leadId: 'lead-001',
    leadName: 'John Smith',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-10-21T10:00:00Z',
    status: 'completed',
    priority: 'high',
    completedAt: '2025-10-21T11:30:00Z',
    createdAt: '2025-10-21T10:00:00Z',
    type: 'follow_up',
    cadenceDay: 1,
    outcome: 'no-answer',
    notes: 'Left voicemail with company details'
  },
  {
    id: 'task-006',
    title: 'Follow up - John Smith (Day 2)',
    description: 'Second attempt to reach John Smith',
    leadId: 'lead-001',
    leadName: 'John Smith',
    assignedTo: 'Mike Davis',
    dueDate: '2025-10-22T10:00:00Z',
    status: 'completed',
    priority: 'high',
    completedAt: '2025-10-22T14:20:00Z',
    createdAt: '2025-10-21T11:30:00Z',
    type: 'follow_up',
    cadenceDay: 2,
    outcome: 'answered',
    notes: 'Spoke with John, interested in services. Sent information email.'
  },
  {
    id: 'task-007',
    title: 'Initial contact - Emily Johnson (Day 1)',
    description: 'First contact attempt with partial lead',
    leadId: 'lead-002',
    leadName: 'Emily Johnson',
    assignedTo: 'Mike Davis',
    dueDate: '2025-10-22T09:00:00Z',
    status: 'completed',
    priority: 'medium',
    completedAt: '2025-10-22T10:15:00Z',
    createdAt: '2025-10-22T09:00:00Z',
    type: 'follow_up',
    cadenceDay: 1,
    outcome: 'no-answer',
    notes: 'No answer, sent text message with link to complete form'
  },
  {
    id: 'task-008',
    title: 'Follow up - Emily Johnson (Day 2)',
    description: 'Second attempt to reach Emily Johnson',
    leadId: 'lead-002',
    leadName: 'Emily Johnson',
    assignedTo: 'Sarah Johnson',
    dueDate: '2025-10-24T09:00:00Z',
    status: 'completed',
    priority: 'medium',
    completedAt: '2025-10-24T13:45:00Z',
    createdAt: '2025-10-22T10:15:00Z',
    type: 'follow_up',
    cadenceDay: 2,
    outcome: 'no-answer',
    notes: 'Left voicemail, still no response'
  }
];

export const mockAutomations = [
  {
    id: 'auto-001',
    name: 'New Lead - Auto Assignment',
    description: 'Automatically assign new leads to team members',
    trigger: 'lead_created',
    isActive: true,
    isTemplate: false,
    actions: [
      {
        type: 'assign',
        target: 'round_robin',
        users: ['Sarah Johnson', 'Mike Davis']
      },
      {
        type: 'send_notification',
        recipients: 'assigned_user',
        template: 'new_lead_assigned'
      },
      {
        type: 'create_task',
        taskType: 'initial_contact',
        dueInDays: 1
      }
    ],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-10-15T14:00:00Z'
  },
  {
    id: 'auto-002',
    name: 'Lead Approved - Send Onboarding Invite',
    description: 'Send onboarding invitation when lead is approved',
    trigger: 'lead_approved',
    isActive: true,
    isTemplate: false,
    actions: [
      {
        type: 'send_email',
        template: 'onboarding_invite',
        recipient: 'lead_email'
      },
      {
        type: 'send_sms',
        template: 'onboarding_invite_sms',
        recipient: 'lead_phone'
      },
      {
        type: 'create_task',
        taskType: 'follow_up',
        dueInDays: 1,
        assignTo: 'current_assignee'
      }
    ],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-10-15T14:00:00Z'
  },
  {
    id: 'auto-003',
    name: 'Partial Lead - Follow Up Sequence',
    description: 'Fibonacci cadence follow-up for partial leads',
    trigger: 'lead_created_partial',
    isActive: true,
    isTemplate: false,
    actions: [
      {
        type: 'create_task_sequence',
        taskType: 'follow_up',
        cadence: 'fibonacci', // 1, 2, 3, 5, 8, 13 days
        assignTo: 'current_assignee',
        stopConditions: ['qualified', 'archived', 'approved']
      }
    ],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-10-15T14:00:00Z'
  }
];

export const mockUsers = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Manager',
    permissions: {
      approveOwnerLeads: true,
      approveTenantLeads: true,
      approveOwnerOnboarding: true,
      createEditAutomations: true,
      createEditTemplates: true,
      assignLeads: true
    },
    avatar: null
  },
  {
    id: 'user-002',
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'PM Staff',
    permissions: {
      approveOwnerLeads: false,
      approveTenantLeads: false,
      approveOwnerOnboarding: false,
      createEditAutomations: false,
      createEditTemplates: false,
      assignLeads: true
    },
    avatar: null
  },
  {
    id: 'user-003',
    name: 'Jessica Martinez',
    email: 'jessica.m@company.com',
    role: 'Leasing Staff',
    permissions: {
      approveOwnerLeads: false,
      approveTenantLeads: true,
      approveOwnerOnboarding: false,
      createEditAutomations: false,
      createEditTemplates: false,
      assignLeads: true
    },
    avatar: null
  }
];

export const currentUser = mockUsers[0]; // Sarah Johnson as default

export const mockTemplates = {
  email: [
    {
      id: 'email-001',
      name: 'Onboarding Invite',
      subject: 'Welcome to [Company Name] - Complete Your Owner Application',
      body: `Dear {{firstName}},

Thank you for your interest in our property management services! We're excited to help you manage your property at {{propertyAddress}}.

To get started, please complete your owner application by clicking the link below:
{{onboardingLink}}

If you have any questions, feel free to reach out to your dedicated property manager, {{assignedTo}}.

Best regards,
[Company Name] Team`,
      variables: ['firstName', 'propertyAddress', 'onboardingLink', 'assignedTo'],
      createdAt: '2025-01-10T10:00:00Z'
    },
    {
      id: 'email-002',
      name: 'Approval Notification',
      subject: 'Your Owner Application Has Been Approved!',
      body: `Dear {{firstName}},

Great news! Your owner application has been approved and your property at {{propertyAddress}} is now under our management.

We'll be in touch shortly with next steps.

Welcome aboard!

Best regards,
[Company Name] Team`,
      variables: ['firstName', 'propertyAddress'],
      createdAt: '2025-01-10T10:00:00Z'
    }
  ],
  sms: [
    {
      id: 'sms-001',
      name: 'Onboarding Invite SMS',
      body: 'Hi {{firstName}}! Welcome to [Company]. Complete your owner application here: {{onboardingLink}}',
      variables: ['firstName', 'onboardingLink'],
      createdAt: '2025-01-10T10:00:00Z'
    }
  ]
};

// Owner Lead Questionnaire - NOTE: Cannot have required fields per PRD
export const mockLeadQuestionnaireForm = {
  id: 'lead-questionnaire',
  name: 'Owner Lead Questionnaire',
  description: 'Qualifying questions for new owner leads',
  version: '2.1',
  type: 'lead-questionnaire',
  sections: [
    {
      id: 'section-basic',
      title: 'Basic Information',
      order: 1,
      fields: [
        {
          id: 'field-firstname',
          label: 'First Name',
          type: 'text',
          required: false,
          order: 1,
          helpText: ''
        },
        {
          id: 'field-lastname',
          label: 'Last Name',
          type: 'text',
          required: false,
          order: 2,
          helpText: ''
        },
        {
          id: 'field-email',
          label: 'Email Address',
          type: 'email',
          required: false,
          order: 3,
          helpText: ''
        },
        {
          id: 'field-phone',
          label: 'Phone Number',
          type: 'phone',
          required: false,
          order: 4,
          helpText: ''
        }
      ]
    },
    {
      id: 'section-interest',
      title: 'Management Interest',
      order: 2,
      fields: [
        {
          id: 'field-num-properties',
          label: 'How many properties do you want us to manage?',
          type: 'number',
          required: false,
          order: 1,
          helpText: ''
        },
        {
          id: 'field-timeline',
          label: 'When would you like to start management?',
          type: 'select',
          required: false,
          order: 2,
          options: ['Immediately', 'Within 1 month', '1-3 months', '3-6 months', 'Not sure yet'],
          helpText: ''
        },
        {
          id: 'field-experience',
          label: 'Have you worked with a property manager before?',
          type: 'select',
          required: false,
          order: 3,
          options: ['Yes', 'No'],
          helpText: ''
        },
        {
          id: 'field-specific-needs',
          label: 'What specific services are you looking for?',
          type: 'select',
          required: false,
          order: 4,
          options: [
            'Full property management',
            'Tenant placement only',
            'Maintenance coordination',
            'Lease renewals',
            'Financial reporting',
            'Other (specify below)'
          ],
          helpText: 'Select the main service you need'
        },
        {
          id: 'field-current-situation',
          label: 'Current Situation',
          type: 'select',
          required: false,
          order: 5,
          options: [
            'Currently self-managing',
            'Switching from another PM company',
            'New property owner',
            'Property currently vacant',
            'Have existing tenants'
          ],
          helpText: 'This helps us understand your needs better'
        },
        {
          id: 'field-additional-info',
          label: 'Specific Questions or Additional Details',
          type: 'textarea',
          required: false,
          order: 6,
          helpText: 'Please be specific - e.g., "Need help finding quality tenants for my 3-bed house" or "Current PM not handling maintenance well"',
          placeholder: 'Tell us more about what you\'re looking for...'
        }
      ]
    },
    {
      id: 'section-property',
      title: 'Property Details',
      order: 3,
      repeatable: true,
      fields: [
        {
          id: 'field-address',
          label: 'Property Address',
          type: 'text',
          required: false,
          order: 1,
          helpText: 'Full street address of the property'
        },
        {
          id: 'field-property-type',
          label: 'Property Type',
          type: 'select',
          required: false,
          order: 2,
          options: ['Single Family Home', 'Condo', 'Townhouse', 'Multi-Family', 'Other'],
          helpText: ''
        },
        {
          id: 'field-bedrooms',
          label: 'Number of Bedrooms',
          type: 'number',
          required: false,
          order: 3,
          helpText: ''
        },
        {
          id: 'field-bathrooms',
          label: 'Number of Bathrooms',
          type: 'number',
          required: false,
          order: 4,
          helpText: ''
        },
        {
          id: 'field-currently-rented',
          label: 'Is the property currently rented?',
          type: 'select',
          required: false,
          order: 5,
          options: ['Yes', 'No', 'Vacant'],
          helpText: ''
        }
      ]
    }
  ]
};

// Owner Onboarding Application - CAN have required fields
export const mockOnboardingForm = {
  id: 'onboarding-application',
  name: 'Owner Onboarding Application',
  description: 'Complete application for approved owner leads',
  version: '1.5',
  type: 'onboarding-application',
  sections: [
    {
      id: 'section-owner',
      title: 'Owner Information',
      order: 1,
      fields: [
        {
          id: 'field-legal-entity',
          label: 'Legal Entity Name',
          type: 'text',
          required: true,
          order: 1,
          helpText: 'Name of LLC, corporation, or individual'
        },
        {
          id: 'field-tax-id',
          label: 'Tax ID / EIN',
          type: 'text',
          required: true,
          order: 2,
          helpText: 'Required for tax reporting'
        },
        {
          id: 'field-mailing-address',
          label: 'Mailing Address',
          type: 'textarea',
          required: true,
          order: 3,
          helpText: 'Where should we send important documents?'
        },
        {
          id: 'field-business-structure',
          label: 'Business Structure',
          type: 'select',
          required: true,
          order: 4,
          options: ['Individual', 'LLC', 'Corporation', 'Partnership', 'Trust'],
          helpText: ''
        },
        {
          id: 'field-emergency-contact',
          label: 'Emergency Contact Name',
          type: 'text',
          required: false,
          order: 5,
          helpText: ''
        },
        {
          id: 'field-emergency-phone',
          label: 'Emergency Contact Phone',
          type: 'phone',
          required: false,
          order: 6,
          helpText: ''
        }
      ]
    },
    {
      id: 'section-property',
      title: 'Property Information',
      order: 2,
      repeatable: true,
      fields: [
        {
          id: 'field-property-address',
          label: 'Property Address',
          type: 'text',
          required: true,
          order: 1,
          helpText: 'Full street address'
        },
        {
          id: 'field-property-bedrooms',
          label: 'Bedrooms',
          type: 'number',
          required: true,
          order: 2,
          helpText: ''
        },
        {
          id: 'field-property-bathrooms',
          label: 'Bathrooms',
          type: 'number',
          required: true,
          order: 3,
          helpText: ''
        },
        {
          id: 'field-square-footage',
          label: 'Square Footage',
          type: 'number',
          required: false,
          order: 4,
          helpText: ''
        },
        {
          id: 'field-year-built',
          label: 'Year Built',
          type: 'number',
          required: false,
          order: 5,
          helpText: ''
        },
        {
          id: 'field-pets-allowed',
          label: 'Pets Allowed',
          type: 'select',
          required: true,
          order: 6,
          options: ['Yes', 'No', 'Case by case'],
          helpText: ''
        },
        {
          id: 'field-min-rent',
          label: 'Minimum Rent Price',
          type: 'number',
          required: true,
          order: 7,
          helpText: 'Minimum monthly rent you will accept'
        },
        {
          id: 'field-garage-code',
          label: 'Garage Code',
          type: 'text',
          required: false,
          order: 8,
          helpText: 'If applicable'
        },
        {
          id: 'field-hoa',
          label: 'HOA Name',
          type: 'text',
          required: false,
          order: 9,
          helpText: 'If part of an HOA'
        },
        {
          id: 'field-hoa-fee',
          label: 'Monthly HOA Fee',
          type: 'number',
          required: false,
          order: 10,
          helpText: ''
        }
      ]
    },
    {
      id: 'section-preferences',
      title: 'Management Preferences',
      order: 3,
      fields: [
        {
          id: 'field-lease-length',
          label: 'Preferred Lease Length',
          type: 'select',
          required: true,
          order: 1,
          options: ['6 months', '12 months', '18 months', '24 months', 'Month-to-month'],
          helpText: ''
        },
        {
          id: 'field-maintenance-limit',
          label: 'Maintenance Approval Limit',
          type: 'number',
          required: true,
          order: 2,
          helpText: 'Max amount we can approve without contacting you'
        },
        {
          id: 'field-showing-instructions',
          label: 'Showing Instructions',
          type: 'textarea',
          required: false,
          order: 3,
          helpText: 'Special instructions for showing the property'
        }
      ]
    },
    {
      id: 'section-documents',
      title: 'Documents & Signatures',
      order: 4,
      fields: [
        {
          id: 'field-management-agreement',
          label: 'Property Management Agreement',
          type: 'checkbox',
          required: true,
          order: 1,
          helpText: 'I have read and agree to the Property Management Agreement'
        },
        {
          id: 'field-w9-upload',
          label: 'W9 Tax Form',
          type: 'checkbox',
          required: true,
          order: 2,
          helpText: 'I have completed and uploaded my W9 form'
        },
        {
          id: 'field-signature',
          label: 'Electronic Signature',
          type: 'text',
          required: true,
          order: 3,
          helpText: 'Type your full legal name'
        },
        {
          id: 'field-signature-date',
          label: 'Signature Date',
          type: 'date',
          required: true,
          order: 4,
          helpText: ''
        }
      ]
    }
  ]
};

export const fibonacciCadence = [1, 2, 3, 5, 8, 13]; // Days

// Generate time-series funnel data for the past year
// Hard-coded with specific close rates by source:
// PMW: 70% close rate | Phone: 60% | Email: 55% | SMS: 65% | Word of Mouth: 75%
// Target: ~150 leads/year → ~100 onboarded/year (overall ~67% close rate)
const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  const leadSources = ['PMW', 'Phone', 'Email', 'SMS', 'Word of Mouth'];
  
  // Hard-coded conversion rates by source
  // Lead → Application: 85% | Application → Onboarded: varies by source to hit target close rates
  const sourceMetrics = {
    'PMW': { 
      targetLeadsPerYear: 90,  // 60% of total
      leadToApp: 0.85,         // 85% become applications (77 apps)
      appToOnboard: 0.82       // 82% of apps onboard (63 onboarded) → 70% close rate
    },
    'Phone': { 
      targetLeadsPerYear: 23,  // 15% of total
      leadToApp: 0.85,         // 85% become applications (20 apps)
      appToOnboard: 0.71       // 71% of apps onboard (14 onboarded) → 60% close rate
    },
    'Email': { 
      targetLeadsPerYear: 18,  // 12% of total
      leadToApp: 0.85,         // 85% become applications (15 apps)
      appToOnboard: 0.65       // 65% of apps onboard (10 onboarded) → 55% close rate
    },
    'SMS': { 
      targetLeadsPerYear: 12,  // 8% of total
      leadToApp: 0.85,         // 85% become applications (10 apps)
      appToOnboard: 0.76       // 76% of apps onboard (8 onboarded) → 65% close rate
    },
    'Word of Mouth': { 
      targetLeadsPerYear: 15,  // 10% of total
      leadToApp: 0.85,         // 85% become applications (13 apps)
      appToOnboard: 0.88       // 88% of apps onboard (11 onboarded) → 75% close rate
    }
  };
  
  // Generate hourly data for the last 24 hours
  // Hard-coded patterns for realistic hourly distribution
  const hourlyPatterns = {
    'PMW': [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0],      // 4 leads in 24h
    'Phone': [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0],    // 2 leads in 24h
    'Email': [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],    // 1 lead in 24h
    'SMS': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],      // 0 leads in 24h
    'Word of Mouth': [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0] // 1 lead in 24h
  };
  
  for (let i = 24; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
    
    let totalLeads = 0;
    let totalApplications = 0;
    let totalOnboarded = 0;
    
    leadSources.forEach((source) => {
      const hourlyLeads = hourlyPatterns[source][i];
      const applications = hourlyLeads > 0 ? (Math.random() < sourceMetrics[source].leadToApp ? 1 : 0) : 0;
      const onboarded = applications > 0 ? (Math.random() < sourceMetrics[source].appToOnboard ? 1 : 0) : 0;
      
      totalLeads += hourlyLeads;
      totalApplications += applications;
      totalOnboarded += onboarded;
      
      data.push({
        date: dateStr,
        source,
        leads: hourlyLeads,
        applications: applications,
        onboarded: onboarded
      });
    });
    
    data.push({
      date: dateStr,
      source: 'all',
      leads: totalLeads,
      applications: totalApplications,
      onboarded: totalOnboarded
    });
  }
  
  // Generate daily data points for the past 365 days
  // Hard-coded patterns that sum to target annual totals with proper conversion rates
  const dailyPatterns = {
    // PMW: 90 leads/year → 0.25 leads/day avg → pattern: mostly 0s, some 1s, occasional 2s
    'PMW': Array(365).fill(0).map((_, i) => {
      const pattern = i % 4; // Cycle: 0,1,2,3
      if (pattern === 0) return 1;
      if (pattern === 1) return 0;
      if (pattern === 2) return 1;
      return 0; // pattern === 3
    }), // ~91 leads
    
    // Phone: 23 leads/year → 0.06 leads/day avg → pattern: mostly 0s, rare 1s
    'Phone': Array(365).fill(0).map((_, i) => {
      return i % 16 === 0 ? 1 : 0;
    }), // ~23 leads
    
    // Email: 18 leads/year → 0.05 leads/day avg → pattern: mostly 0s, rare 1s
    'Email': Array(365).fill(0).map((_, i) => {
      return i % 20 === 0 ? 1 : 0;
    }), // ~18 leads
    
    // SMS: 12 leads/year → 0.03 leads/day avg → pattern: mostly 0s, very rare 1s
    'SMS': Array(365).fill(0).map((_, i) => {
      return i % 30 === 0 ? 1 : 0;
    }), // ~12 leads
    
    // Word of Mouth: 15 leads/year → 0.04 leads/day avg → pattern: mostly 0s, rare 1s
    'Word of Mouth': Array(365).fill(0).map((_, i) => {
      return i % 24 === 0 ? 1 : 0;
    }) // ~15 leads
  };
  
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayIndex = 365 - i;
    
    let totalLeads = 0;
    let totalApplications = 0;
    let totalOnboarded = 0;
    
    leadSources.forEach((source) => {
      const dailyLeads = dailyPatterns[source][dayIndex] || 0;
      
      // Apply conversion rates deterministically based on cumulative progress
      let applications = 0;
      let onboarded = 0;
      
      if (dailyLeads > 0) {
        // Use day index to deterministically convert leads
        const conversionSeed = (dayIndex * 7 + leadSources.indexOf(source)) % 100;
        applications = conversionSeed < (sourceMetrics[source].leadToApp * 100) ? dailyLeads : 0;
        
        if (applications > 0) {
          const onboardSeed = (dayIndex * 13 + leadSources.indexOf(source) * 3) % 100;
          onboarded = onboardSeed < (sourceMetrics[source].appToOnboard * 100) ? applications : 0;
        }
      }
      
      totalLeads += dailyLeads;
      totalApplications += applications;
      totalOnboarded += onboarded;
      
      data.push({
        date: dateStr,
        source,
        leads: dailyLeads,
        applications: applications,
        onboarded: onboarded
      });
    });
    
    data.push({
      date: dateStr,
      source: 'all',
      leads: totalLeads,
      applications: totalApplications,
      onboarded: totalOnboarded
    });
  }
  
  return data;
};

export const timeSeriesFunnelData = generateTimeSeriesData();

