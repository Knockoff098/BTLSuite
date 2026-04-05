import { create } from 'zustand'

const generateId = () => Math.random().toString(36).substring(2, 10)

const DEFAULT_HOUSE_STYLES = [
  { id: 'colonial', name: 'Colonial', floors: 2, roofType: 'gable', color: '#d4a574' },
  { id: 'modern', name: 'Modern', floors: 1, roofType: 'flat', color: '#b0bec5' },
  { id: 'craftsman', name: 'Craftsman', floors: 2, roofType: 'hip', color: '#8d6e63' },
  { id: 'ranch', name: 'Ranch', floors: 1, roofType: 'gable', color: '#a1887f' },
  { id: 'contemporary', name: 'Contemporary', floors: 3, roofType: 'shed', color: '#78909c' },
]

const DEFAULT_SITES = [
  { id: 'site-1', name: 'Riverside Estate', address: '123 River Rd', lotWidth: 20, lotDepth: 30 },
  { id: 'site-2', name: 'Hilltop Views', address: '456 Summit Dr', lotWidth: 25, lotDepth: 25 },
  { id: 'site-3', name: 'Oak Park', address: '789 Oak Ave', lotWidth: 18, lotDepth: 35 },
]

function createDefaultPanels(style) {
  const panels = []
  const floors = style?.floors || 1
  const w = 10
  const d = 8
  const h = 3

  for (let floor = 0; floor < floors; floor++) {
    const yBase = floor * h

    // Front wall
    panels.push({
      id: generateId(),
      type: 'wall',
      name: `Floor ${floor + 1} - Front Wall`,
      floor: floor,
      position: [0, yBase + h / 2, d / 2],
      size: [w, h, 0.2],
      rotation: [0, 0, 0],
      color: style?.color || '#d4a574',
      material: 'timber-frame',
      windows: 2,
      doors: floor === 0 ? 1 : 0,
      ijoists: [],
    })

    // Back wall
    panels.push({
      id: generateId(),
      type: 'wall',
      name: `Floor ${floor + 1} - Back Wall`,
      floor: floor,
      position: [0, yBase + h / 2, -d / 2],
      size: [w, h, 0.2],
      rotation: [0, 0, 0],
      color: style?.color || '#d4a574',
      material: 'timber-frame',
      windows: 3,
      doors: 0,
      ijoists: [],
    })

    // Left wall
    panels.push({
      id: generateId(),
      type: 'wall',
      name: `Floor ${floor + 1} - Left Wall`,
      floor: floor,
      position: [-w / 2, yBase + h / 2, 0],
      size: [d, h, 0.2],
      rotation: [0, Math.PI / 2, 0],
      color: style?.color || '#d4a574',
      material: 'timber-frame',
      windows: 1,
      doors: 0,
      ijoists: [],
    })

    // Right wall
    panels.push({
      id: generateId(),
      type: 'wall',
      name: `Floor ${floor + 1} - Right Wall`,
      floor: floor,
      position: [w / 2, yBase + h / 2, 0],
      size: [d, h, 0.2],
      rotation: [0, Math.PI / 2, 0],
      color: style?.color || '#d4a574',
      material: 'timber-frame',
      windows: 1,
      doors: 0,
      ijoists: [],
    })

    // Floor panel
    panels.push({
      id: generateId(),
      type: 'floor',
      name: `Floor ${floor + 1} - Floor Cassette`,
      floor: floor,
      position: [0, yBase, 0],
      size: [w, 0.3, d],
      rotation: [0, 0, 0],
      color: '#5d4037',
      material: 'cassette',
      ijoists: createDefaultIJoists(w, d),
    })
  }

  // Roof
  const roofY = floors * h
  if (style?.roofType === 'flat') {
    panels.push({
      id: generateId(),
      type: 'roof',
      name: 'Roof - Flat',
      floor: floors,
      position: [0, roofY + 0.15, 0],
      size: [w + 1, 0.3, d + 1],
      rotation: [0, 0, 0],
      color: '#37474f',
      material: 'membrane',
      ijoists: [],
    })
  } else if (style?.roofType === 'shed') {
    panels.push({
      id: generateId(),
      type: 'roof',
      name: 'Roof - Shed',
      floor: floors,
      position: [0, roofY + 1, 0],
      size: [w + 1, 0.25, d + 1],
      rotation: [0.2, 0, 0],
      color: '#455a64',
      material: 'metal',
      ijoists: [],
    })
  } else {
    // Gable or hip
    panels.push({
      id: generateId(),
      type: 'roof',
      name: 'Roof - Left Slope',
      floor: floors,
      position: [-w / 4, roofY + 1.5, 0],
      size: [w / 2 + 0.5, 0.2, d + 1],
      rotation: [0, 0, 0.4],
      color: '#455a64',
      material: 'tile',
      ijoists: [],
    })
    panels.push({
      id: generateId(),
      type: 'roof',
      name: 'Roof - Right Slope',
      floor: floors,
      position: [w / 4, roofY + 1.5, 0],
      size: [w / 2 + 0.5, 0.2, d + 1],
      rotation: [0, 0, -0.4],
      color: '#455a64',
      material: 'tile',
      ijoists: [],
    })
  }

  return panels
}

function createDefaultIJoists(width, depth) {
  const joists = []
  const spacing = 0.4 // 400mm centres
  const count = Math.floor(width / spacing)
  for (let i = 0; i < count; i++) {
    const x = -width / 2 + spacing / 2 + i * spacing
    joists.push({
      id: generateId(),
      position: [x, 0, 0],
      length: depth,
      depth: 0.3,
      flangeWidth: 0.05,
      flangeThickness: 0.04,
      webThickness: 0.01,
      material: 'LVL',
      grade: 'C24',
    })
  }
  return joists
}

