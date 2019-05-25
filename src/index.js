import ReactDOM from 'react-dom'
import * as THREE from 'three/src/Three'
import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useRender } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three'
import './styles.css'

const faces = ['/img/berlusca.png', '/img/renzi.png', '/img/salvini.png', '/img/meloni.png', '/img/dimaio.png']

function Stars() {
  let group = useRef()
  let theta = 0
  useRender(() => {
    const r = 5 * Math.sin(THREE.Math.degToRad((theta += 0.01)))
    const s = Math.cos(THREE.Math.degToRad(theta * 2))
    group.current.rotation.set(r, r, r)
    group.current.scale.set(s, s, s)
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
    const coords = new Array(3000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    return [vertices, coords, spriteMaterial]
  }, [])
  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => {
        const faceToShow = i % spriteMaterial.length
        return <sprite key={i} material={spriteMaterial[faceToShow]} position={[p1, p2, p3]} scale={[15, 15]} />
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
