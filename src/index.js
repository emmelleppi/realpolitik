import ReactDOM from 'react-dom'
import * as THREE from 'three/src/Three'
import React, { useEffect, useRef, useMemo } from 'react'
import { Canvas, useRender } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three'
import './styles.css'

const faces = ['/img/berlusca.png', '/img/renzi.png', '/img/salvini.png', '/img/meloni.png', '/img/dimaio.png']

function getInitialPosition() {
  return Math.random() * 2000 - 1000
}
function getRandomUnity() {
  return Math.random() * 2 - 1 
}
function getRandomVector3() {
  return new THREE.Vector3(getRandomUnity(), getRandomUnity(), getRandomUnity())
}
function getSphereConstants() {
  return [getRandomVector3(), getRandomVector3()]
}

function Stars() {
  let group = useRef()
  let theta = 0
  useRender(() => {
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
    group.current.children.forEach(child => {
      const { position, radius, defaultPosition, angle, sphereCostants } = child
      angle.value += 0.001
      angle.value %= 360
      position.set(
        defaultPosition.x + radius * Math.sin(angle.value) * sphereCostants[0].x + radius * Math.cos(angle.value) * sphereCostants[1].x,
        defaultPosition.y + radius * Math.sin(angle.value) * sphereCostants[0].y + radius * Math.cos(angle.value) * sphereCostants[1].y,
        defaultPosition.z + radius * Math.sin(angle.value) * sphereCostants[0].z + radius * Math.cos(angle.value) * sphereCostants[1].z,
      )
    
    })
  })
  const [vertices, coords, spriteMaterial] = useMemo(() => {
    const spriteMap = faces.map(face => new THREE.TextureLoader().load(face))
    const spriteMaterial = spriteMap.map(
      sprite =>
        new THREE.SpriteMaterial({
          map: sprite,
          color: 0xffffff,
          sizeAttenuation: true
        })
    )
    const coords = new Array(5000).fill().map(i => [getInitialPosition(), getInitialPosition(), getInitialPosition()])
    return [vertices, coords, spriteMaterial]
  }, [])

  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => {
        const faceToShow = i % spriteMaterial.length
        return <sprite key={i} radius={100} angle={{value: Math.random() * 2 * Math.PI}} material={spriteMaterial[faceToShow]} position={[p1, p2, p3]} defaultPosition={new THREE.Vector3(p1, p2, p3)} sphereCostants={getSphereConstants()} scale={[15, 15]} />
      })}
    </group>
  )
}

ReactDOM.render(
  <Canvas>
    <ambientLight color="lightblue" />
    <pointLight color="white" intensity={1} position={[10, 10, 10]} />
    <Stars />
  </Canvas>,
  document.getElementById('root')
)
