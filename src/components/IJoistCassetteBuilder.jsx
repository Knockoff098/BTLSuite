import React, { useState } from 'react'
import { useHouseStore } from '../store/houseStore'
import './IJoistCassetteBuilder.css'

const JOIST_PRESETS = [
  { name: 'TJI 110', depth: 0.241, flangeWidth: 0.045, flangeThickness: 0.035, webThickness: 0.0095 },
  { name: 'TJI 210', depth: 0.241, flangeWidth: 0.045, flangeThickness: 0.035, webThickness: 0.0095 },
  { name: 'TJI 230', depth: 0.302, flangeWidth: 0.045, flangeThickness: 0.035, webThickness: 0.0095 },
  { name: 'TJI 360', depth: 0.302, flangeWidth: 0.057, flangeThickness: 0.038, webThickness: 0.011 },
  { name: 'TJI 560', depth: 0.356, flangeWidth: 0.057, flangeThickness: 0.038, webThickness: 0.011 },
  { name: 'Custom', depth: 0.3, flangeWidth: 0.05, flangeThickness: 0.04, webThickness: 0.01 },
]

const MATERIALS = ['LVL', 'Solid Timber', 'Glulam', 'LSL']
const GRADES = ['C16', 'C24', 'TR26', 'GL24h', 'GL28h']

