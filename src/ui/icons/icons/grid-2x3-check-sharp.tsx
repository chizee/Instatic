import React from 'react';
import type { IconProps } from '../types';

export function Grid2x3CheckSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="20" height="2" fill={color}/>
      <rect x="2" y="20" width="10" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="10" fill={color}/>
      <rect x="13" y="4" width="18" height="2" transform="rotate(90 13 4)" fill={color}/>
      <rect x="20" y="8" width="2" height="16" transform="rotate(90 20 8)" fill={color}/>
      <rect x="18" y="14" width="2" height="14" transform="rotate(90 18 14)" fill={color}/>
      <rect x="15" y="18" width="2" height="2" fill={color}/>
      <rect x="17" y="20" width="2" height="2" fill={color}/>
      <rect x="19" y="18" width="2" height="2" fill={color}/>
      <rect x="21" y="16" width="2" height="2" fill={color}/>
    </svg>
  );
}
