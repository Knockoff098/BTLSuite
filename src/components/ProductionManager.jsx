import React, { useState } from 'react'
import { useWarehouseStore } from '../store/warehouseStore'
import './Warehouse.css'

const STATUS_COLORS = {
  'queued': '#ffa502',
  'in-production': '#3498db',
  'complete': '#2ed573',
  'on-hold': '#e94560',
  'dispatched': '#9b59b6',
}

const STATUS_OPTIONS = ['queued', 'in-production', 'complete', 'on-hold', 'dispatched']

// Major UK housebuilders
const BUILDER_PRESETS = [
  'Vistry Group', 'Redrow Homes', 'Bovis Homes', 'Linden Homes',
  'Countryside Partnerships', 'Barratt Developments', 'Taylor Wimpey',
  'Persimmon Homes', 'Bellway', 'Crest Nicholson', 'Berkeley Group',
  'Miller Homes', 'Avant Homes', 'Keepmoat Homes', 'Gleeson Homes',
]

export default function ProductionManager() {
  const {
    orders, addOrder, updateOrder, removeOrder,
    productionLines, updateProductionLine,
    deliveries, addDelivery, updateDelivery,
    generateBOM, boms,
  } = useWarehouseStore()

  const [activeSubTab, setActiveSubTab] = useState('orders')
  const [addingOrder, setAddingOrder] = useState(false)
  const [orderForm, setOrderForm] = useState({
    siteName: '', houseName: '', status: 'queued', dueDate: '',
    panels: 0, cassettes: 0, roofSections: 0, notes: '', builder: '',
  })

  const handleAddOrder = () => {
    if (!orderForm.siteName || !orderForm.houseName) return
    addOrder({
      ...orderForm,
      panels: Number(orderForm.panels),
      cassettes: Number(orderForm.cassettes),
      roofSections: Number(orderForm.roofSections),
    })
    setAddingOrder(false)
    setOrderForm({ siteName: '', houseName: '', status: 'queued', dueDate: '', panels: 0, cassettes: 0, roofSections: 0, notes: '', builder: '' })
  }

  return (
    <div className="wh-panel">
      <div className="wh-header">
        <h2>Production Management</h2>
      </div>

      <div className="wh-sub-tabs">
        {[
          { id: 'orders', label: 'Orders' },
          { id: 'production', label: 'Production Lines' },
          { id: 'deliveries', label: 'Deliveries' },
          { id: 'bom', label: 'Bill of Materials' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`wh-sub-tab ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'orders' && (
        <div className="wh-section">
          <div className="wh-table-wrap">
            <table className="wh-table">
              <thead>
                <tr>
                  <th>Site / House</th>
                  <th>Builder</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Panels</th>
                  <th>Cassettes</th>
                  <th>Roof</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="wh-mat-name">{order.siteName}</div>
                      <div className="wh-mat-cat">{order.houseName}</div>
                    </td>
                    <td><span className="wh-builder-tag">{order.builder || 'N/A'}</span></td>
                    <td>
                      <select
                        className="wh-status-select"
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                        style={{ color: STATUS_COLORS[order.status] }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('-', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td>{order.dueDate}</td>
                    <td>{order.panels}</td>
                    <td>{order.cassettes}</td>
                    <td>{order.roofSections}</td>
                    <td>
                      <div className="wh-progress">
                        <div className="wh-progress-bar" style={{ width: `${order.progress}%`, background: STATUS_COLORS[order.status] }} />
                        <span>{order.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={order.progress}
                        onChange={(e) => updateOrder(order.id, { progress: Number(e.target.value) })}
                        className="wh-progress-slider"
                      />
                    </td>
                    <td>
                      <div className="wh-actions">
                        <button className="wh-btn-sm" onClick={() => generateBOM(order.id)}>BOM</button>
                        <button className="wh-btn-sm wh-btn-del" onClick={() => removeOrder(order.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {addingOrder ? (
            <div className="wh-add-form">
              <h4>New Production Order</h4>
              <div className="wh-form-grid">
                <div className="wh-form-field">
                  <label>Builder</label>
                  <select value={orderForm.builder} onChange={(e) => setOrderForm({ ...orderForm, builder: e.target.value })}>
                    <option value="">Select builder...</option>
                    {BUILDER_PRESETS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="wh-form-field">
                  <label>Site Name</label>
                  <input value={orderForm.siteName} onChange={(e) => setOrderForm({ ...orderForm, siteName: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>House / Plot</label>
                  <input value={orderForm.houseName} onChange={(e) => setOrderForm({ ...orderForm, houseName: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Due Date</label>
                  <input type="date" value={orderForm.dueDate} onChange={(e) => setOrderForm({ ...orderForm, dueDate: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Wall Panels</label>
                  <input type="number" value={orderForm.panels} onChange={(e) => setOrderForm({ ...orderForm, panels: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Floor Cassettes</label>
                  <input type="number" value={orderForm.cassettes} onChange={(e) => setOrderForm({ ...orderForm, cassettes: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Roof Sections</label>
                  <input type="number" value={orderForm.roofSections} onChange={(e) => setOrderForm({ ...orderForm, roofSections: e.target.value })} />
                </div>
                <div className="wh-form-field full-width">
                  <label>Notes</label>
                  <textarea value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} />
                </div>
              </div>
              <div className="wh-form-actions">
                <button className="btn-secondary" onClick={() => setAddingOrder(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddOrder}>Create Order</button>
              </div>
            </div>
          ) : (
            <button className="wh-add-btn" onClick={() => setAddingOrder(true)}>+ New Production Order</button>
          )}
        </div>
      )}

      {activeSubTab === 'production' && (
        <div className="wh-section">
          <div className="production-lines">
            {productionLines.map((line) => (
              <div key={line.id} className={`prod-line prod-line-${line.status}`}>
                <div className="prod-line-header">
                  <h4>{line.name}</h4>
                  <select
                    value={line.status}
                    onChange={(e) => updateProductionLine(line.id, { status: e.target.value })}
                    className="wh-status-select"
                  >
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="prod-line-type">Type: {line.type}</div>
                <div className="prod-line-load">
                  <div className="wh-progress">
                    <div
                      className="wh-progress-bar"
                      style={{
                        width: `${(line.currentLoad / line.capacity) * 100}%`,
                        background: line.currentLoad / line.capacity > 0.8 ? '#e94560' : '#2ed573',
                      }}
                    />
                    <span>{line.currentLoad}/{line.capacity} ({line.type === 'cutting' ? 'cuts/hr' : 'panels/day'})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'deliveries' && (
        <div className="wh-section">
          <div className="wh-table-wrap">
            <table className="wh-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Expected</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((del) => (
                  <tr key={del.id}>
                    <td><strong>{del.supplier}</strong></td>
                    <td>{del.items}</td>
                    <td>{del.expectedDate}</td>
                    <td>
                      <select
                        value={del.status}
                        onChange={(e) => updateDelivery(del.id, { status: e.target.value })}
                        className="wh-status-select"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </td>
                    <td>&pound;{del.value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <button className="wh-btn-sm" onClick={() => updateDelivery(del.id, { status: 'delivered' })}>
                        Mark Received
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'bom' && (
        <div className="wh-section">
          {boms.length === 0 ? (
            <div className="wh-empty">No BOMs generated yet. Go to Orders and click BOM on an order.</div>
          ) : (
            boms.map((bom) => (
              <div key={bom.id} className="bom-card">
                <div className="bom-header">
                  <h4>{bom.orderName}</h4>
                  <span className="bom-date">{bom.createdAt}</span>
                  <span className="bom-total">&pound;{bom.totalCost.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                </div>
                <table className="wh-table bom-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bom.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.material}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>&pound;{item.estimatedCost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
