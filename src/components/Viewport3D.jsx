import React, { useRef, useEffect, useCallback, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Grid,
  Environment,
  Html,
  TransformControls,
  PerspectiveCamera,
  OrthographicCamera,
} from '@react-three/drei'
import * as THREE from 'three'
import { useHouseStore } from '../store/houseStore'
import './Viewport3D.css'

export default function Viewport3D() {
  const viewMode = useHouseStore((s) => s.viewMode)

  return (
    <div className="viewport-3d">
      <Canvas shadows>
        <Suspense fallback={<Html center><div style={{ color: '#fff' }}>Loading...</div></Html>}>
          <SceneSetup />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <directionalLight position={[-10, 10, -5]} intensity={0.3} />
          <Ground />
          <HouseModel />
          <SelectedPanelControls />
          <Grid
            args={[50, 50]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#2a2a4e"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#3a3a6e"
            fadeDistance={30}
            fadeStrength={1}
            position={[0, -0.01, 0]}
          />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.1}
            minDistance={3}
            maxDistance={50}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <ViewportOverlay />
    </div>
  )
}

function SceneSetup() {
  const { camera } = useThree()
  const viewMode = useHouseStore((s) => s.viewMode)

  useEffect(() => {
    switch (viewMode) {
      case 'front':
        camera.position.set(0, 4, 20)
        camera.lookAt(0, 4, 0)
        break
      case 'side':
        camera.position.set(20, 4, 0)
        camera.lookAt(0, 4, 0)
        break
      case 'top':
        camera.position.set(0, 25, 0.01)
        camera.lookAt(0, 0, 0)
        break
      default:
        camera.position.set(12, 10, 12)
        camera.lookAt(0, 3, 0)
    }
  }, [viewMode, camera])

  return null
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a2a1a" transparent opacity={0.6} />
    </mesh>
  )
}

function HouseModel() {
  const panels = useHouseStore((s) => s.panels)
  const showWireframe = useHouseStore((s) => s.showWireframe)
  const showDimensions = useHouseStore((s) => s.showDimensions)

  return (
    <group>
      {panels.map((panel) => (
        <PanelMesh
          key={panel.id}
          panel={panel}
          showWireframe={showWireframe}
          showDimensions={showDimensions}
        />
      ))}
    </group>
  )
}

function PanelMesh({ panel, showWireframe, showDimensions }) {
  const meshRef = useRef()
  const selectedPanelId = useHouseStore((s) => s.selectedPanelId)
  const selectPanel = useHouseStore((s) => s.selectPanel)
  const isSelected = selectedPanelId === panel.id

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    selectPanel(panel.id)
  }, [panel.id, selectPanel])

  return (
    <group
      position={panel.position}
      rotation={panel.rotation}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
      >
        <boxGeometry args={panel.size} />
        <meshStandardMaterial
          color={isSelected ? '#ff6b81' : panel.color}
          wireframe={showWireframe}
          transparent
          opacity={panel.type === 'wall' ? 0.85 : 0.9}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <boxGeometry args={panel.size.map((s) => s + 0.05)} />
          <meshBasicMaterial color="#e94560" wireframe transparent opacity={0.4} />
        </mesh>
      )}

      {/* Window openings visualization */}
      {panel.type === 'wall' && panel.windows > 0 && (
        <WindowOpenings panel={panel} />
      )}

      {/* Door openings visualization */}
      {panel.type === 'wall' && panel.doors > 0 && (
        <DoorOpenings panel={panel} />
      )}

      {/* I-Joist visualization */}
      {panel.ijoists && panel.ijoists.length > 0 && (
        <IJoistVisualization panel={panel} />
      )}

      {/* Dimension labels */}
      {showDimensions && isSelected && (
        <DimensionLabels panel={panel} />
      )}
    </group>
  )
}

function WindowOpenings({ panel }) {
  const count = panel.windows || 0
  const wallWidth = panel.size[0]
  const wallHeight = panel.size[1]
  const winW = 0.9
  const winH = 1.1
  const winY = 0.2

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = -wallWidth / 2 + (wallWidth / (count + 1)) * (i + 1)
        return (
          <mesh key={i} position={[x, winY, 0]}>
            <boxGeometry args={[winW, winH, panel.size[2] + 0.05]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} />
          </mesh>
        )
      })}
    </>
  )
}

function DoorOpenings({ panel }) {
  const count = panel.doors || 0
  const wallWidth = panel.size[0]
  const wallHeight = panel.size[1]
  const doorW = 1.0
  const doorH = 2.1
  const doorY = -wallHeight / 2 + doorH / 2

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = -wallWidth / 2 + (wallWidth / (count + 1)) * (i + 1)
        return (
          <mesh key={i} position={[x, doorY, 0]}>
            <boxGeometry args={[doorW, doorH, panel.size[2] + 0.05]} />
            <meshStandardMaterial color="#5d4037" transparent opacity={0.7} />
          </mesh>
        )
      })}
    </>
  )
}

