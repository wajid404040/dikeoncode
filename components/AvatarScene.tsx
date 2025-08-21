'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import ReadyPlayerMeAvatar from './ReadyPlayerMeAvatar'
import { availableAvatars } from './SettingsPanel'

interface AvatarSceneProps {
  currentText: string
  isSpeaking: boolean
  onTestMode?: (enabled: boolean) => void
  settings?: any
}

export default function AvatarScene({ currentText, isSpeaking, onTestMode, settings }: AvatarSceneProps) {
  // Find the selected avatar's modelPath
  const selectedAvatar = availableAvatars.find(a => a.id.toLowerCase() === (settings?.selectedAvatar || '').toLowerCase())
  const modelPath = selectedAvatar ? selectedAvatar.modelPath : '/models/brunette.glb'

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1.6, 1.0], fov: 20 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
          />
          <directionalLight
            position={[-5, 5, 5]}
            intensity={0.8}
          />
          <pointLight position={[0, 3, 2]} intensity={0.5} />
          
          {/* Ready Player Me Avatar */}
          <ReadyPlayerMeAvatar
            isSpeaking={isSpeaking}
            currentText={currentText}
            onTestMode={onTestMode}
            settings={settings}
            modelPath={modelPath}
          />
          
          {/* Controls - Focus on head only */}
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            target={[0, 1.6, 0]}
            maxDistance={1.5}
            minDistance={0.8}
            maxAzimuthAngle={Math.PI / 8}
            minAzimuthAngle={-Math.PI / 8}
          />
        </Suspense>
      </Canvas>
    </div>
  )
} 