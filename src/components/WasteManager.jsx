import React, { useState } from 'react'
import { useWarehouseStore } from '../store/warehouseStore'
import './Warehouse.css'

const WASTE_TYPES = ['offcut', 'damaged', 'defective']

export default function WasteManager() {
  const {
    wasteLog, wasteFilter, setWasteFilter,
    addWasteEntry, removeWasteEntry, getWasteStats,
    cuttingPlans, addCuttingPlan, updateCuttingPlan, removeCuttingPlan, optimizeCuttingPlan,
    inventory,
  } = useWarehouseStore()

  const stats = getWasteStats()
  const [activeSubTab, setActiveSubTab] = useState('log')
  const [addingWaste, setAddingWaste] = useState(false)
  const [wasteForm, setWasteForm] = useState({
    materialId: '', materialName: '', type: 'offcut', quantity: 1,
    length: 0, reason: '', orderId: '', recyclable: true,
  })
  const [addingPlan, setAddingPlan] = useState(false)
  const [planForm, setPlanForm] = useState({
    name: '', materialId: '', stockLength: 4.8, cuts: [{ length: 2.7, qty: 10, label: 'Cut 1' }],
  })

  const filteredLog = wasteFilter === 'all' ? wasteLog : wasteLog.filter((w) => w.type === wasteFilter)

  const handleAddWaste = () => {
    const mat = inventory.find((i) => i.id === wasteForm.materialId)
    addWasteEntry({
      ...wasteForm,
      materialName: mat?.name || wasteForm.materialName,
      quantity: Number(wasteForm.quantity),
      length: Number(wasteForm.length),
    })
    setAddingWaste(false)
  }

  const handleAddPlan = () => {
    if (!planForm.name) return
    addCuttingPlan({
      ...planForm,
      stockLength: Number(planForm.stockLength),
      cuts: planForm.cuts.map((c) => ({ ...c, length: Number(c.length), qty: Number(c.qty) })),
      optimized: false,
      stockRequired: 0,
      wastePercent: 0,
      totalWaste: 0,
    })
    setAddingPlan(false)
    setPlanForm({ name: '', materialId: '', stockLength: 4.8, cuts: [{ length: 2.7, qty: 10, label: 'Cut 1' }] })
  }

  const addCutToPlan = () => {
    setPlanForm({
      ...planForm,
      cuts: [...planForm.cuts, { length: 1.0, qty: 1, label: `Cut ${planForm.cuts.length + 1}` }],
    })
  }

  const updateCut = (index, field, value) => {
    const cuts = [...planForm.cuts]
    cuts[index] = { ...cuts[index], [field]: value }
    setPlanForm({ ...planForm, cuts })
  }

  const removeCut = (index) => {
    setPlanForm({ ...planForm, cuts: planForm.cuts.filter((_, i) => i !== index) })
  }

  return (
    <div className="wh-panel">
      <div className="wh-header">
        <h2>Waste Management</h2>
        <div className="wh-header-stats">
          <div className="wh-stat">
            <span className="wh-stat-val">{stats.totalEntries}</span>
            <span className="wh-stat-label">Total Entries</span>
          </div>
          <div className="wh-stat">
            <span className="wh-stat-val" style={{ color: '#2ed573' }}>{stats.recyclable}</span>
            <span className="wh-stat-label">Recyclable</span>
          </div>
          <div className="wh-stat">
            <span className="wh-stat-val wh-stat-warn">{stats.nonRecyclable}</span>
            <span className="wh-stat-label">Non-Recyclable</span>
          </div>
        </div>
      </div>

      <div className="wh-sub-tabs">
        {[
          { id: 'log', label: 'Waste Log' },
          { id: 'cutting', label: 'Cutting Optimiser' },
          { id: 'analytics', label: 'Waste Analytics' },
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

      {activeSubTab === 'log' && (
        <div className="wh-section">
          <div className="wh-category-tabs" style={{ marginBottom: 12 }}>
            <button className={`wh-cat-btn ${wasteFilter === 'all' ? 'active' : ''}`} onClick={() => setWasteFilter('all')}>All</button>
            {WASTE_TYPES.map((t) => (
              <button key={t} className={`wh-cat-btn ${wasteFilter === t ? 'active' : ''}`} onClick={() => setWasteFilter(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)} ({stats.byType[t] || 0})
              </button>
            ))}
          </div>

          <div className="wh-table-wrap">
            <table className="wh-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Material</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Size</th>
                  <th>Reason</th>
                  <th>Recyclable</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLog.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td><strong>{entry.materialName}</strong></td>
                    <td>
                      <span className={`waste-type-tag waste-${entry.type}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td>{entry.quantity}</td>
                    <td>{entry.length ? `${entry.length}m` : entry.area ? `${entry.area}m2` : '-'}</td>
                    <td>{entry.reason}</td>
                    <td>
                      <span className={entry.recyclable ? 'wh-status ok' : 'wh-status low'}>
                        {entry.recyclable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button className="wh-btn-sm wh-btn-del" onClick={() => removeWasteEntry(entry.id)}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {addingWaste ? (
            <div className="wh-add-form">
              <h4>Log Waste</h4>
              <div className="wh-form-grid">
                <div className="wh-form-field">
                  <label>Material</label>
                  <select value={wasteForm.materialId} onChange={(e) => setWasteForm({ ...wasteForm, materialId: e.target.value })}>
                    <option value="">Select...</option>
                    {inventory.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div className="wh-form-field">
                  <label>Type</label>
                  <select value={wasteForm.type} onChange={(e) => setWasteForm({ ...wasteForm, type: e.target.value })}>
                    {WASTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="wh-form-field">
                  <label>Quantity</label>
                  <input type="number" value={wasteForm.quantity} onChange={(e) => setWasteForm({ ...wasteForm, quantity: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Length (m)</label>
                  <input type="number" step="0.01" value={wasteForm.length} onChange={(e) => setWasteForm({ ...wasteForm, length: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Reason</label>
                  <input value={wasteForm.reason} onChange={(e) => setWasteForm({ ...wasteForm, reason: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Recyclable</label>
                  <select value={wasteForm.recyclable} onChange={(e) => setWasteForm({ ...wasteForm, recyclable: e.target.value === 'true' })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="wh-form-actions">
                <button className="btn-secondary" onClick={() => setAddingWaste(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddWaste}>Log Waste</button>
              </div>
            </div>
          ) : (
            <button className="wh-add-btn" onClick={() => setAddingWaste(true)}>+ Log Waste</button>
          )}
        </div>
      )}

      {activeSubTab === 'cutting' && (
        <div className="wh-section">
          <div className="cutting-plans">
            {cuttingPlans.map((plan) => (
              <div key={plan.id} className="cutting-plan-card">
                <div className="cutting-plan-header">
                  <h4>{plan.name}</h4>
                  <div className="cutting-plan-actions">
                    <button className="wh-btn-sm" onClick={() => optimizeCuttingPlan(plan.id)}>
                      Optimise
                    </button>
                    <button className="wh-btn-sm wh-btn-del" onClick={() => removeCuttingPlan(plan.id)}>
                      Del
                    </button>
                  </div>
                </div>

                <div className="cutting-plan-meta">
                  <span>Stock Length: {plan.stockLength}m</span>
                  {plan.optimized && (
                    <>
                      <span>Stock Required: <strong>{plan.stockRequired}</strong> lengths</span>
                      <span>Waste: <strong className={plan.wastePercent > 10 ? 'waste-high' : 'waste-low'}>{plan.wastePercent}%</strong> ({plan.totalWaste}m)</span>
                    </>
                  )}
                </div>

                <div className="cutting-plan-cuts">
                  <div className="cutting-cut-header">Cut List:</div>
                  {plan.cuts.map((cut, i) => (
                    <div key={i} className="cutting-cut-row">
                      <span className="cutting-cut-label">{cut.label}</span>
                      <span className="cutting-cut-len">{cut.length}m</span>
                      <span className="cutting-cut-qty">x{cut.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Visual cutting diagram */}
                {plan.optimized && (
                  <CuttingDiagram plan={plan} />
                )}
              </div>
            ))}
          </div>

          {addingPlan ? (
            <div className="wh-add-form">
              <h4>New Cutting Plan</h4>
              <div className="wh-form-grid">
                <div className="wh-form-field">
                  <label>Plan Name</label>
                  <input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} />
                </div>
                <div className="wh-form-field">
                  <label>Material</label>
                  <select value={planForm.materialId} onChange={(e) => setPlanForm({ ...planForm, materialId: e.target.value })}>
                    <option value="">Select...</option>
                    {inventory.filter((i) => i.category === 'timber' || i.category === 'ijoist').map((i) => (
                      <option key={i.id} value={i.id}>{i.name} ({i.stockLength}m)</option>
                    ))}
                  </select>
                </div>
                <div className="wh-form-field">
                  <label>Stock Length (m)</label>
                  <input type="number" step="0.1" value={planForm.stockLength} onChange={(e) => setPlanForm({ ...planForm, stockLength: e.target.value })} />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Cut List</div>
                {planForm.cuts.map((cut, i) => (
                  <div key={i} className="cutting-edit-row">
                    <input placeholder="Label" value={cut.label} onChange={(e) => updateCut(i, 'label', e.target.value)} style={{ width: 120 }} />
                    <input type="number" step="0.01" placeholder="Length" value={cut.length} onChange={(e) => updateCut(i, 'length', e.target.value)} style={{ width: 80 }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>m x</span>
                    <input type="number" placeholder="Qty" value={cut.qty} onChange={(e) => updateCut(i, 'qty', e.target.value)} style={{ width: 60 }} />
                    <button className="wh-btn-sm wh-btn-del" onClick={() => removeCut(i)}>X</button>
                  </div>
                ))}
                <button className="wh-btn-sm" onClick={addCutToPlan} style={{ marginTop: 6 }}>+ Add Cut</button>
              </div>

              <div className="wh-form-actions">
                <button className="btn-secondary" onClick={() => setAddingPlan(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleAddPlan}>Create Plan</button>
              </div>
            </div>
          ) : (
            <button className="wh-add-btn" onClick={() => setAddingPlan(true)}>+ New Cutting Plan</button>
          )}
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="wh-section">
          <WasteAnalytics stats={stats} wasteLog={wasteLog} />
        </div>
      )}
    </div>
  )
}

function CuttingDiagram({ plan }) {
  const stockLen = plan.stockLength
  const barWidth = 100 // percent

  // Recreate bins using FFD
  const cuts = []
  plan.cuts.forEach((c) => {
    for (let i = 0; i < c.qty; i++) {
      cuts.push({ length: c.length, label: c.label })
    }
  })
  cuts.sort((a, b) => b.length - a.length)

  const bins = []
  cuts.forEach((cut) => {
    let placed = false
    for (const bin of bins) {
      if (bin.remaining >= cut.length) {
        bin.cuts.push(cut)
        bin.remaining -= cut.length
        placed = true
        break
      }
    }
    if (!placed) {
      bins.push({ cuts: [cut], remaining: stockLen - cut.length })
    }
  })

  const COLORS = ['#3498db', '#2ed573', '#ffa502', '#e94560', '#9b59b6', '#1abc9c', '#e67e22']

  return (
    <div className="cutting-diagram">
      <div className="cutting-diagram-title">Cutting Layout ({bins.length} lengths)</div>
      {bins.slice(0, 8).map((bin, bi) => (
        <div key={bi} className="cutting-bar-row">
          <span className="cutting-bar-label">#{bi + 1}</span>
          <div className="cutting-bar">
            {bin.cuts.map((cut, ci) => {
              const pct = (cut.length / stockLen) * 100
              return (
                <div
                  key={ci}
                  className="cutting-bar-segment"
                  style={{
                    width: `${pct}%`,
                    background: COLORS[ci % COLORS.length],
                  }}
                  title={`${cut.label}: ${cut.length}m`}
                >
                  {pct > 8 && <span>{cut.length}m</span>}
                </div>
              )
            })}
            {bin.remaining > 0.01 && (
              <div
                className="cutting-bar-waste"
                style={{ width: `${(bin.remaining / stockLen) * 100}%` }}
                title={`Waste: ${bin.remaining.toFixed(2)}m`}
              >
                {(bin.remaining / stockLen) * 100 > 5 && <span>{bin.remaining.toFixed(1)}m</span>}
              </div>
            )}
          </div>
        </div>
      ))}
      {bins.length > 8 && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '4px 0' }}>
          ...and {bins.length - 8} more lengths
        </div>
      )}
    </div>
  )
}

function WasteAnalytics({ stats, wasteLog }) {
  const byMaterial = Object.entries(stats.byMaterial).sort((a, b) => b[1] - a[1])
  const maxMaterial = byMaterial.length > 0 ? byMaterial[0][1] : 1

  // Weekly trend (last 7 days)
  const today = new Date()
  const weekData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const count = wasteLog.filter((w) => w.date === dateStr).length
    weekData.push({ date: dateStr, day: d.toLocaleDateString('en-GB', { weekday: 'short' }), count })
  }
  const maxWeek = Math.max(...weekData.map((d) => d.count), 1)

  return (
    <div className="waste-analytics">
      <div className="wa-section">
        <h4>Waste by Type</h4>
        <div className="wa-type-bars">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="wa-bar-row">
              <span className="wa-bar-label">{type}</span>
              <div className="wa-bar">
                <div
                  className="wa-bar-fill"
                  style={{
                    width: `${(count / stats.totalEntries) * 100}%`,
                    background: type === 'offcut' ? '#ffa502' : type === 'damaged' ? '#e94560' : '#9b59b6',
                  }}
                />
              </div>
              <span className="wa-bar-val">{count} ({((count / stats.totalEntries) * 100).toFixed(0)}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wa-section">
        <h4>Waste by Material (pieces)</h4>
        <div className="wa-type-bars">
          {byMaterial.map(([mat, qty]) => (
            <div key={mat} className="wa-bar-row">
              <span className="wa-bar-label">{mat}</span>
              <div className="wa-bar">
                <div
                  className="wa-bar-fill"
                  style={{ width: `${(qty / maxMaterial) * 100}%`, background: '#3498db' }}
                />
              </div>
              <span className="wa-bar-val">{qty}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wa-section">
        <h4>Weekly Trend</h4>
        <div className="wa-week-chart">
          {weekData.map((d, i) => (
            <div key={i} className="wa-week-bar">
              <div className="wa-week-bar-inner" style={{ height: `${(d.count / maxWeek) * 100}%` }}>
                {d.count > 0 && <span>{d.count}</span>}
              </div>
              <div className="wa-week-label">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wa-section">
        <h4>Recycling Rate</h4>
        <div className="wa-recycling">
          <div className="wa-recycling-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#2ed573" strokeWidth="10"
                strokeDasharray={`${(stats.recyclable / Math.max(stats.totalEntries, 1)) * 251.3} 251.3`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="var(--text-primary)" fontSize="16" fontWeight="bold">
                {stats.totalEntries > 0 ? ((stats.recyclable / stats.totalEntries) * 100).toFixed(0) : 0}%
              </text>
            </svg>
          </div>
          <div className="wa-recycling-labels">
            <div><span style={{ color: '#2ed573' }}>Recyclable:</span> {stats.recyclable}</div>
            <div><span style={{ color: '#e94560' }}>Non-recyclable:</span> {stats.nonRecyclable}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
