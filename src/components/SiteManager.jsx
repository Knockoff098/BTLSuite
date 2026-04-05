import React, { useState } from 'react'
import { useHouseStore } from '../store/houseStore'

export default function SiteManager() {
  const { sites, selectedSiteId, selectSite, addSite, updateSite, removeSite } = useHouseStore()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', lotWidth: 20, lotDepth: 30 })

  const handleAdd = () => {
    if (!form.name) return
    addSite({ ...form, lotWidth: Number(form.lotWidth), lotDepth: Number(form.lotDepth) })
    setForm({ name: '', address: '', lotWidth: 20, lotDepth: 30 })
    setAdding(false)
  }

  const handleEdit = () => {
    if (!form.name) return
    updateSite(editing, { ...form, lotWidth: Number(form.lotWidth), lotDepth: Number(form.lotDepth) })
    setEditing(null)
    setForm({ name: '', address: '', lotWidth: 20, lotDepth: 30 })
  }

  const startEdit = (site, e) => {
    e.stopPropagation()
    setEditing(site.id)
    setForm({ name: site.name, address: site.address, lotWidth: site.lotWidth, lotDepth: site.lotDepth })
    setAdding(false)
  }

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">Sites</div>
      <div className="sidebar-list">
        {sites.map((site) => (
          <div
            key={site.id}
            className={`sidebar-item ${selectedSiteId === site.id ? 'selected' : ''}`}
            onClick={() => selectSite(site.id)}
          >
            <div>
              <div className="sidebar-item-name">{site.name}</div>
              <div className="sidebar-item-sub">{site.address} | {site.lotWidth}m x {site.lotDepth}m</div>
            </div>
            <div className="sidebar-item-actions">
              <button onClick={(e) => startEdit(site, e)}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); removeSite(site.id) }}>X</button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <div className="sidebar-form">
          <div className="sidebar-form-row">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Site name" />
          </div>
          <div className="sidebar-form-row">
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
          </div>
          <div className="sidebar-form-row">
            <label>Width</label>
            <input type="number" value={form.lotWidth} onChange={(e) => setForm({ ...form, lotWidth: e.target.value })} />
          </div>
          <div className="sidebar-form-row">
            <label>Depth</label>
            <input type="number" value={form.lotDepth} onChange={(e) => setForm({ ...form, lotDepth: e.target.value })} />
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
        <button className="sidebar-add-btn" onClick={() => { setAdding(true); setForm({ name: '', address: '', lotWidth: 20, lotDepth: 30 }) }}>
          + Add Site
        </button>
      )}
    </div>
  )
}
