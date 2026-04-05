import React from 'react'
import { useWarehouseStore } from '../store/warehouseStore'
import { useHouseStore } from '../store/houseStore'
import './Warehouse.css'

export default function Dashboard() {
  const {
    inventory, orders, wasteLog, productionLines, deliveries,
    getLowStockItems, getStockValue, getWasteStats,
  } = useWarehouseStore()

  const { panels, sites, houseStyles } = useHouseStore()

  const lowStock = getLowStockItems()
  const totalValue = getStockValue()
  const wasteStats = getWasteStats()

  const activeOrders = orders.filter((o) => o.status === 'in-production')
  const queuedOrders = orders.filter((o) => o.status === 'queued')
  const completeOrders = orders.filter((o) => o.status === 'complete')

  const activeLines = productionLines.filter((l) => l.status === 'active')
  const pendingDeliveries = deliveries.filter((d) => d.status !== 'delivered')

  const totalPanels = orders.reduce((s, o) => s + o.panels, 0)
  const totalCassettes = orders.reduce((s, o) => s + o.cassettes, 0)
  const totalRoof = orders.reduce((s, o) => s + o.roofSections, 0)

  return (
    <div className="wh-panel dashboard">
      <div className="wh-header">
        <h2>Dashboard</h2>
        <div className="dash-date">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* KPI Cards */}
      <div className="dash-kpis">
        <div className="dash-kpi">
          <div className="dash-kpi-val">{orders.length}</div>
          <div className="dash-kpi-label">Total Orders</div>
          <div className="dash-kpi-sub">{activeOrders.length} active, {queuedOrders.length} queued</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val">{totalPanels}</div>
          <div className="dash-kpi-label">Wall Panels</div>
          <div className="dash-kpi-sub">Across all orders</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val">{totalCassettes}</div>
          <div className="dash-kpi-label">Floor Cassettes</div>
          <div className="dash-kpi-sub">Across all orders</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val">{totalRoof}</div>
          <div className="dash-kpi-label">Roof Sections</div>
          <div className="dash-kpi-sub">Across all orders</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val">&pound;{totalValue.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
          <div className="dash-kpi-label">Stock Value</div>
          <div className="dash-kpi-sub">{inventory.length} line items</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val" style={{ color: lowStock.length > 0 ? '#e94560' : '#2ed573' }}>
            {lowStock.length}
          </div>
          <div className="dash-kpi-label">Low Stock Items</div>
          <div className="dash-kpi-sub">Below minimum level</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val">{wasteStats.totalEntries}</div>
          <div className="dash-kpi-label">Waste Entries</div>
          <div className="dash-kpi-sub">{wasteStats.recyclable} recyclable</div>
        </div>
        <div className="dash-kpi">
          <div className="dash-kpi-val">{activeLines.length}/{productionLines.length}</div>
          <div className="dash-kpi-label">Active Lines</div>
          <div className="dash-kpi-sub">Production capacity</div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="dash-section">
        <h3>Active Production</h3>
        <div className="dash-orders">
          {activeOrders.length === 0 ? (
            <div className="wh-empty">No active orders</div>
          ) : (
            activeOrders.map((order) => (
              <div key={order.id} className="dash-order-card">
                <div className="dash-order-info">
                  <div className="dash-order-site">{order.siteName}</div>
                  <div className="dash-order-house">{order.houseName}</div>
                  {order.builder && <div className="dash-order-builder">{order.builder}</div>}
                  <div className="dash-order-due">Due: {order.dueDate}</div>
                </div>
                <div className="dash-order-stats">
                  <div>{order.panels} panels | {order.cassettes} cassettes | {order.roofSections} roof</div>
                  <div className="wh-progress" style={{ marginTop: 6 }}>
                    <div className="wh-progress-bar" style={{ width: `${order.progress}%`, background: '#3498db' }} />
                    <span>{order.progress}%</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Production Lines */}
      <div className="dash-section">
        <h3>Production Lines</h3>
        <div className="dash-lines">
          {productionLines.map((line) => (
            <div key={line.id} className={`dash-line dash-line-${line.status}`}>
              <div className="dash-line-name">{line.name}</div>
              <div className="dash-line-status">{line.status}</div>
              <div className="wh-progress" style={{ marginTop: 4 }}>
                <div
                  className="wh-progress-bar"
                  style={{
                    width: `${(line.currentLoad / line.capacity) * 100}%`,
                    background: line.status === 'maintenance' ? '#e94560' : line.currentLoad / line.capacity > 0.8 ? '#ffa502' : '#2ed573',
                  }}
                />
                <span>{line.currentLoad}/{line.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Deliveries */}
      <div className="dash-section">
        <h3>Pending Deliveries ({pendingDeliveries.length})</h3>
        <div className="dash-deliveries">
          {pendingDeliveries.map((del) => (
            <div key={del.id} className="dash-delivery">
              <div>
                <strong>{del.supplier}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{del.items}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{del.expectedDate}</div>
                <span className={`wh-status ${del.status === 'in-transit' ? 'ok' : ''}`}>{del.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="dash-section">
          <h3>Low Stock Alerts</h3>
          <div className="dash-low-stock">
            {lowStock.map((item) => (
              <div key={item.id} className="dash-low-item">
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#e94560', fontWeight: 700 }}>{item.quantity}</span>
                  <span style={{ color: 'var(--text-secondary)' }}> / {item.minStock} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Summary */}
      <div className="dash-section">
        <h3>House Design</h3>
        <div className="dash-design-summary">
          <div>Sites: {sites.length}</div>
          <div>House Styles: {houseStyles.length}</div>
          <div>Current Panels: {panels.length}</div>
        </div>
      </div>
    </div>
  )
}
