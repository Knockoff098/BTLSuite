import React from 'react'
import { useHouseStore } from '../store/houseStore'

export default function EditorControls() {
  const {
    editorMode, setEditorMode,
    showWireframe, setShowWireframe,
    showDimensions, setShowDimensions,
    viewMode, setViewMode,
    panels, selectedPanelId, selectPanel,
  } = useHouseStore()

  const selectedPanel = panels.find((p) => p.id === selectedPanelId)

  return (
    <div className="sidebar-section" style={{ flex: 1 }}>
      <div className="sidebar-section-title">3D Editor Controls</div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Transform Mode</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['select', 'move', 'rotate', 'scale'].map((mode) => (
            <button
              key={mode}
              className={`toolbar-btn ${editorMode === mode ? 'active' : ''}`}
              onClick={() => setEditorMode(mode)}
              style={{ flex: 1, textTransform: 'capitalize' }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Camera View</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['3d', 'front', 'side', 'top'].map((v) => (
            <button
              key={v}
              className={`toolbar-btn ${viewMode === v ? 'active' : ''}`}
              onClick={() => setViewMode(v)}
              style={{ flex: 1, textTransform: 'uppercase' }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Display Options</div>
        <label className="toolbar-toggle">
          <input type="checkbox" checked={showWireframe} onChange={(e) => setShowWireframe(e.target.checked)} />
          Show Wireframe
        </label>
        <label className="toolbar-toggle">
          <input type="checkbox" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} />
          Show Dimensions
        </label>
      </div>

      {selectedPanel && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
            Selected: {selectedPanel.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div>Type: <strong>{selectedPanel.type}</strong></div>
            <div>Position: [{selectedPanel.position.map((v) => v.toFixed(2)).join(', ')}]</div>
            <div>Size: [{selectedPanel.size.map((v) => v.toFixed(2)).join(', ')}]</div>
            <div>Rotation: [{selectedPanel.rotation.map((v) => v.toFixed(2)).join(', ')}]</div>
            <div>Material: {selectedPanel.material}</div>
            {selectedPanel.ijoists?.length > 0 && (
              <div>I-Joists: {selectedPanel.ijoists.length}</div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Keyboard Shortcuts</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
          <div><kbd style={kbdStyle}>V</kbd> Select</div>
          <div><kbd style={kbdStyle}>G</kbd> Move</div>
          <div><kbd style={kbdStyle}>R</kbd> Rotate</div>
          <div><kbd style={kbdStyle}>S</kbd> Scale</div>
          <div><kbd style={kbdStyle}>Del</kbd> Delete Panel</div>
          <div><kbd style={kbdStyle}>D</kbd> Duplicate</div>
          <div><kbd style={kbdStyle}>Esc</kbd> Deselect</div>
        </div>
      </div>
    </div>
  )
}

const kbdStyle = {
  display: 'inline-block',
  padding: '1px 5px',
  fontSize: '0.6rem',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 3,
  marginRight: 4,
  fontFamily: 'monospace',
}
