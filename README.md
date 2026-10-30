# Ancients - Interactive History Timeline

An interactive web-based timeline showcasing human history from prehistoric times to the modern era, with a special focus on alternative theories about pre-cataclysm advanced civilizations.

## Features

- Interactive vertical timeline with smooth scroll animations
- Detailed event views with comprehensive historical information
- Advanced search and filtering capabilities
- Educational "Did You Know?" facts for each time period
- Clear visual distinction between conventional and theoretical content
- Cosmic portal/depth effect using WebGL and Three.js for an immersive background

## WebGL Portal Effect

The timeline includes an immersive cosmic portal/depth effect that creates the illusion of looking into an infinite cosmic tunnel, providing a dramatic visual focal point. The effect features:

- Ray marching techniques for depth illusion
- Interactive response to mouse movements
- Energy streams flowing toward the portal
- Customizable visual quality for different devices
- Smooth animations and transitions

The implementation uses Three.js and custom shaders for optimal performance across devices.

## Documentation

Comprehensive documentation is available in the `docs` folder, organized by category:

### Project Management
- `development/project-plan.md` - Development roadmap and current status
- `development/implementation-guide.md` - Technical details for developers

### Feature Documentation
- `features/timeline.md` - Core timeline functionality
- `features/portal-effect.md` - WebGL cosmic portal implementation

### Version History
- `CHANGELOG.md` - Complete version history and changes

See `docs/index.md` for a complete documentation guide.

## Where it runs

- **Live:** https://ancients.meatball-labs.com, served by GitHub Pages (branch `main`, `CNAME`).
- **Content:** every word comes from `data/*.json`. Run `node tools/verify-content.mjs` before committing; it checks the data
  against the original site and fails if any event's popup is empty or still holds placeholder text.

## Getting Started

Serve the folder and open it: `python3 -m http.server 8000`, then http://localhost:8000/.

