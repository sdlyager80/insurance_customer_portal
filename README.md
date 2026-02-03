# Insurance Customer Portal

A modern React-based customer portal for ServiceNow Financial Services Operations (FSO) Insurance, designed to provide customers with an intuitive interface to manage their life insurance, annuity, and property & casualty policies.

## Features

### Policy Management
- **Multi-Policy View**: View all policies across Life, Annuity, and Property & Casualty insurance types
- **Policy Details**: Comprehensive policy information including coverage, premiums, and payment schedules
- **Inline Editing**: Update policy information directly within the interface without submitting formal requests
- **Real-time Updates**: Changes are reflected immediately in the portal

### Actions Center
- **Action Tracking**: View all pending actions and requests
- **Lifecycle Visualization**: Track the complete lifecycle of each action from creation to completion
- **Priority Indicators**: Visual badges showing action priority (high, medium, low)
- **Status Updates**: Real-time status tracking (pending, in review, approved, completed, rejected)

### User Experience
- **Modern UI**: Built with Halstack Design System for consistent, professional look and feel
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use navigation between dashboard, policy details, and actions
- **Visual Feedback**: Clear visual indicators for policy status, action priority, and lifecycle stages

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: DXC Halstack React Components
- **Routing**: React Router v6
- **Styling**: CSS Modules with custom styling

## Project Structure

```
insurance-customer-portal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ActionAlert.tsx  # Action notification component
│   │   ├── PolicyCard.tsx   # Policy summary card
│   │   └── *.css           # Component styles
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard view
│   │   ├── PolicyDetails.tsx # Detailed policy view
│   │   ├── Actions.tsx     # Actions center
│   │   └── *.css          # Page styles
│   ├── services/          # API services
│   │   └── mockApi.ts     # Mock API with sample data
│   ├── types/             # TypeScript type definitions
│   │   └── policy.ts      # Policy and action types
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd insurance-customer-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

## Features in Detail

### Dashboard
The dashboard provides an overview of all policies organized by type:
- Life Insurance policies with beneficiary information
- Annuity policies with payment schedules
- Property & Casualty policies with coverage details
- Pending actions requiring attention

### Policy Details
Each policy detail page includes:
- Coverage information (amount, effective dates)
- Payment information (premium, frequency, next payment date)
- Insured information (name, contact details, address)
- Beneficiaries (for life insurance)
- Coverage breakdown (for P&C policies)
- Inline editing for key fields (premium, payment frequency, contact info)

### Actions Center
The actions center shows:
- All pending and completed actions
- Action details (title, description, priority, due date)
- Complete lifecycle tracking with timestamps
- Status indicators at each stage
- Ability to mark actions as complete
- Quick links to related policies

## Mock Data

The application currently uses mock data defined in `src/services/mockApi.ts`. This includes:
- 4 sample policies (Life, Annuity, Home, Auto)
- 4 sample customer actions
- Sample lifecycle events for each action

## Integration with ServiceNow FSO

To integrate with actual ServiceNow FSO Insurance APIs:

1. Replace the mock API functions in `src/services/mockApi.ts` with actual API calls
2. Update the API endpoints to point to your ServiceNow instance
3. Implement authentication and session management
4. Update the type definitions in `src/types/policy.ts` to match your data model

Example API integration structure:
```typescript
export const policyApi = {
  getAllPolicies: async (): Promise<Policy[]> => {
    const response = await fetch('/api/now/table/x_insurance_policy', {
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    });
    return response.json();
  },
  // ... other methods
};
```

## Customization

### Styling
- Global styles: `src/index.css`
- Component styles: Individual CSS files next to each component
- Halstack theme: Can be customized via HalstackProvider in `src/main.tsx`

### Adding New Policy Types
1. Add new type to `PolicyType` in `src/types/policy.ts`
2. Add icon and color scheme in `PolicyCard.tsx`
3. Update dashboard grouping logic in `Dashboard.tsx`

### Adding New Action Types
1. Update mock data in `src/services/mockApi.ts`
2. Add custom handling in `Actions.tsx` if needed
3. Update type definitions if new fields are required

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future development:
- Document upload and management
- Claims submission and tracking
- Payment processing integration
- Multi-language support
- Dark mode theme
- Mobile app version
- Push notifications for action updates
- PDF policy document generation
- Analytics dashboard
- Live chat support integration

## Contributing

This is a custom implementation for ServiceNow FSO Insurance. For modifications or enhancements, please follow the standard development workflow and ensure all changes are tested across different policy types and user scenarios.

## License

Proprietary - For use with ServiceNow Financial Services Operations Insurance only.
