# BTLSuite - House Builder

A full-featured house builder application with 3D visualization, panel editing, and I-joist cassette builder.

## Features

- **3D House Viewer** - Interactive 3D view of the house model with orbit controls, multiple camera angles (3D, Front, Side, Top)
- **Site Management** - Create and manage building sites with names, addresses, and lot dimensions
- **House Styles** - Choose from preset styles (Colonial, Modern, Craftsman, Ranch, Contemporary) or create custom styles
- **Panel System** - Each wall, floor, and roof panel is clickable and editable with properties for position, size, rotation, material, and openings
- **I-Joist Cassette Builder** - Full cassette builder with joist presets (TJI series), configurable spacing, materials, and grades
- **3D Model Editor** - Transform controls for moving, rotating, and scaling panels in the 3D viewport
- **Cross-Section Preview** - SVG-based I-joist cross-section visualization

## Tech Stack

- **React 18** with Vite
- **React Three Fiber** (Three.js) for 3D rendering
- **@react-three/drei** for 3D helpers (OrbitControls, TransformControls, Grid, Environment)
- **Zustand** for state management

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  store/
    houseStore.js      # Zustand store - sites, styles, panels, i-joists, editor state
  components/
    Viewport3D.jsx     # 3D canvas with house model, panels, i-joists, transform controls
    Toolbar.jsx        # Top toolbar with tabs, editor mode, view controls
    Sidebar.jsx        # Left sidebar routing between tabs
    SiteManager.jsx    # Site CRUD with inline editing
    HouseStylePicker.jsx  # House style selection and editing
    PanelList.jsx      # Panel listing grouped by floor
    PanelEditor.jsx    # Right panel for editing selected panel properties
    IJoistCassetteBuilder.jsx  # I-joist cassette builder with presets and cross-section
    EditorControls.jsx # 3D editor settings and keyboard shortcuts
```

## Usage

1. **Select a Site** from the House tab sidebar
2. **Choose a House Style** to generate the initial panel layout
3. **Click any panel** in the 3D view or panel list to select and edit it
4. **Switch to I-Joists tab** to configure cassettes with preset joist types and spacing
5. **Use the 3D Editor tab** for transform controls (Move/Rotate/Scale)
6. **Edit panel properties** in the right sidebar when a panel is selected
