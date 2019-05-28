import ReactDOM from 'react-dom'
import * as THREE from 'three/src/Three'
import React, { useEffect, useRef, useMemo } from 'react'
import { Canvas, useRender, useThree } from 'react-three-fiber'
import { TweenMax, Power4, RoughEase, Circ } from 'gsap'
import { useSpring, animated } from 'react-spring/three'
import './styles.css'

const faces = ['/img/berlusca.png', '/img/renzi.png', '/img/salvini.png', '/img/meloni.png', '/img/dimaio.png']

function getCustomEase() {
  return RoughEase.ease.config({ template:  Circ.easeInOut, strength: 1, points: 20, taper: "both", randomize:  true, clamp: false})
}

function getInitialXPosition() {
  return Math.random() * 50 - 25
}
function getInitialYPosition() {
  return Math.random() * 50 - 25
}
function getInitialZPosition() {
  return Math.random() * 500
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
  let theta = 0
  const group = useRef()
  const { camera, gl } = useThree()
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio)
    gl.alpha = 0
    camera.far = 5000
    camera.fov = 30
    camera.updateProjectionMatrix()
    camera.position.setZ(300)

    setInterval(() => TweenMax
    .to(
      group.current.scale,
      5,
      { 
        x: 0,
        y: 0,
        z: 0,
        yoyo: true,
        repeat: 1,
        ease: Power4.easeIn,
      })
      , 35000)

    TweenMax
      .to(
        camera.position,
        60,
        { 
          z: 1,
          yoyo: true,
          repeat: -1,
          ease: getCustomEase()
        })
  },[])

  useRender(() => {
    theta += 0.01
    theta %= 360
    const r = 5 * Math.sin(THREE.Math.degToRad(theta))
    group.current.rotation.set(0, 0, r)

    group.current.children.forEach(child => {
      const { position, radius, defaultPosition, angle, sphereCostants } = child
      angle.value += 0.002
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
          sizeAttenuation: true,
          transparent: false,
          alphaTest: 0.5,
        })
    )
    const coords = new Array(10000).fill().map(i => [getInitialXPosition(), getInitialYPosition(), getInitialZPosition()])
    return [vertices, coords, spriteMaterial]
  }, [])

  return (
    <group ref={group}>
      {coords.map(([p1, p2, p3], i) => {
        const faceToShow = i % spriteMaterial.length
        return <sprite key={i} radius={10 + 20 * Math.random()} angle={{value: Math.random() * 2 * Math.PI}} material={spriteMaterial[faceToShow]} position={[p1, p2, p3]} defaultPosition={new THREE.Vector3(p1, p2, p3)} sphereCostants={getSphereConstants()} />
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
