import React from 'react'
import { useHouseStore } from './store/houseStore'
import Viewport3D from './components/Viewport3D'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import PanelEditor from './components/PanelEditor'
import Dashboard from './components/Dashboard'
import WarehouseInventory from './components/WarehouseInventory'
import ProductionManager from './components/ProductionManager'
import WasteManager from './components/WasteManager'
import './App.css'

export default function App() {
  const activeTab = useHouseStore((s) => s.activeTab)
  const selectedPanelId = useHouseStore((s) => s.selectedPanelId)

  const isDesignTab = ['house', 'panels', 'ijoists', 'editor'].includes(activeTab)
  const isFullPageTab = ['dashboard', 'warehouse', 'production', 'waste'].includes(activeTab)

  return (
    <div className="app">
      <Toolbar />
      <div className="app-body">
        {isDesignTab && (
          <>
            <Sidebar />
            <div className="viewport-area">
              <Viewport3D />
            </div>
            {selectedPanelId && (
              <div className="panel-editor-area">
                <PanelEditor />
              </div>
            )}
          </>
        )}
        {activeTab === 'dashboard' && (
          <div className="full-page-area">
            <Dashboard />
          </div>
        )}
        {activeTab === 'warehouse' && (
          <div className="full-page-area">
            <WarehouseInventory />
          </div>
        )}
        {activeTab === 'production' && (
          <div className="full-page-area">
            <ProductionManager />
          </div>
        )}
        {activeTab === 'waste' && (
          <div className="full-page-area">
            <WasteManager />
          </div>
        )}
      </div>
    </div>
  )
}
