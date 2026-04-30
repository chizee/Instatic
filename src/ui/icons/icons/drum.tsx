import React from 'react';
import type { IconProps } from '../types';

export function DrumIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="3" width="8" height="2" fill={color}/>
      <rect x="8" y="13" width="8" height="2" fill={color}/>
      <rect x="8" y="19" width="8" height="2" fill={color}/>
      <rect x="4" y="11" width="4" height="2" fill={color}/>
      <rect x="4" y="17" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 20 11)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 20 17)" fill={color}/>
      <rect x="2" y="7" width="2" height="4" fill={color}/>
      <rect x="2" y="11" width="2" height="6" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 22 7)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 22 11)" fill={color}/>
      <rect x="6" y="5" width="2" height="2" fill={color}/>
      <rect x="4" y="3" width="2" height="2" fill={color}/>
      <rect x="2" y="1" width="2" height="2" fill={color}/>
      <rect x="8" y="7" width="2" height="2" fill={color}/>
      <rect x="12" y="9" width="2" height="2" fill={color}/>
      <rect x="14" y="7" width="2" height="2" fill={color}/>
      <rect x="16" y="5" width="2" height="2" fill={color}/>
      <rect x="18" y="3" width="2" height="2" fill={color}/>
    </svg>
  );
}
