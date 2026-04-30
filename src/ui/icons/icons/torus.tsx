import React from 'react';
import type { IconProps } from '../types';

export function TorusIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="10" width="2" height="4" fill={color}/>
      <rect x="21" y="10" width="2" height="4" fill={color}/>
      <rect x="5" y="6" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 5 18)" fill={color}/>
      <rect x="15" y="6" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 18)" fill={color}/>
      <rect x="9" y="4" width="6" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 9 20)" fill={color}/>
      <rect x="3" y="8" width="2" height="2" fill={color}/>
      <rect x="3" y="14" width="2" height="2" fill={color}/>
      <rect x="19" y="8" width="2" height="2" fill={color}/>
      <rect x="19" y="14" width="2" height="2" fill={color}/>
      <rect x="10" y="8" width="4" height="2" fill={color}/>
      <rect x="8" y="10" width="2" height="2" fill={color}/>
      <rect x="14" y="10" width="2" height="2" fill={color}/>
      <rect x="10" y="12" width="4" height="2" fill={color}/>
    </svg>
  );
}
