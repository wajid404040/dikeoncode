'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarPreviewProps {
  avatarId: string
  modelPath: string
  settings?: any
}

// Viseme mapping for Ready Player Me models
const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk", 
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
}

function getViseme(char: string): string {
  const upperChar = char.toUpperCase()
  return corresponding[upperChar as keyof typeof corresponding] || "viseme_I"
}

export default function AvatarPreview({ avatarId, modelPath, settings }: AvatarPreviewProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [currentViseme, setCurrentViseme] = useState("viseme_I")
  
  // Simple animation for preview
  const [animationTime, setAnimationTime] = useState(0)
  const [headMovement, setHeadMovement] = useState(0)
  const [breathing, setBreathing] = useState(0)
  
  // Load the avatar model
  const { scene, animations, nodes, materials } = useGLTF(modelPath)

  // Use GLB animations if available
  const { actions } = useAnimations(animations, groupRef)

  // Simple preview animation
  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime
    setAnimationTime(time)
    
    // Gentle head movement
    const headRotation = Math.sin(time * 0.5) * 0.1
    setHeadMovement(headRotation)
    
    // Breathing animation
    const breathingScale = 1 + Math.sin(time * 2) * 0.02
    setBreathing(breathingScale)

    // Apply head movement
    const headBone = findBoneByName('Head')
    if (headBone) {
      headBone.rotation.y = headRotation
      headBone.rotation.x = Math.sin(time * 0.3) * 0.05
    }

    // Apply breathing to spine
    const spineBone = findBoneByName('Spine')
    if (spineBone) {
      spineBone.scale.y = breathingScale
    }

    // Apply viseme morph targets
    if (nodes.Wolf3D_Head && nodes.Wolf3D_Teeth) {
      applyVisemeMorphTargets()
    }
  })

  // Helper function to find bones by name
  const findBoneByName = (name: string): THREE.Object3D | null => {
    if (!groupRef.current) return null
    
    const findBone = (obj: THREE.Object3D): THREE.Object3D | null => {
      if (obj.name.toLowerCase().includes(name.toLowerCase())) {
        return obj
      }
      for (const child of obj.children) {
        const found = findBone(child)
        if (found) return found
      }
      return null
    }
    
    return findBone(groupRef.current)
  }

  // Apply viseme morph targets
  const applyVisemeMorphTargets = () => {
    if (!nodes.Wolf3D_Head || !nodes.Wolf3D_Teeth) return

    const headMesh = nodes.Wolf3D_Head as THREE.Mesh
    const teethMesh = nodes.Wolf3D_Teeth as THREE.Mesh
    
    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      // Reset all viseme morph targets
      Object.values(corresponding).forEach((value) => {
        const index = headMesh.morphTargetDictionary![value]
        if (index !== undefined) {
          headMesh.morphTargetInfluences![index] = 0
        }
      })
      
      // Apply current viseme with subtle intensity for preview
      const currentVisemeIndex = headMesh.morphTargetDictionary![currentViseme]
      if (currentVisemeIndex !== undefined) {
        headMesh.morphTargetInfluences![currentVisemeIndex] = 0.3
      }
    }
    
    if (teethMesh.morphTargetDictionary && teethMesh.morphTargetInfluences) {
      // Reset all viseme morph targets
      Object.values(corresponding).forEach((value) => {
        const index = teethMesh.morphTargetDictionary![value]
        if (index !== undefined) {
          teethMesh.morphTargetInfluences![index] = 0
        }
      })
      
      // Apply current viseme with subtle intensity for preview
      const currentVisemeIndex = teethMesh.morphTargetDictionary![currentViseme]
      if (currentVisemeIndex !== undefined) {
        teethMesh.morphTargetInfluences![currentVisemeIndex] = 0.3
      }
    }
  }

  // Simple viseme cycle for preview
  useEffect(() => {
    const visemeCycle = ["viseme_I", "viseme_AA", "viseme_O", "viseme_U", "viseme_I"]
    let currentIndex = 0
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % visemeCycle.length
      setCurrentViseme(visemeCycle[currentIndex])
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Clone the scene for the preview
  const clonedScene = scene.clone()

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
      
      {/* Lighting for preview */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.3} />
    </group>
  )
} 