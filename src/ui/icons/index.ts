/**
 * @motion/icons — index
 *
 * This file exports the shared types only.
 * Individual icon components are NOT re-exported here to keep the initial
 * bundle lean — they are loaded on demand via the <Icon> component.
 *
 * Usage:
 *   import { Icon } from '@ui/icons/Icon'
 *   <Icon name="arrow-right" size={16} />
 *
 * If you need a direct import (e.g. for a very frequently used icon):
 *   import { ArrowRightIcon } from '@ui/icons/icons/arrow-right'
 */

export type { IconProps, IconComponent } from './types'
export { Icon } from './Icon'
