import React from 'react';
import type { IconProps } from '../types';

export function Settings2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect x="4" y="14" width="2" height="6" fill={color}/>
      <rect x="10" y="14" width="2" height="6" fill={color}/>
      <rect x="6" y="12" width="4" height="2" fill={color}/>
      <rect x="6" y="20" width="4" height="2" fill={color}/>
      <rect x="2" y="16" width="2" height="2" fill={color}/>
      <rect x="22" y="8" width="4" height="2" transform="rotate(180 22 8)" fill={color}/>
      <rect x="10" y="16" width="12" height="2" fill={color}/>
      <rect x="14" y="8" width="12" height="2" transform="rotate(180 14 8)" fill={color}/>
      <rect x="20" y="4" width="2" height="2" transform="rotate(90 20 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-6.55671e-08 -1 -1 2.91409e-08 20 10)" fill={color}/>
      <rect x="14" y="2" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 14 12)" fill={color}/>
      <rect x="12" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 12 10)" fill={color}/>
    </svg>
  );
}