export default function IJoistCassetteBuilder() {
  const { panels, selectedPanelId, selectPanel, addIJoist, updateIJoist, removeIJoist, regenerateIJoists } = useHouseStore()

  const floorPanels = panels.filter((p) => p.type === 'floor' || (p.ijoists && p.ijoists.length > 0))
  const selectedPanel = panels.find((p) => p.id === selectedPanelId)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [spacing, setSpacing] = useState(0.4)
  const [editingJoist, setEditingJoist] = useState(null)
  const [joistForm, setJoistForm] = useState({})

  const handleApplyPreset = () => {
    if (!selectedPanelId) return
    const preset = JOIST_PRESETS[selectedPreset]
    const panel = panels.find((p) => p.id === selectedPanelId)
    if (!panel) return
    regenerateIJoists(selectedPanelId, spacing)
    // Update all joists with preset dimensions
    setTimeout(() => {
      const updatedPanel = useHouseStore.getState().panels.find((p) => p.id === selectedPanelId)
      if (updatedPanel) {
        updatedPanel.ijoists.forEach((j) => {
          updateIJoist(selectedPanelId, j.id, {
            depth: preset.depth,
            flangeWidth: preset.flangeWidth,
            flangeThickness: preset.flangeThickness,
            webThickness: preset.webThickness,
          })
        })
      }
    }, 50)
  }

  const handleAddSingleJoist = () => {
    if (!selectedPanelId) return
    const preset = JOIST_PRESETS[selectedPreset]
    addIJoist(selectedPanelId, {
      position: [0, 0, 0],
      length: selectedPanel?.size[2] || 4,
      depth: preset.depth,
      flangeWidth: preset.flangeWidth,
      flangeThickness: preset.flangeThickness,
      webThickness: preset.webThickness,
      material: 'LVL',
      grade: 'C24',
    })
  }

  const startEditJoist = (joist) => {
    setEditingJoist(joist.id)
    setJoistForm({
      depth: joist.depth,
      flangeWidth: joist.flangeWidth,
      flangeThickness: joist.flangeThickness,
      webThickness: joist.webThickness,
      material: joist.material,
      grade: joist.grade,
      length: joist.length,
    })
  }

  const handleUpdateJoist = () => {
    if (!selectedPanelId || !editingJoist) return
    updateIJoist(selectedPanelId, editingJoist, {
      ...joistForm,
      depth: Number(joistForm.depth),
      flangeWidth: Number(joistForm.flangeWidth),
      flangeThickness: Number(joistForm.flangeThickness),
      webThickness: Number(joistForm.webThickness),
      length: Number(joistForm.length),
    })
    setEditingJoist(null)
  }

  return (
    <div className="sidebar-section ijoist-builder" style={{ flex: 1 }}>
      <div className="sidebar-section-title">I-Joist Cassette Builder</div>

      {/* Panel selector */}
      <div className="ijoist-panel-select">
        <label>Target Panel:</label>
        <select
          value={selectedPanelId || ''}
          onChange={(e) => selectPanel(e.target.value || null)}
        >
          <option value="">Select a panel...</option>
          {floorPanels.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Preset selector */}
      <div className="ijoist-presets">
        <label>Joist Preset:</label>
        <div className="ijoist-preset-grid">
          {JOIST_PRESETS.map((preset, i) => (
            <button
              key={preset.name}
              className={`ijoist-preset-btn ${selectedPreset === i ? 'active' : ''}`}
              onClick={() => setSelectedPreset(i)}
            >
              <div className="preset-name">{preset.name}</div>
              <div className="preset-detail">{(preset.depth * 1000).toFixed(0)}mm</div>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing control */}
      <div className="ijoist-spacing">
        <label>Spacing (centres):</label>
        <div className="spacing-row">
          <input
            type="range"
            min="0.2"
            max="0.8"
            step="0.05"
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
          />
          <span className="spacing-value">{(spacing * 1000).toFixed(0)}mm</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="ijoist-actions">
        <button className="btn-primary" onClick={handleApplyPreset} disabled={!selectedPanelId}>
          Generate Cassette
        </button>
        <button className="btn-secondary" onClick={handleAddSingleJoist} disabled={!selectedPanelId}>
          + Single Joist
        </button>
      </div>

      {/* I-Joist cross section preview */}
      <div className="ijoist-preview">
        <div className="sidebar-section-title" style={{ marginTop: 8 }}>Cross Section</div>
        <IJoistCrossSection preset={JOIST_PRESETS[selectedPreset]} />
      </div>

      {/* Joist list for selected panel */}
      {selectedPanel && selectedPanel.ijoists && selectedPanel.ijoists.length > 0 && (
        <div className="ijoist-list">
          <div className="sidebar-section-title" style={{ marginTop: 8 }}>
            Joists ({selectedPanel.ijoists.length})
          </div>
          <div className="sidebar-list">
            {selectedPanel.ijoists.map((joist, i) => (
              <div key={joist.id} className="sidebar-item" onClick={() => startEditJoist(joist)}>
                <div>
                  <div className="sidebar-item-name">Joist {i + 1}</div>
                  <div className="sidebar-item-sub">
                    {(joist.depth * 1000).toFixed(0)}mm deep | {joist.material} {joist.grade}
                  </div>
                </div>
                <div className="sidebar-item-actions">
                  <button onClick={(e) => { e.stopPropagation(); removeIJoist(selectedPanelId, joist.id) }}>X</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit joist form */}
      {editingJoist && (
        <div className="sidebar-form">
          <div className="sidebar-section-title">Edit Joist</div>
          <div className="sidebar-form-row">
            <label>Depth</label>
            <input type="number" step="0.001" value={joistForm.depth} onChange={(e) => setJoistForm({ ...joistForm, depth: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Flange W</label>
            <input type="number" step="0.001" value={joistForm.flangeWidth} onChange={(e) => setJoistForm({ ...joistForm, flangeWidth: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Flange T</label>
            <input type="number" step="0.001" value={joistForm.flangeThickness} onChange={(e) => setJoistForm({ ...joistForm, flangeThickness: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Web T</label>
            <input type="number" step="0.001" value={joistForm.webThickness} onChange={(e) => setJoistForm({ ...joistForm, webThickness: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Length</label>
            <input type="number" step="0.1" value={joistForm.length} onChange={(e) => setJoistForm({ ...joistForm, length: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Material</label>
            <select value={joistForm.material} onChange={(e) => setJoistForm({ ...joistForm, material: e.target.value })}>
              {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="sidebar-form-row">
            <label>Grade</label>
            <select value={joistForm.grade} onChange={(e) => setJoistForm({ ...joistForm, grade: e.target.value })}>
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="sidebar-form-actions">
            <button className="btn-secondary" onClick={() => setEditingJoist(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleUpdateJoist}>Update</button>
          </div>
        </div>
      )}
    </div>
  )
}

function IJoistCrossSection({ preset }) {
  const scale = 300
  const totalH = preset.depth * scale
  const flangeW = preset.flangeWidth * scale
  const flangeT = preset.flangeThickness * scale
  const webT = preset.webThickness * scale
  const svgW = flangeW + 20
  const svgH = totalH + 20
  const cx = svgW / 2
  const topY = 10

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="ijoist-svg">
      {/* Top flange */}
      <rect
        x={cx - flangeW / 2}
        y={topY}
        width={flangeW}
        height={flangeT}
        fill="#8d6e63"
        stroke="#5d4037"
        strokeWidth="0.5"
      />
      {/* Web */}
      <rect
        x={cx - webT / 2}
        y={topY + flangeT}
        width={webT}
        height={totalH - 2 * flangeT}
        fill="#bcaaa4"
        stroke="#5d4037"
        strokeWidth="0.5"
      />
      {/* Bottom flange */}
      <rect
        x={cx - flangeW / 2}
        y={topY + totalH - flangeT}
        width={flangeW}
        height={flangeT}
        fill="#8d6e63"
        stroke="#5d4037"
        strokeWidth="0.5"
      />
      {/* Dimension line - depth */}
      <line x1={cx + flangeW / 2 + 5} y1={topY} x2={cx + flangeW / 2 + 5} y2={topY + totalH} stroke="#999" strokeWidth="0.5" />
      <text x={cx + flangeW / 2 + 8} y={topY + totalH / 2} fontSize="6" fill="#aab" dominantBaseline="middle">
        {(preset.depth * 1000).toFixed(0)}mm
      </text>
    </svg>
  )
}
