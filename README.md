# BTLSuite - House Builder & Warehouse Management

A full-featured timber frame house builder and warehouse management application with 3D visualization, panel editing, I-joist cassette builder, production management, and waste optimization -- built for the UK offsite manufacturing industry serving builders like Vistry, Redrow, Bovis, Linden, Countryside, Barratt, Taylor Wimpey, Persimmon, Bellway, and others.

## Features

### House Design & 3D
- **3D House Viewer** - Interactive 3D view with orbit controls, camera angles (3D/Front/Side/Top), shadows, grid
- **Site Management** - CRUD for building sites with name, address, lot dimensions
- **House Styles** - Presets (Colonial, Modern, Craftsman, Ranch, Contemporary) with custom style creation
- **Panel System** - Clickable/editable wall, floor, and roof panels with position, size, rotation, material, openings
- **I-Joist Cassette Builder** - Presets (TJI 110/210/230/360/560), spacing config, cross-section SVG preview
- **3D Model Editor** - Transform controls (Move/Rotate/Scale), wireframe, dimension labels

### Warehouse & Inventory
- **Full Stock Management** - Timber, sheet materials, I-joists, insulation, fixings, membranes
- **Stock Levels & Alerts** - Low stock warnings with minimum thresholds
- **Location Tracking** - Bay/rack references for all stock items
- **Stock Valuation** - Real-time total inventory value
- **Category Filtering & Search** - Filter by material type, search by name/location

### Production Management
- **Order Tracking** - Production orders with builder name, site, house, status, progress
- **Builder Integration** - Presets for major UK housebuilders (Vistry, Redrow, Bovis, Linden, Countryside, etc.)
- **Production Lines** - Track wall panel, floor cassette, roof panel, and saw line capacity/status
- **Delivery Management** - Track incoming deliveries from suppliers
- **Bill of Materials** - Auto-generate BOMs from production orders with cost estimates

### Waste Management
- **Waste Logging** - Track offcuts, damaged, and defective materials with recyclability
- **Cutting Optimiser** - First-Fit Decreasing bin packing algorithm to minimise material waste
- **Visual Cutting Diagrams** - See how cuts are laid out on stock lengths
- **Waste Analytics** - Charts for waste by type, by material, weekly trends, recycling rate

### Dashboard
- **KPI Overview** - Orders, panels, cassettes, roof sections, stock value, low stock, waste entries
- **Active Production** - Live view of in-production orders with progress bars
- **Production Line Status** - Capacity utilisation across all lines
- **Delivery Tracking** - Pending deliveries at a glance

## Tech Stack

- **React 18** with Vite
- **React Three Fiber** (Three.js) for 3D rendering
- **@react-three/drei** for 3D helpers
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
    houseStore.js        # House design state (sites, styles, panels, i-joists, editor)
    warehouseStore.js    # Warehouse state (inventory, orders, waste, cutting, BOM, deliveries)
  components/
    Viewport3D.jsx       # 3D canvas with house model, panels, i-joists, transforms
    Toolbar.jsx          # Top navigation with all module tabs
    Sidebar.jsx          # Left sidebar for design tabs
    SiteManager.jsx      # Site CRUD
    HouseStylePicker.jsx # House style selection
    PanelList.jsx        # Panel listing grouped by floor
    PanelEditor.jsx      # Right panel for editing panel properties
    IJoistCassetteBuilder.jsx  # I-joist cassette builder with presets
    EditorControls.jsx   # 3D editor settings
    Dashboard.jsx        # KPI dashboard with active production overview
    WarehouseInventory.jsx  # Full inventory management table
    ProductionManager.jsx   # Orders, production lines, deliveries, BOM
    WasteManager.jsx     # Waste logging, cutting optimiser, analytics
```

## Usage

1. **Dashboard** shows the overview of all operations
2. **Design** tab to select sites and house styles, generating panels
3. **Panels** tab to manage wall, floor, roof panels -- click to edit
4. **I-Joists** tab to configure floor cassettes with joist presets
5. **3D Editor** for transform controls on panels
6. **Warehouse** for full inventory management with stock levels
7. **Production** for order tracking, production lines, deliveries, and BOM generation
8. **Waste** for waste logging, cutting optimisation, and analytics