export const useHouseStore = create((set, get) => ({
  // Sites
  sites: DEFAULT_SITES,
  selectedSiteId: DEFAULT_SITES[0].id,

  // House styles
  houseStyles: DEFAULT_HOUSE_STYLES,
  selectedStyleId: DEFAULT_HOUSE_STYLES[0].id,

  // Current house
  houseName: 'My House Project',
  panels: createDefaultPanels(DEFAULT_HOUSE_STYLES[0]),
  selectedPanelId: null,

  // Editor state
  editorMode: 'select', // select, move, rotate, scale
  showWireframe: false,
  showDimensions: true,
  viewMode: '3d', // 3d, front, side, top
  activeTab: 'dashboard', // dashboard, house, panels, ijoists, editor, warehouse, production, waste

  // Actions - Sites
  selectSite: (siteId) => set({ selectedSiteId: siteId }),
  addSite: (site) => set((s) => ({ sites: [...s.sites, { ...site, id: generateId() }] })),
  updateSite: (siteId, updates) =>
    set((s) => ({
      sites: s.sites.map((site) => (site.id === siteId ? { ...site, ...updates } : site)),
    })),
  removeSite: (siteId) =>
    set((s) => ({
      sites: s.sites.filter((site) => site.id !== siteId),
      selectedSiteId: s.selectedSiteId === siteId ? s.sites[0]?.id : s.selectedSiteId,
    })),

  // Actions - House Styles
  selectStyle: (styleId) => {
    const style = get().houseStyles.find((s) => s.id === styleId)
    set({
      selectedStyleId: styleId,
      panels: createDefaultPanels(style),
      selectedPanelId: null,
    })
  },
  addStyle: (style) =>
    set((s) => ({ houseStyles: [...s.houseStyles, { ...style, id: generateId() }] })),
  updateStyle: (styleId, updates) =>
    set((s) => ({
      houseStyles: s.houseStyles.map((style) =>
        style.id === styleId ? { ...style, ...updates } : style
      ),
    })),

  // Actions - House
  setHouseName: (name) => set({ houseName: name }),

  // Actions - Panels
  selectPanel: (panelId) => set({ selectedPanelId: panelId }),
  updatePanel: (panelId, updates) =>
    set((s) => ({
      panels: s.panels.map((p) => (p.id === panelId ? { ...p, ...updates } : p)),
    })),
  addPanel: (panel) =>
    set((s) => ({ panels: [...s.panels, { ...panel, id: generateId() }] })),
  removePanel: (panelId) =>
    set((s) => ({
      panels: s.panels.filter((p) => p.id !== panelId),
      selectedPanelId: s.selectedPanelId === panelId ? null : s.selectedPanelId,
    })),
  duplicatePanel: (panelId) => {
    const panel = get().panels.find((p) => p.id === panelId)
    if (!panel) return
    const newPanel = {
      ...panel,
      id: generateId(),
      name: panel.name + ' (copy)',
      position: [panel.position[0] + 1, panel.position[1], panel.position[2]],
      ijoists: panel.ijoists.map((j) => ({ ...j, id: generateId() })),
    }
    set((s) => ({ panels: [...s.panels, newPanel] }))
  },

  // Actions - I-Joists
  addIJoist: (panelId, joist) =>
    set((s) => ({
      panels: s.panels.map((p) =>
        p.id === panelId
          ? { ...p, ijoists: [...(p.ijoists || []), { ...joist, id: generateId() }] }
          : p
      ),
    })),
  updateIJoist: (panelId, joistId, updates) =>
    set((s) => ({
      panels: s.panels.map((p) =>
        p.id === panelId
          ? {
              ...p,
              ijoists: (p.ijoists || []).map((j) =>
                j.id === joistId ? { ...j, ...updates } : j
              ),
            }
          : p
      ),
    })),
  removeIJoist: (panelId, joistId) =>
    set((s) => ({
      panels: s.panels.map((p) =>
        p.id === panelId
          ? { ...p, ijoists: (p.ijoists || []).filter((j) => j.id !== joistId) }
          : p
      ),
    })),
  regenerateIJoists: (panelId, spacing) => {
    const panel = get().panels.find((p) => p.id === panelId)
    if (!panel) return
    const width = panel.size[0]
    const depth = panel.type === 'floor' ? panel.size[2] : panel.size[1]
    const count = Math.floor(width / spacing)
    const joists = []
    for (let i = 0; i < count; i++) {
      const x = -width / 2 + spacing / 2 + i * spacing
      joists.push({
        id: generateId(),
        position: [x, 0, 0],
        length: depth,
        depth: 0.3,
        flangeWidth: 0.05,
        flangeThickness: 0.04,
        webThickness: 0.01,
        material: 'LVL',
        grade: 'C24',
      })
    }
    set((s) => ({
      panels: s.panels.map((p) => (p.id === panelId ? { ...p, ijoists: joists } : p)),
    }))
  },

  // Actions - Editor
  setEditorMode: (mode) => set({ editorMode: mode }),
  setShowWireframe: (show) => set({ showWireframe: show }),
  setShowDimensions: (show) => set({ showDimensions: show }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Rebuild house from style
  rebuildFromStyle: () => {
    const style = get().houseStyles.find((s) => s.id === get().selectedStyleId)
    set({ panels: createDefaultPanels(style), selectedPanelId: null })
  },
}))
