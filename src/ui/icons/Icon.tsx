/**
 * <Icon> — unified lazy-loading icon wrapper for @motion/icons
 *
 * Uses Vite's import.meta.glob (lazy mode) so each icon file becomes a
 * separate chunk and is only fetched when first rendered.  The initial bundle
 * contains zero SVG data — only this thin dispatcher.
 *
 * Usage:
 *   <Icon name="arrow-right" size={16} />
 *   <Icon name="smartphone" color="#888" />
 *   <Icon name="monitor" size={20} className="toolbar-icon" />
 *
 * Name format: kebab-case filename without the .tsx extension and without the
 * trailing "Icon" suffix — e.g. "arrow-right" (not "ArrowRightIcon").
 *
 * Fallback: while loading (first render only), renders a transparent SVG
 * placeholder of the same dimensions so layout does not shift.
 */

import React, { Suspense } from 'react'
import type { IconProps } from './types'
import styles from './Icon.module.css'

// Vite resolves all matching files at build time and emits one chunk per file.
// The key is the relative path from this file; value is a lazy-import factory.
//
// `import.meta.glob` is a Vite compile-time macro — Vite replaces the CALL
// expression with the actual module map before the browser sees the code.
// The `typeof import.meta.glob` guard used previously failed at runtime because
// `import.meta.glob` is undefined as a standalone ESM property after Vite's
// transform; only the substituted result (the map object) is present.
//
// Fix: use try/catch so that in bun's test runner (where `import.meta.glob`
// is never defined and calling it would throw TypeError) we silently fall back
// to an empty map, while in Vite dev/build the transformed map is assigned.
type IconModuleMap = Record<string, () => Promise<{ [name: string]: React.ComponentType<IconProps> }>>

let iconModules: IconModuleMap = {}
try {
  // Vite transforms this call to the actual map at compile-time.
  // In bun test, import.meta.glob is undefined → TypeError → caught below.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore -- intentional: Vite-only macro, not available in bun
  iconModules = import.meta.glob('./icons/*.tsx') as IconModuleMap
} catch {
  // bun test environment — no glob transform available; icons are not rendered
  // in unit tests so this is safe to swallow.
}

const MissingIcon: React.ComponentType<IconProps> = () => null

// React.lazy components are created at module scope so Icon render stays pure.
const lazyIcons = new Map<string, React.LazyExoticComponent<React.ComponentType<IconProps>>>()

for (const key of Object.keys(iconModules)) {
  const name = key.replace('./icons/', '').replace(/\.tsx$/, '')
  lazyIcons.set(name, createLazyIcon(name, key))
}

function createLazyIcon(
  name: string,
  key: string,
): React.LazyExoticComponent<React.ComponentType<IconProps>> {
  return React.lazy(async () => {
    const mod = await iconModules[key]()
    // Icon component name is PascalCase of kebab-case + "Icon"
    // e.g. "arrow-right" → "ArrowRightIcon"
    const componentName = name
      .split('-')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join('') + 'Icon'
    const Component = mod[componentName] as React.ComponentType<IconProps> | undefined
    if (!Component) {
      console.warn(`[Icon] Could not find export "${componentName}" in "${key}"`)
      return { default: MissingIcon }
    }
    return { default: Component }
  })
}

export interface IconWrapperProps extends IconProps {
  /** Kebab-case icon name — e.g. "arrow-right", "smartphone", "monitor" */
  name: string
  /** Custom fallback shown while the icon chunk loads (default: size×size transparent placeholder) */
  fallback?: React.ReactNode
}

/**
 * Transparent SVG placeholder — same dimensions as the icon, prevents layout
 * shift while the chunk loads (typically < 10ms on subsequent pages).
 */
function Placeholder({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className={styles.placeholder}
    />
  )
}

export function Icon({ name, fallback, size = 24, ...rest }: IconWrapperProps) {
  const LazyIcon = lazyIcons.get(name)

  if (!LazyIcon) {
    // Only warn in Vite (dev/build) where iconModules is populated.
    // In bun test, iconModules is {} so warnings would fire for every render.
    if (import.meta.env.DEV && Object.keys(iconModules).length > 0) {
      console.warn(`[Icon] Unknown icon name: "${name}"`)
    }
    return <Placeholder size={size} />
  }

  return (
    <Suspense fallback={fallback ?? <Placeholder size={size} />}>
      {React.createElement(LazyIcon, { size, ...rest })}
    </Suspense>
  )
}
