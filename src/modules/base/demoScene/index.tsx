/* eslint-disable react-refresh/only-export-components */
/**
 * demo.three-scene - project-dependency backed Three.js module demo.
 */
import React from 'react'
import { defineModule, propField, styleField } from '../../../core/module-engine/defineModule'
import { type ModuleComponentProps } from '../../../core/module-engine/types'
import { registry } from '../../../core/module-engine/registry'
import { importRuntimeDependency } from '../../../core/module-engine/runtimeImports'
import { resolveDependencyUrl } from '../../../core/module-engine/runtimeResolver'
import { getProjectDependencyVersion } from '../../../core/module-engine/dependencies'
import { useEditorStore } from '../../../core/editor-store/store'
import type { ProjectPackageJson } from '../../../core/project-dependencies/manifest'
import { pxBinding, rawBinding } from '../styleBindings'
import styles from './demoScene.module.css'
import { cn } from '../../../ui/cn'

interface DemoSceneProps extends Record<string, unknown> {
  sceneLabel: string
  objectCount: number
  cameraDistance: number
  rotationSpeed: number
  material: 'glass' | 'metal' | 'emissive'
  showGrid: boolean
}

const MODULE_CLASS = 'demo-three-scene'
const THREE_PACKAGE = 'three'
const THREE_VERSION = '^0.184.0'

interface ThreeVector {
  x: number
  y: number
  z: number
  set(x: number, y: number, z: number): void
}

interface ThreeObject {
  position: ThreeVector
  rotation: ThreeVector
}

interface ThreeScene extends ThreeObject {
  add(...objects: ThreeObject[]): void
  remove(object: ThreeObject): void
}

interface ThreeCamera extends ThreeObject {
  aspect: number
  lookAt(x: number, y: number, z: number): void
  updateProjectionMatrix(): void
}

interface ThreeRenderer {
  domElement: HTMLCanvasElement
  outputColorSpace?: unknown
  setPixelRatio(value: number): void
  setClearColor(color: number, alpha: number): void
  setSize(width: number, height: number, updateStyle?: boolean): void
  render(scene: ThreeScene, camera: ThreeCamera): void
  dispose(): void
}

interface ThreeGeometry {
  dispose(): void
}

interface ThreeMaterial {
  dispose(): void
}

interface ThreeMesh extends ThreeObject {
  material: ThreeMaterial
}

interface ThreeGridHelper extends ThreeObject {
  geometry: ThreeGeometry
  material: ThreeMaterial | ThreeMaterial[]
}

interface ThreeClock {
  getElapsedTime(): number
}

interface ThreeModule {
  WebGLRenderer: new (options: { antialias: boolean; alpha: boolean }) => ThreeRenderer
  Scene: new () => ThreeScene
  PerspectiveCamera: new (fov: number, aspect: number, near: number, far: number) => ThreeCamera
  Group: new () => ThreeScene
  AmbientLight: new (color: number, intensity: number) => ThreeObject
  PointLight: new (color: number, intensity: number, distance: number) => ThreeObject
  IcosahedronGeometry: new (radius: number, detail: number) => ThreeGeometry
  MeshStandardMaterial: new (options: Record<string, unknown>) => ThreeMaterial
  MeshPhysicalMaterial: new (options: Record<string, unknown>) => ThreeMaterial
  Mesh: new (geometry: ThreeGeometry, material: ThreeMaterial) => ThreeMesh
  GridHelper: new (
    size: number,
    divisions: number,
    color1: number,
    color2: number,
  ) => ThreeGridHelper
  Clock: new () => ThreeClock
  SRGBColorSpace: unknown
}

interface DemoSceneSettings {
  sceneLabel: string
  objectCount: number
  cameraDistance: number
  rotationSpeed: number
  material: DemoSceneProps['material']
  showGrid: boolean
}

interface ThreeSceneHandle {
  apply(settings: DemoSceneSettings): void
  cleanup(): void
}

interface ThreeRuntimeDependency {
  url: string | null
  version: string | null
}

