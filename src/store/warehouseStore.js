import { create } from 'zustand'

const generateId = () => Math.random().toString(36).substring(2, 10)

const TIMBER_STOCK = [
  { id: 'ts-1', name: 'C16 Timber 47x100', category: 'timber', grade: 'C16', width: 0.047, depth: 0.1, stockLength: 4.8, unit: 'm', quantity: 500, minStock: 100, costPerUnit: 3.20, location: 'Bay A1' },
  { id: 'ts-2', name: 'C16 Timber 47x150', category: 'timber', grade: 'C16', width: 0.047, depth: 0.15, stockLength: 4.8, unit: 'm', quantity: 350, minStock: 80, costPerUnit: 4.80, location: 'Bay A2' },
  { id: 'ts-3', name: 'C24 Timber 47x200', category: 'timber', grade: 'C24', width: 0.047, depth: 0.2, stockLength: 5.4, unit: 'm', quantity: 200, minStock: 60, costPerUnit: 7.50, location: 'Bay A3' },
  { id: 'ts-4', name: 'C24 Timber 47x250', category: 'timber', grade: 'C24', width: 0.047, depth: 0.25, stockLength: 5.4, unit: 'm', quantity: 150, minStock: 40, costPerUnit: 9.80, location: 'Bay A4' },
  { id: 'ts-5', name: 'C16 Timber 38x89', category: 'timber', grade: 'C16', width: 0.038, depth: 0.089, stockLength: 3.6, unit: 'm', quantity: 800, minStock: 200, costPerUnit: 2.10, location: 'Bay B1' },
  { id: 'ts-6', name: 'C24 Timber 38x140', category: 'timber', grade: 'C24', width: 0.038, depth: 0.14, stockLength: 4.2, unit: 'm', quantity: 400, minStock: 100, costPerUnit: 4.20, location: 'Bay B2' },
]

const SHEET_STOCK = [
  { id: 'sh-1', name: 'OSB3 2440x1220x11', category: 'sheet', type: 'OSB3', width: 2.44, height: 1.22, thickness: 0.011, unit: 'sheet', quantity: 200, minStock: 50, costPerUnit: 12.50, location: 'Rack C1' },
  { id: 'sh-2', name: 'OSB3 2440x1220x18', category: 'sheet', type: 'OSB3', width: 2.44, height: 1.22, thickness: 0.018, unit: 'sheet', quantity: 150, minStock: 40, costPerUnit: 18.90, location: 'Rack C2' },
  { id: 'sh-3', name: 'Plywood 2440x1220x12', category: 'sheet', type: 'Plywood', width: 2.44, height: 1.22, thickness: 0.012, unit: 'sheet', quantity: 100, minStock: 30, costPerUnit: 22.00, location: 'Rack C3' },
  { id: 'sh-4', name: 'Plywood 2440x1220x18', category: 'sheet', type: 'Plywood', width: 2.44, height: 1.22, thickness: 0.018, unit: 'sheet', quantity: 80, minStock: 25, costPerUnit: 32.50, location: 'Rack C4' },
  { id: 'sh-5', name: 'Cement Board 2400x1200x9', category: 'sheet', type: 'Cement Board', width: 2.4, height: 1.2, thickness: 0.009, unit: 'sheet', quantity: 60, minStock: 20, costPerUnit: 14.00, location: 'Rack D1' },
]

const IJOIST_STOCK = [
  { id: 'ij-1', name: 'TJI 110 241mm', category: 'ijoist', type: 'TJI 110', depth: 0.241, stockLength: 6.0, unit: 'm', quantity: 300, minStock: 60, costPerUnit: 8.50, location: 'Bay E1' },
  { id: 'ij-2', name: 'TJI 210 241mm', category: 'ijoist', type: 'TJI 210', depth: 0.241, stockLength: 7.5, unit: 'm', quantity: 250, minStock: 50, costPerUnit: 10.20, location: 'Bay E2' },
  { id: 'ij-3', name: 'TJI 230 302mm', category: 'ijoist', type: 'TJI 230', depth: 0.302, stockLength: 7.5, unit: 'm', quantity: 200, minStock: 40, costPerUnit: 12.80, location: 'Bay E3' },
  { id: 'ij-4', name: 'TJI 360 302mm', category: 'ijoist', type: 'TJI 360', depth: 0.302, stockLength: 9.0, unit: 'm', quantity: 120, minStock: 30, costPerUnit: 16.50, location: 'Bay E4' },
  { id: 'ij-5', name: 'TJI 560 356mm', category: 'ijoist', type: 'TJI 560', depth: 0.356, stockLength: 9.0, unit: 'm', quantity: 80, minStock: 20, costPerUnit: 22.00, location: 'Bay E5' },
]

