# BTL Suite

A web-based suite for viewing, editing, and converting BTL (Building Transfer Language) files used in timber construction CNC data exchange.

## Features

- **Viewer** -- Inspect BTL documents with a structured, readable breakdown of projects, parts, and processings
- **Editor** -- Add, modify, remove, and duplicate parts and processings with full undo/redo support
- **Converter** -- Convert between BTL/XML, JSON, and CSV formats with download support
- **Raw XML Editor** -- Direct XML editing with live re-parsing

## What is BTL?

BTL (Building Transfer Language / Blumer Transfer Language) is an XML-based file format used in timber construction for exchanging CNC machining data between CAD/CAM systems and timber processing machines. It describes timber elements (beams, rafters, posts) and their processings (cuts, drillings, notches, tenons, mortises, etc.).

## Getting Started

No build step required. Open `index.html` in a browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
BTLSuite/
  index.html          -- Main application entry point
  styles.css          -- Application styles (dark theme)
  src/
    btl-parser.js     -- BTL/XML parser (XML to structured objects)
    btl-converter.js  -- Format converter (BTL <-> JSON, CSV)
    btl-editor.js     -- Document editor with undo/redo
    app.js            -- Main application controller and UI
  tests/
    btl-tests.js      -- Node.js test runner
    btl-tests.html    -- Browser-based test runner
```

## Running Tests

### Node.js (structural tests)

```bash
node tests/btl-tests.js
```

### Browser (full tests with DOM)

Open `tests/btl-tests.html` in a browser.

## Supported BTL Elements

### Parts / Members
- Beams, Rafters, Posts, and other timber members
- Properties: ID, Name, Type, Material, Length, Width, Height

### Processings / Operations
- **Cut** -- End cuts and angle cuts
- **Drilling** -- Bore holes with diameter and depth
- **Notch** -- Rectangular notches
- **Tenon** -- Projecting joint elements
- **Mortise** -- Receiving joint cavities
- **Birdsmouth** -- Rafter seat cuts
- **Pocket** -- Rectangular pockets
- **LapJoint** -- Overlapping joint connections
- **DovetailTenon / DovetailMortise** -- Dovetail joints
- **FreeContour** -- Custom contour processings

## Conversion Formats

| From | To | Description |
|------|----|-------------|
| BTL/XML | JSON | Full structured JSON representation |
| BTL/XML | CSV | Tabular parts and processings data |
| JSON | BTL/XML | Reconstruct BTL from JSON |
| CSV | BTL/XML | Build BTL from tabular data |

## License

Open source. See repository for details.
