import React, { useState } from 'react'
import { useHouseStore } from '../store/houseStore'

export default function HouseStylePicker() {
  const { houseStyles, selectedStyleId, selectStyle, addStyle, updateStyle } = useHouseStore()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', floors: 1, roofType: 'gable', color: '#d4a574' })

  const handleAdd = () => {
    if (!form.name) return
    addStyle({ ...form, floors: Number(form.floors) })
    setForm({ name: '', floors: 1, roofType: 'gable', color: '#d4a574' })
    setAdding(false)
  }

  const handleEdit = () => {
    if (!form.name) return
    updateStyle(editing, { ...form, floors: Number(form.floors) })
    setEditing(null)
  }

  const startEdit = (style, e) => {
    e.stopPropagation()
    setEditing(style.id)
    setForm({ name: style.name, floors: style.floors, roofType: style.roofType, color: style.color })
    setAdding(false)
  }

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">House Styles</div>
      <div className="sidebar-list">
        {houseStyles.map((style) => (
          <div
            key={style.id}
            className={`sidebar-item ${selectedStyleId === style.id ? 'selected' : ''}`}
            onClick={() => selectStyle(style.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="color-swatch" style={{ background: style.color }} />
              <div>
                <div className="sidebar-item-name">{style.name}</div>
                <div className="sidebar-item-sub">{style.floors}F | {style.roofType}</div>
              </div>
            </div>
            <div className="sidebar-item-actions">
              <button onClick={(e) => startEdit(style, e)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <div className="sidebar-form">
          <div className="sidebar-form-row">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Floors</label>
            <input type="number" min="1" max="5" value={form.floors} onChange={(e) => setForm({ ...form, floors: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Roof</label>
            <select value={form.roofType} onChange={(e) => setForm({ ...form, roofType: e.target.value })}>
              <option value="gable">Gable</option>
              <option value="hip">Hip</option>
              <option value="flat">Flat</option>
              <option value="shed">Shed</option>
            </select>
          </div>
          <div className="sidebar-form-row">
            <label>Color</label>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <div className="sidebar-form-actions">
            <button className="btn-secondary" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
            <button className="btn-primary" onClick={editing ? handleEdit : handleAdd}>
              {editing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {!adding && !editing && (
        <button className="sidebar-add-btn" onClick={() => { setAdding(true); setForm({ name: '', floors: 1, roofType: 'gable', color: '#d4a574' }) }}>
          + Add Style
        </button>
      )}
    </div>
  )
}
