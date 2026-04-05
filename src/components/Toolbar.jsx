import React, { useState } from 'react'
import { useHouseStore } from '../store/houseStore'
import './Toolbar.css'

const MAIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '\u25A6' },
  { id: 'house', label: 'Design', icon: '\u2302' },
  { id: 'panels', label: 'Panels', icon: '\u25A3' },
  { id: 'ijoists', label: 'I-Joists', icon: '\u2261' },
  { id: 'editor', label: '3D Editor', icon: '\u2B1A' },
  { id: 'warehouse', label: 'Warehouse', icon: '\u2338' },
  { id: 'production', label: 'Production', icon: '\u2699' },
  { id: 'waste', label: 'Waste', icon: '\u267B' },
]

export default function Toolbar() {
  const {
    houseName, setHouseName,
    editorMode, setEditorMode,
    showWireframe, setShowWireframe,
    showDimensions, setShowDimensions,
    viewMode, setViewMode,
    activeTab, setActiveTab,
    rebuildFromStyle,
  } = useHouseStore()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(houseName)

  const handleNameSubmit = () => {
    setHouseName(nameInput)
    setEditingName(false)
  }

  const isDesignTab = ['house', 'panels', 'ijoists', 'editor'].includes(activeTab)

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-brand">BTLSuite</div>
        <div className="toolbar-divider" />

        {editingName ? (
          <div className="toolbar-name-edit">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
            />
          </div>
        ) : (
          <div className="toolbar-house-name" onClick={() => { setEditingName(true); setNameInput(houseName) }}>
            {houseName}
          </div>
        )}

        <div className="toolbar-divider" />

        <div className="toolbar-tabs">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`toolbar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="toolbar-tab-icon">{tab.icon}</span>
              <span className="toolbar-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isDesignTab && (
        <div className="toolbar-right">
          <div className="toolbar-group">
            <span className="toolbar-label">Mode:</span>
            {['select', 'move', 'rotate', 'scale'].map((mode) => (
              <button
                key={mode}
                className={`toolbar-btn ${editorMode === mode ? 'active' : ''}`}
                onClick={() => setEditorMode(mode)}
                title={mode}
              >
                {mode === 'select' && '\u2190'}
                {mode === 'move' && '\u2725'}
                {mode === 'rotate' && '\u21BB'}
                {mode === 'scale' && '\u2922'}
              </button>
            ))}
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <span className="toolbar-label">View:</span>
            {['3d', 'front', 'side', 'top'].map((v) => (
              <button
                key={v}
                className={`toolbar-btn ${viewMode === v ? 'active' : ''}`}
                onClick={() => setViewMode(v)}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="toolbar-divider" />

          <label className="toolbar-toggle">
            <input type="checkbox" checked={showWireframe} onChange={(e) => setShowWireframe(e.target.checked)} />
            Wire
          </label>
          <label className="toolbar-toggle">
            <input type="checkbox" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} />
            Dims
          </label>

          <button className="toolbar-btn rebuild-btn" onClick={rebuildFromStyle}>
            Rebuild
          </button>
        </div>
      )}
    </div>
  )
}
