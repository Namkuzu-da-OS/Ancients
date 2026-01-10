# UI/UX Design Guide

This document outlines the design principles and decisions for the Ancient History Timeline project.

## Design Philosophy

The overall design philosophy centers on:

1. **Content Focus**: UI elements support but don't distract from historical content
2. **Elegant Minimalism**: Interactive elements are visually subtle but functionally powerful  
3. **Historical Aesthetic**: Visual styling evokes ancient manuscripts and artifacts
4. **Intuitive Navigation**: Users can easily move through time periods
5. **Clear Distinction**: Theoretical and conventional content are visually distinct

## Color Palette

- **Primary Background**: Dark brown (#241a10) - Resembles aged parchment/papyrus
- **Primary Text/Accents**: Gold (#d4af37) - Evokes illuminated manuscripts and gold artifacts
- **Secondary Background**: Lighter brown (#a08a53) - Provides contrast for timeline items
- **Highlight Colors**: Lighter gold (#f5d76e) - Used for hover states and emphasis
- **Subtle Backgrounds**: Semi-transparent dark brown - For overlays and containers

## Typography

- **Headers**: Cinzel - A serif font inspired by classical Roman inscriptions
- **Body Text**: Cormorant Garamond - An elegant serif with excellent readability

## UI Components

### 1. Timeline Structure
- Vertical timeline with items alternating on either side of a central line
- Central line creates visual continuity across time periods
- Alternating items allow for more content density without overwhelming users

### 2. Search Interface
- Floating search icon that expands when clicked
- Minimizes visual impact while maintaining full functionality
- Follows progressive disclosure principles

### 3. Navigation System
- Era jump buttons for quick navigation between major time periods
- Subtle breadcrumb at the bottom showing current position
- Positioned for clear spatial understanding (jumps on left, breadcrumb on bottom)

### 4. Theoretical Content Styling
- Dashed borders instead of solid
- Slightly different background shading
- "Theoretical" badge in detailed views
- Consistent styling across all UI components

### 5. Modal Event Details
- Modal popups for detailed event information
- Creates focused reading experience without distractions
- Provides space for multiple content sections and future multimedia elements

### 6. WebGL Portal Effect
- Immersive background that doesn't interfere with content readability
- Subtle animations that enhance but don't distract
- Interactive elements responding to user input
- Color palette coordinated with the overall design theme

## Responsive Design Principles

1. **Mobile-First Approach**: Core functionality designed for smallest screens first
2. **Progressive Enhancement**: Additional features appear as screen size increases
3. **Maintained Hierarchy**: Visual hierarchy remains consistent across device sizes
4. **Touch-Friendly Targets**: Interactive elements sized appropriately for touch
5. **Simplified Navigation**: Mobile view emphasizes core navigation functions

## Implementation Guidelines

When implementing new UI components:

1. Maintain the color palette and typography system
2. Ensure new elements follow the elegant minimalism approach
3. Test interactive elements on both mouse and touch devices
4. Verify visual distinction between theoretical and conventional content
5. Keep content as the primary focus of the design

## Future Design Considerations

Upcoming design enhancements:

1. **Interactive Map Integration**: Will balance geographical information with timeline content
2. **Custom Event Iconography**: Will develop consistent visual language for different event types
3. **Light/Dark Mode**: Will maintain historical aesthetic with different lighting preferences
4. **Multimedia Integration**: Will incorporate images/video without overwhelming the timeline