const INSULATION_STOCK = [
  { id: 'in-1', name: 'Mineral Wool 100mm', category: 'insulation', type: 'Mineral Wool', thickness: 0.1, unit: 'm2', quantity: 500, minStock: 100, costPerUnit: 5.50, location: 'Bay F1' },
  { id: 'in-2', name: 'Mineral Wool 150mm', category: 'insulation', type: 'Mineral Wool', thickness: 0.15, unit: 'm2', quantity: 300, minStock: 80, costPerUnit: 8.20, location: 'Bay F2' },
  { id: 'in-3', name: 'PIR Board 50mm', category: 'insulation', type: 'PIR', thickness: 0.05, unit: 'm2', quantity: 200, minStock: 50, costPerUnit: 12.00, location: 'Bay F3' },
  { id: 'in-4', name: 'PIR Board 100mm', category: 'insulation', type: 'PIR', thickness: 0.1, unit: 'm2', quantity: 150, minStock: 40, costPerUnit: 22.00, location: 'Bay F4' },
]

const FIXINGS_STOCK = [
  { id: 'fx-1', name: 'Framing Nails 90mm', category: 'fixings', type: 'Nails', unit: 'box', quantity: 50, minStock: 15, costPerUnit: 28.00, location: 'Shelf G1' },
  { id: 'fx-2', name: 'Framing Nails 63mm', category: 'fixings', type: 'Nails', unit: 'box', quantity: 40, minStock: 10, costPerUnit: 24.00, location: 'Shelf G2' },
  { id: 'fx-3', name: 'Coach Screws 10x100', category: 'fixings', type: 'Screws', unit: 'box', quantity: 30, minStock: 10, costPerUnit: 32.00, location: 'Shelf G3' },
  { id: 'fx-4', name: 'Joist Hangers Standard', category: 'fixings', type: 'Brackets', unit: 'each', quantity: 200, minStock: 50, costPerUnit: 3.50, location: 'Shelf G4' },
  { id: 'fx-5', name: 'Angle Brackets', category: 'fixings', type: 'Brackets', unit: 'each', quantity: 300, minStock: 80, costPerUnit: 2.20, location: 'Shelf G5' },
  { id: 'fx-6', name: 'Hold-down Straps', category: 'fixings', type: 'Straps', unit: 'each', quantity: 100, minStock: 30, costPerUnit: 4.80, location: 'Shelf G6' },
]

const MEMBRANE_STOCK = [
  { id: 'mb-1', name: 'Breather Membrane 50m', category: 'membrane', type: 'Breather', rollLength: 50, rollWidth: 1.5, unit: 'roll', quantity: 20, minStock: 5, costPerUnit: 65.00, location: 'Bay H1' },
  { id: 'mb-2', name: 'VCL Membrane 50m', category: 'membrane', type: 'VCL', rollLength: 50, rollWidth: 2.0, unit: 'roll', quantity: 15, minStock: 5, costPerUnit: 48.00, location: 'Bay H2' },
  { id: 'mb-3', name: 'DPM 300mu 4x25m', category: 'membrane', type: 'DPM', rollLength: 25, rollWidth: 4.0, unit: 'roll', quantity: 10, minStock: 3, costPerUnit: 55.00, location: 'Bay H3' },
]

const ALL_STOCK = [
  ...TIMBER_STOCK,
  ...SHEET_STOCK,
  ...IJOIST_STOCK,
  ...INSULATION_STOCK,
  ...FIXINGS_STOCK,
  ...MEMBRANE_STOCK,
]

