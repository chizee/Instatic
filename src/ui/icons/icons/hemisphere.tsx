import React from 'react';
import type { IconProps } from '../types';

export function HemisphereIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="2" y="8" width="2" height="2" fill={color}/>
      <rect x="20" y="8" width="2" height="2" fill={color}/>
      <rect x="4" y="10" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 4 8)" fill={color}/>
      <rect x="16" y="10" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 16 8)" fill={color}/>
      <rect x="8" y="12" width="8" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 6)" fill={color}/>
      <rect x="2" y="10" width="2" height="4" fill={color}/>
      <rect x="20" y="10" width="2" height="4" fill={color}/>
      <rect x="4" y="14" width="2" height="2" fill={color}/>
      <rect x="6" y="16" width="2" height="2" fill={color}/>
      <rect x="16" y="16" width="2" height="2" fill={color}/>
      <rect x="18" y="14" width="2" height="2" fill={color}/>
      <rect x="8" y="18" width="8" height="2" fill={color}/>
    </svg>
  );
}
