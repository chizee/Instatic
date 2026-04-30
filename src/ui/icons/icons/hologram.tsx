import React from 'react';
import type { IconProps } from '../types';

export function HologramIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="11" y="15" width="2" height="4" fill={color}/>
      <rect x="7" y="15" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 17 15)" fill={color}/>
      <rect x="5" y="17" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 19 17)" fill={color}/>
      <rect x="11" y="5" width="2" height="8" fill={color}/>
      <rect x="9" y="11" width="2" height="2" fill={color}/>
      <rect x="9" y="5" width="2" height="2" fill={color}/>
      <rect x="13" y="11" width="2" height="2" fill={color}/>
      <rect x="13" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="9" width="4" height="2" fill={color}/>
      <rect x="15" y="3" width="4" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 9 3)" fill={color}/>
      <rect x="5" y="9" width="4" height="2" fill={color}/>
      <rect x="5" y="3" width="4" height="2" fill={color}/>
      <rect x="5" y="5" width="2" height="4" fill={color}/>
      <rect x="17" y="5" width="2" height="4" fill={color}/>
      <rect x="2" y="21" width="20" height="2" fill={color}/>
    </svg>
  );
}
