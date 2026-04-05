# BTLSuite - House Builder & Warehouse Management

A full-featured timber frame house builder and warehouse management application with 3D visualization, panel editing, I-joist cassette builder, production management, and waste optimization -- built for the UK offsite manufacturing industry serving builders like Vistry, Redrow, Bovis, Linden, Countryside, Barratt, Taylor Wimpey, Persimmon, Bellway, and others.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Knockoff098/BTLSuite.git
cd BTLSuite

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser
# Go to http://localhost:3000
```

That's it -- the app launches straight into the Dashboard.

---

## Step-by-Step Tutorial

This tutorial walks through every feature of BTLSuite from scratch. Follow along in order.

### Step 1: The Dashboard

When you first open the app, you land on the **Dashboard** tab. This is your command centre.

**What you see:**
- **KPI cards** across the top showing total orders, wall panels, floor cassettes, roof sections, stock value, low stock alerts, waste entries, and active production lines
- **Active Production** section showing any orders currently being built, with progress bars
- **Production Lines** showing the status of each manufacturing line (wall panel line, floor cassette line, roof panel line, saw lines)
- **Pending Deliveries** showing incoming material shipments
- **Low Stock Alerts** highlighting any materials that have dropped below their minimum level

**Try it:** Just have a look around. The dashboard updates automatically as you make changes elsewhere in the app.

---

### Step 2: Design a House

Click the **Design** tab in the top toolbar.

**2a. Choose a Site**

On the left sidebar you'll see the **Sites** section:

1. Three example sites are pre-loaded (Riverside Estate, Hilltop Views, Oak Park)
2. Click on a site to select it -- it highlights in red
3. To add a new site, click **+ Add Site**, fill in the name, address, lot width and depth, then click **Add**
4. To edit an existing site, click the **Edit** button next to it
5. To delete a site, click the **X** button

**2b. Choose a House Style**

Below the sites you'll see **House Styles**:

1. Five preset styles are available:
   - **Colonial** -- 2 floors, gable roof
   - **Modern** -- 1 floor, flat roof
   - **Craftsman** -- 2 floors, hip roof
   - **Ranch** -- 1 floor, gable roof
   - **Contemporary** -- 3 floors, shed roof
2. Click on a style to select it -- the 3D view updates immediately with the new house model
3. Each style has a colour swatch showing the wall colour
4. Click **Edit** to change the name, number of floors, roof type, or colour
5. Click **+ Add Style** to create your own custom house style

**What happens in the 3D view:** The viewport shows the house model with all wall panels, floor panels, and roof sections generated from the style you selected. You can:
- **Orbit** -- click and drag to rotate the camera around the house
- **Zoom** -- scroll to zoom in and out
- **Pan** -- right-click and drag to pan

The overlay in the top-left corner shows the house name, site name, style, and panel count.

---

### Step 3: Work with Panels

Click the **Panels** tab.

**3a. Browse Panels**

The left sidebar shows all panels grouped by floor:
- Each panel has an icon: square for walls, hatched for floors, triangle for roofs
- The size (W x H x D) and joist count are shown
- Click any panel to select it

**3b. Edit a Panel**

When you select a panel (either by clicking in the sidebar or clicking directly on it in the 3D view):

1. The panel highlights in the 3D view with a red outline
2. A **Panel Properties** editor appears on the right side
3. You can change:
   - **Name** -- give it a descriptive name
   - **Type** -- wall, floor, or roof
   - **Material** -- timber frame, cassette, SIP, steel, tile, membrane, metal
   - **Colour** -- pick any colour
   - **Position** (X, Y, Z) -- move it in 3D space
   - **Size** (W, H, D) -- resize the panel
   - **Rotation** (X, Y, Z) -- rotate in radians
   - **Windows** (walls only) -- number of window openings
   - **Doors** (walls only) -- number of door openings
4. Changes apply immediately in the 3D view

**3c. Add, Duplicate, or Delete Panels**

- Click **+ Add Panel** at the bottom of the sidebar to add a new blank wall panel
- Click **Dup** next to any panel to duplicate it (it appears offset by 1m)
- Click **X** to delete a panel

**3d. Rebuild from Style**

If you want to reset back to the default layout for the current house style, click the **Rebuild** button in the top-right toolbar.

---

### Step 4: Configure I-Joist Cassettes

Click the **I-Joists** tab.

This is the cassette builder for floor panels.

**4a. Select a Target Panel**

Use the **Target Panel** dropdown to pick which panel you want to add joists to. Floor panels are listed by default, but any panel with existing joists also appears.

**4b. Choose a Joist Preset**

Six presets are available in a grid:
- **TJI 110** -- 241mm deep
- **TJI 210** -- 241mm deep
- **TJI 230** -- 302mm deep
- **TJI 360** -- 302mm deep (wider flanges)
- **TJI 560** -- 356mm deep
- **Custom** -- 300mm deep (editable)

Click a preset to select it. The **Cross Section** SVG below shows the I-joist profile with flange width, web thickness, and overall depth.

**4c. Set the Spacing**

Use the **Spacing** slider to set the joist centres. The range is 200mm to 800mm. Common values:
- **400mm** -- standard residential
- **600mm** -- lighter loads
- **300mm** -- heavy loads

The current value shows in red to the right of the slider.

**4d. Generate the Cassette**

Click **Generate Cassette** to fill the selected panel with joists at the chosen spacing and preset dimensions. The joists appear immediately in the 3D view as I-beam shapes (top flange, web, bottom flange).

You can also click **+ Single Joist** to add just one joist at a time.

**4e. Edit Individual Joists**

Below the generator you'll see the **Joists** list. Click any joist to edit its:
- Depth, flange width, flange thickness, web thickness
- Length
- Material (LVL, Solid Timber, Glulam, LSL)
- Grade (C16, C24, TR26, GL24h, GL28h)

Click **Update** to save or **Cancel** to discard.

---

### Step 5: Use the 3D Editor

Click the **3D Editor** tab.

**5a. Transform Mode**

Choose how to manipulate selected panels:
- **Select** -- click panels to select them (no transform handles)
- **Move** -- drag the coloured arrows to move the panel along X/Y/Z axes
- **Rotate** -- drag the rings to rotate the panel
- **Scale** -- drag the handles to scale the panel

**5b. Camera View**

Switch between camera angles:
- **3D** -- free orbit perspective
- **Front** -- straight-on front view
- **SIDE** -- side elevation
- **TOP** -- plan view from above

**5c. Display Options**

Toggle these on/off:
- **Show Wireframe** -- renders all panels as wireframe outlines
- **Show Dimensions** -- shows width, height, depth labels on the selected panel

**5d. Keyboard Shortcuts**

The editor panel lists shortcuts for quick access:
- **V** = Select, **G** = Move, **R** = Rotate, **S** = Scale
- **Del** = Delete panel, **D** = Duplicate
- **Esc** = Deselect

---

### Step 6: Manage Warehouse Inventory

Click the **Warehouse** tab.

**6a. Browse Stock**

The inventory table shows all materials with:
- Name, location (bay/rack reference), current stock, minimum level
- Unit cost, total value, stock status (OK or LOW)

**6b. Filter and Search**

- Use the **category pills** at the top to filter: All Stock, Timber, Sheet Materials, I-Joists, Insulation, Fixings, Membranes
- Type in the **search box** to find items by name or location

**6c. Adjust Stock**

- Click **+10** to add 10 units to stock
- Click **-10** to remove 10 units
- Click **Del** to remove an item entirely

**6d. Add New Stock**

Click **+ Add Stock Item** at the bottom to add a new material. Fill in:
- Name, category, location, quantity, minimum stock, cost per unit, unit type, grade

**6e. Stock Alerts**

A yellow alert bar appears at the top when any items are below their minimum stock level, listing the affected materials.

**6f. Stock Stats**

The header shows three figures:
- Total number of items
- Number of low stock items (in amber)
- Total stock value in GBP

---

### Step 7: Manage Production

Click the **Production** tab.

**7a. Orders**

The default sub-tab shows all production orders in a table:
- Site/house name, builder, status, due date, panel/cassette/roof counts, progress

**To create an order:**
1. Click **+ New Production Order**
2. Select a **Builder** from the dropdown (Vistry, Redrow, Bovis, Linden, Countryside, etc.)
3. Fill in site name, house/plot name, due date
4. Enter the number of wall panels, floor cassettes, and roof sections
5. Add any notes
6. Click **Create Order**

**To update an order:**
- Change the **Status** dropdown (queued, in-production, complete, on-hold, dispatched)
- Drag the **Progress** slider to update completion percentage
- Click **BOM** to auto-generate a Bill of Materials

**7b. Production Lines**

Click the **Production Lines** sub-tab to see all manufacturing lines:
- Wall Panel Line, Floor Cassette Line, Roof Panel Line, Saw Line A, Saw Line B
- Each shows status (active/idle/maintenance), type, and capacity utilisation

Change a line's status using the dropdown.

**7c. Deliveries**

Click the **Deliveries** sub-tab to track incoming shipments:
- Supplier name, items, expected date, status, value
- Click **Mark Received** to update status to delivered

**7d. Bill of Materials**

Click the **Bill of Materials** sub-tab to see generated BOMs:
- Each BOM shows the order name, date, and total estimated cost
- The table lists every material needed with quantity, unit, and cost
- BOMs are generated from the Orders tab by clicking the **BOM** button

---

### Step 8: Manage Waste

Click the **Waste** tab.

**8a. Waste Log**

The default sub-tab shows all waste entries:
- Date, material, type (offcut/damaged/defective), quantity, size, reason, recyclability

Filter by type using the pills at the top.

**To log waste:**
1. Click **+ Log Waste**
2. Select the material from the dropdown
3. Choose the waste type (offcut, damaged, defective)
4. Enter quantity, length, reason
5. Set whether it's recyclable
6. Click **Log Waste**

**8b. Cutting Optimiser**

Click the **Cutting Optimiser** sub-tab. This is where you minimise material waste.

**To create a cutting plan:**
1. Click **+ New Cutting Plan**
2. Give it a name (e.g., "Wall Studs - Plot 1")
3. Select the material and stock length
4. Add cuts to the cut list:
   - Label (e.g., "Studs"), length (e.g., 2.7m), quantity (e.g., 24)
   - Click **+ Add Cut** for more entries
5. Click **Create Plan**

**To optimise:**
1. Click the **Optimise** button on any cutting plan
2. The algorithm (First-Fit Decreasing bin packing) calculates the optimal layout
3. Results show:
   - Number of stock lengths required
   - Waste percentage and total waste in metres
4. A **visual cutting diagram** appears showing coloured bars for each cut and hatched areas for waste

The lower the waste percentage, the better. Anything under 5% is excellent.

**8c. Waste Analytics**

Click the **Waste Analytics** sub-tab for charts:
- **Waste by Type** -- bar chart showing offcut vs damaged vs defective
- **Waste by Material** -- bar chart showing which materials produce the most waste
- **Weekly Trend** -- vertical bar chart of waste entries per day
- **Recycling Rate** -- circular ring chart showing the percentage of recyclable waste

---

### Step 9: Putting It All Together

Here's a typical workflow for a new house order:

1. **Dashboard** -- check current workload and stock levels
2. **Design** -- select the site, choose or create a house style
3. **Panels** -- review and customise all wall, floor, and roof panels
4. **I-Joists** -- configure floor cassettes with the right joist type and spacing
5. **3D Editor** -- fine-tune panel positions if needed
6. **Production** -- create a production order for the house, assign the builder
7. **Production > BOM** -- generate the Bill of Materials to know exactly what's needed
8. **Warehouse** -- check stock levels against the BOM, reorder if needed
9. **Waste > Cutting Optimiser** -- create cutting plans for timber/joists to minimise waste
10. **Production** -- update order progress as panels are built
11. **Waste > Log** -- record any offcuts, damaged, or defective materials
12. **Dashboard** -- monitor everything from one place

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Three.js | 3D rendering engine |
| React Three Fiber | React bindings for Three.js |
| @react-three/drei | 3D helpers (OrbitControls, TransformControls, Grid, Environment) |
| Zustand | Lightweight state management |

## Project Structure

```
src/
  store/
    houseStore.js          # House design state (sites, styles, panels, i-joists, editor)
    warehouseStore.js      # Warehouse state (inventory, orders, waste, cutting, BOM, deliveries)
  components/
    Dashboard.jsx          # KPI dashboard with production overview
    Toolbar.jsx            # Top navigation bar with all module tabs
    Sidebar.jsx            # Left sidebar for design tabs
    Viewport3D.jsx         # 3D canvas with house model, panels, i-joists, transforms
    SiteManager.jsx        # Site CRUD with inline editing
    HouseStylePicker.jsx   # House style selection and creation
    PanelList.jsx          # Panel listing grouped by floor
    PanelEditor.jsx        # Right-side panel property editor
    IJoistCassetteBuilder.jsx  # I-joist cassette builder with presets
    EditorControls.jsx     # 3D editor settings and shortcuts
    WarehouseInventory.jsx # Full inventory management table
    ProductionManager.jsx  # Orders, production lines, deliveries, BOM
    WasteManager.jsx       # Waste logging, cutting optimiser, analytics
```

## Building for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy anywhere that serves static files.
