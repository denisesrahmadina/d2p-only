# DPK Flow Page Documentation

## Overview
The DPK (Daftar Permintaan Kebutuhan) Flow page is a comprehensive workflow visualization interface that guides users through the procurement requirements planning process. This page provides an intuitive, step-by-step visualization of the DPK simulation process.

## Route Information
- **URL Path**: `/procurements/demand-to-plan/dpk/flow`
- **Parent Route**: `/procurements/demand-to-plan/dpk`
- **Component Location**: `src/pages/DemandToPlan/DPKFlow.tsx`

## Page Structure

### 1. Header Section
- **Back Navigation**: Button to return to the Demand to Plan landing page
- **Page Title**: "Daftar Permintaan Kebutuhan (DPK) Flow"
- **Subtitle**: "Step-by-step procurement requirements planning workflow"

### 2. Process Flow Visualization
The main feature of the page is a visual workflow containing 5 sequential stages:

#### Stage 1: Annual Forecast
- **Icon**: Calendar
- **Subtitle**: Generate ERP-based forecast
- **Description**: AI-powered historical data analysis to generate annual procurement forecasts
- **Input**: Historical demand records
- **Processing**: AI-powered analysis
- **Output**: Quarterly forecast data

#### Stage 2: Demand Consolidation
- **Icon**: GitMerge
- **Subtitle**: Merge ERP and user forecasts
- **Description**: Consolidate ERP forecasts with user-submitted forecast data
- **Status**: Currently set as "in-progress" by default

#### Stage 3: Demand Adjustment
- **Icon**: Sliders
- **Subtitle**: Review and adjust forecasts
- **Description**: Manual review and adjustment of consolidated demand forecasts

#### Stage 4: Demand Netting
- **Icon**: Scale
- **Subtitle**: Calculate net requirements
- **Description**: Net demand against inventory and open purchase orders

#### Stage 5: Final Procurement Table
- **Icon**: FileText
- **Subtitle**: Generate procurement plan
- **Description**: Create final procurement requirements and convert to DRP

### 3. Stage Status System
Each stage has one of three possible statuses:
- **Completed** (Green badge with CheckCircle icon)
- **In Progress** (Blue badge with Clock icon)
- **Pending** (Gray badge with Play icon)

### 4. Stage Details Panel
Below the flow visualization, a detailed panel shows:
- Stage icon and title
- Status badge
- Detailed description
- Stage-specific information (input, processing method, output)
- Navigation buttons (Previous/Next Stage)

## Responsive Design

### Desktop View (lg and above)
- Horizontal flow layout with stages displayed side-by-side
- Connected by arrow icons (ChevronRight)
- Stage selection via click
- Active stage is highlighted with scale effect and ring border

### Mobile/Tablet View (below lg)
- Vertical flow layout with stages stacked
- Connected by vertical line separators
- Full-width stage cards
- Touch-friendly interface

## Interactive Features

### 1. Stage Navigation
- **Click on Stage**: Select and view details for any stage
- **Previous Button**: Navigate to the previous stage (disabled on Stage 1)
- **Next Button**: Navigate to the next stage (disabled on Stage 5)

### 2. Visual Feedback
- **Hover Effects**: Stages become fully opaque on hover
- **Active Stage**: Scaled up with blue ring border
- **Status Icons**: Dynamic icons based on stage completion status
- **Color Coding**:
  - Green = Completed
  - Blue = In Progress
  - Gray = Pending

### 3. Start Simulation Button
- Located in the top-right of the process flow panel
- Triggers simulation process (placeholder for future implementation)

## Access Points

### From DPK Module Page
A prominent "View DPK Flow" button has been added to the DPK Module header:
- **Style**: Gradient purple-to-blue background
- **Icon**: Workflow icon
- **Location**: Top-right of the page header
- **Navigation**: Redirects to `/procurements/demand-to-plan/dpk/flow`

## Technical Implementation

### Component Architecture
```
DPKFlow (Main Component)
├── Header Section
│   ├── Back Navigation Button
│   └── Page Title & Subtitle
├── Process Flow Panel
│   ├── Desktop Horizontal Flow
│   └── Mobile Vertical Flow
└── Stage Details Panel
    ├── Stage Icon & Title
    ├── Status Badge
    ├── Description
    ├── Details Card
    └── Navigation Buttons
```

### State Management
- `currentStage`: Tracks the currently selected stage (1-5)
- `stages`: Array of stage objects with id, title, subtitle, icon, status, and description
- Stage status can be updated dynamically (prepared for future backend integration)

### Styling
- Tailwind CSS for all styling
- Dark mode support throughout
- Smooth transitions and animations
- Shadow effects for depth perception
- Responsive breakpoints for optimal viewing

## Future Enhancements

### Planned Features
1. **Real-time Status Updates**: Connect to backend to track actual stage progress
2. **Stage-Specific Data Display**: Show actual data for each stage (forecasts, consolidations, etc.)
3. **Export Functionality**: Download stage results and reports
4. **Historical Tracking**: View previous simulation runs
5. **User Input Forms**: Allow users to input data at appropriate stages
6. **Validation Checks**: Verify data quality before proceeding to next stage
7. **Approval Workflows**: Multi-level approval for critical stages

### Backend Integration Points
- Fetch current stage status from database
- Load stage-specific data (forecasts, consolidations, netting results)
- Save user inputs and adjustments
- Track simulation history
- Generate final procurement reports

## Usage Guidelines

### For End Users
1. Navigate to the DPK module from the Demand to Plan landing page
2. Click "View DPK Flow" button in the header
3. Review the 5-stage workflow visualization
4. Click on any stage to view detailed information
5. Use Previous/Next buttons to navigate sequentially
6. Click "Start Simulation" to initiate the process (when implemented)

### For Developers
1. The component is fully self-contained in `DPKFlow.tsx`
2. Stage data is maintained in local state (ready for API integration)
3. All icons are from lucide-react library
4. Responsive breakpoints use Tailwind's lg breakpoint
5. Navigation is handled via React Router's useNavigate hook

## Maintenance Notes

### Updating Stages
To modify stage information, update the `stages` array in the component's initial state:
```typescript
const [stages, setStages] = useState<FlowStage[]>([
  // Add or modify stage objects here
]);
```

### Customizing Colors
Stage status colors can be adjusted in the `getStatusColor` function:
```typescript
const getStatusColor = (status: StageStatus) => {
  // Modify color classes here
};
```

### Adding New Stages
1. Add new stage object to the `stages` array
2. Update the stage details template
3. Adjust responsive layout if needed (consider UX with >5 stages)

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Optimized for screens 320px and above

## Performance Considerations
- Minimal re-renders using React best practices
- Smooth animations via CSS transitions
- Lightweight component structure
- No heavy dependencies
- Optimized for fast initial load

## Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Clear visual hierarchy
- Sufficient color contrast
- Screen reader compatible
- Focus indicators on interactive elements

---

**Last Updated**: November 5, 2025
**Version**: 1.0.0
**Author**: Development Team