const THREE_DEPENDENCY = {
  name: THREE_PACKAGE,
  version: THREE_VERSION,
  dev: false,
} as const

function resolveThreeDependency(packageJson: ProjectPackageJson): ThreeRuntimeDependency {
  const version = getProjectDependencyVersion(packageJson, THREE_DEPENDENCY)
  if (!version) return { url: null, version: null }

  return {
    url: resolveDependencyUrl({ ...THREE_DEPENDENCY, version }),
    version,
  }
}

function readSceneSettings(props: DemoSceneProps): DemoSceneSettings {
  return {
    sceneLabel: String(props.sceneLabel || 'Three scene'),
    objectCount: Math.round(clampNumber(props.objectCount, 5, 1, 12)),
    cameraDistance: clampNumber(props.cameraDistance, 8, 1, 16),
    rotationSpeed: clampNumber(props.rotationSpeed, 4, 0, 10),
    material: normalizeMaterial(props.material),
    showGrid: Boolean(props.showGrid),
  }
}

function createEditorMaterial(
  THREE: ThreeModule,
  material: DemoSceneProps['material'],
): ThreeMaterial {
  if (material === 'metal') {
    return new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.24,
    })
  }

  if (material === 'emissive') {
    return new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      emissive: 0x7c3aed,
      emissiveIntensity: 1.25,
      roughness: 0.35,
    })
  }

  return new THREE.MeshPhysicalMaterial({
    color: 0x7dd3fc,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.42,
    thickness: 0.6,
    transparent: true,
    opacity: 0.78,
  })
}

function disposeGrid(grid: ThreeGridHelper): void {
  grid.geometry.dispose()
  if (Array.isArray(grid.material)) {
    for (const material of grid.material) material.dispose()
  } else {
    grid.material.dispose()
  }
}

function createEditorScene(
  viewport: HTMLElement,
  THREE: ThreeModule,
  initial: DemoSceneSettings,
): ThreeSceneHandle {
  let current = initial
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  viewport.replaceChildren(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 1.6, Math.max(2, current.cameraDistance))
  camera.lookAt(0, 0, 0)

  const group = new THREE.Group()
  scene.add(group)

  scene.add(new THREE.AmbientLight(0xffffff, 1.2))
  const keyLight = new THREE.PointLight(0x8b5cf6, 4, 60)
  keyLight.position.set(3.5, 4, 4)
  scene.add(keyLight)
  const rimLight = new THREE.PointLight(0x22d3ee, 2.5, 60)
  rimLight.position.set(-4, 2, -3)
  scene.add(rimLight)

  const geometry = new THREE.IcosahedronGeometry(0.46, 2)
  let material = createEditorMaterial(THREE, current.material)
  let grid: ThreeGridHelper | null = null
  let speed = Math.max(0, current.rotationSpeed) * 0.12 + 0.18
  const meshes: ThreeMesh[] = []
  const radius = 1.75

  function positionMesh(mesh: ThreeMesh, index: number, count: number): void {
    const angle = (index / count) * Math.PI * 2
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.38, Math.sin(angle) * radius)
    mesh.rotation.set(angle * 0.6, angle * 0.35, 0)
  }

  function syncMeshes(count: number): void {
    while (meshes.length > count) {
      const mesh = meshes.pop()
      if (mesh) group.remove(mesh)
    }

    while (meshes.length < count) {
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
      meshes.push(mesh)
    }

    for (let index = 0; index < meshes.length; index += 1) {
      positionMesh(meshes[index], index, count)
    }
  }

  function setMaterial(nextName: DemoSceneProps['material']): void {
    const nextMaterial = createEditorMaterial(THREE, nextName)
    for (const mesh of meshes) {
      mesh.material = nextMaterial
    }
    material.dispose()
    material = nextMaterial
  }

  function setGrid(visible: boolean): void {
    if (visible && !grid) {
      grid = new THREE.GridHelper(7, 14, 0x64748b, 0x334155)
      grid.position.y = -1.18
      scene.add(grid)
    } else if (!visible && grid) {
      scene.remove(grid)
      disposeGrid(grid)
      grid = null
    }
  }

  function resize(): void {
    const rect = viewport.getBoundingClientRect()
    const width = Math.max(1, Math.floor(rect.width))
    const height = Math.max(1, Math.floor(rect.height))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  function apply(settings: DemoSceneSettings): void {
    camera.position.set(0, 1.6, Math.max(2, settings.cameraDistance))
    camera.lookAt(0, 0, 0)
    speed = Math.max(0, settings.rotationSpeed) * 0.12 + 0.18

    if (settings.material !== current.material) {
      setMaterial(settings.material)
    }

    if (settings.objectCount !== current.objectCount) {
      syncMeshes(settings.objectCount)
    }

    setGrid(settings.showGrid)
    current = settings
    resize()
  }

  syncMeshes(current.objectCount)
  setGrid(current.showGrid)
  resize()

  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  observer?.observe(viewport)

  let frameId = 0
  const clock = new THREE.Clock()

  function animate(): void {
    frameId = requestAnimationFrame(animate)
    const elapsed = clock.getElapsedTime()
    group.rotation.y = elapsed * speed
    group.rotation.x = Math.sin(elapsed * 0.4) * 0.16

    for (let index = 0; index < meshes.length; index += 1) {
      meshes[index].rotation.x += 0.008 + index * 0.0004
      meshes[index].rotation.y += 0.01
    }

    renderer.render(scene, camera)
  }

  animate()

  return {
    apply,
    cleanup() {
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      if (grid) disposeGrid(grid)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      viewport.replaceChildren()
    },
  }
}

