import React from 'react';
import type { IconProps } from '../types';

export function FileBigUpsertSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="2" transform="matrix(-1 0 0 1 4 10)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 4 4)" fill={color}/>
      <rect width="16" height="2" transform="matrix(-1 0 0 1 18 2)" fill={color}/>
      <rect width="2" height="14" transform="matrix(-1 0 0 1 22 6)" fill={color}/>
      <rect width="7" height="2" transform="matrix(-1 0 0 1 22 20)" fill={color}/>
      <rect x="18" y="4" width="2" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="6" fill={color}/>
      <rect x="14" y="8" width="6" height="2" fill={color}/>
      <rect x="7" y="14" width="10" height="2" fill={color}/>
      <rect x="9" y="12" width="6" height="2" fill={color}/>
      <rect x="11" y="10" width="2" height="2" fill={color}/>
      <rect x="11" y="16" width="2" height="4" fill={color}/>
      <rect x="2" y="20" width="11" height="2" fill={color}/>
      <rect x="2" y="18" width="2" height="2" fill={color}/>
      <rect x="2" y="14" width="2" height="2" fill={color}/>
    </svg>
  );
}
