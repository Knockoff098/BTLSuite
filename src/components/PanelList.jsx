import React from 'react'
import { useHouseStore } from '../store/houseStore'

const TYPE_ICONS = { wall: '\u25A3', floor: '\u25A6', roof: '\u25B3' }
const TYPE_COLORS = { wall: '#e94560', floor: '#2ed573', roof: '#3498db' }

export default function PanelList() {
  const { panels, selectedPanelId, selectPanel, removePanel, duplicatePanel, addPanel } = useHouseStore()

  const grouped = panels.reduce((acc, panel) => {
    const key = `Floor ${panel.floor}${panel.type === 'roof' ? ' - Roof' : ''}`
    if (!acc[key]) acc[key] = []
    acc[key].push(panel)
    return acc
  }, {})

  const handleAddPanel = () => {
    addPanel({
      type: 'wall',
      name: 'New Panel',
      floor: 0,
      position: [0, 1.5, 0],
      size: [4, 3, 0.2],
      rotation: [0, 0, 0],
      color: '#d4a574',
      material: 'timber-frame',
      windows: 0,
      doors: 0,
      ijoists: [],
    })
  }

  return (
    <div className="sidebar-section" style={{ flex: 1 }}>
      <div className="sidebar-section-title">Panels ({panels.length})</div>
      <div className="sidebar-list">
        {Object.entries(grouped).map(([group, groupPanels]) => (
          <div key={group}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '6px 0 3px', fontWeight: 600 }}>
              {group}
            </div>
            {groupPanels.map((panel) => (
              <div
                key={panel.id}
                className={`sidebar-item ${selectedPanelId === panel.id ? 'selected' : ''}`}
                onClick={() => selectPanel(panel.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: TYPE_COLORS[panel.type], fontSize: '1rem' }}>
                    {TYPE_ICONS[panel.type]}
                  </span>
                  <div>
                    <div className="sidebar-item-name">{panel.name}</div>
                    <div className="sidebar-item-sub">
                      {panel.size[0].toFixed(1)}x{panel.size[1].toFixed(1)}x{panel.size[2].toFixed(1)}m
                      {panel.ijoists?.length > 0 && ` | ${panel.ijoists.length} joists`}
                    </div>
                  </div>
                </div>
                <div className="sidebar-item-actions">
                  <button onClick={(e) => { e.stopPropagation(); duplicatePanel(panel.id) }}>Dup</button>
                  <button onClick={(e) => { e.stopPropagation(); removePanel(panel.id) }}>X</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="sidebar-add-btn" onClick={handleAddPanel}>
        + Add Panel
      </button>
    </div>
  )
}