const THREE_RUNTIME_COMPONENT = String.raw`
type DemoThreeSceneRuntimeProps = {
  sceneLabel: string
  objectCount: number
  cameraDistance: number
  rotationSpeed: number
  material: 'glass' | 'metal' | 'emissive'
  showGrid: boolean
}

function DemoThreeSceneRuntime({
  sceneLabel,
  objectCount,
  cameraDistance,
  rotationSpeed,
  material,
  showGrid,
}: DemoThreeSceneRuntimeProps) {
  const mountRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const count = Math.max(1, Math.min(12, Math.round(objectCount || 1)))
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 1.6, Math.max(2, cameraDistance))
    camera.lookAt(0, 0, 0)

    const group = new THREE.Group()
    scene.add(group)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const keyLight = new THREE.PointLight(0x8b5cf6, 4, 60)
    keyLight.position.set(3.5, 4, 4)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0x22d3ee, 2.5, 60)
    rimLight.position.set(-4, 2, -3)
    scene.add(rimLight)

    const geometry = new THREE.IcosahedronGeometry(0.46, 2)
    const materialPreset =
      material === 'metal'
        ? new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.24 })
        : material === 'emissive'
          ? new THREE.MeshStandardMaterial({ color: 0xfb7185, emissive: 0x7c3aed, emissiveIntensity: 1.25, roughness: 0.35 })
          : new THREE.MeshPhysicalMaterial({ color: 0x7dd3fc, metalness: 0.05, roughness: 0.08, transmission: 0.42, thickness: 0.6, transparent: true, opacity: 0.78 })

    const meshes: THREE.Mesh[] = []
    const radius = 1.75
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2
      const mesh = new THREE.Mesh(geometry, materialPreset)
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.38, Math.sin(angle) * radius)
      mesh.rotation.set(angle * 0.6, angle * 0.35, 0)
      group.add(mesh)
      meshes.push(mesh)
    }

    const grid = showGrid ? new THREE.GridHelper(7, 14, 0x64748b, 0x334155) : null
    if (grid) {
      grid.position.y = -1.18
      scene.add(grid)
    }

    mount.innerHTML = ''
    mount.appendChild(renderer.domElement)

    const resize = () => {
      const rect = mount.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    let frameId = 0
    const clock = new THREE.Clock()
    const speed = Math.max(0, rotationSpeed) * 0.12 + 0.18
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      group.rotation.y = elapsed * speed
      group.rotation.x = Math.sin(elapsed * 0.4) * 0.16
      for (const [index, mesh] of meshes.entries()) {
        mesh.rotation.x += 0.008 + index * 0.0004
        mesh.rotation.y += 0.01
      }
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      geometry.dispose()
      materialPreset.dispose()
      renderer.dispose()
      mount.innerHTML = ''
    }
  }, [objectCount, cameraDistance, rotationSpeed, material, showGrid])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 360,
        overflow: 'hidden',
        borderRadius: 14,
        background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #020617 65%)',
        color: '#f8fafc',
      }}
    >
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      <span
        style={{
          position: 'absolute',
          left: 16,
          top: 14,
          zIndex: 1,
          color: 'rgba(248, 250, 252, 0.72)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {sceneLabel}
      </span>
    </div>
  )
}
`.trim()

