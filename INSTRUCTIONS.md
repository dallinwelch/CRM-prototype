# CRM Proto - React Application

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Access the Application**:
   - Open your browser and go to: http://localhost:3000
   - The app will automatically reload when you make changes

### Project Structure

```
crm_proto/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Top header with search and user controls
│   │   ├── Sidebar.js         # Left navigation sidebar
│   │   ├── Dashboard.js       # Main dashboard view
│   │   ├── TasksDashboard.js  # Tasks management view
│   │   ├── SettingsTab.js     # Settings configuration
│   │   └── AutomationsTab.js  # n8n automation integration
│   ├── App.js                 # Main application component
│   ├── index.js              # Application entry point
│   └── index.css             # Global styles and theme
├── package.json
└── README.md
```

### Features

#### 🎨 **Design System**
- **Brand Colors**: Primary green `rgb(0, 165, 79)`, Text `rgb(68, 71, 69)`
- **Typography**: Inter font family
- **Layout**: Sidebar navigation + main content area
- **Responsive**: Works on desktop, tablet, and mobile

#### 📊 **Dashboard**
- Statistics overview with key metrics
- Recent activities feed
- Quick action buttons
- Clean, modern interface

#### 📋 **Tasks Management**
- Task cards with priority levels
- Status tracking (To Do, In Progress, Review, Done)
- Team assignment with avatars
- Due date tracking and overdue alerts
- Filter by status, priority, assignee

#### ⚙️ **Settings**
- Team management
- Workflow configuration
- Integration settings
- System preferences

#### 🔄 **Automations**
- n8n workflow integration
- Direct link to n8n instance
- Automation management
- Performance monitoring

### Navigation

The sidebar includes:
- **Dashboard**: Main overview
- **Property**: Properties, Associations, Marketing
- **Screening**: Lead screening workflows
- **Leases**: Lease management
- **Rentsign**: Document signing
- **Accounting**: Financial management
- **Contacts**: Contact management
- **Maintenance**: Property maintenance
- **Reports**: Analytics and reporting

### n8n Integration

- Direct access to n8n workflows at: http://localhost:5678/home/workflows
- Automation templates and examples
- Webhook configuration
- Workflow monitoring

### Development

- **Hot Reload**: Changes automatically refresh the browser
- **Component Structure**: Modular React components
- **Styling**: CSS with design system variables
- **State Management**: React hooks for local state

### Troubleshooting

1. **Port Already in Use**: If port 3000 is busy, the app will prompt to use another port
2. **Dependencies Issues**: Run `npm install` to ensure all packages are installed
3. **Browser Issues**: Clear cache and refresh if styles don't load properly

### Next Steps

- Add more specific views for each navigation item
- Implement data persistence
- Add user authentication
- Connect to real APIs
- Add more automation workflows