export const useWarehouseStore = create((set, get) => ({
  // Inventory
  inventory: ALL_STOCK,
  inventoryFilter: 'all', // all, timber, sheet, ijoist, insulation, fixings, membrane
  inventorySearch: '',

  // Orders / Production
  orders: [
    {
      id: 'ord-1',
      siteName: 'Riverside Estate',
      houseName: 'Plot 1 - Colonial',
      status: 'in-production',
      createdAt: '2026-03-28',
      dueDate: '2026-04-15',
      panels: 12,
      cassettes: 3,
      roofSections: 2,
      progress: 45,
      notes: 'Priority build - foundation complete',
    },
    {
      id: 'ord-2',
      siteName: 'Hilltop Views',
      houseName: 'Plot 3 - Modern',
      status: 'queued',
      createdAt: '2026-04-01',
      dueDate: '2026-04-22',
      panels: 8,
      cassettes: 2,
      roofSections: 1,
      progress: 0,
      notes: 'Waiting on steel deliveries',
    },
    {
      id: 'ord-3',
      siteName: 'Oak Park',
      houseName: 'Plot 7 - Craftsman',
      status: 'complete',
      createdAt: '2026-03-10',
      dueDate: '2026-03-28',
      panels: 14,
      cassettes: 4,
      roofSections: 3,
      progress: 100,
      notes: 'Dispatched 27/03',
    },
    {
      id: 'ord-4',
      siteName: 'Riverside Estate',
      houseName: 'Plot 2 - Ranch',
      status: 'queued',
      createdAt: '2026-04-03',
      dueDate: '2026-04-30',
      panels: 6,
      cassettes: 2,
      roofSections: 2,
      progress: 0,
      notes: '',
    },
  ],

  // Production lines
  productionLines: [
    { id: 'line-1', name: 'Wall Panel Line', type: 'wall', capacity: 8, currentLoad: 5, status: 'active' },
    { id: 'line-2', name: 'Floor Cassette Line', type: 'floor', capacity: 4, currentLoad: 2, status: 'active' },
    { id: 'line-3', name: 'Roof Panel Line', type: 'roof', capacity: 6, currentLoad: 0, status: 'idle' },
    { id: 'line-4', name: 'Saw Line A', type: 'cutting', capacity: 100, currentLoad: 65, status: 'active' },
    { id: 'line-5', name: 'Saw Line B', type: 'cutting', capacity: 100, currentLoad: 0, status: 'maintenance' },
  ],

  // Waste tracking
  wasteLog: [
    { id: 'w-1', date: '2026-04-04', materialId: 'ts-1', materialName: 'C16 47x100', type: 'offcut', quantity: 12, length: 0.45, reason: 'End cuts', orderId: 'ord-1', recyclable: true },
    { id: 'w-2', date: '2026-04-04', materialId: 'sh-1', materialName: 'OSB3 11mm', type: 'offcut', quantity: 4, area: 0.8, reason: 'Panel cutouts', orderId: 'ord-1', recyclable: true },
    { id: 'w-3', date: '2026-04-03', materialId: 'ts-2', materialName: 'C16 47x150', type: 'damaged', quantity: 3, length: 4.8, reason: 'Split during nailing', orderId: 'ord-1', recyclable: false },
    { id: 'w-4', date: '2026-04-03', materialId: 'ij-1', materialName: 'TJI 110', type: 'offcut', quantity: 8, length: 0.3, reason: 'Trimmed to length', orderId: 'ord-1', recyclable: true },
    { id: 'w-5', date: '2026-04-02', materialId: 'sh-2', materialName: 'OSB3 18mm', type: 'defective', quantity: 2, area: 2.97, reason: 'Delaminated sheets', orderId: null, recyclable: false },
    { id: 'w-6', date: '2026-04-02', materialId: 'ts-3', materialName: 'C24 47x200', type: 'offcut', quantity: 20, length: 0.25, reason: 'Stud end cuts', orderId: 'ord-3', recyclable: true },
    { id: 'w-7', date: '2026-04-01', materialId: 'ts-1', materialName: 'C16 47x100', type: 'offcut', quantity: 15, length: 0.6, reason: 'Nogging offcuts', orderId: 'ord-3', recyclable: true },
  ],

  wasteFilter: 'all', // all, offcut, damaged, defective

  // Cutting optimization
  cuttingPlans: [
    {
      id: 'cp-1',
      name: 'Wall Panel Studs - Plot 1',
      materialId: 'ts-1',
      stockLength: 4.8,
      cuts: [
        { length: 2.7, qty: 24, label: 'Studs' },
        { length: 2.1, qty: 6, label: 'Cripple studs' },
        { length: 1.2, qty: 12, label: 'Noggings' },
      ],
      optimized: true,
      stockRequired: 22,
      wastePercent: 3.2,
      totalWaste: 3.38,
    },
    {
      id: 'cp-2',
      name: 'Floor Joists - Plot 1',
      materialId: 'ij-1',
      stockLength: 6.0,
      cuts: [
        { length: 4.5, qty: 12, label: 'Main joists' },
        { length: 3.2, qty: 6, label: 'Trimmer joists' },
      ],
      optimized: true,
      stockRequired: 14,
      wastePercent: 5.8,
      totalWaste: 4.87,
    },
  ],

  // BOM (Bill of Materials)
  boms: [],

  // Deliveries
  deliveries: [
    { id: 'del-1', supplier: 'Timber Direct Ltd', expectedDate: '2026-04-08', status: 'in-transit', items: 'C16/C24 Timber assorted', value: 2450.00 },
    { id: 'del-2', supplier: 'Sheet Materials Co', expectedDate: '2026-04-10', status: 'confirmed', items: 'OSB3 & Plywood', value: 1820.00 },
    { id: 'del-3', supplier: 'TJI Supplies', expectedDate: '2026-04-12', status: 'confirmed', items: 'TJI 110, 230, 360', value: 3200.00 },
  ],

  // Actions - Inventory
  setInventoryFilter: (filter) => set({ inventoryFilter: filter }),
  setInventorySearch: (search) => set({ inventorySearch: search }),

  getFilteredInventory: () => {
    const { inventory, inventoryFilter, inventorySearch } = get()
    let items = inventory
    if (inventoryFilter !== 'all') {
      items = items.filter((i) => i.category === inventoryFilter)
    }
    if (inventorySearch) {
      const q = inventorySearch.toLowerCase()
      items = items.filter((i) => i.name.toLowerCase().includes(q) || i.location.toLowerCase().includes(q))
    }
    return items
  },

  updateStock: (itemId, quantity) =>
    set((s) => ({
      inventory: s.inventory.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    })),

  adjustStock: (itemId, delta) =>
    set((s) => ({
      inventory: s.inventory.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      ),
    })),

  addInventoryItem: (item) =>
    set((s) => ({ inventory: [...s.inventory, { ...item, id: generateId() }] })),

  removeInventoryItem: (itemId) =>
    set((s) => ({ inventory: s.inventory.filter((i) => i.id !== itemId) })),

  getLowStockItems: () => {
    return get().inventory.filter((i) => i.quantity <= i.minStock)
  },

  getStockValue: () => {
    return get().inventory.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0)
  },

  // Actions - Orders
  addOrder: (order) =>
    set((s) => ({ orders: [...s.orders, { ...order, id: generateId(), createdAt: new Date().toISOString().slice(0, 10), progress: 0 }] })),

  updateOrder: (orderId, updates) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
    })),

  removeOrder: (orderId) =>
    set((s) => ({ orders: s.orders.filter((o) => o.id !== orderId) })),

  // Actions - Waste
  setWasteFilter: (filter) => set({ wasteFilter: filter }),

  addWasteEntry: (entry) =>
    set((s) => ({
      wasteLog: [{ ...entry, id: generateId(), date: new Date().toISOString().slice(0, 10) }, ...s.wasteLog],
    })),

  removeWasteEntry: (entryId) =>
    set((s) => ({ wasteLog: s.wasteLog.filter((w) => w.id !== entryId) })),

  getWasteStats: () => {
    const log = get().wasteLog
    const totalEntries = log.length
    const recyclable = log.filter((w) => w.recyclable).length
    const nonRecyclable = totalEntries - recyclable
    const byType = log.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1
      return acc
    }, {})
    const byMaterial = log.reduce((acc, w) => {
      acc[w.materialName] = (acc[w.materialName] || 0) + w.quantity
      return acc
    }, {})
    return { totalEntries, recyclable, nonRecyclable, byType, byMaterial }
  },

  // Actions - Cutting Plans
  addCuttingPlan: (plan) =>
    set((s) => ({ cuttingPlans: [...s.cuttingPlans, { ...plan, id: generateId() }] })),

  updateCuttingPlan: (planId, updates) =>
    set((s) => ({
      cuttingPlans: s.cuttingPlans.map((p) => (p.id === planId ? { ...p, ...updates } : p)),
    })),

  removeCuttingPlan: (planId) =>
    set((s) => ({ cuttingPlans: s.cuttingPlans.filter((p) => p.id !== planId) })),

  optimizeCuttingPlan: (planId) => {
    const plan = get().cuttingPlans.find((p) => p.id === planId)
    if (!plan) return

    // First-Fit Decreasing bin packing algorithm
    const stockLen = plan.stockLength
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

    const totalStock = bins.length
    const totalUsed = cuts.reduce((sum, c) => sum + c.length, 0)
    const totalAvailable = totalStock * stockLen
    const totalWaste = totalAvailable - totalUsed
    const wastePercent = ((totalWaste / totalAvailable) * 100)

    set((s) => ({
      cuttingPlans: s.cuttingPlans.map((p) =>
        p.id === planId
          ? { ...p, optimized: true, stockRequired: totalStock, wastePercent: Math.round(wastePercent * 10) / 10, totalWaste: Math.round(totalWaste * 100) / 100 }
          : p
      ),
    }))
  },

  // Actions - BOM
  generateBOM: (orderId) => {
    const order = get().orders.find((o) => o.id === orderId)
    if (!order) return

    const bomItems = [
      { material: 'C16 Timber 47x100', category: 'timber', quantity: order.panels * 24, unit: 'm', estimatedCost: order.panels * 24 * 3.20 },
      { material: 'C16 Timber 47x150', category: 'timber', quantity: order.panels * 8, unit: 'm', estimatedCost: order.panels * 8 * 4.80 },
      { material: 'OSB3 2440x1220x11', category: 'sheet', quantity: order.panels * 3, unit: 'sheet', estimatedCost: order.panels * 3 * 12.50 },
      { material: 'TJI 110 241mm', category: 'ijoist', quantity: order.cassettes * 15, unit: 'm', estimatedCost: order.cassettes * 15 * 8.50 },
      { material: 'OSB3 2440x1220x18', category: 'sheet', quantity: order.cassettes * 4, unit: 'sheet', estimatedCost: order.cassettes * 4 * 18.90 },
      { material: 'Mineral Wool 100mm', category: 'insulation', quantity: order.panels * 8, unit: 'm2', estimatedCost: order.panels * 8 * 5.50 },
      { material: 'Framing Nails 90mm', category: 'fixings', quantity: Math.ceil(order.panels / 4), unit: 'box', estimatedCost: Math.ceil(order.panels / 4) * 28.00 },
      { material: 'Joist Hangers Standard', category: 'fixings', quantity: order.cassettes * 10, unit: 'each', estimatedCost: order.cassettes * 10 * 3.50 },
      { material: 'Breather Membrane 50m', category: 'membrane', quantity: Math.ceil(order.panels / 6), unit: 'roll', estimatedCost: Math.ceil(order.panels / 6) * 65.00 },
    ]

    const totalCost = bomItems.reduce((sum, b) => sum + b.estimatedCost, 0)

    const bom = {
      id: generateId(),
      orderId,
      orderName: `${order.siteName} - ${order.houseName}`,
      createdAt: new Date().toISOString().slice(0, 10),
      items: bomItems,
      totalCost: Math.round(totalCost * 100) / 100,
    }

    set((s) => ({ boms: [...s.boms, bom] }))
    return bom
  },

  // Actions - Deliveries
  addDelivery: (delivery) =>
    set((s) => ({ deliveries: [...s.deliveries, { ...delivery, id: generateId() }] })),

  updateDelivery: (deliveryId, updates) =>
    set((s) => ({
      deliveries: s.deliveries.map((d) => (d.id === deliveryId ? { ...d, ...updates } : d)),
    })),

  // Actions - Production Lines
  updateProductionLine: (lineId, updates) =>
    set((s) => ({
      productionLines: s.productionLines.map((l) => (l.id === lineId ? { ...l, ...updates } : l)),
    })),
}))