function IJoistVisualization({ panel }) {
  return (
    <group>
      {panel.ijoists.map((joist) => (
        <IJoistMesh key={joist.id} joist={joist} panelType={panel.type} />
      ))}
    </group>
  )
}

function IJoistMesh({ joist, panelType }) {
  const { depth, flangeWidth, flangeThickness, webThickness, length } = joist
  const pos = joist.position

  return (
    <group position={pos}>
      {/* Top flange */}
      <mesh position={[0, depth / 2 - flangeThickness / 2, 0]}>
        <boxGeometry args={[flangeWidth, flangeThickness, length]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* Web */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[webThickness, depth - 2 * flangeThickness, length]} />
        <meshStandardMaterial color="#bcaaa4" />
      </mesh>
      {/* Bottom flange */}
      <mesh position={[0, -depth / 2 + flangeThickness / 2, 0]}>
        <boxGeometry args={[flangeWidth, flangeThickness, length]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
    </group>
  )
}

function DimensionLabels({ panel }) {
  const [w, h, d] = panel.size

  return (
    <>
      {/* Width label */}
      <Html position={[0, -h / 2 - 0.3, d / 2 + 0.2]} center>
        <div className="dim-label">{w.toFixed(2)}m</div>
      </Html>
      {/* Height label */}
      <Html position={[w / 2 + 0.3, 0, d / 2 + 0.2]} center>
        <div className="dim-label">{h.toFixed(2)}m</div>
      </Html>
      {/* Depth label */}
      <Html position={[w / 2 + 0.3, -h / 2 - 0.3, 0]} center>
        <div className="dim-label">{d.toFixed(2)}m</div>
      </Html>
    </>
  )
}

function SelectedPanelControls() {
  const selectedPanelId = useHouseStore((s) => s.selectedPanelId)
  const editorMode = useHouseStore((s) => s.editorMode)
  const panels = useHouseStore((s) => s.panels)
  const updatePanel = useHouseStore((s) => s.updatePanel)
  const panel = panels.find((p) => p.id === selectedPanelId)
  const transformRef = useRef()
  const objRef = useRef()

  useEffect(() => {
    if (objRef.current && panel) {
      objRef.current.position.set(...panel.position)
      objRef.current.rotation.set(...panel.rotation)
      objRef.current.scale.set(1, 1, 1)
    }
  }, [panel?.id])

  const handleTransformChange = useCallback(() => {
    if (!objRef.current || !selectedPanelId) return
    const pos = objRef.current.position
    const rot = objRef.current.rotation
    updatePanel(selectedPanelId, {
      position: [pos.x, pos.y, pos.z],
      rotation: [rot.x, rot.y, rot.z],
    })
  }, [selectedPanelId, updatePanel])

  if (!panel || editorMode === 'select') return null

  const mode = editorMode === 'move' ? 'translate' : editorMode

  return (
    <>
      <TransformControls
        ref={transformRef}
        object={objRef}
        mode={mode}
        onMouseUp={handleTransformChange}
        size={0.7}
      />
      <mesh ref={objRef} visible={false}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
      </mesh>
    </>
  )
}

function ViewportOverlay() {
  const selectedPanelId = useHouseStore((s) => s.selectedPanelId)
  const panels = useHouseStore((s) => s.panels)
  const houseName = useHouseStore((s) => s.houseName)
  const sites = useHouseStore((s) => s.sites)
  const selectedSiteId = useHouseStore((s) => s.selectedSiteId)
  const houseStyles = useHouseStore((s) => s.houseStyles)
  const selectedStyleId = useHouseStore((s) => s.selectedStyleId)

  const site = sites.find((s) => s.id === selectedSiteId)
  const style = houseStyles.find((s) => s.id === selectedStyleId)
  const panel = panels.find((p) => p.id === selectedPanelId)

  return (
    <div className="viewport-overlay">
      <div className="viewport-info">
        <div className="viewport-info-title">{houseName}</div>
        {site && <div className="viewport-info-sub">Site: {site.name}</div>}
        {style && <div className="viewport-info-sub">Style: {style.name} ({style.floors}F, {style.roofType})</div>}
        <div className="viewport-info-sub">Panels: {panels.length}</div>
      </div>
      {panel && (
        <div className="viewport-selected">
          Selected: {panel.name} ({panel.type})
        </div>
      )}
    </div>
  )
}