function objectIndexes(count: number): number[] {
  const total = Math.max(1, Math.min(12, Math.round(Number(count) || 1)))
  return Array.from({ length: total }, (_, index) => index)
}

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value)
  const number = Number.isFinite(parsed) ? parsed : fallback
  return Math.max(min, Math.min(max, number))
}

function normalizeMaterial(value: unknown): DemoSceneProps['material'] {
  return value === 'metal' || value === 'emissive' ? value : 'glass'
}

const DemoSceneEditor: React.FC<ModuleComponentProps<DemoSceneProps>> = ({ props, mcClassName }) => {
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const runtimeRef = React.useRef<ThreeSceneHandle | null>(null)
  const packageJson = useEditorStore((s) => s.packageJson)
  const setDependency = useEditorStore((s) => s.setDependency)
  const settings = React.useMemo(() => readSceneSettings(props), [props])
  const latestSettingsRef = React.useRef(settings)
  const threeDependency = React.useMemo(() => resolveThreeDependency(packageJson), [packageJson])
  const threeUrl = threeDependency.url

  const restoreThreeDependency = React.useCallback(() => {
    setDependency(THREE_PACKAGE, THREE_VERSION, false)
  }, [setDependency])

  const handleRestoreDependency = React.useCallback((
    event: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    restoreThreeDependency()
  }, [restoreThreeDependency])

  React.useEffect(() => {
    latestSettingsRef.current = settings
    runtimeRef.current?.apply(settings)
  }, [settings])

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let cancelled = false
    runtimeRef.current?.cleanup()
    runtimeRef.current = null
    viewport.textContent = ''

    if (!threeUrl) {
      viewport.dataset.runtimeState = 'missing'
      return
    }

    viewport.dataset.runtimeState = 'loading'

    importRuntimeDependency<ThreeModule>(threeUrl)
      .then((THREE) => {
        if (cancelled) return
        viewport.dataset.runtimeState = 'ready'
        const runtime = createEditorScene(viewport, THREE, latestSettingsRef.current)
        runtimeRef.current = runtime
      })
      .catch((error: unknown) => {
        if (cancelled) return
        viewport.dataset.runtimeState = 'error'
        viewport.textContent = error instanceof Error ? error.message : String(error)
      })

    return () => {
      cancelled = true
      runtimeRef.current?.cleanup()
      runtimeRef.current = null
    }
  }, [threeUrl])

  return (
    <div className={cn(styles.scene, mcClassName)}>
      <div ref={viewportRef} className={styles.webglViewport} aria-hidden="true" />
      {!threeUrl && (
        <div className={styles.dependencyNotice} role="status">
          <div className={styles.dependencyTitle}>Missing dependency: {THREE_PACKAGE}</div>
          <div className={styles.dependencyText}>
            Add {THREE_PACKAGE} to project dependencies to render this scene.
          </div>
          <button
            type="button"
            data-canvas-interactive="true"
            className={styles.dependencyButton}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={handleRestoreDependency}
            onClick={handleRestoreDependency}
          >
            Restore dependency
          </button>
        </div>
      )}
      <span className={styles.label}>{settings.sceneLabel}</span>
    </div>
  )
}

