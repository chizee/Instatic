import React from 'react';
import type { IconProps } from '../types';

export function HiddenIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect y="10" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 24 10)" fill={color}/>
      <rect x="2" y="8" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 22 8)" fill={color}/>
      <rect x="22" y="16" width="2" height="2" transform="rotate(180 22 16)" fill={color}/>
      <rect x="4" y="6" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 4 18)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 20 6)" fill={color}/>
      <rect x="20" y="18" width="4" height="2" transform="rotate(180 20 18)" fill={color}/>
      <rect x="8" y="4" width="8" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 20)" fill={color}/>
      <rect x="11" y="11" width="2" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
      <rect x="9" y="13" width="2" height="2" fill={color}/>
      <rect x="13" y="9" width="2" height="2" fill={color}/>
      <rect x="13" y="13" width="2" height="2" fill={color}/>
    </svg>
  );
}
