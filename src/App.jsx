import React from 'react'
import { useHouseStore } from './store/houseStore'
import Viewport3D from './components/Viewport3D'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import PanelEditor from './components/PanelEditor'
import './App.css'

export default function App() {
  const activeTab = useHouseStore((s) => s.activeTab)
  const selectedPanelId = useHouseStore((s) => s.selectedPanelId)

  return (
    <div className="app">
      <Toolbar />
      <div className="app-body">
        <Sidebar />
        <div className="viewport-area">
          <Viewport3D />
        </div>
        {selectedPanelId && (
          <div className="panel-editor-area">
            <PanelEditor />
          </div>
        )}
      </div>
    </div>
  )
}