export const DemoSceneModule = defineModule<DemoSceneProps>({
  id: 'demo.three-scene',
  name: 'Demo Three Scene',
  description: 'A real Three.js React-export module with project-level dependencies.',
  category: 'Demo',
  version: '1.0.0',
  icon: 'Box',
  trusted: true,
  canHaveChildren: false,
  dependencies: {
    three: '^0.184.0',
  },

  fields: {
    sceneLabel: propField({ type: 'text', label: 'Scene label', placeholder: 'Product scene' }),
    objectCount: propField({ type: 'slider', label: 'Objects', min: 1, max: 12, step: 1 }),
    cameraDistance: propField({ type: 'slider', label: 'Camera distance', min: 1, max: 16, step: 1 }),
    rotationSpeed: propField({ type: 'slider', label: 'Rotation speed', min: 0, max: 10, step: 1 }),
    material: propField({
      type: 'select',
      label: 'Material',
      options: [
        { label: 'Glass', value: 'glass' },
        { label: 'Metal', value: 'metal' },
        { label: 'Emissive', value: 'emissive' },
      ],
    }),
    showGrid: propField({ type: 'toggle', label: 'Show grid' }),

    height: styleField(pxBinding('height', { type: 'slider', label: 'Frame height', min: 180, max: 720, step: 10, unit: 'px' }, 360)),
    backgroundColor: styleField(rawBinding('backgroundColor', { type: 'color', label: 'Frame background' }, '#070a12')),
    borderRadius: styleField(pxBinding('borderRadius', { type: 'slider', label: 'Frame radius', min: 0, max: 48, step: 1, unit: 'px' }, 14)),
  },

  defaults: {
    sceneLabel: 'Three-style scene',
    objectCount: 5,
    cameraDistance: 8,
    rotationSpeed: 4,
    material: 'glass',
    showGrid: true,
  },

  component: DemoSceneEditor,

  reactExport: {
    imports: [`import * as THREE from 'three'`],
    declarations: [THREE_RUNTIME_COMPONENT],
  },

  render: (props) => {
    const material = props.material === 'metal' || props.material === 'emissive' ? props.material : 'glass'
    const speed = Number(props.rotationSpeed) >= 7 ? 'fast' : Number(props.rotationSpeed) >= 4 ? 'medium' : 'slow'
    const distance = Number(props.cameraDistance) <= 5 ? 'near' : Number(props.cameraDistance) >= 13 ? 'far' : 'mid'
    const objects = objectIndexes(props.objectCount)
      .map((index) => `<span class="${MODULE_CLASS}__node ${MODULE_CLASS}__node--${material} ${MODULE_CLASS}__node--pos-${index}" aria-hidden="true"></span>`)
      .join('')
    const grid = props.showGrid ? `<div class="${MODULE_CLASS}__grid" aria-hidden="true"></div>` : ''

    return {
      html: `<div class="${MODULE_CLASS}"><span class="${MODULE_CLASS}__label">${String(props.sceneLabel)}</span>${grid}<div class="${MODULE_CLASS}__viewport"><div class="${MODULE_CLASS}__orbit ${MODULE_CLASS}__orbit--${speed} ${MODULE_CLASS}__orbit--${distance}">${objects}</div></div></div>`,
      css: `.${MODULE_CLASS}{position:relative;width:100%;height:360px;overflow:hidden;border-radius:14px;background-color:#070a12;color:#f8fafc;perspective:900px}.${MODULE_CLASS}__viewport{position:absolute;inset:0;display:grid;place-items:center;transform-style:preserve-3d}.${MODULE_CLASS}__grid{position:absolute;inset:auto 8% 8% 8%;height:38%;border:1px solid rgba(148,163,184,.24);background-image:linear-gradient(rgba(148,163,184,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.2) 1px,transparent 1px);background-size:28px 28px;transform:rotateX(68deg);transform-origin:bottom center}.${MODULE_CLASS}__label{position:absolute;left:16px;top:14px;z-index:2;color:rgba(248,250,252,.72);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.${MODULE_CLASS}__orbit{position:relative;width:190px;height:190px;transform-style:preserve-3d;animation-name:${MODULE_CLASS}-orbit;animation-timing-function:linear;animation-iteration-count:infinite}.${MODULE_CLASS}__orbit--slow{animation-duration:18s}.${MODULE_CLASS}__orbit--medium{animation-duration:10s}.${MODULE_CLASS}__orbit--fast{animation-duration:5s}.${MODULE_CLASS}__orbit--near{transform:translateZ(80px) rotateX(62deg)}.${MODULE_CLASS}__orbit--mid{transform:translateZ(0) rotateX(62deg)}.${MODULE_CLASS}__orbit--far{transform:translateZ(-120px) rotateX(62deg)}.${MODULE_CLASS}__node{position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px;border-radius:50%;box-shadow:0 0 28px rgba(129,140,248,.44)}.${MODULE_CLASS}__node--pos-0{transform:rotateZ(0deg) translateX(96px) rotateZ(0deg)}.${MODULE_CLASS}__node--pos-1{transform:rotateZ(30deg) translateX(96px) rotateZ(-30deg)}.${MODULE_CLASS}__node--pos-2{transform:rotateZ(60deg) translateX(96px) rotateZ(-60deg)}.${MODULE_CLASS}__node--pos-3{transform:rotateZ(90deg) translateX(96px) rotateZ(-90deg)}.${MODULE_CLASS}__node--pos-4{transform:rotateZ(120deg) translateX(96px) rotateZ(-120deg)}.${MODULE_CLASS}__node--pos-5{transform:rotateZ(150deg) translateX(96px) rotateZ(-150deg)}.${MODULE_CLASS}__node--pos-6{transform:rotateZ(180deg) translateX(96px) rotateZ(-180deg)}.${MODULE_CLASS}__node--pos-7{transform:rotateZ(210deg) translateX(96px) rotateZ(-210deg)}.${MODULE_CLASS}__node--pos-8{transform:rotateZ(240deg) translateX(96px) rotateZ(-240deg)}.${MODULE_CLASS}__node--pos-9{transform:rotateZ(270deg) translateX(96px) rotateZ(-270deg)}.${MODULE_CLASS}__node--pos-10{transform:rotateZ(300deg) translateX(96px) rotateZ(-300deg)}.${MODULE_CLASS}__node--pos-11{transform:rotateZ(330deg) translateX(96px) rotateZ(-330deg)}.${MODULE_CLASS}__node--glass{background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.92),rgba(125,211,252,.58) 24%,rgba(99,102,241,.24) 72%),rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.4)}.${MODULE_CLASS}__node--metal{background:radial-gradient(circle at 32% 24%,#f8fafc,#94a3b8 34%,#334155 74%),#64748b}.${MODULE_CLASS}__node--emissive{background:radial-gradient(circle at 28% 22%,#fff7ed,#fb7185 32%,#7c3aed 78%),#fb7185;box-shadow:0 0 34px rgba(251,113,133,.78)}@keyframes ${MODULE_CLASS}-orbit{from{transform:rotateZ(0) rotateX(62deg)}to{transform:rotateZ(360deg) rotateX(62deg)}}`,
    }
  },

  toJsx: (props) => {
    const label = String(props.sceneLabel ?? 'Three scene')
    const objectCount = Math.round(clampNumber(props.objectCount, 5, 1, 12))
    const cameraDistance = clampNumber(props.cameraDistance, 8, 1, 16)
    const rotationSpeed = clampNumber(props.rotationSpeed, 4, 0, 10)
    const material = normalizeMaterial(props.material)
    const showGrid = Boolean(props.showGrid)

    return [
      `<DemoThreeSceneRuntime`,
      `  sceneLabel={${JSON.stringify(label)}}`,
      `  objectCount={${objectCount}}`,
      `  cameraDistance={${cameraDistance}}`,
      `  rotationSpeed={${rotationSpeed}}`,
      `  material="${material}"`,
      `  showGrid={${showGrid}}`,
      `/>`,
    ].join('\n')
  },
})

registry.register(DemoSceneModule)
