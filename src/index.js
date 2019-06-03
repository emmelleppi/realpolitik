import ReactDOM from 'react-dom'
import * as THREE from 'three/src/Three'
import React, { useEffect, useRef, useMemo } from 'react'
import { Canvas, useRender, useThree } from 'react-three-fiber'
import { TweenMax, Power4, RoughEase, Circ } from 'gsap'
import './styles.css'

const faces = ['/img/berlusca.png', '/img/renzi.png', '/img/salvini.png', '/img/meloni.png', '/img/dimaio.png']

function getCustomEase() {
  return RoughEase.ease.config({ template:  Circ.easeInOut, strength: 1, points: 20, taper: "both", randomize:  true, clamp: false})
}

function getInitialXPosition() {
  return Math.random() * 60 - 30
}
function getInitialYPosition() {
  return Math.random() * 60 - 30
}
function getInitialZPosition() {
  return Math.random() * 400
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

function getAngleComponents(angle) {
  return [Math.sin(angle), Math.cos(angle)]
}

function Stars() {
  let theta = 0
  const group = useRef()
  const { camera, gl, scene } = useThree()
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio)
    gl.alpha = 0
    camera.far = 1000
    camera.fov = 30
    camera.updateProjectionMatrix()
    camera.position.setZ(350)
    scene.fog = new THREE.Fog(0, 1, 700)
    setInterval(() => TweenMax
    .to(
      group.current.scale,
      3,
      { 
        x: 0,
        y: 0,
        z: 0,
        yoyo: true,
        repeat: 1,
        ease: Power4.easeIn,
      })
      , 63000)

    TweenMax
      .to(
        camera.position,
        300,
        { 
          z: 150,
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

    for (const child of group.current.children) {
      const { position, radius, defaultPosition, angle, sphereCostants } = child
      angle.value += 0.0005
      angle.value %= 360
      const [angleSin, angleCos] = getAngleComponents(angle.value)
      const radAngleSin = radius * angleSin
      const radAngleCos = radius * angleCos
      position.set(
        defaultPosition.x + radAngleSin * sphereCostants[0].x + radAngleCos * sphereCostants[1].x,
        defaultPosition.y + radAngleSin * sphereCostants[0].y + radAngleCos * sphereCostants[1].y,
        defaultPosition.z + radAngleSin * sphereCostants[0].z + radAngleCos * sphereCostants[1].z,
      )
    }
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
    const coords = new Array(7000).fill().map(i => [getInitialXPosition(), getInitialYPosition(), getInitialZPosition()])
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
    <Stars />
  </Canvas>,
  document.getElementById('root')
)
