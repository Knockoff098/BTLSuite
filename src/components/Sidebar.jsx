import React from 'react'
import { useHouseStore } from '../store/houseStore'
import SiteManager from './SiteManager'
import HouseStylePicker from './HouseStylePicker'
import PanelList from './PanelList'
import IJoistCassetteBuilder from './IJoistCassetteBuilder'
import EditorControls from './EditorControls'
import './Sidebar.css'

export default function Sidebar() {
  const activeTab = useHouseStore((s) => s.activeTab)

  return (
    <div className="sidebar">
      {activeTab === 'house' && (
        <>
          <SiteManager />
          <HouseStylePicker />
        </>
      )}
      {activeTab === 'panels' && <PanelList />}
      {activeTab === 'ijoists' && <IJoistCassetteBuilder />}
      {activeTab === 'editor' && <EditorControls />}
    </div>
  )
}
