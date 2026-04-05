import React, { useState } from 'react'
import { useHouseStore } from '../store/houseStore'
import './Toolbar.css'

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
          {['house', 'panels', 'ijoists', 'editor'].map((tab) => (
            <button
              key={tab}
              className={`toolbar-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'house' && 'House'}
              {tab === 'panels' && 'Panels'}
              {tab === 'ijoists' && 'I-Joists'}
              {tab === 'editor' && '3D Editor'}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  )
}
