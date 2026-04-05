import React, { useState } from 'react'
import { useWarehouseStore } from '../store/warehouseStore'
import './Warehouse.css'

const CATEGORIES = [
  { id: 'all', label: 'All Stock' },
  { id: 'timber', label: 'Timber' },
  { id: 'sheet', label: 'Sheet Materials' },
  { id: 'ijoist', label: 'I-Joists' },
  { id: 'insulation', label: 'Insulation' },
  { id: 'fixings', label: 'Fixings' },
  { id: 'membrane', label: 'Membranes' },
]

export default function WarehouseInventory() {
  const {
    inventoryFilter, setInventoryFilter,
    inventorySearch, setInventorySearch,
    getFilteredInventory, adjustStock,
    getLowStockItems, getStockValue,
    addInventoryItem, removeInventoryItem,
  } = useWarehouseStore()

  const items = getFilteredInventory()
  const lowStock = getLowStockItems()
  const totalValue = getStockValue()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    name: '', category: 'timber', grade: '', width: 0, depth: 0,
    stockLength: 0, unit: 'm', quantity: 0, minStock: 0, costPerUnit: 0, location: '',
  })

  const handleAdd = () => {
    if (!form.name) return
    addInventoryItem({
      ...form,
      quantity: Number(form.quantity),
      minStock: Number(form.minStock),
      costPerUnit: Number(form.costPerUnit),
      stockLength: Number(form.stockLength),
      width: Number(form.width),
      depth: Number(form.depth),
    })
    setAdding(false)
    setForm({ name: '', category: 'timber', grade: '', width: 0, depth: 0, stockLength: 0, unit: 'm', quantity: 0, minStock: 0, costPerUnit: 0, location: '' })
  }

  return (
    <div className="wh-panel">
      <div className="wh-header">
        <h2>Warehouse Inventory</h2>
        <div className="wh-header-stats">
          <div className="wh-stat">
            <span className="wh-stat-val">{items.length}</span>
            <span className="wh-stat-label">Items</span>
          </div>
          <div className="wh-stat">
            <span className="wh-stat-val wh-stat-warn">{lowStock.length}</span>
            <span className="wh-stat-label">Low Stock</span>
          </div>
          <div className="wh-stat">
            <span className="wh-stat-val">&pound;{totalValue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}</span>
            <span className="wh-stat-label">Total Value</span>
          </div>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="wh-alert">
          <strong>Low Stock Alert:</strong> {lowStock.map((i) => i.name).join(', ')}
        </div>
      )}

      {/* Filters */}
      <div className="wh-filters">
        <div className="wh-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`wh-cat-btn ${inventoryFilter === cat.id ? 'active' : ''}`}
              onClick={() => setInventoryFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <input
          className="wh-search"
          placeholder="Search stock..."
          value={inventorySearch}
          onChange={(e) => setInventorySearch(e.target.value)}
        />
      </div>

      {/* Stock table */}
      <div className="wh-table-wrap">
        <table className="wh-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Location</th>
              <th>Stock</th>
              <th>Min</th>
              <th>Unit Cost</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLow = item.quantity <= item.minStock
              return (
                <tr key={item.id} className={isLow ? 'wh-row-low' : ''}>
                  <td>
                    <div className="wh-mat-name">{item.name}</div>
                    <div className="wh-mat-cat">{item.category}{item.grade ? ` / ${item.grade}` : ''}</div>
                  </td>
                  <td><span className="wh-location">{item.location}</span></td>
                  <td><strong>{item.quantity}</strong> {item.unit}</td>
                  <td>{item.minStock}</td>
                  <td>&pound;{item.costPerUnit.toFixed(2)}</td>
                  <td>&pound;{(item.quantity * item.costPerUnit).toFixed(2)}</td>
                  <td>
                    <span className={`wh-status ${isLow ? 'low' : 'ok'}`}>
                      {isLow ? 'LOW' : 'OK'}
                    </span>
                  </td>
                  <td>
                    <div className="wh-actions">
                      <button className="wh-btn-sm wh-btn-plus" onClick={() => adjustStock(item.id, 10)}>+10</button>
                      <button className="wh-btn-sm wh-btn-minus" onClick={() => adjustStock(item.id, -10)}>-10</button>
                      <button className="wh-btn-sm wh-btn-del" onClick={() => removeInventoryItem(item.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add item */}
      {adding ? (
        <div className="wh-add-form">
          <h4>Add Stock Item</h4>
          <div className="wh-form-grid">
            <div className="wh-form-field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="wh-form-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="wh-form-field">
              <label>Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bay/Rack ref" />
            </div>
            <div className="wh-form-field">
              <label>Quantity</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div className="wh-form-field">
              <label>Min Stock</label>
              <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            </div>
            <div className="wh-form-field">
              <label>Cost/Unit (&pound;)</label>
              <input type="number" step="0.01" value={form.costPerUnit} onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })} />
            </div>
            <div className="wh-form-field">
              <label>Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="m">m</option>
                <option value="m2">m2</option>
                <option value="sheet">sheet</option>
                <option value="each">each</option>
                <option value="box">box</option>
                <option value="roll">roll</option>
              </select>
            </div>
            <div className="wh-form-field">
              <label>Grade</label>
              <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            </div>
          </div>
          <div className="wh-form-actions">
            <button className="btn-secondary" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleAdd}>Add Item</button>
          </div>
        </div>
      ) : (
        <button className="wh-add-btn" onClick={() => setAdding(true)}>+ Add Stock Item</button>
      )}
    </div>
  )
}
