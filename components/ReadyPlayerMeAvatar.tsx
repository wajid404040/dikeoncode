"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import TTSService from "./TTSService";

interface ReadyPlayerMeAvatarProps {
  isSpeaking: boolean;
  currentText: string;
  onTestMode?: (enabled: boolean) => void;
  settings?: any;
  modelPath: string;
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
};

function getViseme(char: string): string {
  const upperChar = char.toUpperCase();
  return corresponding[upperChar as keyof typeof corresponding] || "viseme_I";
}

export default function ReadyPlayerMeAvatar({
  isSpeaking,
  currentText,
  onTestMode,
  settings,
  modelPath,
}: ReadyPlayerMeAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [speechStartTime, setSpeechStartTime] = useState(0);
  const [currentViseme, setCurrentViseme] = useState("viseme_I");

  // Enhanced animation system
  const [animationTime, setAnimationTime] = useState(0);
  const [headMovement, setHeadMovement] = useState(0);
  const [hairMovement, setHairMovement] = useState(0);
  const [breathing, setBreathing] = useState(0);
  const [idleTime, setIdleTime] = useState(0);

  // Enhanced facial expression system
  const [currentExpression, setCurrentExpression] = useState("neutral");
  const [expressionIntensity, setExpressionIntensity] = useState(0);

  // New micro-movement systems
  const [microExpressionTime, setMicroExpressionTime] = useState(0);
  const [eyeTrackingTime, setEyeTrackingTime] = useState(0);
  const [eyebrowTime, setEyebrowTime] = useState(0);
  const [jawMovementTime, setJawMovementTime] = useState(0);
  const [neckTension, setNeckTension] = useState(0);

  // Animation state
  const [currentAnimation, setCurrentAnimation] = useState<string>("Enhanced Human-like Movements");
  const [animationError, setAnimationError] = useState<string>("");
  const [testMode, setTestMode] = useState(false);

  // Load the Ready Player Me avatar
  const { scene, animations, nodes, materials } = useGLTF(modelPath);

  // Use GLB animations if available
  const { actions } = useAnimations(animations, groupRef);

  // Debug animation loading
  useEffect(() => {
    console.log("=== ENHANCED ANIMATION SYSTEM ===");
    console.log("GLB animations count:", animations.length);
    console.log("Using enhanced human-like movements with hair and facial expressions");

    // Log all animation names for debugging
    animations.forEach((anim, index) => {
      console.log(`Animation ${index}:`, anim.name, "duration:", anim.duration, "tracks:", anim.tracks.length);
    });

    // Log available action names
    if (actions) {
      console.log("Available action names:", Object.keys(actions));
    }

    // Debug bone structure
    if (groupRef.current) {
      console.log("=== BONE STRUCTURE DEBUG ===");
      const logBones = (obj: THREE.Object3D, level = 0) => {
        const indent = "  ".repeat(level);
        console.log(`${indent}${obj.name} (${obj.type})`);
        obj.children.forEach((child) => logBones(child, level + 1));
      };
      logBones(groupRef.current);
      console.log("=== END BONE STRUCTURE ===");
    }

    // Debug morph targets
    if (nodes.Wolf3D_Head) {
      const headMesh = nodes.Wolf3D_Head as THREE.Mesh;
      console.log("=== MORPH TARGETS DEBUG ===");
      console.log("Head mesh morphTargetDictionary:", headMesh.morphTargetDictionary);
      console.log("Head mesh morphTargetInfluences:", headMesh.morphTargetInfluences);
      if (headMesh.morphTargetDictionary) {
        console.log("Available morph targets:", Object.keys(headMesh.morphTargetDictionary));
      }
      console.log("=== END MORPH TARGETS DEBUG ===");
    }

    console.log("=== END ANIMATION DEBUG ===");
  }, [animations, actions, nodes]);

  // Expose test mode to parent
  useEffect(() => {
    if (onTestMode) {
      onTestMode(testMode);
    }
  }, [testMode, onTestMode]);

  // Test function to toggle test mode
  const toggleTestMode = () => {
    setTestMode(!testMode);
    console.log("Test mode:", !testMode ? "enabled" : "disabled");
  };

  // Initialize TTS service
  useEffect(() => {
    TTSService.initializeVoices();
  }, []);

  // Expose test function globally for debugging
  useEffect(() => {
    (window as any).toggleAvatarTestMode = toggleTestMode;
    return () => {
      delete (window as any).toggleAvatarTestMode;
    };
  }, [testMode]);

  // Enhanced facial expression system with micro-expressions
  useEffect(() => {
    if (isSpeaking) {
      setCurrentExpression("speaking");
      setExpressionIntensity(0.8);
    } else {
      // Enhanced expression cycling with more variety
      const expressions = [
        "neutral",
        "slight_smile",
        "curious",
        "thoughtful",
        "slight_frown",
        "neutral",
        "amused",
        "neutral",
      ];
      const expressionIndex = Math.floor(idleTime / 4) % expressions.length;
      setCurrentExpression(expressions[expressionIndex]);
      setExpressionIntensity(0.4);
    }
  }, [isSpeaking, idleTime]);

  // Enhanced text-to-speech with natural lip sync
  useEffect(() => {
    if (currentText && isSpeaking) {
      console.log("Starting enhanced speech with text:", currentText);

      setSpeechStartTime(Date.now());

      // Use the new TTS service
      TTSService.speak(currentText)
        .then((response) => {
          if (response.success) {
            console.log("TTS service successful, duration:", response.duration);
          } else {
            console.error("TTS service failed:", response.error);
          }
        })
        .catch((error) => {
          console.error("TTS service error:", error);
        });

      // Simple lip sync for basic morph targets
      const lipSyncInterval = setInterval(() => {
        const elapsed = Date.now() - speechStartTime;
        const timePerChar = 120; // Slower, more natural timing
        const currentIndex = Math.floor(elapsed / timePerChar);

        if (currentIndex < currentText.length) {
          const char = currentText[currentIndex].toLowerCase();

          // Simple mapping for basic morph targets
          if ("aeiou".includes(char)) {
            setCurrentViseme("mouthOpen"); // Open mouth for vowels
          } else if ("bcdfghjklmnpqrstvwxyz".includes(char)) {
            setCurrentViseme("mouthClosed"); // Close mouth for consonants
          } else if (char === " ") {
            setCurrentViseme("mouthClosed"); // Close mouth for spaces
          } else {
            setCurrentViseme("mouthClosed"); // Default to closed
          }

          setCurrentCharIndex(currentIndex);
        } else {
          // Return to closed when done
          setCurrentViseme("mouthClosed");
        }
      }, 120); // Slower interval for smoother movement

      // Stop lip sync after estimated duration
      const estimatedDuration = currentText.length * 120;
      setTimeout(() => {
        console.log("Speech ended");
        clearInterval(lipSyncInterval);
        setCurrentViseme("mouthClosed");
        setCurrentCharIndex(0);
      }, estimatedDuration);

      return () => {
        clearInterval(lipSyncInterval);
        TTSService.stop();
      };
    }
  }, [currentText, isSpeaking, speechStartTime]);

  // Enhanced bone detection system
  const findBoneByName = (name: string): THREE.Object3D | null => {
    if (!groupRef.current) return null;

    const variations = [
      name,
      name.toLowerCase(),
      name.toUpperCase(),
      name.replace(/([A-Z])/g, "_$1").toLowerCase(),
      name
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, ""),
      `Wolf3D_${name}`,
      `Wolf3D_${name.toLowerCase()}`,
      `Wolf3D_${name.toUpperCase()}`,
      // Common ReadyPlayerMe variations
      name.replace(/([A-Z])/g, "_$1"),
      name.replace(/([A-Z])/g, "_$1").toLowerCase(),
    ];

    for (const variation of variations) {
      const bone = groupRef.current.getObjectByName(variation);
      if (bone) return bone;
    }

    return null;
  };

  // Enhanced animation system with micro-movements
  useFrame((state, delta) => {
    setAnimationTime((prev) => prev + delta);
    setHeadMovement((prev) => prev + delta * 2);
    setHairMovement((prev) => prev + delta * 1.5);
    setBreathing((prev) => prev + delta * 3);
    setIdleTime((prev) => prev + delta);

    // New micro-movement timers
    setMicroExpressionTime((prev) => prev + delta * 0.8);
    setEyeTrackingTime((prev) => prev + delta * 1.2);
    setEyebrowTime((prev) => prev + delta * 0.6);
    setJawMovementTime((prev) => prev + delta * 1.5);
    setNeckTension((prev) => prev + delta * 0.9);

    if (!nodes?.Wolf3D_Head || !nodes?.Wolf3D_Teeth) return;

    // Enhanced viseme application with robust morph target detection
    const headMesh = nodes.Wolf3D_Head as THREE.Mesh;
    const teethMesh = nodes.Wolf3D_Teeth as THREE.Mesh;

    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      // Simple mouthOpen application
      const mouthOpenIndex = headMesh.morphTargetDictionary["mouthOpen"];
      if (mouthOpenIndex !== undefined) {
        const currentValue = headMesh.morphTargetInfluences[mouthOpenIndex];
        // Proper open/close animation
        if (currentViseme === "mouthOpen") {
          headMesh.morphTargetInfluences[mouthOpenIndex] = currentValue * 0.8 + 0.4;
        } else {
          headMesh.morphTargetInfluences[mouthOpenIndex] = currentValue * 0.8;
        }
      }
    }

    if (teethMesh.morphTargetDictionary && teethMesh.morphTargetInfluences) {
      // Simple mouthOpen application to teeth
      const mouthOpenIndex = teethMesh.morphTargetDictionary["mouthOpen"];
      if (mouthOpenIndex !== undefined) {
        const currentValue = teethMesh.morphTargetInfluences[mouthOpenIndex];
        // Proper open/close animation
        if (currentViseme === "mouthOpen") {
          teethMesh.morphTargetInfluences[mouthOpenIndex] = currentValue * 0.8 + 0.4;
        } else {
          teethMesh.morphTargetInfluences[mouthOpenIndex] = currentValue * 0.8;
        }
      }
    }

    // Enhanced facial expressions with micro-expressions
    if (headMesh.morphTargetDictionary && headMesh.morphTargetInfluences) {
      // Reset all expression morph targets
      const expressionTargets = [
        "viseme_smile",
        "viseme_frown",
        "viseme_raise_eyebrows",
        "viseme_squint",
        "viseme_wink",
        "viseme_eyebrow_raise",
        "viseme_eyebrow_lower",
        "viseme_cheek_raise",
      ];
      expressionTargets.forEach((target) => {
        if (headMesh.morphTargetDictionary![target] !== undefined) {
          headMesh.morphTargetInfluences![headMesh.morphTargetDictionary![target]] = 0;
        }
      });

      // Apply current expression
      switch (currentExpression) {
        case "slight_smile":
          if (headMesh.morphTargetDictionary["viseme_smile"] !== undefined) {
            headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_smile"]] = expressionIntensity;
          }
          break;
        case "curious":
          if (headMesh.morphTargetDictionary["viseme_raise_eyebrows"] !== undefined) {
            headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_raise_eyebrows"]] =
              expressionIntensity;
          }
          break;
        case "thoughtful":
          if (headMesh.morphTargetDictionary["viseme_frown"] !== undefined) {
            headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_frown"]] = expressionIntensity * 0.5;
          }
          break;
        case "slight_frown":
          if (headMesh.morphTargetDictionary["viseme_frown"] !== undefined) {
            headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_frown"]] = expressionIntensity * 0.7;
          }
          break;
        case "amused":
          if (headMesh.morphTargetDictionary["viseme_smile"] !== undefined) {
            headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_smile"]] = expressionIntensity * 0.6;
          }
          if (headMesh.morphTargetDictionary["viseme_cheek_raise"] !== undefined) {
            headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_cheek_raise"]] =
              expressionIntensity * 0.4;
          }
          break;
      }

      // Add micro-expressions
      const microExpressionIntensity = 0.2;
      const microTime = microExpressionTime;

      // Subtle eyebrow movements
      if (headMesh.morphTargetDictionary["viseme_eyebrow_raise"] !== undefined) {
        const eyebrowMovement = Math.sin(microTime * 0.3) * 0.1 + 0.1;
        headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_eyebrow_raise"]] =
          eyebrowMovement * microExpressionIntensity;
      }

      // Subtle cheek movements
      if (headMesh.morphTargetDictionary["viseme_cheek_raise"] !== undefined) {
        const cheekMovement = Math.sin(microTime * 0.5) * 0.05 + 0.05;
        headMesh.morphTargetInfluences![headMesh.morphTargetDictionary["viseme_cheek_raise"]] =
          cheekMovement * microExpressionIntensity;
      }
    }

    if (groupRef.current) {
      const t = animationTime;
      const breathingAmount = Math.sin(breathing) * 0.002;
      const headBob = Math.sin(headMovement) * 0.005;
      const hairWave = Math.sin(hairMovement) * 0.008;

      // Enhanced head movements with micro-adjustments
      const head = findBoneByName("Head");
      if (head) {
        // Look at camera with slight variation
        const camera = new THREE.Vector3(0, 1.2, 2.5);
        head.lookAt(camera);

        // Enhanced head movements with more variety
        if (isSpeaking) {
          // More pronounced head movements when speaking
          head.rotation.x += Math.sin(t * 2) * 0.012;
          head.rotation.z += Math.sin(t * 1.5) * 0.01;
          head.rotation.y += Math.sin(t * 3) * 0.008;

          // Add emphasis movements
          head.rotation.x += Math.sin(t * 4) * 0.005;
          head.rotation.y += Math.sin(t * 5) * 0.003;
        } else {
          // Natural idle head movements with micro-adjustments
          head.rotation.x += Math.sin(t * 0.5) * 0.004;
          head.rotation.z += Math.sin(t * 0.7) * 0.003;
          head.rotation.y += Math.sin(t * 0.3) * 0.005;

          // Subtle nodding
          head.rotation.x += Math.sin(t * 0.2) * 0.002;

          // Slight head tilting
          head.rotation.z += Math.sin(t * 0.4) * 0.001;
        }

        // Add breathing movement
        head.rotation.x += breathingAmount;

        // Add micro-head movements
        const microHeadX = Math.sin(microExpressionTime * 0.8) * 0.001;
        const microHeadY = Math.sin(microExpressionTime * 0.6) * 0.0008;
        const microHeadZ = Math.sin(microExpressionTime * 1.2) * 0.0005;

        head.rotation.x += microHeadX;
        head.rotation.y += microHeadY;
        head.rotation.z += microHeadZ;

        if (testMode) {
          // Enhanced test mode movements
          head.rotation.y += Math.sin(t * 2) * 0.02;
          head.rotation.x += Math.sin(t * 1.5) * 0.015;
          head.rotation.z += Math.sin(t * 3) * 0.01;
        }
      }

      // Enhanced neck movements with tension
      const neck = findBoneByName("Neck");
      if (neck) {
        // Base neck movement
        neck.rotation.y = Math.sin(headMovement * 0.7) * 0.003;

        if (isSpeaking) {
          // More active neck during speech
          neck.rotation.y += Math.sin(t * 1.2) * 0.004;
          neck.rotation.x = breathingAmount * 1.0;

          // Add emphasis movements
          neck.rotation.z += Math.sin(t * 2.5) * 0.002;
        } else {
          // Subtle neck adjustments when idle
          neck.rotation.x = breathingAmount * 0.6;
          neck.rotation.y += Math.sin(t * 0.4) * 0.001;
        }

        // Add neck tension simulation
        const neckTensionAmount = Math.sin(neckTension * 0.5) * 0.001;
        neck.rotation.x += neckTensionAmount;
        neck.rotation.y += neckTensionAmount * 0.5;
      }

      // Enhanced eye movements with tracking
      const leftEye = findBoneByName("LeftEye");
      const rightEye = findBoneByName("RightEye");
      if (leftEye && rightEye) {
        // Natural blinking pattern
        const blinkTime = Math.sin(t * 0.3) * 0.5 + 0.5;
        const blinkIntensity = Math.sin(t * 8) * 0.5 + 0.5;

        if (blinkTime > 0.95 && blinkIntensity > 0.8) {
          // Enhanced blink
          leftEye.rotation.x = Math.sin(t * 20) * 0.2;
          rightEye.rotation.x = Math.sin(t * 20) * 0.2;
        } else {
          // Enhanced eye movement with tracking
          const eyeTrackingX = Math.sin(eyeTrackingTime * 0.4) * 0.003;
          const eyeTrackingY = Math.sin(eyeTrackingTime * 0.6) * 0.002;
          const eyeTrackingZ = Math.sin(eyeTrackingTime * 0.8) * 0.001;

          // Add micro-saccades (tiny eye movements)
          const microSaccadeX = Math.sin(eyeTrackingTime * 2.5) * 0.0005;
          const microSaccadeY = Math.sin(eyeTrackingTime * 3.2) * 0.0003;

          leftEye.rotation.x = eyeTrackingX + microSaccadeX;
          leftEye.rotation.y = eyeTrackingY + microSaccadeY;
          leftEye.rotation.z = eyeTrackingZ;

          rightEye.rotation.x = eyeTrackingX + microSaccadeX;
          rightEye.rotation.y = eyeTrackingY + microSaccadeY;
          rightEye.rotation.z = eyeTrackingZ;

          // Add slight asymmetry for realism
          leftEye.rotation.x += Math.sin(eyeTrackingTime * 1.1) * 0.0002;
          rightEye.rotation.x += Math.sin(eyeTrackingTime * 1.3) * 0.0002;
        }
      }

      // Enhanced hair movement system
      const hairBoneNames = [
        "Hair",
        "Hair1",
        "Hair2",
        "Hair3",
        "Hair4",
        "Hair5",
        "LeftHair",
        "RightHair",
        "HairBangs",
        "HairPonytail",
        "Wolf3D_Hair",
        "Wolf3D_Hair1",
        "Wolf3D_Hair2",
        "Hair_L",
        "Hair_R",
        "Hair_Front",
        "Hair_Back",
        "HairSide",
        "HairTop",
        "HairBottom",
      ];

      hairBoneNames.forEach((hairName) => {
        const hairBone = findBoneByName(hairName);
        if (hairBone) {
          // Enhanced hair movement with different patterns
          const hairSpeed = 0.8 + Math.random() * 0.4;
          const hairAmplitude = 0.005 + Math.random() * 0.003;

          const hairMovementX = Math.sin(t * hairSpeed) * hairAmplitude;
          const hairMovementY = Math.sin(t * (hairSpeed * 0.7)) * (hairAmplitude * 0.8);
          const hairMovementZ = Math.sin(t * (hairSpeed * 1.2)) * (hairAmplitude * 0.6);

          // Add wind effect
          const windEffect = Math.sin(t * 0.3) * 0.003;

          hairBone.rotation.x += hairMovementX + windEffect;
          hairBone.rotation.y += hairMovementY;
          hairBone.rotation.z += hairMovementZ;

          // Add subtle position movement for more realistic hair
          hairBone.position.x += Math.sin(t * hairSpeed * 0.5) * 0.0005;
          hairBone.position.y += Math.sin(t * hairSpeed * 0.3) * 0.0003;
        }
      });

      // Enhanced jaw movement with micro-adjustments
      const jaw = findBoneByName("Jaw");
      if (jaw) {
        if (isSpeaking) {
          // Active jaw movement during speech
          jaw.rotation.x = Math.sin(t * 2) * 0.008;
          jaw.rotation.y = Math.sin(t * 1.5) * 0.003;
          jaw.rotation.z = Math.sin(t * 3) * 0.002;
        } else {
          // Subtle jaw movements when idle
          const jawIdleX = Math.sin(jawMovementTime * 0.3) * 0.001;
          const jawIdleY = Math.sin(jawMovementTime * 0.5) * 0.0005;

          jaw.rotation.x = jawIdleX;
          jaw.rotation.y = jawIdleY;
        }

        // Add micro-jaw movements
        const microJawX = Math.sin(jawMovementTime * 1.2) * 0.0003;
        jaw.rotation.x += microJawX;
      }

      // Enhanced body breathing movement
      const spine = findBoneByName("Spine") || findBoneByName("Spine1") || findBoneByName("Spine2");
      if (spine) {
        // Enhanced breathing with more natural movement
        spine.rotation.x = breathingAmount * 0.4;
        spine.rotation.y = Math.sin(breathing * 0.7) * 0.001;
        spine.rotation.z = Math.sin(breathing * 0.5) * 0.0005;
      }

      // Add subtle shoulder movement (if available)
      const leftShoulder = findBoneByName("LeftShoulder") || findBoneByName("LeftArm");
      const rightShoulder = findBoneByName("RightShoulder") || findBoneByName("RightArm");

      if (leftShoulder) {
        leftShoulder.rotation.x = breathingAmount * 0.2;
        leftShoulder.rotation.y = Math.sin(breathing * 0.3) * 0.001;
      }

      if (rightShoulder) {
        rightShoulder.rotation.x = breathingAmount * 0.2;
        rightShoulder.rotation.y = Math.sin(breathing * 0.3) * 0.001;
      }
    }
  });

  // Play GLB animations if available (as background)
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      try {
        // Play a subtle idle animation if available
        const idleAction = actions["idle"] || actions["Idle"] || actions["mixamo.com|Layer0"];
        if (idleAction) {
          console.log("Playing idle animation as background");
          idleAction.reset().fadeIn(1.0).play();
          idleAction.setLoop(THREE.LoopRepeat, Infinity);
          idleAction.setEffectiveTimeScale(0.6); // Slightly faster idle animation
        }
      } catch (error) {
        console.error("Error playing background animation:", error);
      }
    }
  }, [actions]);

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={nodes?.Hips} />
      {nodes?.Wolf3D_Body && (
        <skinnedMesh
          geometry={(nodes.Wolf3D_Body as any).geometry}
          material={materials?.Wolf3D_Body}
          skeleton={(nodes.Wolf3D_Body as any).skeleton}
        />
      )}
      {nodes?.Wolf3D_Outfit_Bottom && (
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Bottom as any).geometry}
          material={materials?.Wolf3D_Outfit_Bottom}
          skeleton={(nodes.Wolf3D_Outfit_Bottom as any).skeleton}
        />
      )}
      {nodes?.Wolf3D_Outfit_Footwear && (
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Footwear as any).geometry}
          material={materials?.Wolf3D_Outfit_Footwear}
          skeleton={(nodes.Wolf3D_Outfit_Footwear as any).skeleton}
        />
      )}
      {nodes?.Wolf3D_Outfit_Top && (
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top as any).geometry}
          material={materials?.Wolf3D_Outfit_Top}
          skeleton={(nodes.Wolf3D_Outfit_Top as any).skeleton}
        />
      )}
      {nodes?.Wolf3D_Hair && (
        <skinnedMesh
          geometry={(nodes.Wolf3D_Hair as any).geometry}
          material={materials?.Wolf3D_Hair}
          skeleton={(nodes.Wolf3D_Hair as any).skeleton}
        />
      )}
      {nodes?.EyeLeft && (
        <skinnedMesh
          name="EyeLeft"
          geometry={(nodes.EyeLeft as any).geometry}
          material={materials?.Wolf3D_Eye}
          skeleton={(nodes.EyeLeft as any).skeleton}
          morphTargetDictionary={(nodes.EyeLeft as any).morphTargetDictionary}
          morphTargetInfluences={(nodes.EyeLeft as any).morphTargetInfluences}
        />
      )}
      {nodes?.EyeRight && (
        <skinnedMesh
          name="EyeRight"
          geometry={(nodes.EyeRight as any).geometry}
          material={materials?.Wolf3D_Eye}
          skeleton={(nodes.EyeRight as any).skeleton}
          morphTargetDictionary={(nodes.EyeRight as any).morphTargetDictionary}
          morphTargetInfluences={(nodes.EyeRight as any).morphTargetInfluences}
        />
      )}
      {nodes?.Wolf3D_Head && (
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={(nodes.Wolf3D_Head as any).geometry}
          material={materials?.Wolf3D_Skin}
          skeleton={(nodes.Wolf3D_Head as any).skeleton}
          morphTargetDictionary={(nodes.Wolf3D_Head as any).morphTargetDictionary}
          morphTargetInfluences={(nodes.Wolf3D_Head as any).morphTargetInfluences}
        />
      )}
      {nodes?.Wolf3D_Teeth && (
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={(nodes.Wolf3D_Teeth as any).geometry}
          material={materials?.Wolf3D_Teeth}
          skeleton={(nodes.Wolf3D_Teeth as any).skeleton}
          morphTargetDictionary={(nodes.Wolf3D_Teeth as any).morphTargetDictionary}
          morphTargetInfluences={(nodes.Wolf3D_Teeth as any).morphTargetInfluences}
        />
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/brunette.glb");
