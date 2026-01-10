# Timeline Feature Documentation

## Overview

The timeline is the core feature of the project, displaying historical events chronologically from prehistoric times to the modern era. It presents conventional historical understanding.

## Structure

The timeline is organized into major historical periods, each containing multiple events:

1. **PREHISTORIC PERIOD (300,000 - 10,000 BCE)**
2. **EARLY NEOLITHIC REVOLUTION (10,000 - 5,000 BCE)**
3. **EARLY URBAN CIVILIZATIONS (5,000 - 3,000 BCE)**
4. **BRONZE AGE CIVILIZATIONS (3,000 - 1,200 BCE)**
5. **IRON AGE & CLASSICAL PERIOD (1,200 BCE - 500 CE)**
6. **POST-CLASSICAL PERIOD (500 - 1500 CE)**
7. **EARLY MODERN PERIOD (1500 - 1800 CE)**
8. **MODERN ERA (1800 - PRESENT)**

## Visual Design

- **Vertical Format**: Events appear along a central axis
- **Alternating Layout**: Events alternate between left and right sides
- **Period Headers**: Collapsible section headers for each time period
- **Timeline Dots**: Visual connectors showing chronological relationships
- **Responsive Design**: Adapts to different screen sizes
- **Animation**: Elements animate into view during scrolling

## Implementation

### HTML Structure

```html
<div class="timeline-container">
    <!-- Period Section -->
    <div class="timeline-section">
        <h3 class="period-title">PERIOD NAME (DATE RANGE)</h3>
    </div>
    
    <!-- Timeline Item -->
    <div class="timeline-item">
        <div class="date">
            <h3>DATE</h3>
            <p>Short description</p>
        </div>
        <div class="timeline-dot"></div>
        <div class="content">
            <h3>EVENT TITLE</h3>
            <p>Event description</p>
        </div>
    </div>
</div>
```

### CSS Implementation

The timeline uses a combination of CSS techniques:

- Flexbox for layout structure
- CSS Grid for some alignment aspects
- Transforms for visual positioning
- Transitions for smooth animations
- Media queries for responsive design

### JavaScript Functionality

#### Core Functions

1. **Scroll Animation**
   - Elements animate into view as they enter the viewport
   - Uses intersection observers for efficient detection

2. **Section Collapse/Expand**
   - Period headers can be clicked to collapse/expand their events
   - Visual indicators show collapsed state

3. **Timeline Navigation**
   - Quick-jump buttons for different periods
   - Smooth scrolling to selected sections

## Interactive Features

### Detailed Event Views

When a timeline item is clicked, a detailed modal appears with:

- Event overview
- Detailed description
- Cultural context
- Key historical figures
- Locations
- Related artifacts
- Navigation between events

### Search and Filtering

The timeline can be searched and filtered by:

- Keywords in event content
- Date ranges
- Categories (e.g., cultural, technological)
- Geographical regions

### Educational Elements

- "Did You Know?" panels with interesting facts
- Facts specific to each time period
- Refresh button to see different facts

## Future Enhancements

Planned improvements include:

- Integration with interactive maps
- Custom iconography for different event types
- Era-specific visual styling
- Horizontal timeline view option
- Compact view for dense sections

## File References

- `index.html` - Main HTML with timeline structure
- `css/style.css` - Main styling
- `css/timeline-enhancements.css` - Timeline-specific styles
- `js/script.js` - Core functionality
- `js/timeline-data.js` - Event data
- `js/timeline-enhancements.js` - Interactive features
- `js/timeline-navigation.js` - Navigation components

## User Instructions

### Basic Navigation

- Scroll to move through time periods
- Click section headers to collapse/expand
- Click events to see detailed information
- Use era jump buttons for quick navigation

### Search

- Click the search icon to open search panel
- Enter keywords to find specific events
- Use filters to narrow results
- Click search results to navigate directly to events

### Mobile Usage

- Swipe vertically to navigate timeline
- Tap section headers to collapse/expand
- Tap events to open detailed view
- Use the floating navigation for quick jumps

## Recent Updates

### Timeline Improvements (April 13, 2025)

1. **Chronological Accuracy & Content Alignment**
   - Aligned timeline structure and events in `index.html` and `docs/features/timeline.md` with the master conventional history in `docs/timeline.md`.
   - Removed theoretical history sections (Pre-Cataclysm, Great Cataclysm, Recovery & Knowledge Preservation) and associated events.
   - Updated period titles and date ranges (e.g., Prehistoric end date, consolidated Neolithic, Early Urban name/date, added ranges to later periods).
   - Corrected placement of specific events (e.g., Sumerian city-states, Phoenician Alphabet).
   - Re-inserted previously removed Neolithic events (Vinča, Çatalhöyük, etc.) into the correct section.
   - Removed references to 'theoretical' content distinctions.
   - Added key events within the Late Paleolithic / Younger Dryas timeframe (~18,000 - 9,700 BCE), including Magdalenian culture, Bølling-Allerød warming, Younger Dryas onset/end, associated ecological/cultural changes, and the Younger Dryas Impact Hypothesis (marked as theoretical).
   - Added the intentional burial of Göbekli Tepe around 8,000 BCE.

2. **Content Refinements (Previous)**
   - Removed duplicate "Beginning of Holocene" entries.
   - Added more descriptive content for agricultural innovations at 9,500 BCE.
   - Improved descriptions for Bronze Age events.

3. **Visual Consistency (Previous)**
   - Standardized date formatting with commas for thousands (e.g., 2,700 BCE).
   - Added consistent prefixes for approximate dates ("c." prefix).
   - Removed empty lines and improved section spacing.
   - Removed duplicated sections and redundant entries.