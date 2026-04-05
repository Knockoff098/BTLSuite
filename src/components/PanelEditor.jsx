import React from 'react'
import { useHouseStore } from '../store/houseStore'
import './PanelEditor.css'

export default function PanelEditor() {
  const { panels, selectedPanelId, updatePanel, selectPanel } = useHouseStore()
  const panel = panels.find((p) => p.id === selectedPanelId)
  if (!panel) return null

  const handleChange = (field, value) => {
    updatePanel(selectedPanelId, { [field]: value })
  }

  const handleVec3Change = (field, index, value) => {
    const arr = [...panel[field]]
    arr[index] = Number(value)
    updatePanel(selectedPanelId, { [field]: arr })
  }

  return (
    <div className="panel-editor">
      <div className="panel-editor-header">
        <h3>Panel Properties</h3>
        <button className="panel-editor-close" onClick={() => selectPanel(null)}>X</button>
      </div>

      <div className="pe-section">
        <div className="pe-row">
          <label>Name</label>
          <input value={panel.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div className="pe-row">
          <label>Type</label>
          <select value={panel.type} onChange={(e) => handleChange('type', e.target.value)}>
            <option value="wall">Wall</option>
            <option value="floor">Floor</option>
            <option value="roof">Roof</option>
          </select>
        </div>
        <div className="pe-row">
          <label>Material</label>
          <select value={panel.material} onChange={(e) => handleChange('material', e.target.value)}>
            <option value="timber-frame">Timber Frame</option>
            <option value="cassette">Cassette</option>
            <option value="sip">SIP</option>
            <option value="steel">Steel</option>
            <option value="tile">Tile</option>
            <option value="membrane">Membrane</option>
            <option value="metal">Metal</option>
          </select>
        </div>
        <div className="pe-row">
          <label>Color</label>
          <input type="color" value={panel.color} onChange={(e) => handleChange('color', e.target.value)} />
        </div>
      </div>

      <div className="pe-section">
        <div className="pe-section-title">Position</div>
        <div className="pe-vec3">
          {['X', 'Y', 'Z'].map((axis, i) => (
            <div key={axis} className="pe-vec3-field">
              <span className="pe-axis">{axis}</span>
              <input
                type="number"
                step="0.1"
                value={panel.position[i]}
                onChange={(e) => handleVec3Change('position', i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pe-section">
        <div className="pe-section-title">Size</div>
        <div className="pe-vec3">
          {['W', 'H', 'D'].map((axis, i) => (
            <div key={axis} className="pe-vec3-field">
              <span className="pe-axis">{axis}</span>
              <input
                type="number"
                step="0.1"
                value={panel.size[i]}
                onChange={(e) => handleVec3Change('size', i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pe-section">
        <div className="pe-section-title">Rotation (rad)</div>
        <div className="pe-vec3">
          {['X', 'Y', 'Z'].map((axis, i) => (
            <div key={axis} className="pe-vec3-field">
              <span className="pe-axis">{axis}</span>
              <input
                type="number"
                step="0.05"
                value={panel.rotation[i]}
                onChange={(e) => handleVec3Change('rotation', i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {panel.type === 'wall' && (
        <div className="pe-section">
          <div className="pe-section-title">Openings</div>
          <div className="pe-row">
            <label>Windows</label>
            <input
              type="number"
              min="0"
              max="10"
              value={panel.windows || 0}
              onChange={(e) => handleChange('windows', Number(e.target.value))}
            />
          </div>
          <div className="pe-row">
            <label>Doors</label>
            <input
              type="number"
              min="0"
              max="4"
              value={panel.doors || 0}
              onChange={(e) => handleChange('doors', Number(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="pe-section">
        <div className="pe-section-title">I-Joists ({panel.ijoists?.length || 0})</div>
        {panel.ijoists && panel.ijoists.length > 0 ? (
          <div className="pe-joist-summary">
            <div>Count: {panel.ijoists.length}</div>
            <div>Depth: {(panel.ijoists[0].depth * 1000).toFixed(0)}mm</div>
            <div>Material: {panel.ijoists[0].material}</div>
          </div>
        ) : (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            No I-Joists. Use the I-Joists tab to add.
          </div>
        )}
      </div>
    </div>
  )
}
