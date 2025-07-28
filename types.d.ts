// types.d.ts or src/types.d.ts
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      color: any
      ambientLight: any
      pointLight: any
      // Add other Three.js elements you use
      mesh: any
      boxGeometry: any
      meshStandardMaterial: any
    }
  }
}