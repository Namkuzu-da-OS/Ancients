# Implementation Guide

This document provides technical details for developers working on the Ancient History Timeline project.

## Project Structure

```
test/
├── css/                    # Stylesheets
│   ├── style.css           # Main styling
│   ├── timeline-enhancements.css
│   ├── modal.css
│   ├── timeline-navigation.css
│   ├── search-enhancements.css
│   ├── subtle-search.css
│   ├── did-you-know.css
│   └── webgl-zen.css       # WebGL portal effect styling
├── docs/                   # Documentation
│   ├── development/        # Developer documentation
│   └── features/           # Feature-specific documentation
├── images/                 # Image assets
├── js/                     # JavaScript files
│   ├── webgl/              # WebGL implementation
│   │   ├── webgl-zen.js    # Portal effect implementation
│   │   └── zen-init.js     # WebGL initialization
│   ├── script.js           # Core functionality
│   ├── timeline-data.js    # Timeline data structure
│   ├── timeline-enhancements.js
│   ├── modal.js
│   ├── timeline-navigation.js
│   ├── search-enhancements.js
│   ├── did-you-know.js
│   └── subtle-search.js
├── index.html              # Main HTML file
├── README.md               # Project overview
└── CHANGELOG.md            # Version history
```

## Coding Standards

### HTML
- Use semantic HTML5 elements
- Maintain proper document structure
- Use classes for styling, IDs for JavaScript hooks
- Keep accessibility in mind (ARIA attributes, proper alt text)

### CSS
- Follow BEM naming convention for classes
- Organize properties consistently
- Use responsive design with mobile-first approach
- Avoid !important declarations
- Comment complex selectors or calculations

### JavaScript
- Use ES6+ features
- Follow module pattern for organizing code
- Comment complex logic
- Use descriptive variable and function names
- Avoid global variables
- Handle errors gracefully

## Feature Implementation Guides

### 1. WebGL Portal Effect

The portal effect creates an immersive cosmic tunnel using Three.js and custom shaders.

#### Files
- `js/webgl/webgl-zen.js` - Main implementation
- `js/webgl/zen-init.js` - Initialization and dependencies
- `css/webgl-zen.css` - Styles for WebGL container

#### Key Components

1. **ZenSpace Object**
   - Main namespace containing all WebGL functionality
   - Initialization, rendering, and animation methods
   - Event handlers for interaction

2. **Scene Elements**
   - Portal shader using ray marching for depth effect
   - Nebula background with noise patterns
   - Star field with random distribution
   - Energy streams flowing toward portal center

3. **Shader Implementation**
   ```javascript
   createPortal: function() {
     // Create geometry (simple plane that fills view)
     const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
     
     // Create shader material with uniforms for time, resolution, colors, etc.
     const material = new THREE.ShaderMaterial({
       uniforms: {
         // Various uniforms including time, colors, portal center, etc.
       },
       vertexShader: `
         // Vertex shader code
       `,
       fragmentShader: `
         // Fragment shader code with ray marching techniques
       `,
       transparent: true,
       blending: THREE.AdditiveBlending
     });
     
     // Create mesh and add to scene
     const portal = new THREE.Mesh(geometry, material);
     portal.position.z = -45;
     this.scene.add(portal);
   }
   ```

4. **Interaction Handling**
   - Mouse/touch tracking for portal center
   - Camera movement on click/tap
   - Ripple effect creation

5. **Performance Optimization**
   ```javascript
   // Device capability detection
   const isLowPerfDevice = 
     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
     !this.renderer.capabilities.maxVertexUniforms > 4096;
     
   // Quality adjustment based on device
   let quality = this.config.portal.quality;
   if (quality === 'auto') {
     quality = isLowPerfDevice ? 'low' : 'high';
   }
   
   // Adjust settings based on quality level
   let ringCount, depthDetails;
   switch(quality) {
     case 'low':
       ringCount = 10;
       depthDetails = 0.3;
       break;
     case 'medium':
       ringCount = 15;
       depthDetails = 0.5;
       break;
     case 'high':
     default:
       ringCount = 20;
       depthDetails = 0.7;
   }
   ```

#### Integration
The portal effect is initialized by adding this to index.html:
```html
<div id="zen-space-container" class="zen-space-container"></div>
<script src="js/webgl/webgl-zen.js"></script>
<script src="js/webgl/zen-init.js"></script>
```

#### Performance Considerations
- Use quality settings based on device capabilities
- Optimize shader complexity for mobile devices
- Use lower resolution for post-processing on less capable devices
- Implement proper cleanup of WebGL resources

### 2. Timeline Component

The timeline is the core feature displaying historical events chronologically.

#### Files
- `js/timeline-data.js` - Data structure
- `js/timeline-enhancements.js` - Interactive features
- `css/timeline-enhancements.css` - Timeline styling

#### Implementation Details
- Vertical timeline with alternating items
- Period sections that can collapse/expand
- Scroll-triggered animations
- Clear visual distinction between theoretical and conventional content

#### Integration with Other Features
- Modal system for detailed views
- Search functionality for finding events
- Navigation system for jumping between periods

### 3. Search and Filtering

Advanced search functionality for finding timeline events.

#### Files
- `js/search-enhancements.js` - Search logic
- `js/subtle-search.js` - UI for search
- `css/search-enhancements.css` - Search styling
- `css/subtle-search.css` - Floating search button styling

#### Implementation Details
- Keyword searching throughout timeline
- Filtering by date range, content type, category, and region
- Highlighting of search terms in results
- Related search suggestions

## Adding New Features

When adding new features:

1. **Plan the feature**
   - Document requirements and design in the appropriate docs folder
   - Create implementation plan with clear milestones

2. **Create necessary files**
   - Add new JS modules for functionality
   - Add CSS for styling
   - Update HTML if needed

3. **Implement core functionality**
   - Follow the established patterns and coding standards
   - Keep modules self-contained but with clear integration points

4. **Test thoroughly**
   - Test across different browsers and devices
   - Verify performance meets goals

5. **Update documentation**
   - Add implementation details to this guide
   - Update CHANGELOG.md with the changes
   - Update project-plan.md with progress

6. **Code review**
   - Have another developer review the changes
   - Address any feedback before merging

## Troubleshooting

### WebGL Issues
- Check for WebGL support with `ZenSpace.checkWebGLSupport()`
- Verify shader compilation with the browser's developer tools
- Look for GLSL errors in the console
- Test with different quality settings for performance issues

### Performance Issues
- Use the browser's performance tools to identify bottlenecks
- Check for memory leaks with the memory profiler
- Optimize render loops and animations
- Consider reducing visual complexity on lower-end devices

### Cross-Browser Compatibility
- Test on Chrome, Firefox, Safari, and Edge
- Use feature detection instead of browser detection
- Provide fallbacks for unsupported features
- Test on both desktop and mobile devices